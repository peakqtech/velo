import { describe, it, expect } from 'vitest'
import { VisibilityScorer } from '../src/scoring/visibility-scorer.js'
import type { AiEngineName } from '../src/types.js'

interface SnapshotInput {
  engine: AiEngineName
  query: string
  cited: boolean
  position: number | null
}

describe('VisibilityScorer', () => {
  const scorer = new VisibilityScorer()

  it('calculates visibility as percentage of cited queries', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'CHATGPT', query: 'best agency', cited: true, position: 1 },
      { engine: 'CHATGPT', query: 'top agency', cited: false, position: null },
      { engine: 'CHATGPT', query: 'web design', cited: true, position: 3 },
      { engine: 'CHATGPT', query: 'dev agency', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), snapshots)
    expect(report.visibility).toBe(50)
    expect(report.totalQueries).toBe(4)
    expect(report.citedQueries).toBe(2)
  })

  it('calculates average position from cited queries only', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'PERPLEXITY', query: 'q1', cited: true, position: 2 },
      { engine: 'PERPLEXITY', query: 'q2', cited: true, position: 4 },
      { engine: 'PERPLEXITY', query: 'q3', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'PERPLEXITY', new Date(), snapshots)
    expect(report.avgPosition).toBe(3)
  })

  it('returns null avgPosition when no positions available', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'GEMINI', query: 'q1', cited: true, position: null },
    ]
    const report = scorer.calculate('site-1', 'GEMINI', new Date(), snapshots)
    expect(report.avgPosition).toBeNull()
  })

  it('returns 0 visibility when no snapshots', () => {
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), [])
    expect(report.visibility).toBe(0)
    expect(report.totalQueries).toBe(0)
  })

  it('ranks top queries by citation status and position', () => {
    const snapshots: SnapshotInput[] = [
      { engine: 'CHATGPT', query: 'q1', cited: true, position: 1 },
      { engine: 'CHATGPT', query: 'q2', cited: true, position: 5 },
      { engine: 'CHATGPT', query: 'q3', cited: false, position: null },
    ]
    const report = scorer.calculate('site-1', 'CHATGPT', new Date(), snapshots)
    expect(report.topQueries[0].query).toBe('q1')
    expect(report.topQueries[0].cited).toBe(true)
  })
})
