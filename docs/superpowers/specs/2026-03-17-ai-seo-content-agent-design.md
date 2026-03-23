# Phase 4A: AI SEO & Content Agent — Design Spec

**Date:** 2026-03-17
**Status:** Draft
**Author:** Yohanes + Claude

## Overview

The AI SEO & Content Agent is the first of five AI-agent products in the Velocity platform's evolution from a template platform to an AI-powered business operating system. It generates SEO-optimized content across multiple channels (blog, Google Business Profile, social media, email) using a campaign-based workflow operated by the agency team.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary user | Agency-operated | Aligns with consulting model, simpler UX (one user type) |
| Core output | Full content engine | Blog + GBP + social + email in MVP |
| Blog publishing | Static generation (MDX) | Best SEO performance, simple architecture |
| Keyword intelligence | Layered (vertical+location MVP) | Zero-cost launch, architected for GSC/SEO APIs later |
| Content cadence | Campaign-based | Sells strategy not articles, justifies premium pricing |
| Non-blog channels | Dashboard-only (copy/paste) MVP | Validates content quality first, architected toward API publishing |
| Dashboard placement | Per-client scoped | Consistent with existing dashboard structure |
| AI model | Model-agnostic via interface | Future-proofs for cost optimization |
| Architecture | Domain module (Approach B) | SEO is an active workflow, not a passive integration |

## 1. Data Model

Five new Prisma models added to `packages/infra/db/prisma/schema.prisma`.

### Campaign

The strategic container. One per client site per SEO initiative.

```prisma
model Campaign {
  id             String         @id @default(cuid())
  site           Site           @relation(fields: [siteId], references: [id], onDelete: Cascade)
  siteId         String
  name           String
  goal           String?
  status         CampaignStatus @default(DRAFT)
  channels       Channel[]
  totalPieces    Int
  publishedCount Int            @default(0)
  schedule       Json           // CampaignSchedule (see TypeScript types below)
  keywordTargets Json           // KeywordTarget[] (see TypeScript types below)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  contentPieces  ContentPiece[]

  @@index([siteId])
  @@map("campaigns")
}

enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
}
```

**TypeScript types for JSON fields:**

```typescript
interface CampaignSchedule {
  startDate: string;       // ISO date
  endDate: string;         // ISO date
  frequency: "daily" | "2x_week" | "3x_week" | "weekly" | "biweekly" | "monthly";
  preferredDays?: number[]; // 0=Sun, 1=Mon, etc.
}

interface KeywordTarget {
  keyword: string;
  volume?: number;
  difficulty?: number;
  intent: "INFORMATIONAL" | "TRANSACTIONAL" | "NAVIGATIONAL" | "LOCAL";
  source: "VERTICAL" | "GSC" | "SERPAPI" | "SEMRUSH" | "MANUAL";
}
```

### ContentPiece

A single unit of content for any channel. The `siteId` field is denormalized from `campaign.siteId` for query performance — the API layer enforces consistency on write.

```prisma
model ContentPiece {
  id                String             @id @default(cuid())
  campaign          Campaign           @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  campaignId        String
  site              Site               @relation(fields: [siteId], references: [id], onDelete: Cascade)
  siteId            String             // Denormalized from campaign.siteId for query perf
  channel           Channel
  status            ContentPieceStatus @default(PLANNED)
  title             String
  slug              String?
  targetKeyword     String?
  outline           String?            // Brief/outline from content plan (used during generation)
  content           Json?              // Per-channel typed content (see below)
  metaData          Json?              // SEO metadata (see below)
  scheduledFor      DateTime?
  publishedAt       DateTime?
  modelUsed         String?
  contentTemplateId String?            // Which ContentTemplate produced this
  contentTemplate   ContentTemplate?   @relation(fields: [contentTemplateId], references: [id])
  generatedAt       DateTime?
  reviewedBy        String?
  reviewer          User?              @relation("ContentReviewer", fields: [reviewedBy], references: [id])
  reviewNote        String?
  tokenCount        Int?               // Tokens used for generation (cost tracking)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  @@index([siteId])
  @@index([campaignId])
  @@index([status])
  @@index([scheduledFor])             // Supports batch generation date-range queries
  @@map("content_pieces")
}

enum Channel {
  BLOG
  GBP
  SOCIAL
  EMAIL
}

enum ContentPieceStatus {
  PLANNED
  GENERATING
  DRAFT
  FAILED                               // Generation failed after retries
  IN_REVIEW
  APPROVED
  PUBLISHED
  REJECTED
}
```

**TypeScript types for per-channel `content` JSON field:**

```typescript
interface BlogContent {
  markdown: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    keywords: string[];
    image?: string;
    author: string;
    category?: string;
    readingTime: number;
  };
}

interface GBPContent {
  body: string;          // max 1500 chars
  ctaType: "BOOK" | "ORDER" | "LEARN_MORE" | "CALL" | "VISIT";
  ctaUrl?: string;
}

interface SocialContent {
  caption: string;       // platform-aware length
  hashtags: string[];
  platform: "instagram" | "facebook" | "twitter";
  imagePrompt?: string;  // AI-suggested image description
}

interface EmailContent {
  subjectLine: string;
  previewText: string;
  body: string;          // HTML or markdown
  ctaLabel: string;
  ctaUrl: string;
}

interface ContentMetaData {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  schemaMarkup?: Record<string, unknown>; // JSON-LD
}
```

### KeywordSource

Pluggable keyword intelligence providers.

```prisma
model KeywordSource {
  id         String          @id @default(cuid())
  site       Site            @relation(fields: [siteId], references: [id], onDelete: Cascade)
  siteId     String
  provider   KeywordProvider
  config     Json            @default("{}")
  enabled    Boolean         @default(true)
  lastSyncAt DateTime?
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
  keywords   KeywordData[]

  @@unique([siteId, provider])
  @@map("keyword_sources")
}

enum KeywordProvider {
  VERTICAL
  GSC
  SERPAPI
  SEMRUSH
}
```

### KeywordData

Cached keyword intelligence from any source.

```prisma
model KeywordData {
  id           String        @id @default(cuid())
  source       KeywordSource @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  sourceId     String
  keyword      String
  volume       Int?
  difficulty   Int?
  intent       KeywordIntent
  relatedTerms String[]
  fetchedAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@unique([sourceId, keyword])
  @@index([sourceId])
  @@map("keyword_data")
}

enum KeywordIntent {
  INFORMATIONAL
  TRANSACTIONAL
  NAVIGATIONAL
  LOCAL
}
```

### ContentTemplate

Reusable prompt templates per vertical and channel. Linked to `ContentPiece` for auditability.

```prisma
model ContentTemplate {
  id             String         @id @default(cuid())
  vertical       String
  channel        Channel
  name           String
  promptTemplate String         // Can be 1000+ words for well-tuned prompts
  outputSchema   Json
  tone           String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  contentPieces  ContentPiece[]

  @@unique([vertical, channel, name])
  @@map("content_templates")
}

// Note: Template versioning (tracking which version of a prompt produced a piece)
// is a future enhancement. For MVP, contentTemplateId links the piece to the
// current template. If prompt archaeology is needed, the actual prompt used
// can be reconstructed from the template + piece context at generation time.
```

### Site Model Additions

```prisma
// Added to existing Site model:
campaigns      Campaign[]
contentPieces  ContentPiece[]
keywordSources KeywordSource[]
```

### User Model Addition

```prisma
// Added to existing User model:
reviewedContent ContentPiece[] @relation("ContentReviewer")
```

## 2. Package Architecture — @velo/seo-engine

Located at `packages/infra/seo-engine/`.

```
packages/infra/seo-engine/
├── package.json              — { "velo": { "type": "infra" } }
├── src/
│   ├── index.ts              — public exports
│   │
│   ├── types/                — TypeScript interfaces
│   │   ├── campaign.ts       — CampaignSchedule, KeywordTarget
│   │   ├── content.ts        — BlogContent, GBPContent, SocialContent, EmailContent
│   │   └── keyword.ts        — KeywordSuggestion
│   │
│   ├── campaign/             — Campaign lifecycle
│   │   ├── planner.ts        — AI generates content plan from campaign brief
│   │   ├── scheduler.ts      — Maps plan to calendar dates
│   │   └── executor.ts       — Walks the schedule, triggers content generation
│   │
│   ├── content/              — Content generation pipeline
│   │   ├── generator.ts      — Orchestrator: picks model + template, generates, validates
│   │   ├── channels/         — Channel-specific formatters
│   │   │   ├── blog.ts       — MDX output + frontmatter + meta tags
│   │   │   ├── gbp.ts        — GBP post format (1500 char limit, CTA type)
│   │   │   ├── social.ts     — Platform-specific: IG caption, FB post, hashtags
│   │   │   └── email.ts      — Subject line + body + CTA
│   │   └── channel.ts        — ChannelFormatter interface
│   │
│   ├── keywords/             — Keyword intelligence layer
│   │   ├── source.ts         — KeywordSourceProvider interface
│   │   ├── vertical.ts       — Built-in: keywords from vertical + location
│   │   ├── gsc.ts            — Stub: Google Search Console (future)
│   │   └── serpapi.ts        — Stub: SerpAPI/SEMrush (future)
│   │
│   ├── ai/                   — Model abstraction
│   │   ├── model.ts          — ContentModel interface
│   │   ├── claude.ts         — Claude adapter (default)
│   │   └── openai.ts         — OpenAI adapter (stub)
│   │
│   └── publish/              — Post-approval pipeline
│       ├── publisher.ts      — Publisher interface
│       ├── mdx-writer.ts     — Writes MDX to git repo via API
│       ├── deploy-trigger.ts — Triggers rebuild (Vercel deploy hook)
│       └── crypto.ts         — AES-256-GCM encrypt/decrypt for repo tokens
```

### Core Interfaces

```typescript
// ai/model.ts
interface ContentModel {
  generate(prompt: string, options?: ModelOptions): Promise<string>;
  name: string;
}

interface ModelOptions {
  maxTokens?: number;
  temperature?: number;
}

// keywords/source.ts — renamed to avoid Prisma collision
interface KeywordSourceProvider {
  provider: string;
  getKeywords(
    vertical: string,
    location: string,
    channels: Channel[]
  ): Promise<KeywordSuggestion[]>;
}

interface KeywordSuggestion {
  keyword: string;
  intent: "INFORMATIONAL" | "TRANSACTIONAL" | "NAVIGATIONAL" | "LOCAL";
  channel: Channel; // uses Prisma enum values: BLOG, GBP, SOCIAL, EMAIL
  volume?: number;
  difficulty?: number;
}

// content/channel.ts — renamed to ChannelFormatter to avoid Prisma enum collision
interface ChannelFormatter {
  channel: Channel; // uses Prisma enum values
  formatPrompt(piece: ContentPiece, template: ContentTemplate): string;
  validateOutput(raw: string): {
    valid: boolean;
    parsed?: BlogContent | GBPContent | SocialContent | EmailContent;
    errors?: string[];
  };
  maxLength?: number;
}

// publish/publisher.ts
interface Publisher {
  publish(
    piece: ContentPiece,
    site: Site
  ): Promise<{ success: boolean; url?: string }>;
}
```

**Naming convention:** All TypeScript interfaces use distinct names from Prisma-generated types. The Prisma enum `Channel` is used as-is (UPPER_CASE values) throughout the codebase — no lowercase aliases.

### Content Generation Flow

```
Campaign.executor walks schedule
  → finds next PLANNED piece due today
  → sets status GENERATING
  → generator.ts picks ContentModel + ContentTemplate + ChannelFormatter
  → KeywordSourceProvider enriches the prompt with keyword data
  → ContentModel.generate() produces raw output
  → ChannelFormatter.validateOutput() checks structure
  → stores result in ContentPiece.content as JSON
  → records contentTemplateId and tokenCount
  → sets status DRAFT (auto) or IN_REVIEW (if campaign requires review)
  → agency reviews in dashboard → APPROVED or REJECTED
  → on APPROVED: Publisher writes MDX / stores for copy-paste
  → sets status PUBLISHED
```

## 3. Execution Model — Async Generation

LLM content generation takes 10-30 seconds per piece. All generation endpoints use an async pattern:

### Single Piece Generation

1. `POST /api/sites/[id]/seo/content/[pid]/generate` receives request
2. Validates auth (NextAuth session) and site ownership
3. Sets `ContentPiece.status` → `GENERATING`, returns `202 Accepted` with piece ID immediately
4. Spawns async generation (Node.js `Promise` — no external queue for MVP)
5. On success: updates `status` → `DRAFT`, stores `content`, `modelUsed`, `tokenCount`, `generatedAt`
6. On failure (API error, validation failure after retries): updates `status` → `DRAFT` with `reviewNote` containing error details
7. Dashboard polls `GET /api/sites/[id]/seo/content/[pid]` to check status (2-second interval while `GENERATING`)

### Batch Generation ("Generate Next Batch")

1. `POST /api/sites/[id]/seo/campaigns/[cid]/generate-batch` receives request
2. Finds all `PLANNED` pieces with `scheduledFor` within next 7 days
3. Sets all to `GENERATING`, returns `202 Accepted` with piece IDs
4. Processes pieces sequentially (not parallel) to respect API rate limits
5. Dashboard shows progress: "Generating 3/8 pieces..."

### Error Handling

| Scenario | Behavior |
|----------|----------|
| AI model API down | Status stays `GENERATING` → timeout after 60s → `FAILED` with error note |
| AI model rate limited | Exponential backoff (1s, 2s, 4s), max 3 retries, then `FAILED` |
| Empty/nonsensical response | Retry with "Previous response was invalid" feedback, max 2 retries, then `FAILED` |
| Validation failure | Retry with specific error feedback, max 2 retries, then `DRAFT` with warnings (content exists but has issues) |
| Dashboard API timeout | 202 response already sent — generation continues in background |

**Status distinction:** `FAILED` means generation could not produce any content (API error, empty response). `DRAFT` with `reviewNote` means content was generated but has validation warnings. The dashboard shows `FAILED` pieces with a red indicator and a "Retry" button.

### Cost Guardrails

- `tokenCount` tracked per `ContentPiece` for billing visibility
- Maximum 20 pieces per batch generation request
- Maximum 3 concurrent generations per site (queued beyond that)
- Dashboard shows monthly token usage per site in SEO Overview

## 4. Blog Publishing Pipeline

The dashboard runs as a server process. Template apps are deployed as static builds on Vercel. MDX files must get from the dashboard into the template app's source tree.

### Approach: Git-based Publishing

```
Dashboard approves article
  → mdx-writer.ts generates MDX string from BlogContent
  → Calls GitHub/Bitbucket API to commit MDX file to the site's repo
  → Commit triggers Vercel auto-deploy (standard Vercel git integration)
  → Vercel builds the app, generateStaticParams picks up new MDX
  → Blog post is live
```

**Implementation details:**

1. **Site config stores repo connection:** New fields on `Site` model:
   ```prisma
   // Added to Site model:
   repoUrl       String?    // "github.com/org/repo" or "bitbucket.org/org/repo"
   repoBranch    String?    // "main" by default
   repoToken     String?    // Encrypted PAT for API access
   ```

2. **mdx-writer.ts** uses the GitHub Contents API (`PUT /repos/{owner}/{repo}/contents/{path}`) or Bitbucket equivalent to create/update files:
   - Path: `content/blog/{slug}.mdx`
   - Commit message: `"chore(blog): publish '{title}'" `
   - Branch: site's configured branch

3. **Vercel auto-deploys** on push (standard setup, no custom deploy hooks needed)

4. **Fallback for local/monorepo development:** When `repoUrl` is not configured, `mdx-writer.ts` writes directly to the local filesystem (for development/testing within the monorepo)

**Why git-based:**
- Vercel already watches git repos — no additional deployment infrastructure
- MDX files are version-controlled — full audit trail
- Rollback is a git revert
- Works with any git hosting (GitHub, Bitbucket, GitLab)

## 5. Blog System — @velo/blog

Located at `packages/sections/blog/`.

```
packages/sections/blog/
├── package.json              — { "velo": { "type": "section" } }
├── src/
│   ├── index.ts
│   ├── BlogList.tsx          — Grid/list of article cards
│   ├── BlogPost.tsx          — Single article layout (prose, ToC, related)
│   ├── BlogCard.tsx          — Individual article card component
│   ├── mdx-utils.ts          — Frontmatter parser, reading time, slug helpers
│   └── mdx-components.tsx    — MDX component provider (maps custom elements)
```

### MDX File Structure

```
apps/{client-app}/content/blog/
├── best-brunch-seminyak.mdx
├── how-to-choose-villa-bali.mdx
└── ...
```

### Frontmatter Schema

```yaml
---
title: "Best Brunch Spots in Seminyak"
description: "Discover the top 8 brunch restaurants in Seminyak..."
date: "2026-03-20"
keywords: ["brunch seminyak", "bali restaurants"]
image: "/images/blog/brunch-seminyak.jpg"
author: "Velocity AI"
category: "dining"
readingTime: 5
---
```

### Next.js Routing

Blog pages live under the existing `[locale]` route to maintain i18n consistency:

```
apps/{client-app}/app/[locale]/blog/
├── page.tsx                  — Blog listing (generateStaticParams for all MDX)
└── [slug]/
    └── page.tsx              — Single post (generateStaticParams per MDX file)
```

Blog content is in English for MVP. The `[locale]` prefix ensures proper layout inheritance (nav, footer, theme). Multi-language blog content is a future enhancement via locale-specific MDX directories (`content/blog/en/`, `content/blog/id/`).

### SEO Enhancements

- Auto-generated `<meta>` tags from frontmatter
- JSON-LD `Article` schema markup injected by `BlogPost`
- Auto-generated sitemap entries via `app/sitemap.ts`
- `robots.txt` referencing sitemap

### Styling

- Inherits template theme via CSS variables from `@velo/theme`
- Uses `prose` classes with theme-aware colors
- `BlogList` respects template card patterns
- `MotionSection` wrapper from `@velo/motion-components`
- `mdx-components.tsx` provides MDX component resolution for custom elements

### Image Handling

Blog images are out of scope for MVP. The `image` frontmatter field accepts a path string. For MVP, the AI generates a descriptive `imagePrompt` field on `SocialContent` and a placeholder path for `BlogContent`. Future enhancement: integrate with an image generation API or Unsplash API to auto-source relevant images.

### Not in Scope

- No comments system
- No category/tag pages (frontmatter field for future use)
- No RSS feed
- No pagination (static list sufficient for <100 articles)

## 6. Dashboard UI

Routes nested under existing client site navigation. Flattened from the original 4-level nesting to match existing dashboard patterns:

```
apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/
├── page.tsx                          — SEO Overview
├── campaigns/
│   ├── new/page.tsx                  — Campaign creation wizard
│   └── [campaignId]/page.tsx         — Campaign detail + content calendar
├── content/
│   └── [pieceId]/page.tsx            — Content piece editor/reviewer
```

Content pieces are accessed via `/seo/content/[pieceId]` (flat) rather than nested under campaigns. The campaign context is shown in the piece editor UI via the `campaignId` relation.

### SEO Overview (`/seo`)

- Campaign cards grid: name, status badge, progress bar, channel icons, date range
- "New Campaign" button
- Quick stats: total published, total pieces, next scheduled date
- Lighthouse SEO score from latest `QAReport` (if available)
- Monthly token usage indicator

### Campaign Creation Wizard (`/seo/campaigns/new`)

Three-step flow:

1. **Brief**: name, goal, channel checkboxes, date range, frequency dropdown
2. **Keywords**: AI-generated suggestions from vertical+location, selectable list, manual addition
3. **Content Plan**: AI-generated calendar of pieces (title, channel, keyword, date), reorderable, editable, regenerable. Approve → bulk-creates Campaign + ContentPiece records

### Campaign Detail (`/seo/campaigns/[campaignId]`)

- Content calendar: timeline/list, color-coded by status
- Channel filter tabs: All | Blog | GBP | Social | Email
- Bulk actions: "Generate Next Batch" (max 20 pieces), "Approve All Drafts"
- Campaign stats: pieces by status, velocity, keyword coverage

### Content Piece Editor (`/seo/content/[pieceId]`)

- Left panel: content preview (markdown for blog, plain text for others)
- Right panel: metadata (keyword, date, channel, model, template used, token count, timestamps)
- Actions: Approve, Reject (with note), Regenerate (with feedback prompt), Edit inline
- Channel-specific indicators: word count (blog), character count (GBP/social), hashtag count
- Status polling: auto-refreshes while status is `GENERATING` (2-second interval)

### API Routes

All routes require NextAuth session authentication and verify the authenticated user owns the site via `site.ownerId === session.user.id`.

```
/api/sites/[id]/seo/campaigns                       — GET, POST
/api/sites/[id]/seo/campaigns/[cid]                 — GET, PUT, DELETE
/api/sites/[id]/seo/campaigns/[cid]/generate-plan   — POST (async, returns 202)
/api/sites/[id]/seo/campaigns/[cid]/generate-batch   — POST (async, returns 202)
/api/sites/[id]/seo/content                          — GET (filterable by campaign, channel, status)
/api/sites/[id]/seo/content/[pid]                    — GET, PUT
/api/sites/[id]/seo/content/[pid]/generate           — POST (async, returns 202)
/api/sites/[id]/seo/content/[pid]/publish            — POST
/api/sites/[id]/seo/keywords                         — GET
```

## 7. AI Content Generation Pipeline

### Stage 1: Keyword Enrichment

Vertical provider (MVP) generates keywords from:
- Template `businessType` from `template.json`
- Client location (campaign config)
- Channel intent (blog=informational, GBP=local/transactional)
- Current month for seasonal relevance

### Stage 2: Content Plan Generation

`campaign/planner.ts` sends brief + keywords to AI, returns structured plan:

```typescript
interface ContentPlan {
  pieces: Array<{
    title: string;
    channel: Channel;
    targetKeyword: string;
    scheduledFor: string; // ISO date
    outline: string;
  }>;
}
```

Plan is reviewed by agency, then bulk-creates `ContentPiece` records on approval.

### Stage 3: Piece Generation

For each due `PLANNED` piece (see Section 3 for async execution model):

1. Select `ContentTemplate` matching vertical + channel, record `contentTemplateId`
2. Build prompt via `ChannelFormatter.formatPrompt()` with piece context, business info, existing pieces (dedup)
3. Call `ContentModel.generate()`, record `tokenCount` from response
4. Validate via `ChannelFormatter.validateOutput()`:
   - Blog: valid markdown, has H1, 800+ words, frontmatter fields
   - GBP: under 1500 chars, has CTA
   - Social: under platform limits, has hashtags
   - Email: has subject, body, CTA
5. Store typed content in `ContentPiece.content`, status → `DRAFT`
6. Auto-retry on validation failure (max 2 retries with error feedback), then `DRAFT` with warnings

### Stage 4: Publish

On `APPROVED` status:

- **Blog**: `mdx-writer.ts` generates MDX with frontmatter → commits to site's git repo via API → Vercel auto-deploys (see Section 4)
- **GBP / Social / Email**: stored as-is, displayed in dashboard with copy-to-clipboard. Status → `PUBLISHED`

### Prompt Engineering

Each vertical + channel gets a `ContentTemplate` with optimized system prompt. Seeded via `prisma/seed-seo-templates.ts`.

**Phased seeding approach:** Start with 6 original verticals (velocity, ember, haven, nexus, prism, serenity) × 4 channels = 24 templates. Phase 3 verticals (tropica, medica, lexis, forma) added in a follow-up seed. Templates are AI-assisted in authoring but human-reviewed before seeding.

Example prompts tuned per vertical:
- Restaurant blog: warm tone, local landmarks, dish recommendations, price ranges
- Law firm GBP: authoritative, no legal advice, awareness-focused
- Real estate social: property highlights, lifestyle imagery, location selling points

## 8. Configuration & API Keys

### AI Model Configuration

- Global `ANTHROPIC_API_KEY` environment variable in the dashboard's `.env`
- Optional `OPENAI_API_KEY` for the OpenAI adapter
- Model selection per `ContentTemplate` (default: `claude-sonnet-4`) — allows using cheaper models for simpler channels

### Cost Tracking

- `tokenCount` on each `ContentPiece` tracks input+output tokens per generation
- SEO Overview dashboard shows monthly token usage per site
- Future: per-client billing based on aggregated token usage

### Git Repository Connection

- `repoUrl`, `repoBranch`, `repoToken` on `Site` model
- `repoToken` encrypted at application level using `aes-256-gcm` with a `REPO_TOKEN_ENCRYPTION_KEY` env var. Encrypt before Prisma write, decrypt on read. Helper functions in `seo-engine/src/publish/crypto.ts`
- Configured in dashboard Site Settings when enabling blog publishing
- Not required for non-blog channels

## 9. Integration Points

### Existing ai-content Tool

Separate concerns: `ai-content` generates initial site content, SEO engine generates ongoing marketing content. No merge. Shared `ContentModel` interface possible as optional refactor.

### Prisma Migration

Single migration `add_seo_engine_models`. Non-breaking — only adds new models and relations to `Site` and `User`.

### Dashboard Navigation

SEO added as new tab in Client → Site detail view:
```
Client → Site → [Overview | Content | Integrations | QA Reports | SEO]
```

### QA Pipeline

No changes to `tools/qa/`. SEO Overview page pulls latest `QAReport` Lighthouse SEO score for display alongside campaign metrics.

### Analytics Integration

- MVP: no direct connection
- Future: GSC keyword source reads traffic data → feeds campaign targeting
- Future: pageviews per blog post via analytics correlation

### Template Theming

`@velo/blog` components consume CSS variables from `@velo/theme`. Blog pages use `MotionSection` wrapper. Visual consistency automatic.

### Content Template Seeding

24 `ContentTemplate` records seeded initially (6 verticals × 4 channels) via `prisma/seed-seo-templates.ts`. Expanded to 52 as Phase 3 verticals mature.

## 10. Files Modified/Created

| Location | Change |
|----------|--------|
| `packages/infra/seo-engine/` | **New** — core engine package |
| `packages/sections/blog/` | **New** — blog section components |
| `packages/infra/db/prisma/schema.prisma` | **Modified** — 5 new models, Site + User relations, 3 new Site fields |
| `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/` | **New** — dashboard pages |
| `apps/dashboard/app/api/sites/[id]/seo/` | **New** — API routes |
| `apps/{template}/app/[locale]/blog/` | **New** — blog route pages (under locale, per template) |
| `apps/{template}/content/blog/` | **New** — MDX files directory (created by engine) |
| `apps/{template}/app/sitemap.ts` | **New** — sitemap with blog URLs |
| Dashboard sidebar/tabs | **Modified** — add SEO nav link |

No other existing files are modified.
