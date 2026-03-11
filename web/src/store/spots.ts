import { create } from "zustand";
import type { Pin } from "./pins";
import { getClusteredSpots, type SpotMarkerData, SPOT_CLUSTER_ZOOM } from "@/lib/clustering";

export type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: string;
  _count?: { pins: number };
};

type SpotsStore = {
  // Admin
  isAdmin: boolean;
  adminCode: string;
  setAdmin: (on: boolean, code?: string) => void;

  // Spots on the map
  spots: Spot[];
  clusterZoomThreshold: number;
  getMarkerData: (zoom: number) => SpotMarkerData[];
  setSpots: (spots: Spot[]) => void;
  addSpot: (spot: Spot) => void;
  removeSpot: (id: string) => void;

  // Spot drop mode (admin placing a spot)
  spotDropMode: boolean;
  setSpotDropMode: (on: boolean) => void;
  pendingSpotCoords: { lat: number; lng: number } | null;
  spotComposeOpen: boolean;
  openSpotCompose: (coords: { lat: number; lng: number }) => void;
  closeSpotCompose: () => void;

  // Fullscreen spot view
  selectedSpot: Spot | null;
  spotPins: Pin[];
  selectSpot: (spot: Spot | null) => void;
  setSpotPins: (pins: Pin[]) => void;
  addSpotPin: (pin: Pin) => void;
};

export const useSpotsStore = create<SpotsStore>((set, get) => ({
  isAdmin: false,
  adminCode: "",
  setAdmin: (isAdmin, code) => set({ isAdmin, ...(code !== undefined ? { adminCode: code } : {}) }),

  spots: [],
  clusterZoomThreshold: SPOT_CLUSTER_ZOOM,
  getMarkerData: (zoom) => getClusteredSpots(get().spots, zoom),
  setSpots: (spots) => set({ spots }),
  addSpot: (spot) => set((s) => ({ spots: [spot, ...s.spots] })),
  removeSpot: (id) => set((s) => ({ spots: s.spots.filter((sp) => sp.id !== id) })),

  spotDropMode: false,
  setSpotDropMode: (spotDropMode) => set({ spotDropMode }),
  pendingSpotCoords: null,
  spotComposeOpen: false,
  openSpotCompose: (coords) =>
    set({ pendingSpotCoords: coords, spotComposeOpen: true, spotDropMode: false }),
  closeSpotCompose: () => set({ spotComposeOpen: false, pendingSpotCoords: null }),

  selectedSpot: null,
  spotPins: [],
  selectSpot: (spot) => set({ selectedSpot: spot, spotPins: [] }),
  setSpotPins: (spotPins) => set({ spotPins }),
  addSpotPin: (pin) => set((s) => ({ spotPins: [pin, ...s.spotPins] })),
}));
