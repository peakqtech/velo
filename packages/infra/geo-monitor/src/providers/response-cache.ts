import type { PrismaClient, GeoSnapshot } from '@velo/db'
import type { AiEngineName } from '../types.js'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export class GeoResponseCache {
  constructor(private readonly prisma: PrismaClient) {}

  async get(query: string, engine: AiEngineName, siteId: string): Promise<GeoSnapshot | null> {
    const cutoff = new Date(Date.now() - CACHE_TTL_MS)

    return this.prisma.geoSnapshot.findFirst({
      where: {
        siteId,
        engine,
        query,
        createdAt: { gte: cutoff },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
