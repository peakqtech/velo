import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AgentLoop } from '../src/loop/agent-loop'

const mockLockManager = {
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
  updateStep: vi.fn(),
}

const mockPrisma = {
  agentConfig: { findUnique: vi.fn() },
  contentOpportunity: { createMany: vi.fn(), findMany: vi.fn(), updateMany: vi.fn() },
  geoSnapshot: { createMany: vi.fn() },
  geoScore: { upsert: vi.fn() },
}

describe('AgentLoop', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('skips run when lock cannot be acquired', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: false, reason: 'busy' })
    const loop = new AgentLoop({ prisma: mockPrisma as any, lockManager: mockLockManager as any, siteId: 'site-1', configId: 'config-1' })
    const result = await loop.run()
    expect(result.success).toBe(false)
    expect(result.reason).toBe('busy')
  })

  it('acquires lock, runs steps, releases lock on success', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: true, runId: 'run-1' })
    mockPrisma.agentConfig.findUnique.mockResolvedValue({
      id: 'config-1', siteId: 'site-1', tier: 'GROWTH', oversightMode: 'AUTO_PUBLISH',
      channels: ['BLOG', 'GBP'], cadence: { blog: { max: 2, period: 'week' } },
      competitors: [], verticalKeywords: ['web design'], geoEnabled: false, geoQueryPrompts: [],
    })
    mockPrisma.contentOpportunity.findMany.mockResolvedValue([])
    const loop = new AgentLoop({ prisma: mockPrisma as any, lockManager: mockLockManager as any, siteId: 'site-1', configId: 'config-1' })
    const result = await loop.run()
    expect(mockLockManager.acquireLock).toHaveBeenCalledWith('site-1', 'config-1')
    expect(mockLockManager.releaseLock).toHaveBeenCalledWith('run-1', 'COMPLETED', undefined)
    expect(result.success).toBe(true)
  })

  it('releases lock with FAILED on error', async () => {
    mockLockManager.acquireLock.mockResolvedValue({ acquired: true, runId: 'run-1' })
    mockPrisma.agentConfig.findUnique.mockRejectedValue(new Error('DB down'))
    const loop = new AgentLoop({ prisma: mockPrisma as any, lockManager: mockLockManager as any, siteId: 'site-1', configId: 'config-1' })
    const result = await loop.run()
    expect(result.success).toBe(false)
    expect(mockLockManager.releaseLock).toHaveBeenCalledWith('run-1', 'FAILED', 'DB down')
  })
})
