import { describe, it, expect } from 'vitest'
import { OpportunityScorer } from '../src/intelligence/opportunity-scorer.js'

describe('OpportunityScorer', () => {
  const scorer = new OpportunityScorer()

  it('applies GEO-weighted formula (0.3, 0.3, 0.4)', () => {
    const score = scorer.score({ searchVolume: 100, competitorUrgency: 50, aiCitationPotential: 80 })
    expect(score).toBe(77) // (100*0.3)+(50*0.3)+(80*0.4)
  })

  it('clamps score to 0-100 range', () => {
    const score = scorer.score({ searchVolume: 100, competitorUrgency: 100, aiCitationPotential: 100 })
    expect(score).toBe(100)
  })

  it('returns 0 for all-zero inputs', () => {
    const score = scorer.score({ searchVolume: 0, competitorUrgency: 0, aiCitationPotential: 0 })
    expect(score).toBe(0)
  })
})
