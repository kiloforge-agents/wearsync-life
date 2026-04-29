import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SwRegister from "@/components/SwRegister";

const sans = Inter({
  variable: "--font-sans-fam",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-fam",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-fam",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WearSyncLife — One signal across every wearable.",
  description:
    "An aggregate view of your sleep, training load, recovery and circadian rhythm — synced across Apple Watch, Oura, Whoop, Garmin and Fitbit. Quiet intelligence, not more notifications.",
  applicationName: "WearSyncLife",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "WearSyncLife",
    statusBarStyle: "default",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
