import type { PrismaClient } from '@prisma/client'

export interface EscalationReport {
  staleSkipped: number
  overflowingSites: Array<{ siteId: string; pendingCount: number }>
  timestamp: Date
}

const STALE_DAYS = 7
const OVERFLOW_THRESHOLD = 10

export class EscalationManager {
  constructor(private readonly prisma: PrismaClient) {}

  async autoSkipStale(): Promise<{ skipped: number; ids: string[] }> {
    const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000)

    const staleOpps = await this.prisma.contentOpportunity.findMany({
      where: {
        approvalStatus: 'PENDING',
        createdAt: { lt: cutoff },
      },
      select: { id: true },
    })

    const ids = staleOpps.map((o: { id: string }) => o.id)

    if (ids.length > 0) {
      await this.prisma.contentOpportunity.updateMany({
        where: { id: { in: ids } },
        data: {
          approvalStatus: 'AUTO_SKIPPED',
          status: 'SKIPPED',
          approvalNote: 'Auto-skipped: unactioned for 7 days',
        },
      })
    }

    return { skipped: ids.length, ids }
  }

  async getOverflowingSites(): Promise<Array<{ siteId: string; pendingCount: number }>> {
    const groups = await this.prisma.contentOpportunity.groupBy({
      by: ['siteId'],
      where: { approvalStatus: 'PENDING' },
      _count: { id: true },
      having: {
        id: { _count: { gt: OVERFLOW_THRESHOLD } },
      },
    })

    return groups.map((g: { siteId: string; _count: { id: number } }) => ({
      siteId: g.siteId,
      pendingCount: g._count.id,
    }))
  }

  async runEscalation(): Promise<EscalationReport> {
    const { skipped: staleSkipped } = await this.autoSkipStale()
    const overflowingSites = await this.getOverflowingSites()

    return {
      staleSkipped,
      overflowingSites,
      timestamp: new Date(),
    }
  }
}
