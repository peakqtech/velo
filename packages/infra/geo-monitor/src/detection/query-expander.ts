export interface ExpandOptions {
  location?: string
  competitors?: string[]
  maxVariants?: number
}

export class QueryExpander {
  expand(seeds: string[], options: ExpandOptions): string[] {
    const { location, competitors = [], maxVariants } = options
    const results = new Set<string>()

    for (const seed of seeds) {
      // Original seed
      results.add(seed)

      // Location variants
      if (location) {
        results.add(`${seed} in ${location}`)
        results.add(`${seed} near ${location}`)
      }

      // Question variants
      results.add(`what is the best ${seed}`)
      results.add(`who offers ${seed}`)

      // Comparison variants
      for (const competitor of competitors) {
        results.add(`${seed} vs ${competitor}`)
      }
    }

    const all = Array.from(results)
    return maxVariants !== undefined ? all.slice(0, maxVariants) : all
  }
}
