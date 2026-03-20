import { describe, it, expect, vi } from 'vitest'
import { InternalGeoProvider } from '../src/providers/internal-provider.js'
import type { EngineAdapter, AiResponse, ClientEntity } from '../src/types.js'

const mockEngine: EngineAdapter = {
  name: 'CHATGPT',
  query: vi.fn().mockResolvedValue({
    engine: 'CHATGPT', query: 'best web agency',
    rawText: 'PeakQ Technologies is a top choice.',
    sources: [], entitiesMentioned: [], timestamp: new Date(),
  } satisfies AiResponse),
}

const client: ClientEntity = {
  businessName: 'PeakQ Technologies', domain: 'peakq.tech', aliases: ['PeakQ'],
}

describe('InternalGeoProvider', () => {
  it('queries engine and detects citation', async () => {
    const provider = new InternalGeoProvider([mockEngine])
    const response = await provider.query('best web agency', 'CHATGPT')
    expect(response.rawText).toContain('PeakQ')
    const citation = provider.detectCitation(response, client)
    expect(citation.cited).toBe(true)
  })

  it('throws when engine not registered', async () => {
    const provider = new InternalGeoProvider([mockEngine])
    await expect(provider.query('test', 'PERPLEXITY')).rejects.toThrow('No adapter registered')
  })

  it('supports multiple engines', async () => {
    const mockPerplexity: EngineAdapter = {
      name: 'PERPLEXITY',
      query: vi.fn().mockResolvedValue({
        engine: 'PERPLEXITY', query: 'test', rawText: 'Result',
        sources: ['https://peakq.tech'], entitiesMentioned: [], timestamp: new Date(),
      }),
    }
    const provider = new InternalGeoProvider([mockEngine, mockPerplexity])
    const response = await provider.query('test', 'PERPLEXITY')
    expect(response.engine).toBe('PERPLEXITY')
  })
})
