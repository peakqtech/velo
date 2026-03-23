import type { AiResponse, EngineAdapter } from '../types'

interface SerpApiResponse {
  ai_overview?: {
    text_blocks?: Array<{ snippet?: string; type?: string }>
    references?: Array<{ link?: string }>
  }
  organic_results?: Array<{ link?: string }>
}

export class AiOverviewEngine implements EngineAdapter {
  readonly name = 'AI_OVERVIEW' as const

  constructor(private readonly apiKey: string) {}

  async query(prompt: string): Promise<AiResponse> {
    const params = new URLSearchParams({
      q: prompt,
      api_key: this.apiKey,
      engine: 'google',
    })

    const res = await fetch(`https://serpapi.com/search?${params.toString()}`)

    if (!res.ok) {
      throw new Error(`SerpAPI error: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as SerpApiResponse

    const aiOverview = data.ai_overview
    const rawText = (aiOverview?.text_blocks ?? [])
      .map((block) => block.snippet ?? '')
      .filter(Boolean)
      .join('\n')

    const sources: string[] = (aiOverview?.references ?? [])
      .map((ref) => ref.link)
      .filter((link): link is string => typeof link === 'string')

    return {
      engine: 'AI_OVERVIEW',
      query: prompt,
      rawText,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}
