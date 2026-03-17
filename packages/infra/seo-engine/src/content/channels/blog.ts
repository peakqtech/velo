import type { ChannelFormatter, PromptContext, ValidationResult } from "../channel";
import type { BlogContent } from "../../types/content";

export class BlogFormatter implements ChannelFormatter {
  readonly channel = "BLOG" as const;

  formatPrompt(context: PromptContext): string {
    const { title, targetKeyword, outline, businessName, businessType, location, tone } = context;

    return `You are an expert SEO content writer for ${businessName}, a ${businessType} based in ${location}.

Write a comprehensive SEO blog post with the following specifications:

Title: ${title}
${targetKeyword ? `Target Keyword: ${targetKeyword}` : ""}
${outline ? `Outline:\n${outline}` : ""}
Tone: ${tone ?? "professional and informative"}

Requirements:
- Word count: 1200–1800 words
- Use H2 subheadings to structure the content
- Include the target keyword naturally throughout
- Write engaging, value-driven content for the reader
- Include a compelling introduction and a clear conclusion

Return your response as valid JSON in the following format:
{
  "markdown": "<full blog post in markdown with H1 title and H2 subheadings>",
  "frontmatter": {
    "title": "<SEO-optimized title>",
    "description": "<meta description 150–160 chars>",
    "date": "<today's ISO date>",
    "keywords": ["<keyword1>", "<keyword2>", "..."],
    "author": "${businessName}",
    "category": "<relevant category>",
    "readingTime": <estimated reading time in minutes>
  }
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

    // Check markdown field
    if (typeof obj.markdown !== "string" || obj.markdown.trim() === "") {
      errors.push("Missing or empty 'markdown' field");
    } else {
      // Check for H1 heading
      if (!/^#\s+.+/m.test(obj.markdown)) {
        errors.push("Markdown must contain an H1 heading (# Title)");
      }

      // Check minimum word count (800+)
      const wordCount = obj.markdown.split(/\s+/).filter(Boolean).length;
      if (wordCount < 800) {
        errors.push(`Markdown content too short: ${wordCount} words (minimum 800)`);
      }
    }

    // Check frontmatter
    if (typeof obj.frontmatter !== "object" || obj.frontmatter === null) {
      errors.push("Missing 'frontmatter' field");
    } else {
      const fm = obj.frontmatter as Record<string, unknown>;
      const requiredFields = ["title", "description", "date", "keywords", "author", "readingTime"];
      for (const field of requiredFields) {
        if (fm[field] === undefined || fm[field] === null || fm[field] === "") {
          errors.push(`Missing required frontmatter field: '${field}'`);
        }
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return { valid: true, parsed: parsed as BlogContent };
  }
}
