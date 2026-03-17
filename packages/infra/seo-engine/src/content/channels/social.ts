import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { SocialContent } from "../../types/content";
import { SocialPlatform } from "../../types/content";

const VALID_PLATFORMS = new Set<string>(Object.values(SocialPlatform));

export class SocialFormatter implements ChannelFormatter {
  readonly channel = "SOCIAL" as const;
  readonly maxLength = 2200;

  formatPrompt(context: PromptContext): string {
    const { title, targetKeyword, businessName, businessType, location, tone } = context;

    return `You are a social media content creator for ${businessName}, a ${businessType} based in ${location}.

Create an engaging social media post for the following topic:

Topic: ${title}
${targetKeyword ? `Focus Keyword: ${targetKeyword}` : ""}
Tone: ${tone ?? "engaging and conversational"}

Requirements:
- Caption should be compelling and drive engagement
- Include at least 5 relevant hashtags
- Keep caption under 2200 characters
- Include a visual prompt for an accompanying image

Return your response as valid JSON in the following format:
{
  "caption": "<social media caption>",
  "hashtags": ["#hashtag1", "#hashtag2", "..."],
  "platform": "<one of: INSTAGRAM | FACEBOOK | TWITTER | LINKEDIN | TIKTOK>",
  "imagePrompt": "<description for generating an accompanying image>"
}`;
  }

  validateOutput(raw: string): ValidationResult {
    const errors: string[] = [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, errors: ["Output is not valid JSON"] };
    }

    const obj = parsed as Record<string, unknown>;

    // Check caption
    if (typeof obj.caption !== "string" || obj.caption.trim() === "") {
      errors.push("Missing or empty 'caption' field");
    }

    // Check hashtags — must be array with at least 1 entry
    if (!Array.isArray(obj.hashtags) || obj.hashtags.length === 0) {
      errors.push("'hashtags' must be a non-empty array");
    }

    // Check platform
    if (typeof obj.platform !== "string" || !VALID_PLATFORMS.has(obj.platform)) {
      errors.push(
        `Invalid or missing 'platform'. Must be one of: ${[...VALID_PLATFORMS].join(", ")}`
      );
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, parsed: parsed as SocialContent };
  }
}
