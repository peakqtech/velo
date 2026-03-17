import type { ContentModel } from "../ai/model";
import type { KeywordSuggestion } from "../types/keyword";
import type { KeywordSourceProvider } from "./source";

export class VerticalKeywordProvider implements KeywordSourceProvider {
  readonly provider = "VERTICAL";

  constructor(private readonly model: ContentModel) {}

  async getKeywords(
    vertical: string,
    location: string,
    channels: string[]
  ): Promise<KeywordSuggestion[]> {
    const channelList = channels.join(", ");

    const prompt = `You are an SEO specialist. Generate 15-20 keyword suggestions for a business in the "${vertical}" vertical located in "${location}".

The keywords should be relevant to the following marketing channels: ${channelList}.

For each keyword, classify:
- intent: one of INFORMATIONAL, NAVIGATIONAL, COMMERCIAL, TRANSACTIONAL
- channel: one of BLOG, GBP, SOCIAL, EMAIL, LANDING_PAGE (choose the most appropriate for the keyword)
- volume (optional): estimated monthly search volume as a number
- difficulty (optional): keyword difficulty score 0-100

Respond ONLY with a valid JSON array. Example format:
[
  {
    "keyword": "example keyword",
    "intent": "INFORMATIONAL",
    "channel": "BLOG",
    "volume": 1200,
    "difficulty": 35
  }
]

Generate keywords now for vertical="${vertical}", location="${location}", channels=[${channelList}]:`;

    const response = await this.model.generate(prompt, { maxTokens: 2048, temperature: 0.3 });

    const raw = response.text.trim();

    // Strip ```json ... ``` code fences if present
    const jsonText = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error(
        `VerticalKeywordProvider: AI returned invalid JSON. Raw response: ${raw.slice(0, 200)}`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error(
        `VerticalKeywordProvider: Expected a JSON array but got ${typeof parsed}`
      );
    }

    return parsed as KeywordSuggestion[];
  }
}
