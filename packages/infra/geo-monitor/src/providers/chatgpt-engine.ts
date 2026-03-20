import type { AiResponse, EngineAdapter } from '../types.js'

export class ChatGPTEngine implements EngineAdapter {
  readonly name = 'CHATGPT' as const

  constructor(private readonly apiKey: string) {}

  async query(prompt: string): Promise<AiResponse> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      throw new Error(`ChatGPT API error: ${res.status} ${res.statusText}`)
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>
    }

    const rawText = data.choices[0]?.message?.content ?? ''
    const sources = extractUrls(rawText)

    return {
      engine: 'CHATGPT',
      query: prompt,
      rawText,
      sources,
      entitiesMentioned: [],
      timestamp: new Date(),
    }
  }
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/g
  return [...new Set(text.match(urlRegex) ?? [])]
}
