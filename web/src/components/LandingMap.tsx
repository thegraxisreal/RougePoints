"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function makePinIcon(color: string) {
  const svg = `<svg viewBox="0 0 24 32" width="28" height="36" xmlns="http://www.w3.org/2000/svg">
    <filter id="s" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.5"/>
    </filter>
    <path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 10.5 19.2 11.4 20.1.3.3.8.3 1.1 0C13.5 31.2 24 20.5 24 12 24 5.4 18.6 0 12 0z"
          fill="${color}" filter="url(#s)"/>
    <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

const PINS = [
  {
    id: 1,
    position: [37.7694, -122.4862] as [number, number],
    color: "#60a5fa",
    accentClass: "text-blue-300",
    user: "Sam R.",
    location: "Outer Sunset, SF",
    story: "Taqueria behind the laundromat on Noriega. No sign. Just knock.",
    tag: "secret",
    reactions: "😮 47  🔥 23",
  },
  {
    id: 2,
    position: [37.7599, -122.4148] as [number, number],
    color: "#22c55e",
    accentClass: "text-green-300",
    user: "Jules T.",
    location: "The Mission, SF",
    story: "Best burrito in the city. Cash only. Don't ask for a menu.",
    tag: "legend",
    reactions: "🔥 91  ❤️ 34",
  },
  {
    id: 3,
    position: [37.8024, -122.4058] as [number, number],
    color: "#ef4444",
    accentClass: "text-red-300",
    user: "Kenji S.",
    location: "Chinatown, SF",
    story: "Third floor above the herbalist. Speakeasy. Password changes weekly.",
    tag: "mystery",
    reactions: "😮 203  👻 87",
  },
];

export function LandingMap() {
  return (
    <MapContainer
      center={[37.775, -122.435]}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      {PINS.map((pin) => (
        <Marker key={pin.id} position={pin.position} icon={makePinIcon(pin.color)}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{pin.user}</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>{pin.location}</div>
              <div style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>
                &ldquo;{pin.story}&rdquo;
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{pin.reactions}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
