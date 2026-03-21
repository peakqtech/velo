import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot?: string; pulse?: boolean }
> = {
  // Payment statuses
  PAID: {
    bg: "bg-emerald-500/12 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  OVERDUE: {
    bg: "bg-red-500/12 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  PENDING: {
    bg: "bg-amber-500/12 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  GRACE: {
    bg: "bg-orange-500/12 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
  },

  // Plan statuses
  BASIC: {
    bg: "bg-slate-500/12 dark:bg-slate-500/15",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  },
  PREMIUM: {
    bg: "bg-blue-500/12 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  ENTERPRISE: {
    bg: "bg-violet-500/12 dark:bg-violet-500/15",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/20",
  },
  CUSTOM: {
    bg: "bg-fuchsia-500/12 dark:bg-fuchsia-500/15",
    text: "text-fuchsia-700 dark:text-fuchsia-400",
    border: "border-fuchsia-500/20",
  },

  // Campaign statuses
  DRAFT: {
    bg: "bg-slate-500/12 dark:bg-slate-500/15",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  },
  ACTIVE: {
    bg: "bg-emerald-500/12 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  PAUSED: {
    bg: "bg-amber-500/12 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  COMPLETED: {
    bg: "bg-blue-500/12 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
  },

  // Content statuses
  PLANNED: {
    bg: "bg-slate-500/12 dark:bg-slate-500/15",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  },
  GENERATING: {
    bg: "bg-blue-500/12 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    pulse: true,
  },
  FAILED: {
    bg: "bg-red-500/12 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  IN_REVIEW: {
    bg: "bg-amber-500/12 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  APPROVED: {
    bg: "bg-emerald-500/12 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  PUBLISHED: {
    bg: "bg-green-500/12 dark:bg-green-500/15",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-500/20",
  },
  REJECTED: {
    bg: "bg-red-500/12 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
  },

  // Deploy statuses
  DEPLOYED: {
    bg: "bg-emerald-500/12 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  BUILDING: {
    bg: "bg-blue-500/12 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    pulse: true,
  },

  // Changes statuses
  IN_PROGRESS: {
    bg: "bg-blue-500/12 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  REVIEW: {
    bg: "bg-amber-500/12 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
  DONE: {
    bg: "bg-emerald-500/12 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  CANCELLED: {
    bg: "bg-slate-500/12 dark:bg-slate-500/15",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-slate-500/12 dark:bg-slate-500/15",
  text: "text-slate-700 dark:text-slate-400",
  border: "border-slate-500/20",
  pulse: false,
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase().replace(/[\s-]/g, "_") ?? "";
  const style = STATUS_STYLES[normalizedStatus] ?? DEFAULT_STYLE;

  const label = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge
      variant="outline"
      className={cn(
        style.bg,
        style.text,
        style.border,
        style.pulse ? "animate-pulse" : "",
        "font-semibold gap-1.5",
        className
      )}
    >
      {style.dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", style.dot)} />
      )}
      {label}
    </Badge>
  );
}
