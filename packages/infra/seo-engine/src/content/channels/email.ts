import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { EmailContent } from "../../types/content";

export class EmailFormatter implements ChannelFormatter {
  readonly channel = "EMAIL" as const;

  formatPrompt(context: PromptContext): string {
    const { title, targetKeyword, businessName, businessType, location, tone } = context;

    return `You are an email marketing specialist writing for ${businessName}, a ${businessType} based in ${location}.

Write a marketing email for the following topic:

Topic: ${title}
${targetKeyword ? `Focus Keyword: ${targetKeyword}` : ""}
Tone: ${tone ?? "professional and persuasive"}

Requirements:
- Subject line should be compelling and under 60 characters
- Preview text should complement the subject line (under 100 chars)
- Body should be clear, engaging, and value-driven
- Include a strong call-to-action with a label and URL
- Keep email body concise (300–600 words)

Return your response as valid JSON in the following format:
{
  "subjectLine": "<email subject line>",
  "previewText": "<email preview text>",
  "body": "<email body in plain text or markdown>",
  "ctaLabel": "<call-to-action button label>",
  "ctaUrl": "<call-to-action URL>"
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

    // Check subjectLine
    if (typeof obj.subjectLine !== "string" || obj.subjectLine.trim() === "") {
      errors.push("Missing or empty 'subjectLine' field");
    }

    // Check body
    if (typeof obj.body !== "string" || obj.body.trim() === "") {
      errors.push("Missing or empty 'body' field");
    }

    // Check ctaLabel
    if (typeof obj.ctaLabel !== "string" || obj.ctaLabel.trim() === "") {
      errors.push("Missing or empty 'ctaLabel' field");
    }

    // Check ctaUrl
    if (typeof obj.ctaUrl !== "string" || obj.ctaUrl.trim() === "") {
      errors.push("Missing or empty 'ctaUrl' field");
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, parsed: parsed as EmailContent };
  }
}
