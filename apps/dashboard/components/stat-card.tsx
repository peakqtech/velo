import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  detail,
  sparklineData,
  className,
}: StatCardProps) {
  const trendColor =
    trend === undefined
      ? ""
      : trend.value > 0
        ? "text-emerald-400"
        : trend.value < 0
          ? "text-red-400"
          : "text-muted-foreground";

  const TrendIcon =
    trend === undefined
      ? null
      : trend.value > 0
        ? TrendingUp
        : trend.value < 0
          ? TrendingDown
          : Minus;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground leading-tight">
              {value}
            </p>
            {trend !== undefined && TrendIcon && (
              <div className={cn("flex items-center gap-1 mt-1", trendColor)}>
                <TrendIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs font-medium">
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                  {trend.label && (
                    <span className="text-muted-foreground font-normal ml-1">
                      {trend.label}
                    </span>
                  )}
                </span>
              </div>
            )}
            {detail && (
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="shrink-0 w-20">
              <Sparkline data={sparklineData} color="bg-blue-500" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
