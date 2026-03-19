import type { AiEngineName, VisibilityReport } from '../types.js'

interface SnapshotInput {
  engine: AiEngineName
  query: string
  cited: boolean
  position: number | null
}

export class VisibilityScorer {
  calculate(
    siteId: string,
    engine: AiEngineName,
    period: Date,
    snapshots: SnapshotInput[],
  ): VisibilityReport {
    const totalQueries = snapshots.length
    const citedSnapshots = snapshots.filter((s) => s.cited)
    const citedQueries = citedSnapshots.length

    const visibility = totalQueries === 0 ? 0 : (citedQueries / totalQueries) * 100

    const positions = citedSnapshots
      .map((s) => s.position)
      .filter((p): p is number => p !== null)

    const avgPosition =
      positions.length > 0
        ? positions.reduce((sum, p) => sum + p, 0) / positions.length
        : null

    // Sort: cited first (by position asc, nulls last), then uncited
    const topQueries = [...snapshots].sort((a, b) => {
      if (a.cited && !b.cited) return -1
      if (!a.cited && b.cited) return 1
      if (a.cited && b.cited) {
        if (a.position === null && b.position === null) return 0
        if (a.position === null) return 1
        if (b.position === null) return -1
        return a.position - b.position
      }
      return 0
    }).map((s) => ({ query: s.query, cited: s.cited, position: s.position }))

    return {
      siteId,
      engine,
      period,
      visibility,
      avgPosition,
      totalQueries,
      citedQueries,
      topQueries,
    }
  }
}
