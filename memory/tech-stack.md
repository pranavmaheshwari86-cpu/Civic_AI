# Tech Stack

> All selections finalized per TRD v1.0.

## Frameworks

| Layer | Choice | Justification |
|---|---|---|
| Frontend | **Next.js 14** (App Router, TypeScript) | SSR for fast first-paint on slow mobile connections, file-based routing, React ecosystem |
| Backend | **NestJS 10** (TypeScript, Express adapter) | Modular DI architecture, built-in guards/pipes/interceptors, streaming support |
| Worker | **BullMQ** (Redis-backed) | Async jobs (re-embedding, photo processing, duplicate scans), no extra infra beyond Redis |
| Language | **TypeScript everywhere** | Single language across stack, shared types package |

## Libraries

| Library | Purpose |
|---|---|
| TanStack Query (React Query) | Server-state caching/refetch on frontend |
| Zustand | Ephemeral UI state (chat streaming buffer, complaint form draft) |
| next-intl | Static UI string i18n (Hindi + English) |
| class-validator | Server-side DTO validation on every NestJS controller |
| @nestjs/jwt | JWT signing/verification |
| @nestjs/throttler | Rate limiting (Redis-backed for distributed consistency) |
| helmet | Security headers (explicit CSP config) |
| nanoid | Tracking ID generation (custom alphabet, `SB-` prefix) |
| file-type | Magic-byte MIME check for photo uploads |
| AWS SDK v3 | Cloudflare R2 access (S3-compatible API) |
| Sentry | Error tracking (Next.js + NestJS SDKs) |
| zod / class-validator | Payload validation |
| bcrypt | OTP hashing (cost factor 12) |

## Database

| Component | Choice | Justification |
|---|---|---|
| Primary DB | **MongoDB Atlas** (M10 tier, AWS ap-south-1) | Flexible schema, native Atlas Vector Search (eliminates separate vector DB) |
| Cache/OTP/Rate-limit | **Redis** (Railway plugin or Upstash) | Sub-ms TTL storage for OTPs (5min), sliding-window rate limiting |
| Queue backend | **Redis** (shared with cache) | BullMQ uses existing Redis, no extra infra |
| Blob storage | **Cloudflare R2** (S3-compatible) | Zero egress fees for serving complaint photos to mobile users |

## AI/ML

| Component | Choice | Justification |
|---|---|---|
| Chat generation | **Anthropic Claude Sonnet** (claude-sonnet-4-6) | Strong multilingual instruction-following, low hallucination with RAG |
| Intent classification | **Anthropic Claude Haiku** (claude-haiku-4-5) | Cheap/fast for routing step (<500ms target) |
| Embeddings | **Voyage AI** (voyage-2, 1024-dim) | Anthropic's recommended partner, integrates with Atlas Vector Search |

## Third-Party Services

| Service | Provider | Purpose | Status |
|---|---|---|---|
| LLM | Anthropic Claude API | Chat generation + intent classification | **Confirmed** |
| Embeddings | Voyage AI | Text embeddings for RAG | **Confirmed** |
| SMS/OTP | MSG91 | Transactional OTP delivery (India-focused, DLT-compliant) | **Confirmed** (DLT registration needed pre-launch) |
| Geocoding | Google Maps Geocoding API | Reverse geocode lat/lng to address | **Confirmed** ($200/mo free tier covers launch) |
| Blob storage | Cloudflare R2 | Complaint photos | **Confirmed** |
| Error tracking | Sentry | Frontend + backend error tracking | **Confirmed** (free tier) |
| Hosting | Railway (3 services: web, api, worker) | App hosting | **Confirmed** |
| Database hosting | MongoDB Atlas (M10+, Mumbai region) | Primary data + vector search | **Confirmed** |
| Cache hosting | Railway Redis plugin or Upstash | OTP, rate limiting, queue | **Confirmed** |

## Repo Structure

**Monorepo** with npm workspaces:
```
apps/web          → Next.js 14
apps/api          → NestJS 10
apps/worker       → BullMQ processor
packages/shared-types → Shared TypeScript types
```
Single root `package-lock.json`. `npm ci` at root level (not per-app).

## Package Manager

**npm** with npm workspaces. No yarn/pnpm.

## Constraints

- Budget: lean/seed-stage — managed services + LLM APIs, no custom infra
- Data residency: Atlas in AWS ap-south-1 (Mumbai) — pending confirmation if government partnership requires NIC/MeghRaj hosting
- No Aadhaar/biometric in v1
- No payments in v1
- Mobile-web first: must work on Android browsers at 3G/4G speeds
