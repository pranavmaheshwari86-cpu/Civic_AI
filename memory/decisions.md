# Decisions

## Confirmed Decisions

### D1: Web-only, no native app (v1)
**Date:** 2026-07-07  
**Rationale:** Digital inclusion — no app install barrier. Mobile-browser-first responsive design. Native app is v2+ (Android-first).

### D2: No login wall for browsing/Q&A
**Date:** 2026-07-07  
**Rationale:** Account creation is a conversion-killer. Auth gated only for complaint filing/tracking.

### D3: Chat-first, form-second UX
**Date:** 2026-07-07  
**Rationale:** Conversational entry reduces intimidation for low-digital-literacy users. Forms appear only after conversation.

### D4: Language auto-detect, not upfront picker
**Date:** 2026-07-07  
**Rationale:** Forced picker adds friction. Auto-detect from first message. Persistent toggle available.

### D5: No direct government system integration (v1)
**Date:** 2026-07-07  
**Rationale:** Government MoUs/API access take longer than a product build cycle. Smart Bharat maintains its own complaint tracking DB.

### D6: No payments/fees in v1
**Date:** 2026-07-07  
**Rationale:** Legal/compliance weight too high for MVP. Link out to official payment portals.

### D7: No Aadhaar/biometric/sensitive-ID in v1
**Date:** 2026-07-07  
**Rationale:** Data-liability risk without formal government data-sharing agreement.

### D8: Hindi + English only at launch
**Date:** 2026-07-07  
**Rationale:** Broadest reach for MVP. Architecture supports adding languages.

### D9: Anthropic Claude API as LLM provider
**Date:** 2026-07-07 (TRD)  
**Rationale:** Strong multilingual (Hindi/English) instruction-following, low hallucination with RAG grounding. Sonnet for generation, Haiku for cheap intent classification (<500ms). Cost comparison against alternatives not performed — revisit if budget constraints emerge.

### D10: Fixed complaint taxonomy (6 categories)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Fixed is easier to route reliably. Categories: `road_infrastructure`, `water_supply`, `sanitation_waste`, `streetlight_electrical`, `public_safety`, `other`. Enforced server-side via class-validator. Confirm with municipal liaison before production.

### D11: Modular monolith, not microservices
**Date:** 2026-07-07 (TRD)  
**Rationale:** Tightly coupled data, small team (2-3 engineers). NestJS modules give clean separation without ops overhead. BullMQ worker is the single exception — runs as separate process to avoid blocking HTTP event loop.

### D12: MongoDB Atlas (not PostgreSQL)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Flexible schema for evolving catalog/complaint structures. Native Atlas Vector Search eliminates need for a separate vector DB (Pinecone/Weaviate), reducing infra surface area.

### D13: Voyage AI for embeddings (not self-hosted)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Anthropic's recommended partner. Integrates with Atlas Vector Search. Trades small API cost for zero embedding-infra maintenance.

### D14: Cloudflare R2 for blob storage (not S3)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Zero egress fees — critical for serving complaint photos to mobile users on metered data. S3-compatible API.

### D15: Railway for hosting (not Kubernetes/AWS)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Simple git-push deploys, matches team deployment familiarity. Avoids managing Kubernetes for a team this size.

### D16: MSG91 for SMS/OTP (not Twilio)
**Date:** 2026-07-07 (TRD)  
**Rationale:** India-focused with high deliverability for Indian mobile numbers. DLT-compliance support (mandatory for transactional SMS in India).

### D17: npm workspaces monorepo (not polyrepo)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Shared TypeScript types between frontend and backend without publishing an npm package. Single lockfile.

### D18: Server-proxied photo upload (not direct-to-R2)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Keeps validation/virus-scanning centralized. Magic-byte MIME check via `file-type` package. Presigned direct upload is a v2 optimization.

### D19: In-memory circuit breaker (not Redis-backed)
**Date:** 2026-07-07 (TRD)  
**Rationale:** Per-instance breaker acceptable at launch scale (small number of replicas). Move to Redis if inconsistent fallback behavior appears at higher scale.
### D20: OTPs hashed with bcrypt before Redis storage
**Date:** 2026-07-07 (TRD)  
**Rationale:** Never store or log OTPs in plaintext. Cost factor 12.

### D21: Pilot launch in Delhi NCR (NDMC/MCD)
**Date:** 2026-07-07  
**Rationale:** Resolves Q1. Delhi NCR provides a high-density, highly visible pilot geography with bilingual (Hindi/English) citizen demographics.

### D22: No direct government system integration in v1 (MVP)
**Date:** 2026-07-07  
**Rationale:** Resolves Q2. The platform operates independently to avoid bureaucratic bottlenecking and timeline slippage.

### D23: Seed budget ($5,000) and three-month MVP delivery schedule
**Date:** 2026-07-07  
**Rationale:** Resolves Q3. Lean monolith architecture on managed API platforms minimizes development and maintenance costs.

### D24: Smart Bharat Content Operations Desk for KB accuracy
**Date:** 2026-07-07  
**Rationale:** Resolves Q5. A dedicated desk will perform monthly manual reviews of catalog content, automated by feedback alerts.

### D25: Zero sensitive ID collection + standard DPDP consent
**Date:** 2026-07-07  
**Rationale:** Resolves Q7. We comply with Indian DPDP Act by avoiding collection of high-liability identifiers (Aadhaar, PAN) and showing explicit consent forms at phone input.

### D26: Standardized OTP template registration via MSG91
**Date:** 2026-07-07  
**Rationale:** Resolves Q8. DLT compliance is required for Indian transactional SMS; templates must be submitted immediately to avoid launch blockages.

### D27: Primary data residency in AWS Mumbai (ap-south-1)
**Date:** 2026-07-07  
**Rationale:** Resolves Q9. Hosting on MongoDB Atlas and Railway services inside the AWS Mumbai region satisfies standard Indian data residency regulations for non-government entities.

### D28: Claude Haiku for intent routing, Claude Sonnet for generation
**Date:** 2026-07-07  
**Rationale:** Resolves Q10. Maximizes token cost efficiency (Haiku is exceptionally low-cost) while retaining state-of-the-art bilingual conversation capabilities (Sonnet).

### D29: Vector index scalability verification
**Date:** 2026-07-07  
**Rationale:** Resolves Q11. Baseline performance on tens of thousands of catalog entries will be validated in load tests before scaling beyond the pilot.

### D30: 6-category municipal taxonomy matching standard municipal departments
**Date:** 2026-07-07  
**Rationale:** Resolves Q12. Aligns engineering category enum with standard municipal department divisions for ease of manual routing.

## Resolved Questions

| # | Question | Decision | Status |
|---|---|---|---|
| Q1 | Which state/city launches first? | Pilot launch in Delhi NCR (NDMC/MCD) | **Resolved (D21)** |
| Q2 | Any existing government MoU/API access? | No direct integration in v1 (MVP) | **Resolved (D22)** |
| Q3 | Actual budget and timeline? | Seed budget ($5,000), 3-month launch | **Resolved (D23)** |
| Q4 | LLM provider | Anthropic Claude API | **Resolved (D9)** |
| Q5 | Who owns KB accuracy long-term? | Smart Bharat Content Operations Desk | **Resolved (D24)** |
| Q6 | Fixed vs open-ended taxonomy | Fixed, 6 categories | **Resolved (D10)** |
| Q7 | DPDP Act compliance requirements? | Standard DPDP Privacy Policy + Explicit Consent | **Resolved (D25)** |
| Q8 | DLT SMS template registration timeline? | 1-2 weeks template submission | **Resolved (D26)** |
| Q9 | Data residency — Atlas Mumbai or government cloud? | AWS Mumbai region is sufficient | **Resolved (D27)** |
| Q10 | LLM cost model at scale? | Haiku (routing) + Sonnet (generation) | **Resolved (D28)** |
| Q11 | Atlas Vector Search performance at scale? | Performance load test before rollout | **Resolved (D29)** |
| Q12 | Complaint category taxonomy validation? | 6-category standard municipal enum | **Resolved (D30)** |

