import type { ChannelLimit } from '../gates/tier-gate.js'

type Channel = 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'
type ConfigKey = 'blog' | 'gbp' | 'social' | 'email'

type CadenceConfig = Partial<Record<ConfigKey, ChannelLimit>>

interface Opportunity {
  channel: Channel
  score: number
  keyword: string
  [key: string]: unknown
}

interface ApplyContext {
  alreadyPublishedThisPeriod: Partial<Record<Channel, number>>
}

const CHANNEL_KEY_MAP: Record<Channel, ConfigKey> = {
  BLOG: 'blog',
  GBP: 'gbp',
  SOCIAL: 'social',
  EMAIL: 'email',
}

export class CadenceLimiter {
  private readonly config: CadenceConfig

  constructor(config: CadenceConfig) {
    this.config = config
  }

  apply(opportunities: Opportunity[], context: ApplyContext): Opportunity[] {
    const sorted = [...opportunities].sort((a, b) => b.score - a.score)

    const budgetUsed: Partial<Record<Channel, number>> = {}

    const result: Opportunity[] = []

    for (const opp of sorted) {
      const configKey = CHANNEL_KEY_MAP[opp.channel]
      const channelConfig = this.config[configKey]

      // Filter out channels not in cadence config
      if (!channelConfig) continue

      const alreadyPublished = context.alreadyPublishedThisPeriod[opp.channel] ?? 0
      const used = budgetUsed[opp.channel] ?? 0
      const remaining = channelConfig.max - alreadyPublished - used

      if (remaining > 0) {
        result.push(opp)
        budgetUsed[opp.channel] = used + 1
      }
    }

    return result
  }
}
