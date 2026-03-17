import { describe, it, expect, vi } from "vitest";
import type { ContentModel, GenerateResponse } from "../src/ai/model";
import { ClaudeAdapter } from "../src/ai/claude";
import { OpenAIAdapter } from "../src/ai/openai";

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

describe("OpenAIAdapter", () => {
  it("has name gpt-4o", () => {
    const adapter = new OpenAIAdapter();
    expect(adapter.name).toBe("gpt-4o");
  });

  it("generate throws not implemented", async () => {
    const adapter = new OpenAIAdapter();
    await expect(adapter.generate("test")).rejects.toThrow("not implemented");
  });
});
