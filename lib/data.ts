// Deterministic synthetic data for WearSyncLife.
// Modeled on real Oura/Whoop/Apple Health response shapes — no PII, no API needed.

export type DayMetric = {
  date: string;            // ISO yyyy-mm-dd
  label: string;           // Mon / Tue ...
  sleepScore: number;      // 0-100
  sleepHours: number;      // 4.0–9.5
  remMinutes: number;
  deepMinutes: number;
  lightMinutes: number;
  awakeMinutes: number;
  sleepEfficiency: number; // 0-100
  hrv: number;             // ms
  rhr: number;             // bpm
  steps: number;
  activeMinutes: number;
  caloriesActive: number;
  vo2max: number;
  strain: number;          // 0-21 (Whoop-style)
  recovery: number;        // 0-100
  stress: number;          // 0-100 (lower better)
  mindfulMinutes: number;
  bodyBatteryStart: number;
  bodyBatteryEnd: number;
  spo2: number;            // %
  bodyTempDelta: number;   // °C from baseline
};

// pseudo-random but deterministic
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function buildSeries(days = 30): DayMetric[] {
  const rand = mulberry32(424242);
  const out: DayMetric[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dow = d.getUTCDay(); // 0 sun

    // create a sleep "phase" with a couple of bad nights to make correlations real
    const hardNight = i === 5 || i === 12 || i === 21;
    const recoveryDay = i === 6 || i === 13 || i === 22;

    const noise = () => (rand() - 0.5) * 2;

    const sleepHours = clamp(
      (dow === 5 || dow === 6 ? 7.6 : 7.1) +
        noise() * 0.6 +
        (hardNight ? -1.8 : 0),
      4.4,
      9.4,
    );
    const sleepEfficiency = clamp(
      88 + noise() * 4 - (hardNight ? 9 : 0),
      72,
      97,
    );
    const sleepScore = Math.round(
      clamp(
        sleepHours * 8 + sleepEfficiency * 0.4 + noise() * 4 - (hardNight ? 8 : 0),
        38,
        96,
      ),
    );
    const totalMin = Math.round(sleepHours * 60);
    const remMinutes = Math.round(totalMin * (0.21 + noise() * 0.02));
    const deepMinutes = Math.round(totalMin * (0.18 + noise() * 0.02));
    const awakeMinutes = Math.round(totalMin * (0.05 + (hardNight ? 0.04 : 0) + noise() * 0.01));
    const lightMinutes = Math.max(totalMin - remMinutes - deepMinutes - awakeMinutes, 0);

    const hrv = Math.round(
      clamp(
        58 + noise() * 7 + (hardNight ? -14 : 0) + (recoveryDay ? 8 : 0),
        28,
        92,
      ),
    );
    const rhr = Math.round(
      clamp(
        56 + noise() * 3 + (hardNight ? 6 : 0) - (recoveryDay ? 2 : 0),
        47,
        72,
      ),
    );
    const recovery = Math.round(
      clamp(
        sleepScore * 0.5 + hrv * 0.6 - rhr * 0.3 + noise() * 4,
        18,
        99,
      ),
    );
    const strain = +clamp(
      (recoveryDay ? 6 : 12) + noise() * 3 + (dow === 6 ? -3 : 0),
      3,
      19.5,
    ).toFixed(1);
    const stress = Math.round(
      clamp(40 + noise() * 8 + (hardNight ? 22 : 0) - recovery * 0.18, 8, 88),
    );
    const steps = Math.round(
      clamp(
        8500 + noise() * 1800 + strain * 400 - (hardNight ? 1500 : 0),
        3200,
        17800,
      ),
    );
    const activeMinutes = Math.round(clamp(strain * 4 + noise() * 6, 6, 110));
    const caloriesActive = Math.round(steps * 0.045 + activeMinutes * 6);
    const vo2max = +clamp(48 + noise() * 0.6 + i * 0.02, 44, 53).toFixed(1);
    const mindfulMinutes = Math.round(clamp(8 + noise() * 6 + (recoveryDay ? 5 : 0), 0, 30));
    const bodyBatteryStart = Math.round(clamp(recovery + noise() * 4, 10, 100));
    const bodyBatteryEnd = Math.round(clamp(bodyBatteryStart - strain * 4 + noise() * 6, 5, 99));
    const spo2 = +clamp(96.6 + noise() * 0.6, 94.2, 99).toFixed(1);
    const bodyTempDelta = +clamp(noise() * 0.25 + (hardNight ? 0.4 : 0), -0.6, 0.7).toFixed(2);

    out.push({
      date: d.toISOString().slice(0, 10),
      label: labels[(d.getUTCDay() + 6) % 7],
      sleepScore,
      sleepHours: +sleepHours.toFixed(2),
      remMinutes,
      deepMinutes,
      lightMinutes,
      awakeMinutes,
      sleepEfficiency: +sleepEfficiency.toFixed(1),
      hrv,
      rhr,
      steps,
      activeMinutes,
      caloriesActive,
      vo2max,
      strain,
      recovery,
      stress,
      mindfulMinutes,
      bodyBatteryStart,
      bodyBatteryEnd,
      spo2,
      bodyTempDelta,
    });
  }
  return out;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// 24-hour heart rate trace
export function build24hHeartRate(rng = mulberry32(7)): { t: string; bpm: number; phase: string }[] {
  const out: { t: string; bpm: number; phase: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const minute = h * 60 + m;
      let base = 60;
      let phase = "rest";
      if (h >= 0 && h < 6) {
        base = 52;
        phase = "sleep";
      } else if (h >= 6 && h < 7) {
        base = 64;
        phase = "wake";
      } else if (h === 7 || h === 8) {
        base = 118 - Math.abs(7.5 * 60 - minute) * 0.04;
        phase = "workout";
      } else if (h >= 9 && h < 12) {
        base = 78;
        phase = "active";
      } else if (h === 12) {
        base = 88;
        phase = "active";
      } else if (h >= 13 && h < 17) {
        base = 74;
        phase = "active";
      } else if (h >= 17 && h < 19) {
        base = 96 - Math.abs(18 * 60 - minute) * 0.03;
        phase = "workout";
      } else if (h >= 19 && h < 22) {
        base = 72;
        phase = "active";
      } else {
        base = 62;
        phase = "wind-down";
      }
      const bpm = Math.max(44, Math.round(base + (rng() - 0.5) * 8));
      out.push({
        t: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        bpm,
        phase,
      });
    }
  }
  return out;
}

// Pearson correlation for the insights engine
export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export type Insight = {
  id: string;
  kind: "correlation" | "anomaly" | "trend" | "habit";
  title: string;
  body: string;
  metric?: string;
  delta?: string;
  source: string[]; // device sources
  confidence: number; // 0-1
};

export function buildInsights(series: DayMetric[]): Insight[] {
  const last14 = series.slice(-14);
  const sleepHrs = last14.map((d) => d.sleepHours);
  const recovery = last14.map((d) => d.recovery);
  const strain = last14.map((d) => d.strain);
  const steps = last14.map((d) => d.steps);
  const stress = last14.map((d) => d.stress);
  const hrv = last14.map((d) => d.hrv);
  const mindful = last14.map((d) => d.mindfulMinutes);

  const corrSleepRecovery = pearson(sleepHrs, recovery);
  const corrStrainSleep = pearson(strain.slice(0, -1), sleepHrs.slice(1)); // strain today → sleep tomorrow
  const corrMindfulStress = pearson(mindful, stress);
  const corrStepsHrv = pearson(steps, hrv);

  // running avg deltas
  const avgSleepThis = avg(sleepHrs.slice(-7));
  const avgSleepLast = avg(sleepHrs.slice(0, 7));
  const sleepDelta = avgSleepThis - avgSleepLast;

  return [
    {
      id: "i1",
      kind: "correlation",
      title:
        corrSleepRecovery > 0
          ? "Each extra hour of sleep is lifting tomorrow's recovery."
          : "Recovery is decoupling from sleep duration this week.",
      body:
        corrSleepRecovery > 0.4
          ? `Across the last 14 days, sleep duration explains ${(corrSleepRecovery ** 2 * 100).toFixed(0)}% of the variance in your morning recovery score. You hit ${avgSleepThis.toFixed(1)}h on average — protecting that floor seems to be the highest-leverage habit you have right now.`
          : `Sleep hours and recovery only weakly track this fortnight (r=${corrSleepRecovery.toFixed(2)}). That usually points to fragmentation — try comparing wake-ups against caffeine cut-off and last-meal timing for the next 5 nights.`,
      metric: `r = ${corrSleepRecovery.toFixed(2)}`,
      source: ["Oura", "Whoop"],
      confidence: clamp(Math.abs(corrSleepRecovery), 0.3, 0.95),
    },
    {
      id: "i2",
      kind: "trend",
      title:
        sleepDelta > 0
          ? `Sleep is up ${(sleepDelta * 60).toFixed(0)} min vs. last week.`
          : `Sleep is down ${Math.abs(sleepDelta * 60).toFixed(0)} min vs. last week.`,
      body:
        sleepDelta > 0
          ? "Bedtime drifted 22 minutes earlier on weekdays. Resting HR dropped 1.4 bpm in lockstep. Worth keeping the new lights-out anchor for another week before drawing a conclusion."
          : "Late screens on Tue & Wed pushed sleep onset past 12:30. Body-temperature delta climbed +0.4°C the same nights. Try a dim-only mode after 22:30.",
      delta: `${sleepDelta > 0 ? "+" : ""}${(sleepDelta * 60).toFixed(0)}m`,
      source: ["Apple Watch", "Oura"],
      confidence: 0.78,
    },
    {
      id: "i3",
      kind: "habit",
      title:
        corrMindfulStress < -0.2
          ? "Your mindful minutes are noticeably lowering daytime stress."
          : "Mindfulness sessions aren't yet moving stress meaningfully.",
      body:
        corrMindfulStress < -0.2
          ? `Days with ≥10 minutes of mindfulness landed an average ${Math.round(
              avg(stress.filter((_, i) => mindful[i] >= 10)) -
                avg(stress.filter((_, i) => mindful[i] < 10)),
            )} pts lower on Garmin's stress index. Stack the habit pre-coffee for a tighter effect window.`
          : "Sessions are short and end-of-day. Try moving them to the 8–10 minute window after waking — that's where Whoop typically captures the biggest HRV bump.",
      metric: `r = ${corrMindfulStress.toFixed(2)}`,
      source: ["Garmin", "Headspace"],
      confidence: clamp(Math.abs(corrMindfulStress), 0.25, 0.9),
    },
    {
      id: "i4",
      kind: "correlation",
      title: "High-strain days are pushing tomorrow night's deep sleep.",
      body: `Strain on day n predicts sleep duration on day n+1 with r=${corrStrainSleep.toFixed(
        2,
      )}. Your two longest deep-sleep nights this fortnight followed Z2 sessions, not the interval days — useful when planning Sunday volume.`,
      metric: `r = ${corrStrainSleep.toFixed(2)}`,
      source: ["Whoop", "Strava"],
      confidence: clamp(Math.abs(corrStrainSleep), 0.3, 0.9),
    },
    {
      id: "i5",
      kind: "anomaly",
      title: "Body temperature ran +0.4°C above baseline on Tuesday.",
      body: "Paired with elevated RHR (+5 bpm) and a HRV drop. No symptoms logged. Oura flagged a minor strain signal. If it persists into a third night, dial back load by ~30%.",
      source: ["Oura"],
      confidence: 0.65,
    },
    {
      id: "i6",
      kind: "trend",
      title: "VO₂ max is trending up — quietly.",
      body: `Garmin estimates a 0.6 ml/kg/min lift over 30 days (now ${last14[last14.length - 1].vo2max}). That's coming from sustained zone-2 work, not from the sprint sessions. Worth biasing volume.`,
      metric: `+0.6 ml/kg/min`,
      source: ["Garmin", "Apple Watch"],
      confidence: 0.7,
    },
    {
      id: "i7",
      kind: "habit",
      title:
        corrStepsHrv > 0.2
          ? "Walking days are showing up in HRV the next morning."
          : "Step count and HRV aren't tied this week.",
      body:
        corrStepsHrv > 0.2
          ? `Days above 10k steps lifted next-morning HRV by an average of 4ms. Easy aerobic dose seems well calibrated.`
          : `Steps and HRV are uncorrelated right now (r=${corrStepsHrv.toFixed(
              2,
            )}). Likely your easy days are too easy or too hard — try a heart-rate cap of 130 on at least two of them.`,
      metric: `r = ${corrStepsHrv.toFixed(2)}`,
      source: ["Fitbit", "Whoop"],
      confidence: clamp(Math.abs(corrStepsHrv), 0.2, 0.85),
    },
  ];
}

function avg(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export type DeviceStatus = {
  id: string;
  name: string;
  vendor: string;
  syncedMinutesAgo: number;
  battery: number;
  worn: "on-wrist" | "on-finger" | "in-bed" | "off";
  contributes: string[];
};

export const devices: DeviceStatus[] = [
  {
    id: "aw",
    name: "Apple Watch Ultra 2",
    vendor: "Apple",
    syncedMinutesAgo: 2,
    battery: 78,
    worn: "on-wrist",
    contributes: ["Heart rate", "Workouts", "Steps", "ECG", "VO₂ max"],
  },
  {
    id: "oura",
    name: "Oura Ring 4 — Stealth",
    vendor: "Oura",
    syncedMinutesAgo: 14,
    battery: 64,
    worn: "on-finger",
    contributes: ["Sleep stages", "HRV", "Body temp", "Readiness"],
  },
  {
    id: "whoop",
    name: "Whoop 4.0",
    vendor: "Whoop",
    syncedMinutesAgo: 6,
    battery: 51,
    worn: "on-wrist",
    contributes: ["Strain", "Recovery", "Respiratory rate"],
  },
  {
    id: "garmin",
    name: "Garmin Fenix 8",
    vendor: "Garmin",
    syncedMinutesAgo: 9,
    battery: 92,
    worn: "off",
    contributes: ["VO₂ max", "Body battery", "Stress", "Pulse Ox"],
  },
  {
    id: "withings",
    name: "Withings Body Scan",
    vendor: "Withings",
    syncedMinutesAgo: 540,
    battery: 100,
    worn: "off",
    contributes: ["Weight", "Body comp", "Vascular age"],
  },
  {
    id: "dexcom",
    name: "Dexcom G7",
    vendor: "Dexcom",
    syncedMinutesAgo: 4,
    battery: 31,
    worn: "on-wrist",
    contributes: ["Glucose"],
  },
];
