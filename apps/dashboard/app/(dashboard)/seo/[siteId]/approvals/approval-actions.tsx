"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PendingOpportunity {
  id: string;
  keyword: string;
  title: string | null;
  signal: string;
  score: number;
  channel: string;
  status: string;
  approvalStatus: string | null;
  vetoDeadline: string | null;
  createdAt: string;
}

interface ApprovalActionsProps {
  siteId: string;
  opportunities: PendingOpportunity[];
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────

function VetoCountdown({ deadline }: { deadline: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const hours = Math.floor(diff / 3_600_000);
      const mins = Math.floor((diff % 3_600_000) / 60_000);
      const secs = Math.floor((diff % 60_000) / 1_000);
      setRemaining(`${hours}h ${mins}m ${secs}s`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isUrgent =
    new Date(deadline).getTime() - Date.now() < 2 * 3_600_000; // < 2 hours

  return (
    <span
      className={`text-xs font-mono font-medium ${
        isUrgent ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
      }`}
    >
      {remaining}
    </span>
  );
}

// ─── Approval Actions ────────────────────────────────────────────────────────

export function ApprovalActions({ siteId, opportunities }: ApprovalActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAction(oppId: string, action: "APPROVED" | "REJECTED" | "VETOED") {
    startTransition(async () => {
      await fetch(`/api/sites/${siteId}/approvals/${oppId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: action }),
      });
      router.refresh();
    });
  }

  const SIGNAL_COLORS: Record<string, string> = {
    KEYWORD_GAP: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    COMPETITOR: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    AI_ANSWER: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  };

  return (
    <div className="space-y-3">
      {opportunities.map((opp) => (
        <Card
          key={opp.id}
          className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {opp.title ?? opp.keyword}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${
                      SIGNAL_COLORS[opp.signal] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {opp.signal.replace(/_/g, " ")}
                  </span>
                  <StatusBadge status={opp.channel} className="text-[10px] px-1.5 py-0" />
                  <span className="text-xs text-muted-foreground">
                    Score: <span className="font-medium text-foreground">{Math.round(opp.score)}</span>
                  </span>
                  {opp.vetoDeadline && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      Veto: <VetoCountdown deadline={opp.vetoDeadline} />
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAction(opp.id, "APPROVED")}
                  disabled={isPending}
                  className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(opp.id, "REJECTED")}
                  disabled={isPending}
                  className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(opp.id, "VETOED")}
                  disabled={isPending}
                  className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                >
                  Veto
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
