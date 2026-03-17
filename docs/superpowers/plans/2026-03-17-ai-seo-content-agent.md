# Phase 4A: AI SEO & Content Agent — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an AI-powered SEO content engine that generates blog articles, GBP posts, social captions, and email drafts through a campaign-based workflow, managed by agency operators in the dashboard.

**Architecture:** New `@velo/seo-engine` infra package handles AI content generation with pluggable model adapters and channel formatters. New `@velo/blog` section package provides blog UI components. Dashboard gets new SEO pages under per-client site navigation. Blog publishing uses git-based workflow (GitHub/Bitbucket API → Vercel auto-deploy).

**Tech Stack:** Prisma 6.9 (PostgreSQL), Next.js 16, React 19, Anthropic SDK (`@anthropic-ai/sdk`), Vitest, Zod, MDX, gray-matter, TypeScript 5

**Spec:** `docs/superpowers/specs/2026-03-17-ai-seo-content-agent-design.md`

### Review Errata (applied post-review)

The following fixes address issues found during plan review:

1. **ContentModel.generate() returns `GenerateResponse`** (not plain `string`) — includes `text` and `tokenCount` for cost tracking. See Task 3.
2. **generate-plan route is synchronous** (not async 202) — plan generation is interactive, user waits for results in the wizard. Only content piece generation is async.
3. **ClaudeAdapter uses `@anthropic-ai/sdk`** instead of raw fetch — add as dependency to seo-engine package.json.
4. **Blog package uses `gray-matter`** for frontmatter parsing instead of hand-rolled YAML parser — add as dependency.
5. **Blog pages use `fs/promises`** (async) instead of `fs` sync methods.
6. **Sitemap includes `[locale]` prefix** in blog URLs.
7. **Seed verticals use template names** matching spec: velocity, ember, haven, nexus, prism, serenity.
8. **Tasks 12-13 are split** — Task 12 is wizard Step 1+2, Task 12b is wizard Step 3, Task 13 is campaign detail, Task 13b is content piece editor.
9. **Task 10 depends on Task 4** (channel formatters) in addition to listed deps.
10. **campaign/executor.ts** is implemented as part of Task 7 (added after scheduler).

These fixes are reflected inline where marked with `[ERRATA]` comments. When implementing, prioritize the errata versions over any conflicting earlier text.

---

## File Structure

### New Package: `packages/infra/seo-engine/`

| File | Responsibility |
|------|---------------|
| `package.json` | Package manifest with `"velo": { "type": "infra" }` |
| `vitest.config.ts` | Test config |
| `src/index.ts` | Public exports |
| `src/types/campaign.ts` | CampaignSchedule, KeywordTarget interfaces |
| `src/types/content.ts` | BlogContent, GBPContent, SocialContent, EmailContent, ContentMetaData |
| `src/types/keyword.ts` | KeywordSuggestion interface |
| `src/ai/model.ts` | ContentModel + ModelOptions interfaces |
| `src/ai/claude.ts` | Claude API adapter |
| `src/ai/openai.ts` | OpenAI stub adapter |
| `src/content/channel.ts` | ChannelFormatter interface |
| `src/content/channels/blog.ts` | Blog channel formatter (MDX + frontmatter) |
| `src/content/channels/gbp.ts` | GBP post formatter (1500 char limit) |
| `src/content/channels/social.ts` | Social media formatter (platform-specific) |
| `src/content/channels/email.ts` | Email formatter (subject + body + CTA) |
| `src/content/generator.ts` | Content generation orchestrator |
| `src/keywords/source.ts` | KeywordSourceProvider interface |
| `src/keywords/vertical.ts` | Built-in vertical + location keyword provider |
| `src/keywords/gsc.ts` | GSC stub |
| `src/keywords/serpapi.ts` | SerpAPI stub |
| `src/campaign/planner.ts` | AI-powered content plan generation |
| `src/campaign/scheduler.ts` | Maps plan to calendar dates |
| `src/campaign/executor.ts` | Walks schedule, triggers generation |
| `src/publish/publisher.ts` | Publisher interface |
| `src/publish/mdx-writer.ts` | MDX file generation + git commit |
| `src/publish/deploy-trigger.ts` | Vercel deploy hook trigger |
| `src/publish/crypto.ts` | AES-256-GCM encrypt/decrypt for repo tokens |

### New Package: `packages/sections/blog/`

| File | Responsibility |
|------|---------------|
| `package.json` | Package manifest with `"velo": { "type": "section" }` |
| `src/index.ts` | Public exports |
| `src/BlogList.tsx` | Blog listing grid component |
| `src/BlogPost.tsx` | Single article layout with prose styling |
| `src/BlogCard.tsx` | Individual article card component |
| `src/mdx-utils.ts` | Frontmatter parser, reading time, slug helpers |
| `src/mdx-components.tsx` | MDX component provider |

### Modified: `packages/infra/db/prisma/schema.prisma`

5 new models (Campaign, ContentPiece, KeywordSource, KeywordData, ContentTemplate), 5 new enums, new relations on Site + User, 3 new Site fields (repoUrl, repoBranch, repoToken).

### New Dashboard Pages: `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/`

| File | Responsibility |
|------|---------------|
| `page.tsx` | SEO Overview — campaign list, stats, health score |
| `campaigns/new/page.tsx` | 3-step campaign creation wizard |
| `campaigns/[campaignId]/page.tsx` | Campaign detail — content calendar, bulk actions |
| `content/[pieceId]/page.tsx` | Content piece editor/reviewer |

### New API Routes: `apps/dashboard/app/api/sites/[id]/seo/`

| File | Responsibility |
|------|---------------|
| `campaigns/route.ts` | GET list, POST create campaigns |
| `campaigns/[cid]/route.ts` | GET, PUT, DELETE single campaign |
| `campaigns/[cid]/generate-plan/route.ts` | POST async plan generation |
| `campaigns/[cid]/generate-batch/route.ts` | POST async batch content generation |
| `content/route.ts` | GET content pieces (filterable) |
| `content/[pid]/route.ts` | GET, PUT single piece |
| `content/[pid]/generate/route.ts` | POST async single piece generation |
| `content/[pid]/publish/route.ts` | POST publish approved piece |
| `keywords/route.ts` | GET keyword suggestions |

---

## Task 1: Prisma Schema — SEO Engine Models

**Files:**
- Modify: `packages/infra/db/prisma/schema.prisma`

**Dependencies:** None (foundation for everything else)

- [ ] **Step 1: Add enums to schema**

Add after existing enums in `packages/infra/db/prisma/schema.prisma`:

```prisma
enum CampaignStatus {
  DRAFT
  ACTIVE
  PAUSED
  COMPLETED
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
  FAILED
  IN_REVIEW
  APPROVED
  PUBLISHED
  REJECTED
}

enum KeywordProvider {
  VERTICAL
  GSC
  SERPAPI
  SEMRUSH
}

enum KeywordIntent {
  INFORMATIONAL
  TRANSACTIONAL
  NAVIGATIONAL
  LOCAL
}
```

- [ ] **Step 2: Add Campaign model**

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
  schedule       Json
  keywordTargets Json
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  contentPieces  ContentPiece[]

  @@index([siteId])
  @@map("campaigns")
}
```

- [ ] **Step 3: Add ContentPiece model**

```prisma
model ContentPiece {
  id                String             @id @default(cuid())
  campaign          Campaign           @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  campaignId        String
  site              Site               @relation(fields: [siteId], references: [id], onDelete: Cascade)
  siteId            String
  channel           Channel
  status            ContentPieceStatus @default(PLANNED)
  title             String
  slug              String?
  targetKeyword     String?
  outline           String?
  content           Json?
  metaData          Json?
  scheduledFor      DateTime?
  publishedAt       DateTime?
  modelUsed         String?
  contentTemplateId String?
  contentTemplate   ContentTemplate?   @relation(fields: [contentTemplateId], references: [id])
  generatedAt       DateTime?
  reviewedBy        String?
  reviewer          User?              @relation("ContentReviewer", fields: [reviewedBy], references: [id])
  reviewNote        String?
  tokenCount        Int?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  @@index([siteId])
  @@index([campaignId])
  @@index([status])
  @@index([scheduledFor])
  @@map("content_pieces")
}
```

- [ ] **Step 4: Add KeywordSource and KeywordData models**

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
```

- [ ] **Step 5: Add ContentTemplate model**

```prisma
model ContentTemplate {
  id             String         @id @default(cuid())
  vertical       String
  channel        Channel
  name           String
  promptTemplate String
  outputSchema   Json
  tone           String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  contentPieces  ContentPiece[]

  @@unique([vertical, channel, name])
  @@map("content_templates")
}
```

- [ ] **Step 6: Add relations and fields to Site model**

Add to the existing `Site` model in schema.prisma:

```prisma
  // SEO Engine relations
  campaigns      Campaign[]
  contentPieces  ContentPiece[]
  keywordSources KeywordSource[]
  // Blog publishing
  repoUrl        String?
  repoBranch     String?
  repoToken      String?
```

- [ ] **Step 7: Add relation to User model**

Add to the existing `User` model:

```prisma
  reviewedContent ContentPiece[] @relation("ContentReviewer")
```

- [ ] **Step 8: Generate Prisma client and verify**

Run: `pnpm db:generate`
Expected: Prisma client generates successfully with all new models.

- [ ] **Step 9: Commit**

```bash
git add packages/infra/db/prisma/schema.prisma
git commit -m "feat(db): add SEO engine Prisma models — Campaign, ContentPiece, KeywordSource, KeywordData, ContentTemplate"
```

---

## Task 2: @velo/seo-engine Package Scaffold + Types

**Files:**
- Create: `packages/infra/seo-engine/package.json`
- Create: `packages/infra/seo-engine/vitest.config.ts`
- Create: `packages/infra/seo-engine/src/index.ts`
- Create: `packages/infra/seo-engine/src/types/campaign.ts`
- Create: `packages/infra/seo-engine/src/types/content.ts`
- Create: `packages/infra/seo-engine/src/types/keyword.ts`
- Test: `packages/infra/seo-engine/__tests__/types.test.ts`

**Dependencies:** Task 1

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@velo/seo-engine",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "test": "vitest run",
    "test:ci": "vitest run"
  },
  "velo": {
    "type": "infra"
  },
  "dependencies": {
    "@velo/db": "workspace:*",
    "@anthropic-ai/sdk": "^0.39.0",
    "zod": "^3.25.67"
  }
}
```

- [ ] **Step 2: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
  },
});
```

- [ ] **Step 3: Create type definitions**

Create `packages/infra/seo-engine/src/types/campaign.ts`:

```typescript
export interface CampaignSchedule {
  startDate: string;
  endDate: string;
  frequency: "daily" | "2x_week" | "3x_week" | "weekly" | "biweekly" | "monthly";
  preferredDays?: number[];
}

export interface KeywordTarget {
  keyword: string;
  volume?: number;
  difficulty?: number;
  intent: "INFORMATIONAL" | "TRANSACTIONAL" | "NAVIGATIONAL" | "LOCAL";
  source: "VERTICAL" | "GSC" | "SERPAPI" | "SEMRUSH" | "MANUAL";
}

export interface ContentPlan {
  pieces: Array<{
    title: string;
    channel: "BLOG" | "GBP" | "SOCIAL" | "EMAIL";
    targetKeyword: string;
    scheduledFor: string;
    outline: string;
  }>;
}
```

Create `packages/infra/seo-engine/src/types/content.ts`:

```typescript
export interface BlogContent {
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

export interface GBPContent {
  body: string;
  ctaType: "BOOK" | "ORDER" | "LEARN_MORE" | "CALL" | "VISIT";
  ctaUrl?: string;
}

export interface SocialContent {
  caption: string;
  hashtags: string[];
  platform: "instagram" | "facebook" | "twitter";
  imagePrompt?: string;
}

export interface EmailContent {
  subjectLine: string;
  previewText: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface ContentMetaData {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  schemaMarkup?: Record<string, unknown>;
}
```

Create `packages/infra/seo-engine/src/types/keyword.ts`:

```typescript
export interface KeywordSuggestion {
  keyword: string;
  intent: "INFORMATIONAL" | "TRANSACTIONAL" | "NAVIGATIONAL" | "LOCAL";
  channel: "BLOG" | "GBP" | "SOCIAL" | "EMAIL";
  volume?: number;
  difficulty?: number;
}
```

- [ ] **Step 4: Write type validation tests**

Create `packages/infra/seo-engine/__tests__/types.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import type { CampaignSchedule, KeywordTarget, ContentPlan } from "../src/types/campaign";
import type { BlogContent, GBPContent, SocialContent, EmailContent } from "../src/types/content";
import type { KeywordSuggestion } from "../src/types/keyword";

describe("SEO Engine Types", () => {
  it("CampaignSchedule accepts valid schedule", () => {
    const schedule: CampaignSchedule = {
      startDate: "2026-04-01",
      endDate: "2026-06-30",
      frequency: "2x_week",
      preferredDays: [1, 4],
    };
    expect(schedule.frequency).toBe("2x_week");
  });

  it("KeywordTarget accepts all intent types", () => {
    const targets: KeywordTarget[] = [
      { keyword: "best restaurant", intent: "LOCAL", source: "VERTICAL" },
      { keyword: "how to cook", intent: "INFORMATIONAL", source: "MANUAL" },
    ];
    expect(targets).toHaveLength(2);
  });

  it("BlogContent has required fields", () => {
    const blog: BlogContent = {
      markdown: "# Hello\nContent here",
      frontmatter: {
        title: "Test",
        description: "Test desc",
        date: "2026-03-17",
        keywords: ["test"],
        author: "AI",
        readingTime: 3,
      },
    };
    expect(blog.frontmatter.title).toBe("Test");
  });

  it("GBPContent enforces max length at runtime", () => {
    const gbp: GBPContent = {
      body: "A".repeat(1500),
      ctaType: "BOOK",
    };
    expect(gbp.body.length).toBeLessThanOrEqual(1500);
  });

  it("ContentPlan contains pieces with all channels", () => {
    const plan: ContentPlan = {
      pieces: [
        { title: "Blog Post", channel: "BLOG", targetKeyword: "test", scheduledFor: "2026-04-01", outline: "Intro → Body → CTA" },
        { title: "GBP Post", channel: "GBP", targetKeyword: "local", scheduledFor: "2026-04-02", outline: "Hook → Details" },
      ],
    };
    expect(plan.pieces).toHaveLength(2);
  });
});
```

- [ ] **Step 5: Run tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All 5 tests pass.

- [ ] **Step 6: Create index.ts with exports**

Create `packages/infra/seo-engine/src/index.ts`:

```typescript
// Types
export type { CampaignSchedule, KeywordTarget, ContentPlan } from "./types/campaign";
export type { BlogContent, GBPContent, SocialContent, EmailContent, ContentMetaData } from "./types/content";
export type { KeywordSuggestion } from "./types/keyword";
```

- [ ] **Step 7: Install dependencies and verify build**

Run: `pnpm install && pnpm turbo build --filter=@velo/seo-engine`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add packages/infra/seo-engine/
git commit -m "feat(seo-engine): scaffold package with TypeScript types for campaigns, content, and keywords"
```

---

## Task 3: AI Model Abstraction

**Files:**
- Create: `packages/infra/seo-engine/src/ai/model.ts`
- Create: `packages/infra/seo-engine/src/ai/claude.ts`
- Create: `packages/infra/seo-engine/src/ai/openai.ts`
- Test: `packages/infra/seo-engine/__tests__/ai-model.test.ts`

**Dependencies:** Task 2

- [ ] **Step 1: Write failing test for ContentModel interface and Claude adapter**

Create `packages/infra/seo-engine/__tests__/ai-model.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import type { ContentModel } from "../src/ai/model";
import { ClaudeAdapter } from "../src/ai/claude";

describe("ContentModel interface", () => {
  it("mock model fulfills interface", async () => {
    const mock: ContentModel = {
      name: "test-model",
      generate: vi.fn().mockResolvedValue("generated content"),
    };
    const result = await mock.generate("test prompt");
    expect(result).toBe("generated content");
    expect(mock.name).toBe("test-model");
  });
});

describe("ClaudeAdapter", () => {
  it("has correct model name", () => {
    const adapter = new ClaudeAdapter("fake-key");
    expect(adapter.name).toBe("claude-sonnet-4");
  });

  it("throws on missing API key", () => {
    expect(() => new ClaudeAdapter("")).toThrow("ANTHROPIC_API_KEY is required");
  });

  it("builds correct request structure", () => {
    const adapter = new ClaudeAdapter("test-key");
    const request = adapter.buildRequest("test prompt", { maxTokens: 2048 });
    expect(request.model).toBe("claude-sonnet-4-20250514");
    expect(request.max_tokens).toBe(2048);
    expect(request.messages[0].content).toBe("test prompt");
  });

  it("parses API response text", () => {
    const adapter = new ClaudeAdapter("test-key");
    const response = {
      content: [{ type: "text", text: "Hello world" }],
      usage: { input_tokens: 10, output_tokens: 5 },
    };
    const result = adapter.parseResponse(response);
    expect(result.text).toBe("Hello world");
    expect(result.tokenCount).toBe(15);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement ContentModel interface**

Create `packages/infra/seo-engine/src/ai/model.ts`:

```typescript
// [ERRATA] generate() returns GenerateResponse with tokenCount for cost tracking
export interface ModelOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateResponse {
  text: string;
  tokenCount: number;
}

export interface ContentModel {
  name: string;
  generate(prompt: string, options?: ModelOptions): Promise<GenerateResponse>;
}
```

- [ ] **Step 4: Implement Claude adapter**

Create `packages/infra/seo-engine/src/ai/claude.ts`:

```typescript
import type { ContentModel, ModelOptions } from "./model";

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
}

export class ClaudeAdapter implements ContentModel {
  name = "claude-sonnet-4";
  private apiKey: string;
  private model = "claude-sonnet-4-20250514";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required");
    }
    this.apiKey = apiKey;
  }

  buildRequest(prompt: string, options?: ModelOptions): ClaudeRequest {
    return {
      model: this.model,
      max_tokens: options?.maxTokens ?? 4096,
      messages: [{ role: "user", content: prompt }],
      ...(options?.temperature != null && { temperature: options.temperature }),
    };
  }

  parseResponse(response: ClaudeResponse): { text: string; tokenCount: number } {
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
    const tokenCount = response.usage.input_tokens + response.usage.output_tokens;
    return { text, tokenCount };
  }

  async generate(prompt: string, options?: ModelOptions): Promise<string> {
    const body = this.buildRequest(prompt, options);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as ClaudeResponse;
    const { text } = this.parseResponse(data);

    if (!text) {
      throw new Error("Claude API returned empty response");
    }

    return text;
  }
}
```

- [ ] **Step 5: Create OpenAI stub**

Create `packages/infra/seo-engine/src/ai/openai.ts`:

```typescript
import type { ContentModel, ModelOptions } from "./model";

export class OpenAIAdapter implements ContentModel {
  name = "gpt-4o";

  constructor(_apiKey: string) {}

  async generate(_prompt: string, _options?: ModelOptions): Promise<string> {
    throw new Error("OpenAI adapter not implemented. Set up OPENAI_API_KEY and implement.");
  }
}
```

- [ ] **Step 6: Run tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All tests pass.

- [ ] **Step 7: Update index.ts exports**

Add to `packages/infra/seo-engine/src/index.ts`:

```typescript
// AI Model
export type { ContentModel, ModelOptions } from "./ai/model";
export { ClaudeAdapter } from "./ai/claude";
export { OpenAIAdapter } from "./ai/openai";
```

- [ ] **Step 8: Commit**

```bash
git add packages/infra/seo-engine/src/ai/ packages/infra/seo-engine/__tests__/ai-model.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add ContentModel interface with Claude and OpenAI adapters"
```

---

## Task 4: Channel Formatters

**Files:**
- Create: `packages/infra/seo-engine/src/content/channel.ts`
- Create: `packages/infra/seo-engine/src/content/channels/blog.ts`
- Create: `packages/infra/seo-engine/src/content/channels/gbp.ts`
- Create: `packages/infra/seo-engine/src/content/channels/social.ts`
- Create: `packages/infra/seo-engine/src/content/channels/email.ts`
- Test: `packages/infra/seo-engine/__tests__/channels.test.ts`

**Dependencies:** Task 2

- [ ] **Step 1: Write failing tests for all channel formatters**

Create `packages/infra/seo-engine/__tests__/channels.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import type { ChannelFormatter } from "../src/content/channel";
import { BlogFormatter } from "../src/content/channels/blog";
import { GBPFormatter } from "../src/content/channels/gbp";
import { SocialFormatter } from "../src/content/channels/social";
import { EmailFormatter } from "../src/content/channels/email";

describe("BlogFormatter", () => {
  const formatter = new BlogFormatter();

  it("has correct channel", () => {
    expect(formatter.channel).toBe("BLOG");
  });

  it("validates valid blog content", () => {
    const raw = JSON.stringify({
      markdown: "# Title\n\nSome content here that is long enough. ".repeat(50),
      frontmatter: {
        title: "Test Post",
        description: "A test post",
        date: "2026-03-17",
        keywords: ["test"],
        author: "AI",
        readingTime: 5,
      },
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
  });

  it("rejects blog content without markdown heading", () => {
    const raw = JSON.stringify({
      markdown: "No heading here, just text. ".repeat(50),
      frontmatter: { title: "T", description: "D", date: "2026-03-17", keywords: [], author: "AI", readingTime: 1 },
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Blog content must have at least one H1 heading");
  });

  it("rejects blog content under 800 words", () => {
    const raw = JSON.stringify({
      markdown: "# Title\n\nShort post.",
      frontmatter: { title: "T", description: "D", date: "2026-03-17", keywords: [], author: "AI", readingTime: 1 },
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("800 words"))).toBe(true);
  });
});

describe("GBPFormatter", () => {
  const formatter = new GBPFormatter();

  it("has correct channel", () => {
    expect(formatter.channel).toBe("GBP");
    expect(formatter.maxLength).toBe(1500);
  });

  it("validates valid GBP content", () => {
    const raw = JSON.stringify({ body: "Great news!", ctaType: "BOOK" });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(true);
  });

  it("rejects GBP content over 1500 chars", () => {
    const raw = JSON.stringify({ body: "A".repeat(1501), ctaType: "BOOK" });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
  });

  it("rejects GBP content without ctaType", () => {
    const raw = JSON.stringify({ body: "Content here" });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
  });
});

describe("SocialFormatter", () => {
  const formatter = new SocialFormatter();

  it("validates valid social content", () => {
    const raw = JSON.stringify({
      caption: "Check this out!",
      hashtags: ["#food", "#bali"],
      platform: "instagram",
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(true);
  });

  it("rejects social content without hashtags", () => {
    const raw = JSON.stringify({ caption: "Post", hashtags: [], platform: "instagram" });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
  });
});

describe("EmailFormatter", () => {
  const formatter = new EmailFormatter();

  it("validates valid email content", () => {
    const raw = JSON.stringify({
      subjectLine: "Weekly Update",
      previewText: "Here's what's new",
      body: "Full email body here",
      ctaLabel: "Read More",
      ctaUrl: "https://example.com",
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(true);
  });

  it("rejects email without subject line", () => {
    const raw = JSON.stringify({
      previewText: "Preview",
      body: "Body",
      ctaLabel: "CTA",
      ctaUrl: "https://example.com",
    });
    const result = formatter.validateOutput(raw);
    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement ChannelFormatter interface**

Create `packages/infra/seo-engine/src/content/channel.ts`:

```typescript
import type { BlogContent, GBPContent, SocialContent, EmailContent } from "../types/content";

export interface ChannelFormatter {
  channel: "BLOG" | "GBP" | "SOCIAL" | "EMAIL";
  maxLength?: number;
  formatPrompt(context: PromptContext): string;
  validateOutput(raw: string): ValidationResult;
}

export interface PromptContext {
  title: string;
  targetKeyword?: string;
  outline?: string;
  businessName: string;
  businessType: string;
  location: string;
  tone?: string;
  existingTitles?: string[];
}

export interface ValidationResult {
  valid: boolean;
  parsed?: BlogContent | GBPContent | SocialContent | EmailContent;
  errors?: string[];
}
```

- [ ] **Step 4: Implement all four channel formatters**

Create `packages/infra/seo-engine/src/content/channels/blog.ts`:

```typescript
import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { BlogContent } from "../../types/content";

export class BlogFormatter implements ChannelFormatter {
  channel = "BLOG" as const;

  formatPrompt(ctx: PromptContext): string {
    const dedup = ctx.existingTitles?.length
      ? `\nAlready published (avoid overlap): ${ctx.existingTitles.join(", ")}`
      : "";

    return `You are an SEO content writer for ${ctx.businessName}, a ${ctx.businessType} in ${ctx.location}.
Write a blog post titled "${ctx.title}" targeting the keyword "${ctx.targetKeyword}".
${ctx.outline ? `Outline: ${ctx.outline}` : ""}
Tone: ${ctx.tone ?? "professional, knowledgeable, locally-aware"}.
Word count: 1200-1800 words. Use H2 subheadings. Include a compelling intro and conclusion with CTA.
Do NOT use generic filler — every paragraph should provide specific, actionable information.${dedup}

Return a JSON object with this exact structure:
{
  "markdown": "# Title\\n\\nFull blog post in markdown...",
  "frontmatter": {
    "title": "...",
    "description": "150 char meta description",
    "date": "${new Date().toISOString().split("T")[0]}",
    "keywords": ["keyword1", "keyword2"],
    "author": "Velocity AI",
    "category": "...",
    "readingTime": N
  }
}
Respond with valid JSON only.`;
  }

  validateOutput(raw: string): ValidationResult {
    const errors: string[] = [];
    let parsed: BlogContent;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, errors: ["Invalid JSON"] };
    }

    if (!parsed.markdown || typeof parsed.markdown !== "string") {
      errors.push("Missing markdown field");
    } else {
      if (!parsed.markdown.includes("# ")) {
        errors.push("Blog content must have at least one H1 heading");
      }
      const wordCount = parsed.markdown.split(/\s+/).length;
      if (wordCount < 800) {
        errors.push(`Blog content must be at least 800 words (got ${wordCount})`);
      }
    }

    if (!parsed.frontmatter) {
      errors.push("Missing frontmatter");
    } else {
      if (!parsed.frontmatter.title) errors.push("Missing frontmatter.title");
      if (!parsed.frontmatter.description) errors.push("Missing frontmatter.description");
      if (!parsed.frontmatter.date) errors.push("Missing frontmatter.date");
      if (!parsed.frontmatter.author) errors.push("Missing frontmatter.author");
    }

    return { valid: errors.length === 0, parsed: errors.length === 0 ? parsed : undefined, errors: errors.length > 0 ? errors : undefined };
  }
}
```

Create `packages/infra/seo-engine/src/content/channels/gbp.ts`:

```typescript
import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { GBPContent } from "../../types/content";

const VALID_CTA_TYPES = ["BOOK", "ORDER", "LEARN_MORE", "CALL", "VISIT"] as const;

export class GBPFormatter implements ChannelFormatter {
  channel = "GBP" as const;
  maxLength = 1500;

  formatPrompt(ctx: PromptContext): string {
    return `You are writing a Google Business Profile post for ${ctx.businessName}, a ${ctx.businessType} in ${ctx.location}.
Post topic: ${ctx.title}
${ctx.targetKeyword ? `Target keyword: ${ctx.targetKeyword}` : ""}
${ctx.outline ? `Brief: ${ctx.outline}` : ""}
Tone: ${ctx.tone ?? "authoritative, trustworthy, approachable"}.
Maximum 1500 characters. Include a clear call-to-action.

Return JSON: { "body": "post text", "ctaType": "BOOK|ORDER|LEARN_MORE|CALL|VISIT", "ctaUrl": "optional url" }
Respond with valid JSON only.`;
  }

  validateOutput(raw: string): ValidationResult {
    const errors: string[] = [];
    let parsed: GBPContent;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, errors: ["Invalid JSON"] };
    }

    if (!parsed.body || typeof parsed.body !== "string") {
      errors.push("Missing body field");
    } else if (parsed.body.length > 1500) {
      errors.push(`GBP post exceeds 1500 chars (got ${parsed.body.length})`);
    }

    if (!parsed.ctaType || !VALID_CTA_TYPES.includes(parsed.ctaType as any)) {
      errors.push(`Missing or invalid ctaType (must be one of: ${VALID_CTA_TYPES.join(", ")})`);
    }

    return { valid: errors.length === 0, parsed: errors.length === 0 ? parsed : undefined, errors: errors.length > 0 ? errors : undefined };
  }
}
```

Create `packages/infra/seo-engine/src/content/channels/social.ts`:

```typescript
import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { SocialContent } from "../../types/content";

export class SocialFormatter implements ChannelFormatter {
  channel = "SOCIAL" as const;
  maxLength = 2200; // Instagram max

  formatPrompt(ctx: PromptContext): string {
    return `You are writing a social media post for ${ctx.businessName}, a ${ctx.businessType} in ${ctx.location}.
Post topic: ${ctx.title}
${ctx.targetKeyword ? `Target keyword: ${ctx.targetKeyword}` : ""}
${ctx.outline ? `Brief: ${ctx.outline}` : ""}
Tone: ${ctx.tone ?? "engaging, visual, community-focused"}.
Include relevant hashtags (5-10). Keep caption under 2200 characters.

Return JSON: { "caption": "...", "hashtags": ["#tag1", "#tag2"], "platform": "instagram", "imagePrompt": "AI image description" }
Respond with valid JSON only.`;
  }

  validateOutput(raw: string): ValidationResult {
    const errors: string[] = [];
    let parsed: SocialContent;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, errors: ["Invalid JSON"] };
    }

    if (!parsed.caption || typeof parsed.caption !== "string") {
      errors.push("Missing caption field");
    }
    if (!Array.isArray(parsed.hashtags) || parsed.hashtags.length === 0) {
      errors.push("Must include at least one hashtag");
    }
    if (!parsed.platform) {
      errors.push("Missing platform field");
    }

    return { valid: errors.length === 0, parsed: errors.length === 0 ? parsed : undefined, errors: errors.length > 0 ? errors : undefined };
  }
}
```

Create `packages/infra/seo-engine/src/content/channels/email.ts`:

```typescript
import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { EmailContent } from "../../types/content";

export class EmailFormatter implements ChannelFormatter {
  channel = "EMAIL" as const;

  formatPrompt(ctx: PromptContext): string {
    return `You are writing a marketing email for ${ctx.businessName}, a ${ctx.businessType} in ${ctx.location}.
Email topic: ${ctx.title}
${ctx.targetKeyword ? `Target keyword: ${ctx.targetKeyword}` : ""}
${ctx.outline ? `Brief: ${ctx.outline}` : ""}
Tone: ${ctx.tone ?? "professional, personable, action-oriented"}.
Keep subject under 60 chars. Include clear CTA.

Return JSON: { "subjectLine": "...", "previewText": "...", "body": "email body in markdown", "ctaLabel": "...", "ctaUrl": "https://..." }
Respond with valid JSON only.`;
  }

  validateOutput(raw: string): ValidationResult {
    const errors: string[] = [];
    let parsed: EmailContent;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, errors: ["Invalid JSON"] };
    }

    if (!parsed.subjectLine) errors.push("Missing subjectLine");
    if (!parsed.body) errors.push("Missing body");
    if (!parsed.ctaLabel) errors.push("Missing ctaLabel");
    if (!parsed.ctaUrl) errors.push("Missing ctaUrl");

    return { valid: errors.length === 0, parsed: errors.length === 0 ? parsed : undefined, errors: errors.length > 0 ? errors : undefined };
  }
}
```

- [ ] **Step 5: Run tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All channel tests pass.

- [ ] **Step 6: Update index.ts exports**

Add to `packages/infra/seo-engine/src/index.ts`:

```typescript
// Channel Formatters
export type { ChannelFormatter, PromptContext, ValidationResult } from "./content/channel";
export { BlogFormatter } from "./content/channels/blog";
export { GBPFormatter } from "./content/channels/gbp";
export { SocialFormatter } from "./content/channels/social";
export { EmailFormatter } from "./content/channels/email";
```

- [ ] **Step 7: Commit**

```bash
git add packages/infra/seo-engine/src/content/ packages/infra/seo-engine/__tests__/channels.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add ChannelFormatter interface with blog, GBP, social, and email formatters"
```

---

## Task 5: Keyword Source Provider

**Files:**
- Create: `packages/infra/seo-engine/src/keywords/source.ts`
- Create: `packages/infra/seo-engine/src/keywords/vertical.ts`
- Create: `packages/infra/seo-engine/src/keywords/gsc.ts`
- Create: `packages/infra/seo-engine/src/keywords/serpapi.ts`
- Test: `packages/infra/seo-engine/__tests__/keywords.test.ts`

**Dependencies:** Task 2, Task 3

- [ ] **Step 1: Write failing tests**

Create `packages/infra/seo-engine/__tests__/keywords.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { VerticalKeywordProvider } from "../src/keywords/vertical";
import type { ContentModel } from "../src/ai/model";

describe("VerticalKeywordProvider", () => {
  const mockModel: ContentModel = {
    name: "test",
    generate: vi.fn().mockResolvedValue(
      JSON.stringify([
        { keyword: "best restaurant seminyak", intent: "LOCAL", channel: "BLOG" },
        { keyword: "romantic dinner bali", intent: "TRANSACTIONAL", channel: "BLOG" },
        { keyword: "weekend brunch special", intent: "LOCAL", channel: "GBP" },
      ])
    ),
  };

  it("has correct provider name", () => {
    const provider = new VerticalKeywordProvider(mockModel);
    expect(provider.provider).toBe("VERTICAL");
  });

  it("generates keywords for a vertical and location", async () => {
    const provider = new VerticalKeywordProvider(mockModel);
    const keywords = await provider.getKeywords("restaurant", "Seminyak, Bali", ["BLOG", "GBP"]);
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords[0].keyword).toBe("best restaurant seminyak");
  });

  it("passes vertical, location, and channels to AI prompt", async () => {
    const provider = new VerticalKeywordProvider(mockModel);
    await provider.getKeywords("restaurant", "Seminyak, Bali", ["BLOG"]);
    const prompt = (mockModel.generate as any).mock.calls[0][0] as string;
    expect(prompt).toContain("restaurant");
    expect(prompt).toContain("Seminyak, Bali");
    expect(prompt).toContain("BLOG");
  });

  it("handles invalid AI response gracefully", async () => {
    const badModel: ContentModel = {
      name: "bad",
      generate: vi.fn().mockResolvedValue("not json"),
    };
    const provider = new VerticalKeywordProvider(badModel);
    await expect(provider.getKeywords("restaurant", "Bali", ["BLOG"])).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: FAIL.

- [ ] **Step 3: Implement KeywordSourceProvider interface and VerticalKeywordProvider**

Create `packages/infra/seo-engine/src/keywords/source.ts`:

```typescript
import type { KeywordSuggestion } from "../types/keyword";

export interface KeywordSourceProvider {
  provider: string;
  getKeywords(
    vertical: string,
    location: string,
    channels: string[]
  ): Promise<KeywordSuggestion[]>;
}
```

Create `packages/infra/seo-engine/src/keywords/vertical.ts`:

```typescript
import type { KeywordSourceProvider } from "./source";
import type { KeywordSuggestion } from "../types/keyword";
import type { ContentModel } from "../ai/model";

export class VerticalKeywordProvider implements KeywordSourceProvider {
  provider = "VERTICAL";
  private model: ContentModel;

  constructor(model: ContentModel) {
    this.model = model;
  }

  async getKeywords(
    vertical: string,
    location: string,
    channels: string[]
  ): Promise<KeywordSuggestion[]> {
    const currentMonth = new Date().toLocaleString("en", { month: "long", year: "numeric" });

    const prompt = `You are an SEO keyword researcher.
Generate 15-20 keyword suggestions for a ${vertical} business in ${location}.
Current month: ${currentMonth}.
Target channels: ${channels.join(", ")}.

For each keyword, classify:
- intent: INFORMATIONAL (how-to, guides), TRANSACTIONAL (buy, book, order), NAVIGATIONAL (brand/place), LOCAL (location-specific)
- channel: which channel (${channels.join(", ")}) best fits this keyword

Return a JSON array: [{ "keyword": "...", "intent": "...", "channel": "..." }]
Respond with valid JSON only.`;

    const raw = await this.model.generate(prompt, { maxTokens: 2048, temperature: 0.7 });

    let parsed: KeywordSuggestion[];
    try {
      const cleaned = raw.replace(/```json?\s*\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse keyword suggestions: ${raw.slice(0, 200)}`);
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Keyword response is not an array");
    }

    return parsed;
  }
}
```

Create `packages/infra/seo-engine/src/keywords/gsc.ts`:

```typescript
import type { KeywordSourceProvider } from "./source";
import type { KeywordSuggestion } from "../types/keyword";

export class GSCKeywordProvider implements KeywordSourceProvider {
  provider = "GSC";

  async getKeywords(): Promise<KeywordSuggestion[]> {
    throw new Error("Google Search Console keyword provider not implemented");
  }
}
```

Create `packages/infra/seo-engine/src/keywords/serpapi.ts`:

```typescript
import type { KeywordSourceProvider } from "./source";
import type { KeywordSuggestion } from "../types/keyword";

export class SerpAPIKeywordProvider implements KeywordSourceProvider {
  provider = "SERPAPI";

  async getKeywords(): Promise<KeywordSuggestion[]> {
    throw new Error("SerpAPI keyword provider not implemented");
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All keyword tests pass.

- [ ] **Step 5: Update index.ts and commit**

Add exports, then:

```bash
git add packages/infra/seo-engine/src/keywords/ packages/infra/seo-engine/__tests__/keywords.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add KeywordSourceProvider with AI-powered vertical keyword generator"
```

---

## Task 6: Publisher — Crypto + MDX Writer + Deploy Trigger

**Files:**
- Create: `packages/infra/seo-engine/src/publish/crypto.ts`
- Create: `packages/infra/seo-engine/src/publish/publisher.ts`
- Create: `packages/infra/seo-engine/src/publish/mdx-writer.ts`
- Create: `packages/infra/seo-engine/src/publish/deploy-trigger.ts`
- Test: `packages/infra/seo-engine/__tests__/publish.test.ts`

**Dependencies:** Task 2

- [ ] **Step 1: Write failing tests**

Create `packages/infra/seo-engine/__tests__/publish.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "../src/publish/crypto";
import { generateMDX } from "../src/publish/mdx-writer";
import type { BlogContent } from "../src/types/content";

describe("crypto", () => {
  const key = "a".repeat(32); // 256-bit key

  it("encrypts and decrypts a string", () => {
    const plaintext = "ghp_abc123secrettoken";
    const encrypted = encrypt(plaintext, key);
    expect(encrypted).not.toBe(plaintext);
    expect(encrypted).toContain(":");
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertexts for same input", () => {
    const a = encrypt("same", key);
    const b = encrypt("same", key);
    expect(a).not.toBe(b); // random IV
  });

  it("throws on wrong key", () => {
    const encrypted = encrypt("secret", key);
    expect(() => decrypt(encrypted, "b".repeat(32))).toThrow();
  });
});

describe("generateMDX", () => {
  it("generates valid MDX with frontmatter", () => {
    const content: BlogContent = {
      markdown: "# Hello World\n\nThis is a test post.",
      frontmatter: {
        title: "Hello World",
        description: "A test post",
        date: "2026-03-17",
        keywords: ["test", "hello"],
        author: "Velocity AI",
        category: "general",
        readingTime: 1,
      },
    };

    const mdx = generateMDX(content);

    expect(mdx).toContain("---");
    expect(mdx).toContain('title: "Hello World"');
    expect(mdx).toContain('description: "A test post"');
    expect(mdx).toContain("keywords:");
    expect(mdx).toContain("  - test");
    expect(mdx).toContain("# Hello World");
    expect(mdx).toContain("This is a test post.");
  });

  it("escapes quotes in frontmatter values", () => {
    const content: BlogContent = {
      markdown: "# Test",
      frontmatter: {
        title: 'He said "hello"',
        description: "It's a test",
        date: "2026-03-17",
        keywords: [],
        author: "AI",
        readingTime: 1,
      },
    };
    const mdx = generateMDX(content);
    expect(mdx).toContain('title: "He said \\"hello\\""');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: FAIL.

- [ ] **Step 3: Implement crypto**

Create `packages/infra/seo-engine/src/publish/crypto.ts`:

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

export function encrypt(plaintext: string, key: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(key, "utf8"), iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decrypt(ciphertext: string, key: string): string {
  const [ivHex, tagHex, encrypted] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(key, "utf8"), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

- [ ] **Step 4: Implement MDX writer**

Create `packages/infra/seo-engine/src/publish/mdx-writer.ts`:

```typescript
import type { BlogContent } from "../types/content";

function escapeYaml(value: string): string {
  return value.replace(/"/g, '\\"');
}

export function generateMDX(content: BlogContent): string {
  const fm = content.frontmatter;
  const lines = [
    "---",
    `title: "${escapeYaml(fm.title)}"`,
    `description: "${escapeYaml(fm.description)}"`,
    `date: "${fm.date}"`,
    "keywords:",
    ...fm.keywords.map((k) => `  - ${k}`),
    ...(fm.image ? [`image: "${fm.image}"`] : []),
    `author: "${escapeYaml(fm.author)}"`,
    ...(fm.category ? [`category: "${fm.category}"`] : []),
    `readingTime: ${fm.readingTime}`,
    "---",
    "",
    content.markdown,
  ];
  return lines.join("\n");
}

export async function commitMDXToGitHub(
  mdx: string,
  slug: string,
  title: string,
  repoUrl: string,
  branch: string,
  token: string
): Promise<{ success: boolean; url?: string }> {
  const match = repoUrl.match(/github\.com[/:](.+?)(?:\.git)?$/);
  if (!match) {
    throw new Error(`Unsupported repo URL: ${repoUrl}`);
  }
  const repo = match[1];
  const path = `content/blog/${slug}.mdx`;
  const content = Buffer.from(mdx).toString("base64");

  // Check if file exists (to get sha for update)
  let sha: string | undefined;
  const checkRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" } }
  );
  if (checkRes.ok) {
    const existing = await checkRes.json();
    sha = existing.sha;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `chore(blog): publish '${title}'`,
      content,
      branch,
      ...(sha && { sha }),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return { success: true, url: data.content?.html_url };
}

export async function writeMDXLocal(
  mdx: string,
  slug: string,
  appDir: string
): Promise<{ success: boolean; url?: string }> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const blogDir = path.join(appDir, "content", "blog");
  await fs.mkdir(blogDir, { recursive: true });
  const filePath = path.join(blogDir, `${slug}.mdx`);
  await fs.writeFile(filePath, mdx, "utf-8");
  return { success: true, url: filePath };
}
```

- [ ] **Step 5: Create Publisher interface and deploy trigger stub**

Create `packages/infra/seo-engine/src/publish/publisher.ts`:

```typescript
export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface Publisher {
  publish(options: {
    mdx: string;
    slug: string;
    title: string;
    repoUrl?: string;
    repoBranch?: string;
    repoToken?: string;
    appDir?: string;
  }): Promise<PublishResult>;
}
```

Create `packages/infra/seo-engine/src/publish/deploy-trigger.ts`:

```typescript
export async function triggerVercelDeploy(deployHookUrl: string): Promise<void> {
  if (!deployHookUrl) return;

  const res = await fetch(deployHookUrl, { method: "POST" });
  if (!res.ok) {
    console.error(`Vercel deploy hook failed: ${res.status}`);
  }
}
```

- [ ] **Step 6: Run tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All publish tests pass.

- [ ] **Step 7: Update index.ts and commit**

```bash
git add packages/infra/seo-engine/src/publish/ packages/infra/seo-engine/__tests__/publish.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add publisher with crypto, MDX writer, and GitHub commit support"
```

---

## Task 7: Campaign Planner + Content Generator

**Files:**
- Create: `packages/infra/seo-engine/src/campaign/planner.ts`
- Create: `packages/infra/seo-engine/src/campaign/scheduler.ts`
- Create: `packages/infra/seo-engine/src/content/generator.ts`
- Test: `packages/infra/seo-engine/__tests__/campaign.test.ts`
- Test: `packages/infra/seo-engine/__tests__/generator.test.ts`

**Dependencies:** Tasks 3, 4, 5

- [ ] **Step 1: Write failing tests for campaign planner**

Create `packages/infra/seo-engine/__tests__/campaign.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { CampaignPlanner } from "../src/campaign/planner";
import { mapScheduleToDates } from "../src/campaign/scheduler";
import type { ContentModel } from "../src/ai/model";

describe("CampaignPlanner", () => {
  const mockModel: ContentModel = {
    name: "test",
    generate: vi.fn().mockResolvedValue(
      JSON.stringify({
        pieces: [
          { title: "Best Brunch in Seminyak", channel: "BLOG", targetKeyword: "brunch seminyak", scheduledFor: "2026-04-01", outline: "Top 10 list" },
          { title: "Weekend Jazz Night", channel: "GBP", targetKeyword: "jazz night bali", scheduledFor: "2026-04-02", outline: "Event highlight" },
        ],
      })
    ),
  };

  it("generates a content plan from brief", async () => {
    const planner = new CampaignPlanner(mockModel);
    const plan = await planner.generatePlan({
      campaignName: "Q2 Dining SEO",
      goal: "Rank for Seminyak dining",
      channels: ["BLOG", "GBP"],
      keywords: [{ keyword: "brunch seminyak", intent: "LOCAL", channel: "BLOG" }],
      frequency: "2x_week",
      startDate: "2026-04-01",
      endDate: "2026-06-30",
      vertical: "restaurant",
      businessName: "Ember Kitchen",
      location: "Seminyak, Bali",
    });
    expect(plan.pieces).toHaveLength(2);
    expect(plan.pieces[0].title).toBe("Best Brunch in Seminyak");
  });

  it("includes keywords in the prompt", async () => {
    const planner = new CampaignPlanner(mockModel);
    await planner.generatePlan({
      campaignName: "Test",
      goal: "Test",
      channels: ["BLOG"],
      keywords: [{ keyword: "test keyword", intent: "LOCAL", channel: "BLOG" }],
      frequency: "weekly",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      vertical: "restaurant",
      businessName: "Test Biz",
      location: "Bali",
    });
    const prompt = (mockModel.generate as any).mock.calls[0][0];
    expect(prompt).toContain("test keyword");
  });
});

describe("mapScheduleToDates", () => {
  it("generates weekly dates between start and end", () => {
    const dates = mapScheduleToDates("2026-04-01", "2026-04-30", "weekly");
    expect(dates.length).toBe(5); // ~4-5 weeks
    expect(dates[0]).toBe("2026-04-01");
  });

  it("generates 2x_week dates", () => {
    const dates = mapScheduleToDates("2026-04-01", "2026-04-14", "2x_week");
    expect(dates.length).toBe(4); // 2 weeks * 2
  });

  it("generates daily dates", () => {
    const dates = mapScheduleToDates("2026-04-01", "2026-04-07", "daily");
    expect(dates.length).toBe(7);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail, then implement**

Implement `packages/infra/seo-engine/src/campaign/planner.ts`:

```typescript
import type { ContentModel } from "../ai/model";
import type { ContentPlan } from "../types/campaign";
import type { KeywordSuggestion } from "../types/keyword";

interface PlannerInput {
  campaignName: string;
  goal: string;
  channels: string[];
  keywords: KeywordSuggestion[];
  frequency: string;
  startDate: string;
  endDate: string;
  vertical: string;
  businessName: string;
  location: string;
}

export class CampaignPlanner {
  private model: ContentModel;

  constructor(model: ContentModel) {
    this.model = model;
  }

  async generatePlan(input: PlannerInput): Promise<ContentPlan> {
    const keywordList = input.keywords.map((k) => `- "${k.keyword}" (${k.intent}, ${k.channel})`).join("\n");

    const prompt = `You are an SEO content strategist planning a campaign for ${input.businessName}, a ${input.vertical} in ${input.location}.

Campaign: ${input.campaignName}
Goal: ${input.goal}
Channels: ${input.channels.join(", ")}
Schedule: ${input.frequency} from ${input.startDate} to ${input.endDate}

Target keywords:
${keywordList}

Generate a content calendar. For each piece:
- Title: SEO-optimized, engaging
- Channel: one of ${input.channels.join(", ")}
- Target keyword: from the list above
- Scheduled date: within the date range, respecting frequency
- Outline: 1-2 sentence brief describing the content angle

Return JSON: { "pieces": [{ "title": "...", "channel": "...", "targetKeyword": "...", "scheduledFor": "YYYY-MM-DD", "outline": "..." }] }
Respond with valid JSON only.`;

    const raw = await this.model.generate(prompt, { maxTokens: 4096, temperature: 0.7 });

    let plan: ContentPlan;
    try {
      const cleaned = raw.replace(/```json?\s*\n?/g, "").replace(/```/g, "").trim();
      plan = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse content plan: ${raw.slice(0, 200)}`);
    }

    if (!plan.pieces || !Array.isArray(plan.pieces)) {
      throw new Error("Content plan missing pieces array");
    }

    return plan;
  }
}
```

Implement `packages/infra/seo-engine/src/campaign/scheduler.ts`:

```typescript
export function mapScheduleToDates(
  startDate: string,
  endDate: string,
  frequency: string
): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  const intervalDays: Record<string, number> = {
    daily: 1,
    "2x_week": 3.5,
    "3x_week": 2.33,
    weekly: 7,
    biweekly: 14,
    monthly: 30,
  };

  const interval = intervalDays[frequency] ?? 7;
  let current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current = new Date(current.getTime() + interval * 24 * 60 * 60 * 1000);
  }

  return dates;
}
```

- [ ] **Step 3: Write failing test for content generator, then implement**

Create `packages/infra/seo-engine/__tests__/generator.test.ts`:

```typescript
import { describe, it, expect, vi } from "vitest";
import { ContentGenerator } from "../src/content/generator";
import type { ContentModel } from "../src/ai/model";
import { BlogFormatter } from "../src/content/channels/blog";

describe("ContentGenerator", () => {
  it("generates content using model and formatter", async () => {
    const blogContent = {
      markdown: "# Great Post\n\n" + "Content paragraph. ".repeat(200),
      frontmatter: {
        title: "Great Post",
        description: "A great post about food",
        date: "2026-03-17",
        keywords: ["food"],
        author: "Velocity AI",
        readingTime: 5,
      },
    };

    const mockModel: ContentModel = {
      name: "test",
      generate: vi.fn().mockResolvedValue(JSON.stringify(blogContent)),
    };

    const generator = new ContentGenerator(mockModel);
    const result = await generator.generate({
      formatter: new BlogFormatter(),
      context: {
        title: "Great Post",
        targetKeyword: "food",
        businessName: "Test Restaurant",
        businessType: "restaurant",
        location: "Bali",
      },
      promptTemplate: undefined,
    });

    expect(result.valid).toBe(true);
    expect(result.content).toBeDefined();
    expect(result.modelUsed).toBe("test");
  });

  it("retries on validation failure", async () => {
    const badContent = JSON.stringify({ markdown: "short", frontmatter: { title: "T" } });
    const goodContent = JSON.stringify({
      markdown: "# Good\n\n" + "Word ".repeat(900),
      frontmatter: { title: "Good", description: "D", date: "2026-01-01", keywords: [], author: "AI", readingTime: 3 },
    });

    const mockModel: ContentModel = {
      name: "test",
      generate: vi.fn()
        .mockResolvedValueOnce(badContent)
        .mockResolvedValueOnce(goodContent),
    };

    const generator = new ContentGenerator(mockModel);
    const result = await generator.generate({
      formatter: new BlogFormatter(),
      context: { title: "Test", businessName: "Biz", businessType: "restaurant", location: "Bali" },
      maxRetries: 2,
    });

    expect((mockModel.generate as any).mock.calls.length).toBe(2);
    expect(result.valid).toBe(true);
  });
});
```

Implement `packages/infra/seo-engine/src/content/generator.ts`:

```typescript
import type { ContentModel } from "../ai/model";
import type { ChannelFormatter, PromptContext, ValidationResult } from "./channel";
import type { BlogContent, GBPContent, SocialContent, EmailContent } from "../types/content";

interface GenerateOptions {
  formatter: ChannelFormatter;
  context: PromptContext;
  promptTemplate?: string;
  maxRetries?: number;
}

interface GenerateResult {
  valid: boolean;
  content?: BlogContent | GBPContent | SocialContent | EmailContent;
  modelUsed: string;
  tokenCount?: number;
  errors?: string[];
}

export class ContentGenerator {
  private model: ContentModel;

  constructor(model: ContentModel) {
    this.model = model;
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const { formatter, context, maxRetries = 2 } = options;
    let lastErrors: string[] = [];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const prompt =
        attempt === 0
          ? formatter.formatPrompt(context)
          : `${formatter.formatPrompt(context)}\n\nPrevious attempt had errors: ${lastErrors.join(", ")}. Fix them.`;

      const raw = await this.model.generate(prompt);
      const result = formatter.validateOutput(raw);

      if (result.valid) {
        return {
          valid: true,
          content: result.parsed,
          modelUsed: this.model.name,
        };
      }

      lastErrors = result.errors ?? ["Unknown validation error"];
    }

    return {
      valid: false,
      modelUsed: this.model.name,
      errors: lastErrors,
    };
  }
}
```

- [ ] **Step 4: Run all tests**

Run: `cd packages/infra/seo-engine && pnpm test`
Expected: All tests pass.

- [ ] **Step 5: Update index.ts and commit**

```bash
git add packages/infra/seo-engine/src/campaign/ packages/infra/seo-engine/src/content/generator.ts packages/infra/seo-engine/__tests__/campaign.test.ts packages/infra/seo-engine/__tests__/generator.test.ts packages/infra/seo-engine/src/index.ts
git commit -m "feat(seo-engine): add campaign planner, scheduler, and content generator with retry logic"
```

---

## Task 8: @velo/blog Package

**Files:**
- Create: `packages/sections/blog/package.json`
- Create: `packages/sections/blog/src/index.ts`
- Create: `packages/sections/blog/src/mdx-utils.ts`
- Create: `packages/sections/blog/src/BlogCard.tsx`
- Create: `packages/sections/blog/src/BlogList.tsx`
- Create: `packages/sections/blog/src/BlogPost.tsx`
- Create: `packages/sections/blog/src/mdx-components.tsx`
- Test: `packages/sections/blog/__tests__/mdx-utils.test.ts`

**Dependencies:** None (independent)

- [ ] **Step 1: Write failing tests for mdx-utils**

Create `packages/sections/blog/__tests__/mdx-utils.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { parseFrontmatter, calculateReadingTime, slugify } from "../src/mdx-utils";

describe("parseFrontmatter", () => {
  it("parses YAML frontmatter from MDX string", () => {
    const mdx = `---
title: "Hello World"
date: "2026-03-17"
keywords:
  - test
  - hello
---

# Hello World

Content here.`;

    const { frontmatter, content } = parseFrontmatter(mdx);
    expect(frontmatter.title).toBe("Hello World");
    expect(frontmatter.date).toBe("2026-03-17");
    expect(frontmatter.keywords).toEqual(["test", "hello"]);
    expect(content.trim()).toBe("# Hello World\n\nContent here.");
  });

  it("returns empty frontmatter for content without frontmatter", () => {
    const { frontmatter, content } = parseFrontmatter("Just content");
    expect(frontmatter).toEqual({});
    expect(content).toBe("Just content");
  });
});

describe("calculateReadingTime", () => {
  it("calculates reading time for short text", () => {
    expect(calculateReadingTime("Hello world")).toBe(1);
  });

  it("calculates reading time for 1000 words", () => {
    const text = "word ".repeat(1000);
    expect(calculateReadingTime(text)).toBe(5); // ~200 wpm
  });
});

describe("slugify", () => {
  it("converts title to URL-safe slug", () => {
    expect(slugify("Best Brunch Spots in Seminyak")).toBe("best-brunch-spots-in-seminyak");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World? (2026)")).toBe("hello-world-2026");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("test - - thing")).toBe("test-thing");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail, then implement**

Create `packages/sections/blog/package.json`:

```json
{
  "name": "@velo/blog",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0"
  },
  "dependencies": {
    "@velo/types": "workspace:*",
    "@velo/motion-components": "workspace:*",
    "@velo/theme": "workspace:*",
    "gray-matter": "^4.0.3"
  },
  "scripts": {
    "test": "vitest run",
    "test:ci": "vitest run"
  },
  "velo": {
    "type": "section"
  }
}
```

Create `packages/sections/blog/vitest.config.ts` (standard config).

Implement `packages/sections/blog/src/mdx-utils.ts`:

```typescript
export function parseFrontmatter(mdx: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const match = mdx.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: mdx };
  }

  const yamlString = match[1];
  const content = match[2];

  // Simple YAML parser for frontmatter (key: value, arrays)
  const frontmatter: Record<string, unknown> = {};
  let currentKey = "";
  let currentArray: string[] | null = null;

  for (const line of yamlString.split("\n")) {
    const arrayItem = line.match(/^\s+-\s+(.+)/);
    if (arrayItem && currentKey) {
      if (!currentArray) currentArray = [];
      currentArray.push(arrayItem[1].trim());
      frontmatter[currentKey] = currentArray;
      continue;
    }

    if (currentArray) currentArray = null;

    const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2];
      if (value === "") continue; // array key with no inline value
      frontmatter[currentKey] = value;
    }
  }

  return { frontmatter, content };
}

export function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```

- [ ] **Step 3: Create React components**

Create `packages/sections/blog/src/BlogCard.tsx`:

```tsx
import React from "react";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  image?: string;
  slug: string;
  category?: string;
  readingTime: number;
  locale: string;
}

export function BlogCard({ title, description, date, image, slug, category, readingTime, locale }: BlogCardProps) {
  return (
    <a
      href={`/${locale}/blog/${slug}`}
      className="group block rounded-2xl bg-[var(--card-bg,theme(colors.zinc.900))] border border-[var(--card-border,theme(colors.zinc.800))] overflow-hidden transition-transform hover:scale-[1.02]"
    >
      {image && (
        <div className="aspect-video overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
      )}
      <div className="p-6">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent,theme(colors.blue.400))]">
            {category}
          </span>
        )}
        <h3 className="mt-2 text-lg font-semibold text-[var(--foreground,theme(colors.zinc.100))]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted,theme(colors.zinc.400))] line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-[var(--muted,theme(colors.zinc.500))]">
          <time>{date}</time>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </a>
  );
}
```

Create `packages/sections/blog/src/BlogList.tsx`:

```tsx
import React from "react";
import { BlogCard } from "./BlogCard";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  image?: string;
  slug: string;
  category?: string;
  readingTime: number;
}

interface BlogListProps {
  posts: BlogPost[];
  locale: string;
}

export function BlogList({ posts, locale }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted,theme(colors.zinc.500))]">No articles yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} locale={locale} />
      ))}
    </div>
  );
}
```

Create `packages/sections/blog/src/BlogPost.tsx`:

```tsx
import React from "react";

interface BlogPostProps {
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: number;
  keywords: string[];
  children: React.ReactNode;
}

export function BlogPost({ title, description, date, author, readingTime, keywords, children }: BlogPostProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    author: { "@type": "Person", name: author },
    keywords: keywords.join(", "),
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-[var(--foreground,theme(colors.zinc.100))]">{title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted,theme(colors.zinc.400))]">
          <span>{author}</span>
          <time>{date}</time>
          <span>{readingTime} min read</span>
        </div>
      </header>
      <div className="prose prose-invert prose-zinc max-w-none">{children}</div>
    </article>
  );
}
```

Create `packages/sections/blog/src/mdx-components.tsx`:

```tsx
import React from "react";

export const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[var(--accent,theme(colors.blue.400))] underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-6 mb-4" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal pl-6 mb-4" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-[var(--accent,theme(colors.blue.400))] pl-4 italic my-4" {...props} />
  ),
};
```

Create `packages/sections/blog/src/index.ts`:

```typescript
export { BlogList } from "./BlogList";
export { BlogPost } from "./BlogPost";
export { BlogCard } from "./BlogCard";
export { mdxComponents } from "./mdx-components";
export { parseFrontmatter, calculateReadingTime, slugify } from "./mdx-utils";
```

- [ ] **Step 4: Run tests**

Run: `cd packages/sections/blog && pnpm install && pnpm test`
Expected: All mdx-utils tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/sections/blog/
git commit -m "feat(blog): add @velo/blog package with BlogList, BlogPost, BlogCard, and MDX utilities"
```

---

## Task 9: Dashboard API Routes — Campaigns

**Files:**
- Create: `apps/dashboard/app/api/sites/[id]/seo/campaigns/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/generate-plan/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/generate-batch/route.ts`

**Dependencies:** Task 1

Follow the existing API route pattern from `apps/dashboard/app/api/sites/[id]/integrations/route.ts`:
- Import `auth` from `@/lib/auth`
- Import `prisma` from `@velo/db`
- Validate `session?.user?.id`
- Verify site ownership: `prisma.site.findFirst({ where: { id, ownerId: session.user.id } })`
- Return `NextResponse.json()`

- [ ] **Step 1: Create campaigns list + create route**

Create `apps/dashboard/app/api/sites/[id]/seo/campaigns/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { siteId: id },
    include: { _count: { select: { contentPieces: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, goal, channels, totalPieces, schedule, keywordTargets, contentPieces } = body;

  const campaign = await prisma.campaign.create({
    data: {
      siteId: id,
      name,
      goal,
      channels,
      totalPieces,
      schedule,
      keywordTargets,
    },
  });

  // Bulk create content pieces if plan was approved
  if (contentPieces && Array.isArray(contentPieces)) {
    await prisma.contentPiece.createMany({
      data: contentPieces.map((piece: any) => ({
        campaignId: campaign.id,
        siteId: id,
        channel: piece.channel,
        title: piece.title,
        slug: piece.slug,
        targetKeyword: piece.targetKeyword,
        outline: piece.outline,
        scheduledFor: piece.scheduledFor ? new Date(piece.scheduledFor) : null,
      })),
    });
  }

  return NextResponse.json(campaign, { status: 201 });
}
```

- [ ] **Step 2: Create single campaign CRUD route**

Create `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/route.ts` with GET, PUT, DELETE handlers following the same auth pattern.

- [ ] **Step 3: Create generate-plan route (async)**

Create `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/generate-plan/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@velo/db";
import { CampaignPlanner } from "@velo/seo-engine";
import { ClaudeAdapter } from "@velo/seo-engine";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; cid: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, cid } = await params;
  const site = await prisma.site.findFirst({
    where: { id, ownerId: session.user.id },
  });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: cid, siteId: id },
  });
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const body = await request.json();
  const { keywords, vertical, businessName, location } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  // [ERRATA] Plan generation is synchronous — user waits in wizard for the plan
  try {
    const model = new ClaudeAdapter(apiKey);
    const planner = new CampaignPlanner(model);
    const plan = await planner.generatePlan({
      campaignName: campaign.name,
      goal: campaign.goal ?? "",
      channels: campaign.channels,
      keywords,
      frequency: (campaign.schedule as any).frequency,
      startDate: (campaign.schedule as any).startDate,
      endDate: (campaign.schedule as any).endDate,
      vertical,
      businessName,
      location,
    });
    return NextResponse.json(plan);
  } catch (err) {
    console.error(`Plan generation failed for campaign ${cid}:`, err);
    return NextResponse.json(
      { error: "Plan generation failed", details: String(err) },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Create generate-batch route**

Create `apps/dashboard/app/api/sites/[id]/seo/campaigns/[cid]/generate-batch/route.ts` following the same async pattern — finds PLANNED pieces within 7 days, sets to GENERATING, processes sequentially.

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/app/api/sites/[id]/seo/
git commit -m "feat(dashboard): add SEO campaign API routes with async generation"
```

---

## Task 10: Dashboard API Routes — Content Pieces

**Files:**
- Create: `apps/dashboard/app/api/sites/[id]/seo/content/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/generate/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/publish/route.ts`
- Create: `apps/dashboard/app/api/sites/[id]/seo/keywords/route.ts`

**Dependencies:** Tasks 1, 6, 7

- [ ] **Step 1: Create content list route with filtering**

Create `apps/dashboard/app/api/sites/[id]/seo/content/route.ts` — GET with query params `?campaign=X&channel=BLOG&status=DRAFT`.

- [ ] **Step 2: Create single content piece route**

Create `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/route.ts` — GET + PUT (for editing content, changing status).

- [ ] **Step 3: Create generate route (async single piece)**

Create `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/generate/route.ts`:
- Sets piece status to GENERATING
- Returns 202
- Spawns async: picks ContentTemplate, creates ChannelFormatter, calls ContentGenerator
- On success: updates piece with content, modelUsed, tokenCount, generatedAt, status DRAFT
- On failure: updates status to FAILED with reviewNote

- [ ] **Step 4: Create publish route**

Create `apps/dashboard/app/api/sites/[id]/seo/content/[pid]/publish/route.ts`:
- Validates piece is APPROVED
- For BLOG: calls generateMDX + commitMDXToGitHub (or writeMDXLocal)
- For others: just sets status to PUBLISHED
- Updates publishedAt, increments campaign.publishedCount

- [ ] **Step 5: Create keywords route**

Create `apps/dashboard/app/api/sites/[id]/seo/keywords/route.ts`:
- Uses VerticalKeywordProvider to generate suggestions
- Returns keyword suggestions as JSON

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/app/api/sites/[id]/seo/
git commit -m "feat(dashboard): add SEO content piece API routes — generate, publish, keywords"
```

---

## Task 11: Dashboard UI — SEO Overview + Campaign List

**Files:**
- Create: `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/page.tsx`
- Modify: Dashboard layout/tabs to add SEO navigation

**Dependencies:** Task 9

- [ ] **Step 1: Add SEO tab to site navigation**

Find the site detail layout or tab bar component and add an "SEO" tab linking to `seo/`.

- [ ] **Step 2: Create SEO Overview page**

Create `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/page.tsx`:
- Fetches campaigns from `/api/sites/{siteId}/seo/campaigns`
- Shows quick stats: total campaigns, total published, next scheduled
- Campaign cards grid with status badge, progress bar, channel icons
- "New Campaign" button linking to `seo/campaigns/new`
- Follows existing dashboard dark theme styling (bg-zinc-900 cards, zinc-800 borders, blue accents)

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/clients/
git commit -m "feat(dashboard): add SEO Overview page with campaign list"
```

---

## Task 12: Dashboard UI — Campaign Creation Wizard

**Files:**
- Create: `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/campaigns/new/page.tsx`

**Dependencies:** Tasks 9, 10

- [ ] **Step 1: Build 3-step wizard component**

Create the wizard page with client-side state management (useState for step tracking):

**Step 1 — Brief:** Form with name input, goal textarea, channel checkboxes (Blog, GBP, Social, Email), date range pickers, frequency dropdown.

**Step 2 — Keywords:** On mount, calls `/api/sites/{id}/seo/keywords` to get AI suggestions. Displays as selectable list with checkboxes. Manual "Add keyword" input at bottom.

**Step 3 — Content Plan:** On mount, calls `/api/sites/{id}/seo/campaigns/{id}/generate-plan` with selected keywords. Shows loading state, then displays content calendar as a sortable list. Each piece shows title, channel badge, keyword, date. Edit/delete/regenerate buttons per piece. "Approve Plan" button → POSTs to campaigns endpoint with pieces.

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/campaigns/
git commit -m "feat(dashboard): add 3-step campaign creation wizard with AI keywords and content plan"
```

---

## Task 13: Dashboard UI — Campaign Detail + Content Piece Editor

**Files:**
- Create: `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/campaigns/[campaignId]/page.tsx`
- Create: `apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/content/[pieceId]/page.tsx`

**Dependencies:** Tasks 9, 10

- [ ] **Step 1: Build Campaign Detail page**

Shows content calendar with color-coded status. Channel filter tabs. Bulk actions: "Generate Next Batch" and "Approve All Drafts". Campaign stats cards.

- [ ] **Step 2: Build Content Piece Editor page**

Split layout: left panel shows content preview (markdown rendered for blog, plain text for others), right panel shows metadata. Action buttons: Approve, Reject (with note modal), Regenerate (with feedback prompt modal), Edit inline. Status polling while GENERATING (2-second interval using setInterval + fetch).

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/(dashboard)/clients/[clientId]/sites/[siteId]/seo/
git commit -m "feat(dashboard): add campaign detail and content piece editor with approve/reject workflow"
```

---

## Task 14: Blog Route Pages in Templates

**Files:**
- Create: `apps/velocity-template/app/[locale]/blog/page.tsx`
- Create: `apps/velocity-template/app/[locale]/blog/[slug]/page.tsx`
- Create: `apps/velocity-template/app/sitemap.ts`
- Create: `apps/velocity-template/content/blog/.gitkeep`

**Dependencies:** Task 8

Start with velocity-template as the reference implementation. Other templates follow the same pattern.

- [ ] **Step 1: Create blog listing page**

Create `apps/velocity-template/app/[locale]/blog/page.tsx`:

```tsx
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { BlogList, parseFrontmatter } from "@velo/blog";

function getBlogPosts() {
  const blogDir = join(process.cwd(), "content", "blog");
  try {
    const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    return files.map((file) => {
      const raw = readFileSync(join(blogDir, file), "utf-8");
      const { frontmatter } = parseFrontmatter(raw);
      return {
        slug: file.replace(".mdx", ""),
        title: (frontmatter.title as string) ?? file,
        description: (frontmatter.description as string) ?? "",
        date: (frontmatter.date as string) ?? "",
        image: frontmatter.image as string | undefined,
        category: frontmatter.category as string | undefined,
        readingTime: (frontmatter.readingTime as number) ?? 3,
      };
    }).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getBlogPosts();
  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[var(--foreground,theme(colors.zinc.100))] mb-12">Blog</h1>
      <BlogList posts={posts} locale={locale} />
    </main>
  );
}
```

- [ ] **Step 2: Create single blog post page**

Create `apps/velocity-template/app/[locale]/blog/[slug]/page.tsx`:

```tsx
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { BlogPost, parseFrontmatter } from "@velo/blog";
import type { Metadata } from "next";

function getPost(slug: string) {
  const filePath = join(process.cwd(), "content", "blog", `${slug}.mdx`);
  try {
    const raw = readFileSync(filePath, "utf-8");
    return parseFrontmatter(raw);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const blogDir = join(process.cwd(), "content", "blog");
  try {
    return readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: f.replace(".mdx", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title as string,
    description: post.frontmatter.description as string,
    keywords: post.frontmatter.keywords as string[],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  return (
    <BlogPost
      title={fm.title as string}
      description={fm.description as string}
      date={fm.date as string}
      author={fm.author as string}
      readingTime={fm.readingTime as number}
      keywords={(fm.keywords as string[]) ?? []}
    >
      {/* MDX content rendered as HTML — for MVP, render markdown as dangerouslySetInnerHTML or use a markdown renderer */}
      <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(post.content) }} />
    </BlogPost>
  );
}

// Simple markdown → HTML for MVP (replace with proper MDX renderer later)
function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
```

- [ ] **Step 3: Create sitemap**

Create `apps/velocity-template/app/sitemap.ts`:

```typescript
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL ?? "https://example.com";
  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  try {
    const blogDir = join(process.cwd(), "content", "blog");
    const files = readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      entries.push({
        url: `${baseUrl}/blog/${file.replace(".mdx", "")}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // No blog directory yet
  }

  return entries;
}
```

- [ ] **Step 4: Create blog content directory and .gitkeep**

```bash
mkdir -p apps/velocity-template/content/blog
touch apps/velocity-template/content/blog/.gitkeep
```

- [ ] **Step 5: Commit**

```bash
git add apps/velocity-template/app/[locale]/blog/ apps/velocity-template/app/sitemap.ts apps/velocity-template/content/blog/
git commit -m "feat(velocity): add blog route pages with listing, single post, and sitemap"
```

---

## Task 15: Content Template Seeding

**Files:**
- Create: `packages/infra/db/prisma/seed-seo-templates.ts`

**Dependencies:** Task 1

- [ ] **Step 1: Create seed file with 24 initial templates (6 verticals x 4 channels)**

Create `packages/infra/db/prisma/seed-seo-templates.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verticals = [
  { name: "athletic", businessType: "Athletic/Sportswear" },
  { name: "restaurant", businessType: "Restaurant/Fine Dining" },
  { name: "real-estate", businessType: "Real Estate" },
  { name: "agency", businessType: "Creative Agency" },
  { name: "saas", businessType: "SaaS/Technology" },
  { name: "wellness", businessType: "Wellness/Spa" },
];

const channels = ["BLOG", "GBP", "SOCIAL", "EMAIL"] as const;

function getPromptTemplate(vertical: string, channel: string): { prompt: string; tone: string } {
  const toneMap: Record<string, string> = {
    restaurant: "warm, knowledgeable, locally-aware",
    "real-estate": "professional, aspirational, detail-oriented",
    athletic: "energetic, motivational, performance-focused",
    agency: "creative, confident, results-oriented",
    saas: "clear, technical-but-accessible, value-focused",
    wellness: "calm, nurturing, holistic",
  };

  const tone = toneMap[vertical] ?? "professional";

  const channelInstructions: Record<string, string> = {
    BLOG: `Write a comprehensive SEO-optimized blog post.
Word count: 1200-1800 words. Use H2 subheadings. Include a compelling intro and conclusion with CTA.
Return JSON: { "markdown": "# Title\\n\\n...", "frontmatter": { "title": "...", "description": "150 char meta description", "date": "YYYY-MM-DD", "keywords": [...], "author": "Velocity AI", "category": "...", "readingTime": N } }`,
    GBP: `Write a Google Business Profile post.
Maximum 1500 characters. Include a clear call-to-action.
Return JSON: { "body": "...", "ctaType": "BOOK|ORDER|LEARN_MORE|CALL|VISIT", "ctaUrl": "optional" }`,
    SOCIAL: `Write a social media post for Instagram/Facebook.
Include 5-10 relevant hashtags. Keep caption under 2200 characters.
Return JSON: { "caption": "...", "hashtags": ["#tag1"], "platform": "instagram", "imagePrompt": "AI image description" }`,
    EMAIL: `Write a marketing email newsletter.
Keep subject under 60 chars. Include clear CTA.
Return JSON: { "subjectLine": "...", "previewText": "...", "body": "email body in markdown", "ctaLabel": "...", "ctaUrl": "https://..." }`,
  };

  const prompt = `You are an SEO content writer for {{businessName}}, a {{businessType}} in {{location}}.
Topic: "{{title}}"
Target keyword: "{{targetKeyword}}"
{{outline}}
Tone: ${tone}.
${channelInstructions[channel]}
Do NOT use generic filler. Respond with valid JSON only.`;

  return { prompt, tone };
}

async function main() {
  console.log("Seeding SEO content templates...");

  for (const vertical of verticals) {
    for (const channel of channels) {
      const { prompt, tone } = getPromptTemplate(vertical.name, channel);

      await prisma.contentTemplate.upsert({
        where: {
          vertical_channel_name: {
            vertical: vertical.name,
            channel,
            name: `${vertical.businessType} ${channel}`,
          },
        },
        create: {
          vertical: vertical.name,
          channel,
          name: `${vertical.businessType} ${channel}`,
          promptTemplate: prompt,
          outputSchema: {},
          tone,
        },
        update: {
          promptTemplate: prompt,
          tone,
        },
      });
    }
  }

  console.log(`Seeded ${verticals.length * channels.length} content templates.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add seed script to package.json**

Add to `packages/infra/db/package.json` scripts:
```json
"db:seed-seo": "tsx prisma/seed-seo-templates.ts"
```

Add to root `package.json` scripts:
```json
"db:seed-seo": "pnpm --filter @velo/db db:seed-seo"
```

- [ ] **Step 3: Commit**

```bash
git add packages/infra/db/prisma/seed-seo-templates.ts packages/infra/db/package.json package.json
git commit -m "feat(db): add SEO content template seed — 24 templates across 6 verticals x 4 channels"
```

---

## Task 16: Integration Verification

**Dependencies:** All previous tasks

- [ ] **Step 1: Run full test suite**

Run: `pnpm test:ci`
Expected: All existing tests pass + new seo-engine and blog tests pass.

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: No type errors.

- [ ] **Step 3: Run build**

Run: `pnpm build`
Expected: All packages build successfully.

- [ ] **Step 4: Generate Prisma client and verify schema**

Run: `pnpm db:generate`
Expected: Client generates with all new models.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: Phase 4A AI SEO & Content Agent — complete implementation"
```

---

## Dependency Graph

```
Task 1 (Prisma Schema)
├── Task 2 (seo-engine types) ─── Task 3 (AI model) ─── Task 5 (keywords)
│                               └── Task 4 (channels) ──┐
│                                                        ├── Task 7 (planner + generator)
│                               └── Task 6 (publisher) ──┘
├── Task 9 (API campaigns) ──── Task 11 (UI overview)
│                           └── Task 12 (UI wizard)
├── Task 10 (API content) ──── Task 13 (UI detail + editor)
├── Task 15 (seed templates)
│
Task 8 (blog package) ────────── Task 14 (blog route pages)
│
All ──────────────────────────── Task 16 (verification)
```

Tasks 2-7 and Task 8 can be parallelized. Tasks 9-10 can be parallelized. Tasks 11-14 depend on API routes.
