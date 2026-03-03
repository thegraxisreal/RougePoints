# Phase 0 – MVP Buildout & Internal Alpha (Backend)

## 1) Project Setup

- [ ] **Repo layout**: apps/web, apps/api (Next.js), packages/shared (types, utils), infrastructure/ (IaC later).
- [ ] **Runtime**: Node 20 LTS; TypeScript strict; ts-paths for shared models.
- [ ] **Env management**: `.env.local`, `.env.staging`, `.env.production`; validate with zod on boot.
  - [ ] Required vars: `DATABASE_URL`, `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_JWKS_URI`, `S3_BUCKET`, `S3_REGION`, `S3_UPLOAD_ROLE_ARN` (or keys), `ASSET_BASE_URL`.
- [ ] **API envelope**: Next.js API routes under `/api`; common middleware for logging, CORS, JWT verify, error translation.
- [ ] **OpenAPI**: `openapi.yaml` checked in; generate TS client for FE and types for BE handlers.
- [ ] **Tooling**: ESLint (airbnb+node), Prettier, Husky + lint‑staged.
- [ ] **CI (minimum)**: PR: typecheck, lint, unit tests, Prisma migrate validate.

## 2) Data Models (SQLite + Prisma; PG‑ready)

- [ ] **IDs**: ULID as string (sortable feeds), not auto‑inc.
- [ ] **Timestamps**: `created_at`, `updated_at`, `deleted_at?`, `visible_at` (future publish).
- [ ] **Users**:
  - [ ] `id`, `handle`, `email` (unique), `name?`, `avatar_url?`, `bio?`, `created_at`, `is_shadow_banned` boolean default false.
  - [ ] Indexes: `(email)`, `(handle)`, `(is_shadow_banned)`.
- [ ] **Pins (aka Story; name can change later, API stays)**:
  - [ ] `id`, `user_id`, `title(<=120)`, `body(<=5000)`, `lat`, `lng`, `status` enum('active','hidden','removed','shadow') default 'active', `visible_at`, counters: `media_count`, `reaction_count`, `comment_count`.
  - [ ] Indexes: `(lat,lng)`, `(status,visible_at)`.
  - [ ] SQLite R*Tree side table: `pin_rtree(pin_id, min_lat, max_lat, min_lng, max_lng)` for bbox queries.
- [ ] **Media**:
  - [ ] `id`, `pin_id`, `kind` enum('image','video','audio'), `s3_key`, `content_type`, `width?`, `height?`, `duration_s?`, `state` enum('pending','processing','ready','failed') default 'pending', `created_at`.
  - [ ] Indexes: `(pin_id)`, `(state)`.
- [ ] **Reports**:
  - [ ] `id`, `pin_id`, `reporter_user_id`, `reason` (short text), `created_at`, `state` enum('open','review','actioned','dismissed') default 'open'.
  - [ ] Indexes: `(pin_id,state)`.
- [ ] **Reactions** (1B‑ready but can land now):
  - [ ] PK `(user_id, pin_id, kind)`, `created_at`. Index `(pin_id, kind)`.
- [ ] **PG upgrade notes** (future): add `geom GEOGRAPHY(POINT,4326)` + GIST; drop R*Tree; keep same API.

## 3) Authentication & Authorization

- [ ] **JWT middleware**: Verify RS256 via JWKS; enforce `aud`, `iss`; map `sub`→User row (upsert on first request).
- [ ] **Current user endpoint**: `GET /api/me` returns `{id, handle, name, avatar_url}`.
- [ ] **Role gates**: Admin determined via `app_metadata.roles` (admin) or allowlist; set `req.auth.roles`.
- [ ] **Device/Safety headers**: Require `x-device-id` for write ops; log for abuse heuristics.

## 4) Pin APIs (stable contracts)

- [ ] **GET** `/api/pins` (viewport listing):
  - [ ] Query: `bbox=minLng,minLat,maxLng,maxLat`, `zoom?`, `after?` (cursor), `limit<=100`.
  - [ ] SQLite: R*Tree intersect; order `(visible_at DESC, id DESC)`; paginate by cursor `(base64(visible_at|id))`.
  - [ ] Response: `{ items: PinSummary[], next?: string }` (no media URLs here; keep payload light).
- [ ] **GET** `/api/pins/:id`:
  - [ ] Returns `PinDetail` with author, media (signed URLs only for `state=ready`), viewer flags.
- [ ] **POST** `/api/pins` (auth):
  - [ ] Body: `{ title, body, lat, lng, mediaPlaceholders?[] }`.
  - [ ] Validations: title/body length, lat/lng bounds, on‑site guard (optional): if provided `device_lat/lng`, reject if >X km away (feature flag).
  - [ ] Returns: `{ pin, mediaInit? }` (presigned upload URLs for each placeholder).
- [ ] **PATCH** `/api/pins/:id`:
  - [ ] Author or admin; fields: `{ title?, body?, status? }`. Status change triggers visibility rules.
- [ ] **DELETE** `/api/pins/:id`:
  - [ ] Soft delete (`deleted_at`, `status='removed'`).
- [ ] **Admin hide/unhide**:
  - [ ] `PATCH /api/pins/:id/status { status: 'hidden'|'active'|'removed'|'shadow' }`. Admin‑only.

## 5) File Uploads (S3 presign)

- [ ] **POST** `/api/media:init` (or piggyback on pin create):
  - [ ] Body: `{ pin_id, assets: [{ kind, contentType }] }`.
  - [ ] Server allocates `media.id`, returns presigned PUT URLs + required headers; persist `state='pending'`.
  - [ ] Constraints: enforce `max_assets_per_pin` (env), allowed mime types, max size (signed policy).
- [ ] **POST** `/api/media/:id/complete`:
  - [ ] Marks object present (optional HEAD check), queues lightweight processing (Phase 0 = image orient/EXIF strip if you have a lambda; else mark ready).
- [ ] **GET media URLs**:
  - [ ] Story detail returns short‑lived signed GET URLs; no public bucket listing.

## 6) Moderation (manual first)

- [ ] **POST** `/api/reports` (auth):
  - [ ] `{ pin_id, reason }`; dedupe per `(reporter_user_id, pin_id)` within 24h; create or bump count.
- [ ] **GET** `/api/admin/mod/queue` (admin):
  - [ ] Filters: `state=open|review|actioned|dismissed`, `after?`.
- [ ] **POST** `/api/admin/mod/decision` (admin):
  - [ ] `{ targetType:'pin', targetId, action:'hide'|'remove'|'shadow'|'dismiss', notes? }`; audit log row.
  - [ ] Visibility rules: `shadow` => visible to author only; `removed` => hidden for all.

## 7) Query & Indexing Details

- [ ] **R*Tree maintenance** (SQLite): on pin create/update, insert `(pin_id, lat, lat, lng, lng)`. For later polygons, expand bbox if needed.
- [ ] **Hot‑area caps**: Max N pins per tile (zoom 14–16) per page; server‑side sampling when density exceeds cap (flag).
- [ ] **Distance sort** (optional): if center provided, compute haversine distance in SQL and return `distanceM` in summaries (bounded by bbox).

## 8) Pagination, Errors, Versioning

- [ ] **Cursor pagination** everywhere (`after` as base64).
- [ ] **Error model**: `{ code:string, message:string, details?:any }`; map Zod/Prisma errors → 400; auth → 401/403; not found → 404; conflict → 409; rate limit → 429.
- [ ] **API versioning**: prefix with `/api` only in Phase 0; add `x-api-version: 0.1` response header; freeze shapes.

## 9) Rate Limits & Abuse Guards

- [ ] **Global**: 60 req/min/user; 120/min/IP (fallback).
- [ ] **Writes**: 10 pin creates/day/user; 1/min per z16 tile; burst 3; configurable.
- [ ] **Reports**: 5/day/user.
- [ ] **Enforcement**: token bucket in Redis (or in‑proc memory for Phase 0), return 429 with `Retry-After`.

## 10) Observability & Ops (minimum viable)

- [ ] **Structured logs**: JSON (pino) with `req_id`, `user_id`, `device_id`, `latency`, `route`, `status`.
- [ ] **Metrics** (optional Phase 0): basic counters via Prom client: requests by route/status, DB query durations.
- [ ] **Tracing** (later): OTEL hooks; keep route/middleware boundaries ready.
- [ ] **Audit log**: moderation actions, status changes.

## 11) Testing & Data

- [ ] **Unit tests**: validators, auth middleware, bbox query, pagination, presign module.
- [ ] **Integration tests**: happy‑path create pin + upload + fetch; hide/remove flows.
- [ ] **Seed script**: 20 users, 200 pins around Glens Falls with plausible lat/lng; fixture media keys.
- [ ] **Load sanity**: list‑bbox at z15 returns <200ms p95 locally on 10k pins (seeded).

## 12) Deployment & Config

- [ ] **Vercel for FE**; Railway/Render for API + SQLite volume (Phase 0).
- [ ] **S3 bucket** with lifecycle (temp uploads → 30d, media → 180d/archive), CORS allow PUT from FE origin.
- [ ] **Auth0/Supabase** configured with API audience; rotate secrets documented.
- [ ] **CORS policy**: allow FE domains; preflight for PUT to S3 presigns (expose headers).
- [ ] **CDN** (CloudFront later): signed GETs pass through; no public listing.

## 13) Migration Readiness (PG/PostGIS path)

- [ ] **Abstraction**: repository interface for geo queries (`ListPinsByBBox`, `GetPin`, `CreatePinWithMediaInit`).
- [ ] **Schema parity**: keep columns compatible; don't rely on SQLite quirks (e.g., implicit bool).
- [ ] **Outbox placeholder** (1A): table scaffold for future CDC; not used in Phase 0.
- [ ] **PostGIS plan**: add `geom`, backfill from `lat/lng`, create GIST, replace R*Tree usage behind repo flag.

## BE Dependencies (provisioning checklist)

- [ ] **S3 bucket + IAM role/key** with least privilege (PUT object with conditions on content-type, size, prefix `uploads/{pinId}/`).
- [ ] **Auth (Auth0 or Supabase)**: API audience, JWKS URL, roles claim (`app_metadata.roles` or custom namespace).
- [ ] **Redis** (optional Phase 0): rate limits; if absent, enable in‑memory limiter with conservative defaults.
- [ ] **Mapbox**: not required for BE; FE‑only.
- [ ] **PPE (pre‑prod env)**: separate bucket, auth tenant, and DB URL; no cross‑env keys.

## Acceptance Criteria (what "done" means for Phase 0)

- [ ] FE can browse pins by map viewport with stable pagination and reasonable density caps.
- [ ] Authenticated users can create pins (with optional images), and see them immediately.
- [ ] Presigned uploads work end‑to‑end; completed media appear in pin detail (`state='ready'`).
- [ ] Admin can hide/remove/shadow pins; users can report; queue is viewable via API.
- [ ] API is documented (OpenAPI), types are generated for FE, and contracts are frozen for Phase 0.
- [ ] Basic rate limits and logging are active; 95th percentile latency for `/api/pins?bbox=…` under seed load is acceptable (<300ms locally).

---

## Progress Tracking

**Overall Progress**: [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] (0/13 major sections)

**Core Infrastructure**: [ ] [ ] [ ] [ ] (0/4 items)
**Data & APIs**: [ ] [ ] [ ] [ ] [ ] (0/5 items)  
**Security & Moderation**: [ ] [ ] [ ] (0/3 items)
**Deployment & Testing**: [ ] [ ] [ ] (0/3 items)

**Last Updated**: [Date]
**Next Priority**: [Item]
**Current Sprint Focus**: [Section]


