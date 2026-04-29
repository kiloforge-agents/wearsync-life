"use client";

import { DayMetric } from "@/lib/data";
import { Card, CardLabel } from "./Card";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { fmtMin } from "@/lib/utils";
import { Moon } from "lucide-react";

export default function SleepCard({ today, series }: { today: DayMetric; series: DayMetric[] }) {
  const stages = [
    { stage: "Awake", min: today.awakeMinutes, color: "#d97706" },
    { stage: "Light", min: today.lightMinutes, color: "#7c93e9" },
    { stage: "REM", min: today.remMinutes, color: "#4f46e5" },
    { stage: "Deep", min: today.deepMinutes, color: "#1e1b4b" },
  ];
  const total = today.awakeMinutes + today.lightMinutes + today.remMinutes + today.deepMinutes;
  const last7 = series.slice(-7);

  return (
    <Card className="lg:col-span-4 flex flex-col gap-5" pad="p-7">
      <CardLabel index="03" source="Oura · Apple Watch">
        Sleep architecture
      </CardLabel>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-5xl tabular leading-none">
            {today.sleepHours.toFixed(1)}
            <span className="text-2xl text-muted ml-1">h</span>
          </div>
          <div className="text-[12px] text-muted mt-2 flex gap-2 items-center">
            <span className="inline-flex items-center gap-1">
              <Moon size={11} /> {today.sleepScore} score
            </span>
            <span>·</span>
            <span>{today.sleepEfficiency}% efficiency</span>
          </div>
        </div>
        <div className="text-right text-[11px] text-muted font-mono">
          <div>23:14 → 06:42</div>
          <div className="mt-1">22 awakenings</div>
        </div>
      </div>

      {/* stage bar */}
      <div>
        <div className="h-3 w-full rounded-full overflow-hidden flex hairline">
          {stages.map((s) => (
            <div
              key={s.stage}
              style={{
                width: `${(s.min / total) * 100}%`,
                background: s.color,
              }}
              title={`${s.stage} ${fmtMin(s.min)}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {stages.map((s) => (
            <div key={s.stage} className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                {s.stage}
              </div>
              <div className="font-display text-lg tabular leading-tight">{fmtMin(s.min)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-muted mb-2">
          <span>Last 7 nights</span>
          <span>hours</span>
        </div>
        <div className="h-20">
          <ResponsiveContainer>
            <BarChart data={last7} barSize={20} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide domain={[0, 10]} />
              <Bar dataKey="sleepHours" radius={[4, 4, 0, 0]}>
                {last7.map((d, i) => (
                  <Cell key={i} fill={i === last7.length - 1 ? "#1e1b4b" : "#cbcfe7"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
