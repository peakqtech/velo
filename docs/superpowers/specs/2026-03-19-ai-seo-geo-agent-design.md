# AI SEO & GEO Agent — Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Author:** Yohanes + Claude

## Overview

An autonomous AI agent that handles SEO content production and Generative Engine Optimization (GEO) for Velocity platform clients. The agent runs on autopilot (cron-based, architected for event-driven), produces content across 4 channels gated by pricing tier, uses triple-signal intelligence to decide what to write, optimizes content structurally for AI citability, and monitors client visibility in AI-generated answers.

## Goals

1. Automate the full SEO content lifecycle: research → plan → generate → publish → monitor
2. Optimize client content for AI search engines (ChatGPT, Perplexity, Gemini, AI Overviews)
3. Track and report "AI share of voice" per client
4. Gate capabilities by pricing tier (Growth → Scale → Enterprise)
5. Support configurable human oversight (full autopilot → approval gates)

## Non-Goals

- Manual agency services — everything AI-first, human-reviewed
- Gaming AI engines with manipulation techniques — structural optimization only
- Building a standalone GEO SaaS product (yet) — GEO is a feature of the platform
- Real-time event-driven architecture in v1 — cron first, migrate later

---

## Package Architecture

Three new packages plus modifications to existing:

```
packages/infra/seo-agent/        # NEW — the brain (orchestrator)
packages/infra/geo-monitor/      # NEW — AI visibility tracking
packages/infra/seo-engine/       # EXISTING — content gen + publish (minor refactors)
packages/infra/db/               # EXISTING — new Prisma models
apps/dashboard/                  # EXISTING — new API routes + UI pages
```

### `@velo/seo-agent` — Orchestrator

The brain of the system. Owns the intelligence loop (what to write, when, for whom).

- `AgentLoop` — core run cycle: gather → analyze → plan → generate → gate → publish → monitor → report
- `IntelligenceEngine` — merges 3 signals (keyword, competitor, AI-answer) into ranked content opportunities
- `ContentCalendar` — auto-generated schedule, respects tier limits and oversight config
- `OversightGate` — per-client approval flow (auto-publish vs. queue-for-review)
- `TierGate` — enforces which channels/features are available per pricing plan

### `@velo/geo-monitor` — AI Visibility Tracker

Standalone package for tracking how clients appear in AI-generated answers.

- `QueryEngine` — fires industry prompts at AI engines, parses responses
- `CitationDetector` — checks if client business/brand/URL appears in AI answers
- `VisibilityScorer` — calculates "AI share of voice" over time
- `GeoProvider` interface — abstract interface for swapping in third-party APIs later

### `@velo/seo-engine` (existing, stays focused)

No orchestration logic — just a library called by `seo-agent`.

- Content generation (blog, GBP, social, email formatters)
- Publishing pipeline (MDX → GitHub → Vercel)
- Keyword research providers (GSC, SerpAPI)

---

## Data Models

### New Prisma Models

```prisma
model AgentConfig {
  id              String         @id @default(cuid())
  siteId          String         @unique
  site            Site           @relation(fields: [siteId], references: [id])
  tier            Tier
  oversightMode   OversightMode
  vetoWindowHours Int?           @default(24)
  channels        Channel[]
  cadence         Json           // per-channel frequency, e.g. { blog: "2/week", gbp: "3/week" }
  competitors     String[]
  verticalKeywords String[]
  geoEnabled      Boolean        @default(false)
  geoQueryPrompts String[]
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model ContentOpportunity {
  id              String              @id @default(cuid())
  siteId          String
  site            Site                @relation(fields: [siteId], references: [id])
  signal          Signal
  keyword         String
  title           String?
  score           Float               // priority score (0-100)
  channel         Channel
  status          OpportunityStatus
  contentPieceId  String?
  contentPiece    ContentPiece?       @relation(fields: [contentPieceId], references: [id])
  metadata        Json?               // signal-specific data
  createdAt       DateTime            @default(now())
}

model GeoSnapshot {
  id              String       @id @default(cuid())
  siteId          String
  site            Site         @relation(fields: [siteId], references: [id])
  engine          AiEngine
  query           String
  response        String       // raw AI response (truncated/hashed for storage)
  cited           Boolean
  citationType    CitationType?
  position        Int?
  competitors     Json?
  createdAt       DateTime     @default(now())
}

model GeoScore {
  id              String   @id @default(cuid())
  siteId          String
  site            Site     @relation(fields: [siteId], references: [id])
  engine          AiEngine
  period          DateTime // weekly rollup date
  visibility      Float    // 0-100 score
  citationRate    Float
  avgPosition     Float?
  topQueries      Json
  createdAt       DateTime @default(now())

  @@unique([siteId, engine, period])
}

enum Tier { STARTER GROWTH SCALE ENTERPRISE }
enum OversightMode { AUTO_PUBLISH VETO_WINDOW APPROVAL_REQUIRED }
enum Channel { BLOG GBP SOCIAL EMAIL }
enum Signal { KEYWORD_GAP COMPETITOR AI_ANSWER }
enum OpportunityStatus { DISCOVERED PLANNED GENERATING PUBLISHED SKIPPED }
enum AiEngine { CHATGPT PERPLEXITY GEMINI AI_OVERVIEW }
enum CitationType { NAMED LINKED RECOMMENDED ABSENT }
```

### Key Relationships

- `AgentConfig` is 1:1 with `Site` — each client site has one agent configuration
- `ContentOpportunity` bridges intelligence → content — tracks the journey from discovery to published piece
- `GeoSnapshot` stores raw AI monitoring results (individual queries)
- `GeoScore` aggregates into weekly visibility scores per engine
- Existing `ContentPiece`, `SEOCampaign`, and `Site` models stay as-is

---

## Agent Loop

The core cycle runs on cron (initially daily, configurable per client).

```
GATHER → ANALYZE → PLAN → GENERATE → GATE → PUBLISH → MONITOR → REPORT
```

### Step 1 — GATHER (data collection)

- Pull latest GSC data (impressions, clicks, keyword positions)
- Crawl competitor sitemaps/RSS for new content
- Run GEO monitor queries against AI engines
- Fetch any pending approval decisions from dashboard

### Step 2 — ANALYZE (intelligence engine)

Three analyzers run in parallel, each producing scored opportunities:

| Analyzer | Input | Output |
|----------|-------|--------|
| `KeywordAnalyzer` | GSC data + SerpAPI | Keyword gaps with search volume + difficulty |
| `CompetitorAnalyzer` | Competitor new content | Topics competitors cover that client doesn't |
| `AiAnswerAnalyzer` | GEO snapshots | Questions where client is absent but should appear |

### Step 3 — PLAN (content calendar)

- Merge all opportunities, deduplicate by topic similarity (embedding-based)
- Score: `weight = (searchVolume × 0.3) + (competitorUrgency × 0.3) + (aiCitationPotential × 0.4)`
- GEO-weighted scoring — AI citation potential gets the highest weight
- Apply tier gate: filter to allowed channels only
- Apply cadence limits per tier
- Write `ContentOpportunity` records with status `PLANNED`

### Step 4 — GENERATE (content creation)

- For each planned opportunity, call `@velo/seo-engine` to generate content
- Pass GEO optimization hints: FAQ schema, structured answer paragraphs, JSON-LD entities
- Multi-model: use the AI model configured for the site (default Claude, fallback OpenAI/Gemini)
- Update opportunity status `GENERATING` → link to `ContentPiece`

### Step 5 — GATE (oversight)

Based on `AgentConfig.oversightMode`:

- **AUTO_PUBLISH** → straight to publish
- **VETO_WINDOW** → set publish time = now + vetoWindowHours, notify via dashboard + email. If vetoed, mark `SKIPPED`
- **APPROVAL_REQUIRED** → queue in dashboard, wait for explicit approval

Escalation: approval queue exceeds 10 items → reminder email. After 7 days unactioned → auto-skip and log.

### Step 6 — PUBLISH (existing pipeline)

Uses `seo-engine` publish pipeline per channel:

- Blog → MDX → GitHub commit → Vercel deploy
- GBP → Google Business Profile API
- Social → platform APIs (buffer/direct)
- Email → email service provider API

### Step 7 — MONITOR (GEO tracking)

- Run GEO queries for recently published content
- Compare against previous `GeoSnapshot` for the same queries
- Calculate delta in visibility scores
- Store new `GeoSnapshot` + weekly `GeoScore` rollup

### Step 8 — REPORT (notifications)

- Generate per-client summary: content published, visibility changes, opportunities in pipeline
- Push to dashboard activity feed
- Email digest (configurable frequency)

### Error Handling

Each step is idempotent. If the agent crashes mid-loop, it picks up from the last uncommitted step on next run. Failed generations retry once, then mark opportunity as `SKIPPED` with error metadata.

### Cron → Event-Driven Migration Path

Each step is a discrete function. Moving to event-driven means replacing the linear cron trigger with a job queue where each step emits an event that triggers the next. No internal logic changes needed.

---

## GEO Monitor Architecture

### Core Interface

```typescript
interface GeoProvider {
  query(prompt: string, engine: AiEngine): Promise<AiResponse>
  detectCitation(response: AiResponse, client: ClientEntity): CitationResult
}

interface AiResponse {
  engine: AiEngine
  query: string
  rawText: string
  sources: string[]
  entitiesMentioned: string[]
  timestamp: Date
}

interface CitationResult {
  cited: boolean
  type: CitationType
  position: number | null
  context: string
  competitors: string[]
}

interface ClientEntity {
  businessName: string
  domain: string
  aliases: string[]
  phone?: string
  address?: string
}
```

### Built-in Provider (`InternalGeoProvider`)

**Engine integration:**

- **ChatGPT** — OpenAI API with web browsing enabled
- **Perplexity** — Perplexity API (returns sources natively)
- **Gemini** — Google Gemini API with grounding enabled
- **AI Overviews** — SerpAPI's AI Overview extraction from Google search results

**Query strategy:**

- Each client has `geoQueryPrompts` — seed prompts based on their vertical
- Agent auto-expands seeds into variants: location modifiers, service-specific, comparison queries
- Staggered schedule to avoid rate limits:
  - Monday: ChatGPT + Perplexity (50% of queries each)
  - Wednesday: Gemini + AI Overviews (50% of queries each)
  - Friday: Full sweep — all engines, all queries

### Citation Detection

- Fuzzy name matching (handles variants like "PeakQ", "Peak Q", "peakq.tech")
- URL matching against client domain + known subdomains
- Entity extraction from AI response text using regex + keyword proximity
- Position detection for ranked lists

### Visibility Scoring

```
Weekly GeoScore per engine:
  visibility   = (citedQueries / totalQueries) × 100
  citationRate = same as visibility (kept separate for future weighting)
  avgPosition  = mean position when cited in ranked lists
  trend        = delta vs. previous week
```

### Rate Limiting & Cost Control

- Per-engine daily query caps (configurable in `AgentConfig`)
- Default: 20 queries/engine/week (Growth), 50 (Scale), 100 (Enterprise)
- Estimated API cost: ~$0.01-0.05 per query
- Cached responses — same query within 24h returns cached result

---

## Tier Gating

### Capabilities Matrix

| Capability | Starter | Growth | Scale | Enterprise |
|---|---|---|---|---|
| Static site + CMS | Yes | Yes | Yes | Yes |
| Agent active | No | Yes | Yes | Yes |
| Blog autopilot | — | 2/week | 5/week | Unlimited |
| GBP autopilot | — | 3/week | 5/week | Unlimited |
| Social autopilot | — | — | 5/week | Unlimited |
| Email autopilot | — | — | 2/month | Unlimited |
| Keyword intelligence | — | GSC only | GSC + SerpAPI + Competitor | Full triple-signal |
| GEO monitoring | — | — | 50 queries/wk | 100 queries/wk |
| GEO content optimization | — | Basic (JSON-LD) | Full (JSON-LD + FAQ + entity) | Full + custom schema |
| Oversight modes | — | Auto or Veto | All 3 | All 3 + custom workflows |
| AI models | — | Claude only | Claude + fallback | Choice of model |
| Competitor monitoring | — | — | 3 competitors | 10 competitors |
| Reporting | — | Weekly email | Weekly + dashboard | Real-time + BI export |

### TierGate Implementation

```typescript
class TierGate {
  constructor(private config: AgentConfig) {}

  canUseChannel(channel: Channel): boolean
  getChannelLimit(channel: Channel): { max: number; period: 'week' | 'month' }
  getGeoQueryBudget(): number
  getCompetitorLimit(): number
  getAllowedModels(): AiModel[]
  getAllowedOversightModes(): OversightMode[]
  getGeoOptimizationLevel(): 'none' | 'basic' | 'full' | 'custom'
}
```

Checked at every decision point in the agent loop. Reads from `AgentConfig.tier` — the tier is the single source of truth.

### Oversight Flow

```
Content generated
       │
  ┌────┴────┬──────────────┐
  ▼         ▼              ▼
AUTO     VETO_WINDOW    APPROVAL
  │         │              │
  │    Set timer        Queue in
  │    (24h default)    dashboard
  │         │              │
  │    No veto?      Human approves
  │         │              │
  ▼         ▼              ▼
        P U B L I S H
```

- Veto notifications: dashboard + email with content preview and one-click veto link
- Approval queue: full content preview, edit capability, approve/reject/edit-and-approve
- Escalation: queue > 10 items → reminder email. 7 days unactioned → auto-skip and log

---

## Dashboard UI

### New Routes

| Route | Purpose |
|---|---|
| `/seo/[siteId]/agent` | Agent control center (config, status, toggle) |
| `/seo/[siteId]/opportunities` | Content opportunity pipeline |
| `/seo/[siteId]/geo` | GEO visibility dashboard |
| `/seo/[siteId]/approvals` | Approval queue |
| `/seo/[siteId]/reports` | Performance reports (SEO + GEO combined) |

### Modified Routes

| Route | Changes |
|---|---|
| `/seo` | Add agent status badges per site, GEO score sparklines |
| `/seo/[siteId]/campaigns` | Link campaigns to opportunities, show signal source |
| `/seo/[siteId]/content` | Add GEO optimization indicators on each content piece |

### Agent Control Center (`/seo/[siteId]/agent`)

- Toggle agent on/off
- Tier display (current plan, upgrade CTA)
- Channel toggles with cadence settings
- Oversight mode selector
- Competitor URLs management
- Seed keyword management
- GEO query prompts editor
- AI model preference
- Agent run history (last 10 runs with status, duration, items produced)

### Opportunity Pipeline (`/seo/[siteId]/opportunities`)

- Kanban board: Discovered → Planned → Generating → Published / Skipped
- Cards: title, keyword, signal source badge, score, target channel
- Filter by signal type, channel, date range
- Click through to content piece once generated

### GEO Dashboard (`/seo/[siteId]/geo`)

- Hero metric: Overall AI Visibility Score (0-100) with trend arrow
- Engine breakdown: 4 cards (ChatGPT, Perplexity, Gemini, AI Overviews) with score + sparkline
- Citation map: query table with engine, cited status, position, competitors
- Competitor comparison: bar chart — your visibility vs. top 3 competitors
- Content attribution: which published pieces improved AI visibility
- Trend chart: weekly visibility over time per engine (line chart)

### Approval Queue (`/seo/[siteId]/approvals`)

- Pending content list with full preview, target channel, signal source, opportunity score
- Actions: Approve / Edit & Approve / Reject / Snooze
- VETO_WINDOW: countdown timer before auto-publish
- Batch actions: approve all, reject all

### SEO Hub Modifications (`/seo`)

Per-site row additions:
- Agent status badge (active/paused/error)
- Content produced this week
- GEO visibility score (Scale+ tiers only)
- Next scheduled run
- Pending approvals count

### API Routes

```
POST   /api/sites/[id]/agent/config        — Create/update agent config
GET    /api/sites/[id]/agent/config        — Get agent config
POST   /api/sites/[id]/agent/toggle        — Start/stop agent
GET    /api/sites/[id]/agent/runs          — Run history
GET    /api/sites/[id]/opportunities       — List opportunities (filterable)
PATCH  /api/sites/[id]/opportunities/[oid] — Update opportunity (skip, re-plan)
GET    /api/sites/[id]/geo/scores          — Visibility scores over time
GET    /api/sites/[id]/geo/snapshots       — Individual query results
GET    /api/sites/[id]/approvals           — Pending approvals
POST   /api/sites/[id]/approvals/[aid]     — Approve/reject/veto
POST   /api/cron/agent-loop                — Cron trigger endpoint (secured)
```

---

## Technical Decisions

1. **Cron-first, event-driven later** — Each agent loop step is a discrete, idempotent function. Migration to event-driven only changes the trigger mechanism.
2. **GEO provider interface** — Abstract `GeoProvider` allows swapping in third-party APIs (Profound, Otterly, Peec AI) without changing agent logic.
3. **Embedding-based deduplication** — Content opportunities are deduplicated by topic similarity to prevent generating overlapping content from different signals.
4. **GEO-weighted scoring** — AI citation potential weighted at 0.4 (highest) in the opportunity scoring formula, reflecting the platform's differentiator.
5. **Multi-model support** — Tier-gated model selection. Default Claude, with OpenAI/Gemini as fallbacks or choices for Enterprise.
6. **Structural GEO optimization only** — JSON-LD, FAQ schema, clear answer paragraphs, entity markup. No manipulation techniques.
