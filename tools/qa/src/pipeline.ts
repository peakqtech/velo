export interface AuditIssue {
  severity: "error" | "warning" | "info";
  message: string;
  selector?: string;
  url?: string;
}

export interface AuditResult {
  name: string;
  score: number;
  issues: AuditIssue[];
}

export interface AuditModule {
  name: string;
  run: (url: string, options?: Record<string, unknown>) => Promise<AuditResult>;
}

export interface QAReport {
  url: string;
  timestamp: string;
  healthScore: number;
  totalIssues: number;
  issuesByAudit: Record<string, number>;
  audits: AuditResult[];
}

export class QAPipeline {
  private url: string;
  private audits: AuditModule[] = [];

  constructor(url: string) {
    this.url = url;
  }

  register(audit: AuditModule): void {
    this.audits.push(audit);
  }

  async run(): Promise<QAReport> {
    const results: AuditResult[] = [];

    for (const audit of this.audits) {
      try {
        const result = await audit.run(this.url);
        results.push(result);
      } catch (err) {
        results.push({
          name: audit.name,
          score: 0,
          issues: [{
            severity: "error",
            message: `Audit failed: ${err instanceof Error ? err.message : String(err)}`,
          }],
        });
      }
    }

    const healthScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

    const issuesByAudit: Record<string, number> = {};
    let totalIssues = 0;
    for (const result of results) {
      issuesByAudit[result.name] = result.issues.length;
      totalIssues += result.issues.length;
    }

    return {
      url: this.url,
      timestamp: new Date().toISOString(),
      healthScore,
      totalIssues,
      issuesByAudit,
      audits: results,
    };
  }
}
