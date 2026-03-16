import type { QAReport } from "./pipeline";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function formatReportText(report: QAReport): string {
  const lines: string[] = [];

  lines.push("═══════════════════════════════════════════");
  lines.push(`  VELO QA REPORT`);
  lines.push("═══════════════════════════════════════════");
  lines.push(`  URL:    ${report.url}`);
  lines.push(`  Date:   ${new Date(report.timestamp).toLocaleString()}`);
  lines.push(`  Health: ${report.healthScore}/100`);
  lines.push(`  Issues: ${report.totalIssues}`);
  lines.push("───────────────────────────────────────────");

  for (const audit of report.audits) {
    const icon = audit.score >= 90 ? "✓" : audit.score >= 50 ? "△" : "✗";
    lines.push(`\n  ${icon} ${audit.name}: ${audit.score}/100`);

    if (audit.issues.length > 0) {
      for (const issue of audit.issues.slice(0, 10)) {
        const severity = issue.severity === "error" ? "ERR" : issue.severity === "warning" ? "WRN" : "INF";
        lines.push(`    [${severity}] ${issue.message}`);
        if (issue.selector) lines.push(`          → ${issue.selector}`);
        if (issue.url) lines.push(`          → ${issue.url}`);
      }
      if (audit.issues.length > 10) {
        lines.push(`    ... and ${audit.issues.length - 10} more`);
      }
    }
  }

  lines.push("\n═══════════════════════════════════════════");
  return lines.join("\n");
}

export function saveReport(report: QAReport, outDir: string): { json: string; text: string } {
  mkdirSync(outDir, { recursive: true });

  const jsonPath = join(outDir, "qa-report.json");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const textPath = join(outDir, "qa-report.txt");
  writeFileSync(textPath, formatReportText(report));

  return { json: jsonPath, text: textPath };
}
