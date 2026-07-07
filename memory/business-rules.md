# Business Rules

## AI Companion Behavior

1. **First token in <3 seconds.** Classification (<500ms) + vector search (<200ms) + generation start. Responses stream via SSE, never spinner-then-dump.
2. **No fabrication.** If cosine similarity < 0.75 (no catalog match above threshold), the generation prompt instructs "I don't know" + escalation link. Log all `retrievedCatalogIds: []` responses for review.
3. **One clarifying question max.** Ambiguous queries (intent = `unknown`) get exactly one follow-up. Enforced via prompt instruction.
4. **Language auto-detect.** Haiku classification returns `detectedLanguage`. Respond in that language. If user switches mid-conversation, follow.
5. **No sensitive ID collection.** AI must never ask for or store Aadhaar, PAN, or similar in v1.
6. **Context window:** Last 10 messages of conversation included in generation prompt.
7. **Intent categories:** `document_info`, `complaint`, `scheme_lookup`, `general`, `unknown` — classified by Haiku, strict JSON output.

## Complaint Filing

8. **Photo always optional.** Never block submission. `photoUrls: []` and `confidenceFlag: "low"` if absent.
9. **Photo upload failure non-blocking.** Frontend retries 2x client-side, then allows proceeding without photo.
10. **Photo limits:** Max 3 photos, 5MB each, image/jpeg or image/png only. Magic-byte MIME check server-side (`file-type` package).
11. **Location always optional.** Browser geolocation first → manual address/landmark fallback.
12. **OTP required at submission only.** Phone + OTP fields in same POST `/api/v1/complaints` request. Don't gate conversation behind auth.
13. **Tracking ID after durable storage only.** Never show tracking ID before MongoDB insert confirmed.
14. **Tracking ID format:** `SB-XXXXXXXX` (nanoid, custom uppercase alphanumeric alphabet, collision-checked up to 3 retries).
15. **Duplicate detection:** `$nearSphere` query — same category, within 100m (`$maxDistance: 100`), created in last 14 days. Thresholds are configurable (not hardcoded).
16. **Never auto-merge duplicates.** Show user the match, require explicit confirmation via `/merge-confirm`. Complaint is created regardless (not blocked).
17. **Fixed category taxonomy (v1):** `road_infrastructure`, `water_supply`, `sanitation_waste`, `streetlight_electrical`, `public_safety`, `other`. Enforced server-side via `@IsIn(...)`.
18. **Photos server-proxied:** NestJS uploads to R2, not direct client-to-R2 (centralized validation).

## Complaint Tracking

19. **Status states:** `submitted` → `under_review` → `in_progress` → `resolved` → `closed`.
20. **Status history:** Append-only `complaint_status_updates` collection. Never mutated after insert.
21. **Tracking ID lookup:** Public, no auth. Rate-limited 20 req/min/IP.
22. **Phone lookup:** Requires fresh OTP (not stored session). Prevents phone-guessing attacks.
23. **Invalid ID:** Clear "not found" message. No PII leaked. No account details exposed.
24. **Public endpoint privacy:** `GET /complaints/:trackingId` omits phone, user details, photo URLs.
25. **Photo access:** Signed R2 URLs with 24-hour expiry, regenerated per request.

## Scheme Recommendation

26. **Only genuinely eligible schemes.** Match against `eligibilityCriteria` fields (ageMin/Max, occupationTypes, applicableStates, genderRestriction, incomeThresholdMax).
27. **Lightweight profiling only.** Ask age range, occupation type, state, gender — never sensitive documents or ID numbers.

## Knowledge Base / Content

28. **Content workflow:** Draft → In Review → Published → Flagged → Deprecated.
29. **Monthly review minimum** of all published entries.
30. **Thumbs-down threshold:** 3+ negative feedback within 7 days on same entry → auto-flag for review.
31. **Deprecated entries:** `isActive: false`, removed from citizen-facing. Retained in DB (no hard delete).
32. **Admin edits auto-record:** `lastReviewedAt` + `reviewedBy`. Edit triggers re-embedding BullMQ job.
33. **Changes reflect immediately:** Re-embedding job runs async; next conversation uses updated embeddings.

## Auth & Privacy

34. **No login wall for browsing/Q&A.** Anonymous tracked via `anonymousSessionId` cookie.
35. **OTP hashed (bcrypt, cost 12) before Redis storage.** Never stored or logged in plaintext.
36. **OTP rate limiting:** Max 3 verification attempts per code. Max 3 OTP requests per phone per hour. Redis TTL-enforced.
37. **JWT tokens:** Access 15min (Bearer header), Refresh 30d (httpOnly secure SameSite=Strict cookie).
38. **Phone numbers:** Plaintext in Atlas (encryption-at-rest + TLS-in-transit). Never in public endpoints, analytics, or logs.
39. **No PII in analytics.** Anonymized/hashed identifiers only. Never raw query text or phone numbers to third parties.
40. **Complaint photos:** Signed URLs, 24h expiry, no public bucket listing. Never expose which house filed which complaint.
41. **Plain-language privacy notice** at phone number collection point.
42. **Data retention:** Complaint records minimum 2 years. Atlas automated daily backups, 7-day retention.
43. **Admin auth:** Separate email/password, separate `ADMIN_JWT_SECRET`, role-based guard (editor can edit catalog, admin can also manage complaints and admin users).

## UX Rules

44. **Chat-first, form-second.** Structured forms appear only as result of conversation.
45. **Actionable items are always cards/buttons**, not buried in paragraph text.
46. **Checklists rendered as distinct UI elements**, not inline prose.
47. **Form data preserved in Zustand** during session (transient network loss). Not in localStorage (PII risk).
48. **No auto-playing media** anywhere in the product.

## Circuit Breaker (LLM Fallback)

49. **Trips after 5 consecutive LLM failures within 60 seconds.** In-memory per-instance counter.
50. **While tripped:** Respond with static apology + top 5 cached catalog entries (Redis, refreshed daily) + static complaint form link.
51. **Resets after 60s cooldown** with single trial request.
52. **4xx errors (permanent) are not retried.** Only transient 5xx/timeout errors get exponential backoff (3 attempts: 1s, 2s, 4s).
