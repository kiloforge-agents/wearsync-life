# WearSyncLife

> One signal across every wearable.

A dashboard PWA that aggregates data from your Apple Watch, Oura, Whoop,
Garmin, Fitbit, Withings and Dexcom into a single, calm view — with
sleep × fitness × recovery correlations and personalized AI-style tips.

This is a fully designed product surface running on synthetic but
realistic 30-day wearable data. Built to be the calm layer over the
notification-heavy world of consumer wearables.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript** strict
- **Tailwind CSS v4**
- **Recharts** for visual analytics
- **Lucide** icons
- **Inter + Instrument Serif + JetBrains Mono** typography
- **Installable PWA** (manifest + service worker shell cache)

## Surfaces

- Composite wellness ring (recovery × sleep × calm)
- Sleep architecture: stages, efficiency, 7-night history
- 24-hour heart rate trace with workout/sleep windows
- Activity rings: steps, kcal, active minutes
- Cross-signal correlation explorer (Pearson r + R², 4 paired signals)
- Quiet-intelligence insights derived from your real-time data
- Connected devices panel (live/offline, battery, contributions)
- 30-day trends with switchable metric and sleep×strain compare view
- Personalized day plan with completion tracking
- "Ask Sync" natural-language prompt bar

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Notes

All data is generated client-side from a deterministic seed in
`lib/data.ts`. Swap `buildSeries()` for real device-API responses
(HealthKit, Oura v3, Whoop OAuth2, Garmin Connect) to make this live.
