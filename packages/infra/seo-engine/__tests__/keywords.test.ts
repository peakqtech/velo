import { describe, it, expect, vi } from "vitest";
import type { ContentModel } from "../src/ai/model";
import { VerticalKeywordProvider } from "../src/keywords/vertical";
import { GSCKeywordProvider } from "../src/keywords/gsc";
import { SerpAPIKeywordProvider } from "../src/keywords/serpapi";
import { KeywordIntent, KeywordChannel } from "../src/types/keyword";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockModel(responseText: string): ContentModel {
  return {
    name: "mock-model",
    generate: vi.fn().mockResolvedValue({ text: responseText, tokenCount: 0 }),
  };
}

const SAMPLE_KEYWORDS = [
  {
    keyword: "plumber near me",
    intent: KeywordIntent.TRANSACTIONAL,
    channel: KeywordChannel.GBP,
    volume: 5400,
    difficulty: 42,
  },
  {
    keyword: "how to fix a leaky faucet",
    intent: KeywordIntent.INFORMATIONAL,
    channel: KeywordChannel.BLOG,
    volume: 2200,
    difficulty: 28,
  },
];

// ---------------------------------------------------------------------------
// VerticalKeywordProvider
// ---------------------------------------------------------------------------

describe("VerticalKeywordProvider", () => {
  it("has correct provider name", () => {
    const model = makeMockModel("[]");
    const provider = new VerticalKeywordProvider(model);
    expect(provider.provider).toBe("VERTICAL");
  });

  it("generates keywords for vertical and location", async () => {
    const model = makeMockModel(JSON.stringify(SAMPLE_KEYWORDS));
    const provider = new VerticalKeywordProvider(model);

    const result = await provider.getKeywords("plumbing", "Sydney, AU", ["BLOG", "GBP"]);

    expect(result).toHaveLength(2);
    expect(result[0].keyword).toBe("plumber near me");
    expect(result[0].intent).toBe(KeywordIntent.TRANSACTIONAL);
    expect(result[0].channel).toBe(KeywordChannel.GBP);
    expect(result[1].keyword).toBe("how to fix a leaky faucet");
  });

  it("passes vertical, location, and channels to the AI prompt", async () => {
    const model = makeMockModel(JSON.stringify(SAMPLE_KEYWORDS));
    const provider = new VerticalKeywordProvider(model);

    await provider.getKeywords("plumbing", "Melbourne, AU", ["BLOG", "SOCIAL", "EMAIL"]);

    const generateMock = model.generate as ReturnType<typeof vi.fn>;
    expect(generateMock).toHaveBeenCalledOnce();

    const [prompt] = generateMock.mock.calls[0] as [string];
    expect(prompt).toContain("plumbing");
    expect(prompt).toContain("Melbourne, AU");
    expect(prompt).toContain("BLOG");
    expect(prompt).toContain("SOCIAL");
    expect(prompt).toContain("EMAIL");
  });

  it("handles ```json code fences in AI response", async () => {
    const fenced = "```json\n" + JSON.stringify(SAMPLE_KEYWORDS) + "\n```";
    const model = makeMockModel(fenced);
    const provider = new VerticalKeywordProvider(model);

    const result = await provider.getKeywords("plumbing", "Sydney, AU", ["BLOG"]);
    expect(result).toHaveLength(2);
  });

  it("handles plain ``` code fences in AI response", async () => {
    const fenced = "```\n" + JSON.stringify(SAMPLE_KEYWORDS) + "\n```";
    const model = makeMockModel(fenced);
    const provider = new VerticalKeywordProvider(model);

    const result = await provider.getKeywords("plumbing", "Sydney, AU", ["BLOG"]);
    expect(result).toHaveLength(2);
  });

  it("throws on invalid (non-JSON) AI response", async () => {
    const model = makeMockModel("This is not JSON at all.");
    const provider = new VerticalKeywordProvider(model);

    await expect(
      provider.getKeywords("plumbing", "Sydney, AU", ["BLOG"])
    ).rejects.toThrow("VerticalKeywordProvider: AI returned invalid JSON");
  });

  it("throws when AI returns a JSON object instead of an array", async () => {
    const model = makeMockModel(JSON.stringify({ keyword: "oops" }));
    const provider = new VerticalKeywordProvider(model);

    await expect(
      provider.getKeywords("plumbing", "Sydney, AU", ["BLOG"])
    ).rejects.toThrow("VerticalKeywordProvider: Expected a JSON array");
  });

  it("returns empty array when AI returns []", async () => {
    const model = makeMockModel("[]");
    const provider = new VerticalKeywordProvider(model);

    const result = await provider.getKeywords("plumbing", "Sydney, AU", ["BLOG"]);
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// GSCKeywordProvider stub
// ---------------------------------------------------------------------------

describe("GSCKeywordProvider", () => {
  it("has correct provider name", () => {
    const provider = new GSCKeywordProvider();
    expect(provider.provider).toBe("GSC");
  });

  it("throws not implemented", async () => {
    const provider = new GSCKeywordProvider();
    await expect(provider.getKeywords("any", "any", [])).rejects.toThrow("not implemented");
  });
});

// ---------------------------------------------------------------------------
// SerpAPIKeywordProvider stub
// ---------------------------------------------------------------------------

describe("SerpAPIKeywordProvider", () => {
  it("has correct provider name", () => {
    const provider = new SerpAPIKeywordProvider();
    expect(provider.provider).toBe("SERPAPI");
  });

  it("throws not implemented", async () => {
    const provider = new SerpAPIKeywordProvider();
    await expect(provider.getKeywords("any", "any", [])).rejects.toThrow("not implemented");
  });
});
