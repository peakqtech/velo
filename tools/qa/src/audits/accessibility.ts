import type { AuditModule, AuditResult } from "../pipeline";
import { execSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export function createA11yAudit(): AuditModule {
  return {
    name: "accessibility",
    async run(url: string): Promise<AuditResult> {
      const outDir = join(tmpdir(), "velo-qa-a11y");
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, "a11y.json");

      try {
        // Use pa11y for accessibility auditing (WCAG 2.1 AA by default)
        execSync(
          `npx pa11y "${url}" --reporter json > "${outPath}"`,
          { timeout: 60_000, stdio: "pipe", shell: true }
        );

        const results = JSON.parse(readFileSync(outPath, "utf-8"));
        const issues: AuditResult["issues"] = [];

        for (const issue of Array.isArray(results) ? results : results.issues || []) {
          issues.push({
            severity: issue.type === "error" ? "error" : issue.type === "warning" ? "warning" : "info",
            message: issue.message || issue.msg || "",
            selector: issue.selector || issue.context || "",
          });
        }

        // Score: 100 minus penalty per issue (errors = -10, warnings = -5)
        const penalty = issues.reduce((sum, i) =>
          sum + (i.severity === "error" ? 10 : i.severity === "warning" ? 5 : 1), 0);
        const score = Math.max(0, Math.min(100, 100 - penalty));

        return { name: "accessibility", score, issues };
      } catch (err) {
        // pa11y exits non-zero when issues found — parse the output anyway
        try {
          const raw = readFileSync(outPath, "utf-8");
          if (raw.trim()) {
            const results = JSON.parse(raw);
            const issues: AuditResult["issues"] = [];
            for (const issue of Array.isArray(results) ? results : results.issues || []) {
              issues.push({
                severity: issue.type === "error" ? "error" : "warning",
                message: issue.message || "",
                selector: issue.selector || "",
              });
            }
            const penalty = issues.reduce((sum, i) =>
              sum + (i.severity === "error" ? 10 : 5), 0);
            return { name: "accessibility", score: Math.max(0, 100 - penalty), issues };
          }
        } catch { /* ignore parse error */ }

        return {
          name: "accessibility",
          score: 0,
          issues: [{
            severity: "error",
            message: `a11y audit failed: ${err instanceof Error ? err.message : String(err)}`,
          }],
        };
      }
    },
  };
}
