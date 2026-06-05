"use client";

import { useState } from "react";
import { Menu, Sparkles, Wrench, Rocket, Bug, Zap } from "lucide-react";

const NAV_LINKS = [
  ["How it works", "/#how"],
  ["Integrations", "/#features"],
  ["Pricing", "/#pricing"],
  ["Contact", "/contact"],
] as const;

const btnPrimary =
  "inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#5B21B6] hover:bg-[#6D28D9] " +
  "text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors";

type ChangeType = "new" | "improved" | "fixed" | "performance";

const TYPE_META: Record<ChangeType, { label: string; color: string; dot: string }> = {
  new: { label: "New", color: "border-violet-500/40 bg-violet-500/15 text-violet-300", dot: "bg-violet-500" },
  improved: { label: "Improved", color: "border-blue-500/40 bg-blue-500/15 text-blue-300", dot: "bg-blue-500" },
  fixed: { label: "Fixed", color: "border-amber-500/40 bg-amber-500/15 text-amber-300", dot: "bg-amber-500" },
  performance: { label: "Performance", color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300", dot: "bg-emerald-500" },
};

type ChangeEntry = { type: ChangeType; text: string };
type Release = {
  version: string;
  date: string;
  label: "major" | "minor" | "patch" | "launch";
  title: string;
  summary: string;
  icon: React.ElementType;
  changes: ChangeEntry[];
};

const RELEASES: Release[] = [
  {
    version: "v1.2.0",
    date: "June 2025",
    label: "minor",
    title: "Dashboard redesign & multi-language support",
    summary: "A full visual refresh of the dashboard with a premium violet theme, richer charts, and support for Dutch, English, and German.",
    icon: Sparkles,
    changes: [
      { type: "new", text: "Complete dashboard redesign with premium dark-violet theme and new typography system" },
      { type: "new", text: "Multi-language support: Dutch (NL), English (EN), and German (DE) — auto-detected from browser locale" },
      { type: "new", text: "GBICT_LOCALE preference cookie stores your language choice for 1 year" },
      { type: "improved", text: "Savings chart now shows hourly granularity with interactive tooltips" },
      { type: "improved", text: "Battery state-of-charge widget shows live animation during charge/discharge cycles" },
      { type: "improved", text: "Mobile dashboard layout overhauled — all core metrics accessible on small screens" },
      { type: "performance", text: "Dashboard initial load time reduced by 38% through code splitting and route prefetching" },
      { type: "fixed", text: "Spot price chart sometimes showed incorrect timezone offset for users in CET+1 — resolved" },
    ],
  },
  {
    version: "v1.1.0",
    date: "May 2025",
    label: "minor",
    title: "VPP beta launch & Fronius support",
    summary: "Virtual Power Plant (VPP) participation is now available in beta for Pro users in the Netherlands. Fronius Symo GEN24 inverters are now natively supported.",
    icon: Zap,
    changes: [
      { type: "new", text: "Virtual Power Plant (VPP) beta: participate in grid balancing events and earn energy credits" },
      { type: "new", text: "Fronius Symo GEN24 and Primo GEN24 inverter integration" },
      { type: "new", text: "Optimization schedule editor: view and manually adjust tomorrow's charge/discharge plan" },
      { type: "new", text: "VPP event notifications via email and in-app push (opt-in)" },
      { type: "improved", text: "Optimization algorithm now uses 48-hour price forecasts instead of 24-hour for smarter scheduling" },
      { type: "improved", text: "Battery health indicator added to device settings — tracks cycle count and estimated degradation" },
      { type: "improved", text: "API response times improved by ~22% following infrastructure migration to Supabase EU-West" },
      { type: "fixed", text: "Fronius: initial connection sometimes timed out during OAuth flow on slow connections" },
      { type: "fixed", text: "Schedule editor displayed times in UTC instead of local timezone — corrected" },
    ],
  },
  {
    version: "v1.0.5",
    date: "April 2025",
    label: "patch",
    title: "Stability fixes: Tibber sync & Sessy connection",
    summary: "A targeted patch addressing two reliability issues reported by users: intermittent Tibber price sync failures and occasional Sessy disconnects.",
    icon: Wrench,
    changes: [
      { type: "fixed", text: "Tibber price sync: hourly price fetch occasionally returned stale data when the Tibber API returned a 503 — now retries with exponential backoff" },
      { type: "fixed", text: "Sessy connection: WebSocket connection dropped after ~6 hours of inactivity and did not auto-reconnect — now uses persistent keep-alive pings" },
      { type: "fixed", text: "Sessy: state of charge reported as 0% for a few seconds after reconnect — suppressed until first valid reading" },
      { type: "fixed", text: "Savings calculation showed negative values on days when spot prices went negative — display now shows €0.00 with a tooltip explaining negative prices" },
      { type: "improved", text: "Connection status indicator in the dashboard now distinguishes between 'disconnected' and 'reconnecting' states" },
      { type: "performance", text: "Reduced database query load by caching device status reads for 10 seconds" },
    ],
  },
  {
    version: "v1.0.0",
    date: "March 2025",
    label: "launch",
    title: "Initial launch",
    summary: "GBICT Energy is live. Connect your home battery, link your Tibber account, and let the platform optimize your energy automatically.",
    icon: Rocket,
    changes: [
      { type: "new", text: "Home battery optimization using EPEX spot price data — charges when cheap, sells or discharges when expensive" },
      { type: "new", text: "Tibber integration: real-time spot prices and dynamic contract data via Tibber OAuth" },
      { type: "new", text: "Sessy Home Battery integration: full charge/discharge control via the Sessy API" },
      { type: "new", text: "Victron Energy integration: Cerbo GX support via Venus OS MQTT" },
      { type: "new", text: "Live dashboard: state of charge, spot price, savings today, and 12-hour optimization schedule" },
      { type: "new", text: "Savings history: daily and monthly summaries with export to CSV" },
      { type: "new", text: "User accounts with email/password and Google OAuth login" },
      { type: "new", text: "14-day free trial — no credit card required" },
      { type: "new", text: "Starter (€15/mo) and Pro (€25/mo) subscription plans" },
    ],
  },
];

const LABEL_STYLE: Record<Release["label"], string> = {
  launch: "border-violet-500/50 bg-violet-500/20 text-violet-300",
  major: "border-violet-500/50 bg-violet-500/20 text-violet-300",
  minor: "border-blue-500/40 bg-blue-500/15 text-blue-300",
  patch: "border-white/10 bg-white/[0.05] text-slate-400",
};
const LABEL_TEXT: Record<Release["label"], string> = {
  launch: "Launch",
  major: "Major",
  minor: "Minor",
  patch: "Patch",
};

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07080D]/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center gap-7 px-6">
        <a href="/" className="shrink-0">
          <img src="/gbict-logo.png" alt="GBICT Energy" width={56} height={56} className="block rounded-[13px]" />
        </a>
        <div className="ml-3 hidden gap-7 md:flex">
          {NAV_LINKS.map(([t, h]) => (
            <a key={h} href={h} className="text-[14.5px] font-medium text-slate-400 transition-colors hover:text-slate-100">{t}</a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a href="/login" className="hidden text-[15px] font-medium text-slate-400 transition-colors hover:text-slate-200 md:inline-flex">Sign in</a>
          <a href="/signup" className={btnPrimary + " hidden md:inline-flex"}>Start free</a>
          <button aria-label="Menu" className="text-slate-100 md:hidden" onClick={() => setOpen((o) => !o)}><Menu className="h-6 w-6" /></button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-b border-white/[0.06] bg-[#07080D]/95 px-6 pb-5 pt-3 backdrop-blur-md md:hidden">
          {NAV_LINKS.map(([t, h]) => (
            <a key={h} href={h} className="border-b border-white/[0.06] py-3 text-base text-slate-300" onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a href="/signup" className={btnPrimary + " mt-3"}>Start free</a>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pb-10 pt-12">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="flex flex-col items-center justify-between gap-3.5 text-[13px] text-slate-500 md:flex-row">
          <span>© 2026 GBICT Energy · Almere, Netherlands</span>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-slate-100">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-100">Terms of Service</a>
            <a href="/contact" className="hover:text-slate-100">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07080D] font-sans text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(124,58,237,0.16),rgba(109,40,217,0.07)_45%,transparent_70%)] blur-xl" />
      <div className="relative z-[2]">
        <Nav />

        <div className="mx-auto max-w-[860px] px-6 py-20">
          {/* Header */}
          <div className="mb-16">
            <p className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-400">
              <span className="h-[3px] w-5 rounded-sm bg-violet-500" />
              Product updates
            </p>
            <h1 className="text-[clamp(40px,5.5vw,62px)] font-extrabold tracking-[-0.04em] text-slate-50">
              Changelog
            </h1>
            <p className="mt-5 max-w-[480px] text-[17px] leading-[1.6] text-slate-400">
              Every update, fix, and new feature — in one place. We ship regularly.
            </p>
          </div>

          {/* Legend */}
          <div className="mb-12 flex flex-wrap gap-3">
            {(Object.entries(TYPE_META) as [ChangeType, typeof TYPE_META[ChangeType]][]).map(([, m]) => (
              <span key={m.label} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[12px] text-slate-400">
                <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                {m.label}
              </span>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/[0.06] hidden sm:block" />

            <div className="space-y-12">
              {RELEASES.map((r, i) => (
                <article key={r.version} className="relative sm:pl-14">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-[18px] hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/30 bg-[#0D0E16] shadow-[0_0_0_4px_#07080D]">
                    <r.icon className="h-4.5 w-4.5 text-violet-400" />
                  </div>

                  {/* Release card */}
                  <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] overflow-hidden">
                    {/* Card header */}
                    <div className="p-7 pb-6 border-b border-white/[0.06]">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-mono text-[22px] font-extrabold tracking-[-0.02em] text-slate-50">{r.version}</span>
                        <span className={`rounded-md border px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] ${LABEL_STYLE[r.label]}`}>
                          {LABEL_TEXT[r.label]}
                        </span>
                        <span className="ml-auto text-[13px] text-slate-500">{r.date}</span>
                      </div>
                      <h2 className="text-[20px] font-bold tracking-[-0.02em] text-slate-100 mb-2">{r.title}</h2>
                      <p className="text-[15px] leading-[1.6] text-slate-400">{r.summary}</p>
                    </div>

                    {/* Changes list */}
                    <div className="p-7 pt-5">
                      <ul className="space-y-3">
                        {r.changes.map((c, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className={`mt-[5px] shrink-0 rounded border px-1.5 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] ${TYPE_META[c.type].color}`}>
                              {TYPE_META[c.type].label}
                            </span>
                            <span className="text-[14px] leading-[1.6] text-slate-400">{c.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-10 text-center">
            <h3 className="text-[22px] font-bold tracking-[-0.02em]">Stay up to date</h3>
            <p className="mx-auto mt-2.5 max-w-[380px] text-[15px] text-slate-400">
              Major updates are sent to all active subscribers. Minor releases are posted here first.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/signup" className={btnPrimary}>Start free trial</a>
              <a href="/contact" className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-white/20 bg-transparent text-white text-[15px] font-medium hover:bg-white/[0.06] transition-colors">
                Contact us
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
