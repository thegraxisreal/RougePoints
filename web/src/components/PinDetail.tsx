"use client";

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
  { key: "fireCount", emoji: "🔥", label: "fire" },
  { key: "laughCount", emoji: "😂", label: "laugh" },
  { key: "heartCount", emoji: "❤️", label: "heart" },
  { key: "skullCount", emoji: "💀", label: "skull" },
  { key: "wowCount", emoji: "😮", label: "wow" },
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

export function PinDetail() {
  const { selectedPin, selectPin } = usePinsStore();

  if (!selectedPin) return null;

  const catStyle = CATEGORY_STYLES[selectedPin.category] ?? CATEGORY_STYLES.other;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 z-40 sm:hidden"
        onClick={() => selectPin(null)}
      />

      {/* Panel */}
      <div className="fixed z-40 bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 animate-slide-up">
        <div className="rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${catStyle}`}>
                  {selectedPin.category}
                </span>
                <span className="text-[11px] text-white/25">{timeAgo(selectedPin.createdAt)}</span>
              </div>
              <h3 className="font-display text-xl text-white leading-tight">{selectedPin.title}</h3>
            </div>
            <button
              onClick={() => selectPin(null)}
              className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          {/* Story body */}
          <p className="text-[15px] text-white/70 leading-relaxed font-display italic mb-5">
            &ldquo;{selectedPin.body}&rdquo;
          </p>

          {/* Author row */}
          <div className="flex items-center gap-2 mb-5">
            {selectedPin.author?.avatarUrl ? (
              <img
                src={selectedPin.author.avatarUrl}
                alt={selectedPin.author.handle}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-bold">
                {selectedPin.author?.handle?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-sm text-white/50">@{selectedPin.author?.handle ?? "unknown"}</span>
            <span className="text-[11px] text-white/20 font-mono ml-auto">
              {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
            </span>
          </div>

          {/* Reactions */}
          <div className="flex gap-2 flex-wrap">
            {REACTIONS.map((r) => {
              const count = selectedPin[r.key as keyof Pin] as number;
              return (
                <button
                  key={r.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/[0.06] px-3 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white/80 transition"
                >
                  {r.emoji}
                  {count > 0 && <span className="text-xs text-white/35">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
