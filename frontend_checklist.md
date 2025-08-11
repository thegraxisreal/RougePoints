# RoguePoints — Phase 0 Frontend Plan (Setup & Scaffolding)

## 0) Decisions (quick)

- [ ] **Auth provider**: start with Supabase Auth (email + Google/Apple) for speed; keep an auth adapter so Auth0 swap is trivial later.
- [ ] **Map**: Mapbox GL JS with client‑side clustering (supercluster) in a Web Worker for MVP.
- [ ] **State**: React Query (server cache) + Zustand (UI/viewport + compose state).
- [ ] **Styling**: Tailwind CSS + Radix primitives (accessibility), headless patterns.
- [ ] **Video (future)**: plan for HLS; Phase 0 images only.

## 1) Project Bootstrap

**Goal**: clean Next.js baseline with guardrails, envs, and CI from day one.

- [ ] Create repo roguepoints with apps/web (room for native later).
- [ ] Scaffold: `npx create-next-app@latest --typescript --eslint --src-dir --app --import-alias "@/*" roguepoints`
- [ ] Install core deps:
  - [ ] **UI/dev**: tailwindcss postcss autoprefixer @radix-ui/react-dialog @radix-ui/react-popover
  - [ ] **Data/state**: @tanstack/react-query zustand
  - [ ] **Map**: mapbox-gl supercluster
  - [ ] **Utils**: zod ky
- [ ] Configure Tailwind (mobile-first, reduced motion, safe-area).
- [ ] Lint/format: ESLint + Prettier + eslint-config-next rules tightened for perf (no large sync loops, image alt, link passHref).
- [ ] Pre-commit: lint-staged + husky (run typecheck, eslint, prettier).
- [ ] CI: GitHub Action (PRs run typecheck + lint + build). Vercel preview per PR.
- [ ] Scripts:
  - [ ] "dev", "build", "start", "typecheck", "lint", "format", "test:e2e" (Playwright later)
  - [ ] Error & logging: minimal boundary + console.error wrapped util; upgrade later.

**Deliverables**: running app, CI green on first PR, Vercel preview.

## 2) Environment & Config

**Goal**: predictable envs across dev/stage/prod.

- [ ] `.env.local.example` with:
  - [ ] `NEXT_PUBLIC_APP_ENV=development`
  - [ ] `NEXT_PUBLIC_MAPBOX_TOKEN=...`
  - [ ] `NEXT_PUBLIC_API_BASE=https://api.dev.roguepoints.app`
  - [ ] `NEXT_PUBLIC_FEATURE_FLAGS={}` (JSON string, override server flags if needed)
  - [ ] If Supabase Auth:
    - [ ] `NEXT_PUBLIC_SUPABASE_URL=...`
    - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- [ ] Runtime config layer:
  - [ ] `lib/config.ts` reads public envs, validates via Zod.
  - [ ] Feature flags via `/api/meta/flags` (server) with client override for local.
  - [ ] Next config:
    - [ ] `images.remotePatterns` allow S3/CloudFront domains.
    - [ ] Headers: Permissions-Policy for camera/geolocation prompts.

## 3) Auth Skeleton (adapter-ready)

**Goal**: sign-in/out flows wired; session available in hooks.

- [ ] Add Supabase client + SSR helpers (cookies).
- [ ] `useSession()` hook (thin wrapper) exposes `{user, status}`.
- [ ] Routes:
  - [ ] `/login` (email + Google/Apple), `/logout`
- [ ] Gate protected actions (pin create) with a `RequireAuth` guard.
- [ ] Session persistence verified after reload.

**Deliverables**: user can log in/out; session visible in header/debug panel.

## 4) Map & Browse Scaffold

**Goal**: interactive map + list sheet, no data yet → then sample data.

- [ ] **MapCanvas (client)**:
  - [ ] Map init (Mapbox style), current location indicator via Geolocation API.
  - [ ] `useViewport()` (Zustand) stores bbox/zoom and selection.
- [ ] **PinLayer**:
  - [ ] GeoJSON source + symbol layer.
  - [ ] Client‑side clustering with supercluster in a Web Worker.
  - [ ] Accessible marker hit areas (≥44px).
- [ ] Bottom sheet list (mobile-first) synced to viewport.
- [ ] **Data hook**:
  - [ ] `usePinsInView(bbox, zoom)` (React Query) hitting `/api/pins` (mock for now).
  - [ ] Pin detail:
    - [ ] `/story/[id]` page (SSR skeleton) + modal pattern from map tap.

**Deliverables**: map loads, user sees mocked pins, can tap to open a detail shell.

## 5) Pin Creation Flow (images only)

**Goal**: working end‑to‑end draft → upload → publish.

- [ ] FAB "Drop a story" opens `ComposeFlow` (bottom sheet).
- [ ] **Form**: title (max 80), body (max 500), location (readonly from map), image (camera/gallery).
- [ ] **Upload**:
  - [ ] Call `/api/uploads/presign` → direct POST to S3 → `/api/uploads/commit`.
  - [ ] Show thumbnail and progress; retry on failure.
- [ ] Submit `/api/pins` → optimistic add to map/list on success.
- [ ] Success toast + auto-focus new pin.

**Deliverables**: authenticated user can create a pin with image that appears on map.

## 6) Profile (simple)

**Goal**: minimal identity surface.

- [ ] `/me` shows avatar (from auth), email, list of my pins (paginated).
- [ ] Edit bio (optional; Phase 0 if trivial, otherwise cut).

**Deliverables**: profile page reads session and lists user pins.

## 7) Moderation (manual)

**Goal**: admin can hide/unhide pins.

- [ ] `/moderate` (role-gated) table: id, createdAt, coords (link to map), status, reports.
- [ ] **Actions**: Hide / Unhide (POST to `/api/moderate/pins/:id`).
- [ ] Filter: status, date.

**Deliverables**: admins can change visibility; changes reflected on map.

## 8) API Contracts (frontend-facing, Phase 0)

(FE can mock these immediately; BE fills in.)

- [ ] **GET** `/pins?bbox=...&zoom=...&since?=ISO&limit?=500`
  - [ ] Res: `{ pins: PinSummary[], nextSince?: string }`
- [ ] **GET** `/pins/:id`
  - [ ] Res: `{ pin: Pin }`
- [ ] **POST** `/pins`
  - [ ] Req: `{ title, text?, coords:{lat,lng}, mediaIds?:string[] }`
  - [ ] Res: `{ pin: Pin }`
- [ ] **POST** `/uploads/presign`
  - [ ] Req: `{ kind:'image', mime, size }`
  - [ ] Res: `{ fields|uploadUrl, asset:{ id, url, thumbUrl? } }`
- [ ] **POST** `/uploads/commit`
  - [ ] Req: `{ id }`
- [ ] **POST** `/moderate/pins/:id { action:'hide'|'unhide' }`

**Types**: share a `types/` package now; generate from Go later.

## 9) Quality Gates (from day one)

- [ ] **Performance budgets**: initial JS ≤ 170KB gz; First interaction ≤ 2.5s on 4G mid‑Android.
- [ ] **Accessibility**: keyboard focus on markers/list, color contrast pass, reduced motion mode.
- [ ] **Analytics** (optional later): page views, create flow funnel.
- [ ] PR template: checklist (typecheck, bundle size diff, screenshots).

## 10) Milestones (2–3 sprints)

### Sprint 1
- [ ] Repo + CI + envs + Tailwind
- [ ] Auth scaffold
- [ ] Map boot + viewport store + mock pins

### Sprint 2
- [ ] Real `/pins` integration
- [ ] Pin detail SSR shell
- [ ] Compose (image) with presigned upload

### Sprint 3
- [ ] Profile (my pins)
- [ ] Moderation screen
- [ ] Polish: clustering worker, toasts, skeletons, empty states

## Hand‑off Artifacts to Create Now

- [ ] `docs/frontend-architecture.md` (this plan + decisions)
- [ ] `docs/api-contracts/pins.md` (requests/responses, error shapes)
- [ ] `.env.local.example`
- [ ] PR checklist template

---

## Progress Tracking

**Overall Progress**: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] (0/10 major sections)

**Sprint 1 Progress**: [ ] [ ] [ ] (0/3 items)
**Sprint 2 Progress**: [ ] [ ] [ ] (0/3 items)  
**Sprint 3 Progress**: [ ] [ ] [ ] (0/3 items)

**Last Updated**: [Date]
**Next Priority**: [Item]
