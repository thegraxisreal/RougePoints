"use client";

import { useState } from "react";
import { useSpotsStore } from "@/store/spots";

export function SpotCompose() {
  const { spotComposeOpen, pendingSpotCoords, closeSpotCompose, addSpot } =
    useSpotsStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!spotComposeOpen || !pendingSpotCoords) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !pendingSpotCoords) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          lat: pendingSpotCoords.lat,
          lng: pendingSpotCoords.lng,
          type: "school",
          adminCode: "1612",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create spot");
      }
      const spot = await res.json();
      addSpot(spot);
      setName("");
      closeSpotCompose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSpotCompose}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl text-white">Place a Spot</h2>
            <p className="text-xs text-white/35 mt-0.5 font-mono">
              {pendingSpotCoords.lat.toFixed(5)}, {pendingSpotCoords.lng.toFixed(5)}
            </p>
          </div>
          <button
            onClick={closeSpotCompose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Name <span className="text-white/20 normal-case tracking-normal">(e.g. Glens Falls High School)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 80))}
              placeholder="Enter spot name..."
              maxLength={80}
              required
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 transition"
            />
            <div className="text-right text-[10px] text-white/20 mt-1">{name.length}/80</div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeSpotCompose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white hover:bg-purple-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? "Placing..." : "Place Spot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
