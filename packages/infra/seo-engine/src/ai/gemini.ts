import type { ContentModel, GenerateResponse, ModelOptions } from "./model";

interface GeminiRequest {
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiAdapter implements ContentModel {
  readonly name = "gemini-2.5-pro";
  private readonly model = "gemini-2.5-pro-preview-06-05";
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Google AI API key is required");
    }
    this.apiKey = apiKey;
  }

  buildRequest(prompt: string, options?: ModelOptions): GeminiRequest {
    const request: GeminiRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const genConfig: GeminiRequest["generationConfig"] = {};
    if (options?.maxTokens !== undefined) {
      genConfig.maxOutputTokens = options.maxTokens;
    }
    if (options?.temperature !== undefined) {
      genConfig.temperature = options.temperature;
    }
    if (Object.keys(genConfig).length > 0) {
      request.generationConfig = genConfig;
    }

    return request;
  }

  parseResponse(response: GeminiResponse): GenerateResponse {
    const text =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") ?? "";
    const tokenCount = response.usageMetadata?.totalTokenCount ?? 0;
    return { text, tokenCount };
  }

  async generate(prompt: string, options?: ModelOptions): Promise<GenerateResponse> {
    const requestBody = this.buildRequest(prompt, options);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errorText}`);
    }

    const data = (await res.json()) as GeminiResponse;
    return this.parseResponse(data);
  }
}
