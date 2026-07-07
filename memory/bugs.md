# Bugs

**Last updated:** 2026-07-07

## Known Bugs

None — project is pre-development.

## Temporary Workarounds

None.

## Recently Fixed Issues

None.

## Technical Risk Areas (From TRD)

These aren't bugs yet but are known risk areas to watch during development:

1. **LLM hallucination despite RAG:** Confident wrong answers about government procedures erode trust faster than a static website. Mitigation: cosine similarity threshold ≥ 0.75, below which model says "I don't know". Log all `retrievedCatalogIds: []` responses for manual review.

2. **Sparse initial knowledge base:** Poor vector-search recall at launch. Mitigation: seed `service_catalog` with top 30-50 highest-frequency services for launch state before go-live. Monitor zero-result queries.

3. **MSG91 OTP delivery failure:** Some carriers may have delays. Mitigation: add secondary SMS gateway fallback (e.g., Twilio India route) as v1.1 if delivery rate <95% in staging.

4. **DLT template registration lead time:** 1-2 weeks real-world lead time. Must be kicked off before engineering is done or OTP auth can't go live on schedule.

5. **Duplicate detection false positives/negatives:** 100m radius + 14-day window are launch assumptions. Mitigation: make threshold configurable (not hardcoded) for post-launch tuning.

6. **Knowledge base staleness:** Outdated government info is worse than no info. Monthly review cadence + thumbs-down threshold (3 within 7 days) → auto-flag for review.

7. **Language quality:** Stilted Hindi responses alienate target users. Must test Claude's Hindi output quality during development, not just at launch.

8. **Complaint "Resolved" gap:** Manual status updates in v1 = operational cost. No automatic verification from government systems.

9. **helmet CSP breaking SSE/hydration:** Default CSP config silently breaks SSE streaming and Next.js inline scripts. Must set explicit directives and test against prod build.

10. **Railway Redis connection format:** Railway plugin vs Upstash differ in connection string format. Verify `REDIS_URL` in each environment before first deploy.

11. **SSR + browser APIs crash:** Geolocation/window called during SSR crashes Next.js server process (not just client warning). Must wrap in `useEffect` / `dynamic({ssr:false})`.

12. **npm workspace lockfile drift:** Running `npm install` per-app instead of `npm ci` at root causes "works locally, fails on Railway" build breaks.

13. **Circuit breaker per-instance inconsistency:** In-memory breaker state not shared across replicas. Acceptable at launch scale, may need Redis-backed breaker at higher scale.
