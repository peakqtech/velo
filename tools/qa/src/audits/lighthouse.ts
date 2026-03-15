import type { AuditModule, AuditResult } from "../pipeline";
import { execSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

export function createLighthouseAudit(): AuditModule {
  return {
    name: "lighthouse",
    async run(url: string): Promise<AuditResult> {
      const outDir = join(tmpdir(), "velo-qa-lighthouse");
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, "report.json");

      try {
        execSync(
          `npx lighthouse "${url}" --output=json --output-path="${outPath}" --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --quiet`,
          { timeout: 120_000, stdio: "pipe" }
        );

        const report = JSON.parse(readFileSync(outPath, "utf-8"));
        const categories = report.categories || {};

        const scores = Object.values(categories).map((c: any) => (c.score ?? 0) * 100);
        const avgScore = scores.length > 0
          ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
          : 0;

        const issues: AuditResult["issues"] = [];

        // Extract failed audits
        for (const [id, audit] of Object.entries(report.audits || {})) {
          const a = audit as any;
          if (a.score !== null && a.score < 0.5 && a.title) {
            issues.push({
              severity: a.score === 0 ? "error" : "warning",
              message: `${a.title}: ${a.description?.slice(0, 200) || ""}`,
            });
          }
        }

        return { name: "lighthouse", score: avgScore, issues };
      } catch (err) {
        return {
          name: "lighthouse",
          score: 0,
          issues: [{
            severity: "error",
            message: `Lighthouse failed: ${err instanceof Error ? err.message : String(err)}`,
          }],
        };
      }
    },
  };
}
