"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Supercluster from "supercluster";
import { usePinsStore, Pin } from "@/store/pins";
import { useSpotsStore, Spot } from "@/store/spots";
import { useViewportStore } from "@/store/viewport";
import { useClusterLabelsStore, ClusterLabel } from "@/store/clusterLabels";

/** Zoom level at or above which individual pins are shown; below this clusters appear. */
const CLUSTER_ZOOM_THRESHOLD = 13;

const CATEGORY_COLORS: Record<string, string> = {
  funny: "#fbbf24",
  mystery: "#a78bfa",
  danger: "#f87171",
  legend: "#60a5fa",
  wholesome: "#34d399",
  other: "#9ca3af",
};

const REACTION_EMOJIS: { key: keyof Pin; emoji: string }[] = [
  { key: "fireCount", emoji: "\u{1F525}" },
  { key: "laughCount", emoji: "\u{1F602}" },
  { key: "heartCount", emoji: "\u2764\uFE0F" },
  { key: "skullCount", emoji: "\u{1F480}" },
  { key: "wowCount", emoji: "\u{1F62E}" },
];

const MAX_ORBITING_EMOJIS = 8;

function buildEmojiRing(pin: Pin): string {
  const emojis: string[] = [];
  for (const r of REACTION_EMOJIS) {
    const count = (pin[r.key] as number) ?? 0;
    for (let i = 0; i < count && emojis.length < MAX_ORBITING_EMOJIS; i++) {
      emojis.push(r.emoji);
    }
  }
  if (emojis.length === 0) return "";

  // Place emojis evenly on a circle (radius 22px) around pin centre (15, 15 in the 30x38 icon)
  const cx = 15, cy = 15, radius = 22;
  const startAngle = -Math.PI / 2; // top
  return emojis
    .map((e, i) => {
      const angle = startAngle + (2 * Math.PI * i) / emojis.length;
      const x = cx + radius * Math.cos(angle) - 6; // 6 ≈ half emoji width
      const y = cy + radius * Math.sin(angle) - 6;
      return `<span style="position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;font-size:12px;line-height:1;pointer-events:none;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))">${e}</span>`;
    })
    .join("");
}

function makeTitleCard(pin: Pin): string {
  const title = pin.title.length > 60 ? pin.title.slice(0, 57) + "..." : pin.title;
  const author = pin.author?.handle ? `@${pin.author.handle}` : "";
  // Escape HTML entities
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return `<div style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:6px;background:rgba(20,20,30,0.92);color:#fff;border-radius:10px;padding:6px 10px;font-size:11px;line-height:1.3;white-space:nowrap;max-width:200px;overflow:hidden;text-overflow:ellipsis;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,0.4);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.1)">
    <div style="overflow:hidden;text-overflow:ellipsis;font-weight:600">${esc(title)}</div>
    ${author ? `<div style="opacity:0.6;font-size:10px;margin-top:1px">${esc(author)}</div>` : ""}
    <div style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid rgba(20,20,30,0.92)"></div>
  </div>`;
}

function makePinIcon(color: string, pin?: Pin, showTitleCard?: boolean): L.DivIcon {
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

  const emojiHtml = pin ? buildEmojiRing(pin) : "";
  const titleCardHtml = showTitleCard && pin ? makeTitleCard(pin) : "";
  const html = `<div style="position:relative;width:30px;height:38px;overflow:visible">${titleCardHtml}${svg}${emojiHtml}</div>`;

  return L.divIcon({
    html,
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

// ─── Needle cluster marker ──────────────────────────────────────────────────

function makeNeedleIcon(label: string): L.DivIcon {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const needleSvg = `<svg viewBox="0 0 20 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="needle-glow" x="-100%" y="-50%" width="300%" height="200%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#f43f5e" flood-opacity="0.7"/>
      </filter>
    </defs>
    <line x1="10" y1="8" x2="10" y2="44" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" filter="url(#needle-glow)"/>
    <circle cx="10" cy="8" r="7" fill="#f43f5e" filter="url(#needle-glow)"/>
    <circle cx="10" cy="8" r="3" fill="white" opacity="0.9"/>
  </svg>`;

  const labelHtml = `<div style="position:absolute;top:50px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8),0 0 6px rgba(0,0,0,0.5);background:rgba(20,20,30,0.75);padding:2px 8px;border-radius:8px;pointer-events:none;line-height:1.3">${esc(label)}</div>`;

  return L.divIcon({
    html: `<div style="position:relative;width:20px;height:48px;overflow:visible">${needleSvg}${labelHtml}</div>`,
    className: "",
    iconSize: [20, 48],
    iconAnchor: [10, 48],
  });
}

// ─── Cluster label fetcher ──────────────────────────────────────────────────

function ClusterLabelFetcher() {
  const map = useMap();
  const fetchRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function fetchLabels() {
      const bounds = map.getBounds();
      const params = new URLSearchParams({
        swLat: String(bounds.getSouth()),
        swLng: String(bounds.getWest()),
        neLat: String(bounds.getNorth()),
        neLng: String(bounds.getEast()),
      });
      fetch(`/api/cluster-labels?${params}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((labels) => useClusterLabelsStore.getState().setLabels(labels))
        .catch(() => {});
    }

    map.whenReady(fetchLabels);

    function onMoveEnd() {
      clearTimeout(fetchRef.current);
      fetchRef.current = setTimeout(fetchLabels, 300);
    }
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      clearTimeout(fetchRef.current);
    };
  }, [map]);

  return null;
}

// ─── Cluster layer using Supercluster ───────────────────────────────────────

type ClusterEntry = {
  clusterId: number;
  lat: number;
  lng: number;
  count: number;
  expansionZoom: number;
};

function ClusterLayer() {
  const map = useMap();
  const { pins } = usePinsStore();
  const { labels } = useClusterLabelsStore();
  const { isAdmin, adminCode } = useSpotsStore();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [clusters, setClusters] = useState<ClusterEntry[]>([]);
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());
  const indexRef = useRef<Supercluster | null>(null);
  const editingRef = useRef<string | null>(null);

  // Rebuild Supercluster index when pins change
  useEffect(() => {
    const points: Supercluster.PointFeature<{ pinId: string }>[] = pins.map((p) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      properties: { pinId: p.id },
    }));

    const index = new Supercluster({ radius: 60, maxZoom: CLUSTER_ZOOM_THRESHOLD - 1 });
    index.load(points);
    indexRef.current = index;

    updateClusters(index, map.getZoom());
  }, [pins, map]);

  // Listen for zoom changes
  useEffect(() => {
    function onZoomEnd() {
      const z = map.getZoom();
      setCurrentZoom(z);
      if (indexRef.current) updateClusters(indexRef.current, z);
    }
    function onMoveEnd() {
      if (indexRef.current) updateClusters(indexRef.current, map.getZoom());
    }
    map.on("zoomend", onZoomEnd);
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("zoomend", onZoomEnd);
      map.off("moveend", onMoveEnd);
    };
  }, [map]);

  const updateClusters = useCallback(
    (index: Supercluster, zoom: number) => {
      if (zoom >= CLUSTER_ZOOM_THRESHOLD) {
        setClusters([]);
        return;
      }
      const bounds = map.getBounds();
      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      const raw = index.getClusters(bbox, Math.floor(zoom));
      const entries: ClusterEntry[] = [];
      for (const f of raw) {
        if (!f.properties.cluster) continue;
        const [lng, lat] = f.geometry.coordinates;
        entries.push({
          clusterId: f.properties.cluster_id as number,
          lat,
          lng,
          count: f.properties.point_count as number,
          expansionZoom: index.getClusterExpansionZoom(f.properties.cluster_id as number),
        });
      }
      setClusters(entries);
    },
    [map],
  );

  // Find the closest saved label for a cluster position
  const findLabel = useCallback(
    (lat: number, lng: number): ClusterLabel | null => {
      let best: ClusterLabel | null = null;
      let bestDist = Infinity;
      for (const l of labels) {
        const d = (l.lat - lat) ** 2 + (l.lng - lng) ** 2;
        if (d < bestDist && d < 0.01) {
          best = l;
          bestDist = d;
        }
      }
      return best;
    },
    [labels],
  );

  // Render / update cluster markers
  useEffect(() => {
    const hidden = currentZoom >= CLUSTER_ZOOM_THRESHOLD;
    const activeKeys = new Set<string>();

    if (!hidden) {
      for (const c of clusters) {
        const key = `cluster-${c.clusterId}`;
        activeKeys.add(key);

        const savedLabel = findLabel(c.lat, c.lng);
        const labelText = savedLabel?.name ?? "Town";

        const existing = markersRef.current.get(key);
        if (existing) {
          existing.setLatLng([c.lat, c.lng]);
          existing.setIcon(makeNeedleIcon(labelText));
          continue;
        }

        const marker = L.marker([c.lat, c.lng], {
          icon: makeNeedleIcon(labelText),
          zIndexOffset: 1000,
        })
          .addTo(map)
          .on("click", (e) => {
            L.DomEvent.stopPropagation(e);

            const { isAdmin: isAdminNow, adminCode: code } = useSpotsStore.getState();

            if (isAdminNow && editingRef.current !== key) {
              // Show admin inline edit
              editingRef.current = key;
              const currentLabel = findLabel(c.lat, c.lng);
              const currentName = currentLabel?.name ?? "Town";

              const popup = L.popup({
                closeButton: true,
                className: "cluster-edit-popup",
                minWidth: 180,
              })
                .setLatLng([c.lat, c.lng])
                .setContent(
                  `<div style="padding:4px">
                    <label style="font-size:11px;font-weight:600;color:#ccc;display:block;margin-bottom:4px">Cluster label</label>
                    <input id="cluster-label-input" type="text" value="${currentName.replace(/"/g, "&quot;")}"
                      style="width:100%;padding:4px 8px;border-radius:6px;border:1px solid #444;background:#1a1a2e;color:#fff;font-size:13px;outline:none"
                    />
                    <button id="cluster-label-save"
                      style="margin-top:6px;width:100%;padding:4px 0;border-radius:6px;border:none;background:#f43f5e;color:#fff;font-size:12px;font-weight:600;cursor:pointer">
                      Save
                    </button>
                  </div>`,
                )
                .openOn(map);

              // Wait for DOM to render before attaching listeners
              setTimeout(() => {
                const input = document.getElementById("cluster-label-input") as HTMLInputElement | null;
                const btn = document.getElementById("cluster-label-save");
                if (!input || !btn) return;
                input.focus();
                input.select();

                const save = () => {
                  const name = input.value.trim();
                  if (!name) return;
                  const bodyPayload: Record<string, unknown> = {
                    adminCode: code,
                    lat: c.lat,
                    lng: c.lng,
                    name,
                  };
                  if (currentLabel?.id) {
                    bodyPayload.id = currentLabel.id;
                    fetch("/api/cluster-labels", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bodyPayload),
                    })
                      .then((r) => (r.ok ? r.json() : null))
                      .then((updated) => {
                        if (updated) useClusterLabelsStore.getState().upsertLabel(updated);
                      })
                      .catch(() => {});
                  } else {
                    fetch("/api/cluster-labels", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(bodyPayload),
                    })
                      .then((r) => (r.ok ? r.json() : null))
                      .then((created) => {
                        if (created) useClusterLabelsStore.getState().upsertLabel(created);
                      })
                      .catch(() => {});
                  }
                  map.closePopup(popup);
                  editingRef.current = null;
                };

                btn.addEventListener("click", save);
                input.addEventListener("keydown", (ev) => {
                  if (ev.key === "Enter") save();
                });
              }, 0);

              popup.on("remove", () => {
                editingRef.current = null;
              });
            } else if (!isAdminNow) {
              // Non-admin: zoom into the cluster
              map.flyTo([c.lat, c.lng], c.expansionZoom, { duration: 0.6 });
            }
          });

        markersRef.current.set(key, marker);
      }
    }

    // Remove stale cluster markers
    for (const [key, marker] of markersRef.current) {
      if (!activeKeys.has(key)) {
        marker.remove();
        markersRef.current.delete(key);
      }
    }
  }, [clusters, currentZoom, map, findLabel, labels]);

  return null;
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

// Zooms to a pin when selected, restores previous viewport when deselected
function ZoomToPin() {
  const map = useMap();
  const { selectedPin } = usePinsStore();
  const prevViewportRef = useRef<{ lat: number; lng: number; zoom: number } | null>(null);

  useEffect(() => {
    if (selectedPin) {
      // Save current viewport before zooming in
      const center = map.getCenter();
      prevViewportRef.current = {
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      };
      map.flyTo([selectedPin.lat, selectedPin.lng], 17, { duration: 1 });
    } else if (prevViewportRef.current) {
      // Restore previous viewport when pin card is closed
      const { lat, lng, zoom } = prevViewportRef.current;
      map.flyTo([lat, lng], zoom, { duration: 1 });
      prevViewportRef.current = null;
    }
  }, [selectedPin, map]);

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

// Build a simple string hash of a pin's reaction counts for change detection
function reactionHash(pin: Pin): string {
  return `${pin.fireCount}|${pin.skullCount}|${pin.heartCount}|${pin.laughCount}|${pin.wowCount}`;
}

// Renders pin markers and handles clicks — hidden when zoomed out past CLUSTER_ZOOM_THRESHOLD
function MarkerLayer({ onPinClick }: { onPinClick: (pin: Pin) => void }) {
  const map = useMap();
  const { pins } = usePinsStore();
  const markersRef = useRef<Map<string, { marker: L.Marker; hash: string }>>(new Map());
  // Track which pins randomly got a title card (1 in 5 chance, persists until page reload)
  const titleCardRollsRef = useRef<Map<string, boolean>>(new Map());
  const onPinClickRef = useRef(onPinClick);
  onPinClickRef.current = onPinClick;
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    function onZoomEnd() {
      setZoom(map.getZoom());
    }
    map.on("zoomend", onZoomEnd);
    return () => { map.off("zoomend", onZoomEnd); };
  }, [map]);

  useEffect(() => {
    const clustered = zoom < CLUSTER_ZOOM_THRESHOLD;

    // When clustered, remove all individual markers
    if (clustered) {
      for (const [id, entry] of markersRef.current) {
        entry.marker.remove();
        markersRef.current.delete(id);
      }
      return;
    }

    const currentIds = new Set(pins.map((p) => p.id));

    // Remove stale markers
    for (const [id, entry] of markersRef.current) {
      if (!currentIds.has(id)) {
        entry.marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Add or update markers
    for (const pin of pins) {
      const color = CATEGORY_COLORS[pin.category] ?? CATEGORY_COLORS.other;
      const hash = reactionHash(pin);
      const existing = markersRef.current.get(pin.id);

      // Roll once per pin per page load for title card visibility
      if (!titleCardRollsRef.current.has(pin.id)) {
        titleCardRollsRef.current.set(pin.id, Math.random() < 0.2);
      }
      const showTitleCard = titleCardRollsRef.current.get(pin.id)!;

      if (existing) {
        // Update icon if reactions changed
        if (existing.hash !== hash) {
          existing.marker.setIcon(makePinIcon(color, pin, showTitleCard));
          existing.hash = hash;
        }
        continue;
      }

      const marker = L.marker([pin.lat, pin.lng], { icon: makePinIcon(color, pin, showTitleCard) })
        .addTo(map)
        .on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onPinClickRef.current(pin);
        });
      markersRef.current.set(pin.id, { marker, hash });
    }
  }, [pins, map, zoom]);

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
  satelliteMode?: boolean;
};

export function AppMap({ onPinClick, onSpotClick, lightMode = false, satelliteMode = false }: Props) {
  const { latitude, longitude, zoom } = useViewportStore();

  const tileUrl = satelliteMode
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : lightMode
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const bgColor = satelliteMode ? "#1a3a1a" : lightMode ? "#f0ede8" : "#0a0a0f";

  const mapClass = satelliteMode
    ? "map-satellite h-full w-full"
    : lightMode
      ? "map-light h-full w-full"
      : "map-dark h-full w-full";

  return (
    <div className={mapClass}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: bgColor }}
      >
        {satelliteMode ? (
          <TileLayer
            key="satellite"
            url={tileUrl}
            maxZoom={19}
          />
        ) : (
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            subdomains="abcd"
            maxZoom={20}
          />
        )}
        <PinFetcher />
        <SpotFetcher />
        <ClusterLabelFetcher />
        <MapClickHandler />
        <CursorEffect />
        <ZoomToPin />
        <ClusterLayer />
        <MarkerLayer onPinClick={onPinClick} />
        <SpotMarkerLayer onSpotClick={onSpotClick} />
      </MapContainer>
    </div>
  );
}
