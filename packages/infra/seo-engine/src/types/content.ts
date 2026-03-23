export enum GBPCtaType {
  BOOK = "BOOK",
  ORDER = "ORDER",
  SHOP = "SHOP",
  LEARN_MORE = "LEARN_MORE",
  SIGN_UP = "SIGN_UP",
  CALL = "CALL",
}

export enum SocialPlatform {
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  TWITTER = "TWITTER",
  LINKEDIN = "LINKEDIN",
  TIKTOK = "TIKTOK",
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string; // ISO date string
  keywords: string[];
  image?: string;
  author: string;
  category?: string;
  readingTime: number; // minutes
}

export interface BlogContent {
  markdown: string;
  frontmatter: BlogFrontmatter;
}

export interface GBPContent {
  body: string; // max 1500 chars per GBP spec
  ctaType: GBPCtaType;
  ctaUrl?: string;
}

export interface SocialContent {
  caption: string;
  hashtags: string[];
  platform: SocialPlatform;
  imagePrompt?: string;
}

export interface EmailContent {
  subjectLine: string;
  previewText: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface ContentMetaData {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  schemaMarkup?: Record<string, unknown>;
}
