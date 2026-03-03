"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RequestAccess() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  return (
    <div
      className="grain relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] py-16"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(251,191,36,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Topo arcs */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[160, 220, 290, 370, 460, 560].map((r) => (
          <circle key={r} cx="400" cy="430" r={r} fill="none" stroke="#fbbf24" strokeWidth="1" />
        ))}
      </svg>

      {/* Back link */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-[13px] text-white/30 transition-colors hover:text-amber-300"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 w-full"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Pin mark */}
        <div className="mb-6 relative">
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
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-7 rounded-full"
            style={{ background: "rgba(251,191,36,0.18)", animation: "pulse-soft 2.5s ease-in-out infinite" }}
          />
        </div>

        {/* Early badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/8 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-soft" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            Early Access
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-2 text-4xl sm:text-5xl tracking-tight text-white"
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.05 }}
        >
          You&rsquo;re in early.
        </h1>
        <p className="mb-8 max-w-xs text-[15px] leading-relaxed text-white/35">
          The map is just getting started. Sign in and drop the first pins.
        </p>

        {/* Clerk sign-in */}
        <SignIn
          routing="hash"
          appearance={{
            variables: {
              colorBackground: "#0d0d14",
              colorInputBackground: "#13131e",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.45)",
              colorPrimary: "#fbbf24",
              colorDanger: "#f87171",
              borderRadius: "1rem",
              fontFamily: "var(--font-body)",
            },
            elements: {
              card: "shadow-2xl shadow-black/60 border border-white/[0.06]",
              headerTitle: "font-display text-white",
              headerSubtitle: "text-white/40",
              socialButtonsBlockButton:
                "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors",
              formFieldInput:
                "border-white/[0.08] bg-white/[0.03] text-white focus:border-amber-400/40 focus:ring-amber-400/10",
              footerActionLink: "text-amber-400 hover:text-amber-300",
              dividerLine: "bg-white/[0.06]",
              dividerText: "text-white/30",
            },
          }}
        />
      </div>

      {/* Coordinates */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-mono tracking-widest select-none" style={{ color: "rgba(255,255,255,0.1)" }}>
        37.7749° N &nbsp;·&nbsp; 122.4194° W
      </p>
    </div>
  );
}
