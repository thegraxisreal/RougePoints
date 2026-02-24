import { WaitlistForm } from "@/components/WaitlistForm";

const STORIES = [
  {
    id: 1,
    category: "secret",
    borderClass: "border-red-400/40 hover:border-red-400/70",
    badgeClass: "border-red-400/60 text-red-300",
    dotColor: "#ef4444",
    location: "Old Mill District",
    text: "Found an unlocked door behind the dumpsters. Leads to tunnels from the 1800s. Still passable.",
    author: "Marcus T.",
    initials: "MT",
    avatarClass: "bg-red-500/20 text-red-300",
    reactions: [
      { emoji: "🔦", count: 41 },
      { emoji: "😱", count: 28 },
    ],
  },
  {
    id: 2,
    category: "legend",
    borderClass: "border-blue-400/40 hover:border-blue-400/70",
    badgeClass: "border-blue-400/60 text-blue-300",
    dotColor: "#60a5fa",
    location: "City Park Bench",
    text: "Every Friday at 3pm a man in a tuxedo feeds the pigeons here. Been doing it for 20 years. Nobody knows why.",
    author: "Priya K.",
    initials: "PK",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reactions: [
      { emoji: "🕊️", count: 67 },
      { emoji: "🤔", count: 44 },
    ],
  },
  {
    id: 3,
    category: "funny",
    borderClass: "border-yellow-400/40 hover:border-yellow-400/70",
    badgeClass: "border-yellow-400/60 text-yellow-300",
    dotColor: "#fbbf24",
    location: "Glen Street",
    text: "Raccoon tipped a full shopping cart and casually ate a rotisserie chicken. Made direct eye contact the whole time.",
    author: "Devon S.",
    initials: "DS",
    avatarClass: "bg-yellow-500/20 text-yellow-300",
    reactions: [
      { emoji: "💀", count: 112 },
      { emoji: "😂", count: 89 },
    ],
  },
  {
    id: 4,
    category: "nostalgia",
    borderClass: "border-purple-400/40 hover:border-purple-400/70",
    badgeClass: "border-purple-400/60 text-purple-300",
    dotColor: "#c084fc",
    location: "Crandall Park",
    text: "This is where the class of 09 buried a time capsule under the big oak. We never went back to dig it up.",
    author: "Jamie L.",
    initials: "JL",
    avatarClass: "bg-purple-500/20 text-purple-300",
    reactions: [
      { emoji: "⏳", count: 33 },
      { emoji: "🥺", count: 55 },
    ],
  },
  {
    id: 5,
    category: "mysterious",
    borderClass: "border-blue-400/40 hover:border-blue-400/70",
    badgeClass: "border-blue-400/60 text-blue-300",
    dotColor: "#60a5fa",
    location: "Abandoned Theater",
    text: "Heard jazz music coming from inside on a night it was closed. Old stuff. Stopped the second I knocked.",
    author: "Kenji R.",
    initials: "KR",
    avatarClass: "bg-blue-500/20 text-blue-300",
    reactions: [
      { emoji: "👻", count: 78 },
      { emoji: "🎷", count: 34 },
    ],
  },
  {
    id: 6,
    category: "wholesome",
    borderClass: "border-green-400/40 hover:border-green-400/70",
    badgeClass: "border-green-400/60 text-green-300",
    dotColor: "#22c55e",
    location: "Feeder Canal Trail",
    text: "Fox family living under the footbridge. Three kits. They come out at dawn if you are quiet enough.",
    author: "Nat V.",
    initials: "NV",
    avatarClass: "bg-green-500/20 text-green-300",
    reactions: [
      { emoji: "🦊", count: 203 },
      { emoji: "🥰", count: 167 },
    ],
  },
];

export default function Home() {
  return (
    <>
      {/* ── Nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="inline-flex items-center gap-3">
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
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition">How it works</a>
              <a href="#features" className="text-sm text-white/60 hover:text-white transition">Features</a>
              <a href="#stories" className="text-sm text-white/60 hover:text-white transition">Stories</a>
              <a
                href="#get-started"
                className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition"
              >
                Join Waitlist
              </a>
            </nav>
            <a
              href="#get-started"
              className="md:hidden inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ────────────────────────────────────── */}
        <section id="home" className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="py-20 sm:py-28 md:py-32">
              <div className="grid items-center gap-12 md:grid-cols-2">
                {/* Left copy */}
                <div className="max-w-xl" data-animate>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Launching in Glens Falls, NY
                  </div>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                    Every place has a story.{" "}
                    <span className="text-white/40">Pin yours.</span>
                  </h1>
                  <p className="mt-5 text-lg text-white/60 leading-relaxed">
                    RoguePoints is a social map built for local lore. Drop a pin
                    on any real location and attach the stories that never make
                    it to Instagram — urban legends, funny mishaps, secret spots,
                    and moments worth preserving.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#get-started"
                      className="inline-flex items-center rounded-full bg-green-500 px-5 py-3 font-semibold text-black hover:bg-green-400 active:scale-[.98] transition"
                    >
                      Join the Waitlist
                    </a>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 font-semibold text-white/70 hover:bg-white/5 active:scale-[.98] transition"
                    >
                      See how it works
                    </a>
                  </div>
                </div>

                {/* Right map card */}
                <div className="mx-auto w-full max-w-xl" data-animate>
                  <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
                        <defs>
                          <pattern id="heroGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                            <path d="M 28 0 L 0 0 0 28" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
                          </pattern>
                          <radialGradient id="mapVignette" cx="50%" cy="50%" r="75%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                          </radialGradient>
                          <pattern id="parkHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="6" height="6" fill="rgba(34,197,94,0.12)" />
                            <path d="M0 0 L0 6" stroke="rgba(34,197,94,0.28)" strokeWidth="1" />
                          </pattern>
                        </defs>
                        <rect x="0" y="0" width="800" height="600" fill="#0b0b0b" />
                        <rect x="0" y="0" width="800" height="600" fill="url(#heroGrid)" />
                        <rect x="0" y="0" width="800" height="600" fill="url(#mapVignette)" />
                        <g fill="rgba(59,130,246,0.18)" stroke="rgba(59,130,246,0.35)" strokeWidth="2">
                          <path d="M-20,460 C100,420 200,440 280,420 C360,400 440,340 530,350 C600,358 680,390 820,360 L820,640 L-20,640 Z" />
                          <path d="M420,160 C450,190 430,230 460,260 C490,290 560,300 600,290 C640,280 700,240 720,220 C740,200 720,170 700,160 C660,140 600,140 560,150 C520,160 490,170 470,170 C450,170 440,155 420,160 Z" />
                        </g>
                        <g fill="rgba(255,255,255,0.25)">
                          <rect x="520" y="330" width="72" height="6" rx="3" />
                          <rect x="610" y="330" width="72" height="6" rx="3" />
                        </g>
                        <g stroke="rgba(255,255,255,0.28)" strokeWidth="6" fill="none" strokeLinecap="round">
                          <path d="M60 520 C 160 460, 220 420, 290 380 S 420 320, 520 300 S 700 260, 760 210" />
                          <path d="M80 160 C 160 180, 220 220, 260 280 S 320 380, 340 460" />
                          <path d="M180 80 C 260 120, 360 120, 460 140 S 620 180, 700 220" />
                        </g>
                        <g stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none">
                          <path d="M120 60 L120 540" /><path d="M200 60 L200 540" /><path d="M280 60 L280 540" />
                          <path d="M360 60 L360 540" /><path d="M440 60 L440 540" /><path d="M520 60 L520 540" />
                          <path d="M600 60 L600 540" /><path d="M680 60 L680 540" />
                          <path d="M80 120 L760 120" /><path d="M80 200 L760 200" /><path d="M80 280 L760 280" />
                          <path d="M80 360 L760 360" /><path d="M80 440 L760 440" />
                        </g>
                        <g fill="rgba(255,255,255,0.06)">
                          <rect x="100" y="130" width="48" height="28" rx="2" /><rect x="154" y="130" width="48" height="28" rx="2" />
                          <rect x="208" y="130" width="48" height="28" rx="2" /><rect x="262" y="130" width="48" height="28" rx="2" />
                          <rect x="316" y="130" width="48" height="28" rx="2" /><rect x="370" y="130" width="48" height="28" rx="2" />
                          <rect x="100" y="170" width="48" height="28" rx="2" /><rect x="154" y="170" width="48" height="28" rx="2" />
                          <rect x="208" y="170" width="48" height="28" rx="2" /><rect x="262" y="170" width="48" height="28" rx="2" />
                          <rect x="140" y="210" width="54" height="30" rx="2" /><rect x="198" y="210" width="40" height="30" rx="2" />
                          <rect x="244" y="210" width="46" height="30" rx="2" /><rect x="294" y="210" width="52" height="30" rx="2" />
                          <rect x="120" y="330" width="46" height="30" rx="2" /><rect x="170" y="330" width="52" height="30" rx="2" />
                          <rect x="226" y="330" width="44" height="30" rx="2" /><rect x="274" y="330" width="50" height="30" rx="2" />
                        </g>
                        <g stroke="rgba(34,197,94,0.4)" strokeWidth="2" fill="url(#parkHatch)">
                          <path d="M140 260 C 160 250, 190 248, 210 260 C 230 272, 232 300, 210 310 C 188 320, 160 312, 148 296 C 136 280, 128 268, 140 260 Z" />
                          <path d="M520 210 C 540 200, 565 198, 590 210 C 612 221, 612 242, 590 254 C 566 266, 540 260, 526 244 C 512 228, 504 218, 520 210 Z" />
                        </g>
                        <g stroke="rgba(250,204,21,0.5)" strokeWidth="3" fill="none" strokeDasharray="6 6" strokeLinecap="round">
                          <path d="M60 440 C 160 420, 240 390, 320 360 S 480 300, 620 290" />
                        </g>
                        <g fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
                          <circle cx="260" cy="280" r="10" /><circle cx="520" cy="300" r="9" />
                        </g>
                      </svg>
                    </div>

                    {/* Interactive pin tooltips */}
                    <div className="absolute inset-0">
                      {/* PIN 1 — blue */}
                      <div className="group absolute left-[58%] top-[28%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-full" aria-label="Read story from Sam R.">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#60a5fa" />
                            <circle cx="12" cy="9.2" r="2.6" fill="white" />
                          </svg>
                        </button>
                        <div className="pointer-events-auto absolute left-9 top-1/2 -translate-y-1/2 z-10 w-60 opacity-0 translate-x-1 scale-[.98] rounded-xl border border-blue-400/50 bg-black/90 backdrop-blur p-3 shadow-lg transition group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300 shrink-0">SR</div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-blue-300">Sam R.</p>
                              <p className="text-xs text-white/50">Barcelona, ES</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">Hidden jazz club behind the bakery. Ask for Marta.</p>
                        </div>
                      </div>

                      {/* PIN 2 — green */}
                      <div className="group absolute left-[32%] top-[42%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-green-400/50 rounded-full" aria-label="Read story from Jules T.">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#22c55e" />
                            <circle cx="12" cy="9.2" r="2.6" fill="white" />
                          </svg>
                        </button>
                        <div className="pointer-events-auto absolute right-9 top-1/2 -translate-y-1/2 z-10 w-60 opacity-0 -translate-x-1 scale-[.98] rounded-xl border border-green-400/50 bg-black/90 backdrop-blur p-3 shadow-lg transition group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center text-sm font-bold text-green-300 shrink-0">JT</div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-green-300">Jules T.</p>
                              <p className="text-xs text-white/50">Brooklyn, NY</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">Best dumplings. Cash only. Order from the basement window.</p>
                        </div>
                      </div>

                      {/* PIN 3 — red */}
                      <div className="group absolute left-[74%] top-[54%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 rounded-full" aria-label="Read story from Kenji S.">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#ef4444" />
                            <circle cx="12" cy="9.2" r="2.6" fill="white" />
                          </svg>
                        </button>
                        <div className="pointer-events-auto absolute left-9 top-1/2 -translate-y-1/2 z-10 w-60 opacity-0 translate-x-1 scale-[.98] rounded-xl border border-red-400/50 bg-black/90 backdrop-blur p-3 shadow-lg transition group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center text-sm font-bold text-red-300 shrink-0">KS</div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-red-300">Kenji S.</p>
                              <p className="text-xs text-white/50">Shinjuku, JP</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">The ghost in Room 27 knocks twice. I heard it.</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/50">
                      Hover pins to read stories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </section>

        {/* ── How It Works ──────────────────────────── */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-12" data-animate>
              <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
              <p className="mt-3 text-white/50 max-w-xl mx-auto">
                Three steps from standing somewhere to leaving a story that lasts.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-white/10 via-white/20 to-white/10" aria-hidden="true" />

              {/* Step 1 */}
              <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center" data-animate>
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 border border-red-500/20">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#ef4444" />
                    <circle cx="12" cy="9.2" r="2.6" fill="white" />
                  </svg>
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Step 1</div>
                <h3 className="text-lg font-bold">Drop a Pin</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Open the map, navigate to anywhere in the world, and tap to place your pin on the exact spot.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center" data-animate>
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 border border-blue-500/20">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                  </svg>
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Step 2</div>
                <h3 className="text-lg font-bold">Write the Story</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Give it a title, write up to 500 characters, and attach a photo. Keep it raw, short, and real.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center" data-animate>
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15 border border-green-500/20">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Step 3</div>
                <h3 className="text-lg font-bold">Others Discover It</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Anyone nearby sees your pin on their map. They react, comment, and add their own layer to the story.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Map Preview ──────────────────────────── */}
        <section id="map-preview" className="py-16 sm:py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center" data-animate>
              <div className="w-72 sm:w-80 md:w-[26rem] aspect-square rounded-2xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/30 p-4">
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
                    fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8"
                  />
                  <g id="pin" filter="url(#glow)" transform="translate(40,250)">
                    <path d="M0 0 L6 -10 L-6 -10 Z" fill="#ef4444" />
                    <circle cx="0" cy="-16" r="9" fill="#ef4444" />
                    <circle cx="0" cy="-16" r="4.5" fill="rgba(255,255,255,0.9)" />
                  </g>
                </svg>
              </div>
            </div>
            <div data-animate>
              <h2 className="text-2xl sm:text-3xl font-bold">
                A living map of inside jokes and whispered legends.
              </h2>
              <p className="mt-3 text-white/60 leading-relaxed">
                Drop a pin anywhere and attach a micro-story. See the city
                through everyone&apos;s mythologies — moments that live on in
                the group chat and fade everywhere else.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-yellow-400/60 px-3 py-1 text-sm text-yellow-300">funny</span>
                <span className="inline-flex items-center rounded-full border border-green-400/60 px-3 py-1 text-sm text-green-300">epic</span>
                <span className="inline-flex items-center rounded-full border border-blue-400/60 px-3 py-1 text-sm text-blue-300">legend</span>
                <span className="inline-flex items-center rounded-full border border-red-400/60 px-3 py-1 text-sm text-red-300">secret</span>
                <span className="inline-flex items-center rounded-full border border-purple-400/60 px-3 py-1 text-sm text-purple-300">nostalgia</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────── */}
        <section id="features" className="py-16 sm:py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-10" data-animate>
              <h2 className="text-3xl sm:text-4xl font-bold">Built for local lore</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition hover:scale-[1.02] hover:border-blue-400/50" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-xl">🧭</div>
                <h3 className="font-semibold">Drop Pins Anywhere</h3>
                <p className="mt-2 text-sm text-white/60">From your hometown alley to a mountain ridge — your map, your lore.</p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition hover:scale-[1.02] hover:border-green-400/50" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-xl">✍️</div>
                <h3 className="font-semibold">Tell the Story</h3>
                <p className="mt-2 text-sm text-white/60">Attach text and photos. Keep it raw, short, and real.</p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition hover:scale-[1.02] hover:border-yellow-400/60" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-xl">😄</div>
                <h3 className="font-semibold">React with Vibes</h3>
                <p className="mt-2 text-sm text-white/60">Laugh, gasp, or drop a 🔥 — quick reactions keep the map playful.</p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition hover:scale-[1.02] hover:border-red-400/60" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-xl">🕵️</div>
                <h3 className="font-semibold">Find the Hidden</h3>
                <p className="mt-2 text-sm text-white/60">Hunt down mysteries and secret spots. Some pins only reveal nearby.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Story Cards ──────────────────────────── */}
        <section id="stories" className="py-16 sm:py-24 border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10" data-animate>
              <h2 className="text-3xl sm:text-4xl font-bold">From the map</h2>
              <p className="mt-2 text-white/50">A taste of what gets pinned in Glens Falls.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STORIES.map((story) => (
                <div
                  key={story.id}
                  className={`rounded-2xl border ${story.borderClass} bg-zinc-900/80 p-5 flex flex-col gap-4 transition`}
                  data-animate
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" aria-hidden="true">
                        <circle cx="5" cy="5" r="5" fill={story.dotColor} />
                      </svg>
                      <span className="text-xs text-white/50 truncate">{story.location}</span>
                    </div>
                    <span className={`shrink-0 inline-flex items-center rounded-full border ${story.badgeClass} px-2 py-0.5 text-xs`}>
                      {story.category}
                    </span>
                  </div>
                  <p className="text-sm text-white/85 leading-relaxed flex-1">{story.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-full ${story.avatarClass} flex items-center justify-center text-xs font-bold`}>
                        {story.initials}
                      </div>
                      <span className="text-xs text-white/50">{story.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {story.reactions.map((r) => (
                        <span key={r.emoji} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                          {r.emoji} {r.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Waitlist CTA ─────────────────────────── */}
        <section id="get-started" className="py-16 sm:py-24 border-t border-white/5">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center" data-animate>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Beta launching soon
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Be first on the map.</h2>
            <p className="mt-4 text-white/50 leading-relaxed max-w-lg mx-auto">
              We&apos;re launching our local beta in Glens Falls soon. Drop your
              email and you&apos;ll be the first to know — and the first to
              start pinning stories.
            </p>
            <div className="mt-8 flex justify-center">
              <WaitlistForm />
            </div>
            <p className="mt-4 text-xs text-white/30">No spam. One email when we launch.</p>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5">
              <path
                d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                fill="rgba(255,255,255,0.5)"
              />
            </svg>
            <span className="text-sm text-white/50">&copy; 2025 RoguePoints</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <a href="#" className="text-white/50 hover:text-blue-400 transition">Terms</a>
            <a href="#" className="text-white/50 hover:text-white transition">Privacy</a>
            <a href="#" className="text-white/50 hover:text-green-400 transition">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Scroll animations ────────────────────── */}
      <script dangerouslySetInnerHTML={{
        __html: `
          var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          (function() {
            var els = document.querySelectorAll('[data-animate]');
            els.forEach(function(el) {
              el.style.opacity = '0';
              el.style.transform = 'translateY(24px)';
              el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            if (REDUCED) { els.forEach(function(el) { el.style.opacity='1'; el.style.transform='none'; }); return; }
            var io = new IntersectionObserver(function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                  io.unobserve(entry.target);
                }
              });
            }, { threshold: 0.12 });
            els.forEach(function(el) { io.observe(el); });
          })();

          (function() {
            var svg = document.getElementById('previewMap');
            if (!svg) return;
            var mapSection = document.getElementById('map-preview');
            var path = svg.querySelector('#routePath');
            var pin = svg.querySelector('#pin');
            if (!path || !pin) return;
            var total = path.getTotalLength();
            var dropped = false, dropOffset = 0, dropRAF = null;
            var clamp = function(v, a, b) { return Math.max(a, Math.min(b, v)); };
            function placePin(p) {
              var d = p * total;
              var pt = path.getPointAtLength(d);
              var pt2 = path.getPointAtLength(Math.min(total, d + 0.5));
              var angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
              pin.setAttribute('transform', 'translate(' + pt.x + ' ' + (pt.y + dropOffset) + ') rotate(' + angle + ')');
              path.setAttribute('stroke-dasharray', total + '');
              path.setAttribute('stroke-dashoffset', ((1 - p) * total) + '');
            }
            function sectionProgress() {
              var rect = mapSection.getBoundingClientRect();
              var vh = window.innerHeight || document.documentElement.clientHeight;
              return clamp((vh - rect.top) / (vh + rect.height * 0.2), 0, 1);
            }
            function drop() {
              if (dropRAF) cancelAnimationFrame(dropRAF);
              var start = performance.now(), D = 450, H = -14;
              function easeOutBack(x) { var c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }
              function step(now) {
                var t = clamp((now - start) / D, 0, 1);
                dropOffset = H * (1 - easeOutBack(t));
                placePin(sectionProgress());
                if (t < 1) dropRAF = requestAnimationFrame(step);
                else { dropRAF = null; dropOffset = 0; placePin(sectionProgress()); }
              }
              dropRAF = requestAnimationFrame(step);
            }
            placePin(0);
            if (REDUCED) { placePin(1); return; }
            var scheduled = false;
            function onScroll() {
              if (scheduled) return;
              scheduled = true;
              requestAnimationFrame(function() {
                var prog = sectionProgress();
                placePin(prog);
                if (prog > 0.92 && !dropped) { dropped = true; drop(); }
                if (prog < 0.1) { dropped = false; dropOffset = 0; }
                scheduled = false;
              });
            }
            var sio = new IntersectionObserver(function(entries) {
              if (entries[0].isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
              else window.removeEventListener('scroll', onScroll);
            }, { threshold: 0.01 });
            sio.observe(mapSection);
            window.addEventListener('resize', onScroll);
          })();
        `
      }} />
    </>
  );
}
