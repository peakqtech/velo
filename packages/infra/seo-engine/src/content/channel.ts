import type { BlogContent, GBPContent, SocialContent, EmailContent } from "../types/content";

export interface ChannelFormatter {
  channel: "BLOG" | "GBP" | "SOCIAL" | "EMAIL";
  maxLength?: number;
  formatPrompt(context: PromptContext): string;
  validateOutput(raw: string): ValidationResult;
}

export interface PromptContext {
  title: string;
  targetKeyword?: string;
  outline?: string;
  businessName: string;
  businessType: string;
  location: string;
  tone?: string;
  existingTitles?: string[];
}

export interface ValidationResult {
  valid: boolean;
  parsed?: BlogContent | GBPContent | SocialContent | EmailContent;
  errors?: string[];
}
