# Deployment

## Hosting

**Platform:** Railway (3 services in one project)

| Service | App | Build Command | Start Command |
|---|---|---|---|
| web | Next.js 14 | `npm ci && npm run build -w apps/web` | `npm run start -w apps/web` (SSR, not static export) |
| api | NestJS 10 | `npm ci && npm run build -w apps/api` | `node apps/api/dist/main.js` |
| worker | BullMQ | Same build as api | `node apps/worker/dist/main.js` |

**Health check:** `GET /healthz` on api service — checks Mongo ping + Redis PING → 200 only if both pass. Checked every 30s by Railway.

**External managed services:**
- MongoDB Atlas (M10+, AWS ap-south-1 Mumbai)
- Cloudflare R2 (blob storage, bucket: `smart-bharat-complaints`)

## Environment Variables

### `apps/api` (and `apps/worker` shares most)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` / `staging` / `production` |
| `PORT` | API listen port |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `REDIS_URL` | Redis connection string |
| `ANTHROPIC_API_KEY` | Claude API key |
| `VOYAGE_API_KEY` | Voyage AI embeddings key |
| `MSG91_API_KEY` | SMS gateway key |
| `MSG91_SENDER_ID` | Registered DLT sender ID |
| `MSG91_OTP_TEMPLATE_ID` | DLT-approved OTP template ID |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | Bucket name for complaint photos |
| `GOOGLE_MAPS_API_KEY` | Geocoding API key |
| `JWT_ACCESS_SECRET` | Citizen access token signing secret |
| `JWT_REFRESH_SECRET` | Citizen refresh token signing secret |
| `JWT_ACCESS_EXPIRY` | e.g. `"15m"` |
| `JWT_REFRESH_EXPIRY` | e.g. `"30d"` |
| `ADMIN_JWT_SECRET` | Separate admin token signing secret |
| `FRONTEND_URL` | For CORS whitelist |
| `SENTRY_DSN` | Error tracking |
| `LOG_LEVEL` | `debug` / `info` / `warn` / `error` |

### `apps/web`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API origin |
| `NEXT_PUBLIC_SENTRY_DSN` | Frontend error tracking |

### `apps/worker` (additional)

| Variable | Purpose |
|---|---|
| `BULLMQ_CONCURRENCY` | Concurrent jobs per worker instance |

> **Rule:** All secrets as Railway env vars. Never committed. `.env.example` with keys-only (no values) committed to repo.

## Environments

| Env | Infra | Notes |
|---|---|---|
| Development | Local Docker Compose (Mongo + Redis containers), `.env.development` | Anthropic/Voyage/MSG91 hit sandbox/test-mode endpoints |
| Staging | Separate Railway project, separate Atlas cluster (or separate DB), R2 bucket: `smart-bharat-complaints-staging` | QA before prod promotion |
| Production | Dedicated Railway project, dedicated Atlas M10+ (Mumbai), dedicated R2 bucket, real MSG91 DLT templates | |

## CI/CD

**GitHub Actions:**
- **Every PR:** lint (eslint) → type-check (`tsc --noEmit`) → unit tests (jest)
- **Merge to main:** auto-deploy `apps/web` + `apps/api` + `apps/worker` to staging
- **Production deploy:** manual promotion (git tag `v*.*.*` or Railway environment promote) — deploys same build artifact, no rebuild

## Rollback

- Railway retains previous deployment builds
- Rollback via Railway dashboard "redeploy previous build" — reverts in <1 minute, no rebuild
- **Rule:** Database migrations must be additive/backward-compatible within a single release (expand-then-contract pattern) so instant rollback is safe

## Known Platform Gotchas

1. **npm workspace lockfile:** Single root `package-lock.json`, `npm ci` at repo root. Running installs per-app causes "works locally, fails on Railway" build breaks.
2. **helmet CSP:** Default CSP breaks SSE streaming + Next.js inline hydration scripts. Must set explicit `script-src` with `'self' 'unsafe-inline'` scoped to Next.js requirements. Test against prod build, not dev mode.
3. **Railway Redis connection:** Railway Redis plugin vs external Upstash differ in connection string format. Verify `REDIS_URL` resolves in each environment before first deploy.
4. **SSR + browser APIs:** Geolocation API and `window`-dependent code must be `useEffect` / `dynamic({ssr:false})`. Calling during SSR crashes the Next.js server process.
5. **Multi-region latency:** Railway is single-region by default. Acceptable for v1 (1-2 states). Consider CDN-fronting (Cloudflare) for static assets before pan-India rollout.

## Performance Targets

| Metric | Target |
|---|---|
| Chat first-token latency | <3s (classification <500ms + vector search <200ms + generation start) |
| Complaint submission (1 photo, 4G) | <8s end-to-end |
| Catalog search direct hit | <300ms p95 |
| Status check (GET by trackingId) | <150ms p95 |
| Target concurrent users | 5,000 active, 50 req/s peak on `/chat/message` |

## Reliability

- **Uptime target:** 99.5%
- **API retry/backoff:** Anthropic + Voyage calls with exponential backoff (3 attempts: 1s, 2s, 4s) for transient 5xx
- **Database backups:** Atlas automated daily, 7-day retention minimum
- **Horizontal scaling:** Stateless NestJS replicas behind Railway load balancing
