import { describe, it, expect, vi } from "vitest";
import {
  buildContentPrompt,
  parseContentResponse,
  generateContentFile,
  type ContentWriterOptions,
} from "../src/content-writer";

describe("buildContentPrompt", () => {
  const opts: ContentWriterOptions = {
    templateName: "velocity",
    businessType: "Athletic/Sportswear",
    businessName: "SprintWear",
    locale: "en",
    sections: [
      { contentKey: "hero", component: "Hero", contentType: "HeroContent" },
      { contentKey: "footer", component: "Footer", contentType: "BaseFooterContent" },
    ],
    contentTypeName: "VelocityContent",
  };

  it("includes business name and type in the prompt", () => {
    const prompt = buildContentPrompt(opts);
    expect(prompt).toContain("SprintWear");
    expect(prompt).toContain("Athletic/Sportswear");
  });

  it("includes locale in the prompt", () => {
    const prompt = buildContentPrompt(opts);
    expect(prompt).toContain("en");
  });

  it("includes all section content keys", () => {
    const prompt = buildContentPrompt(opts);
    expect(prompt).toContain("hero");
    expect(prompt).toContain("footer");
  });

  it("includes content type names for reference", () => {
    const prompt = buildContentPrompt(opts);
    expect(prompt).toContain("HeroContent");
    expect(prompt).toContain("BaseFooterContent");
  });

  it("requests JSON output", () => {
    const prompt = buildContentPrompt(opts);
    expect(prompt).toContain("JSON");
  });
});

describe("parseContentResponse", () => {
  it("parses valid JSON from AI response", () => {
    const response = `Here is the content:
\`\`\`json
{
  "hero": { "headline": "Run Faster" },
  "footer": { "legal": "© 2026" }
}
\`\`\``;

    const result = parseContentResponse(response);
    expect(result).toEqual({
      hero: { headline: "Run Faster" },
      footer: { legal: "© 2026" },
    });
  });

  it("parses raw JSON without code fences", () => {
    const response = '{ "hero": { "headline": "Test" } }';
    const result = parseContentResponse(response);
    expect(result).toEqual({ hero: { headline: "Test" } });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseContentResponse("not json at all")).toThrow();
  });
});

describe("generateContentFile", () => {
  it("generates TypeScript content file with imports", () => {
    const content = {
      hero: { headline: "Run Faster", tagline: "Push your limits" },
      footer: { legal: "© 2026 SprintWear" },
    };

    const output = generateContentFile(content, "VelocityContent", "sprint-wear");

    expect(output).toContain('import type { VelocityContent } from "@velo/types"');
    expect(output).toContain("const content: VelocityContent");
    expect(output).toContain("Run Faster");
    expect(output).toContain("export default content");
  });

  it("includes metadata section", () => {
    const content = { hero: {} };
    const output = generateContentFile(content, "VelocityContent", "my-app");

    expect(output).toContain("metadata");
    expect(output).toContain("my-app");
  });
});
