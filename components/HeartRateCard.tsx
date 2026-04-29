"use client";

import { Card, CardLabel } from "./Card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { build24hHeartRate } from "@/lib/data";

const data = build24hHeartRate();

export default function HeartRateCard() {
  const avg = Math.round(data.reduce((a, b) => a + b.bpm, 0) / data.length);
  const max = Math.max(...data.map((d) => d.bpm));
  const min = Math.min(...data.map((d) => d.bpm));

  return (
    <Card className="lg:col-span-7" pad="p-7">
      <CardLabel index="04" source="Apple Watch · Whoop · Garmin">
        Heart rate · last 24h
      </CardLabel>

      <div className="flex flex-wrap items-end gap-8 mb-4">
        <div>
          <div className="font-display text-5xl tabular leading-none">{avg}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-muted mt-2">
            avg bpm
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Mini label="Resting" value={`${min}`} hint="03:15" />
          <Mini label="Peak" value={`${max}`} hint="07:42 · run" />
          <Mini label="Variability" value={`${Math.round((max - min) / 2)}`} hint="amplitude" />
        </div>
        <div className="ml-auto flex flex-col gap-1.5 text-[10px] font-mono text-muted uppercase tracking-wider">
          <Legend color="#1e1b4b" label="Sleep" />
          <Legend color="#047857" label="Active" />
          <Legend color="#b91c1c" label="Workout" />
        </div>
      </div>

      <div className="h-52 -mx-2">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="hr-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b91c1c" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              ticks={["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[40, 140]}
              tick={{ fontSize: 10 }}
              width={28}
            />
            <ReferenceLine y={avg} stroke="#0a0a0b" strokeDasharray="3 3" strokeOpacity={0.3} />
            <Tooltip
              cursor={{ stroke: "#0a0a0b", strokeOpacity: 0.3 }}
              contentStyle={{
                background: "#0a0a0b",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 11,
                fontFamily: "var(--font-mono-fam)",
              }}
              formatter={(v) => [`${v} bpm`, "Heart rate"]}
            />
            <Area
              dataKey="bpm"
              stroke="#b91c1c"
              strokeWidth={1.6}
              fill="url(#hr-grad)"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-line mt-2 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
        <Window label="Sleep" range="22:30 → 06:45" hr="52 avg" tone="text-sleep" />
        <Window label="AM run" range="07:15 → 07:55" hr="118 avg" tone="text-heart" />
        <Window label="Focus block" range="09:00 → 12:00" hr="78 avg" tone="text-recover" />
        <Window label="PM strength" range="17:30 → 18:30" hr="96 avg" tone="text-heart" />
      </div>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}

function Mini({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">{label}</div>
      <div className="font-display text-2xl tabular leading-tight">{value}</div>
      <div className="text-[10px] font-mono text-muted">{hint}</div>
    </div>
  );
}

function Window({
  label,
  range,
  hr,
  tone,
}: {
  label: string;
  range: string;
  hr: string;
  tone: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className={`text-[10px] uppercase tracking-[0.2em] ${tone}`}>{label}</div>
      <div className="text-ink2">{range}</div>
      <div className="text-muted">{hr}</div>
    </div>
  );
}
