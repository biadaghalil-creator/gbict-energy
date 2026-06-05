"use client";

import { useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";

const NAV_LINKS = [
  ["How it works", "/#how"],
  ["Integrations", "/#features"],
  ["Pricing", "/#pricing"],
  ["Contact", "/contact"],
] as const;

const btnPrimary =
  "inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#5B21B6] hover:bg-[#6D28D9] " +
  "text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors";

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
            <a href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-100">Terms of Service</a>
            <a href="/contact" className="hover:text-slate-100">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-slate-100">{title}</h2>
      <div className="space-y-3 text-[15px] leading-[1.7] text-slate-400">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07080D] font-sans text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="relative z-[2]">
        <Nav />

        <div className="mx-auto max-w-[800px] px-6 py-20">
          {/* Header */}
          <div className="mb-14 text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
                <ShieldCheck className="h-7 w-7 text-violet-400" />
              </div>
            </div>
            <h1 className="text-[clamp(36px,5vw,54px)] font-extrabold tracking-[-0.04em] text-slate-50">Privacy Policy</h1>
            <p className="mt-4 text-[16px] text-slate-400">Last updated: June 2025</p>
            <p className="mt-2 text-[14px] text-slate-500">GBICT Energy · Almere, Netherlands · info@gbict.nl</p>
          </div>

          {/* Card wrapper */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-10">

            <Section title="1. Who we are">
              <p>
                GBICT Energy B.V. (&ldquo;GBICT Energy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a Dutch company registered in Almere, Netherlands. We operate the GBICT Energy platform — a SaaS service for home battery optimization and virtual power plant (VPP) participation.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, and protect personal data when you use our website, platform, or API. We act as the data controller under the General Data Protection Regulation (GDPR).
              </p>
              <p>
                <strong className="text-slate-300">Contact:</strong> info@gbict.nl · GBICT Energy B.V., W. Dreesweg 14, 1314CL Almere, Netherlands
              </p>
            </Section>

            <Section title="2. Data we collect">
              <p>We collect the following categories of personal data:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                <li>
                  <strong className="text-slate-300">Account data:</strong> name, email address, and encrypted password when you register an account. If you use OAuth (Google), we receive your name and email from that provider.
                </li>
                <li>
                  <strong className="text-slate-300">Device data:</strong> battery brand and model, current state of charge, capacity, charge/discharge cycles, inverter configuration, and energy usage history from connected devices (e.g. Sessy, Victron, SolarEdge).
                </li>
                <li>
                  <strong className="text-slate-300">Energy contract data:</strong> dynamic tariff data retrieved via the Tibber API, including your energy prices and consumption data as permitted by your Tibber authorization.
                </li>
                <li>
                  <strong className="text-slate-300">Usage analytics:</strong> pages visited, features used, button clicks, and session duration. This data is collected in aggregated, pseudonymous form and is used solely to improve the product.
                </li>
                <li>
                  <strong className="text-slate-300">Technical data:</strong> IP address, browser type and version, operating system, screen resolution, referring URL, and time zone. This is automatically logged when you use the service.
                </li>
                <li>
                  <strong className="text-slate-300">Support communications:</strong> emails, tickets, or chat messages you send to our support team.
                </li>
              </ul>
            </Section>

            <Section title="3. Why we process your data (legal bases)">
              <p>We process your personal data on the following legal bases under GDPR Article 6:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                <li><strong className="text-slate-300">Performance of a contract (Art. 6(1)(b)):</strong> to deliver the optimization service, authenticate your account, process payments, and provide customer support.</li>
                <li><strong className="text-slate-300">Legitimate interests (Art. 6(1)(f)):</strong> to improve our product through anonymized analytics, detect fraud, and ensure platform security.</li>
                <li><strong className="text-slate-300">Consent (Art. 6(1)(a)):</strong> for non-essential cookies and marketing communications. You may withdraw consent at any time.</li>
                <li><strong className="text-slate-300">Legal obligation (Art. 6(1)(c)):</strong> to comply with Dutch and EU law, including tax and financial reporting requirements.</li>
              </ul>
            </Section>

            <Section title="4. Third-party processors">
              <p>We share data only with trusted processors who are contractually bound to protect it under a Data Processing Agreement (DPA):</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06]">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.025]">
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Processor</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Purpose</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.06]">
                      <td className="px-5 py-3.5 text-slate-300 font-medium">Supabase</td>
                      <td className="px-5 py-3.5 text-slate-400">Database storage and user authentication</td>
                      <td className="px-5 py-3.5 text-slate-400">EU (Frankfurt, Germany)</td>
                    </tr>
                    <tr className="border-b border-white/[0.06]">
                      <td className="px-5 py-3.5 text-slate-300 font-medium">Vercel</td>
                      <td className="px-5 py-3.5 text-slate-400">Web hosting and edge functions</td>
                      <td className="px-5 py-3.5 text-slate-400">EU (Almere, Netherlands)</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 text-slate-300 font-medium">Tibber API</td>
                      <td className="px-5 py-3.5 text-slate-400">Real-time energy price and consumption data</td>
                      <td className="px-5 py-3.5 text-slate-400">EU (Norway/Germany)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">We do not sell, rent, or share your personal data with third parties for their own marketing purposes.</p>
            </Section>

            <Section title="5. Cookies">
              <p>We use the following cookies:</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06]">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.025]">
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Cookie</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Purpose</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Duration</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-400">Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.06]">
                      <td className="px-5 py-3.5 font-mono text-[13px] text-violet-300">sb-session</td>
                      <td className="px-5 py-3.5 text-slate-400">Authentication session (Supabase)</td>
                      <td className="px-5 py-3.5 text-slate-400">Session</td>
                      <td className="px-5 py-3.5 text-emerald-400">Yes</td>
                    </tr>
                    <tr className="border-b border-white/[0.06]">
                      <td className="px-5 py-3.5 font-mono text-[13px] text-violet-300">GBICT_LOCALE</td>
                      <td className="px-5 py-3.5 text-slate-400">Stores your language preference</td>
                      <td className="px-5 py-3.5 text-slate-400">1 year</td>
                      <td className="px-5 py-3.5 text-slate-400">No</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 font-mono text-[13px] text-violet-300">_gbict_anon</td>
                      <td className="px-5 py-3.5 text-slate-400">Anonymized usage analytics</td>
                      <td className="px-5 py-3.5 text-slate-400">1 year</td>
                      <td className="px-5 py-3.5 text-slate-400">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">You can manage cookie preferences in your browser settings or via the cookie banner shown on your first visit. Disabling non-essential cookies does not affect platform functionality.</p>
            </Section>

            <Section title="6. Data retention">
              <p>We retain your personal data only as long as necessary:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                <li><strong className="text-slate-300">Active account:</strong> all data is retained for the duration of your subscription.</li>
                <li><strong className="text-slate-300">After account deletion:</strong> account data and device data are permanently deleted within 30 days of account closure, unless we are required to retain it by law.</li>
                <li><strong className="text-slate-300">Support communications:</strong> retained for 2 years to ensure continuity of service and dispute resolution.</li>
                <li><strong className="text-slate-300">Financial records:</strong> retained for 7 years as required by Dutch tax law (Belastingwetgeving).</li>
                <li><strong className="text-slate-300">Analytics data:</strong> aggregated and anonymized; not subject to deletion requests as it cannot be linked to an individual.</li>
              </ul>
            </Section>

            <Section title="7. Your rights under GDPR">
              <p>Under GDPR Articles 15–21, you have the following rights regarding your personal data:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                <li><strong className="text-slate-300">Right of access (Art. 15):</strong> you may request a copy of all personal data we hold about you.</li>
                <li><strong className="text-slate-300">Right to rectification (Art. 16):</strong> you may ask us to correct inaccurate or incomplete data.</li>
                <li><strong className="text-slate-300">Right to erasure (Art. 17):</strong> you may request deletion of your personal data (&ldquo;right to be forgotten&rdquo;), subject to legal retention obligations.</li>
                <li><strong className="text-slate-300">Right to data portability (Art. 20):</strong> you may request your data in a machine-readable format (JSON or CSV) to transfer to another service.</li>
                <li><strong className="text-slate-300">Right to object (Art. 21):</strong> you may object to processing based on legitimate interests, including for direct marketing.</li>
                <li><strong className="text-slate-300">Right to restrict processing (Art. 18):</strong> you may request that we limit how we use your data in certain circumstances.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, email <a href="mailto:info@gbict.nl" className="text-violet-400 hover:text-violet-300">info@gbict.nl</a>. We will respond within 30 days as required by GDPR.</p>
            </Section>

            <Section title="8. Data protection authority">
              <p>
                We are subject to the jurisdiction of the <strong className="text-slate-300">Autoriteit Persoonsgegevens (AP)</strong>, the Dutch Data Protection Authority, which is a member of the European Data Protection Board (EDPB).
              </p>
              <p>
                If you believe we have not handled your data appropriately, you have the right to lodge a complaint with the AP at <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">autoriteitpersoonsgegevens.nl</a>.
              </p>
            </Section>

            <Section title="9. Security">
              <p>
                We implement industry-standard security measures to protect your data, including TLS encryption in transit, AES-256 encryption at rest (via Supabase), row-level security policies, and regular security audits. Access to personal data is restricted to authorized employees and contractors on a need-to-know basis.
              </p>
            </Section>

            <Section title="10. Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you by email and display a notice in the dashboard at least 14 days before any material changes take effect. Continued use of the service after that date constitutes acceptance of the updated policy.
              </p>
            </Section>

            <div className="mt-8 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-6 py-5">
              <p className="text-[14px] text-slate-300">
                <strong className="text-slate-100">Questions about this policy?</strong> Email us at{" "}
                <a href="mailto:info@gbict.nl" className="text-violet-400 hover:text-violet-300">info@gbict.nl</a>.
                We are always happy to explain how and why we process your data.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
