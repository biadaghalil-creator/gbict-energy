"use client";

import { useState } from "react";
import { Menu, Mail, MapPin, Clock, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const NAV_LINKS = [
  ["How it works", "/#how"],
  ["Integrations", "/#features"],
  ["Pricing", "/#pricing"],
  ["Contact", "/contact"],
] as const;

const btnPrimary =
  "inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#047857] hover:bg-[#059669] " +
  "text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors";

const FAQS = [
  {
    q: "Which home batteries are compatible with GBICT Energy?",
    a: "GBICT Energy works with Sessy, Victron (Cerbo GX), SolarEdge, Enphase IQ Battery, and Fronius Symo GEN24. We add new integrations regularly — check our integrations page or contact us if your battery isn't listed.",
  },
  {
    q: "Do I need a dynamic electricity contract to use GBICT?",
    a: "A dynamic (hourly spot price) contract like Tibber gives you the maximum benefit, as our AI can exploit price differences throughout the day. However, GBICT also works with fixed-rate contracts by optimizing around your solar generation and time-of-use tariffs.",
  },
  {
    q: "How much can I actually save with GBICT Energy?",
    a: "The average GBICT household saves around €847 per year. The exact amount depends on your battery capacity, solar setup, energy contract, and local spot price volatility. Your dashboard shows real-time savings so you always know exactly what GBICT is earning you.",
  },
  {
    q: "Is my data safe? Where is it stored?",
    a: "All data is stored on EU servers (Supabase Frankfurt). We use TLS encryption in transit and AES-256 encryption at rest. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You can cancel at any time from your account settings. Your subscription stays active until the end of the current billing period — no partial refunds. After cancellation, optimization is paused and your data is retained for 30 days before permanent deletion, unless you request earlier deletion.",
  },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center gap-7 px-6">
        <a href="/" className="shrink-0">
          <img src="/gbict-logo.png" alt="GBICT Energy" width={56} height={56} className="block rounded-[13px]" />
        </a>
        <div className="ml-3 hidden gap-7 md:flex">
          {NAV_LINKS.map(([t, h]) => (
            <a key={h} href={h} className="text-[14.5px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">{t}</a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <a href="/login" className="hidden text-[15px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] md:inline-flex">Sign in</a>
          <a href="/signup" className={btnPrimary + " hidden md:inline-flex"}>Start free</a>
          <button aria-label="Menu" className="text-[var(--text)] md:hidden" onClick={() => setOpen((o) => !o)}><Menu className="h-6 w-6" /></button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-b border-[var(--border)] bg-[var(--bg)] px-6 pb-5 pt-3 backdrop-blur-md md:hidden">
          {NAV_LINKS.map(([t, h]) => (
            <a key={h} href={h} className="border-b border-[var(--border)] py-3 text-base text-[var(--text-muted)]" onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a href="/signup" className={btnPrimary + " mt-3"}>Start free</a>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] pb-10 pt-12">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="flex flex-col items-center justify-between gap-3.5 text-[13px] text-[var(--text-faint)] md:flex-row">
          <span>© 2026 GBICT Energy · Almere, Netherlands</span>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-[var(--text)]">Privacy Policy</a>
            <a href="/terms" className="hover:text-[var(--text)]">Terms of Service</a>
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--text)]">{q}</span>
        {open
          ? <ChevronUp className="h-5 w-5 shrink-0 text-emerald-400" />
          : <ChevronDown className="h-5 w-5 shrink-0 text-[var(--text-faint)]" />}
      </button>
      {open && (
        <p className="pb-5 text-[15px] leading-[1.7] text-[var(--text-muted)]">{a}</p>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="dark relative min-h-screen overflow-x-hidden bg-[var(--bg)] font-sans text-[var(--text)] antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.18),rgba(5,150,105,0.08)_45%,transparent_70%)] blur-xl" />
      <div className="relative z-[2]">
        <Nav />

        <div className="mx-auto max-w-[1140px] px-6 py-20">
          {/* Page header */}
          <div className="mb-16 text-center">
            <p className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
              <span className="h-[3px] w-5 rounded-sm bg-emerald-500" />
              Get in touch
            </p>
            <h1 className="text-[clamp(40px,5.5vw,62px)] font-extrabold tracking-[-0.04em] text-[var(--text)]">
              We&apos;re here to help
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.6] text-[var(--text-muted)]">
              Questions, feedback, or just want to know if GBICT works with your battery? Drop us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
            {/* Left: contact info */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                    <Mail className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-[17px] font-bold tracking-[-0.02em]">Email us</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">General inquiries</div>
                    <a href="mailto:info@gbict.nl" className="mt-1 block text-[16px] text-emerald-400 hover:text-emerald-300 transition-colors">info@gbict.nl</a>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">Technical support</div>
                    <a href="mailto:info@gbict.nl" className="mt-1 block text-[16px] text-emerald-400 hover:text-emerald-300 transition-colors">info@gbict.nl</a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                    <Clock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-[17px] font-bold tracking-[-0.02em]">Response time</h3>
                </div>
                <p className="text-[15px] leading-[1.6] text-[var(--text-muted)]">
                  We respond to all inquiries <strong className="text-[var(--text-muted)]">within 24 hours</strong> on business days (Mon–Fri, 09:00–17:00 CET).
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-[17px] font-bold tracking-[-0.02em]">Office</h3>
                </div>
                <p className="text-[15px] leading-[1.6] text-[var(--text-muted)]">
                  GBICT Energy B.V.<br />
                  W. Dreesweg 14<br />
                  1314CL Almere<br />
                  <span className="text-[13px] text-[var(--text-faint)]">Netherlands</span>
                </p>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-[20px] font-bold tracking-[-0.02em]">Send us a message</h2>
              </div>
              <form
                action="mailto:info@gbict.nl"
                method="post"
                encType="text/plain"
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-[13px] font-semibold text-[var(--text-muted)]">
                      Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jan de Vries"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[15px] text-[var(--text)] placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/50 focus:bg-[var(--surface-2)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-[var(--text-muted)]">
                      Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jan@example.nl"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[15px] text-[var(--text)] placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/50 focus:bg-[var(--surface-2)]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-[13px] font-semibold text-[var(--text-muted)]">
                    Subject <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--text)] outline-none transition-colors focus:border-emerald-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected className="text-[var(--text-faint)]">Select a topic…</option>
                    <option value="general">General question</option>
                    <option value="support">Technical support</option>
                    <option value="billing">Billing / subscription</option>
                    <option value="integration">Device integration</option>
                    <option value="business">Business / enterprise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block text-[13px] font-semibold text-[var(--text-muted)]">
                    Message <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us how we can help…"
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[15px] text-[var(--text)] placeholder-slate-600 outline-none transition-colors focus:border-emerald-500/50 focus:bg-[var(--surface-2)]"
                  />
                </div>
                <button
                  type="submit"
                  className={btnPrimary + " w-full"}
                >
                  Send message
                </button>
                <p className="text-center text-[12px] text-[var(--text-faint)]">We respond within 24 hours on business days.</p>
              </form>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-20">
            <div className="mb-12 text-center">
              <p className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
                <span className="h-[3px] w-5 rounded-sm bg-emerald-500" />
                FAQ
              </p>
              <h2 className="text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.035em]">Frequently asked questions</h2>
              <p className="mx-auto mt-4 max-w-[480px] text-[16px] leading-[1.6] text-[var(--text-muted)]">
                Quick answers to the questions we hear most often.
              </p>
            </div>
            <div className="mx-auto max-w-[760px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-2">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
            <p className="mt-8 text-center text-[14px] text-[var(--text-faint)]">
              Still have questions?{" "}
              <a href="mailto:info@gbict.nl" className="text-emerald-400 hover:text-emerald-300">Email us at info@gbict.nl</a>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
