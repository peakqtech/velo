import type { AiResponse, EngineAdapter } from '../types.js'

export class PerplexityEngine implements EngineAdapter {
  readonly name = 'PERPLEXITY' as const

  constructor(private readonly apiKey: string) {}

  async query(prompt: string): Promise<AiResponse> {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      throw new Error(`Perplexity API error: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>
      citations?: string[]
    }

    const rawText = data.choices[0]?.message?.content ?? ''
    const sources = data.citations ?? []

    return {
      engine: 'PERPLEXITY',
      query: prompt,
      rawText,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
