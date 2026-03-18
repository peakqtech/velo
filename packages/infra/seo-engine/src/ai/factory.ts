import type { ContentModel } from "./model";
import { ClaudeAdapter } from "./claude";
import { OpenAIAdapter } from "./openai";
import { GeminiAdapter } from "./gemini";

export type ModelProvider = "claude" | "openai" | "gemini";

/**
 * Creates a ContentModel adapter based on the provider name.
 *
 * Provider is resolved in order:
 * 1. Explicit `provider` argument
 * 2. `SEO_MODEL` environment variable
 * 3. Defaults to "claude"
 *
 * API keys are read from environment variables:
 * - claude  → ANTHROPIC_API_KEY
 * - openai  → OPENAI_API_KEY
 * - gemini  → GOOGLE_AI_API_KEY
 */
export function createModel(provider?: ModelProvider): ContentModel {
  const resolved = provider ?? (process.env.SEO_MODEL as ModelProvider) ?? "claude";

  switch (resolved) {
    case "claude": {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error("ANTHROPIC_API_KEY is required for Claude model");
      return new ClaudeAdapter(key);
    }
    case "openai": {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY is required for OpenAI model");
      return new OpenAIAdapter(key);
    }
    case "gemini": {
      const key = process.env.GOOGLE_AI_API_KEY;
      if (!key) throw new Error("GOOGLE_AI_API_KEY is required for Gemini model");
      return new GeminiAdapter(key);
    }
    default:
      throw new Error(`Unknown model provider: ${resolved}. Use "claude", "openai", or "gemini".`);
  }
}
