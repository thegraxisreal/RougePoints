"use client";

import { useState } from "react";
import { useSpotsStore } from "@/store/spots";

export function SpotCompose() {
  const { spotComposeOpen, pendingSpotCoords, closeSpotCompose, addSpot } =
    useSpotsStore();
  const [name, setName] = useState("");
  const [type, setType] = useState("school");
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
          type,
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
      setType("school");
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

          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "school",
                  label: "School",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                      <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
                    </svg>
                  ),
                  color: "purple",
                },
                {
                  id: "park",
                  label: "Park",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.434.441 3.299.998a.75.75 0 0 1-.75 1.301A5.25 5.25 0 0 0 12 21a5.25 5.25 0 0 0-2.549.623.75.75 0 1 1-.75-1.3c.865-.558 2.006-.922 3.299-.999V6.241H7.957l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 6.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L5.668 6.241H3.75a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                  ),
                  color: "green",
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    type === t.id
                      ? t.color === "purple"
                        ? "border-purple-400/60 bg-purple-500/20 text-purple-300"
                        : "border-green-400/60 bg-green-500/20 text-green-300"
                      : "border-white/10 bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/20"
                  }`}
                >
                  {t.svg}
                  {t.label}
                </button>
              ))}
            </div>
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
