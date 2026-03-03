"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useViewportStore } from "@/store/viewport";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { latitude, longitude, zoom, setViewport } = useViewportStore();
  const hasToken = Boolean(mapboxgl.accessToken);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (!mapboxgl.accessToken) {
      // No token provided; keep container empty to avoid runtime errors
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude],
      zoom,
    });
    mapRef.current = map;

    map.on("moveend", () => {
      const center = map.getCenter();
      setViewport({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.getZoom(),
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, zoom, setViewport]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    const needsUpdate =
      Math.abs(center.lat - latitude) > 0.0001 ||
      Math.abs(center.lng - longitude) > 0.0001 ||
      Math.abs(map.getZoom() - zoom) > 0.01;
    if (needsUpdate) {
      map.jumpTo({ center: [longitude, latitude], zoom });
    }
  }, [latitude, longitude, zoom]);

  if (!hasToken) {
    return (
      <div className="h-[100vh] w-full bg-[linear-gradient(#f3f4f6_1px,transparent_1px),linear-gradient(90deg,#f3f4f6_1px,transparent_1px)] bg-[size:24px_24px] grid place-items-center text-gray-600">
        <div className="rounded-md border border-gray-300 bg-white/70 backdrop-blur px-4 py-3 shadow-sm">
          <div className="text-sm font-medium">Map stub active</div>
          <div className="text-xs mt-1">Set NEXT_PUBLIC_MAPBOX_TOKEN to enable Mapbox tiles.</div>
          <div className="text-xs mt-2 text-gray-700">Center: {latitude.toFixed(4)}, {longitude.toFixed(4)} • Zoom: {zoom.toFixed(1)}</div>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-[100vh] w-full" />;
}


