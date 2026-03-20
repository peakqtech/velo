import { describe, it, expect } from 'vitest'
import { QueryScheduler } from '../src/scheduling/query-scheduler.js'

describe('QueryScheduler', () => {
  const scheduler = new QueryScheduler()
  const queries = ['best dentist', 'top clinic', 'affordable dental', 'dentist near me']

  describe('getDayType', () => {
    it('returns chatgpt_perplexity on Monday', () => {
      const monday = new Date('2026-03-16') // Monday
      expect(scheduler.getDayType(monday)).toBe('chatgpt_perplexity')
    })
    it('returns gemini_ai_overview on Wednesday', () => {
      const wednesday = new Date('2026-03-18')
      expect(scheduler.getDayType(wednesday)).toBe('gemini_ai_overview')
    })
    it('returns full_sweep on Friday', () => {
      const friday = new Date('2026-03-20')
      expect(scheduler.getDayType(friday)).toBe('full_sweep')
    })
    it('returns off on other days', () => {
      const tuesday = new Date('2026-03-17')
      expect(scheduler.getDayType(tuesday)).toBe('off')
    })
  })

  describe('getActiveEngines', () => {
    it('returns ChatGPT + Perplexity on Monday', () => {
      const monday = new Date('2026-03-16')
      expect(scheduler.getActiveEngines(monday)).toEqual(['CHATGPT', 'PERPLEXITY'])
    })
    it('returns all 4 on Friday', () => {
      const friday = new Date('2026-03-20')
      expect(scheduler.getActiveEngines(friday)).toHaveLength(4)
    })
    it('returns empty on off days', () => {
      const saturday = new Date('2026-03-21')
      expect(scheduler.getActiveEngines(saturday)).toHaveLength(0)
    })
  })

  describe('getScheduledQueries', () => {
    it('splits queries between 2 engines on Monday', () => {
      const monday = new Date('2026-03-16')
      const result = scheduler.getScheduledQueries({ queries, weeklyBudgetPerEngine: 50 }, monday)
      const chatgpt = result.filter(r => r.engine === 'CHATGPT')
      const perplexity = result.filter(r => r.engine === 'PERPLEXITY')
      expect(chatgpt.length).toBe(2)
      expect(perplexity.length).toBe(2)
    })
    it('gives all queries to all engines on Friday', () => {
      const friday = new Date('2026-03-20')
      const result = scheduler.getScheduledQueries({ queries, weeklyBudgetPerEngine: 50 }, friday)
      expect(result).toHaveLength(16) // 4 queries × 4 engines
    })
    it('returns empty on off days', () => {
      const sunday = new Date('2026-03-22')
      const result = scheduler.getScheduledQueries({ queries, weeklyBudgetPerEngine: 50 }, sunday)
      expect(result).toHaveLength(0)
    })
    it('respects budget limit', () => {
      const friday = new Date('2026-03-20')
      const result = scheduler.getScheduledQueries({ queries, weeklyBudgetPerEngine: 2 }, friday)
      const perEngine = new Map<string, number>()
      result.forEach(r => perEngine.set(r.engine, (perEngine.get(r.engine) || 0) + 1))
      for (const count of perEngine.values()) {
        expect(count).toBeLessThanOrEqual(2)
      }
    })
  })
})
