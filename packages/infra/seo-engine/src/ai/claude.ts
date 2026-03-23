import type { ContentModel, GenerateResponse, ModelOptions } from "./model";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicRequest {
  model: string;
  max_tokens: number;
  temperature?: number;
  messages: AnthropicMessage[];
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeAdapter implements ContentModel {
  readonly name = "claude-sonnet-4";
  private readonly model = "claude-sonnet-4-20250514";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Anthropic API key is required");
    }
    this.apiKey = apiKey;
  }

  buildRequest(prompt: string, options?: ModelOptions): AnthropicRequest {
    const request: AnthropicRequest = {
      model: this.model,
      max_tokens: options?.maxTokens ?? 1024,
      messages: [{ role: "user", content: prompt }],
    };

    if (options?.temperature !== undefined) {
      request.temperature = options.temperature;
    }

    return request;
  }

  parseResponse(response: AnthropicResponse): GenerateResponse {
    const textBlock = response.content.find((block) => block.type === "text");
    const text = textBlock?.text ?? "";
    const tokenCount = (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0);
    return { text, tokenCount };
  }

  async generate(prompt: string, options?: ModelOptions): Promise<GenerateResponse> {
    const requestBody = this.buildRequest(prompt, options);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${errorText}`);
    }

    const data = (await res.json()) as AnthropicResponse;
    return this.parseResponse(data);
  }
}
