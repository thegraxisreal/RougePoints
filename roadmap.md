roadmap.md
RoguePoints – Q1 Roadmap

(Aug 11 – Dec 12)
Quarter Goal

Launch MVP in Glens Falls, NY with the ability to create, browse, interact with, and moderate “story pins,” plus a backend and platform foundation ready to expand to more cities.
Phase 0 – MVP Buildout & Internal Alpha

Dates: Aug 11 – Sep 5
Goal: Internal-only build to validate core posting and browsing flows.

User-Facing Features

    Create/view story pins (text + image)

    Browse pins on local map

    User authentication (email/social)

    Basic profile (avatar, bio)

    Manual moderation via admin dashboard

Enabling Tech

    Frontend: Next.js + Mapbox UI

    Backend: Single monolith (Next.js API routes), SQLite + Prisma

    Infra: Vercel (frontend), Railway/Render (backend)

    Storage: S3 (or equivalent)

    Auth: Auth0/Supabase Auth

    Moderation: Manual review dashboard

Acceptance Criteria

    Auth success rate >98%

    Pin creation <3s (with image)

    Map loads pins <1.5s on mid-tier mobile

    Admin hides content in <2m of report

Phase 1A – Public Beta (Local)

Dates: Sep 8 – Oct 24
Goal: Public beta launch in Glens Falls with richer content and real-time updates.

User-Facing Features

    Video support for story pins

    Category tags & filters

    Real-time pin updates (WebSocket/SSE)

    Infinite scroll + map clustering

    Flag/report inappropriate content

Enabling Tech

    DB Migration: SQLite → Postgres (AWS RDS)

    Media: S3 + CloudFront

    Real-Time: WebSocket gateway (Go) + Redis Pub/Sub

    Search/Geo: PostGIS queries

    Moderation Pipeline: AWS Rekognition

Acceptance Criteria

    Video success >95%

    Real-time updates <2s latency

    Clustered map ≥45 FPS

    Reported pins hidden in <60s at threshold

Phase 1B – Feature Expansion & Regional Scale

Dates: Oct 27 – Dec 12
Goal: Increase engagement and prepare for multi-region growth.

User-Facing Features

    Comment threads

    Reactions/likes

    Search by keyword + location

    Trending stories by area

    Faster map loading over larger areas

Enabling Tech

    Service Split: Go microservices behind API Gateway

    Caching: Redis for hot content

    Search: Elasticsearch/OpenSearch

    Multi-Region Reads: Postgres read replicas

    Monitoring: Prometheus + Grafana

Acceptance Criteria

    Comment latency <500ms

    Reactions visible in <2s

    Search <1s for 90% of queries

    Trending feed refreshes every 60s

End of Quarter Outcome

    Live in Glens Falls

    Full posting, browsing, reacting, commenting, reporting flows

    Real-time updates & push notifications

    Moderation in place (manual + Rekognition assist)

    Architecture ready to onboard 2–3 more cities
