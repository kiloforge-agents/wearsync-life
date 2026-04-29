"use client";

import { DayMetric } from "@/lib/data";
import { ArrowUpRight, Moon, Activity, Heart, Wind, Sparkles } from "lucide-react";
import { Card } from "./Card";

function ProgressArc({
  value,
  label,
  unit,
  color,
  size = 220,
  thickness = 14,
}: {
  value: number; // 0-100
  label: string;
  unit?: string;
  color: string;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--line)"
        strokeWidth={thickness}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        fill="none"
      />
    </svg>
  );
}

export default function HeroToday({ today, yesterday }: { today: DayMetric; yesterday: DayMetric }) {
  const score = Math.round(
    (today.recovery * 0.5 + today.sleepScore * 0.3 + (100 - today.stress) * 0.2),
  );
  const yScore = Math.round(
    (yesterday.recovery * 0.5 + yesterday.sleepScore * 0.3 + (100 - yesterday.stress) * 0.2),
  );
  const delta = score - yScore;

  const dateLabel = new Date(today.date + "T00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card tone="ink" pad="p-0" className="lg:col-span-8 grid grid-cols-1 md:grid-cols-[1.05fr_1fr]">
      {/* LEFT — narrative */}
      <div className="p-8 lg:p-10 flex flex-col justify-between gap-8 relative">
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-paper/60">
          <span className="h-1.5 w-1.5 rounded-full bg-recover pulse-soft" />
          <span>Live · {dateLabel}</span>
          <span className="ml-auto">№ 001</span>
        </div>

        <div>
          <h1 className="font-display text-[44px] md:text-[58px] leading-[1.02] tracking-[-0.02em]">
            You slept{" "}
            <span className="italic underline decoration-highlight decoration-[6px] underline-offset-[6px]">
              well enough
            </span>{" "}
            to push today.
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-paper/70">
            Recovery is up {Math.max(0, today.recovery - yesterday.recovery)} pts vs. yesterday on a quieter night —
            efficiency held at {today.sleepEfficiency}% across {today.sleepHours.toFixed(1)} hours.
            HRV climbed back to {today.hrv} ms. A moderate effort window is open until early afternoon.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
              Composite wellness
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display text-7xl tabular leading-none">{score}</span>
              <span className="text-paper/60 text-sm">/100</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`font-mono text-[11px] px-2 py-1 rounded-md ${
                delta >= 0 ? "bg-recover/20 text-recover" : "bg-heart/20 text-heart"
              }`}
            >
              {delta >= 0 ? "+" : ""}
              {delta} d/d
            </span>
            <span className="text-[11px] text-paper/50">
              7-day avg: {Math.round((today.recovery + yesterday.recovery) / 2 + 4)}
            </span>
          </div>
          <button className="ml-auto flex items-center gap-1.5 text-[12px] text-paper/80 hover:text-paper">
            <Sparkles size={13} className="text-highlight" />
            <span>Why this score</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* RIGHT — visual */}
      <div className="relative bg-[#1c1c20] p-8 lg:p-10 grid grid-rows-[auto_1fr_auto] gap-6 border-l border-paper/10">
        <div className="flex justify-between items-start text-[10px] font-mono uppercase tracking-[0.22em] text-paper/50">
          <span>Composite</span>
          <span>recovery · sleep · stress</span>
        </div>

        <div className="relative grid place-items-center">
          <div className="relative">
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-6xl leading-none tabular">{score}</div>
                <div className="font-mono text-[10px] mt-2 uppercase tracking-[0.2em] text-paper/50">
                  GO MODERATE
                </div>
              </div>
            </div>
            <div className="grid place-items-center">
              <ProgressArc value={today.recovery} color="var(--color-recover)" label="" size={260} thickness={10} />
            </div>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="rotate-0">
                <ProgressArc value={today.sleepScore} color="var(--color-sleep)" label="" size={224} thickness={10} />
              </div>
            </div>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="rotate-0">
                <ProgressArc value={100 - today.stress} color="var(--color-fit)" label="" size={188} thickness={10} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-[11px] font-mono">
          <Stat icon={<Heart size={12} />} color="var(--color-recover)" label="Recovery" value={`${today.recovery}`} />
          <Stat icon={<Moon size={12} />} color="var(--color-sleep)" label="Sleep" value={`${today.sleepScore}`} />
          <Stat icon={<Wind size={12} />} color="var(--color-fit)" label="Calm" value={`${100 - today.stress}`} />
        </div>
      </div>
    </Card>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-2.5 rounded-md bg-paper/5">
      <div className="flex items-center gap-1.5 text-paper/60 uppercase tracking-[0.18em] text-[9px]">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="font-display text-2xl tabular text-paper">{value}</div>
    </div>
  );
}
