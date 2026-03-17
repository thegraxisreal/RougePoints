import { create } from "zustand";

export type ReactionKind = "fire" | "skull" | "heart" | "laugh" | "wow";

export type PinNotification = {
  pinId: string;
  pinTitle: string;
  reactions: { kind: ReactionKind; count: number }[];
  totalNew: number;
};

type NotificationsStore = {
  notifications: PinNotification[];
  unreadCount: number;
  menuOpen: boolean;
  toastVisible: boolean;
  lastChecked: string | null;

  setNotifications: (notifications: PinNotification[]) => void;
  markAsRead: () => void;
  setMenuOpen: (open: boolean) => void;
  setToastVisible: (visible: boolean) => void;
  fetchNewNotifications: () => Promise<void>;
};

const LAST_CHECKED_KEY = "rp_notifications_lastChecked";

function getStoredLastChecked(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_CHECKED_KEY);
}

function setStoredLastChecked(ts: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_CHECKED_KEY, ts);
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  menuOpen: false,
  toastVisible: false,
  lastChecked: getStoredLastChecked(),

  setNotifications: (notifications) => {
    const unreadCount = notifications.reduce((sum, n) => sum + n.totalNew, 0);
    set({ notifications, unreadCount });
  },

  markAsRead: () => {
    const now = new Date().toISOString();
    setStoredLastChecked(now);
    set({ notifications: [], unreadCount: 0, lastChecked: now, menuOpen: false });
  },

  setMenuOpen: (menuOpen) => set({ menuOpen }),

  setToastVisible: (toastVisible) => set({ toastVisible }),

  fetchNewNotifications: async () => {
    const lastChecked = get().lastChecked;
    const params = new URLSearchParams();
    if (lastChecked) params.set("since", lastChecked);

    try {
      const res = await fetch(`/api/pins/new-reactions?${params.toString()}`);
      if (!res.ok) return;

      const data: PinNotification[] = await res.json();
      if (data.length > 0) {
        const unreadCount = data.reduce((sum, n) => sum + n.totalNew, 0);
        set({ notifications: data, unreadCount, toastVisible: true });

        // Auto-dismiss toast after 4.5 seconds
        setTimeout(() => {
          set({ toastVisible: false });
        }, 4500);
      }
    } catch {
      // Silently fail — notifications are non-critical
    }
  },
}));
