export interface ModelOptions {
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateResponse {
  text: string;
  tokenCount: number;
}

export interface ContentModel {
  name: string;
  generate(prompt: string, options?: ModelOptions): Promise<GenerateResponse>;
}
