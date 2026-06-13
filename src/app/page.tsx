"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Check, Menu, Globe, ChevronDown, X,
  ArrowUpRight, Share2, Link as LinkIcon, GitFork,
} from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useIsNative } from "@/lib/native";

/* ============================================================
   GBICT Energy — landing page (Next.js App Router page.tsx)
   Re-skinned to the "Auros" abyssal-teal trading-terminal look.
   Always dark. Scoped CSS lives under .gbict-landing in globals.css.
   English copy only. Card is captured at signup (no "no card" claims).
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

/* Eyebrow: 6px teal dot + uppercase label */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span className="eyebrow-dot" />
      {children}
    </p>
  );
}

/* Corner ghost ↗ square used on Auros cards */
function CornerArrow() {
  return (
    <span className="corner-arrow" aria-hidden="true">
      <ArrowUpRight className="lucide" />
    </span>
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
              <span>Start free trial</span>
              <ArrowUpRight className="lucide" />
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
              <span>Start free trial</span>
              <ArrowUpRight className="lucide" />
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
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 className="section-title">{title}</h2>}
            {sub && <p className="section-sub">{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------- Auros signature: particle sphere (hero centerpiece) ---------- */

function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    // Build a roughly even point distribution on a sphere (Fibonacci sphere).
    const N = 850;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2; // -1..1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    let raf = 0;
    let angle = 0;
    let w = 0, h = 0, dpr = 1, R = 0, cx = 0, cy = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w, h) * 0.42;
      cx = w / 2;
      cy = h / 2;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      // Tilt the sphere slightly so it reads as 3D.
      const tilt = 0.42;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // rotate around Y
        let x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        // tilt around X
        const yy = p.y * cosT - z * sinT;
        z = p.y * sinT + z * cosT;
        x = x;

        const depth = (z + 1) / 2; // 0 (back) .. 1 (front)
        const sx = cx + x * R;
        const sy = cy + yy * R;
        const size = 0.5 + depth * 1.7;
        const alpha = 0.12 + depth * 0.78;

        // teal -> cyan glow front-to-back
        const g = Math.round(130 + depth * 95);
        const b = Math.round(124 + depth * 90);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }
      angle += 0.0016;
    };

    const tick = () => {
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw(); // static frame
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="sphere-wrap" aria-hidden="true">
      <div className="sphere-halo" />
      <canvas ref={canvasRef} className="sphere-canvas" />
    </div>
  );
}

/* ---------- Auros signature: sparse node-network decoration ---------- */

function NodeNetwork({ className = "" }: { className?: string }) {
  // Organic (not a grid) cluster of nodes joined by thin lines.
  const nodes: [number, number][] = [
    [12, 30], [28, 14], [40, 44], [58, 22], [72, 52],
    [86, 30], [22, 70], [48, 78], [66, 88], [90, 70], [6, 56],
  ];
  const links: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [8, 9], [4, 9], [0, 10], [10, 6],
  ];
  return (
    <svg className={"node-net " + className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.4 : 0.9} />
      ))}
    </svg>
  );
}

/* ---------- Hero (Auros stage) ---------- */

function Hero() {
  return (
    <section className="hero-x" id="top" data-hero="stage">
      {/* Particle sphere — the brand centerpiece, floating large behind the text */}
      <div className="hero-sphere parallax" aria-hidden="true">
        <div className="stage-inner">
          <ParticleSphere />
        </div>
      </div>
      <NodeNetwork className="hero-net" />
      <div className="container">
        <div className="hero-copy reveal in">
          <Eyebrow>GBICT Energy</Eyebrow>
          <h1 className="hero-head">
            {"The smartest way to make your battery work for you"
              .split(" ")
              .flatMap((word, i, arr) => [
                <span className="w" key={i}>
                  <span style={{ animationDelay: `${0.15 + i * 0.07}s` }}>{word}</span>
                </span>,
                i < arr.length - 1 ? <span key={`s${i}`}> </span> : null,
              ])}
          </h1>
          <p className="sub">
            Connect any home battery to any dynamic energy contract. GBICT optimizes
            automatically — charge cheap, sell expensive.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary btn-lg" href="/signup">
              <span>Start 14-day free trial</span>
              <ArrowUpRight className="lucide" />
            </a>
            <a className="btn btn-ghost-aurora btn-lg" href="#how">
              <span>How it works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 1 · Statement band ("We optimize") ---------- */

function Statement() {
  return (
    <section className="section">
      <div className="container">
        <div className="statement reveal">
          <Eyebrow>We optimize</Eyebrow>
          <h2 className="statement-head">
            Your home energy,
            <br />
            <em>on autopilot</em>
          </h2>
          <p className="statement-body">
            GBICT connects any home battery to any dynamic energy contract and
            steers it automatically — charging when power is cheap, selling when
            it peaks.
          </p>
          <a className="text-link" href="#explore">
            Explore <ArrowUpRight className="lucide" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2 · Explore cards ("What GBICT does") ---------- */

function Explore() {
  const cards: [string, string][] = [
    [
      "Dynamic price optimization",
      "GBICT analyzes EPEX spot prices every hour and automatically charges at the cheapest moment, then sells when prices peak. Fully hands-off.",
    ],
    [
      "Hardware-agnostic",
      "Works with Sessy, Victron, SolarEdge, Enphase, Tibber and more. One platform, no vendor lock-in, no surprises.",
    ],
    [
      "Solar priority",
      "Charges on your own sun first, then tops up in the cheapest grid hours of the day.",
    ],
    [
      "Your data stays yours",
      "On-device processing. No data resale, GDPR-compliant by design.",
    ],
  ];
  return (
    <Section id="explore" eyebrow="Explore" title="What GBICT does">
      <div className="explore-grid">
        {cards.map(([h, p], i) => (
          <div className={"explore-card reveal d" + ((i % 4) + 1)} key={h}>
            <CornerArrow />
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 3 · Stats band ("GBICT in numbers") ---------- */

function Stats() {
  const stats: [string, string, boolean][] = [
    ["€847", "average saved per year", true],
    ["< 2 min", "to connect your first device", false],
    ["24/7", "automatic optimization", false],
    ["98%", "uptime guarantee", false],
  ];
  return (
    <Section
      eyebrow="Stats"
      title="GBICT in numbers"
      sub="One platform connecting your hardware, your contract and the market."
    >
      <div className="stats-band reveal">
        {stats.map(([n, l, accent]) => (
          <div className="stat" key={l}>
            <div className={"stat-num" + (accent ? " accent" : "")}>{n}</div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 4 · Two-column band ("How it works") ---------- */

function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="how-grid">
          <div className="how-copy reveal">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="section-title how-title">Up and running in minutes</h2>
            <p className="how-body">
              Connect your battery or dynamic contract, then lean back. GBICT
              watches the market every hour and steers automatically — you just
              watch the savings add up.
            </p>
            <a className="btn btn-primary btn-lg" href="/signup">
              <span>Start free trial</span>
              <ArrowUpRight className="lucide" />
            </a>
          </div>
          <div className="how-vis reveal d1" aria-hidden="true">
            <NodeNetwork className="how-net" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5 · Integrations logo band ---------- */

function Integrations() {
  const names = [
    "Sessy", "Tibber", "Victron", "SolarEdge",
    "Enphase", "Fronius", "SMA", "EnergyZero",
  ];
  const loop = names.concat(names);
  return (
    <Section id="features" eyebrow="Integrations" title="Works with your setup">
      <div className="integ-wrap">
        <div className="integ-track">
          {loop.map((n, i) => (
            <span className="integ-chip" key={i}>
              <span className="dot" />
              {n}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- 6 · Pricing cards ---------- */

type Plan = {
  name: string;
  amount?: string;
  period?: string;
  custom?: string;
  popular?: boolean;
  features: string[];
  cta: string;
};

function Pricing() {
  const plans: Plan[] = [
    {
      name: "Starter",
      amount: "€15",
      period: "/month",
      features: ["1 device", "Daily optimization", "Email support", "Basic dashboard"],
      cta: "Start free trial",
    },
    {
      name: "Pro",
      amount: "€25",
      period: "/month",
      popular: true,
      features: ["Unlimited devices", "Hourly optimization", "VPP access", "Priority support", "Advanced analytics", "API access"],
      cta: "Start 14-day free trial",
    },
    {
      name: "Business",
      custom: "Custom",
      features: ["Multiple locations", "White-label option", "Dedicated SLA", "Custom integrations", "Account manager"],
      cta: "Contact sales",
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
          <div className={"price" + (p.popular ? " hi" : "")} key={p.name}>
            {p.popular && <span className="rec">Most popular</span>}
            <div className="pname">{p.name}</div>
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
            <a className={"btn price-btn " + (p.popular ? "btn-primary" : "btn-ghost-aurora")} href={p.cta === "Contact sales" ? "/contact" : "/signup"}>
              <span>{p.cta}</span>
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- 7 · Big CTA ---------- */

function BigCTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-wrap">
          <h2>Ready to make your battery work for you?</h2>
          <p>Connect in 2 minutes. No technical knowledge needed.</p>
          <a className="btn btn-primary btn-lg" href="/signup">
            <span>Start 14-day free trial</span>
            <ArrowUpRight className="lucide" />
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
    return <main className="min-h-screen bg-[#012624]" />;
  }

  return (
    <main className="dark gbict-landing" ref={rootRef}>
      <div className="bg-grid" />
      <div className="bg-glow glow-hero" />
      <div className="bg-glow glow-violet" />
      <Nav />
      <Hero />
      <Statement />
      <Explore />
      <Stats />
      <HowItWorks />
      <Integrations />
      <Pricing />
      <BigCTA />
      <Footer />
    </main>
  );
}
