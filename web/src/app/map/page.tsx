"use client";

import dynamic from "next/dynamic";
import { UserButton } from "@clerk/nextjs";
import { usePinsStore, Pin } from "@/store/pins";
import { useSpotsStore, Spot } from "@/store/spots";
import { ComposeModal } from "@/components/ComposeModal";
import { PinDetail } from "@/components/PinDetail";
import { AdminLock } from "@/components/AdminLock";
import { SpotCompose } from "@/components/SpotCompose";
import { SpotView } from "@/components/SpotView";
import { useCallback, useState } from "react";

const AppMap = dynamic(
  () => import("@/components/AppMap").then((m) => m.AppMap),
  { ssr: false }
);

export default function MapPage() {
  const [lightMode, setLightMode] = useState(true);
  const [satelliteMode, setSatelliteMode] = useState(false);
  const { dropMode, setDropMode, selectPin, composeOpen } = usePinsStore();
  const { spotDropMode, spotComposeOpen, selectSpot } = useSpotsStore();

  const handlePinClick = useCallback(
    (pin: Pin) => selectPin(pin),
    [selectPin]
  );

  const handleSpotClick = useCallback(
    (spot: Spot) => selectSpot(spot),
    [selectSpot]
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Full-screen map */}
      <AppMap onPinClick={handlePinClick} onSpotClick={handleSpotClick} lightMode={lightMode} satelliteMode={satelliteMode} />

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

        {/* Map mode toggles */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-md px-1 py-1">
          {/* Light / Dark toggle */}
          <button
            onClick={() => { if (!satelliteMode) setLightMode((v) => !v); }}
            title={satelliteMode ? "Disable satellite to toggle" : lightMode ? "Switch to dark map" : "Switch to light map"}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              satelliteMode
                ? "text-white/25 cursor-not-allowed"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {lightMode && !satelliteMode ? (
              /* Moon icon */
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd"/>
              </svg>
            ) : (
              /* Sun icon */
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06L5.404 4.343a.75.75 0 1 0-1.06 1.06l1.06 1.061Z"/>
              </svg>
            )}
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-white/10" />

          {/* Satellite toggle */}
          <button
            onClick={() => setSatelliteMode((v) => !v)}
            title={satelliteMode ? "Switch to street map" : "Switch to satellite"}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              satelliteMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {/* Globe / satellite icon */}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M16.555 5.412a8.028 8.028 0 0 0-3.503-2.81 14.899 14.899 0 0 1 1.663 4.472 8.547 8.547 0 0 0 1.84-1.662ZM13.326 7.825a13.164 13.164 0 0 0-2.413-5.773 8.117 8.117 0 0 0-1.826 0 13.164 13.164 0 0 0-2.413 5.773A8.473 8.473 0 0 0 10 8.5c1.18 0 2.304-.24 3.326-.675ZM14.8 9.167a9.983 9.983 0 0 1-3.726 1.07 14.88 14.88 0 0 1 .676 4.608 8.017 8.017 0 0 0 3.274-4.166 8.095 8.095 0 0 0-.223-1.512ZM10 18a7.985 7.985 0 0 0 1.088-.076 13.36 13.36 0 0 0-.677-4.68A8.467 8.467 0 0 0 10 13.5a8.467 8.467 0 0 0-.411-.256 13.36 13.36 0 0 0-.677 4.68A7.984 7.984 0 0 0 10 18ZM5.2 9.167a8.095 8.095 0 0 0-.224 1.512 8.017 8.017 0 0 0 3.275 4.166 14.88 14.88 0 0 1 .675-4.607A9.983 9.983 0 0 1 5.2 9.167ZM6.948 2.602a8.028 8.028 0 0 0-3.503 2.81 8.547 8.547 0 0 0 1.84 1.662 14.899 14.899 0 0 1 1.663-4.472Z"/>
            </svg>
          </button>
        </div>

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

      {/* ── Spot drop mode banner ── */}
      {spotDropMode && !spotComposeOpen && (
        <div className="pointer-events-none absolute top-20 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-black/70 backdrop-blur-md px-5 py-2 text-sm text-purple-300">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9.674 2.075a.75.75 0 0 1 .652 0l7.25 3.5A.75.75 0 0 1 17.5 7v.005a.75.75 0 0 1-.076.337l-.002.003-.002.004A.75.75 0 0 1 17 7.75h-.25v4.505a.75.75 0 0 1-.154.46L10.324 17.9a.75.75 0 0 1-1.148 0L2.904 12.715a.75.75 0 0 1-.154-.46V7.75H2.5a.75.75 0 0 1-.326-1.425l7.25-3.5ZM4.25 7.75v4.192l5.75 4.457 5.75-4.457V7.75H4.25Z" />
            </svg>
            Tap anywhere on the map to place a spot
            <button
              className="pointer-events-auto ml-2 text-white/40 hover:text-white transition"
              onClick={() => useSpotsStore.getState().setSpotDropMode(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── FAB — Drop Pin ── */}
      {!composeOpen && !spotComposeOpen && (
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
          {dropMode ? "Cancel" : "Drop Pin"}
        </button>
      )}

      {/* ── Admin lock (bottom-left) ── */}
      <AdminLock />

      {/* ── Overlays ── */}
      <ComposeModal />
      <SpotCompose />
      <PinDetail />
      <SpotView />
    </div>
  );
}
