"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

/* Leaflet must be client-only (no SSR) */
const LandingMap = dynamic(
  () => import("@/components/LandingMap").then((m) => m.LandingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-[#0a0a0f]" />
    ),
  }
);

/* ── Static data ── */

const HOW_STEPS = [
  {
    num: "01",
    title: "Drop a pin",
    desc: "Tap where it happened. The bar where the night went sideways, the corner where your friend said that thing, the table where the bit became a whole thing.",
    accent: "amber",
  },
  {
    num: "02",
    title: "Write the story",
    desc: "Text, a photo, a voice note. Keep it raw. The funniest moments with friends never need editing — just a place to live.",
    accent: "rose",
  },
  {
    num: "03",
    title: "Others find it",
    desc: "Share with everyone nearby or lock it down for just your close friends. Some stories belong to the world. Some only belong to three people.",
    accent: "seafoam",
  },
];

const STORIES = [
  {
    id: 1,
    user: "damian + @alexmason",
    location: "Civic Center, SF",
    coords: "37.77\u00b0N, 122.42\u00b0W",
    story:
      "this is where me and @alexmason clinked glasses too hard and shattered some old dude's ceramic mug that was definitely not ours to break. he stared at us for like 6 full seconds. we said 'we'll get you a new one' and walked straight out.",
    tag: "legend",
    tagColor: "border-blue-400/40 text-blue-300",
    nameColor: "text-blue-300",
    glowColor: "rgba(96, 165, 250, 0.08)",
    reactions: [
      { emoji: "\ud83d\ude2d", count: 312 },
      { emoji: "\ud83d\udd25", count: 88 },
    ],
    nearby: 8,
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=240&q=60",
    featured: true,
  },
  {
    id: 2,
    user: "Jules T.",
    location: "North Beach, SF",
    coords: "37.80\u00b0N, 122.41\u00b0W",
    story:
      "cried in this bathroom for 40 minutes for a reason i genuinely cannot explain. great lighting in there though. 9/10 as a place to have a breakdown. would recommend.",
    tag: "honest",
    tagColor: "border-emerald-400/40 text-emerald-300",
    nameColor: "text-emerald-300",
    glowColor: "rgba(52, 211, 153, 0.08)",
    reactions: [
      { emoji: "\ud83d\ude2d", count: 541 },
      { emoji: "\u2764\ufe0f", count: 203 },
    ],
    nearby: 12,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=60",
    featured: false,
  },
  {
    id: 3,
    user: "Kenji S.",
    location: "Mission District, SF",
    coords: "37.76\u00b0N, 122.41\u00b0W",
    story:
      "we dared ryan to stand in that stairwell for 10 minutes at midnight. he started crying after 3 and refused to say why. we have never brought it up. that was 2 years ago.",
    tag: "mystery",
    tagColor: "border-red-400/40 text-red-300",
    nameColor: "text-red-300",
    glowColor: "rgba(239, 68, 68, 0.08)",
    reactions: [
      { emoji: "\ud83d\ude2e", count: 719 },
      { emoji: "\ud83d\udc7b", count: 204 },
    ],
    nearby: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=60",
    featured: false,
  },
  {
    id: 4,
    user: "Mia C.",
    location: "New Orleans, LA",
    coords: "29.95\u00b0N, 90.07\u00b0W",
    story:
      "accidentally said 'i love you' here to someone i'd known for 4 hours. they said it back. we agreed to never mention it. it's been 11 months.",
    tag: "unhinged",
    tagColor: "border-amber-400/40 text-amber-300",
    nameColor: "text-amber-300",
    glowColor: "rgba(251, 191, 36, 0.08)",
    reactions: [
      { emoji: "\ud83d\ude2d", count: 891 },
      { emoji: "\ud83d\ude04", count: 340 },
    ],
    nearby: 3,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=60",
    featured: false,
  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Drop Pins Anywhere",
    desc: "From your hometown alley to a mountain ridge\u2014your map, your lore.",
    gradient: "from-amber-500/20 to-orange-500/10",
    borderHover: "hover:border-amber-400/30",
    wide: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
        <path d="M19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    title: "Tell the Story",
    desc: "Attach text, pics, or voice notes. Keep it raw, short, and real.",
    gradient: "from-rose-500/20 to-pink-500/10",
    borderHover: "hover:border-rose-400/30",
    wide: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
    title: "React with Vibes",
    desc: "Laugh, gasp, or drop a \ud83d\udd25\u2014quick reactions keep the map playful.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    borderHover: "hover:border-emerald-400/30",
    wide: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    title: "Find the Hidden",
    desc: "Hunt down mysteries and secret spots. Some pins only reveal nearby.",
    gradient: "from-blue-500/20 to-indigo-500/10",
    borderHover: "hover:border-blue-400/30",
    wide: false,
  },
];

/* ── Topo SVG divider component ── */
function TopoDivider() {
  return (
    <div className="relative w-full h-16 overflow-hidden opacity-30" aria-hidden="true">
      <svg viewBox="0 0 1200 80" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M0 40 C200 20 400 60 600 35 C800 10 1000 55 1200 40"
          fill="none"
          stroke="rgba(251,191,36,0.3)"
          strokeWidth="1"
        />
        <path
          d="M0 50 C150 35 350 65 550 45 C750 25 950 60 1200 48"
          fill="none"
          stroke="rgba(251,191,36,0.15)"
          strokeWidth="0.8"
        />
        <path
          d="M0 30 C250 15 450 50 650 28 C850 6 1050 45 1200 32"
          fill="none"
          stroke="rgba(251,191,36,0.08)"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

/* ── Logo Prompt Section ── */

const PROFILE_PHOTO_PROMPT =
  "A square profile photo icon for a dark urban location-based social app called RoguePoints. " +
  "Center: a single glowing map pin with a warm amber-to-rose gradient, soft inner light halo. " +
  "Background: near-black (#0a0a0f) with a subtle film grain texture and a faint radial amber glow behind the pin. " +
  "Style: minimal, geometric, noir city mood. No text, no extra icons. " +
  "Aspect ratio 1:1, 512×512, ready for use as a social media profile photo or app icon.";

function LogoPromptSection() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PROFILE_PHOTO_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6" data-animate>
        {/* Label */}
        <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
          Brand Assets
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight mb-2">
          Generate your profile photo
        </h2>
        <p className="text-white/40 text-sm mb-8">
          Paste this prompt into Midjourney, DALL·E, or Firefly to create the
          RoguePoints profile image.
        </p>

        {/* Prompt card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          {/* Subtle amber glow in corner */}
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%)",
            }}
          />

          {/* Prompt label */}
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-soft" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300/70">
              Profile Photo — Prompt #1
            </span>
          </div>

          {/* Prompt text */}
          <p className="font-mono text-sm leading-relaxed text-white/70 select-all">
            {PROFILE_PHOTO_PROMPT}
          </p>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.05] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/60 transition hover:border-amber-400/40 hover:text-amber-300 active:scale-[.97]"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="2,8 6,12 14,4" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" />
                  <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
                </svg>
                Copy prompt
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Page ── */

export default function Home() {
  /* Force scroll to top on every load/reload */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

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
    <div className="grain">
      {/* ════════════════════════════════
          NAV — floats over the hero map
      ════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-[1000]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <a href="#home" className="inline-flex items-center gap-3 group cursor-pin">
              <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 drop-shadow-lg">
                <defs>
                  <linearGradient id="rgp-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                  fill="url(#rgp-grad)"
                />
              </svg>
              <span className="font-display text-xl italic tracking-tight text-white/90 group-hover:text-amber-300 transition-colors">
                RoguePoints
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#how-it-works"
                className="text-[13px] font-medium uppercase tracking-[0.15em] text-white/50 hover:text-amber-300 transition-colors cursor-pin"
              >
                How it works
              </a>
              <a
                href="#stories"
                className="text-[13px] font-medium uppercase tracking-[0.15em] text-white/50 hover:text-amber-300 transition-colors cursor-pin"
              >
                Stories
              </a>
              <a
                href="#features"
                className="text-[13px] font-medium uppercase tracking-[0.15em] text-white/50 hover:text-amber-300 transition-colors cursor-pin"
              >
                Features
              </a>
              <a href="/request-access" className="inline-flex items-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black hover:bg-amber-300 active:scale-[.97] transition glow-amber-sm cursor-pin">
                Sign In
              </a>
            </nav>

            {/* Mobile CTA */}
            <a href="/request-access" className="md:hidden inline-flex items-center rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-black hover:bg-amber-300 active:scale-[.97] transition cursor-pin">
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════
          HERO — Full-bleed map background
      ════════════════════════════════ */}
      <section id="home" className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
        {/* Map as background */}
        <div className="absolute inset-0 z-0">
          <LandingMap />
          {/* Vignette overlay — inside same stacking context so card (z-20) renders above it */}
          <div className="absolute inset-0 z-10 vignette pointer-events-none" />
          {/* Extra bottom fade */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </div>

        {/* Content overlay */}
        <div className="relative z-20 flex h-full flex-col justify-end pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]" data-animate>
                Every place
                <br />
                has a story.{" "}
                <em className="text-gradient-amber not-italic">Pin yours.</em>
              </h1>

              <p
                className="mt-6 text-lg sm:text-xl text-white/50 leading-relaxed max-w-lg"
                data-animate
                data-delay="1"
              >
                A social, story-driven map. Drop pins anywhere and attach the
                moments that never make it to Instagram&mdash;urban legends, funny
                mishaps, secret spots, epic nights.
              </p>

              <div className="mt-8 flex flex-wrap gap-4" data-animate data-delay="2">
                <a href="/request-access" className="inline-flex items-center rounded-full bg-amber-400 px-7 py-3.5 font-semibold text-black hover:bg-amber-300 active:scale-[.97] transition glow-amber cursor-pin">
                  Get Started — it&rsquo;s free
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center rounded-full glass px-7 py-3.5 font-semibold text-white/70 hover:text-white hover:bg-white/10 active:scale-[.97] transition cursor-pin"
                >
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <div
          className="absolute bottom-8 right-8 z-20 hidden lg:block glass rounded-xl px-4 py-2.5 text-xs text-white/50"
          data-animate
          data-delay="5"
        >
          <span className="text-amber-300/70">&#x2190; </span>
          Click the pins for stories
        </div>
      </section>

      {/* ════════════════════════════════
          TAGLINE SECTION
      ════════════════════════════════ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden py-28">
        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)" }}
          />
          <div
            className="absolute left-[20%] top-[30%] h-72 w-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)" }}
          />
          <div
            className="absolute right-[15%] bottom-[25%] h-56 w-56 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <p
            className="mb-8 text-[13px] font-medium uppercase tracking-[0.25em] text-amber-400/50"
            data-animate
          >
            The short version
          </p>

          {/* Main statement */}
          <h2
            className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]"
            data-animate
            data-delay="1"
          >
            It&rsquo;s like a{" "}
            <em className="text-gradient-amber not-italic">treasure hunt,</em>
            <br />
            <em className="text-white/30 not-italic">time capsule,</em>
            <br />
            and inside joke
            <br />
            all in one.
          </h2>

          {/* Three pillars */}
          <div
            className="mt-16 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto"
            data-animate
            data-delay="2"
          >
            {[
              {
                icon: "🗺️",
                label: "Treasure Hunt",
                desc: "Discover hidden pins from people who've been exactly where you are.",
              },
              {
                icon: "⏳",
                label: "Time Capsule",
                desc: "Stories pinned forever to the exact coordinates where they happened.",
              },
              {
                icon: "😂",
                label: "Inside Joke",
                desc: "The bits that only make sense to the people who were there.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-6 card-hover"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <p className="text-sm font-semibold text-white/70 mb-1">{item.label}</p>
                <p className="text-[13px] text-white/35 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <TopoDivider />
      <section id="how-it-works" className="py-20 sm:py-28 ambient-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="mb-16 max-w-xl" data-animate>
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
              How it works
            </p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Three steps to leaving your mark.
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 relative">
            {/* Connecting line (desktop) */}
            <div
              className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(251,191,36,0.15), rgba(251,191,36,0.15), transparent)",
              }}
            />

            {HOW_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 card-hover"
                data-animate
                data-delay={String(i + 1)}
              >
                {/* Giant number */}
                <span className="font-display text-[5rem] leading-none text-white/[0.04] absolute top-4 right-6 select-none pointer-events-none">
                  {step.num}
                </span>

                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-xs font-mono font-semibold text-amber-300/80">
                    Step {step.num}
                  </div>
                  <h3 className="font-display text-2xl mb-3">{step.title}</h3>
                  <p className="text-[15px] text-white/45 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STORY CARDS — editorial layout
      ════════════════════════════════ */}
      <TopoDivider />
      <section id="stories" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 max-w-xl" data-animate>
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
              From the map
            </p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Stories on the map
            </h2>
            <p className="mt-4 text-white/40 text-lg leading-relaxed">
              Real places. Real moments. Not for the feed.
            </p>
          </div>

          {/* Featured story (first card, full width) */}
          {STORIES.filter((s) => s.featured).map((s) => (
            <div
              key={s.id}
              className="relative mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 card-hover overflow-hidden"
              data-animate
            >
              <span className="quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <div className="relative z-10 grid gap-8 sm:grid-cols-[auto_1fr]">
                <div className="flex items-start gap-4">
                  <Image
                    src={s.avatar}
                    alt={`Portrait of ${s.user}`}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <p className={`font-semibold ${s.nameColor}`}>{s.user}</p>
                    <p className="text-xs text-white/35 mt-0.5">{s.location}</p>
                    <p className="text-[11px] text-white/20 font-mono mt-0.5">
                      {s.coords}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="font-display text-2xl sm:text-3xl leading-snug text-white/85 italic">
                    &ldquo;{s.story}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-3">
                      {s.reactions.map((r) => (
                        <span
                          key={r.emoji}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-white/50"
                        >
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs ${s.tagColor}`}
                      >
                        {s.tag}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-white/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 pulse-soft" />
                        {s.nearby} nearby
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Remaining stories grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.filter((s) => !s.featured).map((s, i) => (
              <div
                key={s.id}
                className="relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 card-hover overflow-hidden"
                data-animate
                data-delay={String(i + 1)}
                style={{
                  background: `radial-gradient(ellipse at top right, ${s.glowColor}, transparent 70%)`,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <Image
                    src={s.avatar}
                    alt={`Portrait of ${s.user}`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${s.nameColor}`}>
                      {s.user}
                    </p>
                    <p className="text-xs text-white/35 truncate">{s.location}</p>
                    <p className="text-[10px] text-white/15 font-mono truncate">
                      {s.coords}
                    </p>
                  </div>
                </div>

                {/* Story */}
                <p className="flex-1 text-[15px] text-white/65 leading-relaxed font-display italic">
                  &ldquo;{s.story}&rdquo;
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    {s.reactions.map((r) => (
                      <span
                        key={r.emoji}
                        className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/45"
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${s.tagColor}`}
                  >
                    {s.tag}
                  </span>
                </div>

                {/* Nearby */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 pulse-soft" />
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
      <TopoDivider />
      <section className="py-20 sm:py-28 ambient-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left */}
            <div data-animate>
              <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
                Why RoguePoints
              </p>
              <h2 className="font-display text-4xl sm:text-6xl tracking-tight leading-tight">
                Not for the{" "}
                <em className="text-white/30 italic">highlight reel.</em>
              </h2>
              <p className="mt-6 text-lg text-white/45 leading-relaxed">
                The best stories about a place live in voice memos, group chats,
                and bar napkins. They die there, too. RoguePoints puts them where
                they belong&mdash;on the map, exactly where they happened, forever.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  { no: "Instagram", yes: "Raw and unfiltered", icon: "\ud83d\udcf8" },
                  { no: "Star ratings", yes: "Human stories with context", icon: "\ud83d\uddfa\ufe0f" },
                  { no: "Stories that disappear", yes: "A permanent address on the map", icon: "\ud83d\udcac" },
                ].map((row) => (
                  <div
                    key={row.no}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 card-hover"
                  >
                    <span className="text-xl flex-shrink-0">{row.icon}</span>
                    <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="strike-through text-white/30">{row.no}</span>
                      <span className="text-amber-400/40">&rarr;</span>
                      <span className="text-white/75 font-medium">{row.yes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Scroll-animated SVG */}
            <div
              id="map-preview"
              className="flex items-center gap-8 lg:flex-row flex-col"
              data-animate
              data-delay="2"
            >
              <div className="w-full max-w-xs">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-xl shadow-black/30 p-5">
                  <svg
                    id="previewMap"
                    viewBox="0 0 300 300"
                    className="h-full w-full"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 24 0 L 0 0 0 24"
                          stroke="rgba(251,191,36,0.06)"
                          fill="none"
                          strokeWidth="1"
                        />
                      </pattern>
                      <filter
                        id="glow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="3"
                          floodColor="#fbbf24"
                          floodOpacity="0.9"
                        />
                      </filter>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="300"
                      fill="url(#grid)"
                    />
                    <rect
                      x="18"
                      y="18"
                      width="90"
                      height="60"
                      fill="rgba(251,191,36,0.03)"
                      rx="4"
                    />
                    <rect
                      x="210"
                      y="28"
                      width="72"
                      height="46"
                      fill="rgba(251,191,36,0.03)"
                      rx="4"
                    />
                    <rect
                      x="200"
                      y="200"
                      width="86"
                      height="70"
                      fill="rgba(251,191,36,0.03)"
                      rx="4"
                    />
                    <rect
                      x="28"
                      y="188"
                      width="70"
                      height="86"
                      fill="rgba(251,191,36,0.03)"
                      rx="4"
                    />
                    <path
                      id="routePath"
                      d="M40 250 C 80 180, 60 150, 120 130 S 220 100, 210 70 S 140 80, 170 150 S 240 210, 260 240"
                      fill="none"
                      stroke="rgba(251,191,36,0.2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6 8"
                    />
                    <g id="pin" filter="url(#glow)" transform="translate(40,250)">
                      <path d="M0 0 L6 -10 L-6 -10 Z" fill="#fbbf24" />
                      <circle cx="0" cy="-16" r="9" fill="#fbbf24" />
                      <circle
                        cx="0"
                        cy="-16"
                        r="4.5"
                        fill="rgba(255,255,255,0.9)"
                      />
                    </g>
                  </svg>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-300/70">
                    funny
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300/70">
                    epic
                  </span>
                  <span className="inline-flex items-center rounded-full border border-blue-400/30 px-3 py-1 text-xs text-blue-300/70">
                    legend
                  </span>
                  <span className="inline-flex items-center rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-300/70">
                    secret
                  </span>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="font-display text-2xl">
                  A living map of inside jokes and whispered legends.
                </h3>
                <p className="mt-3 text-sm text-white/40 leading-relaxed">
                  Drop a pin anywhere and attach a micro-story. See the city
                  through everyone&apos;s mythologies&mdash;moments that live on in the
                  group chat and fade everywhere else.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES — bento grid
      ════════════════════════════════ */}
      <TopoDivider />
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-14 max-w-xl" data-animate>
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-amber-400/60 mb-3">
              Features
            </p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Everything you need to leave your mark.
            </h2>
          </div>

          <div className="bento">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`group relative rounded-2xl border border-white/[0.06] p-7 sm:p-8 card-hover overflow-hidden ${
                  f.borderHover
                } ${f.wide ? "bento-wide" : ""}`}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.02), transparent)`,
                }}
                data-animate
                data-delay={String(i + 1)}
              >
                {/* Gradient mesh background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 text-amber-300/80 group-hover:text-amber-300 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-xl mb-2">{f.title}</h3>
                  <p className="text-[15px] text-white/40 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          LOGO PROMPT
      ════════════════════════════════ */}
      <LogoPromptSection />

      {/* ════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════ */}
      <section
        id="get-started"
        className="relative py-28 sm:py-36 topo-divider overflow-hidden"
      >
        {/* Atmospheric background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(251,191,36,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 text-center">
          {/* Pulsing pin SVG */}
          <div className="mb-8 flex justify-center" data-animate>
            <div className="relative">
              <svg viewBox="0 0 48 64" className="h-16 w-12 pin-bounce">
                <defs>
                  <filter id="cta-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" floodOpacity="0.6" />
                  </filter>
                </defs>
                <path
                  d="M24 0C10.8 0 0 10.8 0 24c0 17 21 38.4 22.8 40.2.6.6 1.6.6 2.2 0C26.8 62.4 48 41 48 24 48 10.8 37.2 0 24 0z"
                  fill="#fbbf24"
                  filter="url(#cta-glow)"
                />
                <circle cx="24" cy="24" r="10" fill="white" opacity="0.9" />
              </svg>
              {/* Ripple */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                <div className="h-3 w-8 rounded-full bg-amber-400/20 pulse-soft" />
              </div>
            </div>
          </div>

          {/* Early access badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/8 px-4 py-1.5" data-animate>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 pulse-soft" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              Early Access
            </span>
          </div>

          <h2
            className="font-display text-4xl sm:text-6xl tracking-tight"
            data-animate
            data-delay="1"
          >
            You&rsquo;re in early.
            <br />
            <em className="text-white/30 italic">Drop the first pins.</em>
          </h2>
          <p
            className="mt-5 text-lg text-white/40"
            data-animate
            data-delay="2"
          >
            The map is just getting started. Sign in and be part of it before
            everyone else.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            data-animate
            data-delay="3"
          >
            <a href="/request-access" className="inline-flex items-center rounded-full bg-amber-400 px-9 py-4 text-base font-semibold text-black hover:bg-amber-300 active:scale-[.97] transition glow-amber cursor-pin">
              Sign in with Google
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5">
              <path
                d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                fill="rgba(251,191,36,0.3)"
              />
            </svg>
            <span className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} RoguePoints
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white/35 hover:text-amber-300/70 transition cursor-pin">
              Terms
            </a>
            <a href="#" className="text-white/35 hover:text-amber-300/70 transition cursor-pin">
              Privacy
            </a>
            <a href="#" className="text-white/35 hover:text-amber-300/70 transition cursor-pin">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
