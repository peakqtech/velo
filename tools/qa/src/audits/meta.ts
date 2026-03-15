import type { AuditModule, AuditResult } from "../pipeline";

interface MetaAuditOptions {
  html?: string;
}

const REQUIRED_META = [
  { check: "title", test: (html: string) => /<title>[^<]+<\/title>/i.test(html), message: "Missing <title> tag" },
  { check: "description", test: (html: string) => /meta\s+name=["']description["']/i.test(html), message: "Missing meta description" },
  { check: "viewport", test: (html: string) => /meta\s+name=["']viewport["']/i.test(html), message: "Missing viewport meta tag" },
  { check: "og:title", test: (html: string) => /property=["']og:title["']/i.test(html), message: "Missing og:title meta tag" },
  { check: "og:image", test: (html: string) => /property=["']og:image["']/i.test(html), message: "Missing og:image meta tag" },
  { check: "og:description", test: (html: string) => /property=["']og:description["']/i.test(html), message: "Missing og:description meta tag" },
  { check: "charset", test: (html: string) => /charset=/i.test(html), message: "Missing charset declaration" },
  { check: "lang", test: (html: string) => /<html[^>]*\slang=/i.test(html), message: "Missing lang attribute on <html>" },
];

export function createMetaAudit(): AuditModule {
  return {
    name: "meta",
    async run(url: string, options?: MetaAuditOptions): Promise<AuditResult> {
      let html: string;

      if (options?.html) {
        html = options.html;
      } else {
        try {
          const res = await fetch(url);
          html = await res.text();
        } catch (err) {
          return {
            name: "meta",
            score: 0,
            issues: [{
              severity: "error",
              message: `Failed to fetch ${url}: ${err instanceof Error ? err.message : String(err)}`,
            }],
          };
        }
      }

      const issues: AuditResult["issues"] = [];

      for (const meta of REQUIRED_META) {
        if (!meta.test(html)) {
          issues.push({
            severity: meta.check.startsWith("og:") ? "warning" : "error",
            message: meta.message,
          });
        }
      }

      // Score: percentage of checks passed
      const passed = REQUIRED_META.length - issues.length;
      const score = Math.round((passed / REQUIRED_META.length) * 100);

      return { name: "meta", score, issues };
    },
  };
}
