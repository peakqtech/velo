import { describe, it, expect, vi } from "vitest";
import type { ContentModel } from "../src/ai/model";
import type { ChannelFormatter, PromptContext, ValidationResult } from "../src/content/channel";
import { ContentGenerator } from "../src/content/generator";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeModel(responses: Array<{ text: string; tokenCount: number }>): ContentModel {
  let callIndex = 0;
  return {
    name: "mock-model",
    generate: async (_prompt: string) => {
      const resp = responses[Math.min(callIndex, responses.length - 1)];
      callIndex++;
      return resp;
    },
  };
}

const baseContext: PromptContext = {
  title: "5 Tips for Better Sleep",
  targetKeyword: "better sleep tips",
  businessName: "Rest Well Co.",
  businessType: "Health & Wellness",
  location: "New York, NY",
};

function makeFormatter(validationResult: ValidationResult): ChannelFormatter {
  return {
    channel: "BLOG",
    formatPrompt: (_ctx: PromptContext) => `Write a blog post about: ${_ctx.title}`,
    validateOutput: (_raw: string) => validationResult,
  };
}

// ---------------------------------------------------------------------------
// ContentGenerator tests
// ---------------------------------------------------------------------------

describe("ContentGenerator", () => {
  it("generates content using model and formatter", async () => {
    const model = makeModel([{ text: '{"headline":"Test"}', tokenCount: 80 }]);
    const formatter = makeFormatter({
      valid: true,
      parsed: { headline: "Test" } as unknown as ReturnType<typeof formatter.validateOutput>["parsed"],
    });
    const generator = new ContentGenerator(model);

    const result = await generator.generate({ formatter, context: baseContext });

    expect(result.valid).toBe(true);
    expect(result.modelUsed).toBe("mock-model");
    expect(result.content).toEqual({ headline: "Test" });
  });

  it("returns tokenCount from model response", async () => {
    const model = makeModel([{ text: "some content", tokenCount: 250 }]);
    const formatter = makeFormatter({ valid: true, parsed: undefined });
    const generator = new ContentGenerator(model);

    const result = await generator.generate({ formatter, context: baseContext });

    expect(result.tokenCount).toBe(250);
  });

  it("retries on validation failure and succeeds on second attempt", async () => {
    const model = makeModel([
      { text: "bad output", tokenCount: 50 },
      { text: '{"fixed":true}', tokenCount: 90 },
    ]);

    let callCount = 0;
    const formatter: ChannelFormatter = {
      channel: "BLOG",
      formatPrompt: (_ctx: PromptContext) => "Write something",
      validateOutput: (_raw: string) => {
        callCount++;
        if (callCount === 1) {
          return { valid: false, errors: ["Missing headline field"] };
        }
        return { valid: true, parsed: { fixed: true } as unknown as ReturnType<typeof formatter.validateOutput>["parsed"] };
      },
    };

    const generator = new ContentGenerator(model);
    const result = await generator.generate({ formatter, context: baseContext, maxRetries: 2 });

    expect(result.valid).toBe(true);
    expect(result.tokenCount).toBe(90);
  });

  it("returns invalid result after exhausting retries", async () => {
    const model = makeModel([
      { text: "bad1", tokenCount: 30 },
      { text: "bad2", tokenCount: 31 },
      { text: "bad3", tokenCount: 32 },
    ]);

    const formatter = makeFormatter({ valid: false, errors: ["Always fails"] });
    const generator = new ContentGenerator(model);

    const result = await generator.generate({ formatter, context: baseContext, maxRetries: 2 });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(["Always fails"]);
    expect(result.modelUsed).toBe("mock-model");
  });

  it("retry prompt includes error feedback", async () => {
    const prompts: string[] = [];

    const model: ContentModel = {
      name: "mock-model",
      generate: async (prompt: string) => {
        prompts.push(prompt);
        return { text: "still bad", tokenCount: 10 };
      },
    };

    const formatter: ChannelFormatter = {
      channel: "BLOG",
      formatPrompt: (_ctx: PromptContext) => "Original prompt",
      validateOutput: (_raw: string) => ({ valid: false, errors: ["headline missing"] }),
    };

    const generator = new ContentGenerator(model);
    await generator.generate({ formatter, context: baseContext, maxRetries: 1 });

    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain("headline missing");
    expect(prompts[1]).toContain("Original prompt");
  });

  it("uses default maxRetries of 2", async () => {
    let generateCallCount = 0;
    const model: ContentModel = {
      name: "mock-model",
      generate: async (_prompt: string) => {
        generateCallCount++;
        return { text: "bad", tokenCount: 5 };
      },
    };

    const formatter = makeFormatter({ valid: false, errors: ["bad"] });
    const generator = new ContentGenerator(model);

    await generator.generate({ formatter, context: baseContext });

    // 1 initial + 2 retries = 3 total calls
    expect(generateCallCount).toBe(3);
  });
});
