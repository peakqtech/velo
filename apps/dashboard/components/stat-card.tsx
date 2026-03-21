import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  detail?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  color?: "blue" | "emerald" | "violet" | "amber" | "rose" | "cyan";
  className?: string;
}

const colorMap = {
  blue: {
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-300",
    trendDown: "text-rose-300",
  },
  emerald: {
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-200",
    trendDown: "text-rose-300",
  },
  violet: {
    gradient: "bg-gradient-to-br from-violet-500 to-violet-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-300",
    trendDown: "text-rose-300",
  },
  amber: {
    gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-300",
    trendDown: "text-rose-300",
  },
  rose: {
    gradient: "bg-gradient-to-br from-rose-500 to-rose-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-300",
    trendDown: "text-rose-200",
  },
  cyan: {
    gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    sparkline: "bg-white/30",
    trendUp: "text-emerald-300",
    trendDown: "text-rose-300",
  },
};

export function StatCard({
  label,
  value,
  trend,
  detail,
  sparklineData,
  icon,
  color = "blue",
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  const trendColor =
    trend === undefined
      ? ""
      : trend.value > 0
        ? colors.trendUp
        : trend.value < 0
          ? colors.trendDown
          : "text-white/60";

  const TrendIcon =
    trend === undefined
      ? null
      : trend.value > 0
        ? TrendingUp
        : trend.value < 0
          ? TrendingDown
          : Minus;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5",
        colors.gradient,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            {icon && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white shrink-0">
                {icon}
              </div>
            )}
            <p className="text-xs font-semibold text-white/80 uppercase tracking-wider truncate">
              {label}
            </p>
          </div>

          <p className="text-2xl font-bold text-white leading-tight tracking-tight">
            {value}
          </p>

          {trend !== undefined && TrendIcon && (
            <div className={cn("flex items-center gap-1 mt-1.5", trendColor)}>
              <TrendIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs font-semibold">
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
                {trend.label && (
                  <span className="text-white/50 font-normal ml-1">
                    {trend.label}
                  </span>
                )}
              </span>
            </div>
          )}
          {detail && (
            <p className="mt-1.5 text-xs text-white/60">{detail}</p>
          )}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="shrink-0 w-20">
            <Sparkline data={sparklineData} color={colors.sparkline} />
          </div>
        )}
      </div>
    </div>
  );
}
