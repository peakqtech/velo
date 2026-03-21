# AI SEO & GEO Agent — Implementation Plan Review

**Reviewer:** Claude (Senior Code Reviewer)
**Date:** 2026-03-19
**Verdict:** Good plan with a few critical issues to fix before implementation.

---

## CRITICAL Issues (Must Fix)

### C1. Spec uses `SEOCampaign` but codebase model is `Campaign`

**Location:** Spec line 127 (`campaign SEOCampaign?`), Plan Task 3 (line 325)

The design spec's `ContentOpportunity` model references `SEOCampaign`, but the actual Prisma schema at `packages/infra/db/prisma/schema.prisma:373` uses `model Campaign`. The **plan** correctly uses `Campaign?` in Task 3 (line 325) — this is good. However, the spec itself is inconsistent and should be updated to avoid confusion for any developer reading the spec first.

**Action:** Update the spec to reference `Campaign` instead of `SEOCampaign`. Plan is already correct here.

### C2. `ContentPiece.campaignId` is currently required (non-nullable) with `onDelete: Cascade`

**Location:** Plan Task 3 Step 2 (line 352-355), Schema line 395-396

The existing schema has `campaignId String` (required) and `campaign Campaign @relation(..., onDelete: Cascade)`. The plan says "Make `ContentPiece.campaignId` optional if not already" but this is a **breaking schema change** — making a required field optional requires a migration that handles existing data. The plan does not address the data migration for existing `ContentPiece` rows.

Additionally, changing from `Campaign` (required relation with Cascade) to `Campaign?` (optional) changes the delete semantics. This needs explicit migration handling.

**Action:** Add a step in Task 3 or Task 4 that explicitly handles the `ContentPiece.campaignId` migration (ALTER COLUMN SET NULL). Add a note about testing that existing ContentPiece records are not broken.

### C3. Cron endpoint runs agent loops sequentially — will timeout

**Location:** Plan Task 21 (line 3192)

The cron endpoint iterates over all active configs with `for (const config of configs)` and `await loop.run()` sequentially. With multiple sites, this will exceed Vercel's function timeout (default 10s, max 300s on Pro). Each agent loop involves multiple API calls (GSC, AI engines, etc.).

**Action:** Either: (a) run loops in parallel with `Promise.allSettled`, (b) dispatch each site to a separate background function/queue, or (c) add a `siteId` query param so the cron triggers one site at a time. Option (b) is most robust.

---

## IMPORTANT Issues (Should Fix)

### I1. Missing `AiModel` field in AgentConfig — plan adds it, spec does not

**Location:** Plan Task 2 line 248 (`aiModel AiModel @default(CLAUDE)`)

The plan adds an `aiModel` field to `AgentConfig` that is not in the spec's Prisma model definition. This is a beneficial deviation (needed for multi-model support per the spec's tier capabilities matrix), but the spec should be updated for consistency.

**Action:** Update spec `AgentConfig` model to include `aiModel`.

### I2. `Channel` enum already exists — plan acknowledges but doesn't verify `SOCIAL`/`EMAIL` values

**Location:** Plan Task 1 (line 209)

The existing `Channel` enum at schema line 339 has BLOG, GBP, SOCIAL, EMAIL — which matches. The plan notes to "verify it matches and reuse it" but should include a concrete verification step rather than a comment.

**Action:** Change Task 1 to explicitly verify the existing Channel enum values match before proceeding.

### I3. No tests for Dashboard API routes

**Location:** Tasks 18-21

None of the API route tasks include tests. The packages (Tasks 6-17) follow TDD discipline well, but the dashboard API layer has zero test coverage. At minimum, the config validation logic and approval state machine deserve tests.

**Action:** Add a task (e.g., Task 19.5) for API route handler tests using `vitest` with mocked Prisma, or at least integration test stubs.

### I4. PATCH opportunity route lacks input validation

**Location:** Task 19 Step 3, line 2971

The `PATCH /opportunities/[oid]` route does `body.status` and `body.approvalNote` directly without Zod validation. Any status value could be written.

**Action:** Add a Zod schema to validate the PATCH body, restricting `status` to valid `OpportunityStatus` enum values.

### I5. Missing `reports` page task

**Location:** File structure (line 122) vs Task Group 5

The file structure lists `reports/page.tsx` but there is no task implementing it. Tasks 22-26 cover agent, opportunities, geo, approvals, and SEO hub updates — but not the reports page.

**Action:** Add a Task 26.5 for the reports page, or explicitly mark it as deferred.

### I6. Escalation logic (queue > 10, 7-day auto-skip) not implemented

**Location:** Spec section "Oversight Flow" (line 283-284, 460)

The spec defines escalation rules: approval queue > 10 items triggers reminder email, 7 days unactioned triggers auto-skip. Neither the `OversightGate` class nor any task implements this logic.

**Action:** Add a task for an `EscalationChecker` service that runs as part of the GATE step or as a separate scheduled check.

### I7. No rate limiting / caching for GEO engine queries

**Location:** Spec "Rate Limiting & Cost Control" section (line 395-399)

The spec defines per-engine daily query caps and 24h response caching. Neither the engine adapters nor the `InternalGeoProvider` implement caching or rate limiting.

**Action:** Add rate limiter middleware and a cache layer (even a simple Map with TTL) to the `InternalGeoProvider`. Could be a separate task after Task 10.

---

## MINOR Issues (Nice to Have)

### M1. Deduplicator test "best dentist in jakarta" vs "best dentists in jakarta" may not hit 0.7 threshold

The Jaccard similarity after stopword removal and bigram extraction for "best dentist jakarta" vs "best dentists jakarta" depends on the stemming behavior. The plan's `normalize()` only removes stopwords — no stemming. "dentist" and "dentists" are different tokens, which lowers the Jaccard score. The test may be fragile.

**Action:** Either add basic stemming (strip trailing "s") or adjust the test threshold expectation.

### M2. `GeminiEngine` extracts `webSearchQueries` as sources instead of actual source URLs

**Location:** Task 10, gemini-engine.ts (line 1399)

`groundingMetadata?.webSearchQueries` are the search queries Gemini used, not the actual source URLs. The actual grounding sources are in `groundingMetadata?.groundingChunks[].web.uri`.

**Action:** Fix the Gemini adapter to extract from `groundingChunks` for proper URL sources.

### M3. Intelligence analyzers (KeywordAnalyzer, CompetitorAnalyzer, AiAnswerAnalyzer) have no tasks

The file structure lists these files and the spec describes them in detail, but there are no implementation tasks for them. The AgentLoop skeleton has TODO markers for them.

**Action:** These are likely deferred intentionally (skeleton-first approach), but should be noted as follow-up tasks.

### M4. Seed script path uses `tsx` but no `tsx` dependency declared

**Location:** Task 28 (line 3412)

The seed script command uses `tsx prisma/seed-agent.ts` but `tsx` is not listed as a dependency. Verify it's already a dev dependency of `@velo/db`.

---

## Task Ordering & Parallelization

Current ordering is correct for dependencies. Possible parallelization:

- **Tasks 6-10** (geo-monitor) and **Tasks 11-17** (seo-agent) can run in parallel after Task Group 1 completes, since they are independent packages.
- **Tasks 18-21** (API routes) can start as soon as Task Group 1 is done (they only need Prisma models).
- **Tasks 22-26** (UI pages) can start as soon as Tasks 18-21 are done.

---

## Spec Coverage Summary

| Spec Section | Plan Coverage | Notes |
|---|---|---|
| Package Architecture | Fully covered | |
| Data Models | Covered with C2 caveat | `aiModel` added (beneficial) |
| Agent Loop (8 steps) | Skeleton only | Steps are TODO — intentional |
| GEO Monitor Architecture | Fully covered | |
| Tier Gating | Fully covered | |
| Oversight Flow | Partially covered | Missing escalation (I6) |
| Dashboard Routes | Fully covered | |
| Dashboard UI | Missing reports page (I5) | |
| Rate Limiting / Caching | Not covered (I7) | |
| Cron -> Event-Driven Path | Acknowledged, not implemented | Expected for v1 |

---

## What Was Done Well

1. Strong TDD discipline in package tasks (6-17) — every module has tests before implementation.
2. Correct use of `Campaign` (not `SEOCampaign`) matching the actual codebase.
3. Clean separation of concerns across packages (`geo-monitor`, `seo-agent`, `seo-engine`).
4. Thorough tier gate implementation matching the full spec capability matrix.
5. Proper concurrency control with lock TTL and stale run detection.
6. Zod validation on API inputs where present.
