import { create } from "zustand";
import { getClusteredPins, type PinMarkerData, PIN_CLUSTER_ZOOM } from "@/lib/clustering";

export type Pin = {
  id: string;
  authorId: string;
  lat: number;
  lng: number;
  title: string;
  category: string;
  fireCount: number;
  skullCount: number;
  heartCount: number;
  laughCount: number;
  wowCount: number;
  createdAt: string;
  author: { handle: string; avatarUrl: string | null };
  media?: { id: string; s3Key: string; state: string }[];
};

type PinsStore = {
  pins: Pin[];
  selectedPin: Pin | null;
  dropMode: boolean;
  pendingCoords: { lat: number; lng: number } | null;
  composeOpen: boolean;
  clusterZoomThreshold: number;
  getMarkerData: (zoom: number) => PinMarkerData[];
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  removePin: (id: string) => void;
  selectPin: (pin: Pin | null) => void;
  updatePin: (id: string, partial: Partial<Pin>) => void;
  setDropMode: (on: boolean) => void;
  setPendingCoords: (coords: { lat: number; lng: number } | null) => void;
  openCompose: (coords: { lat: number; lng: number }) => void;
  closeCompose: () => void;
};

export const usePinsStore = create<PinsStore>((set, get) => ({
  pins: [],
  selectedPin: null,
  dropMode: false,
  pendingCoords: null,
  composeOpen: false,
  clusterZoomThreshold: PIN_CLUSTER_ZOOM,
  getMarkerData: (zoom) => getClusteredPins(get().pins, zoom),
  setPins: (pins) => set({ pins }),
  addPin: (pin) => set((s) => ({ pins: [pin, ...s.pins] })),
  removePin: (id) => set((s) => ({ pins: s.pins.filter((p) => p.id !== id) })),
  selectPin: (pin) => set({ selectedPin: pin }),
  updatePin: (id, partial) =>
    set((s) => ({
      pins: s.pins.map((p) => (p.id === id ? { ...p, ...partial } : p)),
      selectedPin:
        s.selectedPin?.id === id
          ? { ...s.selectedPin, ...partial }
          : s.selectedPin,
    })),
  setDropMode: (dropMode) => set({ dropMode }),
  setPendingCoords: (pendingCoords) => set({ pendingCoords }),
  openCompose: (coords) =>
    set({ pendingCoords: coords, composeOpen: true, dropMode: false }),
  closeCompose: () => set({ composeOpen: false, pendingCoords: null }),
}));
