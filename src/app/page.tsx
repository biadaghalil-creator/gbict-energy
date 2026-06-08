"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode, CSSProperties } from "react";
import {
  Zap, BatteryCharging, Radio, Sun, Lock, LineChart, Check, Menu, Globe, ChevronDown, X,
  Leaf, Play, ArrowRight, TrendingUp, TrendingDown, Sparkles, Activity,
  PiggyBank, CalendarClock, BellRing, ShieldCheck, Server, UserCheck,
  BadgeCheck, Shield, Home, Bell, BatteryFull, CloudSun, Share2, Link as LinkIcon, GitFork,
} from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useIsNative } from "@/lib/native";

/* ============================================================
   GBICT Energy — landing page (Next.js App Router page.tsx)
   Faithful port of the iPwr standalone design. Always dark.
   Uses the design's own CSS classes (appended to globals.css)
   wrapped in .dark + .gbict-landing. English copy only.
   Card is captured at signup, so no "no credit card" claims.
   ============================================================ */

const NAV: [string, string][] = [
  ["How it works", "#how"],
  ["Integrations", "#features"],
  ["Pricing", "#pricing"],
  ["Contact", "/contact"],
];

/* ---------- Shared primitives ---------- */

function Brand({ size = 40 }: { size?: number }) {
  return (
    <img
      className="brand-mark"
      src="/gbict-logo.png"
      alt="GBICT Energy"
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), display: "block" }}
    />
  );
}

function LangSwitcher() {
  const { locale, setLocale, locales, labels } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="lang" ref={ref}>
      <button
        className="lang-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Language"
      >
        <Globe className="lucide" />
        <span>{labels[locale]}</span>
        <ChevronDown className="lucide lang-caret" />
      </button>
      {open && (
        <div className="lang-menu">
          {locales.map((l) => (
            <button
              key={l}
              className={"lang-item" + (l === locale ? " on" : "")}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-inner">
          <a className="brand-lockup" href="#top" aria-label="GBICT Energy">
            <Brand size={32} />
            <span className="brand-word">
              <b>GBICT</b>
              <span>Energy</span>
            </span>
          </a>
          <div className="nav-links">
            {NAV.map(([txt, h]) => (
              <a key={h} href={h}>
                {txt}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <LangSwitcher />
            <a className="btn btn-ghost" href="/login">
              Sign in
            </a>
            <a className="btn btn-primary" href="/signup">
              Start free trial
            </a>
            <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
              {open ? <X className="lucide" /> : <Menu className="lucide" />}
            </button>
          </div>
        </div>
        <div className={"mobile-menu" + (open ? " open" : "")}>
          {NAV.map(([txt, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}>
              {txt}
            </a>
          ))}
          <a href="/login" onClick={() => setOpen(false)}>
            Sign in
          </a>
          <div className="mobile-actions">
            <LangSwitcher />
            <a className="btn btn-primary" href="/signup">
              Start free trial
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Section({
  id,
  eyebrow,
  title,
  sub,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  sub?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={"section " + className}>
      <div className="container">
        {(eyebrow || title || sub) && (
          <div className="center" style={{ marginBottom: 4 }}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {sub && <p className="section-sub">{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------- Hero: battery dashboard card ---------- */

const DASH_SLOTS: [("ok" | "sell" | "idle"), number][] = [
  ["ok", 42], ["ok", 64], ["idle", 28], ["idle", 46],
  ["ok", 58], ["idle", 40], ["sell", 82], ["sell", 96],
  ["idle", 44], ["ok", 52], ["ok", 60], ["idle", 34],
];
const SLOT_COLOR: Record<string, string> = {
  ok: "var(--accent)",
  sell: "var(--bad)",
  idle: "rgba(148,163,184,.18)",
};

function BatteryDash() {
  return (
    <div className="dash">
      <div className="dash-top">
        <span className="dash-dev">
          <BatteryCharging className="lucide" /> Home battery · Sessy
        </span>
        <span className="dash-status">
          <span className="b" /> Cheap
        </span>
      </div>
      <div className="dash-soc">
        <span className="v">78</span>
        <span className="u">% state of charge</span>
      </div>
      <div className="dash-sub" style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>
        optimal charge window · now until 06:00
      </div>
      <div className="dash-bar">
        <i style={{ width: "78%" }} />
      </div>
      <div className="dash-kv">
        <div className="kv">
          <div className="k">Spot price now</div>
          <div className="vv">
            €0.0421
            <span style={{ fontSize: 11, color: "var(--slate-500)" }}>/kWh</span>
          </div>
        </div>
        <div className="kv">
          <div className="k">Saved today</div>
          <div className="vv save">€2.14</div>
        </div>
      </div>
      <div className="dash-label">Optimization schedule · today</div>
      <div className="dash-sched">
        {DASH_SLOTS.map((s, i) => (
          <div key={i} className="slot" style={{ height: s[1] + "%", background: SLOT_COLOR[s[0]] }} />
        ))}
      </div>
      <div className="dash-legend">
        <span>
          <i style={{ background: "var(--accent)" }} /> Charge
        </span>
        <span>
          <i style={{ background: "var(--bad)" }} /> Sell
        </span>
        <span>
          <i style={{ background: "rgba(148,163,184,.30)" }} /> Idle
        </span>
      </div>
    </div>
  );
}

/* ---------- Phone app screens ---------- */

function PowerChart() {
  return (
    <div className="pchart">
      <div className="pchart-top">
        <span>Now</span>
        <span className="now">2.4 kW</span>
      </div>
      <svg viewBox="0 0 300 104" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pcSolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(52,211,153,.34)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0)" />
          </linearGradient>
          <linearGradient id="pcUse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(139,92,246,.30)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
        </defs>
        <line className="grid-l" x1="0" y1="34" x2="300" y2="34" />
        <line className="grid-l" x1="0" y1="64" x2="300" y2="64" />
        <path d="M0,90 C45,90 70,50 105,37 C130,27 152,24 172,29 C205,39 235,66 300,88 L300,104 L0,104 Z" fill="url(#pcSolar)" />
        <path className="ln solar" d="M0,90 C45,90 70,50 105,37 C130,27 152,24 172,29 C205,39 235,66 300,88" vectorEffect="non-scaling-stroke" />
        <path d="M0,72 C25,62 45,66 70,70 C100,75 120,55 150,52 C185,48 210,39 240,43 C265,46 285,55 300,53 L300,104 L0,104 Z" fill="url(#pcUse)" />
        <path className="ln use" d="M0,72 C25,62 45,66 70,70 C100,75 120,55 150,52 C185,48 210,39 240,43 C265,46 285,55 300,53" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="pchart-legend">
        <span>
          <i style={{ background: "var(--trust)" }} /> Solar
        </span>
        <span>
          <i style={{ background: "var(--accent-bright)" }} /> Home use
        </span>
      </div>
    </div>
  );
}

type Screen = "flow" | "savings" | "schedule" | "alerts";

function PhoneApp({ screen = "flow", size = "" }: { screen?: Screen; size?: string }) {
  return (
    <div className={"phone " + size}>
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="app">
          <div className="app-top">
            <div className="app-hi">
              Good evening
              <b>Your home · live</b>
            </div>
            <div className="app-av" />
          </div>

          {screen === "flow" && (
            <>
              <div className="app-card">
                <div className="lbl">Today · solar vs. use</div>
                <PowerChart />
              </div>
              <div className="app-card">
                <div className="lbl">Self-sufficiency now</div>
                <div className="app-hero-num">
                  92<span className="sm"> %</span>
                </div>
                <div className="app-delta">
                  <TrendingUp className="lucide" /> running on your own sun
                </div>
              </div>
            </>
          )}

          {screen === "savings" && (
            <>
              <div className="app-card">
                <div className="lbl">Saved this month</div>
                <div className="app-hero-num">
                  €71<span className="sm">.40</span>
                </div>
                <div className="app-delta">
                  <TrendingUp className="lucide" /> +18% vs. last month
                </div>
                <div className="app-sched" style={{ marginTop: 16 }}>
                  {[34, 52, 40, 66, 48, 80, 60].map((h, i) => (
                    <i key={i} style={{ height: h + "%", background: i === 5 ? "var(--trust)" : "rgba(52,211,153,.32)" }} />
                  ))}
                </div>
              </div>
              <div className="app-card" style={{ paddingTop: 6, paddingBottom: 6 }}>
                <div className="app-row">
                  <span className="t">Cheap-hour charging</span>
                  <b style={{ color: "var(--trust)", fontFamily: "var(--font-mono)", fontSize: 13 }}>€42.10</b>
                </div>
                <div className="app-row">
                  <span className="t">Peak-hour selling</span>
                  <b style={{ color: "var(--trust)", fontFamily: "var(--font-mono)", fontSize: 13 }}>€21.30</b>
                </div>
                <div className="app-row">
                  <span className="t">Solar self-use</span>
                  <b style={{ color: "var(--trust)", fontFamily: "var(--font-mono)", fontSize: 13 }}>€8.00</b>
                </div>
              </div>
            </>
          )}

          {screen === "schedule" && (
            <>
              <div className="app-card">
                <div className="lbl">Today · optimization plan</div>
                <div className="app-sched" style={{ height: 56, marginTop: 12 }}>
                  {(
                    [
                      ["ok", 40], ["ok", 58], ["idle", 30], ["idle", 44],
                      ["ok", 62], ["sell", 84], ["sell", 96], ["idle", 46],
                      ["ok", 54], ["ok", 66], ["idle", 36], ["ok", 50],
                    ] as [string, number][]
                  ).map(([s, h], i) => (
                    <i
                      key={i}
                      style={{
                        height: h + "%",
                        background: s === "ok" ? "var(--accent)" : s === "sell" ? "var(--bad)" : "rgba(148,163,184,.22)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="app-card" style={{ paddingTop: 6, paddingBottom: 6 }}>
                <div className="app-row">
                  <span className="t">02:00 – 06:00</span>
                  <span className="badge-mini bm-ok">Charge cheap</span>
                </div>
                <div className="app-row">
                  <span className="t">12:00 – 15:00</span>
                  <span className="badge-mini bm-ok">Solar charge</span>
                </div>
                <div className="app-row">
                  <span className="t">18:00 – 20:00</span>
                  <span className="badge-mini bm-sell">Sell peak</span>
                </div>
              </div>
            </>
          )}

          {screen === "alerts" && (
            <>
              <div className="app-card" style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <span className="show-ico" style={{ width: 34, height: 34, margin: 0, borderRadius: 10 }}>
                  <TrendingDown className="lucide" />
                </span>
                <div>
                  <b style={{ fontSize: 13, color: "var(--fg1)" }}>Cheap window ahead</b>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--slate-500)", lineHeight: 1.4 }}>
                    Prices drop to €0.04/kWh at 02:00 — charging scheduled.
                  </p>
                </div>
              </div>
              <div className="app-card" style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <span
                  className="show-ico"
                  style={{ width: 34, height: 34, margin: 0, borderRadius: 10, background: "var(--trust-dim)", borderColor: "rgba(52,211,153,.3)", color: "var(--trust)" }}
                >
                  <BatteryFull className="lucide" />
                </span>
                <div>
                  <b style={{ fontSize: 13, color: "var(--fg1)" }}>Battery full</b>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--slate-500)", lineHeight: 1.4 }}>
                    100% reached before the evening peak. Ready to sell.
                  </p>
                </div>
              </div>
              <div className="app-card" style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <span
                  className="show-ico"
                  style={{ width: 34, height: 34, margin: 0, borderRadius: 10, background: "rgba(34,211,238,.14)", borderColor: "rgba(34,211,238,.3)", color: "var(--cyan-bright)" }}
                >
                  <CloudSun className="lucide" />
                </span>
                <div>
                  <b style={{ fontSize: 13, color: "var(--fg1)" }}>Sunny tomorrow</b>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--slate-500)", lineHeight: 1.4 }}>
                    Forecast +6 kWh solar — plan adjusted automatically.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="app-nav">
            <Home className={"lucide" + (screen === "flow" ? " on" : "")} />
            <LineChart className={"lucide" + (screen === "savings" ? " on" : "")} />
            <CalendarClock className={"lucide" + (screen === "schedule" ? " on" : "")} />
            <Bell className={"lucide" + (screen === "alerts" ? " on" : "")} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero (iPwr stage) ---------- */

function StageComposition() {
  return (
    <div className="stage parallax">
      <div className="stage-inner">
        <div className="stage-glow" />
        <div className="stage-ring">
          <span className="orb" />
        </div>

        <div className="stage-dash">
          <BatteryDash />
        </div>

        <div className="stage-phone">
          <PhoneApp screen="flow" size="sm" />
        </div>

        <div className="chip chip-a">
          <span className="ico">
            <TrendingUp className="lucide" />
          </span>
          <span>
            <span className="k">Saved today</span>
            <span className="v save">+€2.14</span>
          </span>
        </div>
        <div className="chip chip-b">
          <span className="ico">
            <Zap className="lucide" />
          </span>
          <span>
            <span className="k">Spot now</span>
            <span className="v">€0.042</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-x" id="top" data-hero="stage">
      <div className="container">
        <div className="hero-x-grid">
          <div className="reveal in">
            <span className="badge badge-glow">
              <Leaf className="lucide" /> Hardware-agnostic platform
            </span>
            <h1>
              The smartest way to make your battery <span className="key">work for you</span>
            </h1>
            <p className="sub">
              Connect any home battery to any dynamic energy contract. GBICT optimizes
              automatically — charge cheap, sell expensive.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary btn-lg" href="/signup">
                <span>Start 14-day free trial</span>
                <ArrowRight className="lucide" />
              </a>
              <a className="btn btn-glass btn-lg" href="#how">
                <Play className="lucide" />
                <span>How it works</span>
              </a>
            </div>
            <div className="micro">
              <span>
                <Check className="lucide" /> Works with any battery
              </span>
              <span>
                <Check className="lucide" /> No vendor lock-in
              </span>
              <span>
                <Check className="lucide" /> 14 days free
              </span>
            </div>
          </div>
          <StageComposition />
        </div>
      </div>
    </section>
  );
}

/* ---------- Metrics ---------- */

function Metrics() {
  const stats: [string, string, string][] = [
    ["€847", "average saved per year", "save"],
    ["< 2 min", "to connect", ""],
    ["24/7", "automatic optimization", ""],
    ["98%", "uptime guarantee", "key"],
  ];
  return (
    <div className="container" style={{ marginTop: -36, position: "relative", zIndex: 5 }}>
      <div className="metrics">
        {stats.map(([n, l, c]) => (
          <div className="metric" key={l}>
            <div className={"num " + c}>{n}</div>
            <div className="lbl">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Problem / Solution ---------- */

function ProblemSolution() {
  return (
    <Section
      id="why"
      eyebrow="The challenge"
      title="Solar is cheap. Your evening isn't."
      sub="Panels feed the grid at midday for pennies. At night you buy it back at peak price — and your devices don't talk to each other."
    >
      <div className="split">
        <div className="split-card problem reveal">
          <span className="split-tag">
            <TrendingDown className="lucide" /> The problem
          </span>
          <h3>Energy wasted, money lost</h3>
          <p>
            Your battery, inverter and charger each do their own thing. You export solar at
            €0.07, then re-import at €0.34 the same evening — every single day.
          </p>
          <div className="scost">
            <span className="big">−€600</span>
            <span className="cap">typical yearly loss without smart steering</span>
          </div>
        </div>
        <div className="split-card solution reveal d1">
          <span className="split-tag">
            <Sparkles className="lucide" /> Our solution
          </span>
          <h3>One brain for your whole home</h3>
          <p>
            GBICT reads live prices, weather and your usage, then charges when power is cheap and
            sells when it peaks — across any brand of hardware, fully automatic.
          </p>
          <div className="scost">
            <span className="big">+€847</span>
            <span className="cap">average yearly savings with GBICT</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Savings calculator ---------- */

function Calculator() {
  const [kwh, setKwh] = useState(10);
  const [contract, setContract] = useState<"dynamic" | "fixed">("dynamic");
  const [solar, setSolar] = useState(true);

  const dyn = contract === "dynamic";
  const arbitrage = Math.round(kwh * (dyn ? 22 : 12));
  const peakSell = Math.round(kwh * (dyn ? 10 : 4));
  const solarUse = solar ? Math.round(kwh * 9) : 0;
  const total = arbitrage + peakSell + solarUse;
  const fill = ((kwh - 5) / (30 - 5)) * 100;

  return (
    <Section
      id="savings"
      eyebrow="Savings calculator"
      title="See what GBICT could earn you"
      sub="Move the sliders to match your home. Estimates based on Dutch 2024 dynamic tariffs."
    >
      <div className="calc reveal">
        <div className="calc-controls">
          <h3>Your setup</h3>
          <p className="csub">A rough estimate — your real numbers depend on usage and prices.</p>

          <div className="calc-field">
            <div className="flab">
              <span className="name">Battery capacity</span>
              <span className="val">{kwh} kWh</span>
            </div>
            <input
              className="calc-range"
              type="range"
              min={5}
              max={30}
              step={1}
              value={kwh}
              style={{ "--fill": fill + "%" } as CSSProperties}
              onChange={(e) => setKwh(+e.target.value)}
            />
          </div>

          <div className="calc-field">
            <div className="flab">
              <span className="name">Energy contract</span>
            </div>
            <div className="calc-seg">
              <button className={dyn ? "on" : ""} onClick={() => setContract("dynamic")}>
                Dynamic
              </button>
              <button className={!dyn ? "on" : ""} onClick={() => setContract("fixed")}>
                Fixed / variable
              </button>
            </div>
          </div>

          <div className="calc-field" style={{ marginBottom: 0 }}>
            <div className="flab">
              <span className="name">Solar panels</span>
            </div>
            <div className="calc-seg">
              <button className={solar ? "on" : ""} onClick={() => setSolar(true)}>
                Yes
              </button>
              <button className={!solar ? "on" : ""} onClick={() => setSolar(false)}>
                No
              </button>
            </div>
          </div>
        </div>

        <div className="calc-result">
          <div className="rlab">Estimated savings</div>
          <div className="ramount">€{total}</div>
          <div className="rper">per year · automatically</div>
          <div className="rbreak">
            <div className="rb">
              <span className="t">Cheap-hour charging</span>
              <span className="n">€{arbitrage}</span>
            </div>
            <div className="rb">
              <span className="t">Peak-hour selling</span>
              <span className="n">€{peakSell}</span>
            </div>
            <div className="rb">
              <span className="t">Solar self-use</span>
              <span className="n">€{solarUse}</span>
            </div>
          </div>
          <div className="rdisc">
            Indicative only. Based on a {kwh} kWh battery on a {dyn ? "dynamic" : "fixed/variable"}{" "}
            contract{solar ? " with solar" : ""}. No rights can be derived from this estimate.
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- App showcase ---------- */

function AppShowcase() {
  const rows: {
    screen: Screen;
    Icon: typeof Activity;
    flip: boolean;
    h: string;
    p: string;
    list: string[];
  }[] = [
    {
      screen: "flow",
      Icon: Activity,
      flip: false,
      h: "Real-time insight into your energy",
      p: "See exactly how much you generate, store and use. Watch your solar, battery, grid and home work together — live, on one screen.",
      list: ["Live solar-vs-usage chart", "Self-sufficiency at a glance", "Per-device monitoring"],
    },
    {
      screen: "savings",
      Icon: PiggyBank,
      flip: true,
      h: "Watch your savings add up",
      p: "Every cheap charge and every peak sale, counted automatically. Transparent, down to the hour — so you always know what GBICT earns you.",
      list: ["Daily, weekly & monthly totals", "Clear breakdown per source", "No spreadsheets, ever"],
    },
    {
      screen: "schedule",
      Icon: CalendarClock,
      flip: false,
      h: "A fresh optimization plan, every day",
      p: "GBICT looks ahead at prices and weather, then plans the best moments to charge, hold and sell — and steers your battery for you.",
      list: ["AI plan from prices + forecast", "Charge cheap, sell at the peak", "Override any time you want"],
    },
    {
      screen: "alerts",
      Icon: BellRing,
      flip: true,
      h: "Smart alerts, zero babysitting",
      p: "It runs quietly in the background and only pings you when it matters — a cheap window ahead, a full battery, or changing weather.",
      list: ["Price & weather notifications", "Proactive, plain-language tips", "You stay fully in control"],
    },
  ];
  return (
    <Section
      id="app"
      eyebrow="The GBICT app"
      title="Your energy, in your hands"
      sub="Everything visible, everything in control — straight from your phone."
    >
      <div className="showcase">
        {rows.map((r, i) => (
          <div className={"show-row" + (r.flip ? " flip" : "")} key={i}>
            <div className="show-copy reveal">
              <div className="show-ico">
                <r.Icon className="lucide" />
              </div>
              <h3>{r.h}</h3>
              <p>{r.p}</p>
              <ul className="show-list">
                {r.list.map((li) => (
                  <li key={li}>
                    <Check className="lucide" /> {li}
                  </li>
                ))}
              </ul>
            </div>
            <div className="show-vis reveal d1">
              <PhoneApp screen={r.screen} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Features ---------- */

function Features() {
  const items = [
    { Icon: Zap, title: "Dynamic price optimization", desc: "AI analyzes EPEX spot prices every hour and automatically picks the cheapest moment to charge — without you lifting a finger." },
    { Icon: BatteryCharging, title: "Hardware-agnostic", desc: "Works with Sessy, Victron, SolarEdge, Enphase and more. One platform, no vendor lock-in, no surprises." },
    { Icon: Radio, title: "Tibber integration", desc: "Direct link to your dynamic contract and real-time spot prices." },
    { Icon: Sun, title: "Solar priority", desc: "Charges on your own sun first, then the cheapest grid hours." },
    { Icon: Lock, title: "Your data", desc: "On-premise processing. No data resale, no surprises." },
    { Icon: LineChart, title: "Real-time dashboard", desc: "Live insight into savings, battery status and energy prices — all on one screen, continuously updated. See exactly what GBICT earns you, every hour of the day." },
  ];
  const Wide = items[5];
  return (
    <Section
      id="features"
      eyebrow="Integrations & features"
      title="Everything that makes your battery smart"
      sub="One platform that lets your hardware, your contract and the market talk to each other."
    >
      <div className="feat-rows">
        <div className="feat-row-2">
          {items.slice(0, 2).map((f) => (
            <div className="feat feat-lg" key={f.title}>
              <span className="ic-left">
                <f.Icon className="lucide" />
              </span>
              <div>
                <div className="ftitle">{f.title}</div>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="feat-row-3">
          {items.slice(2, 5).map((f) => (
            <div className="feat" key={f.title}>
              <div className="ftitle">
                <f.Icon className="lucide" />
                {f.title}
              </div>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="feat feat-wide">
          <div className="wmeta">
            <div className="ftitle">
              <Wide.Icon className="lucide" />
              {Wide.title}
            </div>
          </div>
          <p>{Wide.desc}</p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- How it works ---------- */

function HowItWorks() {
  const steps = [
    { title: "Connect your devices", desc: "Link Tibber, Sessy or your inverter in 2 minutes." },
    { title: "AI optimizes automatically", desc: "GBICT analyzes spot prices and steers your battery." },
    { title: "Save in real time", desc: "The dashboard shows live how much you save — every day." },
  ];
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Up and running in 3 steps"
      sub="No technical knowledge needed. Connect, lean back, save."
    >
      <div className="steps">
        {steps.map((s, i) => (
          <div className="step" key={s.title}>
            <div className="circle">{i + 1}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Pricing ---------- */

type Plan = {
  name: string;
  tag: string;
  amount?: string;
  period?: string;
  custom?: string;
  popular?: boolean;
  features: string[];
  cta: string;
  note: string;
};

function Pricing() {
  const plans: Plan[] = [
    {
      name: "Starter",
      tag: "Perfect to get started",
      amount: "€15",
      period: "/month",
      features: ["1 device", "Daily optimization", "Email support", "Basic dashboard"],
      cta: "Start free trial",
      note: "Billed monthly · cancel anytime",
    },
    {
      name: "Pro",
      tag: "For serious home energy owners",
      amount: "€25",
      period: "/month",
      popular: true,
      features: ["Unlimited devices", "Hourly optimization", "VPP access", "Priority support", "Advanced analytics", "API access"],
      cta: "Start 14-day free trial",
      note: "Billed monthly · cancel anytime",
    },
    {
      name: "Business",
      tag: "For installers & property managers",
      custom: "Custom",
      features: ["Multiple locations", "White-label option", "Dedicated SLA", "Custom integrations", "Account manager", "Volume pricing"],
      cta: "Contact sales",
      note: "Annual contract · volume discounts available",
    },
  ];
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Start free, scale when you want"
      sub="No hidden fees. Cancel anytime."
    >
      <div className="price-grid">
        {plans.map((p) => (
          <div className={"glass-card price" + (p.popular ? " hi" : "")} key={p.name}>
            {p.popular && <span className="rec">Most popular</span>}
            <div className="pname">{p.name}</div>
            <div className="ptag">{p.tag}</div>
            <div className="amt">
              {p.custom ? (
                p.custom
              ) : (
                <>
                  {p.amount}
                  <small>{p.period}</small>
                </>
              )}
            </div>
            <ul className="feats">
              {p.features.map((ft) => (
                <li key={ft}>
                  <Check className="lucide" />
                  {ft}
                </li>
              ))}
            </ul>
            <a className={"btn price-btn " + (p.popular ? "btn-primary" : "btn-glass")} href="/signup">
              <span>{p.cta}</span>
            </a>
            <div className="pnote">{p.note}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Security ---------- */

function Security() {
  const cards = [
    { Icon: ShieldCheck, h: "Security by design", p: "Your data, devices and privacy protected to the strictest European standards from the ground up." },
    { Icon: Lock, h: "End-to-end encrypted", p: "All traffic between your devices and the GBICT cloud is encrypted. We process only what's strictly needed." },
    { Icon: Server, h: "EU-hosted cloud", p: "Runs on European infrastructure in a strictly secured cloud, continuously tested for vulnerabilities." },
    { Icon: UserCheck, h: "No external access", p: "No uncontrolled third-party connections to your devices. Your system stays inside GBICT's protected environment." },
  ];
  return (
    <Section
      id="security"
      eyebrow="Security & privacy"
      title="Digital security you can trust"
      sub="Smart energy, built on a foundation you don't have to think about."
    >
      <div className="sec-grid">
        {cards.map((c, i) => (
          <div className={"sec-card reveal d" + ((i % 4) + 1)} key={c.h}>
            <div className="sico">
              <c.Icon className="lucide" />
            </div>
            <h4>{c.h}</h4>
            <p>{c.p}</p>
          </div>
        ))}
      </div>
      <div className="sec-badges">
        <span className="sb">
          <BadgeCheck className="lucide" /> ISO 27001
        </span>
        <span className="sb">
          <Lock className="lucide" /> End-to-end encrypted
        </span>
        <span className="sb">
          <Globe className="lucide" /> EU data residency
        </span>
        <span className="sb">
          <Shield className="lucide" /> GDPR compliant
        </span>
      </div>
    </Section>
  );
}

/* ---------- Brands marquee ---------- */

function Brands() {
  const brands: [string, string][] = [
    ["Sessy", "Battery"], ["Victron", "Inverter"], ["SolarEdge", "Inverter"],
    ["Enphase", "Micro-inv."], ["Fronius", "Inverter"], ["Tibber", "Contract"],
    ["SMA", "Inverter"], ["Huawei", "Inverter"], ["Alfen", "EV charger"],
    ["Sigenergy", "Battery"], ["Wallbox", "EV charger"], ["Growatt", "Inverter"],
  ];
  const loop = brands.concat(brands);
  return (
    <Section
      id="integrations"
      eyebrow="Brand independent"
      title="Works with what you already own"
      sub="No vendor lock-in. GBICT speaks to the leading batteries, inverters and chargers."
    >
      <div className="brands-wrap">
        <div className="brands-track">
          {loop.map((b, i) => (
            <div className="brand-pill" key={i}>
              <span className="dot" />
              <span className="nm">{b[0]}</span>
              <span className="cat">{b[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Big CTA ---------- */

function BigCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-wrap">
          <h2>Ready to save automatically?</h2>
          <p>Connect your battery in 2 minutes. No technical knowledge needed.</p>
          <a className="btn btn-primary btn-lg" href="/signup">
            <span>Start 14-day free trial</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Product", [["Dashboard", "/dashboard"], ["Pricing", "#pricing"]]],
    ["Company", [["Contact", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]],
    ["Compatible with", [["Sessy", "#integrations"], ["Tibber", "#integrations"], ["Victron", "#integrations"], ["SolarEdge", "#integrations"], ["Enphase", "#integrations"], ["Fronius", "#integrations"]]],
  ];
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <Brand size={32} />
            <p>The operating system for your home energy.</p>
            <div className="foot-social">
              {[Share2, LinkIcon, GitFork].map((Ic, i) => (
                <a key={i} href="#" aria-label="GBICT">
                  <Ic className="lucide" />
                </a>
              ))}
            </div>
          </div>
          {cols.map(([h, links]) => (
            <div className="foot-col" key={h}>
              <h4>{h}</h4>
              {links.map(([label, href]) => (
                <a href={href} key={label}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <span>© 2026 GBICT Energy · Almere, Netherlands</span>
          <div className="links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

export default function Page() {
  const native = useIsNative();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);

  // In the native app there is no marketing site — go straight to the product.
  useEffect(() => {
    if (native) router.replace("/dashboard");
  }, [native, router]);

  // Scroll-reveal — adds .in to .reveal elements as they enter the viewport.
  // Respects prefers-reduced-motion (the CSS already disables the animation,
  // but we still add .in so the content is visible).
  useEffect(() => {
    if (native) return;
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [native]);

  // Pointer parallax on the hero stage (desktop, fine pointer, motion allowed).
  useEffect(() => {
    if (native) return;
    const root = rootRef.current;
    if (!root) return;
    const inner = root.querySelector<HTMLElement>(".stage-inner");
    const hero = root.querySelector<HTMLElement>(".hero-x");
    if (!inner || !hero) return;
    const fine = window.matchMedia("(min-width:981px) and (pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (!fine || reduce) {
      inner.style.transform = "";
      return;
    }
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `translate(${x * -24}px, ${y * -18}px)`;
    };
    const onLeave = () => {
      inner.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [native]);

  if (native) {
    // Dark holding screen while redirecting (hidden behind the native splash).
    return <main className="min-h-screen bg-[#07080D]" />;
  }

  return (
    <main className="dark gbict-landing" ref={rootRef}>
      <div className="bg-grid" />
      <div className="bg-glow glow-hero" />
      <div className="bg-glow glow-violet" />
      <Nav />
      <Hero />
      <Metrics />
      <ProblemSolution />
      <Calculator />
      <AppShowcase />
      <Features />
      <HowItWorks />
      <Pricing />
      <Security />
      <Brands />
      <BigCTA />
      <Footer />
    </main>
  );
}
