import { create } from "zustand";
import type { Pin } from "./pins";

export type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: string;
};

type SpotsStore = {
  // Admin
  isAdmin: boolean;
  setAdmin: (on: boolean) => void;

  // Spots on the map
  spots: Spot[];
  setSpots: (spots: Spot[]) => void;
  addSpot: (spot: Spot) => void;

  // Spot drop mode (admin placing a spot)
  spotDropMode: boolean;
  setSpotDropMode: (on: boolean) => void;
  pendingSpotCoords: { lat: number; lng: number } | null;
  spotComposeOpen: boolean;
  openSpotCompose: (coords: { lat: number; lng: number }) => void;
  closeSpotCompose: () => void;

  // Fullscreen spot view
  selectedSpot: Spot | null;
  spotPins: Pin[];
  selectSpot: (spot: Spot | null) => void;
  setSpotPins: (pins: Pin[]) => void;
  addSpotPin: (pin: Pin) => void;
};

export const useSpotsStore = create<SpotsStore>((set) => ({
  isAdmin: false,
  setAdmin: (isAdmin) => set({ isAdmin }),

  spots: [],
  setSpots: (spots) => set({ spots }),
  addSpot: (spot) => set((s) => ({ spots: [spot, ...s.spots] })),

  spotDropMode: false,
  setSpotDropMode: (spotDropMode) => set({ spotDropMode }),
  pendingSpotCoords: null,
  spotComposeOpen: false,
  openSpotCompose: (coords) =>
    set({ pendingSpotCoords: coords, spotComposeOpen: true, spotDropMode: false }),
  closeSpotCompose: () => set({ spotComposeOpen: false, pendingSpotCoords: null }),

  selectedSpot: null,
  spotPins: [],
  selectSpot: (spot) => set({ selectedSpot: spot, spotPins: [] }),
  setSpotPins: (spotPins) => set({ spotPins }),
  addSpotPin: (pin) => set((s) => ({ spotPins: [pin, ...s.spotPins] })),
}));
