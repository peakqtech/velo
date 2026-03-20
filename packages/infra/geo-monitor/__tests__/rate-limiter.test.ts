import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeoRateLimiter } from '../src/providers/rate-limiter.js'
import type { AiEngineName } from '../src/types.js'

function createMockPrisma(snapshotCount: number = 0) {
  return {
    geoSnapshot: {
      count: vi.fn().mockResolvedValue(snapshotCount),
    },
  } as any
}

describe('GeoRateLimiter', () => {
  const siteId = 'site-1'
  const engine: AiEngineName = 'CHATGPT'

  describe('canQuery', () => {
    it('returns true when under budget', async () => {
      const prisma = createMockPrisma(3)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      const result = await limiter.canQuery(siteId, engine)

      expect(result).toBe(true)
      expect(prisma.geoSnapshot.count).toHaveBeenCalledWith({
        where: {
          siteId,
          engine,
          createdAt: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
      })
    })

    it('returns false when budget exhausted', async () => {
      const prisma = createMockPrisma(50)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      const result = await limiter.canQuery(siteId, engine)

      expect(result).toBe(false)
    })

    it('returns false when over budget', async () => {
      const prisma = createMockPrisma(55)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      const result = await limiter.canQuery(siteId, engine)

      expect(result).toBe(false)
    })

    it('correctly counts only this week snapshots (Monday-Sunday window)', async () => {
      const prisma = createMockPrisma(5)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      await limiter.canQuery(siteId, engine)

      const call = prisma.geoSnapshot.count.mock.calls[0][0]
      const gte = call.where.createdAt.gte as Date
      const lt = call.where.createdAt.lt as Date

      // gte should be a Monday (day 1)
      expect(gte.getUTCDay()).toBe(1)
      // lt should be the following Monday
      expect(lt.getUTCDay()).toBe(1)
      // lt should be 7 days after gte
      expect(lt.getTime() - gte.getTime()).toBe(7 * 24 * 60 * 60 * 1000)
    })
  })

  describe('getRemainingBudget', () => {
    it('returns correct remaining count', async () => {
      const prisma = createMockPrisma(17)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      const remaining = await limiter.getRemainingBudget(siteId, engine)

      expect(remaining).toBe(33)
    })

    it('returns 0 when over budget', async () => {
      const prisma = createMockPrisma(60)
      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })

      const remaining = await limiter.getRemainingBudget(siteId, engine)

      expect(remaining).toBe(0)
    })
  })

  describe('getUsageStats', () => {
    it('returns stats for all engines', async () => {
      const countResults: Record<string, number> = {
        CHATGPT: 10,
        PERPLEXITY: 20,
        GEMINI: 5,
        AI_OVERVIEW: 0,
      }

      const prisma = {
        geoSnapshot: {
          count: vi.fn().mockImplementation(({ where }: any) => {
            return Promise.resolve(countResults[where.engine] ?? 0)
          }),
        },
      } as any

      const limiter = new GeoRateLimiter(prisma, { weeklyBudget: 50 })
      const stats = await limiter.getUsageStats(siteId)

      expect(stats.CHATGPT).toEqual({ used: 10, remaining: 40 })
      expect(stats.PERPLEXITY).toEqual({ used: 20, remaining: 30 })
      expect(stats.GEMINI).toEqual({ used: 5, remaining: 45 })
      expect(stats.AI_OVERVIEW).toEqual({ used: 0, remaining: 50 })
    })
  })
})
