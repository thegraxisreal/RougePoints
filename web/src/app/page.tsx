"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
import { InviteModal } from "@/components/InviteModal";

/* Leaflet must be client-only (no SSR) */
const LandingMap = dynamic(
  () => import("@/components/LandingMap").then((m) => m.LandingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-2xl bg-zinc-900" />
    ),
  }
);

/* ── Static data ── */

const HOW_STEPS = [
  {
    icon: "📍",
    num: "01",
    title: "Drop a pin",
    desc: "Tap anywhere on the map. Your street corner, a mountain you climbed, that one table at the back of a bar.",
    color: "red" as const,
  },
  {
    icon: "✍️",
    num: "02",
    title: "Write the story",
    desc: "Text, a photo, a voice note. Keep it raw. Don't overthink it. The best stories never do.",
    color: "green" as const,
  },
  {
    icon: "🔍",
    num: "03",
    title: "Others find it",
    desc: "Nearby users discover your pin. Some stories only reveal when they're close enough to deserve it.",
    color: "blue" as const,
  },
];

const STORIES = [
  {
    id: 1,
    user: "Sam R.",
    location: "Barcelona, ES",
    story:
      "Hidden jazz club behind the bakery on Carrer del Parlament. Ask for Marta. No sign, just knock.",
    tag: "secret",
    tagClass: "border-blue-400/60 text-blue-300",
    nameClass: "text-blue-300",
    borderClass: "hover:border-blue-400/40",
    reactions: [
      { emoji: "😮", count: 47 },
      { emoji: "🔥", count: 23 },
    ],
    nearby: 8,
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=240&q=60",
  },
  {
    id: 2,
    user: "Jules T.",
    location: "Brooklyn, NY",
    story:
      "Best dumplings in New York. Cash only. No menu. Order from the basement window around back.",
    tag: "legend",
    tagClass: "border-green-400/60 text-green-300",
    nameClass: "text-green-300",
    borderClass: "hover:border-green-400/40",
    reactions: [
      { emoji: "🔥", count: 91 },
      { emoji: "❤️", count: 34 },
    ],
    nearby: 12,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=60",
  },
  {
    id: 3,
    user: "Kenji S.",
    location: "Shinjuku, JP",
    story:
      "The ghost in Room 27 knocks twice at 2am. Three of us heard it. Staff just smiled when we asked.",
    tag: "mystery",
    tagClass: "border-red-400/60 text-red-300",
    nameClass: "text-red-300",
    borderClass: "hover:border-red-400/40",
    reactions: [
      { emoji: "😮", count: 203 },
      { emoji: "👻", count: 87 },
    ],
    nearby: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=60",
  },
  {
    id: 4,
    user: "Mia C.",
    location: "New Orleans, LA",
    story:
      "The oak at the end of Magazine St has 47 names carved into it. I added mine at 3am. Check the roots.",
    tag: "funny",
    tagClass: "border-yellow-400/60 text-yellow-300",
    nameClass: "text-yellow-300",
    borderClass: "hover:border-yellow-400/40",
    reactions: [
      { emoji: "❤️", count: 156 },
      { emoji: "😄", count: 72 },
    ],
    nearby: 3,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=60",
  },
];

const FEATURES = [
  {
    icon: "🧭",
    title: "Drop Pins Anywhere",
    desc: "From your hometown alley to a mountain ridge—your map, your lore.",
    border: "hover:border-blue-400/50",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
  },
  {
    icon: "✍️",
    title: "Tell the Story",
    desc: "Attach text, pics, or voice notes. Keep it raw, short, and real.",
    border: "hover:border-green-400/50",
    bg: "bg-green-500/15",
    text: "text-green-300",
  },
  {
    icon: "😄",
    title: "React with Vibes",
    desc: "Laugh, gasp, or drop a 🔥—quick reactions keep the map playful.",
    border: "hover:border-yellow-400/60",
    bg: "bg-yellow-400/15",
    text: "text-yellow-300",
  },
  {
    icon: "🕵️‍♀️",
    title: "Find the Hidden",
    desc: "Hunt down mysteries and secret spots. Some pins only reveal nearby.",
    border: "hover:border-red-400/60",
    bg: "bg-red-500/15",
    text: "text-red-300",
  },
];

/* ── Page ── */

export default function Home() {
  /* Scroll-reveal IntersectionObserver */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Scroll-driven SVG pin animation */
  useEffect(() => {
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mapSection = document.getElementById("map-preview");
    const svg = document.getElementById("previewMap");
    if (!mapSection || !svg || REDUCED) return;

    const path = svg.querySelector("#routePath") as SVGPathElement | null;
    const pin = svg.querySelector("#pin") as SVGGElement | null;
    if (!path || !pin) return;

    const total = path.getTotalLength();
    let dropped = false;
    let dropOffset = 0;
    let dropRAF: number | null = null;

    const clamp = (v: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, v));

    function placePin(progress: number) {
      const d = progress * total;
      const p = path!.getPointAtLength(d);
      const p2 = path!.getPointAtLength(Math.min(total, d + 0.5));
      const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      pin!.setAttribute(
        "transform",
        `translate(${p.x} ${p.y + dropOffset}) rotate(${angle})`
      );
      path!.setAttribute("stroke-dasharray", `${total}`);
      path!.setAttribute("stroke-dashoffset", `${(1 - progress) * total}`);
    }

    function progress() {
      const rect = mapSection!.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh - rect.top) / (vh + rect.height * 0.2), 0, 1);
    }

    function drop() {
      if (dropRAF) cancelAnimationFrame(dropRAF);
      const start = performance.now();
      function easeOutBack(x: number) {
        const c1 = 1.70158,
          c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      }
      function step(now: number) {
        const t = clamp((now - start) / 450, 0, 1);
        dropOffset = -14 * (1 - easeOutBack(t));
        placePin(progress());
        if (t < 1) dropRAF = requestAnimationFrame(step);
        else {
          dropRAF = null;
          dropOffset = 0;
          placePin(progress());
        }
      }
      dropRAF = requestAnimationFrame(step);
    }

    placePin(0);

    let scheduled = false;
    function onScroll() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        const p = progress();
        placePin(p);
        if (p > 0.92 && !dropped) {
          dropped = true;
          drop();
        }
        if (p < 0.1) {
          dropped = false;
          dropOffset = 0;
        }
        scheduled = false;
      });
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener("scroll", onScroll);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(mapSection);
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (dropRAF) cancelAnimationFrame(dropRAF);
    };
  }, []);

  return (
    <>
      {/* ════════════════════════════════
          NAV
      ════════════════════════════════ */}
      <header className="sticky top-0 z-[1000] backdrop-blur supports-[backdrop-filter]:bg-black/50 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="#home" className="inline-flex items-center gap-3 group">
              <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7">
                <defs>
                  <linearGradient id="rgp-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#f87171" />
                    <stop offset="1" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                  fill="url(#rgp-grad)"
                />
              </svg>
              <span className="font-semibold tracking-tight">RoguePoints</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="#how-it-works"
                className="text-sm text-white/70 hover:text-white transition"
              >
                How it works
              </a>
              <a
                href="#stories"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Stories
              </a>
              <a
                href="#features"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Features
              </a>
              <InviteModal>
                <button className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition cursor-pointer">
                  Get Started
                </button>
              </InviteModal>
            </nav>

            {/* Mobile CTA */}
            <InviteModal>
              <button className="md:hidden inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition cursor-pointer">
                Get Started
              </button>
            </InviteModal>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-20 sm:py-28 md:py-32">
            <div className="grid items-center gap-12 md:grid-cols-2">

              {/* Left: Headline */}
              <div className="max-w-xl" data-animate>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Invite-only beta — request access below
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                  Every place has a story.{" "}
                  <span className="text-white/50">Pin yours.</span>
                </h1>
                <p className="mt-5 text-lg text-white/60 leading-relaxed">
                  RoguePoints is a social, story-driven map. Drop pins anywhere
                  and attach the moments that never make it to Instagram—urban
                  legends, funny mishaps, secret spots, epic nights.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <InviteModal>
                    <button className="inline-flex items-center rounded-full bg-green-500 px-6 py-3 font-semibold text-black hover:bg-green-400 active:scale-[.98] transition cursor-pointer">
                      Request Access
                    </button>
                  </InviteModal>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white/80 hover:bg-white/5 active:scale-[.98] transition"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              {/* Right: Real Leaflet map */}
              <div className="mx-auto w-full max-w-xl" data-animate>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 h-[420px] sm:h-[480px]">
                  <LandingMap />
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/60 z-20">
                    Click pins for stories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 text-center" data-animate>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-white/60 max-w-lg mx-auto">
              Three steps between you and your story living on the map forever.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-12 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {HOW_STEPS.map((step) => {
              const numClass =
                step.color === "red"
                  ? "text-red-400 border-red-500/30 bg-red-500/10"
                  : step.color === "green"
                  ? "text-green-400 border-green-500/30 bg-green-500/10"
                  : "text-blue-400 border-blue-500/30 bg-blue-500/10";
              const iconBg =
                step.color === "red"
                  ? "bg-red-500/10"
                  : step.color === "green"
                  ? "bg-green-500/10"
                  : "bg-blue-500/10";
              return (
                <div
                  key={step.num}
                  className="relative rounded-2xl border border-white/8 bg-zinc-950/60 p-8 text-center"
                  data-animate
                >
                  <div
                    className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${iconBg} text-2xl`}
                  >
                    {step.icon}
                  </div>
                  <div
                    className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold ${numClass}`}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STORY CARDS
      ════════════════════════════════ */}
      <section id="stories" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center" data-animate>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Stories on the map
            </h2>
            <p className="mt-3 text-white/60 max-w-lg mx-auto">
              These are the kinds of stories RoguePoints was built for. Real
              places. Real moments. Not for the feed.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STORIES.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col rounded-2xl border border-white/8 bg-zinc-950/80 p-5 transition hover:scale-[1.02] ${s.borderClass}`}
                data-animate
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={s.avatar}
                    alt={`Portrait of ${s.user}`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${s.nameClass}`}>
                      {s.user}
                    </p>
                    <p className="text-xs text-white/50 truncate">{s.location}</p>
                  </div>
                </div>

                {/* Story text */}
                <p className="flex-1 text-sm text-white/80 leading-relaxed">
                  &ldquo;{s.story}&rdquo;
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-3">
                    {s.reactions.map((r) => (
                      <span
                        key={r.emoji}
                        className="inline-flex items-center gap-1 text-xs text-white/50"
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${s.tagClass}`}
                  >
                    {s.tag}
                  </span>
                </div>

                {/* Nearby indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-white/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500/70" />
                  {s.nearby} people nearby
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          WHY ROGUEPOINTS
      ════════════════════════════════ */}
      <section className="py-20 sm:py-28 border-y border-white/5 bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left: Statement */}
            <div data-animate>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/30">
                Why RoguePoints
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Not for the{" "}
                <span className="text-white/40">highlight reel.</span>
              </h2>
              <p className="mt-6 text-lg text-white/60 leading-relaxed">
                The best stories about a place live in voice memos, group chats,
                and bar napkins. They die there, too. RoguePoints puts them where
                they belong — on the map, exactly where they happened, forever.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  {
                    no: "Instagram",
                    yes: "Raw and unfiltered",
                    icon: "📸",
                  },
                  {
                    no: "Google Maps star ratings",
                    yes: "Human stories with context",
                    icon: "🗺️",
                  },
                  {
                    no: "Stories that disappear",
                    yes: "A permanent address on the map",
                    icon: "💬",
                  },
                ].map((row) => (
                  <div
                    key={row.no}
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-zinc-900/60 px-4 py-3"
                  >
                    <span className="text-xl">{row.icon}</span>
                    <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                      <span className="text-white/35 line-through">{row.no}</span>
                      <span className="text-white/20">→</span>
                      <span className="text-white/80 font-medium">{row.yes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Scroll-animated map pin demo */}
            <div id="map-preview" className="flex items-center gap-8 lg:flex-row flex-col" data-animate>
              <div className="w-full max-w-xs">
                <div className="rounded-2xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/30 p-5">
                  <svg id="previewMap" viewBox="0 0 300 300" className="h-full w-full">
                    <defs>
                      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" stroke="rgba(255,255,255,0.08)" fill="none" strokeWidth="1" />
                      </pattern>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.9" />
                      </filter>
                    </defs>
                    <rect x="0" y="0" width="300" height="300" fill="url(#grid)" />
                    <rect x="18" y="18" width="90" height="60" fill="rgba(255,255,255,0.04)" />
                    <rect x="210" y="28" width="72" height="46" fill="rgba(255,255,255,0.04)" />
                    <rect x="200" y="200" width="86" height="70" fill="rgba(255,255,255,0.04)" />
                    <rect x="28" y="188" width="70" height="86" fill="rgba(255,255,255,0.04)" />
                    <path
                      id="routePath"
                      d="M40 250 C 80 180, 60 150, 120 130 S 220 100, 210 70 S 140 80, 170 150 S 240 210, 260 240"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6 8"
                    />
                    <g id="pin" filter="url(#glow)" transform="translate(40,250)">
                      <path d="M0 0 L6 -10 L-6 -10 Z" fill="#ef4444" />
                      <circle cx="0" cy="-16" r="9" fill="#ef4444" />
                      <circle cx="0" cy="-16" r="4.5" fill="rgba(255,255,255,0.9)" />
                    </g>
                  </svg>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center rounded-full border border-yellow-400/60 px-3 py-1 text-xs text-yellow-300">funny</span>
                  <span className="inline-flex items-center rounded-full border border-green-400/60 px-3 py-1 text-xs text-green-300">epic</span>
                  <span className="inline-flex items-center rounded-full border border-blue-400/60 px-3 py-1 text-xs text-blue-300">legend</span>
                  <span className="inline-flex items-center rounded-full border border-red-400/60 px-3 py-1 text-xs text-red-300">secret</span>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-xl font-bold">A living map of inside jokes and whispered legends.</h3>
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  Drop a pin anywhere and attach a micro-story. See the city
                  through everyone&apos;s mythologies—moments that live on in the
                  group chat and fade everywhere else.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center" data-animate>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything you need to leave your mark
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group rounded-2xl border border-white/8 bg-zinc-900 p-6 transition hover:scale-[1.02] ${f.border}`}
                data-animate
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${f.bg} ${f.text}`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════ */}
      <section
        id="get-started"
        className="py-24 sm:py-32 border-t border-white/5"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center" data-animate>
          <div className="mb-6 text-5xl">📍</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Be part of the map
            <br />
            <span className="text-white/40">from day one.</span>
          </h2>
          <p className="mt-5 text-lg text-white/60">
            RoguePoints is invite-only during beta. A small, tight community
            building the map before everyone else.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <InviteModal>
              <button className="inline-flex items-center rounded-full bg-green-500 px-8 py-4 text-base font-semibold text-black hover:bg-green-400 active:scale-[.98] transition cursor-pointer shadow-lg shadow-green-500/20">
                Request an invite
              </button>
            </InviteModal>
          </div>

          <p className="mt-5 text-sm text-white/30">
            Already have an invite?{" "}
            <a href="#" className="text-white/50 underline underline-offset-2 hover:text-white/80 transition">
              Sign in →
            </a>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="border-t border-white/8 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6">
              <path
                d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                fill="rgba(255,255,255,0.4)"
              />
            </svg>
            <span className="text-sm text-white/40">
              © {new Date().getFullYear()} RoguePoints
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition">
              Terms
            </a>
            <a href="#" className="text-white/50 hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="text-white/50 hover:text-green-400 transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
