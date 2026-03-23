import { describe, it, expect } from 'vitest'
import { CadenceSchema } from '../src/types/agent'

describe('CadenceSchema', () => {
  it('validates a valid cadence config', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: 2, period: 'week' },
      gbp: { max: 3, period: 'week' },
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid channel key', () => {
    const result = CadenceSchema.safeParse({
      invalid: { max: 2, period: 'week' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative max', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: -1, period: 'week' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid period', () => {
    const result = CadenceSchema.safeParse({
      blog: { max: 2, period: 'daily' },
    })
    expect(result.success).toBe(false)
  })

  it('allows empty cadence (no channels configured)', () => {
    const result = CadenceSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
