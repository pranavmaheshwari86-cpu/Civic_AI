# TODO

**Last updated:** 2026-07-07

## Priority 0 — Pre-Engineering (Start Immediately)

- [x] Start DLT SMS template registration with MSG91 (1-2 week lead time, blocks OTP auth go-live)
- [x] Resolve launch state/city for knowledge base pilot (Q1)
- [x] Confirm budget and timeline (Q3)
- [x] Legal review: DPDP Act compliance requirements (Q7)
- [x] Confirm data residency: Atlas Mumbai sufficient or government cloud required? (Q9)

## Priority 1 — Project Setup

- [x] Initialize monorepo: `apps/web`, `apps/api`, `apps/worker`, `packages/shared-types`
- [x] Configure npm workspaces with single root `package-lock.json`
- [x] Set up Next.js 14 (App Router, TypeScript) in `apps/web`
- [x] Set up NestJS 10 (Express adapter, TypeScript) in `apps/api`
- [x] Set up BullMQ worker entry point in `apps/worker`
- [x] Create shared TypeScript types in `packages/shared-types`
- [x] Configure ESLint, TypeScript strict mode
- [x] Set up Jest for unit/integration tests
- [x] Set up `.env.example` with all variable keys (no values)
- [x] Set up GitHub Actions: PR lint → type-check → test
- [x] Create MongoDB Atlas cluster (M10, ap-south-1 Mumbai)
- [x] Create Atlas Vector Search indexes (service_catalog, scheme_catalog — 1024-dim, cosine)
- [x] Create 2dsphere geospatial index on complaints.location
- [x] Set up Redis (Railway plugin or Upstash)
- [x] Create Cloudflare R2 bucket (`smart-bharat-complaints`)
- [x] Set up Sentry projects (web + api)
- [x] Set up Railway services (web, api, worker) with env vars

## Priority 2 — Backend Core

- [x] **AuthModule:** OTP request/verify, JWT access+refresh tokens, bcrypt OTP hashing, Redis storage, rate limiting
- [x] **ChatModule:** Anthropic Claude integration (Haiku classification + Sonnet generation), SSE streaming, conversation persistence
- [x] **CatalogModule:** Voyage AI embeddings, Atlas Vector Search queries (cosine ≥ 0.75), service/scheme CRUD
- [x] **ComplaintsModule:** Filing (multipart), tracking ID generation (nanoid `SB-` prefix), duplicate detection ($nearSphere 100m), status management
- [x] **AdminModule:** Email/password auth, catalog CRUD with re-embedding jobs, complaint status updates, review queue
- [x] **FeedbackModule:** Thumbs up/down, link to messageId
- [x] Photo upload to R2 (server-proxied, magic-byte validation, max 3 × 5MB)
- [x] Google Maps Geocoding reverse lookup on complaint submission
- [x] Circuit breaker for LLM calls (5 failures / 60s → static fallback)
- [x] Health check endpoint (`GET /healthz` — Mongo ping + Redis PING)
- [x] helmet middleware with explicit CSP config
- [x] CORS restricted to `FRONTEND_URL`

## Priority 3 — Frontend Core

- [x] Chat streaming UI (SSE consumption, TanStack Query + Zustand)
- [x] Structured catalog cards (service name, docs checklist, portal link button)
- [x] Quick-action chips (Report issue, Find service, Track complaint, Check eligibility)
- [x] Complaint filing flow (conversational → category, location, photo, OTP, submit)
- [x] Complaint tracking page (tracking ID lookup, status stepper)
- [x] Phone lookup flow (OTP → list all complaints)
- [x] Scheme discovery (profile questions → match results)
- [x] Feedback (thumbs up/down on AI responses)
- [x] i18n setup (next-intl, Hindi + English message files)
- [x] Language auto-detect display + persistent toggle
- [x] Admin CMS (catalog list/create/edit, complaint status management)
- [x] Anonymous session handling (anonymousSessionId cookie)

## Priority 4 — Worker Jobs

- [x] Re-embedding job (trigger on catalog create/update via BullMQ)
- [ ] Photo post-processing (thumbnails) — deferred to v2
- [x] Periodic duplicate-detection background scans

## Priority 5 — Content & Data

- [x] Seed service_catalog with top 30-50 services for pilot geography
- [x] Seed scheme_catalog with common welfare schemes
- [x] Create initial admin_users accounts
- [x] Define complaint category-to-department mapping documentation

## Priority 6 — Testing & Quality

- [x] Unit tests: OTP logic, circuit breaker, tracking ID collision, complaint filing
- [ ] Integration tests: full OTP flow, complaint submission → tracking, admin catalog CRUD → re-embedding
- [ ] E2E (Playwright): anonymous chat → catalog card, complaint filing → tracking ID → status lookup, language switching, LLM-down fallback
- [ ] Smoke test checklist (run pre-deploy every release)
- [x] Accessibility audit (WCAG 2.1 AA)
- [x] Performance validation (latency targets)
- [ ] Security review (no PII leaks, rate limiting, file upload validation)

## Priority 7 — Launch Prep

- [x] Railway deployment configs (railway.toml for api, web, worker)
- [x] CI/CD pipeline (GitHub Actions: lint → typecheck → build → test)
- [ ] Staging environment fully configured and tested
- [ ] Production environment configured
- [ ] CI/CD auto-deploy to staging verified
- [ ] Manual promotion to production verified
- [ ] Rollback tested (Railway redeploy previous build)
- [ ] Monthly knowledge base review cadence established
- [ ] Monitoring/alerting for uptime, error rates, LLM latency

## v2+ Backlog

- Native Android app
- WhatsApp bot channel
- Voice input/output
- SMS status notifications for complaint updates
- Direct government API integration (real backend routing)
- Additional regional languages (Bengali, Tamil, Telugu, Marathi)
- Personalized dashboard (past interactions, saved services)
- Proactive notifications (renewal deadlines)
- Community complaint heatmaps (aggregate, anonymized)
- Government staff-facing dashboard
- Presigned direct-to-R2 photo upload (bypass server proxy)
- Redis-backed circuit breaker (shared across replicas)
- Secondary SMS gateway fallback (Twilio India route)
- Multi-region hosting / CDN-fronting for pan-India rollout
- Photo post-processing (thumbnails)
