# RoguePoints 20-Second Product Advertisement Animation Renderer Prompt

## Overview
You are rendering a cinematic 20-second product advertisement for RoguePoints, a social story-driven map application. The video should feel immersive and emotionally engaging, showcasing the core user journey: discovering a location on a map, reading community stories attached to it, and being inspired to add your own. The aesthetic is dark, sophisticated, and energetic.

**Technical Specs:**
- Resolution: 1280×720 (16:9)
- Frame rate: 30 fps (600 total frames across 20 seconds)
- Tool: Python + Cairo for rendering + ffmpeg for video encoding
- Theme: Dark mode (primary background #0a0a0f)
- Easing: Use cubic-bezier(0.22, 1, 0.36, 1) for all transitions (smooth, playful, responsive)
- Effects: Vignette, soft glow, grain overlay (subtly), blur transitions

---

## Color Palette (Exact Hex Values from Codebase)

```
--background: #0a0a0f          (Dark navy, almost black)
--foreground: #e8e4de          (Warm off-white, beige)
--amber: #fbbf24               (Golden yellow - PRIMARY accent)
--amber-dim: #b45309           (Darker amber)
--rose: #f472b6                (Pink/rose accent)
--seafoam: #34d399             (Green/teal accent)
--slate-blue: #60a5fa          (Light blue accent)

Category Colors (pin markers):
funny:      #fbbf24 (amber)
mystery:    #a78bfa (purple)
danger:     #f87171 (red)
legend:     #60a5fa (blue)
wholesome: #34d399 (seafoam/green)
other:      #9ca3af (gray)

Glass & Overlay Backgrounds:
glass:      rgba(10, 10, 15, 0.6) with backdrop-filter blur(20px)
glass-light: rgba(255, 255, 255, 0.04) with backdrop-filter blur(12px)
panel-bg:   #13131a (slightly lighter than background)
modal-bg:   rgba(20, 20, 30, 0.92) (for tooltips)
vignette:   radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(10, 10, 15, 0.65) 60%, rgba(10, 10, 15, 0.95) 100%)
```

---

## Typography

### Font Families
```
--font-display: "Instrument Serif" Georgia, serif
               (400 weight, can be italic)
               Used for headings, titles, display text

--font-body: "DM Sans" system-ui, sans-serif
            (300, 400, 500, 600, 700 weights available)
            Used for body text, labels, descriptions
```

### Font Sizes & Weights (Tailwind scale)
```
Hero/Main Heading:       text-4xl (font-display, 700 weight) - #e8e4de
Section Heading:         text-2xl (font-display) - #ffffff
Card Title:              text-sm (font-body, 600 weight)
Body Text:               text-sm (font-body, 400 weight) - #e8e4de
Label/Caption:           text-xs or text-[10px] (uppercase, tracking-widest) - #ffffff/30 to #ffffff/50
Timestamp:               text-[11px] (monospace, #ffffff/25)
Pin Coordinates:         text-[11px] (monospace, #ffffff/20)
```

---

## Component Specifications

### 1. Map Interface (Base Layer)
**Type:** Leaflet map container with dark CartoDB tile layer

```css
.leaflet-container {
  background: #0a0a0f;
  font-family: "DM Sans", system-ui, sans-serif;
}
```

**Specifications:**
- Base tile URL (dark): `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Zoom level: Starts at ~zoom 15, flies to zoom 17 when pin is selected
- Pan animation: `flyTo([lat, lng], zoom, { duration: 1.4, easeLinearity: 0.5 })`
- Viewport hints: Show partial map edges to suggest scrollability

**Leaflet Controls:**
```
Zoom buttons:
  - Background: rgba(10, 10, 15, 0.85)
  - Border: rgba(255, 255, 255, 0.1)
  - Text color: rgba(255, 255, 255, 0.7)
  - Hover: bg rgba(30, 30, 35, 0.95), text #fbbf24
  - Size: 8×8 buttons
```

---

### 2. Pin Markers (Story Markers on Map)

**SVG Pin Icon** (30×38 px, anchor at [15, 38] — bottom center):
```svg
<!-- Teardrop shape with category color fill and drop shadow -->
<svg viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dynamic filter ID based on category color -->
    <filter id="f[HEX_COLOR]" x="-50%" y="-50%" width="200%" height="200%">
      <!-- Drop shadow colored with category color, 65% opacity -->
      <feDropShadow dx="0" dy="2" stdDeviation="3"
                    flood-color="[CATEGORY_COLOR]" flood-opacity="0.65"/>
    </filter>
  </defs>

  <!-- Main teardrop path -->
  <path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 13.5 21.75 14.25 22.31.22.19.53.19.75.19s.53 0 .75-.19C16.5 36.75 30 26.25 30 15 30 6.72 23.28 0 15 0z"
        fill="[CATEGORY_COLOR]"
        filter="url(#f[HEX])"/>

  <!-- White center circle (6.5 radius at 15, 15) -->
  <circle cx="15" cy="15" r="6.5" fill="white" opacity="0.92"/>
</svg>
```

**Reaction Emoji Ring:**
- Position: Absolute, orbiting around pin center (15, 15)
- Radius: 22px from pin center
- Max emojis: 8 (distributed evenly in circular arrangement)
- Emoji size: 12px
- Drop shadow on each emoji: `drop-shadow(0 1px 2px rgba(0,0,0,0.5))`
- Emojis (if reactions exist):
  - 🔥 fire
  - 😂 laugh
  - ❤️ heart
  - 💀 skull
  - 😮 wow

**Placement Formula** (for emoji ring):
```
angle = startAngle + (2π × i) / totalEmojis
x = cx + radius × cos(angle) - 6  // 6 ≈ half emoji width
y = cy + radius × sin(angle) - 6
startAngle = -π/2 (top position)
```

**Animation State:**
- Pin bounce on appear: `animation: pin-bounce 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`
- Pin bounce keyframes:
  ```
  0%   { transform: translateY(-20px); opacity: 0; }
  50%  { transform: translateY(4px); opacity: 1; }
  70%  { transform: translateY(-2px); }
  100% { transform: translateY(0); opacity: 1; }
  ```

**Title Card Tooltip** (appears on hover or randomly 20% of pins):
```html
<!-- Positioned above pin, pointer downward -->
<div style="
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 6px;
  background: rgba(20, 20, 30, 0.92);
  color: #ffffff;
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 11px;
  line-height: 1.3;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.1);
">
  <!-- Arrow pointer (triangle) at bottom, 5px border -->
  <div style="
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(20, 20, 30, 0.92);
  "></div>

  <div style="font-weight: 600;">
    {story_title}
  </div>
  <div style="opacity: 0.6; font-size: 10px; margin-top: 1px;">
    @{author_handle}
  </div>
</div>
```

---

### 3. Pin Detail Panel (Story Details Slide-up Sheet)

**Position:** Fixed bottom-0 on mobile, bottom-6 left-1/2 on desktop (centered)

**Dimensions & Style:**
```css
.pin-detail-panel {
  width: 520px;           /* desktop */
  border-radius: 48px;    /* rounded-3xl */
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #13131a;
  box-shadow: 0 24px 96px rgba(0, 0, 0, 0.7);
  animation: slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
```

**Panel Content Structure:**

```jsx
<div class="pin-detail">
  {/* Drag handle bar (mobile only) */}
  <div style="text-align: center; padding: 14px 0 8px;">
    <div style="
      height: 6px;
      width: 56px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 auto;
    "></div>
  </div>

  {/* Header: Category badge + timestamp + delete button + close button */}
  <div style="padding: 0 24px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
      <div>
        {/* Category badge */}
        <div style="
          display: inline-flex;
          border-radius: 9999px;
          border: 1px solid [CATEGORY_BORDER_COLOR];
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
          color: [CATEGORY_TEXT_COLOR];
          background: transparent;
          margin-bottom: 8px;
        ">
          {category}
        </div>

        {/* Timestamp */}
        <div style="font-size: 11px; color: rgba(255, 255, 255, 0.25);">
          {timeago}
        </div>
      </div>

      {/* Delete button (if author) + Close button */}
      <div style="display: flex; gap: 6px;">
        {/* Delete: red text, 36px × 36px, rounded-full, red hover */}
        {/* Close: white/40 text, 36px × 36px, rounded-full, white hover */}
      </div>
    </div>

    {/* Story title */}
    <h3 style="
      font-family: 'Instrument Serif';
      font-size: 28px;
      color: #ffffff;
      line-height: 1.2;
    ">
      {story_title}
    </h3>
  </div>

  {/* Author row */}
  <div style="
    padding: 0 24px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  ">
    {/* Avatar: 36px × 36px, rounded-full, ring-1 ring-white/10 */}
    {/* If image: object-cover */}
    {/* If placeholder: bg-amber-400/20, flex items-center justify-center,
        text-amber-300, text-sm, font-bold */}

    <span style="font-size: 14px; color: rgba(255, 255, 255, 0.55); flex-grow: 1;">
      @{handle}
    </span>

    {/* Coordinates (monospace) */}
    <span style="
      font-size: 11px;
      color: rgba(255, 255, 255, 0.2);
      font-family: monospace;
      flex-shrink: 0;
    ">
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </span>
  </div>

  {/* Reactions (emoji chips) */}
  <div style="padding: 0 24px; display: flex; gap: 8px; flex-wrap: wrap;">
    {/* For each reaction type (🔥, 😂, ❤️, 💀, 😮): */}
    <button style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 9999px;
      border: 1px solid [COLOR];
      padding: 8px 16px;
      font-size: 16px;
      transition: all 0.15s ease;
      active:scale(0.95);
      cursor-not-allowed if not signed in;

      [if active]:
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.2);
        color: #ffffff;

      [if inactive]:
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.6);
        hover: background rgba(255, 255, 255, 0.1), color rgba(255, 255, 255, 0.9);
    ">
      {emoji}
      {count > 0 && <span style="font-size: 11px; color: rgba(255, 255, 255, 0.4); font-weight: 500;">{count}</span>}
    </button>
  </div>
</div>
```

**Category Badge Colors** (from CATEGORY_STYLES):
```
funny:       border-amber-400/40 text-amber-300
mystery:     border-purple-400/40 text-purple-300
danger:      border-red-400/40 text-red-300
legend:      border-blue-400/40 text-blue-300
wholesome:   border-emerald-400/40 text-emerald-300
other:       border-white/20 text-white/40
```

---

### 4. Spot Markers (Location Markers)

**School Spot SVG** (40×44 px, anchor at [20, 44]):
```svg
<svg viewBox="0 0 40 44" fill="none">
  <defs>
    <filter id="spot-shadow-school" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4"
                    flood-color="#a78bfa" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- Main building rect -->
  <rect x="4" y="6" width="32" height="28" rx="4"
        fill="#7c3aed" filter="url(#spot-shadow-school)"/>
  <rect x="4" y="6" width="32" height="28" rx="4"
        stroke="#a78bfa" stroke-width="1.5" fill="none"/>

  <!-- Windows (left and right) -->
  <rect x="10" y="12" width="6" height="7" rx="1" fill="white" opacity="0.85"/>
  <rect x="24" y="12" width="6" height="7" rx="1" fill="white" opacity="0.85"/>

  <!-- Door (center) -->
  <rect x="16" y="22" width="8" height="12" rx="1" fill="#fbbf24" opacity="0.9"/>

  <!-- Roof (triangle) -->
  <polygon points="2,10 20,0 38,10" fill="#8b5cf6"/>
  <polygon points="2,10 20,0 38,10" stroke="#a78bfa" stroke-width="1" fill="none"/>
</svg>
```

**Park Spot SVG** (40×44 px, anchor at [20, 44]):
```svg
<svg viewBox="0 0 40 44" fill="none">
  <defs>
    <filter id="spot-shadow-park" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="4"
                    flood-color="#4ade80" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Main foliage ellipse -->
  <ellipse cx="20" cy="16" rx="14" ry="13"
           fill="#16a34a" filter="url(#spot-shadow-park)"/>
  <ellipse cx="20" cy="16" rx="14" ry="13"
           stroke="#4ade80" stroke-width="1.5" fill="none"/>

  <!-- Tree clumps (overlay) -->
  <ellipse cx="13" cy="18" rx="8" ry="7" fill="#15803d" opacity="0.7"/>
  <ellipse cx="27" cy="18" rx="8" ry="7" fill="#15803d" opacity="0.7"/>

  <!-- Trunk -->
  <rect x="17" y="28" width="6" height="10" rx="2" fill="#92400e"/>
  <rect x="17" y="28" width="6" height="10" rx="2" stroke="#a16207" stroke-width="1" fill="none"/>
</svg>
```

**Spot Indicator Dot** (shows when spot has stories):
- Position: top-right corner of spot marker
- Size: 11px × 11px circle
- Background: #f87171 (red)
- Border: 2px white
- Box shadow: `0 0 6px rgba(248, 113, 113, 0.7)` (red glow)

---

### 5. Navigation Header (Floating, Desktop)

**Dimensions:**
```css
header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 12px 24px;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Logo Button:**
```jsx
<a style="
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  padding: 8px 16px;
  cursor: pointer;
  hover: background rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
">
  {/* Logo SVG (32×32): pin shape with amber gradient */}
  <svg viewBox="0 0 32 32" style="width: 24px; height: 24px;">
    <defs>
      <linearGradient id="rp-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#f59e0b"/>
      </linearGradient>
    </defs>
    <path d="M16 2c-5.2 0-9.5 4.2-9.5 9.4 0 6.7 8.2 17 9 18 .3.4.7.4 1 0 .8-1 9-11.3 9-18C25.5 6.2 21.2 2 16 2Zm0 13.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
          fill="url(#rp-grad)"/>
  </svg>

  <span style="
    font-family: 'Instrument Serif';
    font-size: 16px;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
  ">RoguePoints</span>
</a>
```

**Map Mode Controls:**
```jsx
<div style="
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  padding: 4px;
">
  <!-- Light/Dark toggle button (8×8) -->
  <!-- Divider (vertical line, height 16px, opacity 0.1) -->
  <!-- Satellite toggle button (8×8) -->
  {/* Satellite button has emerald glow when active:
      background: rgba(16, 185, 129, 0.2);
      text-color: #4ade80;
  */}
</div>
```

**User Avatar:**
```jsx
<div style="
  pointer-events: auto;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  padding: 2px;
">
  {/* Clerk UserButton — 32×32 avatar image, rounded-full,
      Customize colors: primary #fbbf24, bg #13131a */}
</div>
```

---

### 6. Drop Mode Banner (Alert/CTA)

**Position:** Absolute, top-80px, centered horizontally

**Style:**
```css
.drop-mode-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 9999px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  font-size: 14px;
  color: #fbbf24;
}
```

**Content:**
```
[pin-icon] Tap anywhere on the map to drop your story [close-x-button]
```

---

### 7. Main Action Button (FAB — Drop Pin)

**Position:** Fixed, bottom-32px, centered horizontally

**Inactive State:**
```css
.fab-drop-pin {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 9999px;
  background: #fbbf24;
  color: #000000;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 0 32px rgba(251, 191, 36, 0.35);
  cursor: pointer;
  hover: background #f5d76e;
  active: scale(0.95);
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
```

**Active State (when drop mode ON):**
```css
/* Same button, different colors */
background: rgba(251, 191, 36, 0.2);
border: 1px solid rgba(251, 191, 36, 0.5);
color: #fbbf24;
box-shadow: none;
```

---

### 8. Compose Modal (Story Creation Form)

**Position:** Fixed, centered on desktop (modal), bottom-aligned on mobile

**Dimensions & Style:**
```css
.compose-modal {
  width: 100%;
  max-width: 512px;
  border-radius: 16px;  /* rounded-2xl */
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #13131a;
  box-shadow: 0 24px 96px rgba(0, 0, 0, 0.6);
  padding: 24px;
  z-index: 50;
}
```

**Modal Header:**
```jsx
<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
  <div>
    <h2 style="
      font-family: 'Instrument Serif';
      font-size: 20px;
      color: #ffffff;
    ">Drop a Story</h2>
    <p style="
      font-size: 12px;
      color: rgba(255, 255, 255, 0.35);
      margin-top: 4px;
      font-family: monospace;
    ">{lat}, {lng}</p>
  </div>

  {/* Close button: 32×32, rounded-full, bg-white/5, text-white/40 */}
</div>
```

**Category Pills:**
```jsx
<div style="margin-bottom: 16px;">
  <label style="
    font-size: 11px;
    uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 8px;
    display: block;
  ">Vibe</label>

  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    {/* For each category: Funny, Mystery, Danger, Legend, Wholesome, Other */}
    <button style="
      border-radius: 9999px;
      border: 1px solid [VARIES];
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      [if selected]:
        border-color: [CAT_COLOR_50];
        background: [CAT_COLOR_10];
        color: [CAT_COLOR_TEXT];

      [if not selected]:
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.3);
        hover: border rgba(255, 255, 255, 0.2), color rgba(255, 255, 255, 0.5);
    ">
      {category_label}
    </button>
  </div>
</div>
```

**Title Input:**
```jsx
<div style="margin-bottom: 16px;">
  <label style="
    font-size: 11px;
    uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.35);
    margin-bottom: 8px;
    display: block;
  ">
    Title <span style="color: rgba(255, 255, 255, 0.2); font-style: normal; letter-spacing: normal;">(max 60)</span>
  </label>

  <input type="text" style="
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    padding: 10px 16px;
    font-size: 14px;
    placeholder-color: rgba(255, 255, 255, 0.2);
    outline: none;

    focus:
      border-color: rgba(251, 191, 36, 0.4);
      box-shadow: inset 0 0 0 1px rgba(251, 191, 36, 0.2);

    transition: all 0.2s ease;
  " placeholder="The night everything went wrong..." maxlength="60"/>

  <div style="
    text-align: right;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.2);
    margin-top: 4px;
  ">
    {title_length}/60
  </div>
</div>
```

**Action Buttons:**
```jsx
<div style="display: flex; gap: 12px; margin-top: 8px;">
  <button style="
    flex: 1;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: rgba(255, 255, 255, 0.5);
    padding: 10px 16px;
    font-size: 14px;
    cursor: pointer;

    hover: color #ffffff, border-color rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
  ">Cancel</button>

  <button style="
    flex: 1;
    border-radius: 12px;
    background: #fbbf24;
    color: #000000;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    hover: background #f5d76e;
    disabled: opacity 0.4, cursor not-allowed;
    transition: all 0.2s ease;
  ">
    {loading ? "Dropping..." : "Drop it"}
  </button>
</div>
```

---

### 9. Story Card (in SpotView Grid)

**Dimensions & Style:**
```css
.story-card {
  border-radius: 12px;  /* rounded-xl */
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.story-card:hover {
  background: rgba(255, 255, 255, 0.05);
}
```

**Content:**
```jsx
{/* Category badge + timestamp */}
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
  <span style="
    display: inline-flex;
    border-radius: 9999px;
    border: 1px solid [CAT_COLOR_50];
    padding: 2px 8px;
    font-size: 10px;
    color: [CAT_COLOR_TEXT];
    background: [CAT_COLOR_10];
  ">{category}</span>

  <span style="font-size: 10px; color: rgba(255, 255, 255, 0.25);">
    {timeago}
  </span>
</div>

{/* Title */}
<h4 style="
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
">{title}</h4>

{/* Author with avatar */}
<div style="display: flex; align-items: center; gap: 8px; margin-top: 12px;">
  {/* Avatar: 20×20, rounded-full, ring-1 ring-white/10 */}
  {/* If placeholder: bg-amber-400/20, text-amber-300, text-[9px], font-bold */}

  <span style="font-size: 12px; color: rgba(255, 255, 255, 0.4);">
    @{handle}
  </span>
</div>
```

---

## Animation Sequence (20 seconds / 600 frames @ 30fps)

### Phase 1: Intro & Map Reveal (0:00 — 3 sec)

**Frame 0-90:**
- **Background Fade-in:** Canvas starts with vignette overlay, dark background
- **Camera pull:** Start slightly zoomed out, then smoothly pan into a specific location (e.g., San Francisco, 37.77°N, 122.42°W)
- **Map tiles load:** Dark CartoDB tiles fade in, subtle grain overlay appears
- **Title text appears (slide-up):**
  ```
  "Every place has a story"
  Font: Instrument Serif, 64px, italic, centered, #fbbf24 color,
  fade + slide up over 1s
  ```
- **Subtitle fade-in** (1s delay):
  ```
  "RoguePoints: Community stories on a map"
  Font: DM Sans, 18px, #e8e4de, centered, fade in over 0.8s
  ```

---

### Phase 2: Discover a Pin (3 sec — 7 sec)

**Frame 90-210:**
- **Navigation header slides in** (top-left corner): logo + mode toggles + user avatar
  - Fade + slideDown over 0.6s, staggered

- **Pin appears on map** with bounce animation:
  - Location: Civic Center, SF (37.7749°N, 122.4194°W)
  - Category: "legend" (blue color #60a5fa)
  - Title: "The night everything went wrong"
  - Author: damian + @alexmason
  - Reactions: 🔥×3, ❤️×2, 😂×4, 💀×1, 😮×0

  - **Pin bounce animation:** 0.6s cubic-bezier(0.22, 1, 0.36, 1)
  - **Emoji ring orbits in:** All 8 reaction emojis fade in, position in circle

- **Title card tooltip appears** above the pin (random 20% chance logic):
  ```
  "The night everything went wrong"
  "@alexmason"
  (with pointer arrow)
  Fade in + scale from 0.9 over 0.5s, easing cubic-bezier(0.22, 1, 0.36, 1)
  ```

- **Glow effect on pin:** Box-shadow with amber color starts pulsing softly:
  ```
  box-shadow: 0 0 40px rgba(251, 191, 36, 0.15),
              0 0 80px rgba(251, 191, 36, 0.05)
  Animation: 2.5s ease-in-out infinite (pulse-soft)
  ```

---

### Phase 3: Interact & Open Story (7 sec — 12 sec)

**Frame 210-360:**
- **User clicks on pin** (simulate mouse click visual effect at pin location)
  - Ripple effect emanates from pin (subtle circle growing, fading)

- **Map camera flies to pin:**
  - `flyTo([37.7749, 122.4194], zoom=17, duration=1.4s, easeLinearity=0.5)`
  - Pan/zoom smooth motion visible

- **PinDetail panel slides up from bottom:**
  - Animation: `slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)`
  - Panel appears with all content:
    - Drag handle (mobile hint)
    - Category badge (blue legend)
    - Timestamp ("14d ago")
    - Title: "The night everything went wrong"
    - Close button (top-right)
    - Author section: avatar + handle + coordinates
    - Reaction chips (5 emoji buttons)
      - 🔥 3
      - 😂 4
      - ❤️ 2
      - 💀 1
      - 😮 0

- **Panel backdrop darkens:** Subtle black/40 overlay fades in on map

- **Reaction chips animate in:**
  - Stagger each chip: fade + scale from 0.8
  - Delay: 0.1s between each
  - Duration: 0.4s per chip

---

### Phase 4: Engage (Reactions) (12 sec — 15 sec)

**Frame 360-450:**
- **User interacts with reactions** (simulate clicks):
  - First, mouse hovers over 🔥 reaction chip
    - Chip changes state: bg-white/15, text-white
    - Hover animation: subtle scale up

  - Click 🔥, count increments 3→4
    - Reaction chip scales up briefly (1.1×) then back to normal (0.2s)
    - Count text updates instantly
    - Chip background briefly flashes to highlight new reaction

  - Hover over ❤️, count visible (2)
    - Show scale up on hover

  - Click ❤️, count increments 2→3
    - Same scale/flash effect

---

### Phase 5: CTA - Compose Your Own Story (15 sec — 18 sec)

**Frame 450-540:**
- **Panel scrolls/transitions** (or new panel appears):
  - PinDetail fades out or slides down
  - Drop mode banner appears: "Tap anywhere on the map to drop your story"
    - Fade + slide down animation, 0.4s
    - Banner styling: amber border, dark background, amber text, pin icon + close button

- **Main Drop Pin FAB button animates:**
  - Position: bottom center of screen
  - Inactive state: `#fbbf24` background with amber glow
  - Text: "Drop Pin"
  - Plus icon
  - Animation: Fade in + scale from 0.8 over 0.5s
  - Glow shadow: `0 0 32px rgba(251, 191, 36, 0.35)`
  - Hover state: `#f5d76e`

- **Compose modal slides up:**
  - Modal centered on screen
  - Backdrop: black/60 with blur
  - Slide + fade animation, 0.5s
  - Content fades in staggered:
    - Header: "Drop a Story" + coordinates
    - Category pills (Funny, Mystery, Danger, Legend, Wholesome, Other)
      - Pills fade in row-by-row, stagger 0.05s
    - Title input field
    - Action buttons (Cancel, Drop it)

---

### Phase 6: Final CTA & Outro (18 sec — 20 sec)

**Frame 540-600:**
- **Compose modal stays visible**

- **Text overlay appears at bottom:**
  ```
  "Share your moment. Build your map."
  Font: Instrument Serif, 32px, italic, centered, #fbbf24
  Fade in + slide up over 0.8s
  ```

- **Tagline below:**
  ```
  "RoguePoints — Every place has a story"
  Font: DM Sans, 16px, #e8e4de, centered
  Fade in over 0.8s
  ```

- **Logo appears at bottom-center:**
  ```
  Pin icon (amber gradient) + "RoguePoints v0.2"
  Font: Instrument Serif italic, 14px, #fbbf24
  Fade in over 0.6s, slide up
  ```

- **Vignette overlay strengthens:**
  - Radial gradient darkens edges more, pulling focus to center
  - Opacity: 0 → 0.3 over last 2 seconds

- **Background glows fade:**
  - All glow effects (pin shadows, button shadows) fade to 50% opacity
  - Creates sense of transition/ending

---

## Renderer Technical Instructions

### Python + Cairo Setup
```python
import cairo
import subprocess
import os
from pathlib import Path

# Canvas dimensions
WIDTH, HEIGHT = 1280, 720
DURATION = 20  # seconds
FPS = 30
TOTAL_FRAMES = DURATION * FPS  # 600

# Output directory
OUTPUT_DIR = Path("./output")
OUTPUT_DIR.mkdir(exist_ok=True)

# Surface & context for each frame
for frame_num in range(TOTAL_FRAMES):
    timestamp = frame_num / FPS  # current time in seconds
    progress = frame_num / TOTAL_FRAMES  # 0 to 1

    # Create Cairo surface
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, WIDTH, HEIGHT)
    ctx = cairo.Context(surface)

    # Draw frame based on phase
    # ... (see detailed rendering logic below)

    # Save frame as PNG
    surface.write_to_png(f"{OUTPUT_DIR}/frame_{frame_num:06d}.png")
    surface.finish()

# Encode PNG sequence to video with ffmpeg
cmd = [
    "ffmpeg",
    "-y",  # overwrite output
    "-framerate", str(FPS),
    "-i", f"{OUTPUT_DIR}/frame_%06d.png",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "23",
    "rogue_points_ad.mp4"
]
subprocess.run(cmd)
```

### Easing Functions
```python
def cubic_bezier(t, p0=0.22, p1=1, p2=0.36, p3=1):
    """Cubic bezier easing: cubic-bezier(0.22, 1, 0.36, 1)"""
    # Implementation of cubic Bezier interpolation
    mt = 1 - t
    return mt**3 * p0 + 3 * mt**2 * t * p1 + 3 * mt * t**2 * p2 + t**3 * p3

def ease_linear(t):
    return t

def ease_in_out(t):
    return 3 * t**2 - 2 * t**3
```

### Drawing Utilities
- **Rectangles with rounded corners:** Use `ctx.rounded_rectangle(x, y, width, height, radius)`
- **Circles:** Use `ctx.arc(x, y, radius, 0, 2*math.pi)`
- **Text rendering:** Use Pango for text layout, ensure DM Sans and Instrument Serif fonts are available
- **Drop shadows:** Render shadow layer first (dark, blurred), then main element on top
- **Glow effects:** Draw multiple concentric circles/rectangles with decreasing opacity
- **Vignette:** Use `ctx.radial_gradient()` or multiple arcs with alpha blending
- **Grain overlay:** Generate procedural noise texture at low opacity (0.035), tile across canvas

### Map Rendering
- **Tile fetching:** Use CartoDB tile URLs (pre-download and cache tiles for offline rendering)
- **Leaflet simulation:** Draw simplified tile grid, add pin/spot markers on top
- **Coordinates:** 37.7749°N, 122.4194°W (Civic Center, SF) as main pin location

### Image Composition
- Render in strict order:
  1. Background fill (#0a0a0f)
  2. Vignette layer (if visible)
  3. Map tiles
  4. Map markers (pins, spots)
  5. Tooltips/popovers above map
  6. UI elements (header, FAB, panels)
  7. Modals/overlays
  8. Grain overlay (very subtle, final layer)

### Performance Notes
- Pre-compute all text layouts before main loop
- Cache Cairo patterns for repeated elements
- Use frame-skipping for debug (e.g., render every 10th frame, then re-run full)
- Consider rendering in parallel chunks if needed (e.g., ffmpeg can encode during rendering)

---

## Color Reference Quick Table

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | Dark navy | #0a0a0f | Main background |
| Foreground | Warm off-white | #e8e4de | Body text, default text color |
| Primary accent | Amber | #fbbf24 | Buttons, highlights, accents |
| Panel | Slate | #13131a | Modal/panel backgrounds |
| Funny category | Amber | #fbbf24 | Pin color, badges |
| Mystery category | Purple | #a78bfa | Pin color, badges |
| Danger category | Red | #f87171 | Pin color, badges |
| Legend category | Blue | #60a5fa | Pin color, badges |
| Wholesome category | Green | #34d399 | Pin color, badges |
| Other category | Gray | #9ca3af | Pin color, badges |

---

## Deliverables

1. **Video File:** `rogue_points_ad.mp4` (1280×720, 30fps, 20 seconds)
2. **Frame sequence:** PNG files in `output/` directory (for inspection/debugging)
3. **Log file:** `render.log` with timing and error info
4. **Performance metrics:** Frame render times, total encode time

---

## Notes for Renderer Developer

- **Reference colors precisely:** Every hex code above is directly from the live codebase (`globals.css`, JSX files). Do not approximate.
- **Animation timing is critical:** Use the cubic-bezier easing function for all transitions. This specific curve (0.22, 1, 0.36, 1) is used throughout the app and feels snappy & playful.
- **Avoid over-rendering:** Focus on clarity and cinematic feel. Don't cram too much visual noise; let each phase breathe.
- **Typography matters:** The mix of serif (Instrument Serif) for display + sans (DM Sans) for body is key to the app's feel. Ensure both fonts render correctly and are anti-aliased.
- **Interactivity simulation:** Simulate real user interactions (clicks, hovers) with subtle visual feedback (scale, color change, ripples) to make the ad feel alive.
- **Soundtrack pairing:** Consider pairing with an upbeat, cinematic background track (not part of this prompt, but note: ad should feel energetic and inviting, especially in final CTA).

