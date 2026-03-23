import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricRowProps {
  children: ReactNode;
  className?: string;
}

export function MetricRow({ children, className }: MetricRowProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
}
