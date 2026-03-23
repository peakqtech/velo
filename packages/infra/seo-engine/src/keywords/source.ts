import type { KeywordSuggestion } from "../types/keyword";

export interface KeywordSourceProvider {
  provider: string;
  getKeywords(vertical: string, location: string, channels: string[]): Promise<KeywordSuggestion[]>;
}
