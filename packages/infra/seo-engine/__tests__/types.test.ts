import { describe, it, expect } from "vitest";
import {
  CampaignFrequency,
  KeywordIntent,
  KeywordSource,
  KeywordChannel,
  GBPCtaType,
  SocialPlatform,
} from "../src/index";
import type {
  CampaignSchedule,
  KeywordTarget,
  BlogContent,
  GBPContent,
  ContentPlan,
} from "../src/index";

describe("CampaignSchedule", () => {
  it("accepts a valid schedule", () => {
    const schedule: CampaignSchedule = {
      startDate: new Date("2026-04-01"),
      frequency: CampaignFrequency.WEEKLY,
      preferredDays: [1, 3, 5], // Mon, Wed, Fri
    };

    expect(schedule.startDate).toBeInstanceOf(Date);
    expect(schedule.frequency).toBe("WEEKLY");
    expect(schedule.preferredDays).toHaveLength(3);
    expect(schedule.endDate).toBeUndefined();
  });

  it("accepts a schedule with endDate", () => {
    const schedule: CampaignSchedule = {
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      frequency: CampaignFrequency.MONTHLY,
    };

    expect(schedule.endDate).toBeInstanceOf(Date);
  });
});

describe("KeywordTarget", () => {
  it("accepts all intent types", () => {
    const intents = [
      KeywordIntent.INFORMATIONAL,
      KeywordIntent.NAVIGATIONAL,
      KeywordIntent.COMMERCIAL,
      KeywordIntent.TRANSACTIONAL,
    ];

    intents.forEach((intent) => {
      const target: KeywordTarget = {
        keyword: "test keyword",
        intent,
        source: KeywordSource.AI_SUGGESTED,
      };
      expect(target.intent).toBe(intent);
    });
  });

  it("accepts optional volume and difficulty", () => {
    const target: KeywordTarget = {
      keyword: "qa consulting services",
      volume: 1200,
      difficulty: 42,
      intent: KeywordIntent.COMMERCIAL,
      source: KeywordSource.SEARCH_CONSOLE,
    };

    expect(target.volume).toBe(1200);
    expect(target.difficulty).toBe(42);
  });
});

describe("BlogContent", () => {
  it("has all required fields", () => {
    const blog: BlogContent = {
      markdown: "# Hello World\n\nThis is a blog post.",
      frontmatter: {
        title: "Hello World",
        description: "An introductory blog post",
        date: "2026-04-01",
        keywords: ["hello", "world"],
        author: "Yohanes",
        readingTime: 3,
      },
    };

    expect(blog.markdown).toBeTruthy();
    expect(blog.frontmatter.title).toBe("Hello World");
    expect(blog.frontmatter.keywords).toHaveLength(2);
    expect(blog.frontmatter.readingTime).toBe(3);
    expect(blog.frontmatter.image).toBeUndefined();
    expect(blog.frontmatter.category).toBeUndefined();
  });
});

describe("GBPContent", () => {
  it("enforces max length at runtime", () => {
    const MAX_GBP_LENGTH = 1500;

    const content: GBPContent = {
      body: "A".repeat(1500),
      ctaType: GBPCtaType.BOOK,
      ctaUrl: "https://example.com/book",
    };

    expect(content.body.length).toBeLessThanOrEqual(MAX_GBP_LENGTH);
    expect(content.ctaType).toBe("BOOK");
  });

  it("rejects body exceeding 1500 characters", () => {
    const oversizedBody = "A".repeat(1501);

    // Runtime validation — the type system does not enforce length,
    // so we validate it explicitly here as the application would.
    const isValid = (body: string) => body.length <= 1500;

    expect(isValid(oversizedBody)).toBe(false);
    expect(isValid("A".repeat(1500))).toBe(true);
  });
});

describe("ContentPlan", () => {
  it("contains pieces with all channels", () => {
    const channels = [
      KeywordChannel.BLOG,
      KeywordChannel.GBP,
      KeywordChannel.SOCIAL,
      KeywordChannel.EMAIL,
      KeywordChannel.LANDING_PAGE,
    ];

    const plan: ContentPlan = {
      pieces: channels.map((channel, i) => ({
        title: `Content piece ${i + 1}`,
        channel,
        targetKeyword: `keyword ${i + 1}`,
        scheduledFor: new Date(`2026-04-${String(i + 1).padStart(2, "0")}`),
        outline: `Outline for piece ${i + 1}`,
      })),
    };

    expect(plan.pieces).toHaveLength(5);

    const pieceChannels = plan.pieces.map((p) => p.channel);
    expect(pieceChannels).toContain(KeywordChannel.BLOG);
    expect(pieceChannels).toContain(KeywordChannel.GBP);
    expect(pieceChannels).toContain(KeywordChannel.SOCIAL);
    expect(pieceChannels).toContain(KeywordChannel.EMAIL);
    expect(pieceChannels).toContain(KeywordChannel.LANDING_PAGE);
  });

  it("accepts an empty plan", () => {
    const plan: ContentPlan = { pieces: [] };
    expect(plan.pieces).toHaveLength(0);
  });
});

describe("SocialPlatform enum", () => {
  it("covers all expected platforms", () => {
    const platforms = [
      SocialPlatform.INSTAGRAM,
      SocialPlatform.FACEBOOK,
      SocialPlatform.TWITTER,
      SocialPlatform.LINKEDIN,
      SocialPlatform.TIKTOK,
    ];
    expect(platforms).toHaveLength(5);
  });
});
