import { describe, it, expect } from 'vitest'
import { TierGate } from '../src/gates/tier-gate.js'

describe('TierGate', () => {
  describe('STARTER tier', () => {
    const gate = new TierGate('STARTER')
    it('does not allow any channels', () => {
      expect(gate.canUseChannel('BLOG')).toBe(false)
      expect(gate.canUseChannel('GBP')).toBe(false)
      expect(gate.canUseChannel('SOCIAL')).toBe(false)
      expect(gate.canUseChannel('EMAIL')).toBe(false)
    })
    it('has zero GEO query budget', () => {
      expect(gate.getGeoQueryBudget()).toBe(0)
    })
  })

  describe('GROWTH tier', () => {
    const gate = new TierGate('GROWTH')
    it('allows BLOG and GBP only', () => {
      expect(gate.canUseChannel('BLOG')).toBe(true)
      expect(gate.canUseChannel('GBP')).toBe(true)
      expect(gate.canUseChannel('SOCIAL')).toBe(false)
      expect(gate.canUseChannel('EMAIL')).toBe(false)
    })
    it('returns correct channel limits', () => {
      expect(gate.getChannelLimit('BLOG')).toEqual({ max: 2, period: 'week' })
      expect(gate.getChannelLimit('GBP')).toEqual({ max: 3, period: 'week' })
    })
    it('has zero GEO query budget', () => {
      expect(gate.getGeoQueryBudget()).toBe(0)
    })
    it('allows only CLAUDE model', () => {
      expect(gate.getAllowedModels()).toEqual(['CLAUDE'])
    })
    it('allows AUTO_PUBLISH and VETO_WINDOW oversight', () => {
      expect(gate.getAllowedOversightModes()).toContain('AUTO_PUBLISH')
      expect(gate.getAllowedOversightModes()).toContain('VETO_WINDOW')
      expect(gate.getAllowedOversightModes()).not.toContain('APPROVAL_REQUIRED')
    })
    it('has basic GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('basic')
    })
    it('allows zero competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(0)
    })
  })

  describe('SCALE tier', () => {
    const gate = new TierGate('SCALE')
    it('allows all 4 channels', () => {
      expect(gate.canUseChannel('BLOG')).toBe(true)
      expect(gate.canUseChannel('SOCIAL')).toBe(true)
      expect(gate.canUseChannel('EMAIL')).toBe(true)
    })
    it('has 50 GEO queries per week', () => {
      expect(gate.getGeoQueryBudget()).toBe(50)
    })
    it('allows 3 competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(3)
    })
    it('has full GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('full')
    })
  })

  describe('ENTERPRISE tier', () => {
    const gate = new TierGate('ENTERPRISE')
    it('has unlimited channel limits', () => {
      expect(gate.getChannelLimit('BLOG')).toEqual({ max: Infinity, period: 'week' })
    })
    it('has 100 GEO queries', () => {
      expect(gate.getGeoQueryBudget()).toBe(100)
    })
    it('allows all models', () => {
      expect(gate.getAllowedModels()).toEqual(['CLAUDE', 'OPENAI', 'GEMINI'])
    })
    it('allows 10 competitors', () => {
      expect(gate.getCompetitorLimit()).toBe(10)
    })
    it('has custom GEO optimization', () => {
      expect(gate.getGeoOptimizationLevel()).toBe('custom')
    })
  })
})
