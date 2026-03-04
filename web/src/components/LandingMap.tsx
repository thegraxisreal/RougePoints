"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme, type Theme } from "@/hooks/useTheme";

/* ── Spot: a named place that groups multiple stories ── */
const SPOTS = [
  {
    id: "north-beach",
    name: "North Beach, SF",
    position: [37.8024, -122.4058] as [number, number],
    color: "#34d399",
  },
  {
    id: "mission",
    name: "Mission District, SF",
    position: [37.7599, -122.4148] as [number, number],
    color: "#ef4444",
  },
];

/* ── Pins: stories on the map.
   Those with spotId belong to a Spot — they won't get
   their own teardrop pin; instead the Spot icon lights up. ── */
const PINS = [
  {
    position: [37.7749, -122.3900] as [number, number],
    color: "#60a5fa",
    spotId: null,
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
    spotId: "north-beach",
    user: "Jules T.",
    location: "North Beach, SF",
    story:
      "cried in this bathroom for 40 minutes for a reason i genuinely cannot explain. great lighting in there though. 9/10.",
    reactions: [{ emoji: "😭", count: 541 }, { emoji: "❤️", count: 203 }],
    tag: "honest",
    cycle: true,
  },
  {
    position: [37.7599, -122.4148] as [number, number],
    color: "#ef4444",
    spotId: "mission",
    user: "Kenji S.",
    location: "Mission District, SF",
    story:
      "dared ryan to stand in that stairwell at midnight. he started crying after 3 minutes and refused to say why. that was 2 years ago.",
    reactions: [{ emoji: "😮", count: 719 }, { emoji: "👻", count: 204 }],
    tag: "mystery",
    cycle: true,
  },
];

/* ── Icon factories ── */

function makePinIcon(color: string, active: boolean) {
  const scale = active ? 1.35 : 1;
  const w = Math.round(28 * scale);
  const h = Math.round(36 * scale);
  const id = `p${color.replace("#", "")}`;
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

function makeSpotIcon(color: string, active: boolean, storyCount: number, theme: Theme) {
  const scale = active ? 1.2 : 1;
  const size = Math.round(40 * scale);
  const bgFill = theme === "dark" ? "rgba(10,10,15,0.88)" : "rgba(244,240,230,0.94)";
  const strokeW = active ? 2.5 : 1.8;
  const opacity = active ? 1 : 0.80;
  const id = `s${color.replace("#", "")}`;
  const svg = `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <filter id="${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="${active ? 5 : 2}" flood-color="${color}" flood-opacity="${active ? 0.6 : 0.25}"/>
    </filter>
    <!-- Main circle -->
    <circle cx="20" cy="20" r="16" fill="${bgFill}" stroke="${color}" stroke-width="${strokeW}" filter="url(#${id})" opacity="${opacity}"/>
    <!-- Building icon inside -->
    <rect x="13" y="17" width="14" height="10" rx="1.5" fill="${color}" opacity="${active ? 0.9 : 0.7}"/>
    <rect x="16.5" y="22" width="3.5" height="5" rx="0.8" fill="${bgFill}"/>
    <rect x="13.5" y="13" width="13" height="5.5" rx="1.5" fill="${color}" opacity="${active ? 0.9 : 0.7}"/>
    <!-- Story dot badge (top-right) -->
    <circle cx="31" cy="9" r="6" fill="${color}" stroke="${theme === "dark" ? "#0a0a0f" : "#f4f0e6"}" stroke-width="2"/>
    <text x="31" y="12.5" text-anchor="middle" fill="white" font-size="7" font-weight="bold" font-family="system-ui,sans-serif">${storyCount}</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

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

/* ── Markers: spots + standalone pins ── */
function MarkerLayer({ activeIdx, theme }: { activeIdx: number; theme: Theme }) {
  const map = useMap();
  const pinMarkersRef = useRef<L.Marker[]>([]);
  const spotMarkersRef = useRef<L.Marker[]>([]);

  // Story count per spot
  const storiesPerSpot = SPOTS.map((spot) =>
    PINS.filter((p) => p.spotId === spot.id).length
  );

  // Which spot (if any) is active right now
  const activeSpotId = PINS[activeIdx]?.spotId ?? null;

  // Mount standalone pin markers (no spotId)
  useEffect(() => {
    const standaloneIdxs = PINS.flatMap((p, i) => (p.spotId === null ? [i] : []));
    const markers = standaloneIdxs.map((i) =>
      L.marker(PINS[i].position, {
        icon: makePinIcon(PINS[i].color, i === activeIdx),
      }).addTo(map)
    );
    pinMarkersRef.current = markers;
    return () => {
      markers.forEach((m) => m.remove());
      pinMarkersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Mount spot markers
  useEffect(() => {
    const markers = SPOTS.map((spot, si) =>
      L.marker(spot.position, {
        icon: makeSpotIcon(spot.color, spot.id === activeSpotId, storiesPerSpot[si], theme),
      }).addTo(map)
    );
    spotMarkersRef.current = markers;
    return () => {
      markers.forEach((m) => m.remove());
      spotMarkersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Update standalone pin icons when activeIdx or theme changes
  useEffect(() => {
    const standaloneIdxs = PINS.flatMap((p, i) => (p.spotId === null ? [i] : []));
    pinMarkersRef.current.forEach((marker, mi) => {
      const i = standaloneIdxs[mi];
      marker.setIcon(makePinIcon(PINS[i].color, i === activeIdx));
    });
  }, [activeIdx, theme]);

  // Update spot icons when activeIdx or theme changes
  useEffect(() => {
    spotMarkersRef.current.forEach((marker, si) => {
      const spot = SPOTS[si];
      marker.setIcon(
        makeSpotIcon(spot.color, spot.id === activeSpotId, storiesPerSpot[si], theme)
      );
    });
  }, [activeIdx, theme, activeSpotId, storiesPerSpot]);

  return null;
}

/* ── Converts PINS lat/lngs to container-relative pixels ── */
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

/* ── Tile URLs ── */
const TILE_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_LIGHT =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

/* ── Main export ── */
export function LandingMap() {
  const { theme } = useTheme();
  const cycleIndices = PINS.flatMap((p, i) => (p.cycle ? [i] : []));

  const [cycleStep, setCycleStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pinPositions, setPinPositions] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIdx = cycleIndices[cycleStep];
  const activePin = PINS[activeIdx];
  const isSpotPin = Boolean(activePin?.spotId);

  const handlePositions = useCallback((pos: { x: number; y: number }[]) => {
    setPinPositions(pos);
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

  const CARD_W = 240;
  const CARD_H = 162;
  const OFFSET_X = 96;
  const OFFSET_Y = 280;

  const pinPx = pinPositions[activeIdx];
  const containerW = containerRef.current?.offsetWidth ?? 900;

  let cardLeft = 0;
  let cardTop = 0;

  if (pinPx) {
    cardLeft = Math.max(Math.min(pinPx.x + OFFSET_X, containerW - CARD_W - 16), 16);
    cardTop = Math.max(pinPx.y - OFFSET_Y, 16);
  }

  const lineX1 = cardLeft + 16;
  const lineY1 = cardTop + CARD_H;
  const lineX2 = pinPx?.x ?? 0;
  // For spot pins, the icon is centered (not teardrop), so connect to center
  const lineY2 = isSpotPin
    ? (pinPx?.y ?? 0)
    : (pinPx?.y ?? 0) - 36;

  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(10, 10, 15, 0.90)" : "rgba(244, 240, 230, 0.94)";
  const textPrimary = isDark ? "rgba(255,255,255,0.88)" : "rgba(26,23,16,0.88)";
  const textSecondary = isDark ? "rgba(255,255,255,0.55)" : "rgba(26,23,16,0.55)";
  const dotBg = isDark ? "rgba(255,255,255,0.14)" : "rgba(26,23,16,0.10)";

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
          key={theme}
          url={isDark ? TILE_DARK : TILE_LIGHT}
          subdomains="abcd"
          maxZoom={20}
        />
        <MapInteractionDisabler />
        <MarkerLayer activeIdx={activeIdx} theme={theme} />
        <PositionTracker onPositions={handlePositions} />
      </MapContainer>

      {/* Connector line */}
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
            strokeOpacity="0.35"
            style={{ transition: "opacity 0.3s" }}
          />
        </svg>
      )}

      {/* Story card */}
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
              background: cardBg,
              border: `1px solid ${activePin.color}38`,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? "0.55" : "0.12"}), 0 0 0 1px ${activePin.color}18`,
            }}
          >
            {/* Spot badge if this story is inside a spot */}
            {isSpotPin && (
              <div
                className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  background: `${activePin.color}18`,
                  color: activePin.color,
                  border: `1px solid ${activePin.color}35`,
                }}
              >
                <svg viewBox="0 0 12 12" width="9" height="9" fill="currentColor">
                  <rect x="2" y="5" width="8" height="5.5" rx="1"/>
                  <rect x="3.5" y="3" width="5" height="3" rx="1"/>
                  <rect x="4.5" y="7" width="2" height="3" fill="white" opacity="0.8"/>
                </svg>
                Spot story
              </div>
            )}

            <div
              className="mb-3 h-[2px] w-8 rounded-full"
              style={{ background: activePin.color }}
            />
            <div className="mb-0.5 text-[13px] font-semibold" style={{ color: textPrimary }}>
              {activePin.user}
            </div>
            <div
              className="mb-3 text-[11px]"
              style={{ color: activePin.color, opacity: 0.80 }}
            >
              {activePin.location}
            </div>
            <p className="text-[13px] leading-relaxed italic" style={{ color: textSecondary }}>
              &ldquo;{activePin.story}&rdquo;
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                {activePin.reactions.map((r) => (
                  <span key={r.emoji} className="text-xs" style={{ color: textSecondary, opacity: 0.7 }}>
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
                      : dotBg,
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
