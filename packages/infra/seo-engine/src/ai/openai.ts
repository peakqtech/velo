import type { ContentModel, GenerateResponse, ModelOptions } from "./model";

interface OpenAIRequest {
  model: string;
  max_tokens?: number;
  temperature?: number;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}

interface OpenAIResponse {
  choices: Array<{
    message: { role: string; content: string };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIAdapter implements ContentModel {
  readonly name = "gpt-4o";
  private readonly model = "gpt-4o";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.apiKey = apiKey;
  }

  buildRequest(prompt: string, options?: ModelOptions): OpenAIRequest {
    const request: OpenAIRequest = {
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    };

    if (options?.maxTokens !== undefined) {
      request.max_tokens = options.maxTokens;
    }
    if (options?.temperature !== undefined) {
      request.temperature = options.temperature;
    }

    return request;
  }

  parseResponse(response: OpenAIResponse): GenerateResponse {
    const text = response.choices?.[0]?.message?.content ?? "";
    const tokenCount = response.usage?.total_tokens ?? 0;
    return { text, tokenCount };
  }

  async generate(prompt: string, options?: ModelOptions): Promise<GenerateResponse> {
    const requestBody = this.buildRequest(prompt, options);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${errorText}`);
    }

    const data = (await res.json()) as OpenAIResponse;
    return this.parseResponse(data);
  }
}
