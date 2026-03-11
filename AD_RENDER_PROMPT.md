# RoguePoints — 20-Second Cinematic Advertisement Render Prompt

> **Renderer:** Python + Cairo + ffmpeg
> **Resolution:** 1280 × 720 px
> **Frame rate:** 30 fps (600 frames total)
> **Colorspace:** sRGB
> **Theme:** Dark, cinematic, atmospheric

---

## 1. COLOR PALETTE — Exact Hex Values from Codebase

Source: `/web/src/app/globals.css` CSS variables + hardcoded values in components.

```
/* Root CSS Variables */
--background:   #0a0a0f   /* Near-black navy. Canvas fill for every scene. */
--foreground:   #e8e4de   /* Warm off-white. Primary readable text. */
--amber:        #fbbf24   /* Brand amber. Primary CTA, logo, pins, FAB. */
--amber-dim:    #b45309   /* Dimmed amber for secondary accents. */
--amber-light:  #f59e0b   /* Gradient middle stop. */
--amber-deep:   #d97706   /* Deepest amber gradient stop. */
--rose:         #f472b6   /* Pink accent. */
--seafoam:      #34d399   /* Emerald green. "Wholesome" category, live dot. */
--slate-blue:   #60a5fa   /* Blue accent. "Legend" category. */

/* Category Colors — used on pins, tag pills, card borders */
funny:      #fbbf24   /* amber-400 */
mystery:    #a78bfa   /* purple-400 */
danger:     #f87171   /* red-400 */
legend:     #60a5fa   /* blue-400 */
wholesome:  #34d399   /* emerald-400 */
other:      #9ca3af   /* gray-400 */

/* Purple — spot/landmark system */
spot-purple:      #7c3aed
spot-purple-mid:  #8b5cf6
spot-purple-glow: #a78bfa

/* Glass surfaces */
surface-panel:   #13131a   /* PinDetail, ComposeModal, SpotCompose */
surface-overlay: #0d0d14   /* InviteModal */

/* White opacity layers (used as rgba in all borders/fills) */
white-06:  rgba(255,255,255,0.06)
white-08:  rgba(255,255,255,0.08)
white-10:  rgba(255,255,255,0.10)
white-20:  rgba(255,255,255,0.20)
white-40:  rgba(255,255,255,0.40)
white-60:  rgba(255,255,255,0.60)
white-90:  rgba(255,255,255,0.90)

/* Map tile tint (dark mode) */
map-dark-bg: #0a0a0f

/* Glow recipes (box-shadow values from globals.css) */
glow-amber:     0 0 40px rgba(251,191,36,0.15), 0 0 80px rgba(251,191,36,0.05)
glow-amber-sm:  0 0 20px rgba(251,191,36,0.12)
glow-amber-fab: 0 0 32px rgba(251,191,36,0.35)   /* Drop Pin FAB */
glow-purple:    0 0 32px rgba(139,92,246,0.35)
```

---

## 2. TYPOGRAPHY

Source: `/web/src/app/layout.tsx` (Google Fonts import), `globals.css`

```
/* Two fonts only */
display: "Instrument Serif"  /* serif, italic variant for logo + hero */
body:    "DM Sans"           /* sans-serif, weights 300–700, all UI text */

/* Size scale (Tailwind class → px) */
text-[10px] → 10px    /* version badge, fine labels */
text-[11px] → 11px    /* live status, connector labels */
text-[13px] → 13px    /* story body text in landing card */
text-xs     → 12px    /* category tags, reaction counts, author meta */
text-sm     → 14px    /* modal body, FAB label, input text */
text-base   → 16px    /* reaction buttons */
text-xl     → 20px    /* modal title */
text-2xl    → 24px    /* pin detail panel heading */
text-3xl    → 30px    /* InviteModal headline */
text-7xl    → 72px    /* hero (desktop) */

/* Weight scale */
font-light     → 300
font-normal    → 400
font-medium    → 500
font-semibold  → 600
font-bold      → 700

/* Letter spacing */
tracking-tight    → -0.025em   /* hero + modal headlines */
tracking-widest   → 0.1em      /* uppercase section labels */

/* Logo style */
font: "Instrument Serif" italic 16px
color: rgba(255,255,255,0.80) in header
hero variant: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)
  applied as background-clip:text / -webkit-text-fill-color:transparent

/* Amber gradient text recipe */
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

---

## 3. COMPONENT SPECS

### 3.1 MAP CANVAS

The map fills the full 1280×720 canvas. Render as a stylized dark city grid.

```
Background fill:   #0a0a0f
Street lines:      rgba(255,255,255,0.045) — 1px, grid pattern
Block fills:       rgba(20,20,30,0.80)
Water bodies:      rgba(10,20,40,0.90)
Park areas:        rgba(10,30,15,0.50)

Vignette overlay (always present, on top of map, below UI):
  radial-gradient(
    ellipse 80% 70% at 50% 50%,
    transparent 20%,
    rgba(10,10,15,0.65) 60%,
    rgba(10,10,15,0.95) 100%
  )

Grain texture (topmost layer, z=9999):
  SVG feTurbulence baseFrequency=0.65, numOctaves=3
  opacity: 0.035
  tile size: 256×256px
```

---

### 3.2 MAP PIN MARKERS

Source: `AppMap.tsx`

Each pin is a **30×38 px** SVG teardrop. The pointy bottom is the geographic
anchor (iconAnchor at [15, 38]).

```svg
<svg viewBox="0 0 30 38" width="30" height="38">
  <defs>
    <filter id="pin-shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3"
        flood-color="{CATEGORY_COLOR}" flood-opacity="0.65"/>
    </filter>
  </defs>
  <!-- Teardrop body, filled with category color -->
  <path d="M15 1C7.268 1 1 7.268 1 15C1 24 15 37 15 37S29 24 29 15C29 7.268 22.732 1 15 1Z"
    fill="{CATEGORY_COLOR}" filter="url(#pin-shadow)"/>
  <!-- White center circle, opacity 0.92 -->
  <circle cx="15" cy="15" r="6.5" fill="white" opacity="0.92"/>
</svg>
```

Category fill + glow colors:
```
funny:      fill="#fbbf24"  glow-flood="#fbbf24"
mystery:    fill="#a78bfa"  glow-flood="#a78bfa"
danger:     fill="#f87171"  glow-flood="#f87171"
legend:     fill="#60a5fa"  glow-flood="#60a5fa"
wholesome:  fill="#34d399"  glow-flood="#34d399"
```

**Orbiting emoji ring** (rendered in world-space around the pin):
```
Count: up to 8 emojis
Orbit radius: 22px from pin center (15,15)
Font-size: 12px
Drop-shadow: 0 1px 2px rgba(0,0,0,0.50)
Pointer-events: none

Example emojis by category:
  funny:     😂 💀 🤣
  mystery:   👁️ 🔮 ❓
  danger:    ⚠️ 🔥 💀
  legend:    ⭐ 🏆 👑
  wholesome: 🌱 💚 ✨
```

**Pin drop animation** (on first appearance):
```
Keyframes (6 stops over 0.6s, cubic-bezier(0.22, 1, 0.36, 1)):
  0%:   translateY(-20px), opacity=0
  50%:  translateY(+4px),  opacity=1
  70%:  translateY(-2px),  opacity=1
  100%: translateY(0),     opacity=1
Total frames: ~18 frames @ 30fps
```

**Title card tooltip** (floats above each pin):
```
Max-width: 200px, auto-height
Background: rgba(20,20,30,0.92)
Backdrop-filter: blur(4px)
Border: 1px solid rgba(255,255,255,0.10)
Border-radius: 10px
Padding: 6px 10px
Font: DM Sans 11px, color #ffffff, line-height 1.3
Box-shadow: 0 2px 8px rgba(0,0,0,0.40)
Bottom pointer triangle:
  border: 5px solid transparent
  border-top-color: rgba(20,20,30,0.92)
  centered horizontally beneath tooltip
```

---

### 3.3 FLOATING HEADER / NAV BAR

Source: `app/map/page.tsx`

```
Position: absolute, top=0, left=0, right=0, z-index=20
Layout: flex, space-between, align-center
Padding: 12px 24px
Pointer-events: none on container; children opt back in
```

**Logo button** (left):
```
Border-radius: 12px
Border: 1px solid rgba(255,255,255,0.08)
Background: rgba(0,0,0,0.50) + backdrop-blur(12px)
Padding: 8px 16px
Gap: 8px (icon + text)

Logo pin SVG (20×20, inside button):
  <svg viewBox="0 0 32 42">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
    <path fill="url(#lg)"
      d="M16 1C8.268 1 2 7.268 2 15C2 25 16 41 16 41S30 25 30 15C30 7.268 23.732 1 16 1Z"/>
    <circle cx="16" cy="15" r="6.5" fill="white" opacity="0.90"/>
  </svg>

App name: "RoguePoints"
  Font: "Instrument Serif" italic 16px
  Color: rgba(255,255,255,0.80)
```

**Live indicator** (next to logo):
```
Dot: 6×6px circle, fill #34d399
Pulse animation:
  0%,100%: opacity=1, scale=1.0
  50%:     opacity=0.5, scale=1.5
  Duration: 2.5s ease-in-out, infinite
Text: "live"  DM Sans 11px rgba(255,255,255,0.50)
```

**Mode toggles pill** (right side):
```
Border-radius: 9999px
Border: 1px solid rgba(255,255,255,0.08)
Background: rgba(0,0,0,0.50) + backdrop-blur(12px)
Padding: 4px
Gap: 6px between buttons

Each button: 32×32px, border-radius 50%
  Sun icon (light mode):
    Active:   color=white
    Inactive: color=rgba(255,255,255,0.70)
  Divider: 1px wide × 16px tall, rgba(255,255,255,0.10)
  Globe icon (satellite):
    Active:   bg=rgba(52,211,153,0.20), color=#34d399
    Inactive: color=rgba(255,255,255,0.70)
```

**User avatar** (far right):
```
32×32px circle
Wrapper: border-radius 50%, border 1px solid rgba(255,255,255,0.08)
  background rgba(0,0,0,0.50) backdrop-blur(12px), padding 2px
Fallback: bg=rgba(251,191,36,0.20), text=#fcd34d, DM Sans 12px font-medium
```

---

### 3.4 DROP PIN FAB

Source: `app/map/page.tsx`

```
Position: absolute, bottom=32px, centered horizontally, z-index=20

INACTIVE (default):
  Display: flex, align-center, gap=8px
  Border-radius: 9999px
  Background: #fbbf24
  Color: #000000
  Padding: 12px 20px
  Font: DM Sans 14px font-semibold
  Box-shadow: 0 0 32px rgba(251,191,36,0.35)
  Icon: "+" SVG 16×16
  Label: "Drop a Pin"

ACTIVE (drop mode on):
  Background: rgba(251,191,36,0.20)
  Border: 1px solid rgba(251,191,36,0.50)
  Color: #fcd34d
  Box-shadow: none
  Icon: "×" SVG 16×16
  Label: "Cancel"

Press animation: scale(1.0) → scale(0.93) → scale(1.0), 12 frames
```

---

### 3.5 DROP MODE BANNER

Source: `app/map/page.tsx`

```
Position: absolute, top=80px, centered horizontally, z-index=20

Container:
  Display: flex, align-center, gap=8px
  Border-radius: 9999px
  Border: 1px solid rgba(251,191,36,0.30)
  Background: rgba(0,0,0,0.70) + backdrop-blur(12px)
  Padding: 8px 20px

Icon: location-pin SVG 16×16, color=#fcd34d
Text: "Tap anywhere on the map to drop a pin"
  DM Sans 14px, color=#fcd34d
Close (×): color=rgba(255,255,255,0.40), margin-left=8px
```

---

### 3.6 PIN DETAIL PANEL

Source: `PinDetail.tsx`

The most prominent UI element — slides up from bottom when a pin is tapped.

```
Desktop (>640px):
  Position: fixed, bottom=24px, left=50%, transform=-translateX(50%)
  Width: 520px, z-index=50

Panel container:
  Border-radius: 24px
  Border: 1px solid rgba(255,255,255,0.08)
  Background: #13131a
  Box-shadow: 0 25px 50px rgba(0,0,0,0.70)
  Overflow: hidden

Slide-up entry animation:
  From: translateY(100%) opacity=0
  To:   translateY(0)    opacity=1
  Duration: 0.3s cubic-bezier(0.22, 1, 0.36, 1)
```

**Drag handle**:
```
Container: padding-top=14px, padding-bottom=8px, flex justify-center
Handle bar: 56×6px (w-14, h-1.5), border-radius=full
  Background: rgba(255,255,255,0.20)
```

**Category tag** (just inside panel, below handle):
```
Display: inline-flex, border-radius=9999px
Border: 1px solid {categoryColor}/40
Color: {categoryColor_lighter}
Padding: 2px 12px
Font: DM Sans 12px font-medium

Per-category (border / text color):
  funny:     rgba(251,191,36,0.40)  / #fcd34d
  mystery:   rgba(167,139,250,0.40) / #c4b5fd
  danger:    rgba(248,113,113,0.40) / #fca5a5
  legend:    rgba(96,165,250,0.40)  / #93c5fd
  wholesome: rgba(52,211,153,0.40)  / #6ee7b7
```

**Pin title**:
```
Font: "Instrument Serif" (not italic here), 24px, normal weight
Color: #ffffff
Example: "The Tree That Never Turns"
```

**Author row**:
```
Display: flex, align-center, gap=8px
Border-bottom: 1px solid rgba(255,255,255,0.06)
Padding-bottom: 20px

Avatar: 36×36px circle
  Image: rounded-full, ring 1px rgba(255,255,255,0.10)
  Fallback initials: bg=rgba(251,191,36,0.20), text=#fcd34d, DM Sans 12px font-medium

Username: DM Sans 12px, color=rgba(255,255,255,0.60)
Timestamp: DM Sans 12px, color=rgba(255,255,255,0.35) — "just now" / "2 hours ago"
Coords: DM Sans 10px font-mono, color=rgba(255,255,255,0.25) — "40.7128° N, 74.0060° W"
```

**Reaction chips strip**:
```
Display: flex, gap=8px, flex-wrap=wrap
Padding: 16px top and bottom
Border-bottom: 1px solid rgba(255,255,255,0.06)

Each chip:
  Display: inline-flex, align-center, gap=8px
  Border-radius: 9999px
  Padding: 8px 16px
  Font: DM Sans 16px
  Transition: all 0.15s

  ACTIVE (reacted):
    Background: rgba(255,255,255,0.15)
    Border: 1px solid rgba(255,255,255,0.20)
    Color: #ffffff

  INACTIVE:
    Background: rgba(255,255,255,0.05)
    Border: 1px solid rgba(255,255,255,0.06)
    Color: rgba(255,255,255,0.60)

Example chip set: "👍 12"  "😂 7"  "😮 3"  "🔥 28"
```

---

### 3.7 COMPOSE MODAL

Source: `ComposeModal.tsx`

```
Backdrop:
  Position: fixed inset-0, z-index=50
  Background: rgba(0,0,0,0.60)
  Backdrop-filter: blur(4px)

Modal card:
  Width: 100%, max-width=512px, centered
  Border-radius: 16px
  Border: 1px solid rgba(255,255,255,0.08)
  Background: #13131a
  Box-shadow: 0 25px 50px rgba(0,0,0,0.60)
  Padding: 24px
```

**Header**:
```
Title: "Drop a pin"
  Font: "Instrument Serif" 20px, color=#ffffff
Subtitle: "40.7128, -74.0060"
  DM Sans 12px font-mono, color=rgba(255,255,255,0.35)
Close ×: 32×32px circle, bg=rgba(255,255,255,0.05), color=rgba(255,255,255,0.40)
```

**Category selector pills**:
```
Display: flex flex-wrap, gap=8px

SELECTED funny:
  border rgba(251,191,36,0.50), color=#fcd34d, bg rgba(251,191,36,0.10)
  label: "😂 funny"

SELECTED mystery:
  border rgba(167,139,250,0.50), color=#c4b5fd, bg rgba(167,139,250,0.10)
  label: "🔮 mystery"

SELECTED danger:
  border rgba(248,113,113,0.50), color=#fca5a5, bg rgba(248,113,113,0.10)
  label: "⚠️ danger"

SELECTED legend:
  border rgba(96,165,250,0.50), color=#93c5fd, bg rgba(96,165,250,0.10)
  label: "⭐ legend"

SELECTED wholesome:
  border rgba(52,211,153,0.50), color=#6ee7b7, bg rgba(52,211,153,0.10)
  label: "🌱 wholesome"

UNSELECTED any:
  border rgba(255,255,255,0.10), color=rgba(255,255,255,0.30)

Pill style: border-radius=9999px, padding=4px 12px, DM Sans 12px font-medium
```

**Title input**:
```
Width: 100%, border-radius=12px
Border: 1px solid rgba(255,255,255,0.10)
Background: rgba(255,255,255,0.04)
Padding: 10px 16px
Font: DM Sans 14px, color=#ffffff, placeholder=rgba(255,255,255,0.20)
Focus ring: border rgba(251,191,36,0.40), ring 1px rgba(251,191,36,0.20)
```

**Buttons row**:
```
Gap: 8px, margin-top=16px

Cancel: flex=1, border-radius=12px, border rgba(255,255,255,0.10)
  Padding: 10px, DM Sans 14px, color=rgba(255,255,255,0.50)

Submit "Drop it": flex=1, border-radius=12px
  Background: #fbbf24, color=#000000
  DM Sans 14px font-semibold
  Disabled: opacity=0.40
```

---

### 3.8 LANDING MAP STORY CARD

Source: `LandingMap.tsx`

Animated story card that floats over the map, connected to a pin by a dashed line.

```
Position: absolute, z-index=20
Approximate width: 230px

Container:
  Background: rgba(10,10,15,0.90)
  Border: 1px solid {pinColor}35   /* 35hex ≈ 21% alpha */
  Backdrop-filter: blur(18px)
  Box-shadow:
    0 8px 32px rgba(0,0,0,0.55),
    0 0 0 1px {pinColor}15         /* 15hex ≈ 8% alpha */
  Border-radius: 16px
  Padding: 16px
```

**Color accent bar** (top of card):
```
Width: 32px, height: 2px
Background: {pinColor}
Border-radius: 9999px
Margin-bottom: 12px
```

**Card title**: DM Sans 13px font-semibold, color=rgba(255,255,255,0.90)

**Location line**: DM Sans 11px, color={pinColor} at 75% opacity

**Story body**: DM Sans 13px italic, line-height=1.6, color=rgba(255,255,255,0.60)

**Reaction row**: flex gap=8px, DM Sans 12px, color=rgba(255,255,255,0.35)
  Format: "👁️ 41  😮 19  🔮 8"

**Category tag pill**:
```
DM Sans 11px, border-radius=9999px, padding=2px 8px
color={pinColor}
border: 1px solid {pinColor}40    /* 40hex ≈ 25% alpha */
```

**Cycle dots** (bottom of card):
```
Active dot:   width=14px, height=5px, bg={pinColor}, border-radius=9999px
Inactive dot: width=5px,  height=5px, bg=rgba(255,255,255,0.18), border-radius=50%
Transition: width 0.3s ease
```

**Dashed SVG connector line** (card edge → pin):
```svg
<line x1="{cardEdgeX}" y1="{cardEdgeY}" x2="{pinX}" y2="{pinY}"
  stroke="{pinColor}"
  stroke-width="1"
  stroke-dasharray="3 5"
  stroke-opacity="0.30"/>
<!-- Animate stroke-dashoffset 0 → -24 on loop (marching ants) -->
```

---

### 3.9 INVITE / WAITLIST MODAL

Source: `InviteModal.tsx`

```
Overlay:
  Position: fixed inset-0, z-index=2000
  Background: rgba(0,0,0,0.80)
  Backdrop-filter: blur(12px)

Modal card:
  Centered (left:50% top:50%, -translate 50% 50%), z-index=2001
  Width: 100%, max-width=448px
  Border-radius: 16px
  Border: 1px solid rgba(255,255,255,0.08)
  Background: #0d0d14
  Box-shadow: 0 25px 50px rgba(0,0,0,0.60)
  Padding: 32px

  Ambient glow behind card (pseudo-element):
    radial-gradient(ellipse 60% 40% at 50% 0%,
      rgba(251,191,36,0.06), transparent 70%)
```

**Pin icon** (centered, top of modal):
```svg
<svg viewBox="0 0 32 42" width="40" height="52">
  <defs>
    <filter id="inv-glow">
      <feDropShadow dx="0" dy="0" stdDeviation="3"
        flood-color="#fbbf24" flood-opacity="0.40"/>
    </filter>
  </defs>
  <path fill="#fbbf24" filter="url(#inv-glow)"
    d="M16 1C8.268 1 2 7.268 2 15C2 25 16 41 16 41S30 25 30 15C30 7.268 23.732 1 16 1Z"/>
  <circle cx="16" cy="15" r="6.5" fill="white" opacity="0.90"/>
</svg>
```

**Headline**: "RoguePoints"
  Font: "Instrument Serif" italic 30px, tracking-tight (-0.025em), color=#ffffff

**Subtext**: "Drop anonymous pins. Share local lore."
  DM Sans 14px, color=rgba(255,255,255,0.45)

**Email input**:
```
Width: 100%, border-radius=12px
Border: 1px solid rgba(255,255,255,0.08)
Background: rgba(255,255,255,0.03)
Padding: 12px 16px
DM Sans 14px, color=#ffffff, placeholder=rgba(255,255,255,0.25)
Focus: border rgba(251,191,36,0.40), ring-2 rgba(251,191,36,0.15)
```

**"Request Access" button**:
```
Width: 100%, border-radius=9999px
Background: #fbbf24, color=#000000
Padding: 12px 20px
DM Sans 16px font-semibold
Hover: #fde68a
Active: scale(0.97)
Box-shadow: 0 0 20px rgba(251,191,36,0.12)   /* glow-amber-sm */
```

---

### 3.10 SPOT MARKERS (Landmark POIs)

Source: `AppMap.tsx`

40×44 px illustrated SVG icons, anchor at [20, 44].

**School** (purple):
```svg
<svg viewBox="0 0 40 44" width="40" height="44">
  <defs>
    <filter id="school-glow">
      <feDropShadow dx="0" dy="3" stdDeviation="4"
        flood-color="#a78bfa" flood-opacity="0.70"/>
    </filter>
  </defs>
  <rect x="4" y="6" width="32" height="28" rx="4"
    fill="#7c3aed" stroke="#a78bfa" stroke-width="1.5"
    filter="url(#school-glow)"/>
  <rect x="8"  y="12" width="6" height="5" rx="1" fill="white" opacity="0.85"/>
  <rect x="17" y="12" width="6" height="5" rx="1" fill="white" opacity="0.85"/>
  <rect x="26" y="12" width="6" height="5" rx="1" fill="white" opacity="0.85"/>
  <rect x="16" y="22" width="8" height="12" rx="1" fill="#fbbf24" opacity="0.90"/>
  <polygon points="2,8 20,0 38,8" fill="#8b5cf6" stroke="#a78bfa" stroke-width="1"/>
</svg>
```

**Park** (green):
```svg
<svg viewBox="0 0 40 44" width="40" height="44">
  <defs>
    <filter id="park-glow">
      <feDropShadow dx="0" dy="3" stdDeviation="4"
        flood-color="#4ade80" flood-opacity="0.60"/>
    </filter>
  </defs>
  <ellipse cx="20" cy="16" rx="14" ry="13"
    fill="#16a34a" stroke="#4ade80" stroke-width="1.5"
    filter="url(#park-glow)"/>
  <ellipse cx="13" cy="14" rx="5" ry="4" fill="#15803d" opacity="0.70"/>
  <rect x="16" y="28" width="8" height="10" rx="1" fill="#92400e"/>
</svg>
```

**Spot notification dot** (badge on marker):
```
Size: 11×11px, border-radius=50%
Background: #f87171
Position: top=-3px, right=-3px
Border: 2px solid #ffffff
Box-shadow: 0 0 6px rgba(248,113,113,0.70)
```

---

## 4. ANIMATION SEQUENCE — 600 Frames @ 30fps

All easing uses **cubic-bezier(0.22, 1, 0.36, 1)** (ease-out-expo) unless noted.

---

### Phase 1 — "World Comes Into Focus" (F0–F90, 0.0s–3.0s)

**F0–F30 (0.0–1.0s): Fade up from black**
- Frame 0: full #0a0a0f (not pure black)
- Map tile layer: opacity 0 → 1, 30 frames, ease-out-expo
- Map shows urban city grid, top-down, slightly tilted camera angle
- Vignette at full strength (outer edges rgba(10,10,15,0.95))

**F30–F90 (1.0–3.0s): Map breathes in — slow pan + zoom settle**
- Map offset: (0,0) → (-30px, -20px), 60 frames, linear (camera drift)
- Map scale: 1.08 → 1.00, 60 frames, ease-out-expo (zoom-out settle)
- Grain texture fades in: opacity 0 → 0.035, 60 frames
- Vignette eases slightly: outer stop rgba(10,10,15,0.95) → rgba(10,10,15,0.80)

---

### Phase 2 — "Pins Drop From The Sky" (F90–F210, 3.0s–7.0s)

**F90–F150 (3.0–5.0s): Three pins drop in sequence**

Pin 1 — funny (#fbbf24), screen pos ~(380, 290):
- F90: begin drop animation — translateY(-20px) opacity=0
- F108: land — translateY(0) opacity=1  (18 frames, ease-out-expo)
- F108–F120: glow burst on land — feDropShadow stdDeviation: 3→15→3, 12 frames

Pin 2 — mystery (#a78bfa), screen pos ~(620, 355):
- F102: begin drop (12-frame stagger from pin 1)
- F120: land + glow burst

Pin 3 — wholesome (#34d399), screen pos ~(780, 245):
- F114: begin drop (12-frame stagger)
- F132: land + glow burst

**F150–F180 (5.0–6.0s): Emoji orbits + tooltips appear**
- Each pin's orbiting emojis fade in: opacity 0→1, 20 frames
- Emojis orbit slowly: rotate 0°→15° over this phase
- Title card tooltips pop in:
  - Fade + scale: scale(0.85) opacity=0 → scale(1.0) opacity=1, 10 frames each
  - Pin 1: "😂 The Cursed Bench"
  - Pin 2: "🔮 The Disappearing Door"
  - Pin 3: "🌱 The Tree That Never Turns"

**F180–F210 (6.0–7.0s): Four more pins scatter**
- Pins 4–7 in danger, legend, mystery, funny drop rapidly across map
- Each: 12-frame drop, 8-frame stagger between them
- Map drifts left 40px as pins spread (camera offset continues)
- 7 total pins now visible

---

### Phase 3 — "Exploring" (F210–F330, 7.0s–11.0s)

**F210–F240 (7.0–8.0s): Header slides down**
- Logo button: translateY(-48px) opacity=0 → translateY(0) opacity=1, 20 frames
- Mode toggles: same, +6f delay
- User avatar: same, +12f delay
- Live dot begins pulsing immediately

**F240–F270 (8.0–9.0s): FAB rises from bottom**
- FAB: translateY(+80px) opacity=0 → translateY(0) opacity=1, 20 frames
- Once settled: glow pulses every 1.5s
  - box-shadow: rgba(251,191,36,0.35) → rgba(251,191,36,0.55) → rgba(251,191,36,0.35)

**F270–F330 (9.0–11.0s): User taps mystery pin — story card opens**
- F270: mystery pin (#a78bfa at ~620,355) brightens
  - feDropShadow stdDeviation: 3→12, opacity: 0.65→1.0, 10 frames

- F280: LandingMap story card slides in from left
  - Start: x=-240px opacity=0 → x=60px opacity=1
  - Duration: 18 frames, ease-out-expo
  - Card content (mystery / #a78bfa):
    - Accent bar: #a78bfa, 2×32px
    - Title: "The Disappearing Door"
    - Location: "Alphabet City, NYC" (color #a78bfa at 75%)
    - Story: *"Three people swear they've seen a red door on E9th — but every time they go back, it's just a wall."*
    - Reactions: "👁️ 41  😮 19  🔮 8"
    - Tag: "mystery" pill (border + text #a78bfa)
    - Dots: 1 active (14px #a78bfa), 4 inactive (5px white/18)

- F285 onward: dashed connector line animates
  - SVG line from card right-edge → pin center
  - stroke-dashoffset animates 0 → -24, looping every 30 frames (marching ants)

- F310–F330: cycle dots transition to next pin story
  - Active dot shrinks back to 5px, next dot expands to 14px, 15 frames

---

### Phase 4 — "Dropping a Pin" (F330–F420, 11.0s–14.0s)

**F330–F345 (11.0–11.5s): Story card exits**
- Card: translateX(0) → translateX(-260px), opacity 1→0, 15 frames

**F345–F360 (11.5–12.0s): FAB press**
- Scale pulse: 1.0 → 0.93 → 1.0, 15 frames
- Color shift: bg #fbbf24 → bg rgba(251,191,36,0.20)
- Border appears: 1px solid rgba(251,191,36,0.50)
- Label crossfades: "Drop a Pin" → "Cancel"
- Icon morphs: "+" → "×" over 6 frames

**F360–F375 (12.0–12.5s): Drop mode banner slides down**
- Banner: translateY(-32px) opacity=0 → translateY(0) opacity=1, 12 frames
- Content: pin icon + "Tap anywhere on the map to drop a pin", color #fcd34d

**F375–F420 (12.5–14.0s): Compose modal rises**
- F375: backdrop fades in — opacity 0→0.60, blur 0→4px, 15 frames
- F380: modal card: translateY(+80px) opacity=0 → translateY(0) opacity=1, 20 frames
- F400: category pills stagger in — each pill: opacity 0→1, scale 0.9→1.0
  - Stagger: +3 frames per pill; order: funny, mystery, danger, legend, wholesome
- F410: "🌱 wholesome" pill transitions to SELECTED state:
  - border rgba(52,211,153,0.50), color #6ee7b7, bg rgba(52,211,153,0.10)
- F405: title input focus ring glows in — border rgba(251,191,36,0.40)
- F412: text types into input — "The tree that never turns"
  - Each character appears every 2 frames (14 chars × 2f = 28 frames)

---

### Phase 5 — "Reaction Moment" (F420–F510, 14.0s–17.0s)

**F420–F440 (14.0–14.67s): Compose modal exits**
- Modal: opacity 1→0, translateY(0→+40px), 20 frames
- Backdrop: opacity 0.60→0, 20 frames

**F440–F460 (14.67–15.33s): New wholesome pin drops**
- Pin #34d399 drops at map center (~640, 360)
- Drop animation: 18 frames, ease-out-expo
- Land impact: glow burst — stdDeviation 3→22→5, 12 frames
- Emoji ring (🌱 💚 ✨) fades in

**F460–F510 (15.33–17.0s): PinDetail panel slides up + reactions**
- F460: panel slides up — translateY(100%→0), 18 frames
- Panel content (wholesome / #34d399):
  - Category tag: "wholesome" — border #34d399/40, color #6ee7b7
  - Title: "The Tree That Never Turns" (Instrument Serif 24px)
  - Author: avatar + "anonymous · just now"
  - Reaction strip: all chips inactive initially
- F485: "🌱" chip pulses — scale 1.0→1.15→1.0, 10 frames
  - Activates: bg rgba(255,255,255,0.15), border rgba(255,255,255,0.20), color #fff
  - Count flips: "🌱 0" → "🌱 1" with pop scale(1.0→1.4→1.0), 8 frames
- F497: "💚" chip activates similarly, count shows 1
- F505: "✨" chip activates, count shows 1
  - Panel looks lively with 3 active chips

---

### Phase 6 — "The Pull-Back + CTA" (F510–F600, 17.0s–20.0s)

**F510–F540 (17.0–18.0s): Pull back, invite modal rises**
- Panel slides back down: translateY(0→100%), opacity 1→0, 20 frames
- Map zoom-out: scale 1.0→0.80, 30 frames (widening reveal)
- Backdrop fades in: opacity 0→0.80, blur 0→12px, 20 frames
- Invite modal: scale(0.85) opacity=0 → scale(1.0) opacity=1, 20 frames (ease-out-expo)

**F540–F570 (18.0–19.0s): Invite modal glows — hold on CTA**
- Ambient glow pulses: rgba(251,191,36,0.06) → rgba(251,191,36,0.14) → rgba(251,191,36,0.06)
  - Period: 30 frames, ease-in-out
- Modal content fully visible:
  - Amber pin icon with glow
  - "RoguePoints" Instrument Serif italic 30px white
  - "Drop anonymous pins. Share local lore." DM Sans 14px rgba(255,255,255,0.45)
  - Email input field (placeholder visible: "your@email.com")
  - "Request Access" button: #fbbf24 background, #000 text, rounded-full
    - Glow: 0 0 20px rgba(251,191,36,0.12)

**F570–F600 (19.0–20.0s): CTA pulse + fade to finale**
- F570: "Request Access" button pulses — 3× breathe cycle in 20 frames
  - scale: 1.0→1.025→1.0 (8 frames each)
  - glow: rgba(251,191,36,0.12) → rgba(251,191,36,0.45) → rgba(251,191,36,0.12)
- F580: "RoguePoints" text gradient shimmers (gradient position animates 0%→100%)
- F588: entire frame fades to #0a0a0f — overlay opacity 0→1, 10 frames
- F595: centered text fades in on dark field:
  - "roguepoints.app"
  - Font: "Instrument Serif" italic 36px
  - Color: #fbbf24 (solid amber)
  - Fade: opacity 0→1, 8 frames
- F600: hold on final frame

---

## 5. RENDERER INSTRUCTIONS

### Setup

```python
import cairo, math, numpy as np
import gi
gi.require_version('Pango', '1.0')
gi.require_version('PangoCairo', '1.0')
from gi.repository import Pango, PangoCairo
import subprocess, os

CANVAS_W, CANVAS_H = 1280, 720
FPS = 30
TOTAL_FRAMES = 600
FRAMES_DIR = "/tmp/roguepoints_frames"
OUTPUT = "roguepoints_ad.mp4"
os.makedirs(FRAMES_DIR, exist_ok=True)
```

### Core Utilities

```python
def hex_rgba(h, a=1.0):
    h = h.lstrip('#')
    r,g,b = (int(h[i:i+2],16)/255 for i in (0,2,4))
    return (r,g,b,a)

def ease_out_expo(t):
    t = max(0.0, min(1.0, t))
    return 1 - pow(2, -10 * t) if t < 1 else 1.0

def ease_in_out(t):
    t = max(0.0, min(1.0, t))
    return 0.5 * (1 - math.cos(math.pi * t))

def tween(a, b, frame, f0, f1, fn=ease_out_expo):
    t = (frame - f0) / max(f1 - f0, 1)
    return a + (b - a) * fn(max(0.0, min(1.0, t)))

def rounded_rect(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x+r,   y+r,   r, math.pi,     1.5*math.pi)
    ctx.arc(x+w-r, y+r,   r, 1.5*math.pi, 2*math.pi)
    ctx.arc(x+w-r, y+h-r, r, 0,           0.5*math.pi)
    ctx.arc(x+r,   y+h-r, r, 0.5*math.pi, math.pi)
    ctx.close_path()
```

### Vignette (call every frame after map, before UI)

```python
def draw_vignette(ctx, strength=1.0):
    pat = cairo.RadialGradient(640,360, 72, 640,360, 612)
    pat.add_color_stop_rgba(0.00, 0.039,0.039,0.059, 0.00)
    pat.add_color_stop_rgba(0.60, 0.039,0.039,0.059, 0.65*strength)
    pat.add_color_stop_rgba(1.00, 0.039,0.039,0.059, 0.95*strength)
    ctx.set_source(pat)
    ctx.paint()
```

### Grain (call every frame, topmost layer)

```python
def draw_grain(ctx, frame, opacity=0.035):
    rng = np.random.default_rng(frame % 120)  # cycle to save memory
    noise = (rng.random((720,1280)) * 255).astype(np.uint8)
    data = np.stack([noise,noise,noise,
                     np.full_like(noise,int(opacity*255))], axis=-1)
    surf = cairo.ImageSurface.create_for_data(
        data.tobytes(), cairo.FORMAT_ARGB32, 1280, 720)
    ctx.set_source_surface(surf, 0, 0)
    ctx.set_operator(cairo.OPERATOR_OVER)
    ctx.paint()
```

### Glass Panel

```python
def draw_glass_panel(ctx, x, y, w, h, radius=16):
    # Drop shadow
    ctx.set_source_rgba(0,0,0,0.70)
    rounded_rect(ctx, x+4, y+8, w, h, radius)
    ctx.fill()
    # Body: #13131a
    ctx.set_source_rgba(0.075,0.075,0.102, 0.97)
    rounded_rect(ctx, x, y, w, h, radius)
    ctx.fill()
    # Border: rgba(255,255,255,0.08)
    ctx.set_source_rgba(1,1,1,0.08)
    ctx.set_line_width(1)
    rounded_rect(ctx, x, y, w, h, radius)
    ctx.stroke()
```

### Map Pin

```python
def draw_pin(ctx, cx, cy, color_hex, scale=1.0, glow=0.65):
    r,g,b,_ = hex_rgba(color_hex)
    ph = 38*scale
    ox = cx - 15*scale
    oy = cy - ph
    # Glow layers
    for rad,a in [(24,0.08),(16,0.14),(10,0.22)]:
        ctx.set_source_rgba(r,g,b,glow*a)
        ctx.arc(cx, cy-ph*0.40, rad*scale, 0, 2*math.pi)
        ctx.fill()
    # Body
    ctx.save()
    ctx.translate(ox, oy)
    ctx.scale(scale, scale)
    ctx.new_path()
    ctx.move_to(15,1)
    ctx.curve_to(7.268,1, 1,7.268, 1,15)
    ctx.curve_to(1,24, 15,37, 15,37)
    ctx.curve_to(15,37, 29,24, 29,15)
    ctx.curve_to(29,7.268, 22.732,1, 15,1)
    ctx.close_path()
    ctx.set_source_rgba(r,g,b,1.0)
    ctx.fill()
    ctx.set_source_rgba(1,1,1,0.92)
    ctx.arc(15,15,6.5,0,2*math.pi)
    ctx.fill()
    ctx.restore()
```

### Text (use pangocairo)

```python
def draw_text(ctx, text, x, y, family="DM Sans", size=14,
              weight=Pango.Weight.NORMAL, italic=False,
              color=(1,1,1,1), align="left", max_width=None):
    layout = PangoCairo.create_layout(ctx)
    desc = Pango.FontDescription.from_string(
        f"{family} {'Italic ' if italic else ''}{size}")
    desc.set_weight(weight)
    layout.set_font_description(desc)
    if max_width:
        layout.set_width(max_width * Pango.SCALE)
    layout.set_text(text, -1)
    pw, ph = layout.get_pixel_size()
    dx = {"left":0, "center":-pw/2, "right":-pw}[align]
    ctx.set_source_rgba(*color)
    ctx.move_to(x+dx, y)
    PangoCairo.show_layout(ctx, layout)
```

### FFmpeg Export

```python
def export():
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", f"{FRAMES_DIR}/frame_%04d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "16",
        "-preset", "slow",
        "-movflags", "+faststart",
        OUTPUT
    ], check=True)
```

### Per-Frame Render Loop

```python
for frame in range(TOTAL_FRAMES):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, CANVAS_W, CANVAS_H)
    ctx = cairo.Context(surf)

    # 1. Map canvas
    draw_map(ctx, frame)

    # 2. Map pins (y-sorted, lower y = higher z)
    draw_pins(ctx, frame)

    # 3. UI components based on frame range
    draw_ui(ctx, frame)

    # 4. Vignette (always)
    draw_vignette(ctx, strength=tween(1.0, 0.80, frame, 0, 90))

    # 5. Grain (always topmost)
    draw_grain(ctx, frame)

    # 6. Save frame
    surf.write_to_png(f"{FRAMES_DIR}/frame_{frame:04d}.png")

export()
```

---

### Global Rules

1. **Draw order every frame**: map → pins → UI components → vignette → grain
2. **All motion**: ease-out-expo. No linear transitions.
3. **Glow**: simulate with 3 concentric semi-transparent ellipses (radii 10, 16, 24), decreasing alpha.
4. **Background**: always `#0a0a0f`. Never `#000000` or `#ffffff` except pin inner circles.
5. **Font stack**: DM Sans (sans) + Instrument Serif (display/italic). If unavailable: Inter + Georgia.
6. **Pin anchor**: bottom-center of SVG touches the geographic point.
7. **Panel slide-up**: `translateY(h * (1-ease_out_expo(t)))` where t = progress 0→1.
8. **Backdrop blur approximation**: box-blur the composited background surface at radius 8px (normal) or 16px (full-screen modal) before drawing the panel.
9. **Marching ants** (dashed connector line): animate `stroke-dashoffset` by -1 per frame.
10. **Camera drift**: smooth lerp on virtual (pan_x, pan_y) offset — max 3px/frame change.
11. **Reaction count pop**: scale(1.0→1.4→1.0) over 8 frames when count changes.
12. **All glassmorphic elements**: use `#13131a` fill (not black), border `rgba(255,255,255,0.08)`.
13. **Finale frame**: dark `#0a0a0f` field with `"roguepoints.app"` in `#fbbf24` Instrument Serif italic, centered.

---

*All values above are pulled directly from the RoguePoints source files:
`globals.css`, `AppMap.tsx`, `PinDetail.tsx`, `ComposeModal.tsx`,
`LandingMap.tsx`, `InviteModal.tsx`, `SpotCompose.tsx`, `app/map/page.tsx`,
`app/layout.tsx`. The renderer has no codebase access — this document is the
single source of truth.*
