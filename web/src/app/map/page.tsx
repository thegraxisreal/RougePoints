"use client";

import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import { usePinsStore, Pin } from "@/store/pins";
import { ComposeModal } from "@/components/ComposeModal";
import { PinDetail } from "@/components/PinDetail";
import { useCallback } from "react";

const AppMap = dynamic(
  () => import("@/components/AppMap").then((m) => m.AppMap),
  { ssr: false }
);

export default function MapPage() {
  const { dropMode, setDropMode, selectPin, composeOpen } = usePinsStore();

  const handlePinClick = useCallback(
    (pin: Pin) => selectPin(pin),
    [selectPin]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Full-screen map */}
      <AppMap onPinClick={handlePinClick} />

      {/* ── Floating header ── */}
      <header className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-black/50 backdrop-blur-md px-4 py-2 hover:bg-black/60 transition"
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6">
            <defs>
              <linearGradient id="rp-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
              fill="url(#rp-grad)"
            />
          </svg>
          <span className="font-display text-base italic text-white/80">RoguePoints</span>
        </a>

        {/* User avatar */}
        <div className="pointer-events-auto rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-md p-0.5">
          <UserButton
            appearance={{
              variables: {
                colorBackground: "#13131a",
                colorText: "#ffffff",
                colorTextSecondary: "rgba(255,255,255,0.5)",
                colorPrimary: "#fbbf24",
                colorNeutral: "#ffffff",
                borderRadius: "12px",
              },
              elements: {
                avatarBox: "h-8 w-8",
                userButtonPopoverCard: {
                  background: "#13131a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                },
                userButtonPopoverActionButton: {
                  color: "rgba(255,255,255,0.75)",
                },
                userButtonPopoverActionButton__danger: {
                  color: "#f87171",
                },
                userButtonPopoverActionButtonText: {
                  color: "rgba(255,255,255,0.75)",
                },
                userButtonPopoverActionButtonIcon: {
                  color: "rgba(255,255,255,0.4)",
                },
                userButtonPopoverFooter: {
                  display: "none",
                },
                userPreviewMainIdentifier: {
                  color: "#ffffff",
                },
                userPreviewSecondaryIdentifier: {
                  color: "rgba(255,255,255,0.45)",
                },
              },
            }}
          />
        </div>
      </header>

      {/* ── Drop mode banner ── */}
      {dropMode && !composeOpen && (
        <div className="pointer-events-none absolute top-20 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/70 backdrop-blur-md px-5 py-2 text-sm text-amber-300">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.088 17 12.567 17 9A7 7 0 1 0 3 9c0 3.567 1.698 6.088 3.354 7.584a13.731 13.731 0 0 0 2.757 1.966l.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
            </svg>
            Tap anywhere on the map to drop your story
            <button
              className="pointer-events-auto ml-2 text-white/40 hover:text-white transition"
              onClick={() => setDropMode(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── FAB — Drop Story ── */}
      {!composeOpen && (
        <button
          onClick={() => setDropMode(!dropMode)}
          className={`absolute bottom-8 right-6 z-20 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-xl transition-all active:scale-95 ${
            dropMode
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-300"
              : "bg-amber-400 text-black hover:bg-amber-300 shadow-amber-400/30"
          }`}
          style={dropMode ? {} : { boxShadow: "0 0 32px rgba(251,191,36,0.35)" }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {dropMode ? (
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
            )}
          </svg>
          {dropMode ? "Cancel" : "Drop Story"}
        </button>
      )}

      {/* ── Overlays ── */}
      <ComposeModal />
      <PinDetail />
    </div>
  );
}
