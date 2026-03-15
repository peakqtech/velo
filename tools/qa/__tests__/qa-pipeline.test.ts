import { describe, it, expect, vi } from "vitest";
import { QAPipeline, type AuditResult, type AuditModule, type QAReport } from "../src/pipeline";

function createMockAudit(name: string, score: number, issues: AuditResult["issues"] = []): AuditModule {
  return {
    name,
    run: vi.fn().mockResolvedValue({ name, score, issues }),
  };
}

describe("QAPipeline", () => {
  it("runs all registered audits and produces a report", async () => {
    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(createMockAudit("performance", 95));
    pipeline.register(createMockAudit("accessibility", 88));

    const report = await pipeline.run();

    expect(report.url).toBe("https://example.com");
    expect(report.audits).toHaveLength(2);
    expect(report.audits[0].name).toBe("performance");
    expect(report.audits[1].name).toBe("accessibility");
  });

  it("calculates overall health score as average of audit scores", async () => {
    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(createMockAudit("performance", 90));
    pipeline.register(createMockAudit("accessibility", 80));
    pipeline.register(createMockAudit("links", 100));

    const report = await pipeline.run();

    expect(report.healthScore).toBe(90); // (90+80+100)/3
  });

  it("collects issues from all audits", async () => {
    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(createMockAudit("a11y", 70, [
      { severity: "error", message: "Missing alt text", selector: "img.hero" },
      { severity: "warning", message: "Low contrast", selector: "p.muted" },
    ]));
    pipeline.register(createMockAudit("links", 90, [
      { severity: "error", message: "Broken link", url: "/missing" },
    ]));

    const report = await pipeline.run();

    expect(report.totalIssues).toBe(3);
    expect(report.issuesByAudit["a11y"]).toBe(2);
    expect(report.issuesByAudit["links"]).toBe(1);
  });

  it("includes timestamp in report", async () => {
    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(createMockAudit("perf", 100));

    const report = await pipeline.run();

    expect(report.timestamp).toBeDefined();
    expect(new Date(report.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("handles audit failures gracefully", async () => {
    const failingAudit: AuditModule = {
      name: "broken-audit",
      run: vi.fn().mockRejectedValue(new Error("Network timeout")),
    };

    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(failingAudit);
    pipeline.register(createMockAudit("healthy", 100));

    const report = await pipeline.run();

    expect(report.audits).toHaveLength(2);
    // Failed audit should have score 0 and error issue
    const failed = report.audits.find((a) => a.name === "broken-audit");
    expect(failed?.score).toBe(0);
    expect(failed?.issues[0].severity).toBe("error");
    expect(failed?.issues[0].message).toContain("Network timeout");
  });

  it("produces JSON-serializable report", async () => {
    const pipeline = new QAPipeline("https://example.com");
    pipeline.register(createMockAudit("perf", 95, [
      { severity: "warning", message: "Large image", url: "/hero.png" },
    ]));

    const report = await pipeline.run();
    const json = JSON.stringify(report);
    const parsed = JSON.parse(json) as QAReport;

    expect(parsed.url).toBe("https://example.com");
    expect(parsed.audits[0].score).toBe(95);
  });
});
