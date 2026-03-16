"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useFeedStore } from "@/store/feed";
import { Pin } from "@/store/pins";

const CATEGORY_STYLES: Record<string, string> = {
  funny: "border-amber-400/40 text-amber-300",
  mystery: "border-purple-400/40 text-purple-300",
  danger: "border-red-400/40 text-red-300",
  legend: "border-blue-400/40 text-blue-300",
  wholesome: "border-emerald-400/40 text-emerald-300",
  other: "border-white/20 text-white/40",
};

const REACTIONS = [
  { key: "fireCount", emoji: "\u{1F525}", label: "fire" },
  { key: "laughCount", emoji: "\u{1F602}", label: "laugh" },
  { key: "heartCount", emoji: "\u2764\uFE0F", label: "heart" },
  { key: "skullCount", emoji: "\u{1F480}", label: "skull" },
  { key: "wowCount", emoji: "\u{1F62E}", label: "wow" },
] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Inline pin data with local reaction state
function usePinReactions(pin: Pin | null) {
  const [pinData, setPinData] = useState<Pin | null>(pin);
  const [myReactions, setMyReactions] = useState<Record<string, boolean>>({});
  const [reactingKind, setReactingKind] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  // Reset when pin changes
  useEffect(() => {
    setPinData(pin);
    setMyReactions({});
    setReactingKind(null);
  }, [pin?.id]);

  const handleReaction = useCallback(
    async (kind: string, countKey: string) => {
      if (!pinData || !isSignedIn || reactingKind) return;

      const alreadyReacted = myReactions[kind] ?? false;
      setReactingKind(kind);

      const delta = alreadyReacted ? -1 : 1;
      const currentCount = (pinData[countKey as keyof Pin] as number) ?? 0;
      const newCount = Math.max(0, currentCount + delta);

      // Optimistic update
      setPinData((prev) => (prev ? { ...prev, [countKey]: newCount } : prev));
      setMyReactions((prev) => ({ ...prev, [kind]: !alreadyReacted }));

      try {
        if (alreadyReacted) {
          const res = await fetch(`/api/pins/${pinData.id}/reactions?kind=${kind}`, {
            method: "DELETE",
          });
          if (!res.ok && res.status !== 204) throw new Error();
        } else {
          const res = await fetch(`/api/pins/${pinData.id}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind }),
          });
          if (!res.ok) throw new Error();
        }
      } catch {
        // Revert
        setPinData((prev) => (prev ? { ...prev, [countKey]: currentCount } : prev));
        setMyReactions((prev) => ({ ...prev, [kind]: alreadyReacted }));
      } finally {
        setReactingKind(null);
      }
    },
    [pinData, isSignedIn, myReactions, reactingKind]
  );

  return { pinData, myReactions, reactingKind, handleReaction };
}

function PinCard({ pin }: { pin: Pin }) {
  const { pinData, myReactions, reactingKind, handleReaction } = usePinReactions(pin);
  const { isSignedIn } = useUser();

  if (!pinData) return null;

  const catStyle = CATEGORY_STYLES[pinData.category] ?? CATEGORY_STYLES.other;

  return (
    <div className="flex flex-col gap-0">
      {/* Hero image */}
      {pinData.media && pinData.media.length > 0 && (
        <div className="relative w-full overflow-hidden bg-black/40" style={{ maxHeight: 280 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pinData.media[0].url}
            alt=""
            className="w-full object-cover"
            style={{ maxHeight: 280 }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-transparent to-transparent" />
        </div>
      )}

      <div className="px-5 pt-4 pb-2">
        {/* Category + time */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${catStyle}`}>
            {pinData.category}
          </span>
          <span className="text-[11px] text-white/25">{timeAgo(pinData.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl text-white leading-tight line-clamp-3 mb-3">
          {pinData.title}
        </h3>

        {/* Location */}
        <p className="text-[11px] text-white/30 font-mono mb-3">
          {pinData.lat.toFixed(4)}, {pinData.lng.toFixed(4)}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
          {pinData.author?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pinData.author.avatarUrl}
              alt={pinData.author.handle}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-bold flex-shrink-0">
              {pinData.author?.handle?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {/* Username stub — future: link to profile */}
          <span className="text-sm text-white/50 truncate">@{pinData.author?.handle ?? "unknown"}</span>
        </div>

        {/* Reactions */}
        <div className="flex gap-1.5 flex-wrap">
          {REACTIONS.map((r) => {
            const count = pinData[r.key as keyof Pin] as number;
            const active = myReactions[r.label] ?? false;
            return (
              <button
                key={r.key}
                onClick={() => handleReaction(r.label, r.key)}
                disabled={!isSignedIn || reactingKind !== null}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition active:scale-95 ${
                  active
                    ? "bg-white/15 border-white/20 text-white"
                    : "bg-white/5 border-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white/90"
                } disabled:cursor-not-allowed`}
              >
                {r.emoji}
                {count > 0 && (
                  <span className="text-xs text-white/40 font-medium tabular-nums">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FeedSidebar() {
  const { feedOpen, setFeedOpen, currentFeedPin, feedPins, feedIndex, loading, nextPin } =
    useFeedStore();
  const nextBtnRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [nextCooldown, setNextCooldown] = useState(false);

  const handleNext = useCallback(() => {
    if (nextCooldown) return;
    setNextCooldown(true);
    nextPin();
    clearTimeout(nextBtnRef.current);
    nextBtnRef.current = setTimeout(() => setNextCooldown(false), 600);
  }, [nextCooldown, nextPin]);

  if (!feedOpen) return null;

  const progress =
    feedPins.length > 0 ? Math.round(((feedIndex + 1) / feedPins.length) * 100) : 0;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] sm:hidden"
        onClick={() => setFeedOpen(false)}
      />

      {/* Sidebar panel */}
      <div
        className={[
          "fixed z-40 flex flex-col",
          // Mobile: modal overlay sliding down from top
          "inset-x-0 top-0 bottom-0 sm:inset-x-auto",
          // Desktop: right sidebar
          "sm:right-4 sm:top-4 sm:bottom-4 sm:w-[330px]",
          "rounded-b-3xl sm:rounded-3xl",
          "border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/70",
          "overflow-hidden",
          "animate-slide-up sm:animate-none",
        ].join(" ")}
        style={{
          // On desktop, slide in from right using CSS transform
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Feed icon */}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
              <path d="M3.75 3a.75.75 0 0 0 0 1.5h.75v.75a6.75 6.75 0 0 0 6.75 6.75h.75v.75a.75.75 0 0 0 1.5 0v-.75h.75a6.75 6.75 0 0 0 6.75-6.75V4.5h.75a.75.75 0 0 0 0-1.5H3.75Z" />
            </svg>
            <h2 className="font-display text-base italic text-white/80">Random Stories</h2>
          </div>
          <button
            onClick={() => setFeedOpen(false)}
            title="Close feed"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {feedPins.length > 0 && (
          <div className="h-0.5 bg-white/5 flex-shrink-0">
            <div
              className="h-full bg-amber-400/50 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {loading && !currentFeedPin ? (
            /* Loading skeleton */
            <div className="px-5 py-8 flex flex-col gap-4">
              <div className="h-40 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-4 rounded bg-white/5 animate-pulse w-3/4" />
              <div className="h-3 rounded bg-white/5 animate-pulse w-1/2" />
              <div className="h-3 rounded bg-white/5 animate-pulse w-2/3" />
            </div>
          ) : currentFeedPin ? (
            <PinCard key={currentFeedPin.id} pin={currentFeedPin} />
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="text-4xl">📍</div>
              <p className="text-white/50 text-sm">No stories to show yet.</p>
              <p className="text-white/25 text-xs">Be the first to drop a pin!</p>
            </div>
          )}
        </div>

        {/* Footer: counter + Next button */}
        <div className="px-5 py-4 border-t border-white/[0.06] flex-shrink-0 flex items-center gap-3">
          {feedPins.length > 0 && (
            <span className="text-xs text-white/25 tabular-nums flex-shrink-0">
              {feedIndex + 1} / {feedPins.length}
            </span>
          )}
          <button
            onClick={handleNext}
            disabled={nextCooldown || loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-amber-400 text-black text-sm font-semibold py-3 px-5 hover:bg-amber-300 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-400/20"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading…
              </>
            ) : (
              <>
                Next Story
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
