"use client";

import { FileText } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-[var(--text)]">{title}</h2>
      <div className="space-y-3 text-[15px] leading-[1.7] text-[var(--text-muted)]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="gbict-landing relative min-h-screen overflow-x-hidden" data-dir="grid">
      <div className="atmos"><div className="glow g1" /><div className="glow g2" /><div className="glow g3" /></div>
      <div className="wrap">
        <SiteNav />

        <div className="mx-auto max-w-[800px] px-6 py-20">
          {/* Header */}
          <div className="mb-14 text-center">
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                <FileText className="h-7 w-7 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-[clamp(36px,5vw,54px)] font-extrabold tracking-[-0.04em] text-[var(--text)]">Terms of Service</h1>
            <p className="mt-4 text-[16px] text-[var(--text-muted)]">Last updated: June 2025</p>
            <p className="mt-2 text-[14px] text-[var(--text-faint)]">GBICT Energy · Almere, Netherlands · info@gbict.nl</p>
          </div>

          {/* Card wrapper */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10">

            <Section title="1. Acceptance of terms">
              <p>
                By accessing or using the GBICT Energy platform (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Service.
              </p>
              <p>
                These Terms constitute a binding agreement between you and GBICT Energy B.V., a company registered in Almere, Netherlands (&ldquo;GBICT Energy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). These Terms are governed by Dutch law.
              </p>
            </Section>

            <Section title="2. Description of service">
              <p>
                GBICT Energy provides a cloud-based SaaS platform for home battery optimization and virtual power plant (VPP) participation. The Service connects to your home energy devices and dynamic energy contracts to automatically optimize when your battery charges and discharges, with the goal of reducing your energy costs.
              </p>
              <p>
                The Service includes a web dashboard, device integrations, and related features as described in our documentation.
              </p>
            </Section>

            <Section title="3. Pricing and subscription">
              <p>We offer the following subscription plans:</p>
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Plan</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Price</th>
                      <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border)]">
                      <td className="px-5 py-3.5 text-[var(--text-muted)] font-medium">Starter</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">€15 / month</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">1 device, daily optimization, email support</td>
                    </tr>
                    <tr className="border-b border-[var(--border)]">
                      <td className="px-5 py-3.5 text-[var(--text-muted)] font-medium">Pro</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">€25 / month</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">Unlimited devices, hourly optimization, VPP, priority support</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 text-[var(--text-muted)] font-medium">Business</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">Custom</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">Multiple locations, white-label, dedicated SLA, account manager</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">Prices are in euros, excluding VAT (BTW) where applicable. We reserve the right to change pricing with 30 days&apos; prior notice.</p>
            </Section>

            <Section title="4. Free trial">
              <p>
                New accounts are eligible for a <strong className="text-[var(--text-muted)]">14-day free trial</strong> of the Pro plan. No credit card is required to start the trial. At the end of the trial period, you will be asked to select a plan. If you do not subscribe, your account will be downgraded to a read-only state and optimization will be paused.
              </p>
              <p>
                Each individual or organization is entitled to one free trial. Circumventing this by creating multiple accounts is a violation of these Terms and may result in account suspension.
              </p>
            </Section>

            <Section title="5. Billing and cancellation">
              <p>
                Subscriptions are billed monthly in advance. Payments are processed securely via our payment provider. By subscribing, you authorize us to charge your payment method on a recurring monthly basis.
              </p>
              <p>
                <strong className="text-[var(--text-muted)]">Cancellation:</strong> You may cancel your subscription at any time from your account settings or by contacting info@gbict.nl. Cancellation takes effect at the end of the current billing period. We do not offer refunds for the current billing period upon cancellation, except where required by Dutch consumer protection law.
              </p>
              <p>
                If a payment fails, we will retry the charge and notify you by email. After 7 days of non-payment, your subscription may be suspended.
              </p>
            </Section>

            <Section title="6. Savings estimates and disclaimers">
              <p>
                The energy savings estimates shown in the dashboard, on our website, and in any marketing materials are <strong className="text-[var(--text-muted)]">illustrative projections only</strong> and are not guaranteed. Actual savings depend on factors outside our control, including but not limited to: energy market prices, your energy contract terms, battery hardware performance, solar generation, and household consumption patterns.
              </p>
              <p>
                <strong className="text-[var(--text-muted)]">GBICT Energy is not liable for any energy costs, charges, or losses you may incur</strong>, including those resulting from optimization decisions made by the platform. You retain full responsibility for your energy contract and any costs associated with it.
              </p>
            </Section>

            <Section title="7. Uptime and service availability">
              <p>
                We target a <strong className="text-[var(--text-muted)]">98% monthly uptime</strong> for the core optimization service. This is a target, not a binding service level agreement (SLA), unless you have a Business plan with a dedicated SLA in your contract.
              </p>
              <p>
                Scheduled maintenance will be announced in advance via the dashboard and/or email. We are not liable for losses arising from service unavailability, interruptions, or data delays.
              </p>
            </Section>

            <Section title="8. Acceptable use">
              <p>You agree not to:</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                <li>Resell, sublicense, or white-label the Service without a written Business agreement with GBICT Energy.</li>
                <li>Reverse engineer, decompile, or attempt to extract the source code of the platform.</li>
                <li>Use the Service to store or transmit malware, or to conduct any unlawful activity.</li>
                <li>Access the API in excess of your plan&apos;s rate limits, or use automated scripts to scrape data beyond normal use.</li>
                <li>Share your account credentials with third parties.</li>
                <li>Attempt to gain unauthorized access to other users&apos; accounts or our infrastructure.</li>
              </ul>
              <p className="mt-3">Violation of these rules may result in immediate account suspension without refund.</p>
            </Section>

            <Section title="9. Data and privacy">
              <p>
                Your use of the Service is subject to our <a href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>, which is incorporated into these Terms by reference. You own your data. We will not sell your data to third parties.
              </p>
              <p>
                By connecting third-party devices and services (e.g. Tibber, Sessy), you authorize GBICT Energy to retrieve and process data from those services on your behalf, in accordance with the permissions you grant.
              </p>
            </Section>

            <Section title="10. Intellectual property">
              <p>
                All content, software, algorithms, and trademarks associated with GBICT Energy are the exclusive property of GBICT Energy B.V. These Terms do not grant you any ownership rights to the Service or its components.
              </p>
            </Section>

            <Section title="11. Limitation of liability">
              <p>
                To the maximum extent permitted by Dutch law, GBICT Energy&apos;s total liability for any claim arising from these Terms or your use of the Service is limited to the amount you paid to us in the 3 months preceding the claim.
              </p>
              <p>
                In no event shall GBICT Energy be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits or lost savings, even if we have been advised of the possibility of such damages.
              </p>
            </Section>

            <Section title="12. Governing law and jurisdiction">
              <p>
                These Terms are governed by the laws of <strong className="text-[var(--text-muted)]">the Netherlands</strong>, without regard to conflict-of-law principles. Any disputes shall be resolved exclusively by the competent courts in <strong className="text-[var(--text-muted)]">Almere, Netherlands</strong>.
              </p>
              <p>
                If you are a consumer, you may also have rights under mandatory consumer protection legislation in your country of residence.
              </p>
            </Section>

            <Section title="13. Changes to these terms">
              <p>
                We may modify these Terms at any time. We will notify you by email and display a notice in the dashboard at least 14 days before material changes take effect. Continued use of the Service after the effective date constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="14. Contact">
              <p>
                For questions about these Terms, contact us at <a href="mailto:info@gbict.nl" className="text-emerald-400 hover:text-emerald-300">info@gbict.nl</a> or write to GBICT Energy B.V., W. Dreesweg 14, 1314CL Almere, Netherlands.
              </p>
            </Section>

            <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-5">
              <p className="text-[14px] text-[var(--text-muted)]">
                <strong className="text-[var(--text)]">Questions?</strong> Email us at{" "}
                <a href="mailto:info@gbict.nl" className="text-emerald-400 hover:text-emerald-300">info@gbict.nl</a>.
                We respond within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
