import type { AiResponse, CitationResult, CitationTypeName, ClientEntity } from '../types.js'

const RECOMMEND_KEYWORDS = /\b(recommend|suggest|best choice|top pick)\b/i

export class CitationDetector {
  detect(response: AiResponse, client: ClientEntity): CitationResult {
    const { rawText, sources } = response
    const allNames = [client.businessName, ...client.aliases]

    // 1. Check domain in sources → LINKED
    const linkedSource = sources.find((s) => s.includes(client.domain))
    if (linkedSource) {
      return {
        cited: true,
        type: 'LINKED',
        position: this.extractPosition(rawText, allNames),
        context: this.extractContext(rawText, allNames) ?? '',
        competitors: this.extractCompetitors(rawText, allNames),
      }
    }

    // 2. Check name/alias mention in text
    const matchedName = this.findMatch(rawText, allNames)
    if (!matchedName) {
      return { cited: false, type: 'ABSENT', position: null, context: '', competitors: [] }
    }

    // 3. Determine type: RECOMMENDED vs NAMED
    const type: CitationTypeName = this.isRecommended(rawText, matchedName)
      ? 'RECOMMENDED'
      : 'NAMED'

    return {
      cited: true,
      type,
      position: this.extractPosition(rawText, allNames),
      context: this.extractContext(rawText, allNames) ?? '',
      competitors: this.extractCompetitors(rawText, allNames),
    }
  }

  private findMatch(text: string, names: string[]): string | null {
    for (const name of names) {
      const regex = new RegExp(escapeRegex(name), 'i')
      if (regex.test(text)) return name
    }
    return null
  }

  private isRecommended(text: string, matchedName: string): boolean {
    // Find the position of the match and check surrounding context (~100 chars)
    const idx = text.search(new RegExp(escapeRegex(matchedName), 'i'))
    if (idx === -1) return false
    const start = Math.max(0, idx - 100)
    const end = Math.min(text.length, idx + matchedName.length + 100)
    const window = text.slice(start, end)
    return RECOMMEND_KEYWORDS.test(window)
  }

  private extractPosition(text: string, names: string[]): number | null {
    // Match numbered list items: "1. some text\n2. PeakQ\n3. ..."
    const lines = text.split('\n')
    for (const line of lines) {
      const listMatch = line.match(/^(\d+)\.\s+(.+)$/)
      if (!listMatch) continue
      const position = parseInt(listMatch[1], 10)
      const lineText = listMatch[2]
      for (const name of names) {
        if (new RegExp(escapeRegex(name), 'i').test(lineText)) {
          return position
        }
      }
    }
    return null
  }

  private extractContext(text: string, names: string[]): string | null {
    for (const name of names) {
      const idx = text.search(new RegExp(escapeRegex(name), 'i'))
      if (idx === -1) continue
      const start = Math.max(0, idx - 50)
      const end = Math.min(text.length, idx + name.length + 100)
      return text.slice(start, end)
    }
    return null
  }

  private extractCompetitors(text: string, clientNames: string[]): string[] {
    const competitors: string[] = []
    const lines = text.split('\n')
    for (const line of lines) {
      const listMatch = line.match(/^\d+\.\s+(.+)$/)
      if (!listMatch) continue
      const lineText = listMatch[1].trim()
      const isClient = clientNames.some((name) =>
        new RegExp(`^${escapeRegex(name)}$`, 'i').test(lineText),
      )
      if (!isClient) {
        competitors.push(lineText)
      }
    }
    return competitors
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
