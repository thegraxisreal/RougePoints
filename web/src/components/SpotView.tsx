"use client";
// v2
import { useEffect, useState } from "react";
import { useSpotsStore } from "@/store/spots";
import type { Pin } from "@/store/pins";

const CATEGORIES = [
  { id: "funny", label: "Funny", color: "border-amber-400/50 text-amber-300 bg-amber-400/10" },
  { id: "mystery", label: "Mystery", color: "border-purple-400/50 text-purple-300 bg-purple-400/10" },
  { id: "danger", label: "Danger", color: "border-red-400/50 text-red-300 bg-red-400/10" },
  { id: "legend", label: "Legend", color: "border-blue-400/50 text-blue-300 bg-blue-400/10" },
  { id: "wholesome", label: "Wholesome", color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10" },
  { id: "other", label: "Other", color: "border-white/20 text-white/50 bg-white/5" },
] as const;

const CATEGORY_BADGE: Record<string, string> = {
  funny: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  mystery: "border-purple-400/40 text-purple-300 bg-purple-400/10",
  danger: "border-red-400/40 text-red-300 bg-red-400/10",
  legend: "border-blue-400/40 text-blue-300 bg-blue-400/10",
  wholesome: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  other: "border-white/20 text-white/40 bg-white/5",
};

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

function PinCard({ pin }: { pin: Pin }) {
  const badge = CATEGORY_BADGE[pin.category] ?? CATEGORY_BADGE.other;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 hover:bg-white/[0.05] transition">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${badge}`}>
          {pin.category}
        </span>
        <span className="text-[10px] text-white/25">{timeAgo(pin.createdAt)}</span>
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{pin.title}</h4>
      <p className="text-sm text-white/50 italic font-display leading-relaxed">
        &ldquo;{pin.body}&rdquo;
      </p>
      <div className="flex items-center gap-2 mt-3">
        {pin.author?.avatarUrl ? (
          <img
            src={pin.author.avatarUrl}
            alt={pin.author.handle}
            className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="h-5 w-5 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-[9px] font-bold">
            {pin.author?.handle?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="text-xs text-white/40">@{pin.author?.handle ?? "unknown"}</span>
      </div>
    </div>
  );
}

export function SpotView() {
  const { selectedSpot, spotPins, selectSpot, setSpotPins, addSpotPin } =
    useSpotsStore();

  const [loading, setLoading] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("funny");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pins when a spot is selected
  useEffect(() => {
    if (!selectedSpot) return;
    setLoading(true);
    fetch(`/api/spots/${selectedSpot.id}/pins`)
      .then((r) => (r.ok ? r.json() : []))
      .then((pins) => setSpotPins(pins))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedSpot, setSpotPins]);

  if (!selectedSpot) return null;

  async function handleSubmitPin(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !selectedSpot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/spots/${selectedSpot.id}/pins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          category,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to add story");
      }
      const pin = await res.json();
      addSpotPin(pin);
      setTitle("");
      setBody("");
      setCategory("funny");
      setComposeOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          {/* Spot icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-400/30">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-400">
              <path d="M9.674 2.075a.75.75 0 0 1 .652 0l7.25 3.5A.75.75 0 0 1 17.5 7v.005a.75.75 0 0 1-.076.337l-.002.003-.002.004A.75.75 0 0 1 17 7.75h-.25v4.505a.75.75 0 0 1-.154.46L10.324 17.9a.75.75 0 0 1-1.148 0L2.904 12.715a.75.75 0 0 1-.154-.46V7.75H2.5a.75.75 0 0 1-.326-1.425l7.25-3.5ZM4.25 7.75v4.192l5.75 4.457 5.75-4.457V7.75H4.25Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl text-white">{selectedSpot.name}</h1>
            <p className="text-xs text-white/30 font-mono">
              {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}
            </p>
          </div>
        </div>
        <button
          onClick={() => selectSpot(null)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </header>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/30 text-sm">Loading stories...</div>
          </div>
        ) : spotPins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-white/30 text-sm">No stories here yet.</p>
            <p className="text-white/20 text-xs">Be the first to drop one!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {spotPins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        )}
      </div>

      {/* Add pin FAB */}
      {!composeOpen && (
        <button
          onClick={() => setComposeOpen(true)}
          className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black shadow-xl hover:bg-amber-300 transition active:scale-95"
          style={{ boxShadow: "0 0 32px rgba(251,191,36,0.35)" }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
          </svg>
          Add Pin
        </button>
      )}

      {/* Inline compose form */}
      {composeOpen && (
        <div className="border-t border-white/[0.06] px-5 py-5 sm:px-8 bg-[#13131a]">
          <form onSubmit={handleSubmitPin} className="max-w-lg mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base text-white">New Pin</h3>
              <button
                type="button"
                onClick={() => { setComposeOpen(false); setError(null); }}
                className="text-white/30 hover:text-white text-sm transition"
              >
                Cancel
              </button>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
                    category === cat.id
                      ? cat.color
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              placeholder="Title (max 60)"
              maxLength={60}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 280))}
              placeholder="Tell your story... (max 280)"
              maxLength={280}
              rows={3}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
            />
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting || !title.trim() || !body.trim()}
              className="rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Dropping..." : "Drop Pin"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
