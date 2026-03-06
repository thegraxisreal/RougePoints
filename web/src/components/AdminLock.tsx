"use client";

import { useState } from "react";
import { useSpotsStore } from "@/store/spots";
import { useClusterLabelsStore } from "@/store/clusterLabels";

export function AdminLock() {
  const { isAdmin, setAdmin, spotDropMode, setSpotDropMode } = useSpotsStore();
  const { townDropMode, setTownDropMode } = useClusterLabelsStore();
  const [showDialog, setShowDialog] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      setAdmin(true, code);
      setShowDialog(false);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  // If already admin, show the "Place Spot" button
  if (isAdmin) {
    return (
      <div className="absolute bottom-8 left-6 z-20 flex flex-col gap-2">
        <button
          onClick={() => { setSpotDropMode(!spotDropMode); if (!spotDropMode) setTownDropMode(false); }}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-xl transition-all active:scale-95 ${
            spotDropMode
              ? "bg-purple-400/20 border border-purple-400/50 text-purple-300"
              : "bg-purple-500 text-white hover:bg-purple-400 shadow-purple-500/30"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {spotDropMode ? (
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            ) : (
              <path d="M9.674 2.075a.75.75 0 0 1 .652 0l7.25 3.5A.75.75 0 0 1 17.5 7v.005a.75.75 0 0 1-.076.337l-.002.003-.002.004A.75.75 0 0 1 17 7.75h-.25v4.505a.75.75 0 0 1-.154.46L10.324 17.9a.75.75 0 0 1-1.148 0L2.904 12.715a.75.75 0 0 1-.154-.46V7.75H2.5a.75.75 0 0 1-.326-1.425l7.25-3.5ZM4.25 7.75v4.192l5.75 4.457 5.75-4.457V7.75H4.25Z" />
            )}
          </svg>
          {spotDropMode ? "Cancel" : "Place Spot"}
        </button>
        <button
          onClick={() => { setTownDropMode(!townDropMode); if (!townDropMode) setSpotDropMode(false); }}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-xl transition-all active:scale-95 ${
            townDropMode
              ? "bg-rose-400/20 border border-rose-400/50 text-rose-300"
              : "bg-rose-500 text-white hover:bg-rose-400 shadow-rose-500/30"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            {townDropMode ? (
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            ) : (
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.088 17 12.567 17 9A7 7 0 1 0 3 9c0 3.567 1.698 6.088 3.354 7.584a13.731 13.731 0 0 0 2.757 1.966l.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
            )}
          </svg>
          {townDropMode ? "Cancel" : "Place Town"}
        </button>
        <button
          onClick={() => { setAdmin(false); setSpotDropMode(false); setTownDropMode(false); }}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Lock
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Lock icon */}
      <button
        onClick={() => setShowDialog(true)}
        className="absolute bottom-8 left-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-md text-white/30 hover:text-white/60 hover:bg-black/70 transition"
        title="Admin access"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Code dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowDialog(false); setCode(""); setError(false); }}
          />
          <div className="relative w-full max-w-xs rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 p-6">
            <h2 className="font-display text-lg text-white mb-1">Admin Access</h2>
            <p className="text-xs text-white/35 mb-4">Enter the admin code to continue.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(false); }}
                placeholder="Code"
                autoFocus
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none bg-white/[0.04] transition ${
                  error
                    ? "border-red-400/50 focus:border-red-400/70 focus:ring-1 focus:ring-red-400/20"
                    : "border-white/10 focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20"
                }`}
              />
              {error && (
                <p className="text-xs text-red-400">Wrong code. Try again.</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowDialog(false); setCode(""); setError(false); }}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !code}
                  className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {loading ? "..." : "Unlock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
