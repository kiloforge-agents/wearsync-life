import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Card({
  children,
  className,
  pad = "p-6",
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  pad?: string;
  tone?: "paper" | "ink" | "raw";
}) {
  return (
    <section
      className={cn(
        "relative rounded-2xl border overflow-hidden",
        tone === "paper" && "bg-paper border-line",
        tone === "ink" && "bg-ink text-paper border-ink",
        tone === "raw" && "bg-background border-line",
        pad,
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardLabel({
  children,
  index,
  source,
}: {
  children: ReactNode;
  index?: string;
  source?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[10px] uppercase font-mono tracking-[0.22em] text-muted mb-3">
      {index ? <span className="tabular">{index}</span> : null}
      <span className="flex-1 truncate">{children}</span>
      {source ? <span className="opacity-70 normal-case tracking-wider">{source}</span> : null}
    </div>
  );
}

export function MetricLine({
  value,
  unit,
  caption,
  trend,
  trendPositive = true,
  big = false,
}: {
  value: string | number;
  unit?: string;
  caption?: string;
  trend?: string;
  trendPositive?: boolean;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex items-baseline gap-1.5 tabular", big ? "" : "")}>
        <span className={cn("font-display leading-none", big ? "text-6xl md:text-7xl" : "text-4xl")}>
          {value}
        </span>
        {unit ? <span className="text-muted text-sm">{unit}</span> : null}
      </div>
      {(caption || trend) && (
        <div className="flex items-center gap-2 text-[12px] text-muted">
          {trend ? (
            <span
              className={cn(
                "font-mono px-1.5 py-0.5 rounded text-[10px]",
                trendPositive ? "bg-recover/10 text-recover" : "bg-heart/10 text-heart",
              )}
            >
              {trend}
            </span>
          ) : null}
          {caption}
        </div>
      )}
    </div>
  );
}
