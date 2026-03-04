"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useViewportStore } from "@/store/viewport";
import { useTheme } from "@/hooks/useTheme";

const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

/* Syncs the Leaflet map viewport → zustand store */
function ViewportSync() {
  const map = useMap();
  const setViewport = useViewportStore((s) => s.setViewport);

  useEffect(() => {
    function sync() {
      const c = map.getCenter();
      setViewport({ latitude: c.lat, longitude: c.lng, zoom: map.getZoom() });
    }
    map.on("moveend", sync);
    return () => { map.off("moveend", sync); };
  }, [map, setViewport]);

  return null;
}

/* Syncs zustand store → Leaflet map (for programmatic viewport changes) */
function StoreSync() {
  const map = useMap();
  const { latitude, longitude, zoom } = useViewportStore();

  useEffect(() => {
    const c = map.getCenter();
    const needsUpdate =
      Math.abs(c.lat - latitude) > 0.0001 ||
      Math.abs(c.lng - longitude) > 0.0001 ||
      Math.abs(map.getZoom() - zoom) > 0.01;
    if (needsUpdate) {
      map.setView(L.latLng(latitude, longitude), zoom, { animate: false });
    }
  }, [map, latitude, longitude, zoom]);

  return null;
}

export function Map() {
  const { latitude, longitude, zoom } = useViewportStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        key={theme}
        url={isDark ? TILE_DARK : TILE_LIGHT}
        subdomains="abcd"
        maxZoom={20}
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <ViewportSync />
      <StoreSync />
    </MapContainer>
  );
}
