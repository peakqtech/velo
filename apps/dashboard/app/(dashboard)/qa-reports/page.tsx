"use client";

import { useState, useCallback } from "react";

/* -------------------------------------------------------------------------- */
/*  Types (mirrors tools/qa/src/pipeline.ts)                                  */
/* -------------------------------------------------------------------------- */

interface AuditIssue {
  severity: "error" | "warning" | "info";
  message: string;
  selector?: string;
}

interface AuditResult {
  name: string;
  score: number;
  issues: AuditIssue[];
}

interface QAReport {
  url: string;
  timestamp: string;
  healthScore: number;
  totalIssues: number;
  issuesByAudit: Record<string, number>;
  audits: AuditResult[];
}

/* -------------------------------------------------------------------------- */
/*  Demo data                                                                 */
/* -------------------------------------------------------------------------- */

function makeReport(
  health: number,
  lighthouse: number,
  a11y: number,
  links: number,
  meta: number,
  daysAgo: number,
): QAReport {
  const ts = new Date(Date.now() - daysAgo * 86_400_000).toISOString();

  const audits: AuditResult[] = [
    {
      name: "Lighthouse",
      score: lighthouse,
      issues: lighthouse < 90
        ? [
            { severity: "warning", message: "Largest Contentful Paint is 3.2s (target < 2.5s)", selector: "body" },
            { severity: "info", message: "Serve images in next-gen formats (WebP/AVIF)", selector: "img.hero-bg" },
          ]
        : [{ severity: "info", message: "Consider lazy-loading offscreen images", selector: "img.gallery" }],
    },
    {
      name: "Accessibility",
      score: a11y,
      issues: a11y < 85
        ? [
            { severity: "error", message: "Missing alt text on hero image", selector: "img.hero-bg" },
            { severity: "warning", message: "Low contrast ratio on footer links (3.8:1, needs 4.5:1)", selector: "footer a" },
            { severity: "warning", message: "Form input missing associated label", selector: "input#email" },
          ]
        : [
            { severity: "warning", message: "Low contrast ratio on footer links (3.8:1, needs 4.5:1)", selector: "footer a" },
            { severity: "info", message: "Consider adding skip-to-content link", selector: "body" },
          ],
    },
    {
      name: "Links",
      score: links,
      issues: links < 92
        ? [
            { severity: "error", message: "Broken link: /about-us returns 404", selector: "a[href='/about-us']" },
            { severity: "warning", message: "Redirect chain detected on /shop link (3 hops)", selector: "a.shop-link" },
          ]
        : [{ severity: "info", message: "External link missing rel='noopener': https://twitter.com/velocity", selector: "a.social-tw" }],
    },
    {
      name: "Meta",
      score: meta,
      issues: meta < 75
        ? [
            { severity: "error", message: "Missing meta description on /products page" },
            { severity: "warning", message: "Title tag exceeds 60 characters on homepage" },
            { severity: "warning", message: "Open Graph image not set for /blog" },
            { severity: "info", message: "Consider adding structured data (JSON-LD)" },
          ]
        : [
            { severity: "warning", message: "Title tag exceeds 60 characters on homepage" },
            { severity: "info", message: "Consider adding structured data (JSON-LD)" },
          ],
    },
  ];

  const issuesByAudit: Record<string, number> = {};
  let totalIssues = 0;
  for (const a of audits) {
    issuesByAudit[a.name] = a.issues.length;
    totalIssues += a.issues.length;
  }

  return { url: "https://velocity-demo.velo.dev", timestamp: ts, healthScore: health, totalIssues, issuesByAudit, audits };
}

const INITIAL_REPORTS: QAReport[] = [
  makeReport(87, 92, 85, 95, 75, 0),
  makeReport(82, 88, 80, 90, 70, 7),
  makeReport(78, 85, 75, 88, 65, 14),
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function scoreColor(score: number) {
  if (score > 80) return "text-green-400";
  if (score > 50) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score > 80) return "bg-green-500";
  if (score > 50) return "bg-yellow-500";
  return "bg-red-500";
}

function severityBadge(severity: AuditIssue["severity"]) {
  const map = {
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return map[severity];
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function QAReportsPage() {
  const [reports, setReports] = useState<QAReport[]>(INITIAL_REPORTS);
  const [running, setRunning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  const latest = reports[0];

  const runAudit = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const prev = reports[0];
      const bump = (v: number) => Math.min(100, v + Math.floor(Math.random() * 4) + 1);
      const newReport = makeReport(
        bump(prev.healthScore),
        bump(prev.audits[0].score),
        bump(prev.audits[1].score),
        bump(prev.audits[2].score),
        bump(prev.audits[3].score),
        0,
      );
      setReports((r) => [newReport, ...r]);
      setRunning(false);
      setToast("Audit completed successfully");
      setTimeout(() => setToast(null), 3000);
    }, 2000);
  }, [reports]);

  /* ---- trend data (last 5) ---- */
  const trendReports = [...reports].reverse().slice(-5);

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg animate-in">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QA Reports</h1>
          <p className="text-zinc-500 mt-1">Automated quality monitoring for your sites.</p>
        </div>
        <button
          onClick={runAudit}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {running ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Running audit...
            </>
          ) : (
            <>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Run New Audit
            </>
          )}
        </button>
      </div>

      {/* Health Score Trend */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Health Score Trend</h2>
        <div className="flex items-end gap-3 h-32">
          {trendReports.map((r, i) => (
            <div key={r.timestamp + i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className={`text-xs font-medium ${scoreColor(r.healthScore)}`}>{r.healthScore}</span>
              <div className="w-full relative rounded-t-md overflow-hidden bg-zinc-800" style={{ height: "100%" }}>
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-500 ${scoreBg(r.healthScore)}`}
                  style={{ height: `${r.healthScore}%`, opacity: 0.8 }}
                />
              </div>
              <span className="text-[10px] text-zinc-600">{relativeTime(r.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Report */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Latest Report</h2>
          <span className="text-xs text-zinc-600">{relativeTime(latest.timestamp)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Overall Score */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <span className={`text-6xl font-bold tracking-tight ${scoreColor(latest.healthScore)}`}>
              {latest.healthScore}
            </span>
            <span className="text-xs text-zinc-500 mt-1">Overall Health</span>
            <span className="text-[10px] text-zinc-600 mt-0.5">{latest.totalIssues} issues found</span>
          </div>

          {/* Audit Breakdown */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {latest.audits.map((audit) => (
              <div key={audit.name} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">{audit.name}</span>
                  <AuditIcon name={audit.name} />
                </div>
                <span className={`text-2xl font-bold ${scoreColor(audit.score)}`}>{audit.score}</span>
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBg(audit.score)}`} style={{ width: `${audit.score}%`, opacity: 0.8 }} />
                  </div>
                </div>
                <span className="text-[10px] text-zinc-600 mt-1 block">
                  {audit.issues.length} issue{audit.issues.length !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="p-6 pb-0">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Issues</h2>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {latest.audits.map((audit) => (
            <div key={audit.name}>
              <button
                onClick={() => setExpandedAudit(expandedAudit === audit.name ? null : audit.name)}
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AuditIcon name={audit.name} />
                  <span className="text-sm font-medium text-zinc-200">{audit.name}</span>
                  <span className="text-xs text-zinc-600">({audit.issues.length} issue{audit.issues.length !== 1 ? "s" : ""})</span>
                </div>
                <svg
                  width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`text-zinc-500 transition-transform ${expandedAudit === audit.name ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {expandedAudit === audit.name && (
                <div className="px-6 pb-4 space-y-2">
                  {audit.issues.map((issue, j) => (
                    <div key={j} className="flex items-start gap-3 py-2 pl-4 border-l-2 border-zinc-800">
                      <span className={`shrink-0 text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${severityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-zinc-300">{issue.message}</p>
                        {issue.selector && (
                          <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{issue.selector}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report History */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Report History</h2>
        <div className="space-y-2">
          {reports.map((r, i) => (
            <div key={r.timestamp + i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${scoreColor(r.healthScore)}`}>{r.healthScore}</span>
                <div>
                  <p className="text-sm text-zinc-300">{r.url}</p>
                  <p className="text-[11px] text-zinc-600">{r.totalIssues} issues across {r.audits.length} audits</p>
                </div>
              </div>
              <span className="text-xs text-zinc-600">{relativeTime(r.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Audit icon helper                                                         */
/* -------------------------------------------------------------------------- */

function AuditIcon({ name }: { name: string }) {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "text-zinc-500" };
  switch (name) {
    case "Lighthouse":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "Accessibility":
      return <svg {...props}><circle cx="12" cy="4" r="2"/><path d="M12 6v6"/><path d="M8 22l4-10 4 10"/><path d="M6 12h12"/></svg>;
    case "Links":
      return <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "Meta":
      return <svg {...props}><path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><polyline points="14 2 14 8 20 8"/><line x1="2" y1="13" x2="10" y2="13"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}
