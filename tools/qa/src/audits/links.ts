import type { AuditModule, AuditResult } from "../pipeline";
import { execSync } from "node:child_process";

export function createLinkChecker(): AuditModule {
  return {
    name: "links",
    async run(url: string): Promise<AuditResult> {
      const issues: AuditResult["issues"] = [];

      try {
        // Use a simple fetch-based approach to check links on the page
        const response = await fetch(url);
        if (!response.ok) {
          issues.push({
            severity: "error",
            message: `Main page returned ${response.status}`,
            url,
          });
          return { name: "links", score: 0, issues };
        }

        const html = await response.text();

        // Extract all href and src attributes
        const linkPattern = /(?:href|src)=["']([^"'#]+)["']/g;
        const links = new Set<string>();
        let match;
        while ((match = linkPattern.exec(html)) !== null) {
          const link = match[1];
          // Only check http(s) links and absolute paths
          if (link.startsWith("http")) {
            links.add(link);
          } else if (link.startsWith("/")) {
            const base = new URL(url);
            links.add(`${base.origin}${link}`);
          }
        }

        // Check each link (with timeout)
        let broken = 0;
        const checked = Math.min(links.size, 50); // Cap at 50 links

        for (const link of [...links].slice(0, 50)) {
          try {
            const res = await fetch(link, {
              method: "HEAD",
              signal: AbortSignal.timeout(5000),
            });
            if (res.status >= 400) {
              broken++;
              issues.push({
                severity: res.status === 404 ? "error" : "warning",
                message: `Broken link (${res.status}): ${link}`,
                url: link,
              });
            }
          } catch {
            // Timeout or network error — count as warning
            issues.push({
              severity: "warning",
              message: `Link unreachable: ${link}`,
              url: link,
            });
          }
        }

        const score = checked > 0
          ? Math.round(((checked - broken) / checked) * 100)
          : 100;

        return { name: "links", score, issues };
      } catch (err) {
        return {
          name: "links",
          score: 0,
          issues: [{
            severity: "error",
            message: `Link check failed: ${err instanceof Error ? err.message : String(err)}`,
          }],
        };
      }
    },
  };
}
