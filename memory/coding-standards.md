# Coding Standards

> Finalized per TRD v1.0. Enforced from first commit.

## Language & Tooling

- **TypeScript everywhere** (frontend + backend + worker + shared-types)
- **npm** with npm workspaces (single root `package-lock.json`)
- **ESLint** for linting, run on every PR via GitHub Actions
- **`tsc --noEmit`** type-check on every PR
- **Jest** for unit/integration tests

## Backend (NestJS)

- Every controller validates input via **class-validator DTOs** — no endpoint trusts client-side validation
- Business logic in **services**, not controllers (controllers are thin)
- NestJS modules per domain: `AuthModule`, `ChatModule`, `ComplaintsModule`, `CatalogModule`, `AdminModule`, `FeedbackModule`
- Auth via NestJS `CanActivate` guards: `JwtAuthGuard`, `AdminRoleGuard`
- Rate limiting via `@nestjs/throttler` backed by Redis
- Security headers via `helmet` (explicit CSP, not defaults)
- File upload validation: magic-byte MIME check (`file-type` package), not just extension
- All JWTs signed HS256 via `@nestjs/jwt`
- OTPs hashed with bcrypt (cost factor 12) before Redis storage
- Exponential backoff on external API calls (3 attempts: 1s, 2s, 4s)

## Frontend (Next.js)

- App Router (file-based routing)
- Server-state: **TanStack Query**; ephemeral UI state: **Zustand**
- Static i18n strings: **next-intl** (never hardcoded)
- Browser-only APIs (`Geolocation`, `window`) wrapped in `useEffect` / `dynamic({ssr:false})` — calling during SSR crashes the server
- No PII in localStorage (complaint form drafts in Zustand only, cleared on submit/cancel)
- Anonymous session via `anonymousSessionId` cookie

## Shared

- Shared TypeScript types in `packages/shared-types` — single source of truth for shapes used by both apps
- No magic numbers — named constants in config
- Components: small, focused, reusable
- No unused imports or dead code

## Accessibility (WCAG 2.1 AA — Non-Negotiable)

- Min 4.5:1 contrast ratio (normal text), 3:1 (large text)
- All interactive elements keyboard-navigable with visible focus indicator
- ARIA labels/roles on chat messages, form fields, status stepper, errors
- Every icon paired with text label (no icon-only controls)
- Pages usable at 200% browser zoom, no horizontal scroll
- Form validation errors: plain language, adjacent to field, not color-only
- No auto-playing media

## Performance

- Chat first-token: <3s (intent classification <500ms, vector search <200ms)
- Complaint submission (1 photo, 4G): <8s
- Catalog search: <300ms p95
- Status check: <150ms p95
- Lazy load below-the-fold content
- Code-split at route boundaries

## Security

- All secrets as environment variables (Railway). Never committed, never logged. `.env.example` with keys-only.
- CORS restricted to `FRONTEND_URL` only
- Input sanitization on all user content before render (XSS prevention)
- Parameterized queries only (MongoDB driver handles this natively)
- Phone numbers: plaintext in Atlas (encryption-at-rest + TLS-in-transit) but never exposed in public endpoints
- No Aadhaar/PAN/sensitive ID collection
- No PII in analytics payloads or logs
- Complaint photos: signed URLs with 24h expiry, no public bucket listing

## Error Handling

- Every error state has a defined citizen-facing message (plain language, not technical)
- No dead ends — always offer an alternative action
- Circuit breaker on LLM calls: 5 consecutive failures → static fallback for 60s
- Graceful degradation: AI down → static complaint form + top service links

## Git / CI

- Single root `package-lock.json`, `npm ci` at root level
- PR checks: lint → type-check → unit tests
- Merge to main: auto-deploy to staging
- Production: manual promotion (git tag), same build artifact (no rebuild)
- Database migrations: additive/backward-compatible per release (expand-then-contract)
