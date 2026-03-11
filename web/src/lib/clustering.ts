import Supercluster from "supercluster";
import { Pin } from "@/store/pins";
import { Spot } from "@/store/spots";

export const PIN_CLUSTER_ZOOM = 13;
export const SPOT_CLUSTER_ZOOM = 12;

// Category to color mapping
const CATEGORY_COLORS: Record<string, string> = {
  funny: "#fbbf24",
  mystery: "#a78bfa",
  danger: "#f87171",
  legend: "#60a5fa",
  wholesome: "#34d399",
  other: "#9ca3af",
};

export interface ClusteredPin {
  id: string;
  lat: number;
  lng: number;
  isCluster: false;
  pin: Pin;
}

export interface PinCluster {
  id: string;
  lat: number;
  lng: number;
  isCluster: true;
  count: number;
  pins: Pin[];
  avgColor: string;
}

export type PinMarkerData = ClusteredPin | PinCluster;

export interface ClusteredSpot {
  id: string;
  lat: number;
  lng: number;
  isCluster: false;
  spot: Spot;
}

export interface SpotCluster {
  id: string;
  lat: number;
  lng: number;
  isCluster: true;
  count: number;
  spots: Spot[];
  avgColor: string;
}

export type SpotMarkerData = ClusteredSpot | SpotCluster;

// Helper: Average color from pin categories
function avgColorFromPins(pins: Pin[]): string {
  if (pins.length === 0) return CATEGORY_COLORS.other;

  // Count colors and return the most common one
  const colorCounts = new Map<string, number>();

  for (const pin of pins) {
    const color = CATEGORY_COLORS[pin.category] ?? CATEGORY_COLORS.other;
    colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1);
  }

  let maxCount = 0;
  let dominantColor = CATEGORY_COLORS.other;

  for (const [color, count] of colorCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  }

  return dominantColor;
}

// Helper: Average color from spot types
function avgColorFromSpots(_spots: Spot[]): string {
  return "#64748b";
}

// Create Supercluster instance for pins
function createPinCluster(): Supercluster<{ pin: Pin; index: number }> {
  return new Supercluster({
    radius: 40,
    maxZoom: PIN_CLUSTER_ZOOM - 1,
    minZoom: 0,
  });
}

// Create Supercluster instance for spots
function createSpotCluster(): Supercluster<{ spot: Spot; index: number }> {
  return new Supercluster({
    radius: 50,
    maxZoom: SPOT_CLUSTER_ZOOM - 1,
    minZoom: 0,
  });
}

// Main clustering function for pins
export function getClusteredPins(pins: Pin[], zoom: number): PinMarkerData[] {
  if (zoom >= PIN_CLUSTER_ZOOM) {
    // At high zoom levels, don't cluster
    return pins.map((pin) => ({
      id: pin.id,
      lat: pin.lat,
      lng: pin.lng,
      isCluster: false,
      pin,
    }));
  }

  const cluster = createPinCluster();

  // Convert pins to Supercluster point format
  const points = pins.map((pin, idx) => ({
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: [pin.lng, pin.lat] },
    properties: { pin, index: idx },
  }));

  cluster.load(points);

  // Get clusters and unclustered points
  const clusterData = cluster.getClusters([-180, -90, 180, 90], zoom);
  type PinFeature = (typeof clusterData)[number];

  return clusterData.map((feature: PinFeature) => {
    if (feature.properties?.cluster) {
      // This is a cluster
      const clusterPins: Pin[] = (
        cluster.getLeaves(feature.id as number) as Array<{ properties: { pin: Pin } }>
      ).map((leaf) => leaf.properties.pin);

      return {
        id: `cluster-${feature.id}`,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        isCluster: true as const,
        count: feature.properties.point_count,
        pins: clusterPins,
        avgColor: avgColorFromPins(clusterPins),
      };
    } else {
      // This is an individual pin
      const pin = (feature.properties as { pin: Pin }).pin;
      return {
        id: pin.id,
        lat: pin.lat,
        lng: pin.lng,
        isCluster: false as const,
        pin,
      };
    }
  });
}

// Main clustering function for spots
export function getClusteredSpots(spots: Spot[], zoom: number): SpotMarkerData[] {
  if (zoom >= SPOT_CLUSTER_ZOOM) {
    // At high zoom levels, don't cluster
    return spots.map((spot) => ({
      id: spot.id,
      lat: spot.lat,
      lng: spot.lng,
      isCluster: false,
      spot,
    }));
  }

  const cluster = createSpotCluster();

  // Convert spots to Supercluster point format
  const points = spots.map((spot, idx) => ({
    type: "Feature" as const,
    geometry: { type: "Point" as const, coordinates: [spot.lng, spot.lat] },
    properties: { spot, index: idx },
  }));

  cluster.load(points);

  // Get clusters and unclustered points
  const clusterData = cluster.getClusters([-180, -90, 180, 90], zoom);
  type SpotFeature = (typeof clusterData)[number];

  return clusterData.map((feature: SpotFeature) => {
    if (feature.properties?.cluster) {
      // This is a cluster
      const clusterSpots: Spot[] = (
        cluster.getLeaves(feature.id as number) as Array<{ properties: { spot: Spot } }>
      ).map((leaf) => leaf.properties.spot);

      return {
        id: `cluster-${feature.id}`,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        isCluster: true as const,
        count: feature.properties.point_count,
        spots: clusterSpots,
        avgColor: avgColorFromSpots(clusterSpots),
      };
    } else {
      // This is an individual spot
      const spot = (feature.properties as { spot: Spot }).spot;
      return {
        id: spot.id,
        lat: spot.lat,
        lng: spot.lng,
        isCluster: false as const,
        spot,
      };
    }
  });
}
