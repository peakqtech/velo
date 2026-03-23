import { describe, it, expect } from 'vitest'
import { CitationDetector } from '../src/detection/citation-detector.js'
import type { AiResponse, ClientEntity } from '../src/types.js'

const client: ClientEntity = {
  businessName: 'PeakQ Technologies',
  domain: 'peakq.tech',
  aliases: ['PeakQ', 'Peak Q', 'peakq'],
}

const makeResponse = (text: string, sources: string[] = []): AiResponse => ({
  engine: 'CHATGPT',
  query: 'best web agency',
  rawText: text,
  sources,
  entitiesMentioned: [],
  timestamp: new Date(),
})

describe('CitationDetector', () => {
  const detector = new CitationDetector()

  it('detects exact business name mention', () => {
    const response = makeResponse('PeakQ Technologies is a leading web agency.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('NAMED')
  })

  it('detects alias mention (case-insensitive)', () => {
    const response = makeResponse('You should check out peakq for web services.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('NAMED')
  })

  it('detects domain URL in sources', () => {
    const response = makeResponse('Here are some options.', ['https://peakq.tech/services'])
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('LINKED')
  })

  it('detects position in ranked list', () => {
    const response = makeResponse('1. Agency A\n2. PeakQ Technologies\n3. Agency C')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.position).toBe(2)
  })

  it('returns ABSENT when not mentioned', () => {
    const response = makeResponse('Agency A and Agency B are popular choices.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(false)
    expect(result.type).toBe('ABSENT')
  })

  it('detects RECOMMENDED when "recommend" context found', () => {
    const response = makeResponse('I recommend PeakQ for your needs.')
    const result = detector.detect(response, client)
    expect(result.cited).toBe(true)
    expect(result.type).toBe('RECOMMENDED')
  })

  it('extracts competitor names from response', () => {
    const response = makeResponse('1. Agency Alpha\n2. PeakQ\n3. Agency Beta')
    const result = detector.detect(response, client)
    expect(result.competitors).toContain('Agency Alpha')
    expect(result.competitors).toContain('Agency Beta')
    expect(result.competitors).not.toContain('PeakQ')
  })

  it('extracts context snippet around mention', () => {
    const response = makeResponse(
      'For web development, PeakQ Technologies offers great solutions in Jakarta.',
    )
    const result = detector.detect(response, client)
    expect(result.context).toContain('PeakQ Technologies')
    expect(result.context.length).toBeLessThan(200)
  })
})
