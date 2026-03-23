export type AiEngineName = 'CHATGPT' | 'PERPLEXITY' | 'GEMINI' | 'AI_OVERVIEW'
export type CitationTypeName = 'NAMED' | 'LINKED' | 'RECOMMENDED' | 'ABSENT'

export interface AiResponse {
  engine: AiEngineName
  query: string
  rawText: string
  sources: string[]
  entitiesMentioned: string[]
  timestamp: Date
}

export interface CitationResult {
  cited: boolean
  type: CitationTypeName
  position: number | null
  context: string
  competitors: string[]
}

export interface ClientEntity {
  businessName: string
  domain: string
  aliases: string[]
  phone?: string
  address?: string
}

export interface GeoProvider {
  query(prompt: string, engine: AiEngineName): Promise<AiResponse>
  detectCitation(response: AiResponse, client: ClientEntity): CitationResult
}

export interface EngineAdapter {
  name: AiEngineName
  query(prompt: string): Promise<AiResponse>
}

export interface VisibilityReport {
  siteId: string
  engine: AiEngineName
  period: Date
  visibility: number
  avgPosition: number | null
  totalQueries: number
  citedQueries: number
  topQueries: Array<{ query: string; cited: boolean; position: number | null }>
}
