import { describe, it, expect } from 'vitest'
import { CadenceLimiter } from '../src/planning/cadence-limiter'

describe('CadenceLimiter', () => {
  it('limits opportunities per channel within cadence', () => {
    const limiter = new CadenceLimiter({ blog: { max: 2, period: 'week' }, gbp: { max: 3, period: 'week' } })
    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'BLOG' as const, score: 80, keyword: 'kw2' },
      { channel: 'BLOG' as const, score: 70, keyword: 'kw3' },
      { channel: 'GBP' as const, score: 60, keyword: 'kw4' },
    ]
    const result = limiter.apply(opportunities, { alreadyPublishedThisPeriod: {} })
    const blogs = result.filter((o) => o.channel === 'BLOG')
    expect(blogs).toHaveLength(2)
    expect(blogs[0].score).toBe(90)
    expect(blogs[1].score).toBe(80)
  })

  it('accounts for already-published content this period', () => {
    const limiter = new CadenceLimiter({ blog: { max: 2, period: 'week' } })
    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'BLOG' as const, score: 80, keyword: 'kw2' },
    ]
    const result = limiter.apply(opportunities, { alreadyPublishedThisPeriod: { BLOG: 1 } })
    expect(result).toHaveLength(1)
  })

  it('filters out channels not in cadence config', () => {
    const limiter = new CadenceLimiter({ blog: { max: 2, period: 'week' } })
    const opportunities = [
      { channel: 'BLOG' as const, score: 90, keyword: 'kw1' },
      { channel: 'SOCIAL' as const, score: 80, keyword: 'kw2' },
    ]
    const result = limiter.apply(opportunities, { alreadyPublishedThisPeriod: {} })
    expect(result).toHaveLength(1)
    expect(result[0].channel).toBe('BLOG')
  })
})
