import { PrismaClient, Channel } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Vertical → Business type mapping ────────────────────────────────────────

const verticals = [
  { name: "velocity", businessType: "Athletic/Sportswear", tone: "energetic, motivating, performance-driven" },
  { name: "ember",    businessType: "Restaurant/Fine Dining", tone: "warm, knowledgeable, locally-aware" },
  { name: "haven",   businessType: "Real Estate", tone: "trustworthy, professional, aspirational" },
  { name: "nexus",   businessType: "Creative Agency", tone: "bold, innovative, results-oriented" },
  { name: "prism",   businessType: "SaaS/Technology", tone: "clear, authoritative, solution-focused" },
  { name: "serenity", businessType: "Wellness/Spa", tone: "calming, nurturing, mindful" },
] as const;

// ─── Channel-specific prompt instructions ─────────────────────────────────────

const channelInstructions: Record<Channel, string> = {
  BLOG: "Write a comprehensive SEO-optimized blog post. Word count: 1200-1800 words. Use H2 subheadings. Return JSON with markdown and frontmatter.",
  GBP: "Write a Google Business Profile post. Maximum 1500 characters. Include a clear CTA. Return JSON with body, ctaType, ctaUrl.",
  SOCIAL: "Write a social media post. Include 5-10 hashtags. Keep caption under 2200 chars. Return JSON with caption, hashtags, platform, imagePrompt.",
  EMAIL: "Write a marketing email. Keep subject under 60 chars. Return JSON with subjectLine, previewText, body, ctaLabel, ctaUrl.",
};

// ─── Channel-specific template names ─────────────────────────────────────────

const channelNames: Record<Channel, string> = {
  BLOG: "SEO Blog Post",
  GBP: "Google Business Profile Post",
  SOCIAL: "Social Media Post",
  EMAIL: "Marketing Email",
};

// ─── Prompt template builder ──────────────────────────────────────────────────

function buildPromptTemplate(businessType: string, tone: string, channelInstruction: string): string {
  return `You are a professional content writer specializing in ${businessType} businesses.

Business: {{businessName}}
Type: {{businessType}} — ${businessType}
Location: {{location}}
Content Title: {{title}}
Target Keyword: {{targetKeyword}}
Outline: {{outline}}

Tone: ${tone}

Task: ${channelInstruction}

Use the provided variables to personalize the content. Ensure the target keyword appears naturally throughout the content. Match the established tone for this vertical.`;
}

// ─── Seed function ─────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding SEO content templates...\n");

  const channels: Channel[] = ["BLOG", "GBP", "SOCIAL", "EMAIL"];
  let count = 0;

  for (const vertical of verticals) {
    for (const channel of channels) {
      const name = channelNames[channel];
      const promptTemplate = buildPromptTemplate(
        vertical.businessType,
        vertical.tone,
        channelInstructions[channel],
      );

      const template = await prisma.contentTemplate.upsert({
        where: {
          vertical_channel_name: {
            vertical: vertical.name,
            channel,
            name,
          },
        },
        update: {
          promptTemplate,
          tone: vertical.tone,
          outputSchema: {},
        },
        create: {
          vertical: vertical.name,
          channel,
          name,
          promptTemplate,
          tone: vertical.tone,
          outputSchema: {},
        },
      });

      console.log(`✓ [${vertical.name}] ${channel}: "${template.name}"`);
      count++;
    }
  }

  console.log(`\nDone! Seeded ${count} content templates (${verticals.length} verticals × ${channels.length} channels).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
