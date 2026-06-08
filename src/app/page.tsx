"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Zap, BatteryCharging, Radio, Sun, Lock, LineChart,
  Check, Menu, Share2, Link, GitFork, Globe,
} from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useIsNative } from "@/lib/native";

/* ============================================================
   GBICT Energy — landing page (Next.js App Router page.tsx)
   Premium dark-violet. Tailwind utility classes map the design
   tokens from colors_and_type.css 1:1. Drop into app/page.tsx.

   Treatment: clean solid-violet pills (no gradient/lip), heavier
   display + title weights, generous air (120px sections, 32px+
   card padding).

   Requires: lucide-react. Font: Geist (next/font or @import).
   Logo: place the trimmed brand mark at /public/gbict-logo.png.
   ============================================================ */

const NAV = [
  ["How it works", "#how"],
  ["Integrations", "#features"],
  ["Pricing", "#pricing"],
  ["About", "#footer"],
] as const;

const METRICS = [
  { n: "€847", l: "average saved per year", tone: "save" },
  { n: "< 2 min", l: "to connect", tone: "" },
  { n: "24/7", l: "automatic optimization", tone: "" },
  { n: "98%", l: "uptime guarantee", tone: "key" },
] as const;

const FEATURES = [
  { icon: Zap, title: "Dynamic price optimization", desc: "AI analyzes EPEX spot prices every hour and automatically picks the cheapest moment to charge — without you lifting a finger.", size: "lg" },
  { icon: BatteryCharging, title: "Hardware-agnostic", desc: "Works with Sessy, Victron, SolarEdge, Enphase and more. One platform, no vendor lock-in, no surprises.", size: "lg" },
  { icon: Radio, title: "Tibber integration", desc: "Direct link to your dynamic contract and real-time spot prices.", size: "sm" },
  { icon: Sun, title: "Solar priority", desc: "Charges on your own sun first, then the cheapest grid hours.", size: "sm" },
  { icon: Lock, title: "Your data", desc: "On-premise processing. No data resale, no surprises.", size: "sm" },
  { icon: LineChart, title: "Real-time dashboard", desc: "Live insight into savings, battery status and energy prices — all on one screen, continuously updated. See exactly what GBICT earns you, every hour of the day.", size: "wide" },
] as const;

const STEPS = [
  { title: "Connect your devices", desc: "Link Tibber, Sessy or your inverter in 2 minutes." },
  { title: "AI optimizes automatically", desc: "GBICT analyzes spot prices and steers your battery." },
  { title: "Save in real time", desc: "The dashboard shows live how much you save — every day." },
] as const;

type Plan = {
  name: string; tagline: string; price: string; period?: string;
  features: string[]; cta: string; note: string; popular?: boolean;
};
const PLANS: Plan[] = [
  { name: "Starter", tagline: "Perfect to get started", price: "€15", period: "/month",
    features: ["1 device", "Daily optimization", "Email support", "Basic dashboard"],
    cta: "Start free trial", note: "Billed monthly · cancel anytime" },
  { name: "Pro", tagline: "For serious home energy owners", price: "€25", period: "/month", popular: true,
    features: ["Unlimited devices", "Hourly optimization", "VPP access", "Priority support", "Advanced analytics"],
    cta: "Start 14-day free trial", note: "Billed monthly · cancel anytime" },
  { name: "Business", tagline: "For installers & property managers", price: "Custom",
    features: ["Multiple locations", "White-label option", "Dedicated SLA", "Custom integrations", "Account manager", "Volume pricing"],
    cta: "Contact sales", note: "Annual contract · volume discounts available" },
];

const BENEFITS = [
  { icon: Zap, title: "Always the lowest price", desc: "GBICT charges your battery when electricity is cheapest, and sells when prices peak. Fully automatic." },
  { icon: BatteryCharging, title: "Works with every battery", desc: "Sessy, Victron, SolarEdge, Enphase — no vendor lock-in. Connect what you already have." },
  { icon: LineChart, title: "Full transparency", desc: "See exactly when your battery charged, what it earned, and how much you saved. Per hour." },
];

const SCHEDULE: { h: number; t: "ok" | "sell" | "idle" }[] = [
  { h: 42, t: "ok" }, { h: 64, t: "ok" }, { h: 28, t: "idle" }, { h: 46, t: "idle" },
  { h: 58, t: "ok" }, { h: 40, t: "idle" }, { h: 82, t: "sell" }, { h: 96, t: "sell" },
  { h: 44, t: "idle" }, { h: 52, t: "ok" }, { h: 60, t: "ok" }, { h: 34, t: "idle" },
];
const SLOT = { ok: "bg-emerald-500", sell: "bg-amber-500", idle: "bg-slate-400/20" } as const;

/* Clean solid-violet pill — one subtle shadow, no gradient, no lip, no icon. */
const btnPrimary =
  "inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#047857] hover:bg-[#059669] " +
  "text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors";
const btnGhost =
  "inline-flex items-center justify-center h-12 px-7 rounded-full border border-[var(--border)] bg-transparent " +
  "text-[var(--text)] text-[15px] font-medium hover:bg-[var(--surface-2)] transition-colors";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
      <span className="h-[3px] w-5 rounded-sm bg-emerald-500" />
      {children}
    </p>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="text-center">
      {eyebrow && <div className="mb-5 flex justify-center"><Eyebrow>{eyebrow}</Eyebrow></div>}
      <h2 className="text-[clamp(34px,4.4vw,50px)] font-extrabold leading-[1.08] tracking-[-0.035em]">{title}</h2>
      {sub && <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, locales, labels, names } = useLocale()
  const [showPicker, setShowPicker] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(v => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--text-muted)] transition-colors hover:border-emerald-500/30 hover:text-[var(--text)]"
      >
        <Globe className="h-3.5 w-3.5" />
        {labels[locale]}
      </button>
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            {locales.map(l => (
              <button
                key={l}
                onClick={() => { setLocale(l); setShowPicker(false) }}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] transition-colors hover:bg-[var(--surface-2)] ${locale === l ? 'text-emerald-400 font-semibold' : 'text-[var(--text-muted)]'}`}
              >
                <span className="w-6 text-[11px] font-bold text-[var(--text-faint)]">{labels[l]}</span>
                {names[l]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center gap-7 px-6">
        <a href="#top" className="shrink-0">
          <img src="/gbict-logo.png" alt="GBICT Energy" width={56} height={56} className="block rounded-[13px]" />
        </a>
        <div className="ml-3 hidden gap-7 md:flex">
          {NAV.map(([t, h]) => (
            <a key={h} href={h} className="text-[14.5px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">{t}</a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <a href="/login" className="hidden text-[15px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:inline-flex">Sign in</a>
          <a href="/signup" className={btnPrimary + " hidden md:inline-flex"}>Start free trial</a>
          <button aria-label="Menu" className="text-[var(--text)] md:hidden" onClick={() => setOpen((o) => !o)}><Menu className="h-6 w-6" /></button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-b border-[var(--border)] bg-[var(--bg)] px-6 pb-5 pt-3 backdrop-blur-md md:hidden">
          {NAV.map(([t, h]) => (
            <a key={h} href={h} className="border-b border-[var(--border)] py-3 text-base text-[var(--text-muted)]" onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a href="/signup" className={btnPrimary + " mt-3"}>Start free trial</a>
        </div>
      )}
    </nav>
  );
}

function Dashboard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_70%)]" />
      <div className="mb-6 flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-[13.5px] font-medium text-[var(--text-muted)]">
          <BatteryCharging className="h-[17px] w-[17px] text-[var(--text-muted)]" /> Home battery · Sessy
        </span>
        <span className="flex items-center gap-2 text-[12px] font-medium tracking-[0.02em] text-[var(--text-muted)]">
          <span className="h-[14px] w-[3px] rounded-sm bg-emerald-400" /> Cheap
        </span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[44px] font-bold tracking-[-0.03em]">78</span>
        <span className="text-[13px] text-[var(--text-faint)]">% state of charge</span>
      </div>
      <div className="mt-1 text-[11.5px] text-[#475569]">optimal charge window · now until 06:00</div>
      <div className="my-5 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,#047857,#A78BFA)]" />
      </div>
      <div className="mb-7 flex gap-3">
        <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5">
          <div className="text-[11px] text-[var(--text-faint)]">Spot price now</div>
          <div className="mt-1.5 font-mono text-[18px]">€0.0421<span className="text-[11px] text-[var(--text-faint)]">/kWh</span></div>
        </div>
        <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5">
          <div className="text-[11px] text-[var(--text-faint)]">Saved today</div>
          <div className="mt-1.5 font-mono text-[18px] text-emerald-400">€2.14</div>
        </div>
      </div>
      <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Optimization schedule · today</div>
      <div className="flex h-[52px] items-end gap-[5px]">
        {SCHEDULE.map((s, i) => <div key={i} className={"flex-1 rounded-[3px] " + SLOT[s.t]} style={{ height: `${s.h}%` }} />)}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-[var(--text-faint)]">
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[9px] w-[9px] rounded-sm bg-emerald-500" /> Charge</span>
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[9px] w-[9px] rounded-sm bg-amber-500" /> Sell</span>
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-[9px] w-[9px] rounded-sm bg-slate-400/30" /> Idle</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="flex min-h-[calc(100vh-68px)] items-center py-40">
      <div className="mx-auto grid w-full max-w-[1140px] grid-cols-1 items-center gap-[72px] px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--surface)] px-3.5 py-[7px] text-[12.5px] font-medium text-[var(--text-muted)] backdrop-blur">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Hardware-agnostic platform
          </span>
          <h1 className="mt-7 text-[clamp(48px,6vw,80px)] font-black leading-[1.02] tracking-[-0.05em] text-[var(--text)]">
            The smartest way to make your battery work for you
          </h1>
          <p className="mt-7 max-w-[520px] text-[18px] font-medium leading-[1.55] text-[var(--text-muted)]">
            Connect any home battery to any dynamic energy contract. GBICT optimizes automatically — charge cheap, sell expensive.
          </p>
          <div className="mt-11 flex flex-wrap gap-3.5">
            <a href="/signup" className={btnPrimary}>Start 14-day free trial</a>
            <a href="#how" className={btnGhost}>How it works</a>
          </div>
          <p className="mt-6 text-[13.5px] text-[var(--text-faint)]">14 days free · cancel anytime</p>
        </div>
        <Dashboard />
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <div className="relative z-[5] mx-auto -mt-9 max-w-[1140px] px-6">
      <div className="flex flex-wrap overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur">
        {METRICS.map((m) => (
          <div key={m.l} className="flex-1 border-r border-[var(--border)] px-5 py-9 text-center last:border-r-0">
            <div className={"text-[32px] font-extrabold tracking-[-0.03em] " + (m.tone === "save" ? "text-emerald-400" : m.tone === "key" ? "text-emerald-400" : "text-[var(--text)]")}>{m.n}</div>
            <div className="mt-2.5 text-[13px] font-medium leading-[1.4] text-[var(--text-muted)]">{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const lg = FEATURES.filter((f) => f.size === "lg");
  const sm = FEATURES.filter((f) => f.size === "sm");
  const wide = FEATURES.find((f) => f.size === "wide")!;
  return (
    <section id="features" className="py-[120px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHead eyebrow="Integrations & features" title="Everything that makes your battery smart"
          sub="One platform that lets your hardware, your contract and the market talk to each other." />
        <div className="mt-16 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {lg.map((f) => (
              <div key={f.title} className="flex gap-5 rounded-2xl border border-[var(--border)] p-8 transition-all hover:border-emerald-500/20 hover:shadow-[inset_2px_0_0_#10b981]">
                <f.icon className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.02em]">{f.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--text-muted)]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sm.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[var(--border)] p-8 transition-all hover:border-emerald-500/20 hover:shadow-[inset_2px_0_0_#10b981]">
                <h3 className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em]"><f.icon className="h-[18px] w-[18px] shrink-0 text-emerald-500" />{f.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--text-muted)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 md:flex-row md:items-center md:gap-8">
            <h3 className="flex shrink-0 items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em] md:min-w-[230px]"><wide.icon className="h-[18px] w-[18px] shrink-0 text-emerald-500" />{wide.title}</h3>
            <p className="max-w-[560px] text-[15px] leading-[1.6] text-[var(--text-muted)]">{wide.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-[120px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHead eyebrow="How it works" title="Up and running in 3 steps"
          sub="No technical knowledge needed. Connect, lean back, save." />
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-[23px] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] md:block" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto mb-6 grid h-[46px] w-[46px] place-items-center rounded-full border border-emerald-500/35 bg-emerald-500/[0.08] font-mono text-[17px] font-bold text-emerald-400">{i + 1}</div>
              <h3 className="text-[18px] font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="mx-auto mt-2.5 max-w-[280px] text-[15px] leading-[1.6] text-[var(--text-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-[120px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <SectionHead eyebrow="Pricing" title="Start free, scale when you want" sub="No hidden fees. Cancel anytime." />
        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={"relative flex flex-col rounded-2xl border bg-[var(--surface)] p-10 backdrop-blur " + (p.popular ? "border-emerald-500/35 bg-[var(--surface)] shadow-[inset_0_1px_0_rgba(16,185,129,0.5)]" : "border-[var(--border)]")}>
              {p.popular && <span className="absolute right-6 top-6 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-emerald-400">Most popular</span>}
              <div className="text-[13px] font-semibold tracking-[0.02em] text-[var(--text-muted)]">{p.name}</div>
              <div className="mt-1.5 text-[13px] text-[var(--text-faint)]">{p.tagline}</div>
              <div className="mb-0.5 mt-5 text-[44px] font-extrabold leading-none tracking-[-0.03em]">
                {p.price}{p.period && <span className="text-[14px] font-medium text-[var(--text-faint)]">{p.period}</span>}
              </div>
              <ul className="my-7 flex-1 list-none p-0">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 py-2 text-[14px] text-[var(--text-muted)]"><Check className="h-[15px] w-[15px] shrink-0 text-emerald-400" />{f}</li>
                ))}
              </ul>
              <a href="/signup" className={(p.popular ? btnPrimary : btnGhost) + " w-full"}>{p.cta}</a>
              <div className="mt-3.5 text-center text-[12px] text-[var(--text-faint)]">{p.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const stats = [
    { n: "€847", l: "Average yearly savings per household", tone: "text-emerald-400" },
    { n: "< 2 min", l: "Time to connect your first device", tone: "text-[var(--text)]" },
    { n: "24/7", l: "Automatic optimization, no manual work", tone: "text-emerald-400" },
  ];
  return (
    <section id="results" className="relative overflow-hidden bg-[var(--band)] py-[120px]">
      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(16,185,129,0.16),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1140px] px-6">
        <SectionHead title="What GBICT does for you" />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l}>
              <div className={"text-[50px] font-extrabold leading-none tracking-[-0.03em] " + s.tone}>{s.n}</div>
              <div className="mt-3 max-w-[240px] text-[14px] leading-[1.5] text-[var(--text-muted)]">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-[52px]">
          {BENEFITS.map((b, i) => (
            <div key={b.title} className={"flex items-start gap-5 border-t border-[var(--border)] py-7 " + (i === BENEFITS.length - 1 ? "border-b" : "")}>
              <b.icon className="mt-0.5 h-[22px] w-[22px] shrink-0 text-emerald-500" />
              <div>
                <h3 className="mb-2 text-[18px] font-bold tracking-[-0.02em]">{b.title}</h3>
                <p className="max-w-[680px] text-[15px] leading-[1.6] text-[var(--text-muted)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-[100px] text-center">
          <div className="pointer-events-none absolute left-1/2 top-[-200px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(16,185,129,0.2),transparent_65%)]" />
          <h2 className="relative text-[clamp(32px,4.4vw,52px)] font-extrabold tracking-[-0.04em]">Ready to save automatically?</h2>
          <p className="relative mt-5 text-[18px] text-[var(--text-muted)]">Connect your battery in 2 minutes. No technical knowledge needed.</p>
          <a href="/signup" className={btnPrimary + " relative mt-9"}>Start 14-day free trial</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Product",          [["Dashboard", "/dashboard"], ["Pricing", "#pricing"]]],
    ["Company",          [["Contact", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
    ["Compatible with",  [["Sessy", "#features"], ["Tibber", "#features"], ["Victron", "#features"], ["SolarEdge", "#features"], ["Enphase", "#features"], ["Fronius", "#features"]]],
  ];
  return (
    <footer id="footer" className="relative z-[2] border-t border-[var(--border)] pb-10 pt-16">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <img src="/gbict-logo.png" alt="GBICT Energy" width={38} height={38} className="mb-4 block rounded-[11px]" />
            <p className="mb-[18px] max-w-[280px] text-[14px] leading-[1.55] text-[var(--text-muted)]">The operating system for your home energy.</p>
            <div className="flex gap-2.5">
              {[Share2, Link, GitFork].map((Ic, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-white/10 hover:text-[var(--text)]"><Ic className="h-[17px] w-[17px]" /></a>
              ))}
            </div>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h4 className="mb-4 text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">{h}</h4>
              {links.map(([label, href]) => (
                <a key={label} href={href} className="block py-1.5 text-[14px] text-[var(--text-faint)] transition-colors hover:text-[var(--text)]">{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3.5 border-t border-[var(--border)] pt-6 text-[13px] text-[var(--text-faint)] md:flex-row">
          <span>© 2026 GBICT Energy · Almere, Netherlands</span>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-[var(--text)]">Privacy</a>
            <a href="/terms" className="hover:text-[var(--text)]">Terms</a>
            <a href="/contact" className="hover:text-[var(--text)]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  const native = useIsNative()
  const router = useRouter()

  // In the native app there is no marketing site — go straight to the product.
  // Existing users land on the dashboard (proxy sends them to login if needed),
  // new users continue from there to sign up + onboarding.
  useEffect(() => {
    if (native) router.replace('/dashboard')
  }, [native, router])

  if (native) {
    // Dark holding screen while redirecting (hidden behind the native splash).
    return <main className="min-h-screen bg-[var(--bg)]" />
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] font-sans text-[var(--text)] antialiased">
      {/* atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.25),rgba(5,150,105,0.1)_45%,transparent_70%)] blur-xl" />
      <div className="relative z-[2]">
        <Nav />
        <Hero />
        <Metrics />
        <Features />
        <HowItWorks />
        <Pricing />
        <Benefits />
        <BigCTA />
        <Footer />
      </div>
    </main>
  );
}
