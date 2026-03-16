import { describe, it, expect } from "vitest";
import { formatReportText } from "../src/report";
import type { QAReport } from "../src/pipeline";

describe("formatReportText", () => {
  const mockReport: QAReport = {
    url: "https://example.com",
    timestamp: "2026-03-15T10:00:00.000Z",
    healthScore: 85,
    totalIssues: 3,
    issuesByAudit: { meta: 2, links: 1 },
    audits: [
      {
        name: "meta",
        score: 75,
        issues: [
          { severity: "error", message: "Missing meta description" },
          { severity: "warning", message: "Missing og:image" },
        ],
      },
      {
        name: "links",
        score: 95,
        issues: [
          { severity: "error", message: "Broken link (404)", url: "/missing" },
        ],
      },
    ],
  };

  it("includes URL in report", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("https://example.com");
  });

  it("includes health score", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("85/100");
  });

  it("includes audit names and scores", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("meta: 75/100");
    expect(text).toContain("links: 95/100");
  });

  it("includes issue details with severity tags", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("[ERR]");
    expect(text).toContain("[WRN]");
    expect(text).toContain("Missing meta description");
  });

  it("includes issue URLs when present", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("/missing");
  });

  it("uses check/triangle/cross icons based on score", () => {
    const text = formatReportText(mockReport);
    expect(text).toContain("△ meta"); // 75 = triangle
    expect(text).toContain("✓ links"); // 95 = check
  });
});
