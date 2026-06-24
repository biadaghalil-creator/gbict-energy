'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import type { TranslationDict } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

function getCurrentLocale(): Locale {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/GBICT_LOCALE=([^;]+)/)
  const val = match?.[1]
  if (val && (LOCALES as readonly string[]).includes(val)) return val as Locale
  return 'en'
}

interface Props {
  translations: TranslationDict
}

export function PricingClient({ translations: t }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', company: '', batteries: '', locations: '', message: '',
  })

  const TIERS = [
    {
      name: 'Starter',
      price: '€15',
      per: t.pricing.perMonth,
      description: 'For a single home battery on a dynamic contract.',
      features: [
        '14 days free trial',
        'Automatic price optimization',
        'Live energy prices (EPEX)',
        'Day-ahead forecast',
        'Savings history',
        'All battery brands',
        'Email notifications',
      ],
      cta: t.pricing.ctaTrial,
      href: '/signup?plan=starter',
      highlight: false,
      badge: null as string | null,
      trial: true,
    },
    {
      name: 'Pro',
      price: '€25',
      per: t.pricing.perMonth,
      description: 'Maximum savings, plus earn extra through the virtual power plant.',
      features: [
        'Everything in Starter',
        'Connect unlimited devices',
        'Solar panel optimization',
        'VPP — virtual power plant (earn extra)',
        'EV / V2G smart charging',
        'Priority support',
      ],
      cta: t.pricing.ctaTrial,
      href: '/signup?plan=pro',
      highlight: true,
      badge: 'Most popular' as string | null,
      trial: true,
    },
    {
      name: 'Enterprise',
      price: t.pricing.priceCustom,
      per: '',
      description: 'For businesses and large portfolios.',
      features: [
        'Everything in Pro',
        'Multiple locations / homes',
        'Business reporting',
        'Dedicated account manager',
        'Custom integrations',
        'Invoice billing',
      ],
      cta: t.pricing.ctaContact,
      href: '#enterprise-contact',
      highlight: false,
      badge: null as string | null,
      trial: false,
    },
  ]

  const FAQ = [
    { q: 'How does the free trial work?', a: 'You start for free, connect your devices, and see your savings right away. After 14 days, you choose a plan. No automatic charges without confirmation.' },
    { q: 'Does it work with my battery?', a: 'We support Sessy, Victron, Enphase, SolarEdge, and Fronius. More brands are added continuously. You can connect your battery in under 2 minutes.' },
    { q: 'How much can I save?', a: 'On average around €420 per year with a typical setup (home battery + solar panels on a dynamic contract). Your actual savings depend on your usage and prices — and you can see them live in the app.' },
    { q: 'What is VPP?', a: 'Virtual Power Plant — your battery provides flexibility services to the electricity grid. You earn extra income on top of regular optimization. Included with Pro.' },
    { q: 'Can I cancel anytime?', a: 'Yes, you can cancel monthly. No contract, no notice period, no hidden fees.' },
    { q: 'Is my data safe?', a: 'All data is stored encrypted in the EU. We never sell data to third parties. Your API keys are stored encrypted.' },
  ]

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  const currentLocale = getCurrentLocale()

  return (
    <div className="dark min-h-screen text-[var(--text)]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] backdrop-blur-xl"
        style={{ background: 'var(--header)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/gbict-logo.png" alt="GBICT" width={36} height={36}
                className="rounded-lg logo-glow group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-[var(--text)]">GBICT</span>
              <span className="text-xs font-medium text-gradient-blue">Energy</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={currentLocale} />
            <Link href="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors hidden sm:block">
              {t.nav.login}
            </Link>
            <Link href="/signup" className="btn-3d-sm">{t.nav.signup}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">

        {/* Hero */}
        <div className="text-center">
          <div className="mb-5 text-xs font-bold uppercase tracking-widest text-emerald-400">Plans</div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--text)] md:text-6xl"
            style={{ letterSpacing: '-0.03em' }}>
            <span className="text-gradient-blue">{t.pricing.title}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--text-muted)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.pricing.subtitle }} />
        </div>

        {/* Trial banner */}
        <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl badge-glow px-6 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm text-white font-bold">✓</span>
          <p className="text-sm text-emerald-300" dangerouslySetInnerHTML={{ __html: t.pricing.trialBadge }} />
        </div>

        {/* Pricing cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col rounded-2xl p-7 ${
              tier.highlight
                ? 'border-2 border-emerald-500/60 glow-card'
                : 'glow-card'
            }`}
              style={tier.highlight ? { boxShadow: '0 0 40px rgba(16,185,129,0.18), 0 20px 40px rgba(0,0,0,0.4)' } : undefined}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-lg"
                    style={{ boxShadow: '0 3px 0 #064e3b, 0 6px 16px rgba(16,185,129,0.4)' }}>
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{tier.name}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`text-5xl font-extrabold tracking-tight ${tier.highlight ? 'text-gradient-gold' : 'text-[var(--text)]'}`}
                    style={{ letterSpacing: '-0.04em' }}>
                    {tier.price}
                  </span>
                  {tier.per && <span className="mb-2 text-sm text-[var(--text-faint)]">{tier.per}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{tier.description}</p>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((f, i) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className={`mt-0.5 h-4 w-4 shrink-0 ${i === 0 && tier.trial ? 'text-emerald-400' : 'text-emerald-400'}`}
                      viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${i === 0 && tier.trial ? 'font-semibold text-emerald-300' : 'text-[var(--text-muted)]'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {tier.highlight ? (
                  <a href={tier.href} className="btn-3d-primary w-full justify-center" style={{ borderRadius: '0.875rem' }}>
                    {tier.cta}
                  </a>
                ) : (
                  <a href={tier.href} className="btn-3d-secondary w-full justify-center" style={{ borderRadius: '0.875rem' }}>
                    {tier.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-faint)]">{t.pricing.vatNote}</p>

        {/* FAQ */}
        <div className="mt-24">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">FAQ</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)] mb-10"
            style={{ letterSpacing: '-0.03em' }}>
            {t.pricing.faqTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="glow-card p-6">
                <p className="font-semibold text-[var(--text)]">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise contact */}
        <div id="enterprise-contact" className="mt-24 scroll-mt-20">
          <div className="glow-card overflow-hidden">
            <div className="border-b border-[var(--border)] px-8 py-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Building2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)]">{t.pricing.enterpriseTitle}</h2>
                  <p className="text-sm text-[var(--text-muted)]">{t.pricing.enterpriseSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full step-circle">
                    <Check className="h-7 w-7 text-slate-900" />
                  </div>
                  <p className="text-lg font-bold text-[var(--text)]">Request received!</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">We'll get in touch within 1 business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" required>
                      <input type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="John Smith" className="input-dark" />
                    </Field>
                    <Field label="Email address" required>
                      <input type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="john@company.com" className="input-dark" />
                    </Field>
                  </div>
                  <Field label="Company name" required>
                    <input type="text" name="company" required value={form.company} onChange={handleChange}
                      placeholder="Your Company Inc." className="input-dark" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Number of batteries / homes">
                      <select name="batteries" value={form.batteries} onChange={handleChange} className="input-dark">
                        <option value="">Select...</option>
                        <option value="10-50">10 – 50</option>
                        <option value="50-200">50 – 200</option>
                        <option value="200-1000">200 – 1,000</option>
                        <option value="1000+">1,000+</option>
                      </select>
                    </Field>
                    <Field label="Type of organization">
                      <select name="locations" value={form.locations} onChange={handleChange} className="input-dark">
                        <option value="">Select...</option>
                        <option value="installateur">Installer</option>
                        <option value="woningcorporatie">Housing association</option>
                        <option value="energiebedrijf">Energy company / supplier</option>
                        <option value="vve">HOA / apartment complex</option>
                        <option value="zakelijk">Commercial real estate</option>
                        <option value="anders">Other</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Details">
                    <textarea name="message" rows={4} value={form.message} onChange={handleChange}
                      placeholder="Briefly describe what you need — existing hardware, desired integrations, timeline..."
                      className="input-dark resize-none" />
                  </Field>
                  <button type="submit" disabled={loading}
                    className="btn-3d-primary w-full justify-center disabled:opacity-60"
                    style={{ borderRadius: '0.875rem' }}>
                    {loading ? t.common.loading : `${t.common.submit} →`}
                  </button>
                  <p className="text-center text-xs text-[var(--text-faint)]">
                    We'll get in touch within 1 business day. No spam, no obligations.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 relative overflow-hidden rounded-2xl py-14 px-10 text-center"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(29,78,216,0.35), transparent 70%), linear-gradient(135deg, rgba(29,78,216,0.3), rgba(8,145,178,0.2))' }}>
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>
              Start saving today
            </h2>
            <p className="mt-3 text-[var(--text-muted)]">{t.common.free14days}. {t.common.cancel}.</p>
            <Link href="/signup" className="btn-3d-primary mt-8 inline-flex">
              {t.landing.ctaPrimary}
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-[var(--border)]" style={{ background: 'rgba(2,6,23,0.95)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-[var(--text-faint)]">
          <span>© {new Date().getFullYear()} GBICT Energy</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[var(--text)] transition-colors">About GBICT</Link>
            <Link href="/login" className="hover:text-[var(--text)] transition-colors">{t.nav.login}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
        {label} {required && <span className="text-emerald-400">*</span>}
      </label>
      {children}
    </div>
  )
}
