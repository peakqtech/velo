export type { Cadence, ChannelCadenceConfig } from '@velo/seo-engine'

export interface AgentLoopContext {
  siteId: string
  configId: string
  runId: string
  tier: 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE'
}

export interface OpportunitySeed {
  signal: 'KEYWORD_GAP' | 'COMPETITOR' | 'AI_ANSWER'
  keyword: string
  title?: string
  channel: 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'
  score: number
  metadata?: Record<string, unknown>
}

export interface AgentStepResult {
  step: string
  success: boolean
  metrics?: Record<string, number>
  error?: string
}
