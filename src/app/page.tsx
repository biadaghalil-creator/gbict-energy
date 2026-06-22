"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Zap, Plug, BrainCircuit, WalletMinimal, TrendingDown, TrendingUp,
  CloudSun, ShieldCheck, Activity, LineChart, CalendarClock, Bell, Check, Minus,
  Sun, Home, BatteryFull,
} from "lucide-react";

/* ============================================================
   GBICT Energy — landing page (v2, "Grid" direction, English)
   Faithful port of the v2 standalone design. White, technical,
   lime accent. Styles live in globals.css scoped under
   .gbict-landing[data-dir="grid"].
   ============================================================ */

/* ---------- Content ---------- */
const GB = {
  nav: [
    { label: "How it works", href: "#how" },
    { label: "Savings", href: "#calculator" },
    { label: "App", href: "#app" },
    { label: "Pricing", href: "#pricing" },
  ],
  hero: {
    eyebrow: "Smart home energy · hardware-agnostic",
    h1a: "Your battery, solar and energy contract,",
    key: "finally working together.",
    lead: "GBICT Energy connects your home battery, solar panels and dynamic energy contract into one platform that charges, stores and sells power at exactly the right moment — automatically lowering your bill, every single day.",
    trust: ["Works with any battery", "No installer needed", "Live in 5 minutes"],
  },
  stats: [
    { n: "€420", u: "", l: "Avg. saved per year*" },
    { n: "78", u: "%", l: "Self-sufficiency reached" },
    { n: "24/7", u: "", l: "Autonomous optimization" },
    { n: "100%", u: "", l: "Hardware agnostic" },
  ],
  how: {
    eyebrow: "How it works",
    h2a: "Set it once. It ",
    key: "saves while you sleep.",
    lead: "Connect your devices, set your preferences, and GBICT does the rest — reacting to energy prices, weather and your usage in real time.",
    steps: [
      { ic: "plug", num: "01", t: "Connect your home", p: "Link your battery, inverter and dynamic contract in minutes. We support every major brand — no new hardware required." },
      { ic: "brain-circuit", num: "02", t: "We learn your patterns", p: "GBICT studies your usage, your solar yield and tomorrow's prices to build an optimal charge-and-sell plan for your home." },
      { ic: "wallet-minimal", num: "03", t: "You save automatically", p: "Charge when power is cheap, run on your own sun, sell back at peak. Every decision runs on autopilot, 24/7." },
    ],
    feats: [
      { ic: "trending-down", b: "Buys low, sells high", s: "Reacts to dynamic prices down to the quarter-hour." },
      { ic: "cloud-sun", b: "Weather-aware", s: "Forecasts solar yield to never waste a sunny day." },
      { ic: "shield-check", b: "Always in control", s: "Set limits and overrides — your home, your rules." },
    ],
  },
  calc: {
    eyebrow: "Savings calculator",
    h2a: "See what GBICT could ",
    key: "save you.",
    lead: "Drag the sliders to match your home. The estimate updates live.",
  },
  app: {
    eyebrow: "In your pocket",
    h2a: "Your whole energy system, ",
    key: "in one calm app.",
    lead: "Live flow, savings, schedule and smart alerts — designed to be glanced at, not studied.",
    feats: [
      { ic: "activity", t: "Live energy flow", p: "Watch solar, battery and the grid move through your home in real time." },
      { ic: "line-chart", t: "Savings you can see", p: "Every euro the platform earns you, broken down by how it earned it." },
      { ic: "calendar-clock", t: "Tomorrow's plan", p: "See exactly when GBICT will charge, hold and sell — before it happens." },
      { ic: "bell", t: "Calm, useful alerts", p: "Only the notifications that matter: cheap windows, full battery, sunny days." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    h2a: "Start with ",
    key: "14 days free.",
    lead: "No hardware lock-in, no contracts. Cancel any time.",
    plans: [
      { plan: "Starter", amt: "€15", per: "/mo", tag: "Automatic savings for a single battery.", feat: false,
        items: [["1 battery + 1 meter", 1], ["Automatic price optimization", 1], ["Savings overview", 1], ["Solar-panel optimization", 0], ["VPP / virtual power plant", 0], ["Priority support", 0]] as [string, number][] },
      { plan: "Pro", amt: "€25", per: "/mo", tag: "Full optimization for your whole home.", feat: true,
        items: [["Unlimited devices", 1], ["Automatic price optimization", 1], ["Solar-panel optimization", 1], ["VPP / virtual power plant", 1], ["Priority support", 1]] as [string, number][] },
    ],
  },
  cta: {
    h2a: "Make your home ",
    key: "an energy asset.",
    lead: "Join thousands of Dutch households turning batteries, sun and smart timing into real savings.",
  },
  footer: {
    desc: "The operating system for home energy. Connecting batteries, solar and the grid into one intelligent, hardware-agnostic platform.",
    cols: [
      { h: "Product", links: [
        { t: "How it works", href: "#how" },
        { t: "Savings calculator", href: "#calculator" },
        { t: "The app", href: "#app" },
        { t: "Pricing", href: "#pricing" },
      ] },
      { h: "Company", links: [
        { t: "About GBICT", href: "/about" },
        { t: "Contact", href: "/contact" },
        { t: "info@gbict.nl", href: "mailto:info@gbict.nl" },
      ] },
      { h: "Legal", links: [
        { t: "Privacy Policy", href: "/privacy" },
        { t: "Terms of Service", href: "/terms" },
      ] },
    ],
  },
};

/* ---------- Icons ---------- */
const ICONS: Record<string, typeof Zap> = {
  "arrow-right": ArrowRight, zap: Zap, plug: Plug, "brain-circuit": BrainCircuit,
  "wallet-minimal": WalletMinimal, "trending-down": TrendingDown, "trending-up": TrendingUp,
  "cloud-sun": CloudSun, "shield-check": ShieldCheck, activity: Activity, "line-chart": LineChart,
  "calendar-clock": CalendarClock, bell: Bell, check: Check, minus: Minus, sun: Sun,
  house: Home, "battery-full": BatteryFull,
};
function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Zap;
  return <Cmp className={className} />;
}

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---------- Mockups ---------- */
function FlowChart({ h = 120 }: { h?: number }) {
  return (
    <svg viewBox="0 0 320 120" preserveAspectRatio="none" style={{ height: h }}>
      <defs>
        <linearGradient id="fcSolar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(var(--accent-rgb),.32)" />
          <stop offset="100%" stopColor="rgba(var(--accent-rgb),0)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="40" x2="320" y2="40" stroke="var(--border)" strokeWidth="1" />
      <line x1="0" y1="78" x2="320" y2="78" stroke="var(--border)" strokeWidth="1" />
      <path d="M0,100 C50,100 78,52 116,40 C146,30 168,28 192,34 C228,44 262,72 320,96 L320,120 L0,120 Z" fill="url(#fcSolar)" />
      <path d="M0,100 C50,100 78,52 116,40 C146,30 168,28 192,34 C228,44 262,72 320,96" fill="none" stroke="var(--accent)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      <path d="M0,84 C30,74 52,78 80,82 C112,87 132,66 164,62 C200,57 226,48 258,52 C284,55 304,64 320,62" fill="none" stroke="var(--fg-3)" strokeWidth="1.6" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function DashboardMock() {
  return (
    <div className="dash">
      <div className="dash-bar">
        <div className="dotrow"><i></i><i></i><i></i></div>
        <span className="tag">gbict.energy / home · live</span>
      </div>
      <div className="dash-body">
        <div className="dash-cell">
          <div className="lbl">Saved this month</div>
          <div className="big">€38<span className="sm">.20</span></div>
          <div className="delta"><Icon name="trending-up" /> +18% vs. last month</div>
          <div className="bars">
            {[34, 52, 40, 66, 48, 80, 60, 44, 72].map((v, i) => (
              <i key={i} className={i === 6 ? "hot" : ""} style={{ height: v + "%" }}></i>
            ))}
          </div>
        </div>
        <div className="dash-cell">
          <div className="lbl">Self-sufficiency</div>
          <div className="big">78<span className="sm">%</span></div>
          <div className="delta"><Icon name="sun" /> running on your sun</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--fg-2)" }}>
              <span>Battery</span><span className="mono" style={{ color: "var(--accent)" }}>84%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "var(--border-2)", overflow: "hidden" }}>
              <div style={{ width: "84%", height: "100%", background: "var(--accent)" }}></div>
            </div>
          </div>
        </div>
        <div className="dash-cell dash-chart">
          <div className="lbl">Today · solar vs. home use</div>
          <FlowChart h={120} />
          <div className="dash-legend">
            <span><i style={{ background: "var(--accent)" }}></i> Solar generation</span>
            <span><i style={{ background: "var(--fg-3)" }}></i> Home use</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneApp({ screen = "flow" }: { screen?: string }) {
  return (
    <div className="phone-screen">
      <div className="phone-notch"></div>
      <div className="pa">
        <div className="pa-top">
          <div className="hi">Good evening<b>Your home · live</b></div>
          <div className="av"></div>
        </div>

        {screen === "flow" && <>
          <div className="pa-card">
            <div className="l">Today · solar vs. use</div>
            <svg className="chart" viewBox="0 0 280 56" preserveAspectRatio="none">
              <defs><linearGradient id="paS" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(var(--accent-rgb),.34)" /><stop offset="100%" stopColor="rgba(var(--accent-rgb),0)" /></linearGradient></defs>
              <path d="M0,48 C40,48 64,22 96,16 C124,11 150,12 176,18 C210,26 244,40 280,46 L280,56 L0,56 Z" fill="url(#paS)" />
              <path d="M0,48 C40,48 64,22 96,16 C124,11 150,12 176,18 C210,26 244,40 280,46" fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="pa-card">
            <div className="l">Self-sufficiency now</div>
            <div className="num">78<span className="sm"> %</span></div>
            <div className="dl"><Icon name="trending-up" /> running on your own sun</div>
          </div>
        </>}

        {screen === "savings" && <>
          <div className="pa-card">
            <div className="l">Saved this month</div>
            <div className="num">€38<span className="sm">.20</span></div>
            <div className="dl"><Icon name="trending-up" /> +18% vs. last month</div>
            <div className="pa-bars">
              {[34, 52, 40, 66, 48, 80, 60].map((v, i) => <i key={i} className={i === 5 ? "hot" : ""} style={{ height: v + "%" }}></i>)}
            </div>
          </div>
          <div className="pa-card">
            <div className="pa-row"><span className="t">Cheap-hour charging</span><b>€42.10</b></div>
            <div className="pa-row"><span className="t">Peak-hour selling</span><b>€21.30</b></div>
            <div className="pa-row"><span className="t">Solar self-use</span><b>€8.00</b></div>
          </div>
        </>}

        {screen === "schedule" && <>
          <div className="pa-card">
            <div className="l">Today · optimization plan</div>
            <div className="pa-bars" style={{ height: 48 }}>
              {([["ok", 40], ["ok", 58], ["idle", 30], ["idle", 44], ["ok", 62], ["sell", 84], ["sell", 96], ["idle", 46], ["ok", 54], ["ok", 66], ["idle", 36], ["ok", 50]] as [string, number][]).map(([s, v], i) =>
                <i key={i} style={{ height: v + "%", background: s === "ok" ? "var(--accent)" : s === "sell" ? "#fbbf24" : "var(--border-2)" }}></i>)}
            </div>
          </div>
          <div className="pa-card">
            <div className="pa-row"><span className="t">02:00 – 06:00</span><span className="pa-mini ok">Charge cheap</span></div>
            <div className="pa-row"><span className="t">12:00 – 15:00</span><span className="pa-mini ok">Solar charge</span></div>
            <div className="pa-row"><span className="t">18:00 – 20:00</span><span className="pa-mini sell">Sell peak</span></div>
          </div>
        </>}

        {screen === "alerts" && <>
          <div className="pa-card pa-alert">
            <span className="ic"><Icon name="trending-down" /></span>
            <div><b>Cheap window ahead</b><p>Prices drop to €0.04/kWh at 02:00 — charging scheduled.</p></div>
          </div>
          <div className="pa-card pa-alert">
            <span className="ic"><Icon name="battery-full" /></span>
            <div><b>Battery full</b><p>100% reached before the evening peak. Ready to sell.</p></div>
          </div>
          <div className="pa-card pa-alert">
            <span className="ic"><Icon name="cloud-sun" /></span>
            <div><b>Sunny tomorrow</b><p>Forecast +6 kWh solar — plan adjusted automatically.</p></div>
          </div>
        </>}

        <div className="pa-nav">
          <Icon name="house" className={screen === "flow" ? "on" : ""} />
          <Icon name="line-chart" className={screen === "savings" ? "on" : ""} />
          <Icon name="calendar-clock" className={screen === "schedule" ? "on" : ""} />
          <Icon name="bell" className={screen === "alerts" ? "on" : ""} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <a className="brand" href="#top"><span className="mark"><Logo /></span> GBICT Energy</a>
        <div className="nav-links">
          {GB.nav.map((n, i) => <a key={i} href={n.href}>{n.label}</a>)}
        </div>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="/start">Log in</a>
          <a className="btn btn-primary" href="#pricing">Get started</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const d = GB.hero, s = GB.stats;
  return (
    <header className="hero section" id="top">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow reveal">{d.eyebrow}</p>
            <h1 className="display reveal d1">{d.h1a} <span className="key">{d.key}</span></h1>
            <p className="lead reveal d2">{d.lead}</p>
            <div className="hero-cta reveal d3">
              <a className="btn btn-primary btn-lg" href="#calculator">Calculate my savings <Icon name="arrow-right" /></a>
              <a className="btn btn-ghost btn-lg" href="#how">How it works</a>
            </div>
            <div className="hero-trust reveal d3">
              {d.trust.map((t, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
                {i > 0 && <span className="dot"></span>}<span>{t}</span>
              </span>)}
            </div>
          </div>
          <div className="hero-visual reveal d2" style={{ position: "relative" }}>
            <DashboardMock />
            <div className="dash-float glass">
              <span className="ic"><Icon name="zap" /></span>
              <div>
                <div className="v">€0.04<span style={{ fontSize: 12, color: "var(--fg-3)" }}>/kWh</span></div>
                <div className="k">Charging now</div>
              </div>
            </div>
          </div>
        </div>
        <div className="statband reveal">
          {s.map((x, i) => <div className="st" key={i}>
            <div className="n">{x.n}<span className="u">{x.u}</span></div>
            <div className="l">{x.l}</div>
          </div>)}
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  const d = GB.how;
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal" style={{ justifyContent: "center", display: "inline-flex" }}>{d.eyebrow}</p>
          <h2 className="h2 reveal d1">{d.h2a}<span className="key">{d.key}</span></h2>
          <p className="lead reveal d2">{d.lead}</p>
        </div>
        <div className="steps">
          {d.steps.map((s, i) => <div className={"step panel reveal d" + (i + 1)} key={i}>
            <div className="num">{s.num}</div>
            <div className="ic"><Icon name={s.ic} /></div>
            <h3 className="h3">{s.t}</h3>
            <p>{s.p}</p>
          </div>)}
        </div>
        <div className="featrow">
          {d.feats.map((f, i) => <div className={"f panel reveal d" + (i + 1)} key={i}>
            <Icon name={f.ic} />
            <div><b>{f.b}</b><span>{f.s}</span></div>
          </div>)}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const d = GB.calc;
  const [batt, setBatt] = useState(10);
  const [solar, setSolar] = useState(4);
  const [usage, setUsage] = useState("med");
  const usageF = ({ low: 0.8, med: 1, high: 1.35 } as Record<string, number>)[usage];
  // Per-kWh multipliers tuned so the DEFAULT sliders (batt 10, solar 4, usage med → usageF 1)
  // resolve to ~€420/yr — our canonical typical-savings figure:
  //   arbitrage 10*24*1 = 240 + solarOpt 4*30*1 = 120 + vpp 10*5 = 50 = €410.
  const arbitrage = Math.round(batt * 24 * usageF);
  const solarOpt = Math.round(solar * 30 * usageF);
  const vpp = Math.round(batt * 5);
  const total = arbitrage + solarOpt + vpp;
  return (
    <section className="section" id="calculator">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal" style={{ display: "inline-flex" }}>{d.eyebrow}</p>
          <h2 className="h2 reveal d1">{d.h2a}<span className="key">{d.key}</span></h2>
          <p className="lead reveal d2">{d.lead}</p>
        </div>
        <div className="calc panel reveal d1">
          <div className="calc-controls">
            <div className="calc-field">
              <div className="row"><label>Battery capacity</label><span className="val">{batt} kWh</span></div>
              <input type="range" min="3" max="30" step="1" value={batt} onChange={e => setBatt(+e.target.value)} />
            </div>
            <div className="calc-field">
              <div className="row"><label>Solar installation</label><span className="val">{solar} kWp</span></div>
              <input type="range" min="0" max="15" step="1" value={solar} onChange={e => setSolar(+e.target.value)} />
            </div>
            <div className="calc-field">
              <div className="row"><label>Household usage</label><span className="val">{usage === "low" ? "Low" : usage === "med" ? "Average" : "High"}</span></div>
              <div className="calc-seg">
                {["low", "med", "high"].map(k => <button key={k} className={usage === k ? "on" : ""} onClick={() => setUsage(k)}>
                  {k === "low" ? "Low" : k === "med" ? "Average" : "High"}</button>)}
              </div>
            </div>
          </div>
          <div className="calc-result">
            <div className="rlabel">Estimated yearly saving</div>
            <div className="rbig"><span className="cur">€</span>{total}</div>
            <div className="rsub">≈ €{Math.round(total / 12)} every month, fully automatic.</div>
            <div className="rrow"><span className="t">Smart price arbitrage</span><b>€{arbitrage}</b></div>
            <div className="rrow"><span className="t">Solar self-optimization</span><b>€{solarOpt}</b></div>
            <div className="rrow"><span className="t">Virtual power plant</span><b>€{vpp}</b></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppShowcase() {
  const d = GB.app;
  const screens = ["flow", "savings", "schedule", "alerts"];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive(a => (a + 1) % screens.length), 5000);
    return () => clearTimeout(t);
  }, [active, paused, screens.length]);
  return (
    <section className="section" id="app">
      <div className="container">
        <div className="showcase-grid">
          <div className="phones reveal" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="phone back"><PhoneApp screen="savings" /></div>
            <div className="phone front">
              <div className="screen-stack">
                {screens.map((s, i) => (
                  <div key={s} className={"screen-layer" + (active === i ? " on" : "")} aria-hidden={active !== i}>
                    <PhoneApp screen={s} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="showcase-copy">
            <p className="eyebrow reveal">{d.eyebrow}</p>
            <h2 className="h2 reveal d1">{d.h2a}<span className="key">{d.key}</span></h2>
            <p className="lead reveal d2" style={{ marginBottom: 28 }}>{d.lead}</p>
            <div className="app-feats reveal d2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {d.feats.map((f, i) => <div key={i} className={"app-feat" + (active === i ? " on" : "")} onClick={() => setActive(i)}>
                <div className="ttl"><Icon name={f.ic} /> {f.t}</div>
                <p>{f.p}</p>
                {active === i && <span className="feat-prog" key={active} style={{ animationPlayState: paused ? "paused" : "running" }}></span>}
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const d = GB.pricing;
  return (
    <section className="section" id="pricing">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal" style={{ display: "inline-flex" }}>{d.eyebrow}</p>
          <h2 className="h2 reveal d1">{d.h2a}<span className="key">{d.key}</span></h2>
          <p className="lead reveal d2">{d.lead}</p>
        </div>
        <div className="price-grid price-grid--two">
          {d.plans.map((p, i) => <div className={"price panel reveal d" + (i + 1) + (p.feat ? " feat" : "")} key={i}>
            {p.feat && <span className="ribbon">Most popular</span>}
            <div className="plan">{p.plan}</div>
            <div className="amt">{p.amt}<span className="per">{p.per}</span></div>
            <div className="ptag">{p.tag}</div>
            <ul>
              {p.items.map(([txt, on], j) => <li key={j} className={on ? "" : "off"}>
                <Icon name={on ? "check" : "minus"} /> {txt}
              </li>)}
            </ul>
            <a className={"btn " + (p.feat ? "btn-primary" : "btn-ghost")} href="/start">Choose {p.plan}</a>
          </div>)}
        </div>
        <p className="price-note">14 days free · no credit card required · cancel any time</p>
      </div>
    </section>
  );
}

function FinalCTA() {
  const d = GB.cta;
  return (
    <section className="section tight">
      <div className="container">
        <div className="cta-final panel reveal">
          <h2 className="display">{d.h2a}<span className="key">{d.key}</span></h2>
          <p className="lead">{d.lead}</p>
          <div className="hero-cta">
            <a className="btn btn-primary btn-lg" href="#calculator">Calculate my savings <Icon name="arrow-right" /></a>
            <a className="btn btn-ghost btn-lg" href="#how">See how it works</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const d = GB.footer;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a className="brand" href="#top"><span className="mark"><Logo /></span> GBICT Energy</a>
            <p className="fdesc">{d.desc}</p>
          </div>
          {d.cols.map((c, i) => <div className="fcol" key={i}>
            <h4>{c.h}</h4>
            {c.links.map((l, j) => <a key={j} href={l.href}>{l.t}</a>)}
          </div>)}
        </div>
        <div className="footer-bot">
          <span>© 2026 GBICT Energy · Made in the Netherlands</span>
          <span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/privacy">Cookies</a></span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Ambient hero energy-flow canvas ---------- */
function useEnergyFlow(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, t = 0, raf = 0, running = true;
    let parts: { x: number; y: number; z: number; life: number }[] = [];
    const bg = "255,255,255", acc = "77,124,15"; // grid direction
    const spawn = (any: boolean) => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random(), life: (any ? Math.random() : 1) * 220 + 40 });
    const angle = (x: number, y: number) =>
      (Math.sin(x * 0.0019 + t * 0.00035) + Math.cos(y * 0.0021 - t * 0.00028) + 0.6 * Math.sin((x + y) * 0.0012 + t * 0.0002)) * 1.35;
    const step = (fade: boolean) => {
      if (fade) { ctx.fillStyle = "rgba(" + bg + ",0.055)"; ctx.fillRect(0, 0, w, h); }
      ctx.lineCap = "round";
      for (const p of parts) {
        const a = angle(p.x, p.y);
        const sp = 0.5 + p.z * 1.6;
        const nx = p.x + Math.cos(a) * sp, ny = p.y + Math.sin(a) * sp;
        ctx.strokeStyle = "rgba(" + acc + "," + (0.1 + p.z * 0.34).toFixed(3) + ")";
        ctx.lineWidth = 0.55 + p.z * 2.0;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny; p.life -= 1;
        if (p.life < 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) Object.assign(p, spawn(false));
      }
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(420, Math.round((w * h) / 2900));
      parts = [];
      for (let i = 0; i < n; i++) parts.push(spawn(true));
      ctx.fillStyle = "rgb(" + bg + ")"; ctx.fillRect(0, 0, w, h);
      for (let k = 0; k < 120; k++) step(false);
    };
    const loop = () => { if (!running) return; t += 16; step(true); raf = requestAnimationFrame(loop); };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [ref]);
}

/* ---------- Scroll reveal ---------- */
function useReveal() {
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("anim-ok")));
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".gbict-landing .reveal:not(.in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
}

export default function Page() {
  const flowRef = useRef<HTMLCanvasElement>(null);
  useEnergyFlow(flowRef);
  useReveal();
  return (
    <div className="gbict-landing" data-dir="grid" data-motion="on">
      <div className="atmos">
        <canvas className="page-flow" ref={flowRef} aria-hidden="true"></canvas>
        <div className="glow g1"></div>
        <div className="glow g2"></div>
        <div className="glow g3"></div>
      </div>
      <div className="wrap">
        <Nav />
        <Hero />
        <HowItWorks />
        <Calculator />
        <AppShowcase />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
