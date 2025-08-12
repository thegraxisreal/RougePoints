import { Map } from "@/components/Map";

export default function Home() {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>RoguePoints — Every place has a story</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-black text-white antialiased selection:bg-white/10">
        {/* Top Nav */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <a href="#" className="inline-flex items-center gap-3 group">
                {/* Simple SVG logo */}
                <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7">
                  <defs>
                    <linearGradient id="rgp-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#f87171" />
                      <stop offset="1" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <path d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="url(#rgp-grad)"/>
                </svg>
                <span className="font-semibold tracking-tight">RoguePoints</span>
              </a>
              <nav className="hidden items-center gap-6 md:flex">
                <a href="#map-preview" className="text-sm text-white/70 hover:text-blue-400 transition">Examples</a>
                <a href="#features" className="text-sm text-white/70 hover:text-white transition">Features</a>
                <a href="#stories" className="text-sm text-white/70 hover:text-white transition">Stories</a>
                <a href="#get-started" className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition">Get Started</a>
              </nav>
              <a href="#get-started" className="md:hidden inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.98] transition">Get Started</a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="py-20 sm:py-28 md:py-32">
              <div className="grid items-center gap-10 md:grid-cols-2">
                {/* Left: Slogan */}
                <div className="max-w-3xl" data-animate>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                    Every place has a story. <span className="text-white/70">Pin yours.</span>
                  </h1>
                  <p className="mt-5 text-lg text-white/70">
                    RoguePoints is a social, story-driven map. Drop pins anywhere and attach the moments that never
                    make it to Instagram—urban legends, funny mishaps, secret spots, epic nights.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a id="get-started" href="#stories" className="inline-flex items-center rounded-full bg-green-500 px-5 py-3 font-semibold text-black hover:bg-green-400 active:scale-[.98] transition">
                      Get Started
                    </a>
                    <a href="#map-preview" className="inline-flex items-center rounded-full border border-blue-400/50 px-5 py-3 font-semibold text-blue-300 hover:bg-blue-400/10 active:scale-[.98] transition">
                      See Examples
                    </a>
                  </div>
                </div>

                {/* Right: Map card wrapper */}
                <div className="mx-auto w-full max-w-xl" data-animate>
                  <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/30">
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      {/* Bird's-eye City Map Illustration */}
                      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full" aria-hidden="true">
                        <defs>
                          {/* Subtle grid */}
                          <pattern id="heroGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                            <path d="M 28 0 L 0 0 0 28" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
                          </pattern>
                          {/* Vignette */}
                          <radialGradient id="mapVignette" cx="50%" cy="50%" r="75%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)"/>
                            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
                          </radialGradient>
                          {/* Park hatch pattern */}
                          <pattern id="parkHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="6" height="6" fill="rgba(34,197,94,0.12)"/>
                            <path d="M0 0 L0 6" stroke="rgba(34,197,94,0.28)" strokeWidth="1"/>
                          </pattern>
                        </defs>

                        {/* Background */}
                        <rect x="0" y="0" width="800" height="600" fill="#0b0b0b"/>
                        <rect x="0" y="0" width="800" height="600" fill="url(#heroGrid)"/>
                        <rect x="0" y="0" width="800" height="600" fill="url(#mapVignette)"/>

                        {/* Water (river + bay) */}
                        <g fill="rgba(59,130,246,0.18)" stroke="rgba(59,130,246,0.35)" strokeWidth="2">
                          <path d="M-20,460 C100,420 200,440 280,420 C360,400 440,340 530,350 C600,358 680,390 820,360 L820,640 L-20,640 Z"/>
                          <path d="M420,160 C450,190 430,230 460,260 C490,290 560,300 600,290 C640,280 700,240 720,220 C740,200 720,170 700,160 C660,140 600,140 560,150 C520,160 490,170 470,170 C450,170 440,155 420,160 Z"/>
                        </g>

                        {/* Bridges over water */}
                        <g fill="rgba(255,255,255,0.25)">
                          <rect x="520" y="330" width="72" height="6" rx="3"/>
                          <rect x="610" y="330" width="72" height="6" rx="3"/>
                        </g>

                        {/* Major roads */}
                        <g stroke="rgba(255,255,255,0.28)" strokeWidth="6" fill="none" strokeLinecap="round">
                          <path d="M60 520 C 160 460, 220 420, 290 380 S 420 320, 520 300 S 700 260, 760 210"/>
                          <path d="M80 160 C 160 180, 220 220, 260 280 S 320 380, 340 460"/>
                          <path d="M180 80 C 260 120, 360 120, 460 140 S 620 180, 700 220"/>
                        </g>

                        {/* Minor roads grid-ish */}
                        <g stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none">
                          {/* Vertical */}
                          <path d="M120 60 L120 540"/>
                          <path d="M160 60 L160 540"/>
                          <path d="M200 60 L200 540"/>
                          <path d="M240 60 L240 540"/>
                          <path d="M280 60 L280 540"/>
                          <path d="M320 60 L320 540"/>
                          <path d="M360 60 L360 540"/>
                          <path d="M400 60 L400 540"/>
                          <path d="M440 60 L440 540"/>
                          <path d="M480 60 L480 540"/>
                          <path d="M520 60 L520 540"/>
                          <path d="M560 60 L560 540"/>
                          <path d="M600 60 L600 540"/>
                          <path d="M640 60 L640 540"/>
                          <path d="M680 60 L680 540"/>
                          {/* Horizontal */}
                          <path d="M80 120 L760 120"/>
                          <path d="M80 160 L760 160"/>
                          <path d="M80 200 L760 200"/>
                          <path d="M80 240 L760 240"/>
                          <path d="M80 280 L760 280"/>
                          <path d="M80 320 L760 320"/>
                          <path d="M80 360 L760 360"/>
                          <path d="M80 400 L760 400"/>
                          <path d="M80 440 L760 440"/>
                          <path d="M80 480 L760 480"/>
                        </g>

                        {/* City blocks (varied opacities) */}
                        <g>
                          <g fill="rgba(255,255,255,0.06)">
                            <rect x="100" y="130" width="48" height="28" rx="2"/>
                            <rect x="154" y="130" width="48" height="28" rx="2"/>
                            <rect x="208" y="130" width="48" height="28" rx="2"/>
                            <rect x="262" y="130" width="48" height="28" rx="2"/>
                            <rect x="316" y="130" width="48" height="28" rx="2"/>
                            <rect x="370" y="130" width="48" height="28" rx="2"/>
                            <rect x="424" y="130" width="48" height="28" rx="2"/>
                            <rect x="478" y="130" width="48" height="28" rx="2"/>
                            <rect x="532" y="130" width="48" height="28" rx="2"/>
                            <rect x="586" y="130" width="48" height="28" rx="2"/>
                          </g>
                          <g fill="rgba(255,255,255,0.06)">
                            <rect x="100" y="170" width="48" height="28" rx="2"/>
                            <rect x="154" y="170" width="48" height="28" rx="2"/>
                            <rect x="208" y="170" width="48" height="28" rx="2"/>
                            <rect x="262" y="170" width="48" height="28" rx="2"/>
                            <rect x="316" y="170" width="48" height="28" rx="2"/>
                            <rect x="370" y="170" width="48" height="28" rx="2"/>
                            <rect x="424" y="170" width="48" height="28" rx="2"/>
                            <rect x="478" y="170" width="48" height="28" rx="2"/>
                            <rect x="532" y="170" width="48" height="28" rx="2"/>
                            <rect x="586" y="170" width="48" height="28" rx="2"/>
                          </g>
                          <g fill="rgba(255,255,255,0.06)">
                            <rect x="140" y="210" width="54" height="30" rx="2"/>
                            <rect x="198" y="210" width="40" height="30" rx="2"/>
                            <rect x="244" y="210" width="46" height="30" rx="2"/>
                            <rect x="294" y="210" width="52" height="30" rx="2"/>
                            <rect x="350" y="210" width="42" height="30" rx="2"/>
                            <rect x="396" y="210" width="48" height="30" rx="2"/>
                            <rect x="448" y="210" width="44" height="30" rx="2"/>
                            <rect x="496" y="210" width="52" height="30" rx="2"/>
                            <rect x="552" y="210" width="40" height="30" rx="2"/>
                          </g>
                          <g fill="rgba(255,255,255,0.06)">
                            <rect x="120" y="330" width="46" height="30" rx="2"/>
                            <rect x="170" y="330" width="52" height="30" rx="2"/>
                            <rect x="226" y="330" width="44" height="30" rx="2"/>
                            <rect x="274" y="330" width="50" height="30" rx="2"/>
                            <rect x="330" y="330" width="44" height="30" rx="2"/>
                            <rect x="378" y="330" width="48" height="30" rx="2"/>
                            <rect x="430" y="330" width="46" height="30" rx="2"/>
                            <rect x="480" y="330" width="50" height="30" rx="2"/>
                            <rect x="536" y="330" width="44" height="30" rx="2"/>
                          </g>
                        </g>

                        {/* Parks */}
                        <g stroke="rgba(34,197,94,0.4)" strokeWidth="2" fill="url(#parkHatch)">
                          <path d="M140 260 C 160 250, 190 248, 210 260 C 230 272, 232 300, 210 310 C 188 320, 160 312, 148 296 C 136 280, 128 268, 140 260 Z"/>
                          <path d="M520 210 C 540 200, 565 198, 590 210 C 612 221, 612 242, 590 254 C 566 266, 540 260, 526 244 C 512 228, 504 218, 520 210 Z"/>
                        </g>

                        {/* Rail line */}
                        <g stroke="rgba(250,204,21,0.5)" strokeWidth="3" fill="none" strokeDasharray="6 6" strokeLinecap="round">
                          <path d="M60 440 C 160 420, 240 390, 320 360 S 480 300, 620 290"/>
                        </g>

                        {/* Roundabouts / plazas */}
                        <g fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
                          <circle cx="260" cy="280" r="10"/>
                          <circle cx="520" cy="300" r="9"/>
                        </g>
                      </svg>
                    </div>

                    {/* Interactive layer (pins + tooltips) */}
                    <div className="absolute inset-0">
                      {/* PIN 1: Blue (Europe-ish) */}
                      <div className="group absolute left-[58%] top-[28%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-full">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#60a5fa"/>
                            <circle cx="12" cy="9.2" r="2.6" fill="white"/>
                          </svg>
                        </button>
                        {/* Tooltip (opens to the RIGHT) */}
                        <div className="pointer-events-auto absolute left-9 top-1/2 -translate-y-1/2 z-10 w-64 max-w-[min(16rem,calc(100vw-4rem))] opacity-0 translate-x-1 scale-[.98]
                                    rounded-xl border border-blue-400/50 bg-black/90 backdrop-blur p-3 shadow-lg transition
                                    group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=240&q=60"
                                 alt="Portrait of Sam" className="h-12 w-12 rounded-lg object-cover"/>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-blue-300 truncate">Sam R.</p>
                              <p className="text-xs text-white/70 truncate">Barcelona, ES</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">
                            "Hidden jazz club behind the bakery. Ask for Marta."
                          </p>
                        </div>
                      </div>

                      {/* PIN 2: Green (NYC-ish) */}
                      <div className="group absolute left-[32%] top-[42%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus:outline-none focus:ring-2 focus:ring-green-400/50 rounded-full">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#22c55e"/>
                            <circle cx="12" cy="9.2" r="2.6" fill="white"/>
                          </svg>
                        </button>
                        {/* Tooltip (opens to the LEFT) */}
                        <div className="pointer-events-auto absolute right-9 top-1/2 -translate-y-1/2 z-10 w-64 max-w-[min(16rem,calc(100vw-4rem))] opacity-0 -translate-x-1 scale-[.98]
                                    rounded-xl border border-green-400/50 bg-black/90 backdrop-blur p-3 shadow-lg transition
                                    group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=60"
                                 alt="Portrait of Jules" className="h-12 w-12 rounded-lg object-cover"/>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-green-300 truncate">Jules T.</p>
                              <p className="text-xs text-white/70 truncate">Brooklyn, NY</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">
                            "Best dumplings. Cash only. Order from the basement window."
                          </p>
                        </div>
                      </div>

                      {/* PIN 3: Red (Tokyo-ish) */}
                      <div className="group absolute left-[74%] top-[54%] -translate-x-1/2 -translate-y-1/2">
                        <button className="relative inline-flex h-7 w-7 items-center justify-center outline-none focus:outline-none focus:ring-2 focus:ring-red-400/60 rounded-full">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow" aria-hidden="true">
                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 6.2 12.4 6.6 12.9.2.2.6.2.8 0C12.8 21.4 19 14.2 19 9c0-3.9-3.1-7-7-7Z" fill="#ef4444"/>
                            <circle cx="12" cy="9.2" r="2.6" fill="white"/>
                          </svg>
                        </button>
                        {/* Tooltip (opens to the RIGHT) */}
                        <div className="pointer-events-auto absolute left-9 top-1/2 -translate-y-1/2 z-10 w-64 max-w-[min(16rem,calc(100vw-4rem))] opacity-0 translate-x-1 scale-[.98]
                                    rounded-xl border border-red-400/60 bg-black/90 backdrop-blur p-3 shadow-lg transition
                                    group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:scale-100">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=60"
                                 alt="Portrait of Kenji" className="h-12 w-12 rounded-lg object-cover"/>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-red-300 truncate">Kenji S.</p>
                              <p className="text-xs text-white/70 truncate">Shinjuku, JP</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-white/80">
                            "The ghost in Room 27 knocks twice. I heard it."
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* hint */}
                    <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/60">
                      Hover or focus pins for stories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 from-black to-transparent bg-gradient-to-t"></div>
        </section>

        {/* Map Preview */}
        <section id="map-preview" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 grid items-center gap-10 md:grid-cols-2">
            {/* Card with SVG Map */}
            <div className="flex justify-center" data-animate>
              <div className="w-72 sm:w-80 md:w-[26rem] aspect-square rounded-2xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/30 p-4">
                <svg id="previewMap" viewBox="0 0 300 300" className="h-full w-full">
                  <defs>
                    {/* Grid pattern */}
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" className="stroke-white/10" fill="none" strokeWidth="1"/>
                    </pattern>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.9"/>
                    </filter>
                  </defs>

                  {/* Background grid */}
                  <rect x="0" y="0" width="300" height="300" fill="url(#grid)" />

                  {/* A few "blocks"/water to make it map-like */}
                  <rect x="18" y="18" width="90" height="60" className="fill-white/5" />
                  <rect x="210" y="28" width="72" height="46" className="fill-white/5" />
                  <rect x="200" y="200" width="86" height="70" className="fill-white/5" />
                  <rect x="28" y="188" width="70" height="86" className="fill-white/5" />

                  {/* Path the pin will follow */}
                  <path id="routePath" d="M40 250 C 80 180, 60 150, 120 130 S 220 100, 210 70 S 140 80, 170 150 S 240 210, 260 240"
                        className="fill-none stroke-white/25" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8"/>

                  {/* The animated pin (origin at the tip) */}
                  <g id="pin" filter="url(#glow)" transform="translate(40,250)">
                    {/* pointer */}
                    <path d="M0 0 L6 -10 L-6 -10 Z" className="fill-red-500"/>
                    {/* head */}
                    <circle cx="0" cy="-16" r="9" className="fill-red-500"/>
                    <circle cx="0" cy="-16" r="4.5" className="fill-white/90"/>
                  </g>
                </svg>
              </div>
            </div>

            {/* Text Block */}
            <div className="" data-animate>
              <h2 className="text-2xl sm:text-3xl font-bold">A living map of inside jokes and whispered legends.</h2>
              <p className="mt-3 text-white/70">
                Drop a pin anywhere and attach a micro‑story. See the city through everyone's
                mythologies—moments that live on in the group chat and fade everywhere else.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-yellow-400/60 px-3 py-1 text-sm text-yellow-300">funny</span>
                <span className="inline-flex items-center rounded-full border border-green-400/60 px-3 py-1 text-sm text-green-300">epic</span>
                <span className="inline-flex items-center rounded-full border border-blue-400/60 px-3 py-1 text-sm text-blue-300">legend</span>
                <span className="inline-flex items-center rounded-full border border-red-400/60 px-3 py-1 text-sm text-red-300">secret</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1 - Blue */}
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition
                          hover:scale-[1.02] hover:border-blue-400/50" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                  🧭
                </div>
                <h3 className="font-semibold">Drop Pins Anywhere</h3>
                <p className="mt-2 text-sm text-white/70">From your hometown alley to a mountain ridge—your map, your lore.</p>
              </div>
              {/* Card 2 - Green */}
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition
                          hover:scale-[1.02] hover:border-green-400/50" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-300">
                  ✍️
                </div>
                <h3 className="font-semibold">Tell the Story</h3>
                <p className="mt-2 text-sm text-white/70">Attach text, pics, or voice notes. Keep it raw, short, and real.</p>
              </div>
              {/* Card 3 - Yellow */}
              <div className="group rounded-2xl border border-white/10 bg-zinc-900 p-6 transition
                          hover:scale-[1.02] hover:border-yellow-400/60" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-300">
                  😄
                </div>
                <h3 className="font-semibold">React with Vibes</h3>
                <p className="mt-2 text-sm text-white/70">Laugh, gasp, or drop a 🔥—quick reactions keep the map playful.</p>
              </div>
              {/* Card 4 - Red */}
              <div className="group rounded-1/2 border border-white/10 bg-zinc-900 p-6 transition
                          hover:scale-[1.02] hover:border-red-400/60" data-animate>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-300">
                  🕵️‍♀️
                </div>
                <h3 className="font-semibold">Find the Hidden</h3>
                <p className="mt-2 text-sm text-white/70">Hunt down mysteries and secret spots. Some pins only reveal nearby.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stories */}
        <section id="stories" className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center" data-animate>
            <h2 className="text-3xl sm:text-4xl font-bold">Stories That Live on the Map.</h2>
            <p className="mt-4 text-white/70">
              Stumble on a rooftop party that became lore. Read a stranger's note about the
              tree they carved initials into. Follow breadcrumbs to the best dumplings you've never posted.
            </p>
            <a href="#home" className="mt-7 inline-flex items-center rounded-full border border-blue-400/50 px-5 py-3 font-semibold text-blue-300 hover:bg-blue-400/10 active:scale-[.98] transition">
              Read More Stories
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6">
                <path d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" className="fill-white/60"/>
              </svg>
              <span className="text-sm text-white/60">© <span id="year"></span> RoguePoints</span>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <a href="#" className="text-white/70 hover:text-blue-400 transition">Terms</a>
              <a href="#" className="text-white/70 hover:text-white transition">Privacy</a>
              <a href="#" className="text-white/70 hover:text-green-400 transition">Contact</a>
            </div>
    </div>
        </footer>

        {/* JavaScript for animations */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Respect reduced motion
            const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Year in footer
            document.getElementById('year').textContent = new Date().getFullYear();

            // Fade-in on scroll
            (() => {
              const els = document.querySelectorAll('[data-animate]');
              els.forEach(el => {
                el.classList.add('opacity-0', 'translate-y-6', 'transition', 'duration-700', 'ease-out', 'will-change-transform');
              });

              const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-6');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    io.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.15 });

              els.forEach(el => io.observe(el));
            })();

            // Map pin animation tied to scroll
            (() => {
              const svg = document.getElementById('previewMap');
              if (!svg) return;
              const mapSection = document.getElementById('map-preview');
              const path = svg.querySelector('#routePath');
              const pin = svg.querySelector('#pin');
              if (!path || !pin) return;

              const total = path.getTotalLength();
              let dropped = false;
              let dropOffset = 0;
              let dropRAF = null;

              // Utility
              const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

              // Position pin along path for a given 0..1 progress
              function placePin(progress) {
                const d = progress * total;
                const p = path.getPointAtLength(d);
                const p2 = path.getPointAtLength(Math.min(total, d + 0.5));
                const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;

                // Use SVG transform attribute (works in SVG coordinate space)
                pin.setAttribute('transform', \`translate(\${p.x} \${p.y + dropOffset}) rotate(\${angle})\`);
                // Also draw the path progressively for fun
                path.setAttribute('stroke-dasharray', \`\${total}\`);
                path.setAttribute('stroke-dashoffset', \`\${(1 - progress) * total}\`);
              }

              // Compute section scroll progress 0..1
              function sectionProgress() {
                const rect = mapSection.getBoundingClientRect();
                const vh = window.innerHeight || document.documentElement.clientHeight;
                // Start when section enters bottom of viewport; finish before it fully exits
                const start = vh;
                const end = -rect.height * 0.2;
                const t = (start - rect.top) / (start - end);
                return clamp(t, 0, 1);
              }

              // Drop animation (small bounce)
              function drop() {
                if (dropRAF) cancelAnimationFrame(dropRAF);
                const start = performance.now();
                const D = 450; // ms
                const H = -14; // pixels upward before landing

                function easeOutBack(x) {
                  const c1 = 1.70158, c3 = c1 + 1;
                  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
                }

                function step(now) {
                  const t = clamp((now - start) / D, 0, 1);
                  const e = easeOutBack(t);
                  dropOffset = H * (1 - e);
                  placePin(sectionProgress());
                  if (t < 1) {
                    dropRAF = requestAnimationFrame(step);
                  } else {
                    dropRAF = null;
                    dropOffset = 0;
                    placePin(sectionProgress());
                  }
                }
                dropRAF = requestAnimationFrame(step);
              }

              // Initialize at start of path
              placePin(0);

              if (REDUCED) {
                // If reduced motion, jump to the end and skip animations
                placePin(1);
                return;
              }

              // Throttled scroll handler
              let scheduled = false;
              function onScroll() {
                if (scheduled) return;
                scheduled = true;
                requestAnimationFrame(() => {
                  const prog = sectionProgress();
                  placePin(prog);

                  // Trigger drop once when we near the end of the path
                  if (prog > 0.92 && !dropped) {
                    dropped = true;
                    drop();
                  }
                  // Allow it to replay if user scrolls far back up
                  if (prog < 0.1) {
                    dropped = false;
                    dropOffset = 0;
                  }
                  scheduled = false;
                });
              }

              // Only listen while section is in view
              const io = new IntersectionObserver(entries => {
                const e = entries[0];
                if (e.isIntersecting) {
                  window.addEventListener('scroll', onScroll, { passive: true });
                  onScroll();
                } else {
                  window.removeEventListener('scroll', onScroll);
                }
              }, { threshold: 0.01 });

              io.observe(mapSection);
              // Also update on resize (layout changes)
              window.addEventListener('resize', onScroll);
            })();
          `
        }} />
      </body>
    </html>
  );
}
