import type { KeywordSuggestion } from "../types/keyword";
import type { KeywordSourceProvider } from "./source";

export class GSCKeywordProvider implements KeywordSourceProvider {
  readonly provider = "GSC";

  async getKeywords(
    _vertical: string,
    _location: string,
    _channels: string[]
  ): Promise<KeywordSuggestion[]> {
    throw new Error("GSCKeywordProvider: not implemented");
  }
}
