import type { PrismaClient } from '@velo/db'
import type { AiEngineName } from '../types.js'

const ALL_ENGINES: AiEngineName[] = ['CHATGPT', 'PERPLEXITY', 'GEMINI', 'AI_OVERVIEW']

export interface RateLimiterConfig {
  weeklyBudget: number
}

export class GeoRateLimiter {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly config: RateLimiterConfig,
  ) {}

  async canQuery(siteId: string, engine: AiEngineName): Promise<boolean> {
    const used = await this.countThisWeek(siteId, engine)
    return used < this.config.weeklyBudget
  }

  async getRemainingBudget(siteId: string, engine: AiEngineName): Promise<number> {
    const used = await this.countThisWeek(siteId, engine)
    return Math.max(0, this.config.weeklyBudget - used)
  }

  async getUsageStats(
    siteId: string,
  ): Promise<Record<AiEngineName, { used: number; remaining: number }>> {
    const entries = await Promise.all(
      ALL_ENGINES.map(async (engine) => {
        const used = await this.countThisWeek(siteId, engine)
        return [engine, { used, remaining: Math.max(0, this.config.weeklyBudget - used) }] as const
      }),
    )
    return Object.fromEntries(entries) as Record<AiEngineName, { used: number; remaining: number }>
  }

  private async countThisWeek(siteId: string, engine: AiEngineName): Promise<number> {
    const { gte, lt } = this.getWeekBounds()
    return this.prisma.geoSnapshot.count({
      where: {
        siteId,
        engine,
        createdAt: { gte, lt },
      },
    })
  }

  private getWeekBounds(): { gte: Date; lt: Date } {
    const now = new Date()
    const day = now.getUTCDay()
    // Monday = 1, Sunday = 0 → offset to get back to Monday
    const daysSinceMonday = day === 0 ? 6 : day - 1

    const monday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday),
    )
    const nextMonday = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000)

    return { gte: monday, lt: nextMonday }
  }
}
