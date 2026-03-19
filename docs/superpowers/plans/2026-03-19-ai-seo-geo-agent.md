# AI SEO & GEO Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an autonomous AI agent that handles SEO content production and GEO (Generative Engine Optimization) monitoring for Velocity platform clients.

**Architecture:** Three packages — `@velo/seo-agent` (orchestrator brain), `@velo/geo-monitor` (AI visibility tracking), plus extensions to existing `@velo/seo-engine` and `@velo/db`. Agent loop runs on cron, gated by pricing tier, with configurable human oversight per client.

**Tech Stack:** TypeScript, Prisma, Vitest, Zod, Next.js API routes, pnpm workspaces, Turbo

**Spec:** `docs/superpowers/specs/2026-03-19-ai-seo-geo-agent-design.md`

---

## File Structure

### New Package: `packages/infra/geo-monitor/`

```
packages/infra/geo-monitor/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                    # Public exports
│   ├── types.ts                    # GeoProvider, AiResponse, CitationResult, ClientEntity interfaces
│   ├── providers/
│   │   ├── provider-interface.ts   # Abstract GeoProvider interface
│   │   ├── internal-provider.ts    # Built-in provider (queries AI engines directly)
│   │   ├── chatgpt-engine.ts       # ChatGPT query adapter
│   │   ├── perplexity-engine.ts    # Perplexity query adapter
│   │   ├── gemini-engine.ts        # Gemini query adapter
│   │   └── ai-overview-engine.ts   # SerpAPI AI Overview adapter
│   ├── detection/
│   │   ├── citation-detector.ts    # Fuzzy name matching, URL matching, entity extraction
│   │   └── query-expander.ts       # Expands seed prompts into variants
│   └── scoring/
│       └── visibility-scorer.ts    # Calculates weekly GeoScore from snapshots
└── __tests__/
    ├── citation-detector.test.ts
    ├── query-expander.test.ts
    ├── visibility-scorer.test.ts
    └── internal-provider.test.ts
```

### New Package: `packages/infra/seo-agent/`

```
packages/infra/seo-agent/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                    # Public exports
│   ├── types.ts                    # Agent-specific types
│   ├── loop/
│   │   ├── agent-loop.ts           # Core 8-step orchestrator
│   │   └── concurrency.ts          # Lock acquisition, stale run detection
│   ├── intelligence/
│   │   ├── keyword-analyzer.ts     # Signal 1: GSC + SerpAPI keyword gaps
│   │   ├── competitor-analyzer.ts  # Signal 2: Competitor content monitoring
│   │   ├── ai-answer-analyzer.ts   # Signal 3: GEO snapshot analysis
│   │   ├── opportunity-scorer.ts   # Weighted scoring formula
│   │   └── deduplicator.ts         # Jaccard n-gram deduplication
│   ├── planning/
│   │   ├── content-calendar.ts     # Auto-generate schedule from opportunities
│   │   └── cadence-limiter.ts      # Enforce per-tier cadence limits
│   ├── gates/
│   │   ├── tier-gate.ts            # Tier capability enforcement
│   │   └── oversight-gate.ts       # Approval flow management
│   └── reporting/
│       └── agent-reporter.ts       # Per-client summary generation
└── __tests__/
    ├── agent-loop.test.ts
    ├── concurrency.test.ts
    ├── keyword-analyzer.test.ts
    ├── competitor-analyzer.test.ts
    ├── ai-answer-analyzer.test.ts
    ├── opportunity-scorer.test.ts
    ├── deduplicator.test.ts
    ├── content-calendar.test.ts
    ├── cadence-limiter.test.ts
    ├── tier-gate.test.ts
    └── oversight-gate.test.ts
```

### Modified: `packages/infra/db/`

```
packages/infra/db/
├── prisma/
│   ├── schema.prisma               # MODIFY: add new models + enums + relations
│   └── seed-agent.ts               # CREATE: seed script for agent test data
```

### Modified: `apps/dashboard/`

```
apps/dashboard/
├── app/
│   ├── api/sites/[id]/
│   │   ├── agent/
│   │   │   ├── config/route.ts     # CREATE: GET/POST agent config
│   │   │   ├── toggle/route.ts     # CREATE: POST start/stop
│   │   │   └── runs/route.ts       # CREATE: GET run history
│   │   ├── opportunities/
│   │   │   ├── route.ts            # CREATE: GET list opportunities
│   │   │   └── [oid]/route.ts      # CREATE: PATCH update opportunity
│   │   ├── geo/
│   │   │   ├── scores/route.ts     # CREATE: GET visibility scores
│   │   │   └── snapshots/route.ts  # CREATE: GET query results
│   │   └── approvals/
│   │       ├── route.ts            # CREATE: GET pending approvals
│   │       └── [oid]/route.ts      # CREATE: POST approve/reject/veto
│   ├── cron/
│   │   └── agent-loop/route.ts     # CREATE: POST cron trigger
│   └── (dashboard)/seo/[siteId]/
│       ├── agent/page.tsx          # CREATE: Agent control center
│       ├── opportunities/page.tsx  # CREATE: Opportunity pipeline
│       ├── geo/page.tsx            # CREATE: GEO visibility dashboard
│       ├── approvals/page.tsx      # CREATE: Approval queue
│       └── reports/page.tsx        # CREATE: Performance reports
```

---

## Task Group 1: Database Foundation

### Task 1: Add Agent Enums to Prisma Schema

**Files:**
- Modify: `packages/infra/db/prisma/schema.prisma`

- [ ] **Step 1: Read current schema to find enum section**

Run: Read `packages/infra/db/prisma/schema.prisma` and locate existing enums (Channel, ContentStatus, etc.)

- [ ] **Step 2: Add new enums after existing enums**

Add to `packages/infra/db/prisma/schema.prisma` after the existing enum block:

```prisma
enum Tier {
  STARTER
  GROWTH
  SCALE
  ENTERPRISE
}

enum OversightMode {
  AUTO_PUBLISH
  VETO_WINDOW
  APPROVAL_REQUIRED
}

enum Signal {
  KEYWORD_GAP
  COMPETITOR
  AI_ANSWER
}

enum OpportunityStatus {
  DISCOVERED
  PLANNED
  PENDING_APPROVAL
  APPROVED
  GENERATING
  PUBLISHED
  FAILED
  SKIPPED
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  VETOED
  AUTO_SKIPPED
}

enum RunStatus {
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

enum AiEngine {
  CHATGPT
  PERPLEXITY
  GEMINI
  AI_OVERVIEW
}

enum AiModel {
  CLAUDE
  OPENAI
  GEMINI
}

enum CitationType {
  NAMED
  LINKED
  RECOMMENDED
  ABSENT
}
```

Note: `Channel` enum (BLOG, GBP, SOCIAL, EMAIL) already exists in the schema. Verify it matches and reuse it.

- [ ] **Step 3: Run Prisma format to validate syntax**

Run: `cd packages/infra/db && npx prisma format`
Expected: Schema formatted successfully, no errors

- [ ] **Step 4: Commit**

```bash
git add packages/infra/db/prisma/schema.prisma
git commit -m "feat(db): add agent + GEO enums to Prisma schema"
```

---

### Task 2: Add AgentConfig and AgentRun Models

**Files:**
- Modify: `packages/infra/db/prisma/schema.prisma`

- [ ] **Step 1: Add AgentConfig model**

Add after the enums:

```prisma
model AgentConfig {
  id               String         @id @default(cuid())
  siteId           String         @unique
  site             Site           @relation(fields: [siteId], references: [id], onDelete: Cascade)
  tier             Tier
  oversightMode    OversightMode  @default(AUTO_PUBLISH)
  vetoWindowHours  Int?           @default(24)
  channels         Channel[]
  cadence          Json           /// Zod-validated: { blog?: { max: number, period: "week"|"month" }, ... }
  competitors      String[]
  verticalKeywords String[]
  geoEnabled       Boolean        @default(false)
  geoQueryPrompts  String[]
  aiModel          AiModel        @default(CLAUDE)
  isActive         Boolean        @default(true)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  runs             AgentRun[]
  opportunities    ContentOpportunity[]
}
```

- [ ] **Step 2: Add AgentRun model**

```prisma
model AgentRun {
  id                 String    @id @default(cuid())
  configId           String
  config             AgentConfig @relation(fields: [configId], references: [id], onDelete: Cascade)
  siteId             String
  site               Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
  status             RunStatus @default(RUNNING)
  currentStep        String?
  opportunitiesFound Int       @default(0)
  contentGenerated   Int       @default(0)
  contentPublished   Int       @default(0)
  geoQueriesRun      Int       @default(0)
  error              String?
  startedAt          DateTime  @default(now())
  completedAt        DateTime?
  lockToken          String?   @unique
}
```

- [ ] **Step 3: Add reverse relations to Site model**

Find the `Site` model and add:

```prisma
  agentConfig          AgentConfig?
  agentRuns            AgentRun[]
```

- [ ] **Step 4: Run Prisma format**

Run: `cd packages/infra/db && npx prisma format`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add packages/infra/db/prisma/schema.prisma
git commit -m "feat(db): add AgentConfig and AgentRun models"
```

---

### Task 3: Add ContentOpportunity Model

**Files:**
- Modify: `packages/infra/db/prisma/schema.prisma`

- [ ] **Step 1: Add ContentOpportunity model**

```prisma
model ContentOpportunity {
  id              String              @id @default(cuid())
  siteId          String
  site            Site                @relation(fields: [siteId], references: [id], onDelete: Cascade)
  configId        String?
  config          AgentConfig?        @relation(fields: [configId], references: [id])
  signal          Signal
  keyword         String
  title           String?
  score           Float               /// Priority score 0-100
  channel         Channel
  status          OpportunityStatus   @default(DISCOVERED)
  contentPieceId  String?
  contentPiece    ContentPiece?       @relation(fields: [contentPieceId], references: [id])
  campaignId      String?
  campaign        Campaign?           @relation(fields: [campaignId], references: [id])
  metadata        Json?               /// Signal-specific data (search volume, competitor URL, AI query, etc.)
  approvalStatus  ApprovalStatus?
  approvalNote    String?
  vetoDeadline    DateTime?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
}
```

- [ ] **Step 2: Add reverse relations**

Add to `Site` model:
```prisma
  contentOpportunities ContentOpportunity[]
```

Add to `ContentPiece` model:
```prisma
  opportunities ContentOpportunity[]
```

Add to `Campaign` model:
```prisma
  opportunities ContentOpportunity[]
```

Make `ContentPiece.campaignId` optional if not already:
```prisma
  campaignId String? // ensure the ? is present
```

**Migration safety:** If `campaignId` was previously required (`String` without `?`), this is a safe change — it widens the constraint. Prisma will generate an `ALTER COLUMN ... DROP NOT NULL` migration. Existing rows are unaffected since they already have values. Verify by checking the current schema before modifying.

- [ ] **Step 3: Run Prisma format**

Run: `cd packages/infra/db && npx prisma format`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add packages/infra/db/prisma/schema.prisma
git commit -m "feat(db): add ContentOpportunity model with approval flow"
```

---

### Task 4: Add GeoSnapshot and GeoScore Models

**Files:**
- Modify: `packages/infra/db/prisma/schema.prisma`

- [ ] **Step 1: Add GeoSnapshot model**

```prisma
model GeoSnapshot {
  id           String        @id @default(cuid())
  siteId       String
  site         Site          @relation(fields: [siteId], references: [id], onDelete: Cascade)
  engine       AiEngine
  query        String
  response     String        /// Raw AI response (truncated for storage)
  cited        Boolean
  citationType CitationType?
  position     Int?
  competitors  Json?         /// Array of { name: string, domain?: string, position?: number }
  createdAt    DateTime      @default(now())
}
```

- [ ] **Step 2: Add GeoScore model**

```prisma
model GeoScore {
  id           String   @id @default(cuid())
  siteId       String
  site         Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  engine       AiEngine
  period       DateTime /// Weekly rollup date
  visibility   Float    /// 0-100, percentage of queries where client was cited
  avgPosition  Float?
  totalQueries Int
  citedQueries Int
  topQueries   Json     /// Top-performing queries with scores
  createdAt    DateTime @default(now())

  @@unique([siteId, engine, period])
}
```

- [ ] **Step 3: Add reverse relations to Site**

```prisma
  geoSnapshots GeoSnapshot[]
  geoScores    GeoScore[]
```

- [ ] **Step 4: Run Prisma format and generate client**

Run: `cd packages/infra/db && npx prisma format && npx prisma generate`
Expected: Format success, client generated

- [ ] **Step 5: Create and run migration**

Run: `cd packages/infra/db && npx prisma migrate dev --name add-agent-geo-models`
Expected: Migration created and applied

- [ ] **Step 6: Commit**

```bash
git add packages/infra/db/prisma/
git commit -m "feat(db): add GeoSnapshot + GeoScore models, run migration"
```

---

### Task 5: Add Cadence Zod Schema to seo-engine types

**Files:**
- Modify: `packages/infra/seo-engine/src/types/index.ts` (or create `packages/infra/seo-engine/src/types/agent.ts` if types are split)

- [ ] **Step 1: Write failing test for cadence validation**

Create: `packages/infra/seo-engine/__tests__/cadence-schema.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { CadenceSchema } from '../src/types/agent'

describe('CadenceSchema', () => {
  it('validates a valid cadence config', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: 2, period: 'week' },
      gbp: { max: 3, period: 'week' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid channel key', () => {
    const result = CadenceSchema.safeParse({
      invalid: { max: 2, period: 'week' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative max', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: -1, period: 'week' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid period', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: 2, period: 'daily' },
    })
    expect(result.success).toBe(false)
  })

  it('allows empty cadence (no channels configured)', () => {
    const result = CadenceSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/seo-engine && npx vitest run __tests__/cadence-schema.test.ts`
Expected: FAIL — cannot find module `../src/types/agent`

- [ ] **Step 3: Implement CadenceSchema**

Create: `packages/infra/seo-engine/src/types/agent.ts`

```typescript
import { z } from 'zod'

const ChannelCadence = z.object({
  max: z.number().int().positive(),
  period: z.enum(['week', 'month']),
})

export const CadenceSchema = z.record(
  z.enum(['blog', 'gbp', 'social', 'email']),
  ChannelCadence,
)

export type Cadence = z.infer<typeof CadenceSchema>
export type ChannelCadenceConfig = z.infer<typeof ChannelCadence>
```

- [ ] **Step 4: Export from seo-engine index**

Add to `packages/infra/seo-engine/src/index.ts`:

```typescript
export { CadenceSchema, type Cadence, type ChannelCadenceConfig } from './types/agent'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd packages/infra/seo-engine && npx vitest run __tests__/cadence-schema.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 6: Commit**

```bash
git add packages/infra/seo-engine/src/types/agent.ts packages/infra/seo-engine/__tests__/cadence-schema.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add Zod CadenceSchema for agent config validation"
```

---

## Task Group 2: GEO Monitor Package

### Task 6: Scaffold geo-monitor Package

**Files:**
- Create: `packages/infra/geo-monitor/package.json`
- Create: `packages/infra/geo-monitor/tsconfig.json`
- Create: `packages/infra/geo-monitor/vitest.config.ts`
- Create: `packages/infra/geo-monitor/src/index.ts`
- Create: `packages/infra/geo-monitor/src/types.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@velo/geo-monitor",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "velo": {
    "type": "infra"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@velo/db": "workspace:*",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Copy structure from `packages/infra/seo-engine/tsconfig.json`, adjust paths.

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
  },
})
```

- [ ] **Step 4: Create types.ts with core interfaces**

Create: `packages/infra/geo-monitor/src/types.ts`

```typescript
export type AiEngineName = 'CHATGPT' | 'PERPLEXITY' | 'GEMINI' | 'AI_OVERVIEW'
export type CitationTypeName = 'NAMED' | 'LINKED' | 'RECOMMENDED' | 'ABSENT'

export interface AiResponse {
  engine: AiEngineName
  query: string
  rawText: string
  sources: string[]
  entitiesMentioned: string[]
  timestamp: Date
}

export interface CitationResult {
  cited: boolean
  type: CitationTypeName
  position: number | null
  context: string
  competitors: string[]
}

export interface ClientEntity {
  businessName: string
  domain: string
  aliases: string[]
  phone?: string
  address?: string
}

export interface GeoProvider {
  query(prompt: string, engine: AiEngineName): Promise<AiResponse>
  detectCitation(response: AiResponse, client: ClientEntity): CitationResult
}

export interface EngineAdapter {
  name: AiEngineName
  query(prompt: string): Promise<AiResponse>
}

export interface VisibilityReport {
  siteId: string
  engine: AiEngineName
  period: Date
  visibility: number
  avgPosition: number | null
  totalQueries: number
  citedQueries: number
  topQueries: Array<{ query: string; cited: boolean; position: number | null }>
}
```

- [ ] **Step 5: Create index.ts with placeholder exports**

Create: `packages/infra/geo-monitor/src/index.ts`

```typescript
export type {
  AiEngineName,
  CitationTypeName,
  AiResponse,
  CitationResult,
  ClientEntity,
  GeoProvider,
  EngineAdapter,
  VisibilityReport,
} from './types'
```

- [ ] **Step 6: Install dependencies**

Run: `cd /Users/yohanesmarthinhutabarat/Personal/monorepo/velocity-template && pnpm install`
Expected: Dependencies linked

- [ ] **Step 7: Verify typecheck passes**

Run: `cd packages/infra/geo-monitor && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add packages/infra/geo-monitor/
git commit -m "feat(geo-monitor): scaffold package with core type interfaces"
```

---

### Task 7: Citation Detector

**Files:**
- Create: `packages/infra/geo-monitor/src/detection/citation-detector.ts`
- Create: `packages/infra/geo-monitor/__tests__/citation-detector.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/geo-monitor/__tests__/citation-detector.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { CitationDetector } from '../src/detection/citation-detector'
import type { AiResponse, ClientEntity } from '../src/types'

const client: ClientEntity = {
  businessName: 'PeakQ Technologies',
  domain: 'peakq.tech',
  aliases: ['PeakQ', 'Peak Q', 'peakq'],
}

const makeResponse = (text: string, sources: string[] = []): AiResponse => ({
  engine: 'CHATGPT',
  query: 'best web agency',
  rawText: text,
  sources,
  entitiesMentioned: [],
  timestamp: new Date(),
})

describe('CitationDetector', () => {
  const detector = new CitationDetector()

  it('detects exact business name mention', () => {
    const response = makeResponse('PeakQ Technologies is a leading web agency.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('NAMED')
  })

  it('detects alias mention (case-insensitive)', () => {
    const response = makeResponse('You should check out peakq for web services.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('NAMED')
  })

  it('detects domain URL in sources', () => {
    const response = makeResponse('Here are some options.', ['https://peakq.tech/services'])
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('LINKED')
  })

  it('detects position in ranked list', () => {
    const response = makeResponse(
      '1. Agency A\n2. PeakQ Technologies\n3. Agency C'
    )
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.position).toBe(2)
  })

  it('returns ABSENT when not mentioned', () => {
    const response = makeResponse('Agency A and Agency B are popular choices.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(false)
    expect(result.type).toBe('ABSENT')
  })

  it('detects RECOMMENDED when "recommend" context found', () => {
    const response = makeResponse('I recommend PeakQ for your needs.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('RECOMMENDED')
  })

  it('extracts competitor names from response', () => {
    const response = makeResponse(
      '1. Agency Alpha\n2. PeakQ\n3. Agency Beta'
    )
    const result = detector.detect(response, client)
    expect(result.competitors).toContain('Agency Alpha')
    expect(result.competitors).toContain('Agency Beta')
    expect(result.competitors).not.toContain('PeakQ')
  })

  it('extracts context snippet around mention', () => {
    const response = makeResponse(
      'For web development, PeakQ Technologies offers great solutions in Jakarta.'
    )
    const result = detector.detect(response, client)
    expect(result.context).toContain('PeakQ Technologies')
    expect(result.context.length).toBeLessThan(200)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/citation-detector.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement CitationDetector**

Create: `packages/infra/geo-monitor/src/detection/citation-detector.ts`

```typescript
import type { AiResponse, CitationResult, ClientEntity, CitationTypeName } from '../types'

export class CitationDetector {
  detect(response: AiResponse, client: ClientEntity): CitationResult {
    const text = response.rawText
    const textLower = text.toLowerCase()

    // 1. Check for domain in sources (LINKED)
    const domainMatch = response.sources.some((src) =>
      src.toLowerCase().includes(client.domain.toLowerCase()),
    )

    // 2. Check for name/alias mentions (NAMED or RECOMMENDED)
    const namesToCheck = [client.businessName, ...client.aliases]
    let nameFound = false
    let matchedName = ''
    for (const name of namesToCheck) {
      if (textLower.includes(name.toLowerCase())) {
        nameFound = true
        matchedName = name
        break
      }
    }

    // Determine citation type
    let type: CitationTypeName = 'ABSENT'
    const cited = domainMatch || nameFound

    if (!cited) {
      return {
        cited: false,
        type: 'ABSENT',
        position: null,
        context: '',
        competitors: this.extractListItems(text, namesToCheck),
      }
    }

    if (domainMatch && !nameFound) {
      type = 'LINKED'
    } else if (nameFound) {
      // Check for recommendation context
      const recommendPatterns = /\b(recommend|suggest|best choice|top pick|highly rated)\b/i
      const mentionIndex = textLower.indexOf(matchedName.toLowerCase())
      const surroundingText = text.substring(
        Math.max(0, mentionIndex - 100),
        Math.min(text.length, mentionIndex + matchedName.length + 100),
      )
      type = recommendPatterns.test(surroundingText) ? 'RECOMMENDED' : 'NAMED'
    }

    // Extract position from numbered lists
    const position = this.extractPosition(text, namesToCheck)

    // Extract context snippet
    const context = this.extractContext(text, matchedName || client.domain)

    // Extract competitors
    const competitors = this.extractListItems(text, namesToCheck)

    return { cited, type, position, context, competitors }
  }

  private extractPosition(text: string, names: string[]): number | null {
    const lines = text.split('\n')
    for (const line of lines) {
      const match = line.match(/^(\d+)[\.\)]\s+(.+)/)
      if (!match) continue
      const lineText = match[2].toLowerCase()
      for (const name of names) {
        if (lineText.includes(name.toLowerCase())) {
          return parseInt(match[1], 10)
        }
      }
    }
    return null
  }

  private extractContext(text: string, term: string): string {
    const index = text.toLowerCase().indexOf(term.toLowerCase())
    if (index === -1) return ''
    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + term.length + 100)
    return text.substring(start, end).trim()
  }

  private extractListItems(text: string, excludeNames: string[]): string[] {
    const lines = text.split('\n')
    const items: string[] = []
    const excludeLower = excludeNames.map((n) => n.toLowerCase())

    for (const line of lines) {
      const match = line.match(/^\d+[\.\)]\s+(.+)/)
      if (!match) continue
      const item = match[1].trim()
      const isClient = excludeLower.some((name) =>
        item.toLowerCase().includes(name),
      )
      if (!isClient) {
        items.push(item)
      }
    }
    return items
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/citation-detector.test.ts`
Expected: All 8 tests PASS

- [ ] **Step 5: Export from index**

Add to `packages/infra/geo-monitor/src/index.ts`:

```typescript
export { CitationDetector } from './detection/citation-detector'
```

- [ ] **Step 6: Commit**

```bash
git add packages/infra/geo-monitor/src/detection/ packages/infra/geo-monitor/__tests__/citation-detector.test.ts packages/infra/geo-monitor/src/index.ts
git commit -m "feat(geo-monitor): implement CitationDetector with fuzzy matching"
```

---

### Task 8: Query Expander

**Files:**
- Create: `packages/infra/geo-monitor/src/detection/query-expander.ts`
- Create: `packages/infra/geo-monitor/__tests__/query-expander.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/geo-monitor/__tests__/query-expander.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { QueryExpander } from '../src/detection/query-expander'

describe('QueryExpander', () => {
  const expander = new QueryExpander()

  it('generates location variants', () => {
    const seeds = ['best dentist']
    const variants = expander.expand(seeds, { location: 'Jakarta' })
    expect(variants).toContain('best dentist')
    expect(variants).toContain('best dentist in Jakarta')
    expect(variants).toContain('best dentist near Jakarta')
  })

  it('generates comparison variants', () => {
    const seeds = ['peakq web agency']
    const variants = expander.expand(seeds, { competitors: ['Agency X'] })
    expect(variants.some((v) => v.includes('vs'))).toBe(true)
  })

  it('generates question variants', () => {
    const seeds = ['affordable web design']
    const variants = expander.expand(seeds, {})
    expect(variants.some((v) => v.startsWith('what') || v.startsWith('who'))).toBe(true)
  })

  it('deduplicates results', () => {
    const seeds = ['best dentist', 'best dentist']
    const variants = expander.expand(seeds, {})
    const unique = new Set(variants)
    expect(variants.length).toBe(unique.size)
  })

  it('respects maxVariants limit', () => {
    const seeds = ['best dentist', 'top dentist', 'affordable dentist']
    const variants = expander.expand(seeds, { location: 'Jakarta', maxVariants: 10 })
    expect(variants.length).toBeLessThanOrEqual(10)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/query-expander.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement QueryExpander**

Create: `packages/infra/geo-monitor/src/detection/query-expander.ts`

```typescript
interface ExpandOptions {
  location?: string
  competitors?: string[]
  maxVariants?: number
}

export class QueryExpander {
  expand(seeds: string[], options: ExpandOptions = {}): string[] {
    const { location, competitors = [], maxVariants } = options
    const variants = new Set<string>()

    for (const seed of seeds) {
      // Original seed
      variants.add(seed)

      // Location variants
      if (location) {
        variants.add(`${seed} in ${location}`)
        variants.add(`${seed} near ${location}`)
      }

      // Question variants
      variants.add(`what is the best ${seed}`)
      variants.add(`who offers ${seed}`)

      // Comparison variants
      for (const comp of competitors) {
        variants.add(`${seed} vs ${comp}`)
      }
    }

    const result = Array.from(variants)
    if (maxVariants && result.length > maxVariants) {
      return result.slice(0, maxVariants)
    }
    return result
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/query-expander.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Export and commit**

Add to index, then:

```bash
git add packages/infra/geo-monitor/src/detection/query-expander.ts packages/infra/geo-monitor/__tests__/query-expander.test.ts packages/infra/geo-monitor/src/index.ts
git commit -m "feat(geo-monitor): implement QueryExpander for seed prompt expansion"
```

---

### Task 9: Visibility Scorer

**Files:**
- Create: `packages/infra/geo-monitor/src/scoring/visibility-scorer.ts`
- Create: `packages/infra/geo-monitor/__tests__/visibility-scorer.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/geo-monitor/__tests__/visibility-scorer.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { VisibilityScorer } from '../src/scoring/visibility-scorer'
import type { AiEngineName, VisibilityReport } from '../src/types'

interface SnapshotInput {
  engine: AiEngineName
  query: string
  cited: boolean
  position: number | null
}

describe('VisibilityScorer', () => {
  const scorer = new VisibilityScorer()

  it('calculates visibility as percentage of cited queries', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'CHATGPT', query: 'best agency', cited: true, position: 1 },
      { engine: 'CHATGPT', query: 'top agency', cited: false, position: null },
      { engine: 'CHATGPT', query: 'web design', cited: true, position: 3 },
      { engine: 'CHATGPT', query: 'dev agency', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), snapshots)
    expect(report.visibility).toBe(50) // 2/4 = 50%
    expect(report.totalQueries).toBe(4)
    expect(report.citedQueries).toBe(2)
  })

  it('calculates average position from cited queries only', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'PERPLEXITY', query: 'q1', cited: true, position: 2 },
      { engine: 'PERPLEXITY', query: 'q2', cited: true, position: 4 },
      { engine: 'PERPLEXITY', query: 'q3', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'PERPLEXITY', new Date(), snapshots)
    expect(report.avgPosition).toBe(3) // (2+4)/2
  })

  it('returns null avgPosition when no positions available', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'GEMINI', query: 'q1', cited: true, position: null },
    ]
    const report = scorer.calculate('site-1', 'GEMINI', new Date(), snapshots)
    expect(report.avgPosition).toBeNull()
  })

  it('returns 0 visibility when no snapshots', () => {
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), [])
    expect(report.visibility).toBe(0)
    expect(report.totalQueries).toBe(0)
  })

  it('ranks top queries by citation status and position', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'CHATGPT', query: 'q1', cited: true, position: 1 },
      { engine: 'CHATGPT', query: 'q2', cited: true, position: 5 },
      { engine: 'CHATGPT', query: 'q3', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), snapshots)
    expect(report.topQueries[0].query).toBe('q1')
    expect(report.topQueries[0].cited).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/visibility-scorer.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement VisibilityScorer**

Create: `packages/infra/geo-monitor/src/scoring/visibility-scorer.ts`

```typescript
import type { AiEngineName, VisibilityReport } from '../types'

interface SnapshotInput {
  engine: AiEngineName
  query: string
  cited: boolean
  position: number | null
}

export class VisibilityScorer {
  calculate(
    siteId: string,
    engine: AiEngineName,
    period: Date,
    snapshots: SnapshotInput[],
  ): VisibilityReport {
    const totalQueries = snapshots.length
    const citedSnapshots = snapshots.filter((s) => s.cited)
    const citedQueries = citedSnapshots.length

    const visibility = totalQueries > 0 ? (citedQueries / totalQueries) * 100 : 0

    // Average position from cited queries that have a position
    const withPosition = citedSnapshots.filter((s) => s.position !== null)
    const avgPosition =
      withPosition.length > 0
        ? withPosition.reduce((sum, s) => sum + s.position!, 0) / withPosition.length
        : null

    // Top queries: cited first (sorted by position asc), then uncited
    const topQueries = [...snapshots]
      .sort((a, b) => {
        if (a.cited && !b.cited) return -1
        if (!a.cited && b.cited) return 1
        if (a.cited && b.cited) {
          const posA = a.position ?? Infinity
          const posB = b.position ?? Infinity
          return posA - posB
        }
        return 0
      })
      .map((s) => ({ query: s.query, cited: s.cited, position: s.position }))

    return {
      siteId,
      engine,
      period,
      visibility,
      avgPosition,
      totalQueries,
      citedQueries,
      topQueries,
    }
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/visibility-scorer.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/geo-monitor/src/scoring/ packages/infra/geo-monitor/__tests__/visibility-scorer.test.ts packages/infra/geo-monitor/src/index.ts
git commit -m "feat(geo-monitor): implement VisibilityScorer for weekly GEO rollups"
```

---

### Task 10: Engine Adapters (ChatGPT, Perplexity, Gemini, AI Overview)

**Files:**
- Create: `packages/infra/geo-monitor/src/providers/chatgpt-engine.ts`
- Create: `packages/infra/geo-monitor/src/providers/perplexity-engine.ts`
- Create: `packages/infra/geo-monitor/src/providers/gemini-engine.ts`
- Create: `packages/infra/geo-monitor/src/providers/ai-overview-engine.ts`
- Create: `packages/infra/geo-monitor/src/providers/internal-provider.ts`
- Create: `packages/infra/geo-monitor/__tests__/internal-provider.test.ts`

- [ ] **Step 1: Write failing tests for InternalProvider**

Create: `packages/infra/geo-monitor/__tests__/internal-provider.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { InternalGeoProvider } from '../src/providers/internal-provider'
import type { EngineAdapter, AiResponse, ClientEntity } from '../src/types'

const mockEngine: EngineAdapter = {
  name: 'CHATGPT',
  query: vi.fn().mockResolvedValue({
    engine: 'CHATGPT',
    query: 'best web agency',
    rawText: 'PeakQ Technologies is a top choice.',
    sources: [],
    entitiesMentioned: [],
    timestamp: new Date(),
  } satisfies AiResponse),
}

const client: ClientEntity = {
  businessName: 'PeakQ Technologies',
  domain: 'peakq.tech',
  aliases: ['PeakQ'],
}

describe('InternalGeoProvider', () => {
  it('queries engine and detects citation', async () => {
    const provider = new InternalGeoProvider([mockEngine])
    const response = await provider.query('best web agency', 'CHATGPT')
    expect(response.rawText).toContain('PeakQ')

    const citation = provider.detectCitation(response, client)
    expect(citation.cited).toBe(true)
  })

  it('throws when engine not registered', async () => {
    const provider = new InternalGeoProvider([mockEngine])
    await expect(provider.query('test', 'PERPLEXITY')).rejects.toThrow('No adapter registered')
  })

  it('supports multiple engines', async () => {
    const mockPerplexity: EngineAdapter = {
      name: 'PERPLEXITY',
      query: vi.fn().mockResolvedValue({
        engine: 'PERPLEXITY',
        query: 'test',
        rawText: 'Result',
        sources: ['https://peakq.tech'],
        entitiesMentioned: [],
        timestamp: new Date(),
      }),
    }
    const provider = new InternalGeoProvider([mockEngine, mockPerplexity])
    const response = await provider.query('test', 'PERPLEXITY')
    expect(response.engine).toBe('PERPLEXITY')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/internal-provider.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement engine adapters**

Create each adapter. They share a common pattern — API call + response normalization. Example for ChatGPT:

Create: `packages/infra/geo-monitor/src/providers/chatgpt-engine.ts`

```typescript
import type { AiResponse, EngineAdapter } from '../types'

export class ChatGPTEngine implements EngineAdapter {
  name = 'CHATGPT' as const
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async query(prompt: string): Promise<AiResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. When answering, cite your sources with URLs when possible. Provide specific business recommendations when asked.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ''

    // Extract URLs from response text
    const urlPattern = /https?:\/\/[^\s\)]+/g
    const sources = text.match(urlPattern) ?? []

    return {
      engine: 'CHATGPT',
      query: prompt,
      rawText: text,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
```

Create: `packages/infra/geo-monitor/src/providers/perplexity-engine.ts`

```typescript
import type { AiResponse, EngineAdapter } from '../types'

export class PerplexityEngine implements EngineAdapter {
  name = 'PERPLEXITY' as const
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async query(prompt: string): Promise<AiResponse> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    // Perplexity returns citations natively
    const sources: string[] = data.citations ?? []

    return {
      engine: 'PERPLEXITY',
      query: prompt,
      rawText: text,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
```

Create: `packages/infra/geo-monitor/src/providers/gemini-engine.ts`

```typescript
import type { AiResponse, EngineAdapter } from '../types'

export class GeminiEngine implements EngineAdapter {
  name = 'GEMINI' as const
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async query(prompt: string): Promise<AiResponse> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }], // Enable grounding
        }),
      },
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const groundingMetadata = data.candidates?.[0]?.groundingMetadata
    const sources: string[] = groundingMetadata?.webSearchQueries ?? []

    return {
      engine: 'GEMINI',
      query: prompt,
      rawText: text,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
```

Create: `packages/infra/geo-monitor/src/providers/ai-overview-engine.ts`

```typescript
import type { AiResponse, EngineAdapter } from '../types'

export class AiOverviewEngine implements EngineAdapter {
  name = 'AI_OVERVIEW' as const
  private apiKey: string // SerpAPI key

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async query(prompt: string): Promise<AiResponse> {
    const params = new URLSearchParams({
      q: prompt,
      api_key: this.apiKey,
      engine: 'google',
      gl: 'id', // Indonesia
    })

    const response = await fetch(`https://serpapi.com/search.json?${params}`)
    const data = await response.json()

    const aiOverview = data.ai_overview?.text ?? data.answer_box?.snippet ?? ''
    const sources: string[] = (data.ai_overview?.sources ?? []).map(
      (s: { link: string }) => s.link,
    )

    return {
      engine: 'AI_OVERVIEW',
      query: prompt,
      rawText: aiOverview,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
```

- [ ] **Step 4: Implement InternalGeoProvider**

Create: `packages/infra/geo-monitor/src/providers/internal-provider.ts`

```typescript
import type { AiEngineName, AiResponse, CitationResult, ClientEntity, EngineAdapter, GeoProvider } from '../types'
import { CitationDetector } from '../detection/citation-detector'

export class InternalGeoProvider implements GeoProvider {
  private engines: Map<AiEngineName, EngineAdapter>
  private detector: CitationDetector

  constructor(adapters: EngineAdapter[]) {
    this.engines = new Map()
    for (const adapter of adapters) {
      this.engines.set(adapter.name, adapter)
    }
    this.detector = new CitationDetector()
  }

  async query(prompt: string, engine: AiEngineName): Promise<AiResponse> {
    const adapter = this.engines.get(engine)
    if (!adapter) {
      throw new Error(`No adapter registered for engine: ${engine}`)
    }
    return adapter.query(prompt)
  }

  detectCitation(response: AiResponse, client: ClientEntity): CitationResult {
    return this.detector.detect(response, client)
  }
}
```

- [ ] **Step 5: Run tests**

Run: `cd packages/infra/geo-monitor && npx vitest run __tests__/internal-provider.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 6: Export all from index and commit**

Update `packages/infra/geo-monitor/src/index.ts` to export all providers and adapters. Then:

```bash
git add packages/infra/geo-monitor/src/providers/ packages/infra/geo-monitor/__tests__/internal-provider.test.ts packages/infra/geo-monitor/src/index.ts
git commit -m "feat(geo-monitor): implement engine adapters and InternalGeoProvider"
```

---

## Task Group 3: SEO Agent Package

### Task 11: Scaffold seo-agent Package

**Files:**
- Create: `packages/infra/seo-agent/package.json`
- Create: `packages/infra/seo-agent/tsconfig.json`
- Create: `packages/infra/seo-agent/vitest.config.ts`
- Create: `packages/infra/seo-agent/src/index.ts`
- Create: `packages/infra/seo-agent/src/types.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@velo/seo-agent",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "velo": {
    "type": "infra"
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@velo/db": "workspace:*",
    "@velo/seo-engine": "workspace:*",
    "@velo/geo-monitor": "workspace:*",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json, vitest.config.ts**

Same pattern as geo-monitor.

- [ ] **Step 3: Create types.ts**

Create: `packages/infra/seo-agent/src/types.ts`

```typescript
export type { Cadence, ChannelCadenceConfig } from '@velo/seo-engine'

export interface AgentLoopContext {
  siteId: string
  configId: string
  runId: string
  tier: 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE'
}

export interface OpportunitySeed {
  signal: 'KEYWORD_GAP' | 'COMPETITOR' | 'AI_ANSWER'
  keyword: string
  title?: string
  channel: 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'
  score: number
  metadata?: Record<string, unknown>
}

export interface AgentStepResult {
  step: string
  success: boolean
  metrics?: Record<string, number>
  error?: string
}
```

- [ ] **Step 4: Create index.ts with placeholder exports**

```typescript
export type { AgentLoopContext, OpportunitySeed, AgentStepResult } from './types'
```

- [ ] **Step 5: Install dependencies and verify typecheck**

Run: `pnpm install && cd packages/infra/seo-agent && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add packages/infra/seo-agent/
git commit -m "feat(seo-agent): scaffold package with types"
```

---

### Task 12: Tier Gate

**Files:**
- Create: `packages/infra/seo-agent/src/gates/tier-gate.ts`
- Create: `packages/infra/seo-agent/__tests__/tier-gate.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/seo-agent/__tests__/tier-gate.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { TierGate } from '../src/gates/tier-gate'

describe('TierGate', () => {
  describe('STARTER tier', () => {
    const gate = new TierGate('STARTER')

    it('does not allow any channels', () => {
      expect(gate.canUseChannel('BLOG')).toBe(false)
      expect(gate.canUseChannel('GBP')).toBe(false)
      expect(gate.canUseChannel('SOCIAL')).toBe(false)
      expect(gate.canUseChannel('EMAIL')).toBe(false)
    })

    it('has zero GEO query budget', () => {
      expect(gate.getGeoQueryBudget()).toBe(0)
    })
  })

  describe('GROWTH tier', () => {
    const gate = new TierGate('GROWTH')

    it('allows BLOG and GBP only', () => {
      expect(gate.canUseChannel('BLOG')).toBe(true)
      expect(gate.canUseChannel('GBP')).toBe(true)
      expect(gate.canUseChannel('SOCIAL')).toBe(false)
      expect(gate.canUseChannel('EMAIL')).toBe(false)
    })

    it('returns correct channel limits', () => {
      expect(gate.getChannelLimit('BLOG')).toEqual({ max: 2, period: 'week' })
      expect(gate.getChannelLimit('GBP')).toEqual({ max: 3, period: 'week' })
    })

    it('has zero GEO query budget', () => {
      expect(gate.getGeoQueryBudget()).toBe(0)
    })

    it('allows only CLAUDE model', () => {
      expect(gate.getAllowedModels()).toEqual(['CLAUDE'])
    })

    it('allows AUTO_PUBLISH and VETO_WINDOW oversight', () => {
      expect(gate.getAllowedOversightModes()).toContain('AUTO_PUBLISH')
      expect(gate.getAllowedOversightModes()).toContain('VETO_WINDOW')
      expect(gate.getAllowedOversightModes()).not.toContain('APPROVAL_REQUIRED')
    })

    it('has basic GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('basic')
    })

    it('allows zero competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(0)
    })
  })

  describe('SCALE tier', () => {
    const gate = new TierGate('SCALE')

    it('allows all 4 channels', () => {
      expect(gate.canUseChannel('BLOG')).toBe(true)
      expect(gate.canUseChannel('SOCIAL')).toBe(true)
      expect(gate.canUseChannel('EMAIL')).toBe(true)
    })

    it('has 50 GEO queries per week', () => {
      expect(gate.getGeoQueryBudget()).toBe(50)
    })

    it('allows 3 competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(3)
    })

    it('has full GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('full')
    })
  })

  describe('ENTERPRISE tier', () => {
    const gate = new TierGate('ENTERPRISE')

    it('has unlimited channel limits', () => {
      expect(gate.getChannelLimit('BLOG')).toEqual({ max: Infinity, period: 'week' })
    })

    it('has 100 GEO queries', () => {
      expect(gate.getGeoQueryBudget()).toBe(100)
    })

    it('allows all models', () => {
      expect(gate.getAllowedModels()).toEqual(['CLAUDE', 'OPENAI', 'GEMINI'])
    })

    it('allows 10 competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(10)
    })

    it('has custom GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('custom')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/tier-gate.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement TierGate**

Create: `packages/infra/seo-agent/src/gates/tier-gate.ts`

```typescript
type Tier = 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE'
type Channel = 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'
type AiModel = 'CLAUDE' | 'OPENAI' | 'GEMINI'
type OversightMode = 'AUTO_PUBLISH' | 'VETO_WINDOW' | 'APPROVAL_REQUIRED'
type GeoLevel = 'none' | 'basic' | 'full' | 'custom'

interface ChannelLimit {
  max: number
  period: 'week' | 'month'
}

const TIER_CONFIG: Record<
  Tier,
  {
    channels: Partial<Record<Channel, ChannelLimit>>
    geoQueryBudget: number
    competitorLimit: number
    models: AiModel[]
    oversightModes: OversightMode[]
    geoOptimization: GeoLevel
  }
> = {
  STARTER: {
    channels: {},
    geoQueryBudget: 0,
    competitorLimit: 0,
    models: [],
    oversightModes: [],
    geoOptimization: 'none',
  },
  GROWTH: {
    channels: {
      BLOG: { max: 2, period: 'week' },
      GBP: { max: 3, period: 'week' },
    },
    geoQueryBudget: 0,
    competitorLimit: 0,
    models: ['CLAUDE'],
    oversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW'],
    geoOptimization: 'basic',
  },
  SCALE: {
    channels: {
      BLOG: { max: 5, period: 'week' },
      GBP: { max: 5, period: 'week' },
      SOCIAL: { max: 5, period: 'week' },
      EMAIL: { max: 2, period: 'month' },
    },
    geoQueryBudget: 50,
    competitorLimit: 3,
    models: ['CLAUDE', 'OPENAI'],
    oversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW', 'APPROVAL_REQUIRED'],
    geoOptimization: 'full',
  },
  ENTERPRISE: {
    channels: {
      BLOG: { max: Infinity, period: 'week' },
      GBP: { max: Infinity, period: 'week' },
      SOCIAL: { max: Infinity, period: 'week' },
      EMAIL: { max: Infinity, period: 'month' },
    },
    geoQueryBudget: 100,
    competitorLimit: 10,
    models: ['CLAUDE', 'OPENAI', 'GEMINI'],
    oversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW', 'APPROVAL_REQUIRED'],
    geoOptimization: 'custom',
  },
}

export class TierGate {
  private config: (typeof TIER_CONFIG)[Tier]

  constructor(private tier: Tier) {
    this.config = TIER_CONFIG[tier]
  }

  canUseChannel(channel: Channel): boolean {
    return channel in this.config.channels
  }

  getChannelLimit(channel: Channel): ChannelLimit {
    return this.config.channels[channel] ?? { max: 0, period: 'week' }
  }

  getGeoQueryBudget(): number {
    return this.config.geoQueryBudget
  }

  getCompetitorLimit(): number {
    return this.config.competitorLimit
  }

  getAllowedModels(): AiModel[] {
    return this.config.models
  }

  getAllowedOversightModes(): OversightMode[] {
    return this.config.oversightModes
  }

  getGeoOptimizationLevel(): GeoLevel {
    return this.config.geoOptimization
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/tier-gate.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/seo-agent/src/gates/tier-gate.ts packages/infra/seo-agent/__tests__/tier-gate.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement TierGate with per-tier capability matrix"
```

---

### Task 13: Opportunity Scorer and Deduplicator

**Files:**
- Create: `packages/infra/seo-agent/src/intelligence/opportunity-scorer.ts`
- Create: `packages/infra/seo-agent/src/intelligence/deduplicator.ts`
- Create: `packages/infra/seo-agent/__tests__/opportunity-scorer.test.ts`
- Create: `packages/infra/seo-agent/__tests__/deduplicator.test.ts`

- [ ] **Step 1: Write failing tests for OpportunityScorer**

Create: `packages/infra/seo-agent/__tests__/opportunity-scorer.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { OpportunityScorer } from '../src/intelligence/opportunity-scorer'

describe('OpportunityScorer', () => {
  const scorer = new OpportunityScorer()

  it('applies GEO-weighted formula (0.3, 0.3, 0.4)', () => {
    const score = scorer.score({
      searchVolume: 100,    // normalized to 0-100
      competitorUrgency: 50,
      aiCitationPotential: 80,
    })
    // (100 * 0.3) + (50 * 0.3) + (80 * 0.4) = 30 + 15 + 32 = 77
    expect(score).toBe(77)
  })

  it('clamps score to 0-100 range', () => {
    const score = scorer.score({
      searchVolume: 100,
      competitorUrgency: 100,
      aiCitationPotential: 100,
    })
    expect(score).toBe(100)
  })

  it('returns 0 for all-zero inputs', () => {
    const score = scorer.score({
      searchVolume: 0,
      competitorUrgency: 0,
      aiCitationPotential: 0,
    })
    expect(score).toBe(0)
  })
})
```

- [ ] **Step 2: Write failing tests for Deduplicator**

Create: `packages/infra/seo-agent/__tests__/deduplicator.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { Deduplicator } from '../src/intelligence/deduplicator'

describe('Deduplicator', () => {
  const dedup = new Deduplicator(0.7)

  it('removes near-duplicate keywords', () => {
    const items = [
      { keyword: 'best dentist in jakarta', score: 80 },
      { keyword: 'best dentists in jakarta', score: 75 },
      { keyword: 'affordable web design', score: 60 },
    ]
    const result = dedup.deduplicate(items)
    expect(result).toHaveLength(2)
    // Keeps higher-scored duplicate
    expect(result[0].keyword).toBe('best dentist in jakarta')
  })

  it('keeps dissimilar keywords', () => {
    const items = [
      { keyword: 'dental implants cost', score: 70 },
      { keyword: 'web design agency', score: 65 },
    ]
    const result = dedup.deduplicate(items)
    expect(result).toHaveLength(2)
  })

  it('handles empty input', () => {
    const result = dedup.deduplicate([])
    expect(result).toHaveLength(0)
  })

  it('handles single item', () => {
    const items = [{ keyword: 'test', score: 50 }]
    const result = dedup.deduplicate(items)
    expect(result).toHaveLength(1)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/opportunity-scorer.test.ts __tests__/deduplicator.test.ts`
Expected: FAIL

- [ ] **Step 4: Implement OpportunityScorer**

Create: `packages/infra/seo-agent/src/intelligence/opportunity-scorer.ts`

```typescript
interface ScoreInputs {
  searchVolume: number      // 0-100 normalized
  competitorUrgency: number // 0-100
  aiCitationPotential: number // 0-100
}

const WEIGHTS = {
  searchVolume: 0.3,
  competitorUrgency: 0.3,
  aiCitationPotential: 0.4,
} as const

export class OpportunityScorer {
  score(inputs: ScoreInputs): number {
    const raw =
      inputs.searchVolume * WEIGHTS.searchVolume +
      inputs.competitorUrgency * WEIGHTS.competitorUrgency +
      inputs.aiCitationPotential * WEIGHTS.aiCitationPotential
    return Math.round(Math.min(100, Math.max(0, raw)))
  }
}
```

- [ ] **Step 5: Implement Deduplicator**

Create: `packages/infra/seo-agent/src/intelligence/deduplicator.ts`

```typescript
interface DeduplicateItem {
  keyword: string
  score: number
}

export class Deduplicator {
  constructor(private threshold: number = 0.7) {}

  deduplicate<T extends DeduplicateItem>(items: T[]): T[] {
    if (items.length <= 1) return items

    // Sort by score descending — higher-scored items are kept
    const sorted = [...items].sort((a, b) => b.score - a.score)
    const kept: T[] = []

    for (const item of sorted) {
      const isDuplicate = kept.some(
        (existing) => this.jaccardSimilarity(item.keyword, existing.keyword) >= this.threshold,
      )
      if (!isDuplicate) {
        kept.push(item)
      }
    }

    return kept
  }

  private jaccardSimilarity(a: string, b: string): number {
    const ngramsA = this.getNgrams(this.normalize(a))
    const ngramsB = this.getNgrams(this.normalize(b))

    const setA = new Set(ngramsA)
    const setB = new Set(ngramsB)

    let intersection = 0
    for (const gram of setA) {
      if (setB.has(gram)) intersection++
    }

    const union = setA.size + setB.size - intersection
    return union === 0 ? 0 : intersection / union
  }

  private normalize(text: string): string {
    const stopwords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are'])
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !stopwords.has(word))
      .join(' ')
  }

  private getNgrams(text: string, n: number = 2): string[] {
    const words = text.split(/\s+/)
    if (words.length < n) return [text]
    const ngrams: string[] = []
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '))
    }
    // Also include unigrams for better matching
    ngrams.push(...words)
    return ngrams
  }
}
```

- [ ] **Step 6: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/opportunity-scorer.test.ts __tests__/deduplicator.test.ts`
Expected: All tests PASS

- [ ] **Step 7: Export and commit**

```bash
git add packages/infra/seo-agent/src/intelligence/ packages/infra/seo-agent/__tests__/opportunity-scorer.test.ts packages/infra/seo-agent/__tests__/deduplicator.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement OpportunityScorer and Deduplicator"
```

---

### Task 14: Cadence Limiter

**Files:**
- Create: `packages/infra/seo-agent/src/planning/cadence-limiter.ts`
- Create: `packages/infra/seo-agent/__tests__/cadence-limiter.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/seo-agent/__tests__/cadence-limiter.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { CadenceLimiter } from '../src/planning/cadence-limiter'

describe('CadenceLimiter', () => {
  it('limits opportunities per channel within cadence', () => {
    const limiter = new CadenceLimiter({
      blog: { max: 2, period: 'week' },
      gbp: { max: 3, period: 'week' },
    })

    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'BLOG' as const, score: 80, keyword: 'kw2' },
      { channel: 'BLOG' as const, score: 70, keyword: 'kw3' }, // over limit
      { channel: 'GBP' as const, score: 60, keyword: 'kw4' },
    ]

    const result = limiter.apply(opportunities, { alreadyPublishedThisPeriod: {} })
    const blogs = result.filter((o) => o.channel === 'BLOG')
    expect(blogs).toHaveLength(2)
    // Highest-scored kept
    expect(blogs[0].score).toBe(90)
    expect(blogs[1].score).toBe(80)
  })

  it('accounts for already-published content this period', () => {
    const limiter = new CadenceLimiter({
      blog: { max: 2, period: 'week' },
    })

    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'BLOG' as const, score: 80, keyword: 'kw2' },
    ]

    const result = limiter.apply(opportunities, {
      alreadyPublishedThisPeriod: { BLOG: 1 }, // 1 already published
    })
    expect(result).toHaveLength(1) // only 1 slot left
  })

  it('filters out channels not in cadence config', () => {
    const limiter = new CadenceLimiter({
      blog: { max: 2, period: 'week' },
    })

    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'SOCIAL' as const, score: 80, keyword: 'kw2' },
    ]

    const result = limiter.apply(opportunities, { alreadyPublishedThisPeriod: {} })
    expect(result).toHaveLength(1)
    expect(result[0].channel).toBe('BLOG')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/cadence-limiter.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement CadenceLimiter**

Create: `packages/infra/seo-agent/src/planning/cadence-limiter.ts`

```typescript
type Channel = 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'

interface ChannelCadence {
  max: number
  period: 'week' | 'month'
}

type CadenceConfig = Partial<Record<Lowercase<Channel>, ChannelCadence>>

interface OpportunityInput {
  channel: Channel
  score: number
  keyword: string
}

interface ApplyOptions {
  alreadyPublishedThisPeriod: Partial<Record<Channel, number>>
}

export class CadenceLimiter {
  private config: CadenceConfig

  constructor(config: CadenceConfig) {
    this.config = config
  }

  apply<T extends OpportunityInput>(opportunities: T[], options: ApplyOptions): T[] {
    const { alreadyPublishedThisPeriod } = options

    // Calculate remaining budget per channel
    const budget = new Map<Channel, number>()
    for (const [channel, cadence] of Object.entries(this.config)) {
      const ch = channel.toUpperCase() as Channel
      const published = alreadyPublishedThisPeriod[ch] ?? 0
      budget.set(ch, Math.max(0, cadence.max - published))
    }

    // Sort by score descending
    const sorted = [...opportunities].sort((a, b) => b.score - a.score)
    const result: T[] = []

    for (const opp of sorted) {
      const remaining = budget.get(opp.channel)
      if (remaining === undefined) continue // channel not in config
      if (remaining <= 0) continue

      result.push(opp)
      budget.set(opp.channel, remaining - 1)
    }

    return result
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/cadence-limiter.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/seo-agent/src/planning/ packages/infra/seo-agent/__tests__/cadence-limiter.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement CadenceLimiter with per-channel budgets"
```

---

### Task 15: Oversight Gate

**Files:**
- Create: `packages/infra/seo-agent/src/gates/oversight-gate.ts`
- Create: `packages/infra/seo-agent/__tests__/oversight-gate.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/seo-agent/__tests__/oversight-gate.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { OversightGate } from '../src/gates/oversight-gate'

describe('OversightGate', () => {
  it('AUTO_PUBLISH returns immediate publish action', () => {
    const gate = new OversightGate('AUTO_PUBLISH')
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('publish')
    expect(result.approvalStatus).toBe('APPROVED')
    expect(result.vetoDeadline).toBeNull()
  })

  it('VETO_WINDOW returns delayed publish with deadline', () => {
    const gate = new OversightGate('VETO_WINDOW', 24)
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('queue_veto')
    expect(result.approvalStatus).toBe('PENDING')
    expect(result.vetoDeadline).toBeInstanceOf(Date)
    // Deadline should be ~24 hours from now
    const hoursFromNow = (result.vetoDeadline!.getTime() - Date.now()) / (1000 * 60 * 60)
    expect(hoursFromNow).toBeGreaterThan(23)
    expect(hoursFromNow).toBeLessThan(25)
  })

  it('APPROVAL_REQUIRED returns queue action', () => {
    const gate = new OversightGate('APPROVAL_REQUIRED')
    const result = gate.evaluate('opp-1')
    expect(result.action).toBe('queue_approval')
    expect(result.approvalStatus).toBe('PENDING')
    expect(result.vetoDeadline).toBeNull()
  })
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/oversight-gate.test.ts`

- [ ] **Step 3: Implement OversightGate**

Create: `packages/infra/seo-agent/src/gates/oversight-gate.ts`

```typescript
type OversightMode = 'AUTO_PUBLISH' | 'VETO_WINDOW' | 'APPROVAL_REQUIRED'
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'VETOED' | 'AUTO_SKIPPED'

export interface OversightDecision {
  action: 'publish' | 'queue_veto' | 'queue_approval'
  approvalStatus: ApprovalStatus
  vetoDeadline: Date | null
}

export class OversightGate {
  constructor(
    private mode: OversightMode,
    private vetoWindowHours: number = 24,
  ) {}

  evaluate(_opportunityId: string): OversightDecision {
    switch (this.mode) {
      case 'AUTO_PUBLISH':
        return {
          action: 'publish',
          approvalStatus: 'APPROVED',
          vetoDeadline: null,
        }
      case 'VETO_WINDOW':
        return {
          action: 'queue_veto',
          approvalStatus: 'PENDING',
          vetoDeadline: new Date(Date.now() + this.vetoWindowHours * 60 * 60 * 1000),
        }
      case 'APPROVAL_REQUIRED':
        return {
          action: 'queue_approval',
          approvalStatus: 'PENDING',
          vetoDeadline: null,
        }
    }
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/oversight-gate.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/seo-agent/src/gates/oversight-gate.ts packages/infra/seo-agent/__tests__/oversight-gate.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement OversightGate with 3 oversight modes"
```

---

### Task 16: Concurrency Lock Manager

**Files:**
- Create: `packages/infra/seo-agent/src/loop/concurrency.ts`
- Create: `packages/infra/seo-agent/__tests__/concurrency.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/seo-agent/__tests__/concurrency.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LockManager } from '../src/loop/concurrency'

// Mock Prisma client
const mockPrisma = {
  agentRun: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}

describe('LockManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('acquires lock when no active run exists', async () => {
    mockPrisma.agentRun.findFirst.mockResolvedValue(null)
    mockPrisma.agentRun.create.mockResolvedValue({
      id: 'run-1',
      lockToken: 'token-123',
      status: 'RUNNING',
    })

    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')

    expect(result.acquired).toBe(true)
    expect(result.runId).toBe('run-1')
  })

  it('rejects when active run exists within TTL', async () => {
    mockPrisma.agentRun.findFirst.mockResolvedValue({
      id: 'run-existing',
      status: 'RUNNING',
      startedAt: new Date(), // just started
    })

    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')

    expect(result.acquired).toBe(false)
    expect(result.reason).toContain('active run')
  })

  it('supersedes stale run (>1 hour)', async () => {
    const staleStart = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    mockPrisma.agentRun.findFirst.mockResolvedValue({
      id: 'run-stale',
      status: 'RUNNING',
      startedAt: staleStart,
    })
    mockPrisma.agentRun.update.mockResolvedValue({
      id: 'run-stale',
      status: 'FAILED',
    })
    mockPrisma.agentRun.create.mockResolvedValue({
      id: 'run-new',
      lockToken: 'token-new',
      status: 'RUNNING',
    })

    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')

    expect(result.acquired).toBe(true)
    expect(mockPrisma.agentRun.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'run-stale' },
        data: expect.objectContaining({ status: 'FAILED' }),
      }),
    )
  })

  it('releases lock by completing the run', async () => {
    mockPrisma.agentRun.update.mockResolvedValue({
      id: 'run-1',
      status: 'COMPLETED',
    })

    const manager = new LockManager(mockPrisma as any)
    await manager.releaseLock('run-1', 'COMPLETED')

    expect(mockPrisma.agentRun.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'run-1' },
        data: expect.objectContaining({
          status: 'COMPLETED',
          completedAt: expect.any(Date),
        }),
      }),
    )
  })
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/concurrency.test.ts`

- [ ] **Step 3: Implement LockManager**

Create: `packages/infra/seo-agent/src/loop/concurrency.ts`

```typescript
import type { PrismaClient } from '@velo/db'
import { randomUUID } from 'crypto'

const STALE_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour

interface LockResult {
  acquired: boolean
  runId?: string
  reason?: string
}

export class LockManager {
  constructor(private prisma: PrismaClient) {}

  async acquireLock(siteId: string, configId: string): Promise<LockResult> {
    // Check for active run
    const activeRun = await this.prisma.agentRun.findFirst({
      where: { siteId, status: 'RUNNING' },
    })

    if (activeRun) {
      const elapsed = Date.now() - activeRun.startedAt.getTime()

      if (elapsed < STALE_THRESHOLD_MS) {
        return {
          acquired: false,
          reason: `Skipped: active run ${activeRun.id} in progress`,
        }
      }

      // Stale run — supersede it
      await this.prisma.agentRun.update({
        where: { id: activeRun.id },
        data: {
          status: 'FAILED',
          error: 'Superseded: exceeded 1h TTL',
          completedAt: new Date(),
        },
      })
    }

    // Create new run with lock
    const run = await this.prisma.agentRun.create({
      data: {
        configId,
        siteId,
        status: 'RUNNING',
        lockToken: randomUUID(),
      },
    })

    return { acquired: true, runId: run.id }
  }

  async releaseLock(
    runId: string,
    status: 'COMPLETED' | 'FAILED',
    error?: string,
  ): Promise<void> {
    await this.prisma.agentRun.update({
      where: { id: runId },
      data: {
        status,
        error,
        completedAt: new Date(),
      },
    })
  }

  async updateStep(runId: string, step: string, metrics?: Partial<Record<string, number>>): Promise<void> {
    await this.prisma.agentRun.update({
      where: { id: runId },
      data: {
        currentStep: step,
        ...(metrics ?? {}),
      },
    })
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/concurrency.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/seo-agent/src/loop/ packages/infra/seo-agent/__tests__/concurrency.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement LockManager for agent run concurrency control"
```

---

### Task 17: Agent Loop Orchestrator

**Files:**
- Create: `packages/infra/seo-agent/src/loop/agent-loop.ts`
- Create: `packages/infra/seo-agent/__tests__/agent-loop.test.ts`

- [ ] **Step 1: Write failing tests**

Create: `packages/infra/seo-agent/__tests__/agent-loop.test.ts`

Test the high-level orchestration — each step is called in order, lock is acquired/released, errors are handled. Use mocks for all dependencies.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AgentLoop } from '../src/loop/agent-loop'

const mockLockManager = {
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
  updateStep: vi.fn(),
}

const mockPrisma = {
  agentConfig: { findUnique: vi.fn() },
  contentOpportunity: { createMany: vi.fn(), findMany: vi.fn(), updateMany: vi.fn() },
  geoSnapshot: { createMany: vi.fn() },
  geoScore: { upsert: vi.fn() },
}

describe('AgentLoop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips run when lock cannot be acquired', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: false, reason: 'busy' })

    const loop = new AgentLoop({
      prisma: mockPrisma as any,
      lockManager: mockLockManager as any,
      siteId: 'site-1',
      configId: 'config-1',
    })

    const result = await loop.run()
    expect(result.success).toBe(false)
    expect(result.reason).toBe('busy')
  })

  it('acquires lock, runs steps, releases lock on success', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: true, runId: 'run-1' })
    mockPrisma.agentConfig.findUnique.mockResolvedValue({
      id: 'config-1',
      siteId: 'site-1',
      tier: 'GROWTH',
      oversightMode: 'AUTO_PUBLISH',
      channels: ['BLOG', 'GBP'],
      cadence: { blog: { max: 2, period: 'week' } },
      competitors: [],
      verticalKeywords: ['web design'],
      geoEnabled: false,
      geoQueryPrompts: [],
    })
    mockPrisma.contentOpportunity.findMany.mockResolvedValue([])

    const loop = new AgentLoop({
      prisma: mockPrisma as any,
      lockManager: mockLockManager as any,
      siteId: 'site-1',
      configId: 'config-1',
    })

    const result = await loop.run()
    expect(mockLockManager.acquireLock).toHaveBeenCalledWith('site-1', 'config-1')
    expect(mockLockManager.releaseLock).toHaveBeenCalledWith('run-1', 'COMPLETED', undefined)
    expect(result.success).toBe(true)
  })

  it('releases lock with FAILED on error', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: true, runId: 'run-1' })
    mockPrisma.agentConfig.findUnique.mockRejectedValue(new Error('DB down'))

    const loop = new AgentLoop({
      prisma: mockPrisma as any,
      lockManager: mockLockManager as any,
      siteId: 'site-1',
      configId: 'config-1',
    })

    const result = await loop.run()
    expect(result.success).toBe(false)
    expect(mockLockManager.releaseLock).toHaveBeenCalledWith('run-1', 'FAILED', 'DB down')
  })
})
```

- [ ] **Step 2: Run test, verify fails**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/agent-loop.test.ts`

- [ ] **Step 3: Implement AgentLoop skeleton**

Create: `packages/infra/seo-agent/src/loop/agent-loop.ts`

```typescript
import type { PrismaClient } from '@velo/db'
import type { LockManager } from './concurrency'
import { TierGate } from '../gates/tier-gate'
import { OversightGate } from '../gates/oversight-gate'

interface AgentLoopConfig {
  prisma: PrismaClient
  lockManager: LockManager
  siteId: string
  configId: string
}

interface RunResult {
  success: boolean
  reason?: string
  metrics?: {
    opportunitiesFound: number
    contentGenerated: number
    contentPublished: number
    geoQueriesRun: number
  }
}

export class AgentLoop {
  private prisma: PrismaClient
  private lockManager: LockManager
  private siteId: string
  private configId: string

  constructor(config: AgentLoopConfig) {
    this.prisma = config.prisma
    this.lockManager = config.lockManager
    this.siteId = config.siteId
    this.configId = config.configId
  }

  async run(): Promise<RunResult> {
    // 1. Acquire lock
    const lock = await this.lockManager.acquireLock(this.siteId, this.configId)
    if (!lock.acquired) {
      return { success: false, reason: lock.reason }
    }

    const runId = lock.runId!

    try {
      // 2. Load config
      const config = await this.prisma.agentConfig.findUnique({
        where: { id: this.configId },
      })

      if (!config) {
        await this.lockManager.releaseLock(runId, 'FAILED', 'Config not found')
        return { success: false, reason: 'Config not found' }
      }

      const tierGate = new TierGate(config.tier)
      const oversightGate = new OversightGate(
        config.oversightMode,
        config.vetoWindowHours ?? 24,
      )

      // Step 1: GATHER
      await this.lockManager.updateStep(runId, 'GATHER')
      // TODO: Implement gather step (GSC data, competitor crawl, GEO queries)

      // Step 2: ANALYZE
      await this.lockManager.updateStep(runId, 'ANALYZE')
      // TODO: Run KeywordAnalyzer, CompetitorAnalyzer, AiAnswerAnalyzer

      // Step 3: PLAN
      await this.lockManager.updateStep(runId, 'PLAN')
      // TODO: Score, deduplicate, apply cadence limits, create opportunities

      // Step 4: GENERATE
      await this.lockManager.updateStep(runId, 'GENERATE')
      // TODO: Call seo-engine for each planned opportunity

      // Step 5: GATE
      await this.lockManager.updateStep(runId, 'GATE')
      // TODO: Apply oversight gate per opportunity

      // Step 6: PUBLISH
      await this.lockManager.updateStep(runId, 'PUBLISH')
      // TODO: Publish approved content via seo-engine

      // Step 7: MONITOR
      await this.lockManager.updateStep(runId, 'MONITOR')
      // TODO: Run GEO monitoring queries, calculate scores

      // Step 8: REPORT
      await this.lockManager.updateStep(runId, 'REPORT')
      // TODO: Generate reports, send notifications

      await this.lockManager.releaseLock(runId, 'COMPLETED')
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      await this.lockManager.releaseLock(runId, 'FAILED', message)
      return { success: false, reason: message }
    }
  }
}
```

Note: This is a skeleton with TODO markers. Each step will be filled in during subsequent tasks as the analyzers and integrations are built. The key here is that the orchestration structure, locking, and error handling are tested and working.

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-agent && npx vitest run __tests__/agent-loop.test.ts`
Expected: All 3 tests PASS

- [ ] **Step 5: Export and commit**

```bash
git add packages/infra/seo-agent/src/loop/agent-loop.ts packages/infra/seo-agent/__tests__/agent-loop.test.ts packages/infra/seo-agent/src/index.ts
git commit -m "feat(seo-agent): implement AgentLoop orchestrator skeleton with locking"
```

---

## Task Group 4: Dashboard API Routes

### Task 18: Agent Config API

**Files:**
- Create: `apps/dashboard/app/api/sites/[id]/agent/config/route.ts`

- [ ] **Step 1: Read existing API route pattern for reference**

Read: `apps/dashboard/app/api/sites/[id]/seo/campaigns/route.ts` to understand the auth + prisma + response pattern used in this dashboard.

- [ ] **Step 2: Implement GET and POST handlers**

Create: `apps/dashboard/app/api/sites/[id]/agent/config/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'
import { CadenceSchema } from '@velo/seo-engine'
import { z } from 'zod'

const UpdateConfigSchema = z.object({
  tier: z.enum(['STARTER', 'GROWTH', 'SCALE', 'ENTERPRISE']).optional(),
  oversightMode: z.enum(['AUTO_PUBLISH', 'VETO_WINDOW', 'APPROVAL_REQUIRED']).optional(),
  vetoWindowHours: z.number().int().positive().optional(),
  channels: z.array(z.enum(['BLOG', 'GBP', 'SOCIAL', 'EMAIL'])).optional(),
  cadence: CadenceSchema.optional(),
  competitors: z.array(z.string().url()).optional(),
  verticalKeywords: z.array(z.string()).optional(),
  geoEnabled: z.boolean().optional(),
  geoQueryPrompts: z.array(z.string()).optional(),
  aiModel: z.enum(['CLAUDE', 'OPENAI', 'GEMINI']).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const config = await prisma.agentConfig.findUnique({ where: { siteId } })

  if (!config) return NextResponse.json({ error: 'No agent config' }, { status: 404 })
  return NextResponse.json(config)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const body = await req.json()
  const parsed = UpdateConfigSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const config = await prisma.agentConfig.upsert({
    where: { siteId },
    create: {
      siteId,
      tier: parsed.data.tier ?? 'GROWTH',
      oversightMode: parsed.data.oversightMode ?? 'AUTO_PUBLISH',
      channels: parsed.data.channels ?? ['BLOG'],
      cadence: parsed.data.cadence ?? { blog: { max: 2, period: 'week' } },
      competitors: parsed.data.competitors ?? [],
      verticalKeywords: parsed.data.verticalKeywords ?? [],
      geoQueryPrompts: parsed.data.geoQueryPrompts ?? [],
      ...parsed.data,
    },
    update: parsed.data,
  })

  return NextResponse.json(config)
}
```

- [ ] **Step 3: Verify typecheck**

Run: `cd apps/dashboard && npx tsc --noEmit`
Expected: No errors related to new route

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/app/api/sites/\[id\]/agent/
git commit -m "feat(dashboard): add agent config GET/POST API routes"
```

---

### Task 19: Agent Toggle, Runs, Opportunities, Approvals API Routes

**Files:**
- Create: `apps/dashboard/app/api/sites/[id]/agent/toggle/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/agent/runs/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/opportunities/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/opportunities/[oid]/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/approvals/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/approvals/[oid]/route.ts`

- [ ] **Step 1: Implement toggle route**

Create: `apps/dashboard/app/api/sites/[id]/agent/toggle/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const config = await prisma.agentConfig.findUnique({ where: { siteId } })

  if (!config) return NextResponse.json({ error: 'No agent config' }, { status: 404 })

  const updated = await prisma.agentConfig.update({
    where: { siteId },
    data: { isActive: !config.isActive },
  })

  return NextResponse.json({ isActive: updated.isActive })
}
```

- [ ] **Step 2: Implement runs route**

Create: `apps/dashboard/app/api/sites/[id]/agent/runs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const runs = await prisma.agentRun.findMany({
    where: { siteId },
    orderBy: { startedAt: 'desc' },
    take: 10,
  })

  return NextResponse.json(runs)
}
```

- [ ] **Step 3: Implement opportunities routes**

Create: `apps/dashboard/app/api/sites/[id]/opportunities/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const url = new URL(req.url)
  const signal = url.searchParams.get('signal')
  const channel = url.searchParams.get('channel')
  const status = url.searchParams.get('status')

  const where: Record<string, unknown> = { siteId }
  if (signal) where.signal = signal
  if (channel) where.channel = channel
  if (status) where.status = status

  const opportunities = await prisma.contentOpportunity.findMany({
    where,
    orderBy: { score: 'desc' },
    include: { contentPiece: { select: { id: true, title: true, status: true } } },
  })

  return NextResponse.json(opportunities)
}
```

Create: `apps/dashboard/app/api/sites/[id]/opportunities/[oid]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; oid: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { oid } = await params
  const body = await req.json()

  const updated = await prisma.contentOpportunity.update({
    where: { id: oid },
    data: {
      status: body.status,
      approvalNote: body.approvalNote,
    },
  })

  return NextResponse.json(updated)
}
```

- [ ] **Step 4: Implement approvals routes**

Create: `apps/dashboard/app/api/sites/[id]/approvals/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const pending = await prisma.contentOpportunity.findMany({
    where: { siteId, approvalStatus: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: {
      contentPiece: true,
    },
  })

  return NextResponse.json(pending)
}
```

Create: `apps/dashboard/app/api/sites/[id]/approvals/[oid]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'
import { z } from 'zod'

const ApprovalActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'veto']),
  note: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; oid: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { oid } = await params
  const body = await req.json()
  const parsed = ApprovalActionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const statusMap = {
    approve: 'APPROVED' as const,
    reject: 'REJECTED' as const,
    veto: 'VETOED' as const,
  }

  const opportunityStatusMap = {
    approve: 'APPROVED' as const,
    reject: 'SKIPPED' as const,
    veto: 'SKIPPED' as const,
  }

  const updated = await prisma.contentOpportunity.update({
    where: { id: oid },
    data: {
      approvalStatus: statusMap[parsed.data.action],
      status: opportunityStatusMap[parsed.data.action],
      approvalNote: parsed.data.note,
    },
  })

  return NextResponse.json(updated)
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/app/api/sites/\[id\]/agent/ apps/dashboard/app/api/sites/\[id\]/opportunities/ apps/dashboard/app/api/sites/\[id\]/approvals/
git commit -m "feat(dashboard): add agent toggle, runs, opportunities, approvals API routes"
```

---

### Task 20: GEO Scores and Snapshots API Routes

**Files:**
- Create: `apps/dashboard/app/api/sites/[id]/geo/scores/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/geo/snapshots/route.ts`

- [ ] **Step 1: Implement scores route**

Create: `apps/dashboard/app/api/sites/[id]/geo/scores/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const url = new URL(req.url)
  const engine = url.searchParams.get('engine')
  const weeks = parseInt(url.searchParams.get('weeks') ?? '12', 10)

  const where: Record<string, unknown> = { siteId }
  if (engine) where.engine = engine

  const scores = await prisma.geoScore.findMany({
    where,
    orderBy: { period: 'desc' },
    take: weeks * 4, // up to 4 engines × N weeks
  })

  return NextResponse.json(scores)
}
```

- [ ] **Step 2: Implement snapshots route**

Create: `apps/dashboard/app/api/sites/[id]/geo/snapshots/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@velo/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: siteId } = await params
  const url = new URL(req.url)
  const engine = url.searchParams.get('engine')
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10)

  const where: Record<string, unknown> = { siteId }
  if (engine) where.engine = engine

  const snapshots = await prisma.geoSnapshot.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json(snapshots)
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/api/sites/\[id\]/geo/
git commit -m "feat(dashboard): add GEO scores and snapshots API routes"
```

---

### Task 21: Cron Agent Loop Trigger Endpoint

**Files:**
- Create: `apps/dashboard/app/api/cron/agent-loop/route.ts`

- [ ] **Step 1: Implement secured cron endpoint**

Create: `apps/dashboard/app/api/cron/agent-loop/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@velo/db'
import { AgentLoop, LockManager } from '@velo/seo-agent'

export const maxDuration = 300 // 5 minutes (Vercel Pro/Enterprise)

export async function POST(req: NextRequest) {
  // Verify cron secret (Vercel Cron or custom auth)
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Optional: run a specific site only (for per-site cron or retry)
  const url = new URL(req.url)
  const targetSiteId = url.searchParams.get('siteId')

  // Find active agent configs
  const configs = await prisma.agentConfig.findMany({
    where: {
      isActive: true,
      ...(targetSiteId ? { siteId: targetSiteId } : {}),
    },
    select: { id: true, siteId: true },
  })

  const lockManager = new LockManager(prisma)

  // Run agent loops concurrently with Promise.allSettled (no sequential timeout)
  const promises = configs.map(async (config) => {
    const loop = new AgentLoop({
      prisma,
      lockManager,
      siteId: config.siteId,
      configId: config.id,
    })
    const result = await loop.run()
    return { siteId: config.siteId, ...result }
  })

  const settled = await Promise.allSettled(promises)
  const results = settled.map((s, i) =>
    s.status === 'fulfilled'
      ? s.value
      : { siteId: configs[i].siteId, success: false, reason: String(s.reason) },
  )

  return NextResponse.json({ processed: results.length, results })
}
```

Note: For production at scale (50+ sites), consider splitting into per-site cron jobs using Vercel's cron scheduling with the `?siteId=` parameter, or migrating to a queue-based worker.

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/api/cron/agent-loop/
git commit -m "feat(dashboard): add secured cron endpoint for agent loop trigger"
```

---

## Task Group 5: Dashboard UI Pages

### Task 22: Agent Control Center Page

**Files:**
- Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/agent/page.tsx`

- [ ] **Step 1: Read existing SEO page for component/styling patterns**

Read: `apps/dashboard/app/(dashboard)/seo/page.tsx` and `apps/dashboard/app/(dashboard)/seo/[siteId]/campaigns/page.tsx` to understand layout, data fetching, and component patterns.

- [ ] **Step 2: Implement agent control center page**

Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/agent/page.tsx`

This is a server component that fetches agent config and renders:
- Agent status toggle (on/off)
- Tier display with current plan
- Channel toggles with cadence settings
- Oversight mode selector
- Competitor URLs management
- Seed keyword management
- GEO query prompts editor (if geoEnabled)
- AI model preference (if tier allows)
- Recent run history (last 10 runs)

Use the dashboard's existing component library (`@/components/ui/card`, `@/components/stat-card`, etc.) and follow the layout patterns from existing SEO pages.

Implementation should use server-side data fetching with Prisma directly (matching the existing Next.js App Router pattern in this dashboard). Client components for interactive elements (toggles, forms) should be extracted to separate client components.

- [ ] **Step 3: Verify page renders**

Run: `cd apps/dashboard && npx next build` (or dev mode check)
Expected: No build errors

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/\[siteId\]/agent/
git commit -m "feat(dashboard): add agent control center page"
```

---

### Task 23: Opportunities Pipeline Page

**Files:**
- Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/opportunities/page.tsx`

- [ ] **Step 1: Implement opportunities pipeline page**

Kanban-style board showing content opportunities flowing through stages:
- DISCOVERED → PLANNED → GENERATING → PUBLISHED / SKIPPED
- Each card: title, keyword, signal badge (keyword gap / competitor / AI answer), score, channel
- Filter controls: signal type, channel, date range
- Click-through to content piece detail

Use existing card/badge components from the dashboard. Server component for data fetching, client component for kanban interaction.

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/\[siteId\]/opportunities/
git commit -m "feat(dashboard): add opportunities pipeline page with kanban view"
```

---

### Task 24: GEO Visibility Dashboard Page

**Files:**
- Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/geo/page.tsx`

- [ ] **Step 1: Implement GEO dashboard page**

Page layout:
- Hero metric: Overall AI Visibility Score (0-100) with trend arrow
- Engine breakdown: 4 stat cards (ChatGPT, Perplexity, Gemini, AI Overviews) with sparklines
- Citation map table: query, engine, cited (yes/no), position, competitors, last checked
- Competitor comparison bar chart
- Trend chart: weekly visibility over time per engine (line chart)

Use the existing `sparkline.tsx` and `stat-card.tsx` components already in the dashboard. For charts, check what charting library is already installed (likely Recharts or similar).

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/\[siteId\]/geo/
git commit -m "feat(dashboard): add GEO visibility dashboard with engine breakdown"
```

---

### Task 25: Approval Queue Page

**Files:**
- Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/approvals/page.tsx`

- [ ] **Step 1: Implement approval queue page**

- List of pending content with expandable preview
- Per-item: channel badge, publish date, signal source, score
- Actions: Approve / Edit & Approve / Reject / Snooze
- VETO_WINDOW items show countdown timer
- Batch actions bar: approve all, reject all
- Empty state when no pending approvals

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/\[siteId\]/approvals/
git commit -m "feat(dashboard): add approval queue page with batch actions"
```

---

### Task 26: Update SEO Hub Page

**Files:**
- Modify: `apps/dashboard/app/(dashboard)/seo/page.tsx`

- [ ] **Step 1: Read current SEO hub page**

Read: `apps/dashboard/app/(dashboard)/seo/page.tsx`

- [ ] **Step 2: Add agent status per site**

Add to each site row in the SEO hub:
- Agent status badge (active/paused/error) — from `AgentConfig.isActive` and last `AgentRun.status`
- Content produced this week count
- GEO visibility score (for Scale+ tiers)
- Pending approvals count
- Link to agent control center

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/page.tsx
git commit -m "feat(dashboard): add agent status badges to SEO hub page"
```

### Task 26b: Reports Page (Placeholder)

**Files:**
- Create: `apps/dashboard/app/(dashboard)/seo/[siteId]/reports/page.tsx`

- [ ] **Step 1: Implement reports placeholder page**

Create a server component that displays:
- Combined SEO + GEO performance summary
- Content published this period (count + list)
- GEO visibility trend (reuse sparkline from GEO dashboard)
- Placeholder for email digest configuration

This page will be expanded as the intelligence analyzers and reporting module are built. For now, it reads from existing ContentOpportunity and GeoScore models.

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/\(dashboard\)/seo/\[siteId\]/reports/
git commit -m "feat(dashboard): add reports page placeholder with basic SEO+GEO summary"
```

---

## Task Group 6: Integration & Verification

### Task 27: Run All Package Tests

- [ ] **Step 1: Run geo-monitor tests**

Run: `cd packages/infra/geo-monitor && npx vitest run`
Expected: All tests PASS

- [ ] **Step 2: Run seo-agent tests**

Run: `cd packages/infra/seo-agent && npx vitest run`
Expected: All tests PASS

- [ ] **Step 3: Run seo-engine tests (ensure no regressions)**

Run: `cd packages/infra/seo-engine && npx vitest run`
Expected: All existing tests PASS

- [ ] **Step 4: Run full typecheck**

Run: `pnpm turbo typecheck`
Expected: No type errors across all packages

- [ ] **Step 5: Commit any fixes**

If any tests or typechecks fail, fix issues and commit.

---

### Task 28: Seed Agent Test Data

**Files:**
- Create: `packages/infra/db/prisma/seed-agent.ts`

- [ ] **Step 1: Create seed script**

Create: `packages/infra/db/prisma/seed-agent.ts`

Script that creates:
- 1 AgentConfig for an existing test site (GROWTH tier, AUTO_PUBLISH, BLOG + GBP channels)
- 5 sample ContentOpportunity records across different signals and statuses
- 3 sample GeoSnapshots
- 1 sample GeoScore
- 1 completed AgentRun

Follow the existing seed pattern in `packages/infra/db/prisma/seed.ts`.

- [ ] **Step 2: Add seed script to package.json**

Add to `packages/infra/db/package.json` scripts:
```json
"db:seed-agent": "tsx prisma/seed-agent.ts"
```

- [ ] **Step 3: Run seed**

Run: `cd packages/infra/db && pnpm db:seed-agent`
Expected: Seed data created successfully

- [ ] **Step 4: Commit**

```bash
git add packages/infra/db/prisma/seed-agent.ts packages/infra/db/package.json
git commit -m "feat(db): add agent seed script with sample data"
```

---

### Task 29: Final Integration Verification

- [ ] **Step 1: Build all packages**

Run: `pnpm turbo build`
Expected: All packages build successfully

- [ ] **Step 2: Start dashboard in dev mode**

Run: `cd apps/dashboard && pnpm dev`
Verify: Navigate to `/seo` — agent status badges visible
Verify: Navigate to `/seo/[siteId]/agent` — control center renders
Verify: Navigate to `/seo/[siteId]/geo` — GEO dashboard renders

- [ ] **Step 3: Test API routes with curl**

```bash
# Get agent config
curl http://localhost:3000/api/sites/<siteId>/agent/config

# Create agent config
curl -X POST http://localhost:3000/api/sites/<siteId>/agent/config \
  -H 'Content-Type: application/json' \
  -d '{"tier":"GROWTH","channels":["BLOG","GBP"],"cadence":{"blog":{"max":2,"period":"week"}}}'

# Get opportunities
curl http://localhost:3000/api/sites/<siteId>/opportunities

# Get GEO scores
curl http://localhost:3000/api/sites/<siteId>/geo/scores
```

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git commit -m "fix: integration fixes for agent + GEO system"
```

---

## Deferred Items (Follow-up Plan)

These items are part of the spec but intentionally deferred from this plan to keep scope manageable. Each should be its own follow-up plan:

1. **Intelligence Analyzers** — KeywordAnalyzer, CompetitorAnalyzer, AiAnswerAnalyzer implementations. These fill in the TODO stubs in `AgentLoop.run()` steps 1-2. Requires GSC API integration, competitor RSS/sitemap crawling, and GEO snapshot analysis logic.

2. **GEO Engine Rate Limiting & Caching** — Per-engine daily query caps, 24h response caching, staggered query scheduling (Mon/Wed/Fri pattern from spec). Should be built into `InternalGeoProvider` before production use.

3. **Escalation Logic** — Auto-skip after 7 days unactioned, reminder emails when approval queue > 10 items. Requires a separate cron job or extending the agent loop's GATE step.

4. **Dashboard API Route Tests** — Integration tests for all API routes in Tasks 18-21. Use the existing test patterns in the dashboard.

5. **Email Notifications** — Veto window alerts, approval reminders, weekly digest emails. Requires email service provider integration.

## Parallelization Notes

- **Task Groups 2 and 3** (geo-monitor + seo-agent packages) can be built in parallel after Task Group 1 completes, since they have no dependencies on each other.
- **Task Group 4** (API routes) depends on both packages being built.
- **Task Group 5** (UI pages) depends on API routes.
