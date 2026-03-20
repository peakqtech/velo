import { describe, it, expect } from 'vitest'
import { AiAnswerAnalyzer } from '../src/intelligence/ai-answer-analyzer.js'

describe('AiAnswerAnalyzer', () => {
  const analyzer = new AiAnswerAnalyzer()

  it('identifies queries where client is absent but competitors present', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'best dentist jakarta', cited: false, competitors: [{ name: 'Rival A' }, { name: 'Rival B' }] },
      { engine: 'PERPLEXITY', query: 'best dentist jakarta', cited: false, competitors: [{ name: 'Rival A' }] },
      { engine: 'CHATGPT', query: 'dental implant cost', cited: true, competitors: [] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps).toHaveLength(1)
    expect(opps[0].keyword).toBe('best dentist jakarta')
    expect(opps[0].signal).toBe('AI_ANSWER')
  })

  it('scores higher when absent across more engines', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'query-a', cited: false, competitors: [{ name: 'X' }] },
      { engine: 'PERPLEXITY', query: 'query-a', cited: false, competitors: [{ name: 'X' }] },
      { engine: 'GEMINI', query: 'query-a', cited: false, competitors: [{ name: 'X' }] },
      { engine: 'CHATGPT', query: 'query-b', cited: false, competitors: [{ name: 'Y' }] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps[0].keyword).toBe('query-a')
    expect(opps[0].score).toBeGreaterThan(opps[1].score)
  })

  it('scores higher with more competitors', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'query-a', cited: false, competitors: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
      { engine: 'CHATGPT', query: 'query-b', cited: false, competitors: [{ name: 'X' }] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps[0].keyword).toBe('query-a')
  })

  it('excludes queries where client IS cited in all snapshots', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'we are cited', cited: true, competitors: [{ name: 'X' }] },
      { engine: 'PERPLEXITY', query: 'we are cited', cited: true, competitors: [] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps).toHaveLength(0)
  })

  it('includes queries with mixed citation (some cited, some not)', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'mixed query', cited: true, competitors: [] },
      { engine: 'PERPLEXITY', query: 'mixed query', cited: false, competitors: [{ name: 'X' }] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps).toHaveLength(1)
    expect(opps[0].metadata.citedCount).toBe(1) // 1 time NOT cited
  })

  it('generates appropriate title', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'best dentist jakarta', cited: false, competitors: [{ name: 'X' }] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps[0].title).toContain('best dentist jakarta')
  })

  it('returns empty for no snapshots', () => {
    expect(analyzer.analyze([])).toHaveLength(0)
  })

  it('deduplicates competitors across engines', () => {
    const snapshots = [
      { engine: 'CHATGPT', query: 'q1', cited: false, competitors: [{ name: 'Rival A' }, { name: 'Rival B' }] },
      { engine: 'PERPLEXITY', query: 'q1', cited: false, competitors: [{ name: 'Rival A' }, { name: 'Rival C' }] },
    ]
    const opps = analyzer.analyze(snapshots)
    expect(opps[0].metadata.competitorsFound).toHaveLength(3) // A, B, C (deduplicated)
  })
})
