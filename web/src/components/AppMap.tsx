"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePinsStore, Pin } from "@/store/pins";
import { useSpotsStore, Spot } from "@/store/spots";
import { useViewportStore } from "@/store/viewport";

const CATEGORY_COLORS: Record<string, string> = {
  funny: "#fbbf24",
  mystery: "#a78bfa",
  danger: "#f87171",
  legend: "#60a5fa",
  wholesome: "#34d399",
  other: "#9ca3af",
};

function makePinIcon(color: string): L.DivIcon {
  const filterId = `f${color.replace("#", "")}`;
  const svg = `<svg viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="0.65"/>
      </filter>
    </defs>
    <path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 13.5 21.75 14.25 22.31.22.19.53.19.75.19s.53 0 .75-.19C16.5 36.75 30 26.25 30 15 30 6.72 23.28 0 15 0z"
      fill="${color}" filter="url(#${filterId})"/>
    <circle cx="15" cy="15" r="6.5" fill="white" opacity="0.92"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [30, 38],
    iconAnchor: [15, 38],
  });
}

const SPOT_SVGS: Record<string, string> = {
  school: `<svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="spot-shadow-school" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#a78bfa" flood-opacity="0.7"/>
      </filter>
    </defs>
    <rect x="4" y="6" width="32" height="28" rx="4" fill="#7c3aed" filter="url(#spot-shadow-school)"/>
    <rect x="4" y="6" width="32" height="28" rx="4" stroke="#a78bfa" stroke-width="1.5" fill="none"/>
    <rect x="10" y="12" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
    <rect x="24" y="12" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
    <rect x="16" y="22" width="8" height="12" rx="1" fill="#fbbf24" opacity="0.9"/>
    <polygon points="2,10 20,0 38,10" fill="#8b5cf6"/>
    <polygon points="2,10 20,0 38,10" stroke="#a78bfa" stroke-width="1" fill="none"/>
  </svg>`,
  park: `<svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="spot-shadow-park" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#4ade80" flood-opacity="0.6"/>
      </filter>
    </defs>
    <ellipse cx="20" cy="16" rx="14" ry="13" fill="#16a34a" filter="url(#spot-shadow-park)"/>
    <ellipse cx="20" cy="16" rx="14" ry="13" stroke="#4ade80" stroke-width="1.5" fill="none"/>
    <ellipse cx="13" cy="18" rx="8" ry="7" fill="#15803d" opacity="0.7"/>
    <ellipse cx="27" cy="18" rx="8" ry="7" fill="#15803d" opacity="0.7"/>
    <rect x="17" y="28" width="6" height="10" rx="2" fill="#92400e"/>
    <rect x="17" y="28" width="6" height="10" rx="2" stroke="#a16207" stroke-width="1" fill="none"/>
  </svg>`,
};

function makeSpotIcon(type: string, hasPins: boolean = false): L.DivIcon {
  const svg = SPOT_SVGS[type] ?? SPOT_SVGS.school;
  const dot = hasPins
    ? `<div style="position:absolute;top:-3px;right:-3px;width:11px;height:11px;background:#f87171;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(248,113,113,0.7)"></div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;display:inline-block;width:40px;height:44px">${svg}${dot}</div>`,
    className: "",
    iconSize: [40, 44],
    iconAnchor: [20, 44],
  });
}

// Fetches pins from the API whenever the map viewport changes
function PinFetcher() {
  const map = useMap();
  const fetchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function fetchPins() {
      const bounds = map.getBounds();
      const params = new URLSearchParams({
        swLat: String(bounds.getSouth()),
        swLng: String(bounds.getWest()),
        neLat: String(bounds.getNorth()),
        neLng: String(bounds.getEast()),
      });
      fetch(`/api/pins?${params}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((pins) => usePinsStore.getState().setPins(pins))
        .catch(() => {});
    }

    // Fetch on initial load
    map.whenReady(fetchPins);

    // Debounced fetch on pan/zoom
    function onMoveEnd() {
      clearTimeout(fetchRef.current);
      fetchRef.current = setTimeout(fetchPins, 300);
    }
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      clearTimeout(fetchRef.current);
    };
  }, [map]);

  return null;
}

// Fetches spots from the API whenever the map viewport changes
function SpotFetcher() {
  const map = useMap();
  const fetchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function fetchSpots() {
      const bounds = map.getBounds();
      const params = new URLSearchParams({
        swLat: String(bounds.getSouth()),
        swLng: String(bounds.getWest()),
        neLat: String(bounds.getNorth()),
        neLng: String(bounds.getEast()),
      });
      fetch(`/api/spots?${params}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((spots) => useSpotsStore.getState().setSpots(spots))
        .catch(() => {});
    }

    map.whenReady(fetchSpots);

    function onMoveEnd() {
      clearTimeout(fetchRef.current);
      fetchRef.current = setTimeout(fetchSpots, 300);
    }
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      clearTimeout(fetchRef.current);
    };
  }, [map]);

  return null;
}

// Handles map clicks in drop mode — reads store directly to avoid stale closures
function MapClickHandler() {
  useMapEvents({
    click(e) {
      const { dropMode, openCompose } = usePinsStore.getState();
      const { spotDropMode, openSpotCompose } = useSpotsStore.getState();
      if (spotDropMode) {
        openSpotCompose({ lat: e.latlng.lat, lng: e.latlng.lng });
      } else if (dropMode) {
        openCompose({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

// Crosshair cursor when drop mode is active
function CursorEffect() {
  const map = useMap();
  const { dropMode } = usePinsStore();
  const { spotDropMode } = useSpotsStore();
  useEffect(() => {
    map.getContainer().style.cursor = dropMode || spotDropMode ? "crosshair" : "";
  }, [map, dropMode, spotDropMode]);
  return null;
}

// Renders pin markers and handles clicks
function MarkerLayer({ onPinClick }: { onPinClick: (pin: Pin) => void }) {
  const map = useMap();
  const { pins } = usePinsStore();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onPinClickRef = useRef(onPinClick);
  onPinClickRef.current = onPinClick;

  useEffect(() => {
    const currentIds = new Set(pins.map((p) => p.id));

    // Remove stale markers
    for (const [id, marker] of markersRef.current) {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Add new markers
    for (const pin of pins) {
      if (markersRef.current.has(pin.id)) continue;
      const color = CATEGORY_COLORS[pin.category] ?? CATEGORY_COLORS.other;
      const marker = L.marker([pin.lat, pin.lng], { icon: makePinIcon(color) })
        .addTo(map)
        .on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onPinClickRef.current(pin);
        });
      markersRef.current.set(pin.id, marker);
    }
  }, [pins, map]);

  return null;
}

// Renders spot markers with a custom building SVG and a dot if the spot has stories
function SpotMarkerLayer({ onSpotClick }: { onSpotClick: (spot: Spot) => void }) {
  const map = useMap();
  const { spots } = useSpotsStore();
  const markersRef = useRef<Map<string, { marker: L.Marker; pinCount: number }>>(new Map());
  const onSpotClickRef = useRef(onSpotClick);
  onSpotClickRef.current = onSpotClick;

  useEffect(() => {
    const currentIds = new Set(spots.map((s) => s.id));

    for (const [id, { marker }] of markersRef.current) {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    for (const spot of spots) {
      const pinCount = spot._count?.pins ?? 0;
      const existing = markersRef.current.get(spot.id);

      // Skip if marker already exists with the same pin count
      if (existing && existing.pinCount === pinCount) continue;

      // Remove outdated marker so we can replace it
      if (existing) {
        existing.marker.remove();
        markersRef.current.delete(spot.id);
      }

      const marker = L.marker([spot.lat, spot.lng], {
        icon: makeSpotIcon(spot.type, pinCount > 0),
      })
        .addTo(map)
        .on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onSpotClickRef.current(spot);
        });
      markersRef.current.set(spot.id, { marker, pinCount });
    }
  }, [spots, map]);

  return null;
}

type Props = {
  onPinClick: (pin: Pin) => void;
  onSpotClick: (spot: Spot) => void;
  lightMode?: boolean;
};

export function AppMap({ onPinClick, onSpotClick, lightMode = false }: Props) {
  const { latitude, longitude, zoom } = useViewportStore();

  const tileUrl = lightMode
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const bgColor = lightMode ? "#f0ede8" : "#0a0a0f";

  return (
    <div className={lightMode ? "map-light h-full w-full" : "map-dark h-full w-full"}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: bgColor }}
      >
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          subdomains="abcd"
          maxZoom={20}
        />
        <PinFetcher />
        <SpotFetcher />
        <MapClickHandler />
        <CursorEffect />
        <MarkerLayer onPinClick={onPinClick} />
        <SpotMarkerLayer onSpotClick={onSpotClick} />
      </MapContainer>
    </div>
  );
}
