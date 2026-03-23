import { describe, it, expect } from "vitest";
import { BlogFormatter } from "../src/content/channels/blog";
import { GBPFormatter } from "../src/content/channels/gbp";
import { SocialFormatter } from "../src/content/channels/social";
import { EmailFormatter } from "../src/content/channels/email";
import type { PromptContext } from "../src/content/channel";

const baseContext: PromptContext = {
  title: "Top QA Strategies for 2026",
  targetKeyword: "QA consulting services",
  businessName: "Velo QA",
  businessType: "QA consulting firm",
  location: "Jakarta, Indonesia",
  tone: "professional",
};

// ---------------------------------------------------------------------------
// BlogFormatter
// ---------------------------------------------------------------------------
describe("BlogFormatter", () => {
  const formatter = new BlogFormatter();

  it("has correct channel", () => {
    expect(formatter.channel).toBe("BLOG");
  });

  it("formatPrompt returns a non-empty string containing the title", () => {
    const prompt = formatter.formatPrompt(baseContext);
    expect(typeof prompt).toBe("string");
    expect(prompt).toContain(baseContext.title);
    expect(prompt).toContain("1200");
    expect(prompt).toContain("H2");
  });

  it("validates valid blog content", () => {
    const words = "word ".repeat(850);
    const validContent = JSON.stringify({
      markdown: `# Top QA Strategies for 2026\n\n## Introduction\n\n${words}`,
      frontmatter: {
        title: "Top QA Strategies for 2026",
        description: "Comprehensive guide to QA consulting strategies.",
        date: "2026-03-17",
        keywords: ["QA", "consulting"],
        author: "Velo QA",
        readingTime: 6,
      },
    });

    const result = formatter.validateOutput(validContent);
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it("rejects blog content without H1 heading", () => {
    const words = "word ".repeat(850);
    const noH1 = JSON.stringify({
      markdown: `## Introduction\n\n${words}`,
      frontmatter: {
        title: "Top QA Strategies for 2026",
        description: "A guide.",
        date: "2026-03-17",
        keywords: ["QA"],
        author: "Velo QA",
        readingTime: 5,
      },
    });

    const result = formatter.validateOutput(noH1);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Markdown must contain an H1 heading (# Title)");
  });

  it("rejects blog content under 800 words", () => {
    const shortContent = JSON.stringify({
      markdown: `# Top QA Strategies\n\nThis is a short post with only a few words.`,
      frontmatter: {
        title: "Top QA Strategies for 2026",
        description: "A guide.",
        date: "2026-03-17",
        keywords: ["QA"],
        author: "Velo QA",
        readingTime: 1,
      },
    });

    const result = formatter.validateOutput(shortContent);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("too short"))).toBe(true);
  });

  it("rejects invalid JSON", () => {
    const result = formatter.validateOutput("not json at all");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Output is not valid JSON");
  });
});

// ---------------------------------------------------------------------------
// GBPFormatter
// ---------------------------------------------------------------------------
describe("GBPFormatter", () => {
  const formatter = new GBPFormatter();

  it("has correct channel and maxLength", () => {
    expect(formatter.channel).toBe("GBP");
    expect(formatter.maxLength).toBe(1500);
  });

  it("validates valid GBP content", () => {
    const validContent = JSON.stringify({
      body: "Visit Velo QA in Jakarta for world-class QA consulting services. Book a free consultation today!",
      ctaType: "BOOK",
      ctaUrl: "https://veloqa.com/book",
    });

    const result = formatter.validateOutput(validContent);
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
  });

  it("rejects body exceeding 1500 characters", () => {
    const longBody = JSON.stringify({
      body: "A".repeat(1501),
      ctaType: "LEARN_MORE",
    });

    const result = formatter.validateOutput(longBody);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("exceeds maximum length"))).toBe(true);
  });

  it("rejects missing ctaType", () => {
    const missingCta = JSON.stringify({
      body: "Check out our QA services.",
    });

    const result = formatter.validateOutput(missingCta);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("ctaType"))).toBe(true);
  });

  it("rejects invalid ctaType value", () => {
    const invalidCta = JSON.stringify({
      body: "Check out our QA services.",
      ctaType: "INVALID_TYPE",
    });

    const result = formatter.validateOutput(invalidCta);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("ctaType"))).toBe(true);
  });

  it("accepts all valid ctaType values", () => {
    // Matches GBPCtaType enum: BOOK, ORDER, SHOP, LEARN_MORE, SIGN_UP, CALL
    const validTypes = ["BOOK", "ORDER", "SHOP", "LEARN_MORE", "SIGN_UP", "CALL"];
    for (const ctaType of validTypes) {
      const content = JSON.stringify({ body: "Short body.", ctaType });
      const result = formatter.validateOutput(content);
      expect(result.valid).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// SocialFormatter
// ---------------------------------------------------------------------------
describe("SocialFormatter", () => {
  const formatter = new SocialFormatter();

  it("has correct channel and maxLength", () => {
    expect(formatter.channel).toBe("SOCIAL");
    expect(formatter.maxLength).toBe(2200);
  });

  it("validates valid social content", () => {
    const validContent = JSON.stringify({
      caption: "Boost your product quality with top QA consulting services in Jakarta! 🚀",
      hashtags: ["#QA", "#QualityAssurance", "#Jakarta", "#Testing", "#TechConsulting"],
      platform: "INSTAGRAM",
      imagePrompt: "Professional team working on software testing in a modern office",
    });

    const result = formatter.validateOutput(validContent);
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
  });

  it("rejects empty hashtags array", () => {
    const noHashtags = JSON.stringify({
      caption: "Great post here!",
      hashtags: [],
      platform: "FACEBOOK",
    });

    const result = formatter.validateOutput(noHashtags);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("hashtags"))).toBe(true);
  });

  it("rejects missing hashtags field", () => {
    const missingHashtags = JSON.stringify({
      caption: "Great post here!",
      platform: "LINKEDIN",
    });

    const result = formatter.validateOutput(missingHashtags);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("hashtags"))).toBe(true);
  });

  it("rejects invalid platform", () => {
    const invalidPlatform = JSON.stringify({
      caption: "Great post!",
      hashtags: ["#QA"],
      platform: "SNAPCHAT",
    });

    const result = formatter.validateOutput(invalidPlatform);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("platform"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// EmailFormatter
// ---------------------------------------------------------------------------
describe("EmailFormatter", () => {
  const formatter = new EmailFormatter();

  it("has correct channel", () => {
    expect(formatter.channel).toBe("EMAIL");
  });

  it("validates valid email content", () => {
    const validContent = JSON.stringify({
      subjectLine: "Improve Your Product Quality with Expert QA",
      previewText: "Discover how Velo QA can transform your testing process.",
      body: "Dear reader,\n\nQuality assurance is the backbone of great software...",
      ctaLabel: "Book a Free Consultation",
      ctaUrl: "https://veloqa.com/consult",
    });

    const result = formatter.validateOutput(validContent);
    expect(result.valid).toBe(true);
    expect(result.parsed).toBeDefined();
  });

  it("rejects missing subject line", () => {
    const missingSubject = JSON.stringify({
      previewText: "A preview.",
      body: "Email body here.",
      ctaLabel: "Click Here",
      ctaUrl: "https://example.com",
    });

    const result = formatter.validateOutput(missingSubject);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("subjectLine"))).toBe(true);
  });

  it("rejects missing body", () => {
    const missingBody = JSON.stringify({
      subjectLine: "A subject line",
      previewText: "A preview.",
      ctaLabel: "Click Here",
      ctaUrl: "https://example.com",
    });

    const result = formatter.validateOutput(missingBody);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("body"))).toBe(true);
  });

  it("rejects missing ctaLabel", () => {
    const missingCtaLabel = JSON.stringify({
      subjectLine: "A subject",
      previewText: "A preview.",
      body: "Email body.",
      ctaUrl: "https://example.com",
    });

    const result = formatter.validateOutput(missingCtaLabel);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("ctaLabel"))).toBe(true);
  });

  it("rejects missing ctaUrl", () => {
    const missingCtaUrl = JSON.stringify({
      subjectLine: "A subject",
      previewText: "A preview.",
      body: "Email body.",
      ctaLabel: "Click Here",
    });

    const result = formatter.validateOutput(missingCtaUrl);
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.includes("ctaUrl"))).toBe(true);
  });
});
