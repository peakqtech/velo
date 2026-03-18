import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function Sparkline({
  data,
  className,
  color = "bg-blue-500",
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return (
    <div className={cn("flex items-end gap-0.5 h-8", className)}>
      {data.map((value, index) => {
        const heightPercent = ((value - min) / range) * 100;
        const minHeightPx = 8;
        const isLast = index === data.length - 1;

        return (
          <div
            key={index}
            className={cn(color, isLast ? "opacity-100" : "opacity-60")}
            style={{
              flex: "1",
              height: `max(${minHeightPx}px, ${heightPercent}%)`,
              minHeight: `${minHeightPx}px`,
              borderRadius: "2px 2px 0 0",
            }}
          />
        );
      })}
    </div>
  );
}
