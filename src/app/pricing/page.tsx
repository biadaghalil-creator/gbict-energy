import Link from 'next/link'

const TIERS = [
  {
    name: 'Gratis',
    price: '€0',
    per: 'altijd',
    description: 'Begin met besparen zonder kosten.',
    features: [
      '1 batterij koppelen',
      'Live EPEX-prijzen',
      'Basis optimalisatie',
      'Besparingsoverzicht',
      'Handmatig laden/ontladen',
    ],
    cta: 'Gratis starten',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '€9',
    per: 'per maand',
    description: 'Maximale besparing op autopilot.',
    features: [
      'Onbeperkt apparaten',
      'Geavanceerde AI-optimalisatie',
      'E-mail notificaties',
      'Morgen-prognose',
      'Prioriteit klantenservice',
      'Meerdere optimalisatie-modi',
    ],
    cta: 'Pro starten',
    href: '/signup?plan=pro',
    highlight: true,
    badge: 'Populairste',
  },
  {
    name: 'Business',
    price: '€29',
    per: 'per maand',
    description: 'VPP-deelname en zakelijke rapportage.',
    features: [
      'Alles uit Pro',
      'VPP-deelname (FCR/aFRR)',
      'Maandelijkse verdiensten tot €400',
      'Zakelijke rapportage (PDF)',
      'API-toegang',
      'White-label optie',
    ],
    cta: 'Business starten',
    href: '/signup?plan=business',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-white">G</div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">GBICT Energy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Inloggen</Link>
            <Link href="/signup" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">Aanmelden</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Beta — nu gratis
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Simpele, eerlijke prijzen
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Begin gratis. Upgrade wanneer je meer wil. Geen verborgen kosten, geen contract-lock-in.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-7 ${
                tier.highlight
                  ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{tier.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{tier.price}</span>
                  <span className="mb-1 text-sm text-zinc-400">{tier.per}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{tier.description}</p>
              </div>

              <ul className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  tier.highlight
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'border border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Veelgestelde vragen</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              { q: 'Hoe lang is de beta gratis?', a: 'Tijdens de beta-periode (2025) is het platform volledig gratis. Early adopters krijgen een permanente korting wanneer we facturering activeren.' },
              { q: 'Werkt het met mijn batterij?', a: 'We ondersteunen Sessy, Victron, Enphase, en SolarEdge. Meer merken worden continu toegevoegd.' },
              { q: 'Hoeveel kan ik besparen?', a: 'Gemiddeld €150–€400 per jaar, afhankelijk van je batterijcapaciteit, energieprijzen en verbruikspatroon.' },
              { q: 'Wat is VPP?', a: 'Virtueel Powerplant — jouw batterij levert flexibiliteitsdiensten aan het elektriciteitsnet (FCR/aFRR). Je verdient extra naast de gewone optimalisatie.' },
              { q: 'Kan ik opzeggen?', a: 'Ja, je kunt op elk moment opzeggen. Geen contract, geen opzegtermijn.' },
              { q: 'Is mijn data veilig?', a: 'Alle data staat versleuteld in de EU. We verkopen nooit data aan derden. Je behoudt volledige controle.' },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-emerald-500 p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Klaar om te besparen?</h2>
          <p className="mt-2 text-emerald-100">Begin vandaag gratis. Geen creditcard nodig.</p>
          <Link href="/signup" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-50">
            Gratis aanmelden
          </Link>
        </div>
      </main>

      <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} GBICT Energy</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">Home</Link>
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-50">Inloggen</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
