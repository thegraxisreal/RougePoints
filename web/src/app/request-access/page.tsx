"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RequestAccess() {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      className="grain relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ── Ambient radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(251,191,36,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Faint grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Topo arcs (decorative) ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[160, 220, 290, 370, 460, 560].map((r) => (
          <circle
            key={r}
            cx="400"
            cy="430"
            r={r}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* ── Back link ── */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-[13px] text-white/30 transition-colors hover:text-amber-300"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Pin mark */}
        <div className="mb-8 relative">
          <svg viewBox="0 0 48 64" className="h-14 w-10" aria-hidden="true">
            <defs>
              <filter id="pin-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#fbbf24" floodOpacity="0.55" />
              </filter>
            </defs>
            <path
              d="M24 0C10.8 0 0 10.8 0 24c0 17 21 38.4 22.8 40.2.6.6 1.6.6 2.2 0C26.8 62.4 48 41 48 24 48 10.8 37.2 0 24 0z"
              fill="#fbbf24"
              filter="url(#pin-glow)"
            />
            <circle cx="24" cy="24" r="9.5" fill="white" opacity="0.92" />
          </svg>
          {/* Ripple */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-7 rounded-full"
            style={{
              background: "rgba(251,191,36,0.18)",
              animation: "pulse-soft 2.5s ease-in-out infinite",
            }}
          />
        </div>

        {/* Wordmark */}
        <p
          className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-white/25"
          style={{ fontFamily: "var(--font-body)" }}
        >
          RoguePoints
        </p>

        {/* Headline */}
        <h1
          className="mb-3 text-4xl sm:text-5xl tracking-tight text-white"
          style={{
            fontFamily: "var(--font-display)",
            lineHeight: 1.05,
          }}
        >
          Get on the map.
        </h1>

        <p className="mb-10 max-w-xs text-[15px] leading-relaxed text-white/35">
          Invite-only for now. Leave your email and we&rsquo;ll drop you in when a spot opens.
        </p>

        {submitted ? (
          /* ── Submitted state ── */
          <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.25)",
                boxShadow: "0 0 24px rgba(251,191,36,0.12)",
              }}
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#fbbf24" strokeWidth="2">
                <path d="M4 10l4.5 4.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-white/80">You&rsquo;re on the list.</p>
            <p className="text-[13px] leading-relaxed text-white/35">
              We&rsquo;ll reach out when your spot opens up.
            </p>
          </div>
        ) : (
          <>
            {/* Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="flex w-full max-w-sm flex-col gap-3"
            >
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border bg-white/[0.03] px-5 py-4 text-[15px] text-white placeholder:text-white/20 outline-none transition-all"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    caretColor: "#fbbf24",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.35)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl py-4 text-[15px] font-semibold text-black transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  boxShadow: "0 4px 24px rgba(251,191,36,0.25), 0 1px 0 rgba(255,255,255,0.1) inset",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 32px rgba(251,191,36,0.38), 0 1px 0 rgba(255,255,255,0.1) inset";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(251,191,36,0.25), 0 1px 0 rgba(255,255,255,0.1) inset";
                }}
              >
                Request access
              </button>
            </form>

            {/* Sign in */}
            <p className="mt-7 text-[13px] text-white/25">
              Already have an invite?{" "}
              <a href="#" className="text-white/40 underline underline-offset-2 hover:text-amber-300 transition-colors">
                Sign in →
              </a>
            </p>
          </>
        )}
      </div>

      {/* ── Bottom coordinates ── */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/12 tracking-widest select-none"
        style={{ color: "rgba(255,255,255,0.1)" }}
      >
        37.7749° N &nbsp;·&nbsp; 122.4194° W
      </p>
    </div>
  );
}
