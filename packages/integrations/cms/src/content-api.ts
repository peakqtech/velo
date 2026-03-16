/**
 * Content API — CRUD operations for site content.
 *
 * In production, this reads/writes to the database (Site.content JSON column).
 * For now, provides the interface and in-memory implementation for testing.
 */

export interface ContentStore {
  getContent(siteId: string): Promise<Record<string, unknown> | null>;
  updateContent(siteId: string, content: Record<string, unknown>): Promise<void>;
  updateSection(siteId: string, sectionKey: string, sectionData: unknown): Promise<void>;
  getContentHistory(siteId: string, limit?: number): Promise<ContentVersion[]>;
}

export interface ContentVersion {
  id: string;
  siteId: string;
  content: Record<string, unknown>;
  updatedBy: string;
  updatedAt: string;
  message?: string;
}

/**
 * In-memory content store for testing and development.
 */
export class InMemoryContentStore implements ContentStore {
  private store = new Map<string, Record<string, unknown>>();
  private history = new Map<string, ContentVersion[]>();

  async getContent(siteId: string): Promise<Record<string, unknown> | null> {
    return this.store.get(siteId) ?? null;
  }

  async updateContent(siteId: string, content: Record<string, unknown>): Promise<void> {
    this.store.set(siteId, content);
    this.addToHistory(siteId, content);
  }

  async updateSection(siteId: string, sectionKey: string, sectionData: unknown): Promise<void> {
    const existing = this.store.get(siteId) ?? {};
    const updated = { ...existing, [sectionKey]: sectionData };
    this.store.set(siteId, updated);
    this.addToHistory(siteId, updated);
  }

  async getContentHistory(siteId: string, limit = 10): Promise<ContentVersion[]> {
    const versions = this.history.get(siteId) ?? [];
    return versions.slice(-limit).reverse();
  }

  private addToHistory(siteId: string, content: Record<string, unknown>): void {
    const versions = this.history.get(siteId) ?? [];
    versions.push({
      id: crypto.randomUUID(),
      siteId,
      content: structuredClone(content),
      updatedBy: "system",
      updatedAt: new Date().toISOString(),
    });
    this.history.set(siteId, versions);
  }
}
