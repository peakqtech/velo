export interface KeywordItem {
  keyword: string
  score: number
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'that', 'this',
  'it', 'its',
])

function stem(word: string): string {
  // Simple suffix-stripping: normalize plurals and common suffixes
  if (word.endsWith('ists')) return word.slice(0, -4) + 'ist'
  if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y'
  if (word.endsWith('ves') && word.length > 4) return word.slice(0, -3) + 'f'
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3)
  if (word.endsWith('tion') && word.length > 5) return word.slice(0, -4)
  if (word.endsWith('ers') && word.length > 5) return word.slice(0, -2)
  if (word.endsWith('er') && word.length > 4) return word.slice(0, -2)
  if (word.endsWith('s') && word.length > 3 && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

function tokenize(keyword: string): string[] {
  return keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w))
    .map(stem)
}

function getNgrams(tokens: string[]): Set<string> {
  const ngrams = new Set<string>()
  for (const token of tokens) {
    ngrams.add(token)
  }
  for (let i = 0; i < tokens.length - 1; i++) {
    ngrams.add(`${tokens[i]} ${tokens[i + 1]}`)
  }
  return ngrams
}

function jaccardSimilarity(a: string, b: string): number {
  const ngramsA = getNgrams(tokenize(a))
  const ngramsB = getNgrams(tokenize(b))

  if (ngramsA.size === 0 && ngramsB.size === 0) return 1

  let intersection = 0
  for (const ngram of ngramsA) {
    if (ngramsB.has(ngram)) intersection++
  }

  const union = ngramsA.size + ngramsB.size - intersection
  return union === 0 ? 0 : intersection / union
}

export class Deduplicator {
  private readonly threshold: number

  constructor(threshold = 0.7) {
    this.threshold = threshold
  }

  deduplicate(items: KeywordItem[]): KeywordItem[] {
    const sorted = [...items].sort((a, b) => b.score - a.score)
    const kept: KeywordItem[] = []

    for (const item of sorted) {
      const isDuplicate = kept.some(
        (existing) => jaccardSimilarity(item.keyword, existing.keyword) >= this.threshold,
      )
      if (!isDuplicate) {
        kept.push(item)
      }
    }

    return kept
  }
}
