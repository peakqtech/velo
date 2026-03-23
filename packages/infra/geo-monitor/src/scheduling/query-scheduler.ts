export type AiEngineName = 'CHATGPT' | 'PERPLEXITY' | 'GEMINI' | 'AI_OVERVIEW'

export interface ScheduledQuery {
  query: string
  engine: AiEngineName
}

export interface ScheduleConfig {
  queries: string[]
  weeklyBudgetPerEngine: number
}

type DayType = 'chatgpt_perplexity' | 'gemini_ai_overview' | 'full_sweep' | 'off'

const ALL_ENGINES: AiEngineName[] = ['CHATGPT', 'PERPLEXITY', 'GEMINI', 'AI_OVERVIEW']

export class QueryScheduler {
  getDayType(date: Date = new Date()): DayType {
    // getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const day = date.getDay()
    if (day === 1) return 'chatgpt_perplexity'
    if (day === 3) return 'gemini_ai_overview'
    if (day === 5) return 'full_sweep'
    return 'off'
  }

  getActiveEngines(date: Date = new Date()): AiEngineName[] {
    const dayType = this.getDayType(date)
    switch (dayType) {
      case 'chatgpt_perplexity': return ['CHATGPT', 'PERPLEXITY']
      case 'gemini_ai_overview': return ['GEMINI', 'AI_OVERVIEW']
      case 'full_sweep': return [...ALL_ENGINES]
      case 'off': return []
    }
  }

  getScheduledQueries(config: ScheduleConfig, date: Date = new Date()): ScheduledQuery[] {
    const { queries, weeklyBudgetPerEngine } = config
    const dayType = this.getDayType(date)

    if (dayType === 'off') return []

    const engines = this.getActiveEngines(date)
    const result: ScheduledQuery[] = []

    if (dayType === 'full_sweep') {
      // All queries for all engines, each engine capped at weeklyBudgetPerEngine
      for (const engine of engines) {
        const limited = queries.slice(0, weeklyBudgetPerEngine)
        for (const query of limited) {
          result.push({ query, engine })
        }
      }
    } else {
      // Split queries alternately between 2 engines, each engine capped at weeklyBudgetPerEngine
      const [engine1, engine2] = engines
      for (let i = 0; i < queries.length; i++) {
        const engine = i % 2 === 0 ? engine1 : engine2
        // Count how many this engine already has
        const engineCount = result.filter(r => r.engine === engine).length
        if (engineCount < weeklyBudgetPerEngine) {
          result.push({ query: queries[i], engine })
        }
      }
    }

    return result
  }
}
