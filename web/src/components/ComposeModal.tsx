"use client";

import { useState } from "react";
import { usePinsStore } from "@/store/pins";

const CATEGORIES = [
  { id: "funny", label: "Funny", color: "border-amber-400/50 text-amber-300 bg-amber-400/10" },
  { id: "mystery", label: "Mystery", color: "border-purple-400/50 text-purple-300 bg-purple-400/10" },
  { id: "danger", label: "Danger", color: "border-red-400/50 text-red-300 bg-red-400/10" },
  { id: "legend", label: "Legend", color: "border-blue-400/50 text-blue-300 bg-blue-400/10" },
  { id: "wholesome", label: "Wholesome", color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10" },
  { id: "other", label: "Other", color: "border-white/20 text-white/50 bg-white/5" },
] as const;

export function ComposeModal() {
  const { composeOpen, pendingCoords, closeCompose, addPin } = usePinsStore();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("funny");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!composeOpen || !pendingCoords) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !pendingCoords) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: pendingCoords.lat,
          lng: pendingCoords.lng,
          title: title.trim(),
          body: body.trim(),
          category,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to drop pin");
      }
      const pin = await res.json();
      addPin(pin);
      setTitle("");
      setBody("");
      setCategory("funny");
      closeCompose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCompose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl text-white">Drop a Story</h2>
            <p className="text-xs text-white/35 mt-0.5 font-mono">
              {pendingCoords.lat.toFixed(5)}, {pendingCoords.lng.toFixed(5)}
            </p>
          </div>
          <button
            onClick={closeCompose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category pills */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">Vibe</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    category === cat.id
                      ? cat.color
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Title <span className="text-white/20 normal-case tracking-normal">(max 60)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              placeholder="The night everything went wrong..."
              maxLength={60}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
            />
            <div className="text-right text-[10px] text-white/20 mt-1">{title.length}/60</div>
          </div>

          {/* Body */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Story <span className="text-white/20 normal-case tracking-normal">(max 280)</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 280))}
              placeholder="Keep it raw. The best stories never need editing..."
              maxLength={280}
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
            />
            <div className="text-right text-[10px] text-white/20 mt-1">{body.length}/280</div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeCompose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !body.trim()}
              className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? "Dropping..." : "Drop it"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
