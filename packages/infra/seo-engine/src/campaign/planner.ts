import type { ContentModel } from "../ai/model";
import type { ContentPlan, ContentPiece } from "../types/campaign";

export interface PlanInput {
  campaignName: string;
  goal: string;
  channels: string[];
  keywords: string[];
  frequency: string;
  startDate: string;
  endDate: string;
  vertical: string;
  businessName: string;
  location: string;
}

export class CampaignPlanner {
  constructor(private readonly model: ContentModel) {}

  async generatePlan(input: PlanInput): Promise<ContentPlan> {
    const prompt = this.buildPrompt(input);
    const response = await this.model.generate(prompt);

    const raw = this.stripCodeFences(response.text);
    const parsed = JSON.parse(raw) as { pieces: unknown[] };

    if (!parsed.pieces || !Array.isArray(parsed.pieces)) {
      throw new Error("AI response missing 'pieces' array");
    }

    const pieces: ContentPiece[] = parsed.pieces.map((p: unknown) => {
      const piece = p as Record<string, unknown>;
      return {
        title: String(piece.title ?? ""),
        channel: String(piece.channel ?? ""),
        targetKeyword: String(piece.targetKeyword ?? piece.keyword ?? ""),
        scheduledFor: new Date(String(piece.scheduledFor ?? piece.date ?? "")),
        outline: String(piece.outline ?? ""),
      };
    });

    return { pieces };
  }

  private buildPrompt(input: PlanInput): string {
    return `You are a content strategist. Create a content calendar as JSON.

Campaign: ${input.campaignName}
Goal: ${input.goal}
Business: ${input.businessName} — ${input.vertical} in ${input.location}
Channels: ${input.channels.join(", ")}
Keywords: ${input.keywords.join(", ")}
Frequency: ${input.frequency}
Period: ${input.startDate} to ${input.endDate}

Return ONLY a JSON object with this structure:
{
  "pieces": [
    {
      "title": "string",
      "channel": "BLOG|GBP|SOCIAL|EMAIL",
      "targetKeyword": "string",
      "scheduledFor": "ISO date string",
      "outline": "string"
    }
  ]
}

Generate one piece per scheduled date. Distribute across the channels and keywords provided.`;
  }

  private stripCodeFences(text: string): string {
    return text
      .replace(/^```[a-z]*\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
  }
}
