import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; pulse?: boolean }
> = {
  // Payment statuses
  PAID: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/15",
  },
  OVERDUE: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/15",
  },
  PENDING: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/15",
  },
  GRACE: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/15",
  },

  // Plan statuses
  BASIC: {
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/15",
  },
  PREMIUM: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/15",
  },
  ENTERPRISE: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/15",
  },
  CUSTOM: {
    bg: "bg-fuchsia-500/15",
    text: "text-fuchsia-400",
    border: "border-fuchsia-500/15",
  },

  // Campaign statuses
  DRAFT: {
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/15",
  },
  ACTIVE: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/15",
  },
  PAUSED: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/15",
  },
  COMPLETED: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/15",
  },

  // Content statuses
  PLANNED: {
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/15",
  },
  GENERATING: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/15",
    pulse: true,
  },
  FAILED: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/15",
  },
  IN_REVIEW: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/15",
  },
  APPROVED: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/15",
  },
  PUBLISHED: {
    bg: "bg-green-500/15",
    text: "text-green-400",
    border: "border-green-500/15",
  },
  REJECTED: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/15",
  },

  // Deploy statuses
  DEPLOYED: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/15",
  },
  BUILDING: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/15",
    pulse: true,
  },

  // Changes statuses
  IN_PROGRESS: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/15",
  },
  REVIEW: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/15",
  },
  DONE: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/15",
  },
  CANCELLED: {
    bg: "bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/15",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-zinc-500/15",
  text: "text-zinc-400",
  border: "border-zinc-500/15",
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
        "font-medium",
        className
      )}
    >
      {label}
    </Badge>
  );
}
