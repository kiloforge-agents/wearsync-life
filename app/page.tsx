import TopBar from "@/components/TopBar";
import HeroToday from "@/components/HeroToday";
import SleepCard from "@/components/SleepCard";
import HeartRateCard from "@/components/HeartRateCard";
import MovementCard from "@/components/MovementCard";
import CorrelationCard from "@/components/CorrelationCard";
import InsightsCard from "@/components/InsightsCard";
import DevicesCard from "@/components/DevicesCard";
import TrendsCard from "@/components/TrendsCard";
import PlanCard from "@/components/PlanCard";
import StressCard from "@/components/StressCard";
import AskBar from "@/components/AskBar";
import { buildSeries, buildInsights, devices } from "@/lib/data";
import { Activity, ArrowUpRight, FileText } from "lucide-react";

export default function Home() {
  const series = buildSeries(30);
  const today = series[series.length - 1];
  const yesterday = series[series.length - 2];
  const insights = buildInsights(series);

  return (
    <>
      <TopBar />

      {/* Masthead */}
      <section className="border-b border-line">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Issue 014 · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {devices.length} devices · {series.length} day window
          </div>
          <div className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            For: Eli Reyes · marathon block, week 3
          </div>
        </div>
      </section>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Headline strip */}
        <div className="grid grid-cols-12 gap-3 lg:gap-5 mb-10 items-end">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-3">
              The dashboard for your body — across every device.
            </p>
            <h1 className="font-display text-[clamp(48px,7vw,96px)] leading-[0.95] tracking-[-0.035em]">
              One signal,
              <br />
              <span className="italic">across every</span> wearable.
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pl-10">
            <p className="text-[15px] leading-relaxed text-ink2 max-w-[440px]">
              WearSyncLife is the calm layer over Apple Watch, Oura, Whoop, Garmin and Fitbit.
              We don't show you more numbers. We show you the{" "}
              <span className="bg-highlight/60 px-1">two or three</span> that
              actually changed today.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#today"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-full bg-ink text-paper"
              >
                Open today <ArrowUpRight size={13} />
              </a>
              <a
                href="#trends"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-full hairline bg-paper text-ink"
              >
                30-day trends
              </a>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div id="today" className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5">
          <HeroToday today={today} yesterday={yesterday} />
          <SleepCard today={today} series={series} />

          <HeartRateCard />
          <MovementCard today={today} />

          <CorrelationCard series={series} />

          <InsightsCard insights={insights} />
          <DevicesCard devices={devices} />

          <div id="trends" />
          <TrendsCard series={series} />

          <PlanCard />
          <StressCard today={today} series={series} />
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-5">
            <KPI big label="VO₂ max" value={`${today.vo2max}`} unit="ml/kg/min" sub="elite-tier · +0.6 / 30d" />
            <KPI big label="Resting HR" value={`${today.rhr}`} unit="bpm" sub={`${today.rhr < 60 ? "athletic" : "good"} · ↘ trending`} />
            <KPI big label="SpO₂" value={`${today.spo2}`} unit="%" sub="overnight average" />
          </div>

          <AskBar />
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 grid place-items-center rounded-md bg-ink text-paper">
                <Activity size={18} strokeWidth={2.4} />
              </div>
              <div className="text-[18px] font-semibold tracking-tight">
                WearSync<span className="font-display italic font-normal">Life</span>
              </div>
            </div>
            <p className="text-[14px] text-ink2 max-w-md leading-relaxed">
              Calm health data for people who already wear too many devices.
              No subscriptions for charts you already paid for. Privacy by default —
              your data stays on-device, syncs are end-to-end encrypted.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-3">
              Sources
            </div>
            <ul className="space-y-1.5 text-[13px] text-ink2">
              <li>Apple HealthKit</li>
              <li>Oura API v3</li>
              <li>Whoop OAuth 2</li>
              <li>Garmin Connect</li>
              <li>Fitbit Web API</li>
              <li>Withings, Dexcom, Polar</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-3">
              Practice
            </div>
            <ul className="space-y-1.5 text-[13px] text-ink2">
              <li>Privacy posture</li>
              <li>Methodology</li>
              <li>Changelog</li>
              <li>For clinicians</li>
              <li>Install as PWA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center gap-4 text-[11px] font-mono text-muted">
            <span>© WearSyncLife 2026</span>
            <span>·</span>
            <span>v1.4 · build {new Date().toISOString().slice(0, 10)}</span>
            <span className="ml-auto inline-flex items-center gap-1.5">
              <FileText size={12} /> open methodology
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

function KPI({
  label,
  value,
  unit,
  sub,
  big,
}: {
  label: string;
  value: string;
  unit?: string;
  sub: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-paper border border-line p-6 flex flex-col justify-between min-h-[160px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{label}</div>
      <div className="flex items-baseline gap-1.5 tabular">
        <span className={`font-display leading-none ${big ? "text-5xl" : "text-3xl"}`}>{value}</span>
        {unit ? <span className="text-[11px] text-muted font-mono">{unit}</span> : null}
      </div>
      <div className="text-[12px] text-muted">{sub}</div>
    </div>
  );
}
