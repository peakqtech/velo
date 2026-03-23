import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@velo/db'

const STALE_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour

export interface AcquireLockResult {
  acquired: boolean
  runId?: string
  lockToken?: string
  reason?: string
}

export class LockManager {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async acquireLock(siteId: string, configId: string): Promise<AcquireLockResult> {
    const activeRun = await this.prisma.agentRun.findFirst({
      where: {
        siteId,
        configId,
        status: 'RUNNING',
      },
    })

    if (activeRun) {
      const ageMs = Date.now() - activeRun.startedAt.getTime()

      if (ageMs < STALE_THRESHOLD_MS) {
        return {
          acquired: false,
          reason: `active run exists: ${activeRun.id}`,
        }
      }

      // Stale run — supersede it
      await this.prisma.agentRun.update({
        where: { id: activeRun.id },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error: 'Superseded by new run (stale lock)',
        },
      })
    }

    const lockToken = randomUUID()
    const newRun = await this.prisma.agentRun.create({
      data: {
        siteId,
        configId,
        lockToken,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    return {
      acquired: true,
      runId: newRun.id,
      lockToken: newRun.lockToken ?? undefined,
    }
  }

  async releaseLock(runId: string, status: 'COMPLETED' | 'FAILED', error?: string): Promise<void> {
    await this.prisma.agentRun.update({
      where: { id: runId },
      data: {
        status,
        completedAt: new Date(),
        ...(error ? { error } : {}),
      },
    })
  }

  async updateStep(runId: string, step: string, metrics?: Record<string, number>): Promise<void> {
    await this.prisma.agentRun.update({
      where: { id: runId },
      data: {
        currentStep: step,
        ...(metrics ? { metrics } : {}),
      },
    })
  }
}
