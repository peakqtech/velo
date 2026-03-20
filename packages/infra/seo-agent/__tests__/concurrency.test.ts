import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LockManager } from '../src/loop/concurrency'

const mockPrisma = {
  agentRun: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}

describe('LockManager', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('acquires lock when no active run exists', async () => {
    mockPrisma.agentRun.findFirst.mockResolvedValue(null)
    mockPrisma.agentRun.create.mockResolvedValue({ id: 'run-1', lockToken: 'token-123', status: 'RUNNING' })
    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')
    expect(result.acquired).toBe(true)
    expect(result.runId).toBe('run-1')
  })

  it('rejects when active run exists within TTL', async () => {
    mockPrisma.agentRun.findFirst.mockResolvedValue({ id: 'run-existing', status: 'RUNNING', startedAt: new Date() })
    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')
    expect(result.acquired).toBe(false)
    expect(result.reason).toContain('active run')
  })

  it('supersedes stale run (>1 hour)', async () => {
    const staleStart = new Date(Date.now() - 2 * 60 * 60 * 1000)
    mockPrisma.agentRun.findFirst.mockResolvedValue({ id: 'run-stale', status: 'RUNNING', startedAt: staleStart })
    mockPrisma.agentRun.update.mockResolvedValue({ id: 'run-stale', status: 'FAILED' })
    mockPrisma.agentRun.create.mockResolvedValue({ id: 'run-new', lockToken: 'token-new', status: 'RUNNING' })
    const manager = new LockManager(mockPrisma as any)
    const result = await manager.acquireLock('site-1', 'config-1')
    expect(result.acquired).toBe(true)
    expect(mockPrisma.agentRun.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'run-stale' }, data: expect.objectContaining({ status: 'FAILED' }) })
    )
  })

  it('releases lock by completing the run', async () => {
    mockPrisma.agentRun.update.mockResolvedValue({ id: 'run-1', status: 'COMPLETED' })
    const manager = new LockManager(mockPrisma as any)
    await manager.releaseLock('run-1', 'COMPLETED')
    expect(mockPrisma.agentRun.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'run-1' }, data: expect.objectContaining({ status: 'COMPLETED', completedAt: expect.any(Date) }) })
    )
  })
})
