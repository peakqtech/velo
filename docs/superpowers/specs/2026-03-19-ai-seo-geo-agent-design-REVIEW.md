# Design Spec Review: AI SEO & GEO Agent

**Reviewer:** Claude (Senior Code Reviewer)
**Date:** 2026-03-19
**Spec:** `2026-03-19-ai-seo-geo-agent-design.md`

---

## CRITICAL (must fix before implementation)

### C1. ContentPiece requires campaignId -- agent-generated content has no campaign

The existing `ContentPiece` model has a **mandatory** `campaignId` with `onDelete: Cascade`. The spec's `ContentOpportunity` links to `ContentPiece` via `contentPieceId`, but the agent loop generates content _outside_ the campaign workflow. Every agent-produced piece needs a valid `Campaign` row or the FK constraint fails.

**Fix:** Either (a) make `campaignId` optional on `ContentPiece`, or (b) have the agent auto-create a synthetic "Agent Campaign" per site, or (c) add a new `AgentContentPiece` model that does not require a campaign.

### C2. Site model has no relation fields for new models

The `Site` model currently has no relation to `AgentConfig`, `ContentOpportunity`, `GeoSnapshot`, or `GeoScore`. Prisma will reject the schema unless you add the reverse relation fields on `Site`.

**Fix:** Add relation arrays to the `Site` model:
```
agentConfig      AgentConfig?
opportunities    ContentOpportunity[]
geoSnapshots     GeoSnapshot[]
geoScores        GeoScore[]
```

### C3. Spec introduces STARTER tier but existing system has no Tier enum

The `Tier` enum (STARTER, GROWTH, SCALE, ENTERPRISE) is entirely new. There is no existing concept of a pricing tier on `Site` or `User`. The spec says the tier lives on `AgentConfig`, but billing/subscription management (how a site gets assigned a tier, how upgrades work) is completely unaddressed.

**Fix:** Define where tier is the source of truth. If it comes from Stripe/billing, `AgentConfig.tier` should be derived, not manually set. Add a note on tier lifecycle and who/what sets it.

### C4. No `AgentRun` model for tracking run history

The spec mentions "Agent run history (last 10 runs with status, duration, items produced)" in the dashboard and API route `GET /api/sites/[id]/agent/runs`, but there is no `AgentRun` Prisma model. Without it, the API has no data source.

**Fix:** Add an `AgentRun` model:
```prisma
model AgentRun {
  id          String    @id @default(cuid())
  siteId      String
  site        Site      @relation(...)
  status      RunStatus // RUNNING, COMPLETED, FAILED, PARTIAL
  startedAt   DateTime
  finishedAt  DateTime?
  stepsCompleted String[] // which steps ran
  itemsProduced Int     @default(0)
  errorLog    Json?
}
```

---

## IMPORTANT (should fix before building)

### I1. `OpportunityStatus` is missing key states

The spec defines: `DISCOVERED, PLANNED, GENERATING, PUBLISHED, SKIPPED`. Missing:
- **PENDING_APPROVAL** -- needed for VETO_WINDOW and APPROVAL_REQUIRED oversight modes. Currently there is no status between GENERATING and PUBLISHED to represent "waiting for human."
- **APPROVED** -- to distinguish "human said yes" from "auto-published."
- **FAILED** -- the existing `ContentPieceStatus` has FAILED; opportunities should too (distinct from SKIPPED which is intentional).

### I2. Approval queue API mismatch

The API defines `POST /api/sites/[id]/approvals/[aid]` where `aid` is an approval ID, but there is no `Approval` model. It appears approvals are tracked implicitly via `ContentOpportunity.status` + `AgentConfig.oversightMode`. Clarify: is the `[aid]` parameter actually the opportunity ID or the content piece ID?

### I3. Embedding-based deduplication is under-specified

Step 3 (PLAN) says "deduplicate by topic similarity (embedding-based)" but does not specify:
- Which embedding model to use
- Where embeddings are stored (a vector column? a separate table? in-memory only?)
- What similarity threshold constitutes a duplicate
- Whether this requires a vector DB (pgvector) or can work with cosine similarity in application code

This is a meaningful infrastructure decision that affects the DB layer.

### I4. `cadence` field is untyped JSON

`AgentConfig.cadence` is `Json` with a comment example `{ blog: "2/week", gbp: "3/week" }`. This string format ("2/week") has no validation and is awkward to parse programmatically. Consider a structured type:
```prisma
// or a Zod-validated JSON shape:
{ channel: Channel, maxPerPeriod: number, period: "week" | "month" }[]
```

### I5. GeoScore `visibility` and `citationRate` are defined as identical

The spec says: `citationRate = same as visibility (kept separate for future weighting)`. If they are always the same value, storing both is confusing to implementers and dashboard consumers. Either differentiate them now or drop `citationRate` and add it later when the formula diverges.

### I6. No idempotency key or dedup mechanism for the cron endpoint

The spec says steps are idempotent, but `POST /api/cron/agent-loop` has no mechanism to prevent overlapping runs (e.g., if a run takes longer than the cron interval). Need a locking strategy (DB advisory lock, Redis lock, or a simple `AgentRun.status = RUNNING` check).

### I7. `AiModel` type referenced in TierGate but never defined

`TierGate.getAllowedModels()` returns `AiModel[]` but the spec never defines the `AiModel` enum or type. The existing codebase uses `ContentModel` interface. Define the enum: `CLAUDE, OPENAI, GEMINI` at minimum.

---

## MINOR (nice to have)

### M1. Spec references `SEOCampaign` but existing model is just `Campaign`

Line 152 says "Existing `SEOCampaign`... models stay as-is" but the actual Prisma model is named `Campaign`, not `SEOCampaign`. Minor naming inconsistency that could confuse implementers.

### M2. Rate limit config not in AgentConfig

The spec mentions per-engine daily query caps are "configurable in AgentConfig" but the model has no field for this. `geoQueryPrompts` exists but not `geoQueryCaps` or similar.

### M3. No `updatedAt` on ContentOpportunity or GeoSnapshot

Both are append-mostly, but `ContentOpportunity` transitions through statuses. Without `updatedAt`, you cannot query "recently updated opportunities" for the dashboard pipeline view.

### M4. No soft-delete or archive strategy

What happens to old `GeoSnapshot` rows? At 100 queries/week * 4 engines * 52 weeks = ~20K rows/year per client. The spec should note a retention/archival policy.

### M5. Competitor data structure undefined

`AgentConfig.competitors` is `String[]` -- but the `CompetitorAnalyzer` needs to crawl sitemaps/RSS. Are these full URLs? Domain names? What metadata is needed per competitor?

### M6. WhatsApp integration not mentioned

The codebase has a WhatsApp integration package. The spec only mentions email for notifications. WhatsApp could be a notification channel for veto/approval alerts, especially for SMB clients who prefer messaging.

---

## Summary

The spec is well-structured and the architecture (separate orchestrator from engine, provider interfaces, tier gating) is sound. The main risks are **data model gaps** (C1-C4) that will cause schema failures during implementation. The approval workflow needs its status states clarified (I1-I2), and the embedding dedup strategy (I3) requires an infrastructure decision before coding begins. Recommend resolving all CRITICAL items and I1-I3 before starting implementation.
