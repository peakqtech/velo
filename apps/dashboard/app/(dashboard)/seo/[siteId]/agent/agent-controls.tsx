"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AgentControlsProps {
  config: {
    id: string;
    siteId: string;
    tier: string;
    oversightMode: string;
    vetoWindowHours: number | null;
    channels: string[];
    cadence: unknown;
    competitors: string[];
    verticalKeywords: string[];
    geoEnabled: boolean;
    geoQueryPrompts: string[];
    aiModel: string;
    isActive: boolean;
  };
}

// ─── Toggle Switch ───────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? "bg-emerald-500" : "bg-muted-foreground/30"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}

// ─── Agent Controls ──────────────────────────────────────────────────────────

export function AgentControls({ config }: AgentControlsProps) {
  const [isActive, setIsActive] = useState(config.isActive);
  const [isPending, startTransition] = useTransition();

  function handleToggle(active: boolean) {
    setIsActive(active);
    startTransition(async () => {
      try {
        await fetch(`/api/sites/${config.siteId}/agent/toggle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: active }),
        });
      } catch {
        setIsActive(!active); // rollback
      }
    });
  }

  const oversightLabels: Record<string, string> = {
    AUTO_PUBLISH: "Auto-Publish",
    VETO_WINDOW: `Veto Window (${config.vetoWindowHours ?? 24}h)`,
    APPROVAL_REQUIRED: "Manual Approval",
  };

  const channelLabels: Record<string, string> = {
    BLOG: "Blog Posts",
    GBP: "Google Business",
    SOCIAL: "Social Media",
    EMAIL: "Email",
  };

  return (
    <div className="space-y-6">
      {/* Agent Toggle + Tier */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Agent Status</CardTitle>
            <Toggle checked={isActive} onChange={handleToggle} disabled={isPending} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusBadge status={isActive ? "ACTIVE" : "PAUSED"} />
            <span className="text-sm text-muted-foreground">
              Tier: <span className="font-medium text-foreground">{config.tier}</span>
            </span>
            <span className="text-sm text-muted-foreground">
              Model: <span className="font-medium text-foreground">{config.aiModel}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Oversight Mode */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Oversight Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(oversightLabels).map(([key, label]) => (
              <div
                key={key}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium border transition-colors ${
                  config.oversightMode === key
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-transparent text-muted-foreground"
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(channelLabels).map(([key, label]) => {
              const enabled = config.channels.includes(key);
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition-colors ${
                    enabled
                      ? "bg-emerald-500/8 border-emerald-500/20"
                      : "bg-muted/50 border-transparent"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      enabled ? "bg-emerald-500" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      enabled ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Seed Keywords */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Seed Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          {config.verticalKeywords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No seed keywords configured.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {config.verticalKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Competitor URLs</CardTitle>
        </CardHeader>
        <CardContent>
          {config.competitors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No competitors tracked.</p>
          ) : (
            <ul className="space-y-1.5">
              {config.competitors.map((url) => (
                <li key={url} className="text-sm text-muted-foreground truncate">
                  {url}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* GEO Query Prompts */}
      {config.geoEnabled && (
        <Card className="hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">GEO Query Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            {config.geoQueryPrompts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No GEO prompts configured.</p>
            ) : (
              <ul className="space-y-1.5">
                {config.geoQueryPrompts.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    &ldquo;{p}&rdquo;
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
