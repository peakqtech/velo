import { describe, it, expect, vi } from "vitest";
import type { ContentModel, GenerateResponse } from "../src/ai/model";
import { ClaudeAdapter } from "../src/ai/claude";
import { OpenAIAdapter } from "../src/ai/openai";
import { GeminiAdapter } from "../src/ai/gemini";
import { createModel } from "../src/ai/factory";

// ---------------------------------------------------------------------------
// Mock model fulfills interface
// ---------------------------------------------------------------------------

describe("ContentModel interface", () => {
  it("mock model fulfills interface and returns GenerateResponse", async () => {
    const mockModel: ContentModel = {
      name: "mock-model",
      generate: async (_prompt: string) => ({
        text: "hello world",
        tokenCount: 42,
      }),
    };

    const result: GenerateResponse = await mockModel.generate("test prompt");

    expect(result.text).toBe("hello world");
    expect(result.tokenCount).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// ClaudeAdapter
// ---------------------------------------------------------------------------

describe("ClaudeAdapter", () => {
  it("has correct model name", () => {
    const adapter = new ClaudeAdapter("sk-test-key");
    expect(adapter.name).toBe("claude-sonnet-4");
  });

  it("throws on missing API key", () => {
    expect(() => new ClaudeAdapter("")).toThrow("Anthropic API key is required");
  });

  it("buildRequest creates correct structure with defaults", () => {
    const adapter = new ClaudeAdapter("sk-test-key");
    const req = adapter.buildRequest("Say hello");

    expect(req.model).toBe("claude-sonnet-4-20250514");
    expect(req.max_tokens).toBe(1024);
    expect(req.messages).toHaveLength(1);
    expect(req.messages[0]).toEqual({ role: "user", content: "Say hello" });
    expect(req.temperature).toBeUndefined();
  });

  it("buildRequest respects custom options", () => {
    const adapter = new ClaudeAdapter("sk-test-key");
    const req = adapter.buildRequest("prompt", { maxTokens: 512, temperature: 0.7 });

    expect(req.max_tokens).toBe(512);
    expect(req.temperature).toBe(0.7);
  });

  it("parseResponse extracts text and tokenCount", () => {
    const adapter = new ClaudeAdapter("sk-test-key");

    const fakeResponse = {
      content: [{ type: "text", text: "Generated content here" }],
      usage: { input_tokens: 20, output_tokens: 30 },
    };

    const result = adapter.parseResponse(fakeResponse);

    expect(result.text).toBe("Generated content here");
    expect(result.tokenCount).toBe(50); // 20 + 30
  });

  it("parseResponse handles missing text block gracefully", () => {
    const adapter = new ClaudeAdapter("sk-test-key");

    const fakeResponse = {
      content: [],
      usage: { input_tokens: 5, output_tokens: 0 },
    };

    const result = adapter.parseResponse(fakeResponse);

    expect(result.text).toBe("");
    expect(result.tokenCount).toBe(5);
  });

  it("generate calls fetch and returns GenerateResponse", async () => {
    const adapter = new ClaudeAdapter("sk-live-key");

    const mockFetchResponse = {
      content: [{ type: "text", text: "AI response" }],
      usage: { input_tokens: 10, output_tokens: 15 },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockFetchResponse,
    });

    vi.stubGlobal("fetch", mockFetch);

    const result = await adapter.generate("Write a blog intro");

    expect(result.text).toBe("AI response");
    expect(result.tokenCount).toBe(25);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("sk-live-key");

    vi.unstubAllGlobals();
  });

  it("generate throws on non-ok response", async () => {
    const adapter = new ClaudeAdapter("sk-live-key");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    vi.stubGlobal("fetch", mockFetch);

    await expect(adapter.generate("prompt")).rejects.toThrow("Anthropic API error 401");

    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// OpenAIAdapter stub
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// OpenAIAdapter
// ---------------------------------------------------------------------------

describe("OpenAIAdapter", () => {
  it("has name gpt-4o", () => {
    const adapter = new OpenAIAdapter("sk-test");
    expect(adapter.name).toBe("gpt-4o");
  });

  it("throws on missing API key", () => {
    expect(() => new OpenAIAdapter("")).toThrow("OpenAI API key is required");
  });

  it("buildRequest creates correct structure", () => {
    const adapter = new OpenAIAdapter("sk-test");
    const req = adapter.buildRequest("Hello", { maxTokens: 2048, temperature: 0.5 });
    expect(req.model).toBe("gpt-4o");
    expect(req.messages[0]).toEqual({ role: "user", content: "Hello" });
    expect(req.max_tokens).toBe(2048);
    expect(req.temperature).toBe(0.5);
  });

  it("parseResponse extracts text and tokenCount", () => {
    const adapter = new OpenAIAdapter("sk-test");
    const result = adapter.parseResponse({
      choices: [{ message: { role: "assistant", content: "Generated text" } }],
      usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
    });
    expect(result.text).toBe("Generated text");
    expect(result.tokenCount).toBe(30);
  });

  it("generate calls OpenAI API and returns response", async () => {
    const adapter = new OpenAIAdapter("sk-live");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { role: "assistant", content: "AI output" } }],
        usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await adapter.generate("test prompt");
    expect(result.text).toBe("AI output");
    expect(result.tokenCount).toBe(15);

    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");

    vi.unstubAllGlobals();
  });

  it("generate throws on non-ok response", async () => {
    const adapter = new OpenAIAdapter("sk-live");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false, status: 429, text: async () => "Rate limited",
    }));

    await expect(adapter.generate("test")).rejects.toThrow("OpenAI API error 429");
    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// GeminiAdapter
// ---------------------------------------------------------------------------

describe("GeminiAdapter", () => {
  it("has name gemini-2.5-pro", () => {
    const adapter = new GeminiAdapter("key-test");
    expect(adapter.name).toBe("gemini-2.5-pro");
  });

  it("throws on missing API key", () => {
    expect(() => new GeminiAdapter("")).toThrow("Google AI API key is required");
  });

  it("buildRequest creates correct structure", () => {
    const adapter = new GeminiAdapter("key-test");
    const req = adapter.buildRequest("Hello", { maxTokens: 4096, temperature: 0.7 });
    expect(req.contents[0].parts[0].text).toBe("Hello");
    expect(req.generationConfig?.maxOutputTokens).toBe(4096);
    expect(req.generationConfig?.temperature).toBe(0.7);
  });

  it("buildRequest omits generationConfig when no options", () => {
    const adapter = new GeminiAdapter("key-test");
    const req = adapter.buildRequest("Hello");
    expect(req.generationConfig).toBeUndefined();
  });

  it("parseResponse extracts text and tokenCount", () => {
    const adapter = new GeminiAdapter("key-test");
    const result = adapter.parseResponse({
      candidates: [{ content: { parts: [{ text: "Gemini output" }] } }],
      usageMetadata: { promptTokenCount: 8, candidatesTokenCount: 12, totalTokenCount: 20 },
    });
    expect(result.text).toBe("Gemini output");
    expect(result.tokenCount).toBe(20);
  });

  it("generate calls Gemini API with key in URL", async () => {
    const adapter = new GeminiAdapter("my-api-key");
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "response" }] } }],
        usageMetadata: { promptTokenCount: 5, candidatesTokenCount: 10, totalTokenCount: 15 },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await adapter.generate("test");
    expect(result.text).toBe("response");
    expect(result.tokenCount).toBe(15);

    const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("generativelanguage.googleapis.com");
    expect(url).toContain("key=my-api-key");

    vi.unstubAllGlobals();
  });

  it("generate throws on non-ok response", async () => {
    const adapter = new GeminiAdapter("key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false, status: 403, text: async () => "Forbidden",
    }));

    await expect(adapter.generate("test")).rejects.toThrow("Gemini API error 403");
    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// createModel factory
// ---------------------------------------------------------------------------

describe("createModel", () => {
  it("creates ClaudeAdapter when provider is claude", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    const model = createModel("claude");
    expect(model.name).toBe("claude-sonnet-4");
    vi.unstubAllEnvs();
  });

  it("creates OpenAIAdapter when provider is openai", () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
    const model = createModel("openai");
    expect(model.name).toBe("gpt-4o");
    vi.unstubAllEnvs();
  });

  it("creates GeminiAdapter when provider is gemini", () => {
    vi.stubEnv("GOOGLE_AI_API_KEY", "key-test");
    const model = createModel("gemini");
    expect(model.name).toBe("gemini-2.5-pro");
    vi.unstubAllEnvs();
  });

  it("reads SEO_MODEL env var when no provider given", () => {
    vi.stubEnv("SEO_MODEL", "gemini");
    vi.stubEnv("GOOGLE_AI_API_KEY", "key-test");
    const model = createModel();
    expect(model.name).toBe("gemini-2.5-pro");
    vi.unstubAllEnvs();
  });

  it("defaults to claude when no provider or env var", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    const model = createModel();
    expect(model.name).toBe("claude-sonnet-4");
    vi.unstubAllEnvs();
  });

  it("throws on missing API key", () => {
    expect(() => createModel("openai")).toThrow("OPENAI_API_KEY is required");
  });

  it("throws on unknown provider", () => {
    expect(() => createModel("llama" as any)).toThrow("Unknown model provider: llama");
  });
});
