"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Opportunity {
  id: string;
  signal: string;
  keyword: string;
  title: string | null;
  score: number;
  channel: string;
  status: string;
  createdAt: string;
}

interface OpportunityBoardProps {
  opportunities: Opportunity[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "DISCOVERED", label: "Discovered", color: "bg-slate-500" },
  { key: "PLANNED", label: "Planned", color: "bg-blue-500" },
  { key: "GENERATING", label: "Generating", color: "bg-violet-500" },
  { key: "PUBLISHED", label: "Published", color: "bg-emerald-500" },
  { key: "SKIPPED", label: "Skipped", color: "bg-slate-400" },
] as const;

const SIGNAL_COLORS: Record<string, string> = {
  KEYWORD_GAP: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  COMPETITOR: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  AI_ANSWER: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
};

const SIGNALS = ["ALL", "KEYWORD_GAP", "COMPETITOR", "AI_ANSWER"] as const;
const CHANNELS = ["ALL", "BLOG", "GBP", "SOCIAL", "EMAIL"] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function OpportunityBoard({ opportunities }: OpportunityBoardProps) {
  const [signalFilter, setSignalFilter] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");

  const filtered = opportunities.filter((o) => {
    if (signalFilter !== "ALL" && o.signal !== signalFilter) return false;
    if (channelFilter !== "ALL" && o.channel !== channelFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Signal:</span>
          <div className="flex gap-1">
            {SIGNALS.map((s) => (
              <button
                key={s}
                onClick={() => setSignalFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  signalFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s === "ALL" ? "All" : s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Channel:</span>
          <div className="flex gap-1">
            {CHANNELS.map((c) => (
              <button
                key={c}
                onClick={() => setChannelFilter(c)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  channelFilter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c === "ALL" ? "All" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const items = filtered.filter((o) => o.status === col.key);
          return (
            <div key={col.key} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {items.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-center">
                    <p className="text-xs text-muted-foreground">No items</p>
                  </div>
                ) : (
                  items.map((opp) => (
                    <Card
                      key={opp.id}
                      className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow cursor-default"
                    >
                      <CardContent className="p-3 space-y-2">
                        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                          {opp.title ?? opp.keyword}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${
                              SIGNAL_COLORS[opp.signal] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {opp.signal.replace(/_/g, " ")}
                          </span>
                          <StatusBadge status={opp.channel} className="text-[10px] px-1.5 py-0" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{opp.keyword}</span>
                          <span className="text-xs font-semibold text-foreground">
                            {Math.round(opp.score)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
