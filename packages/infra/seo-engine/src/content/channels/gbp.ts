import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { GBPContent } from "../../types/content";
import { GBPCtaType } from "../../types/content";

const VALID_CTA_TYPES = new Set<string>(Object.values(GBPCtaType));

export class GBPFormatter implements ChannelFormatter {
  readonly channel = "GBP" as const;
  readonly maxLength = 1500;

  formatPrompt(context: PromptContext): string {
    const { title, targetKeyword, businessName, businessType, location, tone } = context;

    return `You are writing a Google Business Profile post for ${businessName}, a ${businessType} based in ${location}.

Write an engaging GBP post for the following topic:

Topic: ${title}
${targetKeyword ? `Focus Keyword: ${targetKeyword}` : ""}
Tone: ${tone ?? "friendly and professional"}

Requirements:
- Maximum 1500 characters for the body
- Include a clear call to action
- Mention the business name and location naturally
- Be concise and direct

Return your response as valid JSON in the following format:
{
  "body": "<post body text, max 1500 chars>",
  "ctaType": "<one of: BOOK | ORDER | SHOP | LEARN_MORE | SIGN_UP | CALL>",
  "ctaUrl": "<URL for the CTA, if applicable>"
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

    // Check body field
    if (typeof obj.body !== "string" || obj.body.trim() === "") {
      errors.push("Missing or empty 'body' field");
    } else if (obj.body.length > this.maxLength) {
      errors.push(`Body exceeds maximum length of ${this.maxLength} characters (got ${obj.body.length})`);
    }

    // Check ctaType
    if (typeof obj.ctaType !== "string" || !VALID_CTA_TYPES.has(obj.ctaType)) {
      errors.push(
        `Invalid or missing 'ctaType'. Must be one of: ${[...VALID_CTA_TYPES].join(", ")}`
      );
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, parsed: parsed as GBPContent };
  }
}
