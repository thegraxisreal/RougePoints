"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { usePinsStore, Pin } from "@/store/pins";

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

type MediaItem = NonNullable<Pin["media"]>[number];

const S3_BASE = process.env.NEXT_PUBLIC_S3_PUBLIC_URL ?? "";

export function PinDetail() {
  const { selectedPin, selectPin, removePin, updatePin } = usePinsStore();
  const { isSignedIn } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Track which reactions the current user has toggled (kind -> true/false)
  const [myReactions, setMyReactions] = useState<Record<string, boolean>>({});
  const [reactingKind, setReactingKind] = useState<string | null>(null);
  // Local media state — populated directly from fetch, not via store re-render chain
  const [displayMedia, setDisplayMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setCurrentUserId(data?.id ?? null))
      .catch(() => setCurrentUserId(null));
  }, [isSignedIn]);

  // Re-fetch fresh pin data (with media) whenever a different pin is selected
  useEffect(() => {
    setDeleteError(null);
    setMyReactions({});

    if (!selectedPin?.id) {
      setDisplayMedia([]);
      return;
    }

    // Seed with whatever the store already has (may be empty on first open)
    setDisplayMedia(selectedPin.media ?? []);

    fetch(`/api/pins/${selectedPin.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        // Update the store so the map marker / title card also refreshes
        updatePin(data.id, data);
        // Update local display state directly — don't rely on Zustand re-render
        setDisplayMedia(data.media ?? []);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPin?.id]);

  const handleReaction = useCallback(async (kind: string, countKey: string) => {
    if (!selectedPin || !isSignedIn || reactingKind) return;

    const alreadyReacted = myReactions[kind] ?? false;
    setReactingKind(kind);

    // Optimistic update
    const delta = alreadyReacted ? -1 : 1;
    const currentCount = (selectedPin[countKey as keyof Pin] as number) ?? 0;
    const newCount = Math.max(0, currentCount + delta);
    updatePin(selectedPin.id, { [countKey]: newCount });
    setMyReactions((prev) => ({ ...prev, [kind]: !alreadyReacted }));

    try {
      if (alreadyReacted) {
        const res = await fetch(`/api/pins/${selectedPin.id}/reactions?kind=${kind}`, {
          method: "DELETE",
        });
        if (!res.ok && res.status !== 204) throw new Error();
      } else {
        const res = await fetch(`/api/pins/${selectedPin.id}/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind }),
        });
        if (!res.ok) throw new Error();
      }
    } catch {
      // Revert on failure
      updatePin(selectedPin.id, { [countKey]: currentCount });
      setMyReactions((prev) => ({ ...prev, [kind]: alreadyReacted }));
    } finally {
      setReactingKind(null);
    }
  }, [selectedPin, isSignedIn, myReactions, reactingKind, updatePin]);

  if (!selectedPin) return null;

  const catStyle = CATEGORY_STYLES[selectedPin.category] ?? CATEGORY_STYLES.other;
  const isAuthor = currentUserId !== null && currentUserId === selectedPin.authorId;

  async function handleDelete() {
    if (!selectedPin) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/pins/${selectedPin.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete pin");
      }
      removePin(selectedPin.id);
      selectPin(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Backdrop — tinted overlay on mobile, click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
        onClick={() => selectPin(null)}
      />

      {/* Panel — centered bottom sheet */}
      <div className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] animate-slide-up">
        <div className="rounded-t-3xl sm:rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/70 overflow-hidden">

          {/* Drag handle — also acts as a close target on mobile */}
          <div
            className="flex justify-center pt-3.5 pb-2 cursor-pointer sm:cursor-default"
            onClick={() => selectPin(null)}
          >
            <div className="h-1.5 w-14 rounded-full bg-white/20" />
          </div>

          <div className="px-6 pb-7">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${catStyle}`}>
                    {selectedPin.category}
                  </span>
                  <span className="text-[11px] text-white/25">{timeAgo(selectedPin.createdAt)}</span>
                </div>
                <h3 className="font-display text-2xl text-white leading-tight">{selectedPin.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                {isAuthor && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete your pin"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-40"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => selectPin(null)}
                  title="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white/50 hover:text-white hover:bg-white/15 transition"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
              {selectedPin.author?.avatarUrl ? (
                <img
                  src={selectedPin.author.avatarUrl}
                  alt={selectedPin.author.handle}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-sm font-bold flex-shrink-0">
                  {selectedPin.author?.handle?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <span className="text-sm text-white/55 flex-1 min-w-0 truncate">@{selectedPin.author?.handle ?? "unknown"}</span>
              <span className="text-[11px] text-white/20 font-mono flex-shrink-0">
                {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
              </span>
            </div>

            {/* Images */}
            {displayMedia.length > 0 && S3_BASE && (
              <div className="mb-5 -mx-1">
                <div className="flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide">
                  {displayMedia.map((m) => (
                    <img
                      key={m.id}
                      src={`${S3_BASE}/${m.s3Key}`}
                      alt=""
                      className="h-48 max-h-64 w-auto rounded-xl object-cover border border-white/[0.06] flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}

            {deleteError && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}

            {/* Reactions */}
            <div className="flex gap-2 flex-wrap">
              {REACTIONS.map((r) => {
                const count = selectedPin[r.key as keyof Pin] as number;
                const active = myReactions[r.label] ?? false;
                return (
                  <button
                    key={r.key}
                    onClick={() => handleReaction(r.label, r.key)}
                    disabled={!isSignedIn || reactingKind !== null}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-base transition active:scale-95 ${
                      active
                        ? "bg-white/15 border-white/20 text-white"
                        : "bg-white/5 border-white/[0.06] text-white/60 hover:bg-white/10 hover:text-white/90"
                    } disabled:cursor-not-allowed`}
                  >
                    {r.emoji}
                    {count > 0 && <span className="text-xs text-white/40 font-medium tabular-nums">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
