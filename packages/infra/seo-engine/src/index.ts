// Publish pipeline
export { encrypt, decrypt } from "./publish/crypto";
export { generateMDX, commitMDXToGitHub, writeMDXLocal } from "./publish/mdx-writer";
export type { PublishResult, Publisher } from "./publish/publisher";
export { triggerVercelDeploy } from "./publish/deploy-trigger";

// AI model types and adapters
export type { ModelOptions, GenerateResponse, ContentModel } from "./ai/model";
export { ClaudeAdapter } from "./ai/claude";
export { OpenAIAdapter } from "./ai/openai";

// Keyword types (exported first to avoid re-export conflicts)
export type { KeywordSuggestion } from "./types/keyword";
export { KeywordIntent, KeywordChannel } from "./types/keyword";

// Campaign types
export type {
  CampaignSchedule,
  KeywordTarget,
  ContentPiece,
  ContentPlan,
} from "./types/campaign";
export { CampaignFrequency, KeywordSource } from "./types/campaign";

// Content types
export type {
  BlogFrontmatter,
  BlogContent,
  GBPContent,
  SocialContent,
  EmailContent,
  ContentMetaData,
} from "./types/content";
export { GBPCtaType, SocialPlatform } from "./types/content";

// Channel formatter interface + context/result types
export type {
  ChannelFormatter,
  PromptContext,
  ValidationResult,
} from "./content/channel";

// Channel formatter implementations
export { BlogFormatter } from "./content/channels/blog";
export { GBPFormatter } from "./content/channels/gbp";
export { SocialFormatter } from "./content/channels/social";
export { EmailFormatter } from "./content/channels/email";

// Keyword source providers
export type { KeywordSourceProvider } from "./keywords/source";
export { VerticalKeywordProvider } from "./keywords/vertical";
export { GSCKeywordProvider } from "./keywords/gsc";
export { SerpAPIKeywordProvider } from "./keywords/serpapi";
