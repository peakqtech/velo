export enum KeywordIntent {
  INFORMATIONAL = "INFORMATIONAL",
  NAVIGATIONAL = "NAVIGATIONAL",
  COMMERCIAL = "COMMERCIAL",
  TRANSACTIONAL = "TRANSACTIONAL",
}

export enum KeywordChannel {
  BLOG = "BLOG",
  GBP = "GBP",
  SOCIAL = "SOCIAL",
  EMAIL = "EMAIL",
  LANDING_PAGE = "LANDING_PAGE",
}

export interface KeywordSuggestion {
  keyword: string;
  intent: KeywordIntent;
  channel: KeywordChannel;
  volume?: number;
  difficulty?: number; // 0–100
}
