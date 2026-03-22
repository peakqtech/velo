import { CitationDetector } from '../detection/citation-detector'
import type {
  AiEngineName,
  AiResponse,
  CitationResult,
  ClientEntity,
  EngineAdapter,
  GeoProvider,
} from '../types'

export class InternalGeoProvider implements GeoProvider {
  private readonly adapters: Map<AiEngineName, EngineAdapter>
  private readonly detector: CitationDetector

  constructor(adapters: EngineAdapter[]) {
    this.adapters = new Map(adapters.map((a) => [a.name, a]))
    this.detector = new CitationDetector()
  }

  async query(prompt: string, engine: AiEngineName): Promise<AiResponse> {
    const adapter = this.adapters.get(engine)
    if (!adapter) {
      throw new Error(`No adapter registered for engine: ${engine}`)
    }
    return adapter.query(prompt)
  }

  detectCitation(response: AiResponse, client: ClientEntity): CitationResult {
    return this.detector.detect(response, client)
  }
}
