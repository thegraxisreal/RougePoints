# RoguePoints Project Guidelines

**Version**: 1.1  
**Last Updated**: August 11, 2025

## Project Vision

RoguePoints is a location-based storytelling app that creates a secret layer of community stories overlaid on the real world. Users can discover and contribute local lore, funny incidents, mysteries, and memorable moments tied to specific places.

**Core Concept**: Imagine pulling up a map of your town — but instead of boring street names, every pin is a story. Some are hilarious, some are weird, some are epic. It's like a treasure hunt, time capsule, and inside joke all in one.

## Development Principles

### Architecture Philosophy
- **Mobile-first development** with web compatibility
- **Start simple, scale smart** — rapid prototyping to production-ready
- **Real-time social interactions** as a core feature
- **Geospatial data** as the foundation
- **User-generated content** with multimedia support

### Technical Evolution Strategy

#### Phase 0 (Aug 11 – Sep 5) – Internal Alpha
- **Frontend**: Next.js + TypeScript + Mapbox
- **Backend**: Minimal API routes + WebSockets in same app
- **Database**: SQLite via Prisma
- **Goal**: Internal alpha with map + story pins + auth + manual moderation

#### Phase 1A (Sep 8 – Oct 24) – Public Beta (Glens Falls)
- **Database**: Migrate to Postgres (AWS RDS + PostGIS)
- **Features**: Add video support, categories, filters
- **Real-time**: WebSocket gateway (Go) + Redis Pub/Sub
- **Moderation**: Flag/report content, integrate AWS Rekognition

#### Phase 1B (Oct 27 – Dec 12) – Regional Scale
- **Social**: Comment threads, reactions, trending feed
- **Search**: Keyword + location (Elasticsearch/OpenSearch)
- **Performance**: Redis caching for hot viewport content
- **Infrastructure**: Multi-region Postgres read replicas, Prometheus + Grafana monitoring

## Core Features & Deliverables

### Phase 0 – Internal Alpha (Aug 11 – Sep 5)

**User-Facing Features**
- Interactive map interface
- Location-based story pins (text + photos)
- Basic story categories (funny, mystery, danger, legend, etc.)
- User authentication and profiles (avatar, bio)
- Manual content moderation

**Backend / Infrastructure**
- Monolith: Next.js API routes + WebSockets
- SQLite DB with Prisma ORM
- S3 bucket (or equivalent) for media uploads
- Auth0/Supabase Auth integration
- Basic admin moderation UI

**Acceptance Criteria**
- Auth success >98%
- Pin creation completes <3s
- Map loads pins <1.5s
- Hidden pins removed <2m after admin action

### Phase 1A – Public Beta (Sep 8 – Oct 24)

**User-Facing Features**
- Video story pins
- Category filters
- Real-time pin updates (<2s latency)
- Infinite scroll + map clustering
- Report content flow (auto-hide ≥3 reports)

**Backend / Infrastructure**
- Postgres (AWS RDS) + PostGIS
- CloudFront CDN for media delivery
- WebSocket gateway (Go) + Redis Pub/Sub
- AWS Rekognition for automated moderation
- Trending view queries via PostGIS

**Acceptance Criteria**
- Video upload/play success >95%
- Clustered map FPS ≥45
- Reported pins hidden <60s after threshold

### Phase 1B – Regional Scale (Oct 27 – Dec 12)

**User-Facing Features**
- Comment threads
- Reactions/likes
- Search by keyword + location
- Trending feed by area
- Faster map loading for larger geos

**Backend / Infrastructure**
- Split into Go microservices (Content, User, Moderation) behind API Gateway
- Redis caching for hot content
- Elasticsearch/OpenSearch for geo + text search
- Multi-region Postgres read replicas
- Prometheus + Grafana dashboards & alerts

**Acceptance Criteria**
- Comment latency <500ms
- Reactions visible <2s
- Search results <1s for 90% queries
- Trending updates every 60s

## User Experience Priorities

1. **Discovery-first** — Make exploration addictive
2. **Contribution flows** — Seamless story creation
3. **Social engagement** — Build community around places
4. **Mobile optimization** — Touch-first interactions
5. **Performance** — Fast loading, smooth scrolling

## Technical Standards

### Code Quality
- **TypeScript everywhere** — strict typing
- **Component-driven development** — reusable, testable components
- **API-first design** — clean contracts between frontend/backend (OpenAPI → typed client)
- **Real-time architecture** — WebSocket integration from day one
- **Mobile performance** — optimize for device constraints

### Data Architecture
- **Geospatial-centric** — location as primary index
- **Social graph support** — users, stories, reactions, comments
- **Media handling** — efficient storage and delivery (photos in Phase 0, video in Phase 1A)
- **Content moderation** — manual review in Phase 0, AWS Rekognition in Phase 1A, community tools in Phase 1B
- **Scalable schemas** — plan for growth

## Dependencies & Decision Points

- **Map provider** (locked: Mapbox) — revisit only if cost spikes
- **Media pipeline** — S3 from Phase 0; CloudFront in 1A
- **DB migration** — SQLite → Postgres in 1A (verify migration plan with PPE)
- **Real-time infra** — Redis/WebSocket gateway must be ready before FE starts 1A real-time UI
- **Moderation rules** — report threshold set at 3 for auto-hide; review weekly during beta

## Team Structure & Ownership

We use specialized "expert personas" to guide different aspects of development:
- **Project Manager**: Roadmaps, timelines, coordination, sprint planning, risk management
- **Architect**: System design, technical decisions, scalability guardrails
- **Principal Platform Engineer**: Infrastructure, scalability, DevOps, CI/CD, DB migrations
- **Senior Frontend Architect**: UI/UX implementation, mobile optimization, FE performance
- **Senior Backend Architect**: API design, data modeling, services, moderation pipeline
- **UX/Product Designer**: User experience, interaction design, mobile-first design system

### Decision Making
- **Architecture decisions** must align with our phase evolution strategy
- **User experience decisions** should prioritize mobile-first interactions
- **Technical debt** is acceptable in Phase 0, must be addressed in Phase 1
- **Performance** is non-negotiable — especially on mobile devices

## Success Metrics

### User Engagement
- **Discovery rate**: Stories viewed per session
- **Contribution rate**: Stories created per user
- **Return engagement**: Daily/weekly active users
- **Social interaction**: Reactions and comments per story

### Technical Performance
- **Load times**: < 1 second initial load
- **Real-time latency**: < 500ms perceived latency for social interactions
- **Uptime**: 99.9% availability target
- **Scalability**: Support 10x user growth without architecture changes

### Metrics & Reporting
- **Ownership**: Product Manager + UX Designer track engagement metrics
- **Instrumentation**: Analytics implementation required from Phase 0
- **Reporting Cadence**: Weekly during alpha/beta, monthly post-launch
- **Key Dashboards**: User engagement, technical performance, content quality

## Scope & Constraints

### Current Scope
- **Geographic**: Local market focus initially (Glens Falls for public beta)
- **Platform**: Mobile-first (iOS/Android), web-compatible
- **Development Environment**: Mac-based development workflow
- **Community**: User-generated content with social features

### Technical Constraints
- **Real-time requirements**: Stories, reactions, comments must feel instant
- **Content safety**: Moderation pipeline required
- **Performance**: Sub-second load times on mobile
- **Scalability**: Architecture must handle viral growth patterns
- **Data privacy**: Location data requires careful handling

## Getting Started

### For New Developers
1. **Read this document entirely** — understand the vision and constraints
2. **Review the technical evolution plan** — know where we're going
3. **Study the user experience priorities** — mobile-first always
4. **Follow the established patterns** — consistency over cleverness
5. **Ask questions early** — better to clarify than assume

### Key Resources
- **Design System**: [To be added]
- **API Documentation**: [To be added]
- **Development Setup**: [To be added]
- **Testing Guidelines**: [To be added]

## Review Cadence

- **Phase start/end** — review/update document
- **Major decision** — append to "Decision Log" section
- **Weekly during development** — validate against acceptance criteria

## Decision Log

*[To be populated with major architectural and product decisions as they occur]*

---

*This document serves as the foundational reference for RoguePoints development. All architectural decisions, feature additions, and technical changes should align with these guidelines. Updates to this document require team consensus.*