import type { PrismaClient } from '@velo/db'
import { TierGate } from '../gates/tier-gate.js'
import { OversightGate } from '../gates/oversight-gate.js'
import type { LockManager } from './concurrency.js'

export interface RunResult {
  success: boolean
  reason?: string
  metrics?: Record<string, number>
}

export interface AgentLoopOptions {
  prisma: PrismaClient
  lockManager: LockManager
  siteId: string
  configId: string
}

const STEPS = [
  'GATHER',
  'ANALYZE',
  'PLAN',
  'GENERATE',
  'GATE',
  'PUBLISH',
  'MONITOR',
  'REPORT',
] as const

type Step = typeof STEPS[number]

export class AgentLoop {
  private readonly prisma: PrismaClient
  private readonly lockManager: LockManager
  private readonly siteId: string
  private readonly configId: string

  constructor(options: AgentLoopOptions) {
    this.prisma = options.prisma
    this.lockManager = options.lockManager
    this.siteId = options.siteId
    this.configId = options.configId
  }

  async run(): Promise<RunResult> {
    // Step 1: Acquire lock
    const lockResult = await this.lockManager.acquireLock(this.siteId, this.configId)
    if (!lockResult.acquired) {
      return { success: false, reason: lockResult.reason }
    }

    const runId = lockResult.runId!

    try {
      // Step 2: Load AgentConfig
      const config = await this.prisma.agentConfig.findUnique({
        where: { id: this.configId },
      })

      if (!config) {
        throw new Error(`AgentConfig not found: ${this.configId}`)
      }

      // Step 3: Create gates from config
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tierGate = new TierGate(config.tier)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const oversightGate = new OversightGate(config.oversightMode)

      // Step 4: Run 8 steps
      for (const step of STEPS) {
        await this.lockManager.updateStep(runId, step)
        await this.runStep(step, config)
      }

      // Release lock as COMPLETED
      await this.lockManager.releaseLock(runId, 'COMPLETED', undefined)
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await this.lockManager.releaseLock(runId, 'FAILED', message)
      return { success: false, reason: message }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async runStep(step: Step, _config: unknown): Promise<void> {
    switch (step) {
      case 'GATHER':
        // TODO: gather keyword signals, competitor data, GEO prompts
        break
      case 'ANALYZE':
        // TODO: score opportunities via OpportunityScorer, detect duplicates via Deduplicator
        break
      case 'PLAN':
        // TODO: apply CadenceLimiter, rank and select opportunities
        break
      case 'GENERATE':
        // TODO: generate content via AI model adapters
        break
      case 'GATE':
        // TODO: evaluate each opportunity through OversightGate
        break
      case 'PUBLISH':
        // TODO: publish or queue content per OversightDecision
        break
      case 'MONITOR':
        // TODO: capture GeoSnapshots and update GeoScores
        break
      case 'REPORT':
        // TODO: aggregate metrics, persist run summary
        break
    }
  }
}
