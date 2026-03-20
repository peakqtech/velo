import { describe, it, expect, vi } from 'vitest'
import { GeoResponseCache } from '../src/providers/response-cache.js'
import type { AiEngineName } from '../src/types.js'

const siteId = 'site-1'
const engine: AiEngineName = 'CHATGPT'
const query = 'best web agency sydney'

const mockSnapshot = {
  id: 'snap-1',
  siteId,
  engine,
  query,
  response: 'PeakQ is a leading agency',
  cited: true,
  citationType: 'NAMED',
  position: 1,
  competitors: ['Competitor A'],
  createdAt: new Date(),
}

describe('GeoResponseCache', () => {
  it('returns null when no cached response exists', async () => {
    const prisma = {
      geoSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any

    const cache = new GeoResponseCache(prisma)
    const result = await cache.get(query, engine, siteId)

    expect(result).toBeNull()
    expect(prisma.geoSnapshot.findFirst).toHaveBeenCalledWith({
      where: {
        siteId,
        engine,
        query,
        createdAt: {
          gte: expect.any(Date),
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('returns cached snapshot when query was made within 24h', async () => {
    const prisma = {
      geoSnapshot: {
        findFirst: vi.fn().mockResolvedValue(mockSnapshot),
      },
    } as any

    const cache = new GeoResponseCache(prisma)
    const result = await cache.get(query, engine, siteId)

    expect(result).toEqual(mockSnapshot)
  })

  it('returns null when cached response is older than 24h', async () => {
    const prisma = {
      geoSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any

    const cache = new GeoResponseCache(prisma)
    const result = await cache.get(query, engine, siteId)

    // The Prisma query filters by createdAt >= 24h ago,
    // so if the DB returns null, there's no valid cache
    expect(result).toBeNull()
  })

  it('matches on siteId + engine + query combination', async () => {
    const prisma = {
      geoSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any

    const cache = new GeoResponseCache(prisma)
    await cache.get('different query', 'PERPLEXITY', 'site-2')

    expect(prisma.geoSnapshot.findFirst).toHaveBeenCalledWith({
      where: {
        siteId: 'site-2',
        engine: 'PERPLEXITY',
        query: 'different query',
        createdAt: {
          gte: expect.any(Date),
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('uses 24h cutoff for cache window', async () => {
    const prisma = {
      geoSnapshot: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as any

    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    const cache = new GeoResponseCache(prisma)
    await cache.get(query, engine, siteId)

    const call = prisma.geoSnapshot.findFirst.mock.calls[0][0]
    const cutoff = call.where.createdAt.gte as Date
    const expectedCutoff = new Date(now - 24 * 60 * 60 * 1000)

    expect(cutoff.getTime()).toBe(expectedCutoff.getTime())

    vi.restoreAllMocks()
  })
})
