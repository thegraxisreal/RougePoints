import { create } from "zustand";

export type ClusterLabel = {
  id: string;
  lat: number;
  lng: number;
  name: string;
};

type ClusterLabelsStore = {
  labels: ClusterLabel[];
  setLabels: (labels: ClusterLabel[]) => void;
  upsertLabel: (label: ClusterLabel) => void;

  // Town drop mode (admin placing a town marker)
  townDropMode: boolean;
  setTownDropMode: (on: boolean) => void;
};

export const useClusterLabelsStore = create<ClusterLabelsStore>((set) => ({
  labels: [],
  setLabels: (labels) => set({ labels }),
  upsertLabel: (label) =>
    set((s) => {
      const idx = s.labels.findIndex((l) => l.id === label.id);
      if (idx >= 0) {
        const next = [...s.labels];
        next[idx] = label;
        return { labels: next };
      }
      return { labels: [label, ...s.labels] };
    }),

  townDropMode: false,
  setTownDropMode: (townDropMode) => set({ townDropMode }),
}));
