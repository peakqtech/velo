export interface SectionInfo {
  contentKey: string;
  component: string;
  contentType: string;
}

export interface ContentWriterOptions {
  templateName: string;
  businessType: string;
  businessName: string;
  locale: string;
  sections: SectionInfo[];
  contentTypeName: string;
}

/**
 * Build a prompt for the AI to generate realistic content for a template.
 */
export function buildContentPrompt(opts: ContentWriterOptions): string {
  const sectionList = opts.sections
    .map((s) => `  - "${s.contentKey}" (type: ${s.contentType})`)
    .join("\n");

  return `You are a content writer for a website builder platform.

Generate realistic, professional website content for a ${opts.businessType} business called "${opts.businessName}".

Template: ${opts.templateName}
Locale: ${opts.locale}
Content type: ${opts.contentTypeName}

The website has these sections:
${sectionList}

Requirements:
- Write all text in the "${opts.locale}" locale/language
- Use realistic, professional copy appropriate for a ${opts.businessType} business
- Include plausible placeholder data (names, descriptions, URLs)
- For images, use descriptive placeholder paths like "/images/hero-bg.jpg"
- For CTAs, use action-oriented text
- Match the tone and style expected for ${opts.businessType}

Return ONLY a JSON object with keys matching the section contentKeys above.
Each key should contain an object matching the expected TypeScript type structure.
Do NOT include a "metadata" key — that will be added separately.

Respond with valid JSON only, wrapped in \`\`\`json code fences.`;
}

/**
 * Parse the AI response to extract the JSON content object.
 */
export function parseContentResponse(response: string): Record<string, unknown> {
  // Try to extract JSON from code fences first
  const fenceMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : response.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object");
    }
    return parsed;
  } catch (err) {
    throw new Error(
      `Failed to parse AI response as JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Generate a TypeScript content file from the parsed content object.
 */
export function generateContentFile(
  content: Record<string, unknown>,
  contentTypeName: string,
  appName: string
): string {
  const contentWithMetadata = {
    ...content,
    metadata: {
      title: appName,
      description: `Welcome to ${appName}`,
      ogImage: "/images/og-image.jpg",
    },
  };

  const serialized = JSON.stringify(contentWithMetadata, null, 2)
    // Remove quotes around keys for cleaner TS
    .replace(/"([a-zA-Z_]\w*)":/g, "$1:");

  return `import type { ${contentTypeName} } from "@velo/types";

const content: ${contentTypeName} = ${serialized} as ${contentTypeName};

export default content;
`;
}
