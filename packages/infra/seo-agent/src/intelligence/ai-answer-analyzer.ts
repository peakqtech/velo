export interface AiAnswerOpportunity {
  signal: 'AI_ANSWER'
  keyword: string
  title: string
  channel: 'BLOG'
  score: number
  metadata: {
    engine: string
    competitorsFound: string[]
    queryCount: number
    citedCount: number
  }
}

export interface SnapshotInput {
  engine: string
  query: string
  cited: boolean
  competitors: Array<{ name: string }> | null
}

function generateTitle(keyword: string): string {
  if (keyword.toLowerCase().startsWith('best')) {
    return `${keyword}: Expert recommendations and reviews`
  }
  return `Why ${keyword} matters: A comprehensive guide`
}

export class AiAnswerAnalyzer {
  analyze(snapshots: SnapshotInput[]): AiAnswerOpportunity[] {
    if (snapshots.length === 0) return []

    // Group snapshots by query
    const grouped = new Map<string, SnapshotInput[]>()
    for (const snapshot of snapshots) {
      const group = grouped.get(snapshot.query) ?? []
      group.push(snapshot)
      grouped.set(snapshot.query, group)
    }

    const opportunities: AiAnswerOpportunity[] = []

    for (const [query, group] of grouped) {
      const uncited = group.filter((s) => !s.cited)

      // Only include queries where client was NOT cited at least once
      if (uncited.length === 0) continue

      const totalCount = group.length
      const uncitedCount = uncited.length
      const absenceRate = (uncitedCount / totalCount) * 60
      // Small frequency bonus (0–5) rewards consistent absence across multiple engines
      const frequencyBonus = Math.min(uncitedCount - 1, 5)

      // Deduplicate competitors across all snapshots
      const allCompetitors = new Set<string>()
      for (const snapshot of group) {
        for (const c of snapshot.competitors ?? []) {
          allCompetitors.add(c.name)
        }
      }

      const competitorBonus = Math.min(allCompetitors.size * 10, 40)
      const score = Math.round(absenceRate + competitorBonus + frequencyBonus)

      // Use the engine from the first uncited snapshot
      const engine = uncited[0].engine

      opportunities.push({
        signal: 'AI_ANSWER',
        keyword: query,
        title: generateTitle(query),
        channel: 'BLOG',
        score,
        metadata: {
          engine,
          competitorsFound: Array.from(allCompetitors),
          queryCount: totalCount,
          citedCount: uncitedCount,
        },
      })
    }

    return opportunities.sort((a, b) => b.score - a.score)
  }
}
