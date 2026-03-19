export type Tier = 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE'
export type Channel = 'BLOG' | 'GBP' | 'SOCIAL' | 'EMAIL'
export type Model = 'CLAUDE' | 'OPENAI' | 'GEMINI'
export type OversightMode = 'AUTO_PUBLISH' | 'VETO_WINDOW' | 'APPROVAL_REQUIRED'
export type GeoOptimizationLevel = 'none' | 'basic' | 'full' | 'custom'
export type Period = 'week' | 'month'

export interface ChannelLimit {
  max: number
  period: Period
}

interface TierConfig {
  channels: Partial<Record<Channel, ChannelLimit>>
  geoQueryBudget: number
  allowedModels: Model[]
  allowedOversightModes: OversightMode[]
  geoOptimizationLevel: GeoOptimizationLevel
  competitorLimit: number
}

const TIER_CONFIG: Record<Tier, TierConfig> = {
  STARTER: {
    channels: {},
    geoQueryBudget: 0,
    allowedModels: [],
    allowedOversightModes: [],
    geoOptimizationLevel: 'none',
    competitorLimit: 0,
  },
  GROWTH: {
    channels: {
      BLOG: { max: 2, period: 'week' },
      GBP: { max: 3, period: 'week' },
    },
    geoQueryBudget: 0,
    allowedModels: ['CLAUDE'],
    allowedOversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW'],
    geoOptimizationLevel: 'basic',
    competitorLimit: 0,
  },
  SCALE: {
    channels: {
      BLOG: { max: 5, period: 'week' },
      GBP: { max: 5, period: 'week' },
      SOCIAL: { max: 5, period: 'week' },
      EMAIL: { max: 2, period: 'month' },
    },
    geoQueryBudget: 50,
    allowedModels: ['CLAUDE', 'OPENAI'],
    allowedOversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW', 'APPROVAL_REQUIRED'],
    geoOptimizationLevel: 'full',
    competitorLimit: 3,
  },
  ENTERPRISE: {
    channels: {
      BLOG: { max: Infinity, period: 'week' },
      GBP: { max: Infinity, period: 'week' },
      SOCIAL: { max: Infinity, period: 'week' },
      EMAIL: { max: Infinity, period: 'week' },
    },
    geoQueryBudget: 100,
    allowedModels: ['CLAUDE', 'OPENAI', 'GEMINI'],
    allowedOversightModes: ['AUTO_PUBLISH', 'VETO_WINDOW', 'APPROVAL_REQUIRED'],
    geoOptimizationLevel: 'custom',
    competitorLimit: 10,
  },
}

export class TierGate {
  private readonly config: TierConfig

  constructor(tier: Tier) {
    this.config = TIER_CONFIG[tier]
  }

  canUseChannel(channel: Channel): boolean {
    return channel in this.config.channels
  }

  getChannelLimit(channel: Channel): ChannelLimit | undefined {
    return this.config.channels[channel]
  }

  getGeoQueryBudget(): number {
    return this.config.geoQueryBudget
  }

  getCompetitorLimit(): number {
    return this.config.competitorLimit
  }

  getAllowedModels(): Model[] {
    return this.config.allowedModels
  }

  getAllowedOversightModes(): OversightMode[] {
    return this.config.allowedOversightModes
  }

  getGeoOptimizationLevel(): GeoOptimizationLevel {
    return this.config.geoOptimizationLevel
  }
}
