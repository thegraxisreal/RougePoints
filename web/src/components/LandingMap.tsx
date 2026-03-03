"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function makePinIcon(color: string, active: boolean) {
  const scale = active ? 1.35 : 1;
  const w = Math.round(28 * scale);
  const h = Math.round(36 * scale);
  const id = `s${color.replace("#", "")}`;
  const svg = `<svg viewBox="0 0 24 32" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <filter id="${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="${active ? 4 : 2}" flood-color="${color}" flood-opacity="${active ? 0.9 : 0.5}"/>
    </filter>
    <path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 10.5 19.2 11.4 20.1.3.3.8.3 1.1 0C13.5 31.2 24 20.5 24 12 24 5.4 18.6 0 12 0z"
          fill="${color}" filter="url(#${id})"/>
    <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
  });
}

const PINS = [
  {
    position: [37.7749, -122.4194] as [number, number],
    color: "#60a5fa",
    user: "damian + @alexmason",
    location: "Civic Center, SF",
    story:
      "clinked glasses too hard, shattered some old dude's mug. he stared for 6 full seconds. we said we'd replace it. we walked straight out.",
    reactions: [{ emoji: "😭", count: 312 }, { emoji: "🔥", count: 88 }],
    tag: "legend",
    cycle: true,
  },
  {
    position: [37.8024, -122.4058] as [number, number],
    color: "#34d399",
    user: "Jules T.",
    location: "North Beach, SF",
    story:
      "cried in this bathroom for 40 minutes for a reason i genuinely cannot explain. great lighting in there though. 9/10.",
    reactions: [{ emoji: "😭", count: 541 }, { emoji: "❤️", count: 203 }],
    tag: "honest",
    cycle: false,
  },
  {
    position: [37.7599, -122.4148] as [number, number],
    color: "#ef4444",
    user: "Kenji S.",
    location: "Mission District, SF",
    story:
      "dared ryan to stand in that stairwell at midnight. he started crying after 3 minutes and refused to say why. that was 2 years ago.",
    reactions: [{ emoji: "😮", count: 719 }, { emoji: "👻", count: 204 }],
    tag: "mystery",
    cycle: true,
  },
];

/* ── Disables all map interaction ── */
function MapInteractionDisabler() {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.getContainer().style.cursor = "default";
    map.getContainer().style.pointerEvents = "none";
  }, [map]);
  return null;
}

/* ── Markers — kept alive, icons swap on activeIdx change ── */
function MarkerLayer({ activeIdx }: { activeIdx: number }) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    const markers = PINS.map((pin, i) =>
      L.marker(pin.position, { icon: makePinIcon(pin.color, i === activeIdx) }).addTo(map)
    );
    markersRef.current = markers;
    return () => {
      markers.forEach((m) => m.remove());
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    markersRef.current.forEach((marker, i) => {
      marker.setIcon(makePinIcon(PINS[i].color, i === activeIdx));
    });
  }, [activeIdx]);

  return null;
}

/* ── Converts pin lat/lngs to container-relative pixels ── */
function PositionTracker({
  onPositions,
}: {
  onPositions: (pos: { x: number; y: number }[]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    function calc() {
      const positions = PINS.map((pin) => {
        const pt = map.latLngToContainerPoint(
          L.latLng(pin.position[0], pin.position[1])
        );
        return { x: pt.x, y: pt.y };
      });
      onPositions(positions);
    }

    map.whenReady(calc);
    map.on("resize", calc);
    return () => {
      map.off("resize", calc);
    };
  }, [map, onPositions]);

  return null;
}

/* ── Main export ── */
export function LandingMap() {
  const cycleIndices = PINS.flatMap((p, i) => (p.cycle ? [i] : []));

  const [cycleStep, setCycleStep] = useState(0);
  const [visible, setVisible] = useState(false); // start hidden, reveal after positions ready
  const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIdx = cycleIndices[cycleStep];
  const activePin = PINS[activeIdx];

  const handlePositions = useCallback((pos: { x: number; y: number }[]) => {
    setPinPositions(pos);
    // Reveal card once we have real positions
    setTimeout(() => setVisible(true), 600);
  }, []);

  // Cycle every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCycleStep((s) => (s + 1) % cycleIndices.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Card layout constants
  const CARD_W = 240;
  const CARD_H = 162; // approximate height for connector line calc
  const OFFSET_X = 96;  // px right of pin center
  const OFFSET_Y = 280; // px above pin tip — tall enough to clear the hero text at the bottom

  const pinPx = pinPositions[activeIdx];
  const containerW = containerRef.current?.offsetWidth ?? 900;

  let cardLeft = 0;
  let cardTop = 0;

  if (pinPx) {
    // Clamp so card doesn't overflow any edge
    cardLeft = Math.max(Math.min(pinPx.x + OFFSET_X, containerW - CARD_W - 16), 16);
    cardTop = Math.max(pinPx.y - OFFSET_Y, 16);
  }

  // Connector line: from bottom-left of card to top of the active pin icon
  const lineX1 = cardLeft + 16;
  const lineY1 = cardTop + CARD_H;
  const lineX2 = pinPx?.x ?? 0;
  const lineY2 = (pinPx?.y ?? 0) - 36; // approximate pin tip

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <MapContainer
        center={[37.776, -122.4194]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <MapInteractionDisabler />
        <MarkerLayer activeIdx={activeIdx} />
        <PositionTracker onPositions={handlePositions} />
      </MapContainer>

      {/* Connector line — sits below the card */}
      {pinPx && visible && (
        <svg
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <line
            x1={lineX1}
            y1={lineY1}
            x2={lineX2}
            y2={lineY2}
            stroke={activePin.color}
            strokeWidth="1"
            strokeDasharray="3 5"
            strokeOpacity="0.3"
            style={{ transition: "opacity 0.3s" }}
          />
        </svg>
      )}

      {/* Story card — positioned relative to active pin */}
      {pinPx && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: cardLeft,
            top: cardTop,
            width: CARD_W,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(10, 10, 15, 0.9)",
              border: `1px solid ${activePin.color}35`,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px ${activePin.color}15`,
            }}
          >
            <div
              className="mb-3 h-[2px] w-8 rounded-full"
              style={{ background: activePin.color }}
            />
            <div className="mb-0.5 text-[13px] font-semibold text-white/90">
              {activePin.user}
            </div>
            <div
              className="mb-3 text-[11px]"
              style={{ color: activePin.color, opacity: 0.75 }}
            >
              {activePin.location}
            </div>
            <p className="text-[13px] leading-relaxed text-white/60 italic">
              &ldquo;{activePin.story}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                {activePin.reactions.map((r) => (
                  <span key={r.emoji} className="text-xs text-white/35">
                    {r.emoji} {r.count}
                  </span>
                ))}
              </div>
              <span
                className="text-[11px] rounded-full px-2 py-0.5"
                style={{
                  color: activePin.color,
                  border: `1px solid ${activePin.color}40`,
                }}
              >
                {activePin.tag}
              </span>
            </div>
          </div>

          {/* Cycle dots */}
          <div className="mt-2 flex gap-1.5 pl-1">
            {cycleIndices.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full"
                style={{
                  width: i === cycleStep ? "14px" : "5px",
                  background:
                    i === cycleStep
                      ? PINS[cycleIndices[i]].color
                      : "rgba(255,255,255,0.18)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
