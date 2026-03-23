import { describe, it, expect } from 'vitest'
import { QueryExpander } from '../src/detection/query-expander.js'

describe('QueryExpander', () => {
  const expander = new QueryExpander()

  it('generates location variants', () => {
    const variants = expander.expand(['best dentist'], { location: 'Jakarta' })
    expect(variants).toContain('best dentist')
    expect(variants).toContain('best dentist in Jakarta')
    expect(variants).toContain('best dentist near Jakarta')
  })

  it('generates comparison variants', () => {
    const variants = expander.expand(['peakq web agency'], { competitors: ['Agency X'] })
    expect(variants.some((v) => v.includes('vs'))).toBe(true)
  })

  it('generates question variants', () => {
    const variants = expander.expand(['affordable web design'], {})
    expect(variants.some((v) => v.startsWith('what') || v.startsWith('who'))).toBe(true)
  })

  it('deduplicates results', () => {
    const variants = expander.expand(['best dentist', 'best dentist'], {})
    const unique = new Set(variants)
    expect(variants.length).toBe(unique.size)
  })

  it('respects maxVariants limit', () => {
    const variants = expander.expand(['best dentist', 'top dentist', 'affordable dentist'], { location: 'Jakarta', maxVariants: 10 })
    expect(variants.length).toBeLessThanOrEqual(10)
  })
})
