import { create } from "zustand";
import { Pin } from "@/store/pins";

type FeedStore = {
  feedOpen: boolean;
  currentFeedPin: Pin | null;
  feedPins: Pin[];
  feedIndex: number;
  loading: boolean;
  recentlyShownIds: Set<string>;

  toggleFeed: () => void;
  setFeedOpen: (open: boolean) => void;
  setCurrentFeedPin: (pin: Pin | null) => void;
  loadMore: () => Promise<void>;
  nextPin: () => void;
};

export const useFeedStore = create<FeedStore>((set, get) => ({
  feedOpen: false,
  currentFeedPin: null,
  feedPins: [],
  feedIndex: 0,
  loading: false,
  recentlyShownIds: new Set(),

  toggleFeed: () => {
    const { feedOpen, feedPins, loadMore } = get();
    const next = !feedOpen;
    set({ feedOpen: next });
    // Auto-load pins when opening for the first time
    if (next && feedPins.length === 0) {
      loadMore();
    }
  },

  setFeedOpen: (open) => {
    const { feedPins, loadMore } = get();
    set({ feedOpen: open });
    if (open && feedPins.length === 0) {
      loadMore();
    }
  },

  setCurrentFeedPin: (pin) => set({ currentFeedPin: pin }),

  loadMore: async () => {
    const { loading, recentlyShownIds } = get();
    if (loading) return;
    set({ loading: true });

    try {
      const res = await fetch("/api/pins/random?limit=20");
      if (!res.ok) throw new Error("Failed to fetch");
      const newPins: Pin[] = await res.json();

      // Filter out recently shown pins if possible
      const filtered = newPins.filter((p) => !recentlyShownIds.has(p.id));
      const pins = filtered.length >= 3 ? filtered : newPins;

      if (pins.length === 0) {
        set({ loading: false });
        return;
      }

      // Track shown ids (keep last 60)
      const newShown = new Set(recentlyShownIds);
      for (const p of pins) newShown.add(p.id);
      if (newShown.size > 60) {
        // Trim oldest entries
        const arr = Array.from(newShown);
        const trimmed = new Set(arr.slice(arr.length - 60));
        set({
          feedPins: pins,
          feedIndex: 0,
          currentFeedPin: pins[0] ?? null,
          loading: false,
          recentlyShownIds: trimmed,
        });
        return;
      }

      set({
        feedPins: pins,
        feedIndex: 0,
        currentFeedPin: pins[0] ?? null,
        loading: false,
        recentlyShownIds: newShown,
      });
    } catch {
      set({ loading: false });
    }
  },

  nextPin: () => {
    const { feedPins, feedIndex, loadMore } = get();
    const nextIndex = feedIndex + 1;

    if (nextIndex >= feedPins.length) {
      // Load a new batch
      loadMore();
      return;
    }

    set({
      feedIndex: nextIndex,
      currentFeedPin: feedPins[nextIndex],
    });
  },
}));
