import { describe, it, expect } from 'vitest'
import { Deduplicator } from '../src/intelligence/deduplicator.js'

describe('Deduplicator', () => {
  const dedup = new Deduplicator(0.7)

  it('removes near-duplicate keywords', () => {
    const items = [
      { keyword: 'best dentist in jakarta', score: 80 },
      { keyword: 'best dentists in jakarta', score: 75 },
      { keyword: 'affordable web design', score: 60 },
    ]
    const result = dedup.deduplicate(items)
    expect(result).toHaveLength(2)
    expect(result[0].keyword).toBe('best dentist in jakarta')
  })

  it('keeps dissimilar keywords', () => {
    const items = [
      { keyword: 'dental implants cost', score: 70 },
      { keyword: 'web design agency', score: 65 },
    ]
    expect(dedup.deduplicate(items)).toHaveLength(2)
  })

  it('handles empty input', () => { expect(dedup.deduplicate([])).toHaveLength(0) })
  it('handles single item', () => { expect(dedup.deduplicate([{ keyword: 'test', score: 50 }])).toHaveLength(1) })
})
