import type { ContentModel } from "../ai/model";
import type { ChannelFormatter, PromptContext } from "./channel";

export interface GenerateOptions {
  formatter: ChannelFormatter;
  context: PromptContext;
  maxRetries?: number;
}

export interface GenerateResult {
  valid: boolean;
  content?: unknown;
  modelUsed: string;
  tokenCount?: number;
  errors?: string[];
}

export class ContentGenerator {
  constructor(private readonly model: ContentModel) {}

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const { formatter, context, maxRetries = 2 } = options;

    let prompt = formatter.formatPrompt(context);
    let lastErrors: string[] | undefined;
    let lastTokenCount: number | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await this.model.generate(prompt);
      lastTokenCount = response.tokenCount;

      const validation = formatter.validateOutput(response.text);

      if (validation.valid) {
        return {
          valid: true,
          content: validation.parsed,
          modelUsed: this.model.name,
          tokenCount: response.tokenCount,
        };
      }

      lastErrors = validation.errors;

      if (attempt < maxRetries) {
        // Build a retry prompt that includes the previous errors
        const errorFeedback = (validation.errors ?? ["Invalid output"]).join("; ");
        prompt = `${formatter.formatPrompt(context)}\n\nPrevious attempt failed validation:\n${errorFeedback}\n\nPlease fix the issues and try again.`;
      }
    }

    return {
      valid: false,
      modelUsed: this.model.name,
      tokenCount: lastTokenCount,
      errors: lastErrors,
    };
  }
}
