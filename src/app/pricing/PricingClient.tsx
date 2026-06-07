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
      name: t.pricing.proName,
      price: '€20',
      per: t.pricing.perMonth,
      description: t.pricing.proDesc,
      features: [
        '14 dagen gratis proberen',
        'Onbeperkt apparaten koppelen',
        'Volledige auto-optimalisatie',
        'Live energieprijzen (EPEX)',
        'Morgen-prognose',
        'E-mail notificaties',
        'Besparingshistoriek',
        'Alle batterijmerken',
      ],
      cta: t.pricing.ctaTrial,
      href: '/signup?plan=pro',
      highlight: false,
      badge: null as string | null,
      trial: true,
    },
    {
      name: t.pricing.businessName,
      price: '€35',
      per: t.pricing.perMonth,
      description: t.pricing.businessDesc,
      features: [
        '14 dagen gratis proberen',
        'Alles uit Pro',
        'VPP-deelname (verdien extra)',
        'Maandelijkse verdiensten tot €400',
        'Zakelijke rapportage (PDF export)',
        'Meerdere locaties / woningen',
        'Prioriteit support',
      ],
      cta: t.pricing.ctaTrial,
      href: '/signup?plan=business',
      highlight: true,
      badge: 'Populairste' as string | null,
      trial: true,
    },
    {
      name: t.pricing.enterpriseName,
      price: t.pricing.priceCustom,
      per: '',
      description: t.pricing.enterpriseDesc,
      features: [
        'Alles uit Business',
        'Onbeperkte locaties / eenheden',
        'White-label platform',
        'Dedicated accountmanager',
        'SLA garantie',
        'Maatwerk integraties',
        'Facturering op rekening',
        'Offboarding ondersteuning',
      ],
      cta: t.pricing.ctaContact,
      href: '#enterprise-contact',
      highlight: false,
      badge: null as string | null,
      trial: false,
    },
  ]

  const FAQ = [
    { q: 'Hoe werkt de gratis proefperiode?', a: 'Je start gratis, koppelt je apparaten en ziet direct je besparingen. Na 14 dagen kies je een abonnement. Geen automatische afschrijving zonder bevestiging.' },
    { q: 'Werkt het met mijn batterij?', a: 'We ondersteunen Sessy, Victron, Enphase, SolarEdge en Fronius. Meer merken worden continu toegevoegd. Je koppelt je batterij in minder dan 2 minuten.' },
    { q: 'Hoeveel kan ik besparen?', a: 'Gemiddeld €150–€400 per jaar, afhankelijk van je batterijcapaciteit en energieprijzen. Op dynamische contracten (Tibber, Frank, EnergyZero) is de besparing het grootst.' },
    { q: 'Wat is VPP?', a: 'Virtueel Powerplant — jouw batterij levert flexibiliteitsdiensten aan het elektriciteitsnet. Je verdient extra inkomsten naast de gewone optimalisatie. Alleen beschikbaar in Business en Enterprise.' },
    { q: 'Kan ik opzeggen wanneer ik wil?', a: 'Ja, je kunt maandelijks opzeggen. Geen contract, geen opzegtermijn, geen verborgen kosten.' },
    { q: 'Is mijn data veilig?', a: 'Alle data staat versleuteld opgeslagen in de EU. We verkopen nooit data aan derden. Je API-sleutels worden versleuteld bewaard.' },
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
    <div className="min-h-screen text-slate-50" style={{ background: '#020617' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl"
        style={{ background: 'rgba(2,6,23,0.85)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/gbict-logo.png" alt="GBICT" width={36} height={36}
                className="rounded-lg logo-glow group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-slate-50">GBICT</span>
              <span className="text-xs font-medium text-gradient-blue">Energy</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={currentLocale} />
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-slate-50 transition-colors hidden sm:block">
              {t.nav.login}
            </Link>
            <Link href="/signup" className="btn-3d-sm">{t.nav.signup}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">

        {/* Hero */}
        <div className="text-center">
          <div className="mb-5 text-xs font-bold uppercase tracking-widest text-violet-400">Abonnementen</div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-50 md:text-6xl"
            style={{ letterSpacing: '-0.03em' }}>
            <span className="text-gradient-blue">{t.pricing.title}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.pricing.subtitle }} />
        </div>

        {/* Trial banner */}
        <div className="mt-10 flex items-center justify-center gap-3 rounded-2xl badge-glow px-6 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-sm text-white font-bold">✓</span>
          <p className="text-sm text-violet-300" dangerouslySetInnerHTML={{ __html: t.pricing.trialBadge }} />
        </div>

        {/* Pricing cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`relative flex flex-col rounded-2xl p-7 ${
              tier.highlight
                ? 'border-2 border-violet-500/60 glow-card'
                : 'glow-card'
            }`}
              style={tier.highlight ? { boxShadow: '0 0 40px rgba(124,58,237,0.18), 0 20px 40px rgba(0,0,0,0.4)' } : undefined}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-violet-400 to-violet-600 px-4 py-1 text-xs font-bold text-white shadow-lg"
                    style={{ boxShadow: '0 3px 0 #3b0d6b, 0 6px 16px rgba(124,58,237,0.4)' }}>
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{tier.name}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`text-5xl font-extrabold tracking-tight ${tier.highlight ? 'text-gradient-gold' : 'text-slate-50'}`}
                    style={{ letterSpacing: '-0.04em' }}>
                    {tier.price}
                  </span>
                  {tier.per && <span className="mb-2 text-sm text-slate-500">{tier.per}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{tier.description}</p>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((f, i) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className={`mt-0.5 h-4 w-4 shrink-0 ${i === 0 && tier.trial ? 'text-violet-400' : 'text-emerald-400'}`}
                      viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm ${i === 0 && tier.trial ? 'font-semibold text-violet-300' : 'text-slate-300'}`}>{f}</span>
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

        <p className="mt-6 text-center text-xs text-slate-600">{t.pricing.vatNote}</p>

        {/* FAQ */}
        <div className="mt-24">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-violet-400">FAQ</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-50 mb-10"
            style={{ letterSpacing: '-0.03em' }}>
            {t.pricing.faqTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="glow-card p-6">
                <p className="font-semibold text-slate-50">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise contact */}
        <div id="enterprise-contact" className="mt-24 scroll-mt-20">
          <div className="glow-card overflow-hidden">
            <div className="border-b border-white/[0.06] px-8 py-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <Building2 className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-50">{t.pricing.enterpriseTitle}</h2>
                  <p className="text-sm text-slate-400">{t.pricing.enterpriseSubtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full step-circle">
                    <Check className="h-7 w-7 text-slate-900" />
                  </div>
                  <p className="text-lg font-bold text-slate-50">Aanvraag ontvangen!</p>
                  <p className="mt-2 text-sm text-slate-400">We nemen binnen 1 werkdag contact met je op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Naam" required>
                      <input type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="Jan de Vries" className="input-dark" />
                    </Field>
                    <Field label="E-mailadres" required>
                      <input type="email" name="email" required value={form.email} onChange={handleChange}
                        placeholder="jan@bedrijf.nl" className="input-dark" />
                    </Field>
                  </div>
                  <Field label="Bedrijfsnaam" required>
                    <input type="text" name="company" required value={form.company} onChange={handleChange}
                      placeholder="Jouw bedrijf B.V." className="input-dark" />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Aantal batterijen / woningen">
                      <select name="batteries" value={form.batteries} onChange={handleChange} className="input-dark">
                        <option value="">Selecteer...</option>
                        <option value="10-50">10 – 50</option>
                        <option value="50-200">50 – 200</option>
                        <option value="200-1000">200 – 1.000</option>
                        <option value="1000+">1.000+</option>
                      </select>
                    </Field>
                    <Field label="Type organisatie">
                      <select name="locations" value={form.locations} onChange={handleChange} className="input-dark">
                        <option value="">Selecteer...</option>
                        <option value="installateur">Installateur</option>
                        <option value="woningcorporatie">Woningcorporatie</option>
                        <option value="energiebedrijf">Energiebedrijf / leverancier</option>
                        <option value="vve">VvE / appartementencomplex</option>
                        <option value="zakelijk">Zakelijk vastgoed</option>
                        <option value="anders">Anders</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Toelichting">
                    <textarea name="message" rows={4} value={form.message} onChange={handleChange}
                      placeholder="Beschrijf kort wat je nodig hebt — bestaande hardware, gewenste integraties, tijdlijn..."
                      className="input-dark resize-none" />
                  </Field>
                  <button type="submit" disabled={loading}
                    className="btn-3d-primary w-full justify-center disabled:opacity-60"
                    style={{ borderRadius: '0.875rem' }}>
                    {loading ? t.common.loading : `${t.common.submit} →`}
                  </button>
                  <p className="text-center text-xs text-slate-600">
                    We nemen binnen 1 werkdag contact op. Geen spam, geen verplichtingen.
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
              Begin vandaag met besparen
            </h2>
            <p className="mt-3 text-slate-300">{t.common.free14days}. {t.common.noCard}. {t.common.cancel}.</p>
            <Link href="/signup" className="btn-3d-primary mt-8 inline-flex">
              {t.landing.ctaPrimary}
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-white/[0.06]" style={{ background: 'rgba(2,6,23,0.95)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} GBICT Energy</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-200 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-slate-200 transition-colors">Over GBICT</Link>
            <Link href="/login" className="hover:text-slate-200 transition-colors">{t.nav.login}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-violet-400">*</span>}
      </label>
      {children}
    </div>
  )
}
