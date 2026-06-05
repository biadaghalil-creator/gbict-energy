"use client";

import { useState } from "react";
import { Menu, Code2, Key, Zap, Database, TrendingUp, Settings, AlertCircle } from "lucide-react";

const NAV_LINKS = [
  ["How it works", "/#how"],
  ["Integrations", "/#features"],
  ["Pricing", "/#pricing"],
  ["Contact", "/contact"],
] as const;

const btnPrimary =
  "inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#5B21B6] hover:bg-[#6D28D9] " +
  "text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const METHOD_COLOR: Record<Method, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  PATCH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

function MethodBadge({ method }: { method: Method }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2.5 py-[3px] font-mono text-[12px] font-bold tracking-[0.04em] ${METHOD_COLOR[method]}`}>
      {method}
    </span>
  );
}

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#080910]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{lang}</span>
        <button onClick={copy} className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-[13.5px] leading-[1.7] text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  title,
  description,
  params,
  requestExample,
  responseExample,
  notes,
}: {
  method: Method;
  path: string;
  title: string;
  description: string;
  params?: { name: string; type: string; required: boolean; desc: string }[];
  requestExample?: string;
  responseExample: string;
  notes?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16]">
      <button
        className="flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-white/[0.02]"
        onClick={() => setOpen((o) => !o)}
      >
        <MethodBadge method={method} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-3">
            <code className="font-mono text-[15px] text-slate-100">{path}</code>
            <span className="text-[13px] text-slate-500">{title}</span>
          </div>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-slate-400">{description}</p>
        </div>
        <span className="shrink-0 text-[12px] text-slate-500 mt-1">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="border-t border-white/[0.06] p-6 space-y-6">
          {params && params.length > 0 && (
            <div>
              <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Parameters</h4>
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Name</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Type</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Required</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((p) => (
                      <tr key={p.name} className="border-b border-white/[0.06] last:border-b-0">
                        <td className="px-4 py-3"><code className="font-mono text-violet-300">{p.name}</code></td>
                        <td className="px-4 py-3 text-slate-400">{p.type}</td>
                        <td className="px-4 py-3">
                          {p.required
                            ? <span className="text-emerald-400">Yes</span>
                            : <span className="text-slate-500">No</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {requestExample && (
            <div>
              <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Request body</h4>
              <CodeBlock code={requestExample} />
            </div>
          )}
          <div>
            <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Response</h4>
            <CodeBlock code={responseExample} />
          </div>
          {notes && (
            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-[13.5px] leading-[1.5] text-slate-300">{notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07080D] font-sans text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="relative z-[2]">
        <Nav />

        <div className="mx-auto max-w-[1140px] px-6 py-20">
          {/* Header */}
          <div className="mb-16">
            <p className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-400">
              <span className="h-[3px] w-5 rounded-sm bg-violet-500" />
              Developer documentation
            </p>
            <h1 className="text-[clamp(40px,5.5vw,62px)] font-extrabold tracking-[-0.04em] text-slate-50">
              GBICT Energy API
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-slate-400">
              Programmatic access to your devices, savings data, and optimization controls. API access is available on Pro and Business plans.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <nav className="sticky top-[88px] space-y-1">
                {[
                  ["Getting started", "#getting-started"],
                  ["Authentication", "#auth"],
                  ["Base URL", "#base-url"],
                  ["Rate limits", "#rate-limits"],
                  ["Endpoints", "#endpoints"],
                  ["GET /devices", "#ep-devices"],
                  ["GET /savings", "#ep-savings"],
                  ["GET /prices", "#ep-prices"],
                  ["POST /optimize", "#ep-optimize"],
                  ["Errors", "#errors"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className={"block py-1.5 text-[13.5px] transition-colors " +
                      (href.startsWith("#ep") || href === "#endpoints"
                        ? "pl-4 text-slate-500 hover:text-slate-300"
                        : "text-slate-400 hover:text-slate-100")}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="min-w-0 space-y-14">

              {/* Getting started */}
              <section id="getting-started">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <Code2 className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Getting started</h2>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-8 space-y-5">
                  <p className="text-[15px] leading-[1.7] text-slate-400">
                    The GBICT Energy API uses REST conventions. All requests return JSON. Authentication is via a Bearer token passed in the <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">Authorization</code> header.
                  </p>
                  <p className="text-[15px] leading-[1.7] text-slate-400">
                    Generate your API token from <strong className="text-slate-300">Dashboard → Settings → API Keys</strong>. Treat tokens like passwords — never commit them to version control.
                  </p>
                </div>
              </section>

              {/* Authentication */}
              <section id="auth">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <Key className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Authentication</h2>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-8 space-y-5">
                  <p className="text-[15px] leading-[1.7] text-slate-400">
                    Include your API token as a Bearer token in the <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">Authorization</code> header on every request:
                  </p>
                  <CodeBlock lang="http" code={`GET /v1/devices HTTP/1.1
Host: api.gbict.nl
Authorization: Bearer gbict_live_xxxxxxxxxxxxxxxxxxx
Content-Type: application/json`} />
                  <p className="text-[15px] leading-[1.7] text-slate-400">
                    Requests without a valid token will receive a <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">401 Unauthorized</code> response.
                  </p>
                </div>
              </section>

              {/* Base URL */}
              <section id="base-url">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <Database className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Base URL</h2>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-8">
                  <CodeBlock lang="text" code="https://api.gbict.nl/v1" />
                  <p className="mt-4 text-[15px] leading-[1.7] text-slate-400">
                    All API endpoints are prefixed with this base URL. The API is versioned — the current version is <strong className="text-slate-300">v1</strong>. We will give at least 6 months notice before deprecating a version.
                  </p>
                </div>
              </section>

              {/* Rate limits */}
              <section id="rate-limits">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <TrendingUp className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Rate limits</h2>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-8 space-y-5">
                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <table className="w-full text-[14px]">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.025]">
                          <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Plan</th>
                          <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Rate limit</th>
                          <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Burst</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/[0.06]">
                          <td className="px-5 py-3.5 text-slate-300 font-medium">Starter</td>
                          <td className="px-5 py-3.5 text-slate-400">100 requests / minute</td>
                          <td className="px-5 py-3.5 text-slate-400">200 requests</td>
                        </tr>
                        <tr className="border-b border-white/[0.06]">
                          <td className="px-5 py-3.5 text-slate-300 font-medium">Pro</td>
                          <td className="px-5 py-3.5 text-slate-400">1,000 requests / minute</td>
                          <td className="px-5 py-3.5 text-slate-400">2,000 requests</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 text-slate-300 font-medium">Business</td>
                          <td className="px-5 py-3.5 text-slate-400">Custom (negotiated)</td>
                          <td className="px-5 py-3.5 text-slate-400">Custom</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[15px] leading-[1.7] text-slate-400">
                    Rate limit status is returned in response headers: <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">X-RateLimit-Limit</code>, <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">X-RateLimit-Remaining</code>, and <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">X-RateLimit-Reset</code>. When exceeded, you will receive a <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-violet-300">429 Too Many Requests</code> response.
                  </p>
                </div>
              </section>

              {/* Endpoints */}
              <section id="endpoints">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <Settings className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Endpoints</h2>
                </div>
                <div className="space-y-4" id="ep-devices">
                  <EndpointCard
                    method="GET"
                    path="/devices"
                    title="List connected devices"
                    description="Returns all energy devices connected to your GBICT account, including current battery status and connectivity."
                    params={[
                      { name: "status", type: "string", required: false, desc: "Filter by status: online | offline | all (default: all)" },
                      { name: "type", type: "string", required: false, desc: "Filter by device type: battery | inverter | meter" },
                    ]}
                    responseExample={`{
  "data": [
    {
      "id": "dev_a1b2c3d4",
      "name": "Sessy Home Battery",
      "type": "battery",
      "brand": "Sessy",
      "model": "Home Battery Pack",
      "status": "online",
      "state_of_charge": 78,
      "capacity_kwh": 11.6,
      "power_kw": 2.2,
      "last_seen": "2025-06-04T09:12:00Z"
    }
  ],
  "count": 1
}`}
                  />

                  <div id="ep-savings">
                    <EndpointCard
                      method="GET"
                      path="/savings"
                      title="Savings data"
                      description="Returns energy savings data for your account. Supports daily, weekly, and monthly aggregations."
                      params={[
                        { name: "from", type: "ISO 8601 date", required: false, desc: "Start date (default: 30 days ago)" },
                        { name: "to", type: "ISO 8601 date", required: false, desc: "End date (default: today)" },
                        { name: "granularity", type: "string", required: false, desc: "Aggregation: hour | day | month (default: day)" },
                        { name: "device_id", type: "string", required: false, desc: "Filter to a specific device" },
                      ]}
                      responseExample={`{
  "currency": "EUR",
  "total_saved": 72.41,
  "period": {
    "from": "2025-05-04",
    "to": "2025-06-04"
  },
  "data": [
    {
      "date": "2025-06-04",
      "saved_eur": 2.14,
      "charged_kwh": 9.2,
      "discharged_kwh": 8.8,
      "avg_buy_price": 0.0421,
      "avg_sell_price": 0.1803
    }
  ]
}`}
                    />
                  </div>

                  <div id="ep-prices">
                    <EndpointCard
                      method="GET"
                      path="/prices"
                      title="Current spot prices"
                      description="Returns current and upcoming EPEX spot prices for your region. Prices are fetched hourly from the Tibber API."
                      params={[
                        { name: "hours", type: "integer", required: false, desc: "Number of hours ahead to return (default: 24, max: 48)" },
                        { name: "region", type: "string", required: false, desc: "ISO country code, e.g. NL, DE, BE (default: from account)" },
                      ]}
                      responseExample={`{
  "region": "NL",
  "currency": "EUR",
  "unit": "EUR/kWh",
  "data": [
    {
      "starts_at": "2025-06-04T09:00:00Z",
      "price": 0.0421,
      "level": "CHEAP"
    },
    {
      "starts_at": "2025-06-04T10:00:00Z",
      "price": 0.0389,
      "level": "VERY_CHEAP"
    },
    {
      "starts_at": "2025-06-04T17:00:00Z",
      "price": 0.1803,
      "level": "EXPENSIVE"
    }
  ]
}`}
                    />
                  </div>

                  <div id="ep-optimize">
                    <EndpointCard
                      method="POST"
                      path="/optimize"
                      title="Trigger optimization"
                      description="Manually trigger an optimization run for one or all devices. Optimization normally runs automatically every hour."
                      params={[
                        { name: "device_id", type: "string", required: false, desc: "Specific device to optimize. Omit to optimize all devices." },
                        { name: "strategy", type: "string", required: false, desc: "Override strategy: auto | charge | discharge | idle" },
                        { name: "until", type: "ISO 8601 datetime", required: false, desc: "Override until this time; then revert to auto" },
                      ]}
                      requestExample={`{
  "device_id": "dev_a1b2c3d4",
  "strategy": "charge",
  "until": "2025-06-04T06:00:00Z"
}`}
                      responseExample={`{
  "ok": true,
  "optimization_id": "opt_z9y8x7w6",
  "device_id": "dev_a1b2c3d4",
  "strategy": "charge",
  "active_until": "2025-06-04T06:00:00Z",
  "created_at": "2025-06-04T01:30:00Z"
}`}
                      notes="Manual optimization overrides the automatic schedule until active_until is reached, or until you trigger a new optimization with strategy: auto."
                    />
                  </div>
                </div>
              </section>

              {/* Error reference */}
              <section id="errors">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                    <AlertCircle className="h-4.5 w-4.5 text-violet-400" />
                  </div>
                  <h2 className="text-[26px] font-bold tracking-[-0.03em]">Error codes</h2>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-8 space-y-5">
                  <p className="text-[15px] leading-[1.7] text-slate-400">All errors return a consistent JSON body:</p>
                  <CodeBlock code={`{
  "error": {
    "code": "device_not_found",
    "message": "No device with the given ID exists in your account.",
    "status": 404
  }
}`} />
                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <table className="w-full text-[14px]">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.025]">
                          <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">HTTP Status</th>
                          <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["400", "Bad Request — invalid parameters or request body"],
                          ["401", "Unauthorized — missing or invalid API token"],
                          ["403", "Forbidden — valid token but insufficient plan permissions"],
                          ["404", "Not Found — resource does not exist"],
                          ["429", "Too Many Requests — rate limit exceeded"],
                          ["500", "Internal Server Error — something went wrong on our end"],
                        ].map(([code, desc]) => (
                          <tr key={code} className="border-b border-white/[0.06] last:border-b-0">
                            <td className="px-5 py-3.5 font-mono text-slate-300">{code}</td>
                            <td className="px-5 py-3.5 text-slate-400">{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-8 text-center">
                <h3 className="text-[20px] font-bold tracking-[-0.02em]">Ready to build?</h3>
                <p className="mx-auto mt-2 max-w-[360px] text-[15px] text-slate-400">
                  API access is included on Pro and Business plans. Start a free trial to get your first API token.
                </p>
                <a href="/signup" className={btnPrimary + " mt-6"}>Start free trial</a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
