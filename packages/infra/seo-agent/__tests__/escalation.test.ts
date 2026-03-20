import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EscalationManager } from '../src/gates/escalation.js'

function createMockPrisma() {
  return {
    contentOpportunity: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
      groupBy: vi.fn(),
    },
  } as any
}

describe('EscalationManager', () => {
  let prisma: ReturnType<typeof createMockPrisma>
  let manager: EscalationManager

  beforeEach(() => {
    prisma = createMockPrisma()
    manager = new EscalationManager(prisma)
  })

  describe('autoSkipStale', () => {
    it('skips opportunities older than 7 days with PENDING status', async () => {
      const staleOpps = [
        { id: 'opp-1', createdAt: new Date('2026-03-01') },
        { id: 'opp-2', createdAt: new Date('2026-03-02') },
      ]
      prisma.contentOpportunity.findMany.mockResolvedValue(staleOpps)
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 2 })

      const result = await manager.autoSkipStale()

      expect(result.skipped).toBe(2)
      expect(result.ids).toEqual(['opp-1', 'opp-2'])
    })

    it('does NOT skip opportunities newer than 7 days', async () => {
      prisma.contentOpportunity.findMany.mockResolvedValue([])
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 0 })

      const result = await manager.autoSkipStale()

      expect(result.skipped).toBe(0)
      expect(result.ids).toEqual([])

      // Verify the query filters by date
      const findCall = prisma.contentOpportunity.findMany.mock.calls[0][0]
      expect(findCall.where.approvalStatus).toBe('PENDING')
      expect(findCall.where.createdAt.lt).toBeInstanceOf(Date)
    })

    it('does NOT skip already APPROVED/REJECTED opportunities', async () => {
      prisma.contentOpportunity.findMany.mockResolvedValue([])
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 0 })

      await manager.autoSkipStale()

      const findCall = prisma.contentOpportunity.findMany.mock.calls[0][0]
      expect(findCall.where.approvalStatus).toBe('PENDING')
    })

    it('returns correct count and IDs', async () => {
      const staleOpps = [
        { id: 'opp-a' },
        { id: 'opp-b' },
        { id: 'opp-c' },
      ]
      prisma.contentOpportunity.findMany.mockResolvedValue(staleOpps)
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 3 })

      const result = await manager.autoSkipStale()

      expect(result.skipped).toBe(3)
      expect(result.ids).toEqual(['opp-a', 'opp-b', 'opp-c'])
    })

    it('sets correct approvalNote on update', async () => {
      prisma.contentOpportunity.findMany.mockResolvedValue([{ id: 'opp-1' }])
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 1 })

      await manager.autoSkipStale()

      const updateCall = prisma.contentOpportunity.updateMany.mock.calls[0][0]
      expect(updateCall.data.approvalStatus).toBe('AUTO_SKIPPED')
      expect(updateCall.data.status).toBe('SKIPPED')
      expect(updateCall.data.approvalNote).toBe('Auto-skipped: unactioned for 7 days')
    })
  })

  describe('getOverflowingSites', () => {
    it('returns sites with >10 pending approvals', async () => {
      prisma.contentOpportunity.groupBy.mockResolvedValue([
        { siteId: 'site-1', _count: { id: 15 } },
        { siteId: 'site-2', _count: { id: 12 } },
      ])

      const result = await manager.getOverflowingSites()

      expect(result).toEqual([
        { siteId: 'site-1', pendingCount: 15 },
        { siteId: 'site-2', pendingCount: 12 },
      ])
    })

    it('does NOT return sites with <=10 pending', async () => {
      prisma.contentOpportunity.groupBy.mockResolvedValue([])

      const result = await manager.getOverflowingSites()

      expect(result).toEqual([])

      const groupByCall = prisma.contentOpportunity.groupBy.mock.calls[0][0]
      expect(groupByCall.where.approvalStatus).toBe('PENDING')
      expect(groupByCall.having.id._count.gt).toBe(10)
    })

    it('returns correct pendingCount', async () => {
      prisma.contentOpportunity.groupBy.mockResolvedValue([
        { siteId: 'site-x', _count: { id: 25 } },
      ])

      const result = await manager.getOverflowingSites()

      expect(result[0].pendingCount).toBe(25)
    })
  })

  describe('runEscalation', () => {
    it('combines both results into EscalationReport', async () => {
      prisma.contentOpportunity.findMany.mockResolvedValue([{ id: 'opp-1' }])
      prisma.contentOpportunity.updateMany.mockResolvedValue({ count: 1 })
      prisma.contentOpportunity.groupBy.mockResolvedValue([
        { siteId: 'site-1', _count: { id: 11 } },
      ])

      const report = await manager.runEscalation()

      expect(report.staleSkipped).toBe(1)
      expect(report.overflowingSites).toEqual([{ siteId: 'site-1', pendingCount: 11 }])
      expect(report.timestamp).toBeInstanceOf(Date)
    })
  })
})
