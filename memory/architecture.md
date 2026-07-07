# Architecture

## Pattern

**Modular monolith** (NestJS). Single deployable API + separate BullMQ worker process. Not microservices.

**Why:** Tightly coupled data (complaints reference users, chat references catalog for RAG), small team (2-3 engineers). NestJS module system (AuthModule, ChatModule, ComplaintsModule, CatalogModule, AdminModule) gives clean separation without ops overhead. Worker is separate only because LLM re-embedding and photo processing are long-running and must not block the HTTP event loop.

## System Components

```
[Browser: Next.js SSR pages]
        |
        | HTTPS (REST + SSE for chat streaming)
        v
[Next.js Frontend — Railway]
        |
        | Internal HTTPS (server-to-server)
        v
[NestJS API — Railway]
   |         |          |            |
[MongoDB   [Redis]   [Anthropic    [Cloudflare R2]
 Atlas]   (cache,    Claude API +   (complaint
(primary   OTP,      Voyage AI      photos)
 data +    rate      embeddings]
 vector    limit,
 search)   queue)

[BullMQ Workers — separate Railway service, same codebase]
  → photo post-processing
  → duplicate-detection scans
  → knowledge-base re-embedding on content edit

[MSG91] — SMS OTP delivery
[Google Maps Geocoding API] — reverse geocode lat/lng
```

**Rules:**
- Frontend calls backend only — no direct client-to-DB or client-to-LLM calls
- All secrets stay server-side
- Chat streams via SSE: NestJS → Next.js → browser
- Admin CMS is a route group in the same Next.js app, gated by admin JWT

## Folder Structure (Monorepo)

```
smart-bharat/
├── apps/
│   ├── web/                    # Next.js 14 (App Router, TypeScript)
│   │   ├── app/                # App Router pages/layouts
│   │   │   ├── (citizen)/      # Citizen-facing routes
│   │   │   │   ├── chat/       # AI companion
│   │   │   │   ├── complaint/  # Filing + tracking
│   │   │   │   └── schemes/    # Scheme discovery
│   │   │   ├── (admin)/        # Admin routes (JWT-gated)
│   │   │   │   ├── catalog/    # KB CRUD
│   │   │   │   └── complaints/ # Status management
│   │   │   └── layout.tsx
│   │   ├── components/         # Reusable UI components
│   │   │   ├── chat/           # Chat UI, streaming display
│   │   │   ├── complaint/      # Filing form, status stepper
│   │   │   ├── common/         # Buttons, cards, inputs
│   │   │   └── admin/          # Admin-specific components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # API client, utilities
│   │   ├── stores/             # Zustand stores (chat streaming, form state)
│   │   ├── i18n/               # next-intl config + message files (en, hi)
│   │   └── styles/             # Global CSS, design tokens
│   ├── api/                    # NestJS 10 (Express adapter)
│   │   ├── src/
│   │   │   ├── auth/           # AuthModule (OTP, JWT, guards)
│   │   │   ├── chat/           # ChatModule (LLM, RAG, streaming)
│   │   │   ├── complaints/     # ComplaintsModule (filing, tracking, duplicates)
│   │   │   ├── catalog/        # CatalogModule (services + schemes KB)
│   │   │   ├── admin/          # AdminModule (CMS, review queue)
│   │   │   ├── feedback/       # FeedbackModule
│   │   │   ├── common/         # Shared guards, pipes, interceptors
│   │   │   └── config/         # Env config, constants
│   │   └── test/               # Integration tests
│   └── worker/                 # BullMQ processor entry point
│       └── src/
│           ├── jobs/           # Job handlers (re-embed, photo, duplicates)
│           └── main.ts
├── packages/
│   └── shared-types/           # TypeScript types shared across apps
├── memory/                     # Project memory (this directory)
├── package.json                # Root (npm workspaces)
├── package-lock.json           # Single lockfile for monorepo
└── README.md
```

## Frontend Architecture

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Rendering:** SSR for fast first-paint on slow mobile; streaming SSE for chat
- **State:** TanStack Query (server-state caching) + Zustand (ephemeral chat/form UI state)
- **i18n:** next-intl for static UI strings; AI-generated content handled by Claude directly
- **Key surfaces:** Chat interface, complaint filing/tracking, scheme discovery, admin CMS
- **Accessibility:** WCAG 2.1 AA, keyboard nav, screen reader (ARIA), 200% zoom

**Client-side state rules:**
- Streaming message buffer in Zustand, cleared on stream completion (final message from server)
- Complaint form draft in Zustand, cleared on submit/cancel — NOT in localStorage (PII risk)
- Anonymous session continuity via `anonymousSessionId` cookie + Redis session mapping

## Backend Architecture

- **Framework:** NestJS 10 (TypeScript, Express adapter)
- **Modules:** AuthModule, ChatModule, ComplaintsModule, CatalogModule, AdminModule, FeedbackModule
- **Validation:** class-validator DTOs on every controller (server-side, never trust client)
- **Auth guards:** NestJS CanActivate classes — `JwtAuthGuard`, `AdminRoleGuard`
- **Rate limiting:** `@nestjs/throttler` backed by Redis (distributed consistency across replicas)
- **Security headers:** helmet middleware (explicit CSP config, not defaults)
- **Error tracking:** Sentry (Next.js + NestJS SDKs)

## Authentication Flow

1. **Browsing/Q&A** — no auth. Anonymous tracked via `anonymousSessionId` cookie.
2. **Complaint filing:**
   - Phone + OTP in same request (OTP requested via `/auth/otp/request` moments earlier)
   - OTP hashed (bcrypt) before Redis storage — never plaintext
   - On verify → JWT access token (15min, Bearer header) + refresh token (30d, httpOnly secure SameSite=Strict cookie)
   - If phone not a known user → `users` doc created inline
3. **Complaint tracking:**
   - By tracking ID → no auth, rate-limited (20 req/min/IP)
   - By phone → fresh OTP required (not stored session)
4. **Admin:** Separate email/password login, separate `ADMIN_JWT_SECRET`, role-based guard

## Data Flow

### Chat (Primary Flow A)
1. POST `/api/v1/chat/message` with `{conversationId, message}`
2. Fetch last 10 messages for context window
3. **Intent classification** → Claude Haiku (strict JSON output, <500ms target): `{category, detectedLanguage}`
4. If `document_info` or `scheme_lookup` → **embed query** via Voyage AI → **Atlas Vector Search** (numCandidates: 100, limit: 5, cosine ≥ 0.75). If no result clears threshold → instruct generation prompt to say "I don't know".
5. If `general` → **Skip RAG**. Instruct generation prompt to answer from general knowledge but explicitly forbid stating specific procedural facts (fees, deadlines, form numbers) not grounded in context.
6. **Generation** → Claude Sonnet (streamed SSE): system prompt includes retrieved catalog entries (if applicable), language instruction, and strict grounding rules based on intent.
7. SSE events: `token` (repeated) → `catalog_card` (if matched) → `done` (with messageId, confidenceScore)
8. Persist assistant message with intentCategory, retrievedCatalogIds, confidenceScore

### Complaint (Primary Flow B)
1. Single POST `/api/v1/complaints` (multipart/form-data, full payload assembled client-side)
2. Verify OTP hash in Redis → create user if new
3. **Duplicate detection:** `$nearSphere` + `$maxDistance: 100` (meters) + same category + last 14 days
4. Upload photos to R2 (server-proxied, max 3 × 5MB, magic-byte MIME check)
5. Generate trackingId via nanoid (custom alphabet, `SB-` prefix, 8 chars, collision-checked)
6. Insert complaint + initial `complaint_status_updates` entry
7. Return trackingId (only after durable storage confirmed)

### Circuit Breaker (LLM Fallback)
- In-memory failure count + 60s cooldown window
- Trips after 5 consecutive failures within 60s
- While tripped: respond with static apology + top 5 cached catalog entries + static complaint form link
- Resets after 60s with single trial request

## Graceful Degradation

- AI/LLM unavailable → circuit breaker → static fallback (top services + complaint form link)
- Photo upload fails → complaint still submits, `photoUrls: []`, `confidenceFlag: "low"`
- Geolocation denied → manual address/landmark text entry
- Form data preserved in Zustand during session (transient network loss)
- SSR/hydration: browser-only APIs (Geolocation, window) wrapped in `useEffect` / `dynamic({ssr:false})`
