# Changelog

## 2026-07-07 (TRD v1.0)

- Updated all memory files with Technical Requirements Document v1.0 specifics
- **Architecture:** finalized modular monolith (NestJS), 3 Railway services (web, api, worker)
- **Tech stack:** confirmed Next.js 14, NestJS 10, MongoDB Atlas (M10, Mumbai), Redis, Anthropic Claude (Sonnet + Haiku), Voyage AI, MSG91, Cloudflare R2, Railway
- **Database:** replaced generic schemas with 9 MongoDB collections + Redis keys + R2 storage (exact fields, types, indexes)
- **API:** replaced generic endpoints with full `/api/v1` contracts (auth, request/response formats, rate limits, error codes)
- **Deployment:** confirmed Railway hosting, 26 env vars, GitHub Actions CI/CD, rollback strategy, 5 known platform gotchas
- **Decisions:** added D9-D20 (12 new TRD decisions), resolved Q4 (LLM → Anthropic) and Q6 (taxonomy → fixed 6 categories), added Q8-Q12 (5 new open questions)
- **Business rules:** added TRD-specific rules (#7 context window, #14 tracking ID format, #15 geospatial params, #17 category enum, #49-52 circuit breaker)
- **Bugs/risks:** added 13 technical risk areas with mitigations (from TRD §11)
- **TODO:** restructured into 8 priority levels (P0 pre-engineering through P7 launch prep + v2 backlog)

## 2026-07-07 (Initial)

- Initialized project memory system (14 files)
- Populated all memory files from PRD v1.0 (Smart Bharat — AI-Powered Civic Companion)
- Project status: pre-development, no code
