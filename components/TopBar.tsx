"use client";

import { Activity, Bell, Search, Sparkles } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-line">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center gap-6">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 grid place-items-center rounded-md bg-ink text-paper">
            <Activity size={18} strokeWidth={2.4} />
            <span className="absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full bg-recover ring-2 ring-background pulse-soft" />
          </div>
          <div className="leading-none">
            <div className="text-[18px] font-semibold tracking-tight">
              WearSync<span className="font-display italic font-normal">Life</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mt-1">
              v1.4 · synced 2 min ago
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {[
            { name: "Today", active: true },
            { name: "Trends" },
            { name: "Sleep" },
            { name: "Movement" },
            { name: "Recovery" },
            { name: "Devices" },
          ].map((item) => (
            <a
              key={item.name}
              href={`#${item.name.toLowerCase()}`}
              className={`relative px-3 py-1.5 text-[13px] rounded-full transition-colors ${
                item.active
                  ? "bg-ink text-paper"
                  : "text-ink2 hover:bg-line/60"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 rounded-full hairline bg-paper/60 px-3 py-1.5 text-[12px] text-muted w-72">
            <Search size={14} />
            <input
              className="bg-transparent outline-none flex-1 placeholder:text-muted"
              placeholder="Ask: 'how did caffeine affect my sleep?'"
            />
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-line bg-background text-muted">
              ⌘K
            </kbd>
          </div>
          <button className="grid place-items-center h-9 w-9 rounded-full hairline bg-paper/60 text-ink2 hover:text-ink relative">
            <Bell size={15} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-heart" />
          </button>
          <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-full bg-ink text-paper text-[12px] font-medium">
            <Sparkles size={13} className="text-highlight" />
            Ask Sync
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 via-rose-300 to-violet-400 grid place-items-center text-[11px] font-semibold text-ink">
            ER
          </div>
        </div>
      </div>
    </header>
  );
}
