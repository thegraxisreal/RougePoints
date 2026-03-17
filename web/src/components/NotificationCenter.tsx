"use client";

import { useEffect, useRef } from "react";
import { useNotificationsStore, type ReactionKind } from "@/store/notifications";
import { usePinsStore } from "@/store/pins";

const REACTION_EMOJI: Record<ReactionKind, string> = {
  fire: "🔥",
  skull: "💀",
  heart: "❤️",
  laugh: "😂",
  wow: "😮",
};

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    menuOpen,
    toastVisible,
    setMenuOpen,
    setToastVisible,
    markAsRead,
    fetchNewNotifications,
  } = useNotificationsStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNewNotifications();
  }, [fetchNewNotifications]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        markAsRead();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, markAsRead]);

  function handlePinClick(pinId: string) {
    const pin = usePinsStore.getState().pins.find((p) => p.id === pinId);
    if (pin) usePinsStore.getState().selectPin(pin);
    markAsRead();
  }

  return (
    <>
      {/* Notification badge button */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => {
            if (unreadCount > 0) {
              setMenuOpen(!menuOpen);
              setToastVisible(false);
            }
          }}
          title="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/60 transition"
        >
          {/* Bell icon */}
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
            <path
              fillRule="evenodd"
              d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
              clipRule="evenodd"
            />
          </svg>

          {/* Red dot badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500 items-center justify-center text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        {menuOpen && notifications.length > 0 && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/[0.08] bg-[#13131a] backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white/90">Notifications</h3>
              <p className="text-[11px] text-white/40 mt-0.5">
                {unreadCount} new reaction{unreadCount !== 1 ? "s" : ""} on your pins
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.pinId}
                  onClick={() => handlePinClick(n.pinId)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/[0.04] transition text-left border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/85 font-medium truncate">
                      {n.pinTitle}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {n.reactions.map((r) => (
                        <span
                          key={r.kind}
                          className="inline-flex items-center gap-0.5 rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[11px]"
                        >
                          <span>{REACTION_EMOJI[r.kind as ReactionKind]}</span>
                          <span className="text-white/50">{r.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold whitespace-nowrap mt-0.5">
                    +{n.totalNew}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-white/[0.06]">
              <button
                onClick={markAsRead}
                className="w-full text-center text-[11px] text-white/40 hover:text-white/60 transition font-medium"
              >
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toastVisible && unreadCount > 0 && (
        <div className="fixed top-16 right-4 z-50 animate-slide-in-right">
          <div
            className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-[#13131a]/95 backdrop-blur-xl px-4 py-3 shadow-2xl cursor-pointer"
            onClick={() => {
              setToastVisible(false);
              setMenuOpen(true);
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/15">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6ZM8.05 14.943a33.54 33.54 0 0 0 3.9 0 2 2 0 0 1-3.9 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">
                You&apos;ve got {unreadCount} new notification{unreadCount !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-white/40">Tap to view details</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setToastVisible(false);
              }}
              className="text-white/30 hover:text-white/60 transition ml-1"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </>
  );
}
