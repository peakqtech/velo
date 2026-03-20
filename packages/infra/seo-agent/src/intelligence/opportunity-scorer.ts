export interface OpportunityScoreInput {
  searchVolume: number
  competitorUrgency: number
  aiCitationPotential: number
}

export class OpportunityScorer {
  score(input: OpportunityScoreInput): number {
    const { searchVolume, competitorUrgency, aiCitationPotential } = input
    const raw = searchVolume * 0.3 + competitorUrgency * 0.3 + aiCitationPotential * 0.4
    return Math.round(Math.min(100, Math.max(0, raw)))
  }
}
