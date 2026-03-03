CONTRIBUTING.md
Principles

    Bias for shipping: small PRs, continuous integration, frequent releases.

    Security + privacy first: least privilege, no secrets in code, PII minimization.

    Observability baked in: logs, metrics, traces included with features.

    Documentation adjacent: update docs (this repo) as part of the change.

Code Standards

Languages/Stacks

    Frontend: Next.js (TypeScript), Mapbox GL, React Query.

    Backend (Phase 0): Next.js API routes (TypeScript).

    Backend (1B+): Go microservices (Content, User, Moderation) behind API Gateway.

    DB: SQLite (Phase 0) → Postgres 16 + PostGIS (1A+).

    Cache: Redis.

    Search: OpenSearch/Elasticsearch.

    Infra: AWS (RDS, S3, CloudFront), Vercel/Render for early hosting.

Style & Linting

    TypeScript/React: ESLint (eslint:recommended, @typescript-eslint/recommended), Prettier. Strict TS.

    Go: gofmt, go vet, golangci-lint (staticcheck, errcheck, revive).

    SQL: migrations via prisma migrate (Phase 0) then golang-migrate/dbmate (1A+). Prefer idempotent, reversible migrations.

    APIs: JSON over HTTPS; cursor-based pagination; idempotency keys for mutating endpoints; consistent error envelopes.

Testing

    Unit: ≥70% critical-path coverage (services, hooks, handlers).

    Integration: API contract tests, DB tests on ephemeral DB.

    E2E (smoke): happy-path create→browse→interact; runs on PR.

    Load (weekly): near‑me query + upload pipeline sanity.

Security

    Environment secrets via platform vaults (Vercel/Render/AWS SSM).

    No tokens/keys in repo. Pre‑commit secret scan (gitleaks/trufflehog).

    Input validation at edge (BFF) and service level. Rate limits in BFF.

    Media validation: content type/size limits; server-side transcode.

Git Workflow

    Trunk‑based development.

        Protected main (required reviews + green CI).

        Branch naming: feat/<scope>, fix/<scope>, chore/<scope>, docs/<scope>.

        Conventional Commits (feat:, fix:, refactor:, …). Auto‑release notes.

    PRs

        Keep ≤400 LOC diff where feasible; single responsibility.

        Include: tests, docs updates, migration notes, screenshots (if UI).

        Checklist:

Lints/tests pass locally

Metrics/logs added or updated

Security review items considered (authZ, input validation)

            Backward compatible API change (or migration plan documented)

    Merges & Releases

        Squash merge with conventional title.

        Tags: vX.Y.Z on main by CI after passing smoke deploy.

        Hotfix flow: branch from main → PR → tag vX.Y.(Z+1).

PR Review Process

    Review SLA: first response < 24h on business days.

    Two sets of eyes for risky changes (auth, payments, moderation, migrations).

    What to look for

        Correctness & tests, performance on hot paths, failure handling.

        API stability (versioning if breaking), data migrations safety.

        Observability hooks (logs with correlation IDs, metrics).

    When to request changes

        Missing tests, unclear ownership, security holes, unbounded queries.

Branch & Env Model

    Envs: dev (preview), staging (pre‑prod), prod.

    Previews: every PR deploys to ephemeral URL. Include test creds in PR.

    Data: synthetic in dev; masked in staging; real in prod only.

Cross‑Team Collaboration

    Issue Templates: Feature, Bug, Tech Debt, RFC (short form).

    Design→Build Hand‑off: ticket must include user story, UX spec, API contract (or placeholder), acceptance criteria, tracking events.

    RFCs (≤2 pages): required for schema changes, new services, or breaking APIs. 48‑hour comment window.

    Weekly Rituals: Mon standup (cross‑team), Thu demo, Fri retro (10 min).

    Decision Log: /docs/DECISIONS.md append‑only bullets with date, rationale, owner.

Local Setup (quick)

    Node LTS, Go 1.22+, Docker.

    pnpm i && pnpm dev (web).

    cp .env.example .env.local and fill placeholders.

    Makefile targets: make lint test e2e build.
