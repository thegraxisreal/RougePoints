import { create } from "zustand";

type ViewportState = {
  latitude: number;
  longitude: number;
  zoom: number;
  setViewport: (viewport: Partial<Pick<ViewportState, "latitude" | "longitude" | "zoom">>) => void;
};

export const useViewportStore = create<ViewportState>((set) => ({
  // Default to Glens Falls, NY for local beta
  latitude: 43.3095,
  longitude: -73.644,
  zoom: 12,
  setViewport: (viewport) => set((state) => ({ ...state, ...viewport })),
}));


