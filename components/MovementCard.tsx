"use client";

import { DayMetric } from "@/lib/data";
import { Card, CardLabel } from "./Card";
import { Footprints, Flame, Clock, ArrowUpRight } from "lucide-react";

function Ring({
  value,
  goal,
  color,
  size = 132,
  thickness = 11,
}: {
  value: number;
  goal: number;
  color: string;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(value / goal, 1);
  const offset = c * (1 - pct);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line)" strokeWidth={thickness} fill="none" />
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

export default function MovementCard({ today }: { today: DayMetric }) {
  const stepsGoal = 10000;
  const calsGoal = 700;
  const minsGoal = 60;

  const stepsPct = Math.round((today.steps / stepsGoal) * 100);
  const calsPct = Math.round((today.caloriesActive / calsGoal) * 100);
  const minsPct = Math.round((today.activeMinutes / minsGoal) * 100);

  return (
    <Card className="lg:col-span-5 flex flex-col gap-5" pad="p-7">
      <CardLabel index="05" source="Apple Watch · Whoop">
        Movement
      </CardLabel>

      <div className="flex items-center gap-7">
        <div className="relative shrink-0">
          <Ring value={today.steps} goal={stepsGoal} color="var(--color-fit)" size={148} thickness={11} />
          <div className="absolute inset-3">
            <Ring value={today.caloriesActive} goal={calsGoal} color="var(--color-heart)" size={122} thickness={11} />
          </div>
          <div className="absolute inset-7">
            <Ring value={today.activeMinutes} goal={minsGoal} color="var(--color-recover)" size={94} thickness={11} />
          </div>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-display text-2xl tabular leading-none">{stepsPct}%</div>
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted mt-1">
                of day
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid gap-3">
          <Row
            icon={<Footprints size={14} />}
            color="var(--color-fit)"
            label="Steps"
            value={today.steps.toLocaleString()}
            goal={`${stepsGoal.toLocaleString()} goal`}
            pct={stepsPct}
          />
          <Row
            icon={<Flame size={14} />}
            color="var(--color-heart)"
            label="Active kcal"
            value={today.caloriesActive.toLocaleString()}
            goal={`${calsGoal} goal`}
            pct={calsPct}
          />
          <Row
            icon={<Clock size={14} />}
            color="var(--color-recover)"
            label="Active min"
            value={`${today.activeMinutes}`}
            goal={`${minsGoal} goal`}
            pct={minsPct}
          />
        </div>
      </div>

      <div className="border-t border-line pt-4 grid grid-cols-3 gap-2 text-center">
        <Tile k="Strain" v={today.strain.toFixed(1)} sub="Whoop" />
        <Tile k="VO₂ max" v={`${today.vo2max}`} sub="Garmin" />
        <Tile k="Body battery" v={`${today.bodyBatteryEnd}`} sub={`from ${today.bodyBatteryStart}`} />
      </div>

      <a
        href="#trends"
        className="flex items-center justify-between text-[12px] text-ink2 hover:text-ink border-t border-line pt-3"
      >
        <span>See weekly load distribution</span>
        <ArrowUpRight size={14} />
      </a>
    </Card>
  );
}

function Row({
  icon,
  color,
  label,
  value,
  goal,
  pct,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  goal: string;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider" style={{ color }}>
          {icon}
          {label}
        </div>
        <div className="text-[10px] font-mono text-muted">{goal}</div>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="font-display text-2xl tabular leading-none">{value}</span>
        <span className="text-[11px] text-muted font-mono">{pct}%</span>
      </div>
      <div className="h-1 mt-2 rounded-full bg-line overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function Tile({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="rounded-lg bg-background p-3 hairline">
      <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted">{k}</div>
      <div className="font-display text-xl tabular mt-1">{v}</div>
      <div className="text-[10px] font-mono text-muted mt-0.5">{sub}</div>
    </div>
  );
}
