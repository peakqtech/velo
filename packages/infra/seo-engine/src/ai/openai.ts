import type { ContentModel, GenerateResponse, ModelOptions } from "./model";

export class OpenAIAdapter implements ContentModel {
  readonly name = "gpt-4o";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generate(_prompt: string, _options?: ModelOptions): Promise<GenerateResponse> {
    throw new Error("not implemented");
  }
}
