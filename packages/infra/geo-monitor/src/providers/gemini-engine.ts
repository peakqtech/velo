import type { AiResponse, EngineAdapter } from '../types.js'

interface GroundingChunk {
  web?: { uri?: string; title?: string }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
    groundingMetadata?: {
      groundingChunks?: GroundingChunk[]
    }
  }>
}

export class GeminiEngine implements EngineAdapter {
  readonly name = 'GEMINI' as const

  constructor(private readonly apiKey: string) {}

  async query(prompt: string): Promise<AiResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
      }),
    })

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as GeminiResponse
    const candidate = data.candidates?.[0]
    const rawText =
      candidate?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''

    const sources: string[] = (
      candidate?.groundingMetadata?.groundingChunks ?? []
    )
      .map((chunk) => chunk.web?.uri)
      .filter((uri): uri is string => typeof uri === 'string')

    return {
      engine: 'GEMINI',
      query: prompt,
      rawText,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
