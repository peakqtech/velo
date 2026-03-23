import { KeywordIntent } from "./keyword";

export { KeywordIntent };

export enum CampaignFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
}

export enum KeywordSource {
  MANUAL = "MANUAL",
  AI_SUGGESTED = "AI_SUGGESTED",
  COMPETITOR = "COMPETITOR",
  SEARCH_CONSOLE = "SEARCH_CONSOLE",
}

export interface CampaignSchedule {
  startDate: Date;
  endDate?: Date;
  frequency: CampaignFrequency;
  preferredDays?: number[]; // 0 = Sunday, 6 = Saturday
}

export interface KeywordTarget {
  keyword: string;
  volume?: number;
  difficulty?: number; // 0–100
  intent: KeywordIntent;
  source: KeywordSource;
}

export interface ContentPiece {
  title: string;
  channel: string;
  targetKeyword: string;
  scheduledFor: Date;
  outline: string;
}

export interface ContentPlan {
  pieces: ContentPiece[];
}
