"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePinsStore, Pin } from "@/store/pins";
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

// Fetches pins from the API whenever the map viewport changes
function PinFetcher() {
  const map = useMap();
  const fetchRef = useRef<ReturnType<typeof setTimeout>>();

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

// Handles map clicks in drop mode — reads store directly to avoid stale closures
function MapClickHandler() {
  useMapEvents({
    click(e) {
      const { dropMode, openCompose } = usePinsStore.getState();
      if (dropMode) openCompose({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Crosshair cursor when drop mode is active
function CursorEffect() {
  const map = useMap();
  const { dropMode } = usePinsStore();
  useEffect(() => {
    map.getContainer().style.cursor = dropMode ? "crosshair" : "";
  }, [map, dropMode]);
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

type Props = {
  onPinClick: (pin: Pin) => void;
};

export function AppMap({ onPinClick }: Props) {
  const { latitude, longitude, zoom } = useViewportStore();

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      zoomControl={false}
      attributionControl={false}
      className="h-full w-full"
      style={{ background: "#0a0a0f" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <PinFetcher />
      <MapClickHandler />
      <CursorEffect />
      <MarkerLayer onPinClick={onPinClick} />
    </MapContainer>
  );
}
