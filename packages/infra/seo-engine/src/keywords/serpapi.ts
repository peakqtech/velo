import type { KeywordSuggestion } from "../types/keyword";
import type { KeywordSourceProvider } from "./source";

export class SerpAPIKeywordProvider implements KeywordSourceProvider {
  readonly provider = "SERPAPI";

  async getKeywords(
    _vertical: string,
    _location: string,
    _channels: string[]
  ): Promise<KeywordSuggestion[]> {
    throw new Error("SerpAPIKeywordProvider: not implemented");
  }
}
