import { create } from "zustand";

export type Pin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  body: string;
  category: string;
  fireCount: number;
  skullCount: number;
  heartCount: number;
  laughCount: number;
  wowCount: number;
  createdAt: string;
  author: { handle: string; avatarUrl: string | null };
};

type PinsStore = {
  pins: Pin[];
  selectedPin: Pin | null;
  dropMode: boolean;
  pendingCoords: { lat: number; lng: number } | null;
  composeOpen: boolean;
  setPins: (pins: Pin[]) => void;
  addPin: (pin: Pin) => void;
  selectPin: (pin: Pin | null) => void;
  setDropMode: (on: boolean) => void;
  setPendingCoords: (coords: { lat: number; lng: number } | null) => void;
  openCompose: (coords: { lat: number; lng: number }) => void;
  closeCompose: () => void;
};

export const usePinsStore = create<PinsStore>((set) => ({
  pins: [],
  selectedPin: null,
  dropMode: false,
  pendingCoords: null,
  composeOpen: false,
  setPins: (pins) => set({ pins }),
  addPin: (pin) => set((s) => ({ pins: [pin, ...s.pins] })),
  selectPin: (pin) => set({ selectedPin: pin }),
  setDropMode: (dropMode) => set({ dropMode }),
  setPendingCoords: (pendingCoords) => set({ pendingCoords }),
  openCompose: (coords) =>
    set({ pendingCoords: coords, composeOpen: true, dropMode: false }),
  closeCompose: () => set({ composeOpen: false, pendingCoords: null }),
}));
