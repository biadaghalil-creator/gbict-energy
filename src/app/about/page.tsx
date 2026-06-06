import Link from 'next/link'
import Image from 'next/image'
import { Code, Cloud, Globe, Monitor, Wrench, Bot } from 'lucide-react'

export const metadata = {
  title: 'Over GBICT — Nederlands softwarebedrijf',
  description: 'GBICT is een Nederlands softwarebedrijf. We bouwen apps, platforms en AI-oplossingen voor bedrijven die willen groeien.',
}

const services = [
  { icon: Code, title: 'Softwareontwikkeling', description: 'Van idee tot werkende app. Web, mobiel of intern platform — volledig op maat gebouwd.', color: 'rgba(250,204,21,0.1)' },
  { icon: Cloud, title: 'Cloud oplossingen', description: 'Schaalbare infrastructuur die meegroeit met je bedrijf. Kosten omlaag, betrouwbaarheid omhoog.', color: 'rgba(34,211,238,0.1)' },
  { icon: Globe, title: 'Websites', description: 'Snelle, mooie websites die écht converteren. Geen templates — gebouwd op jouw merk.', color: 'rgba(99,102,241,0.1)' },
  { icon: Monitor, title: 'Werkplekbeheer', description: 'Je IT-omgeving, volledig geregeld. Zonder gedoe, zonder verrassingen op de factuur.', color: 'rgba(52,211,153,0.1)' },
  { icon: Wrench, title: 'Technische support', description: 'Directe hulp als er iets misgaat. Geen wachttijden, geen callcenters — wij zijn bereikbaar.', color: 'rgba(168,85,247,0.1)' },
  { icon: Bot, title: 'AI & Data', description: 'Slimme oplossingen die je processen automatiseren. Van chatbots tot voorspellende modellen.', color: 'rgba(251,146,60,0.1)' },
]

const whyUs = [
  { title: 'Op maat', description: 'Geen templates, geen standaard-pakketten. Alles gebouwd voor jouw situatie, jouw processen, jouw schaal.' },
  { title: 'Nederlandstalig', description: 'Directe communicatie, geen tussenpersonen. Je praat altijd met de mensen die het daadwerkelijk bouwen.' },
  { title: 'Van idee tot live', description: 'We begeleiden het hele traject — van eerste schets tot live product en verdere doorontwikkeling.' },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen text-slate-50" style={{ background: '#020617' }}>

      {/* ── HEADER ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl"
        style={{ background: 'rgba(2,6,23,0.85)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/gbict-logo.webp" alt="GBICT" width={36} height={36}
                className="rounded-lg logo-glow group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight text-slate-50">GBICT</span>
              <span className="text-xs font-medium text-slate-500">Software</span>
            </div>
          </Link>
          <nav className="hidden gap-7 text-sm font-medium text-slate-400 md:flex">
            <Link href="/" className="hover:text-slate-50 transition-colors">Energy Platform</Link>
            <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-50 transition-colors">Contact</a>
          </nav>
          <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
            className="btn-3d-sm">
            Ga naar gbict.nl →
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="hero-bg grid-pattern relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-15"
              style={{ background: 'radial-gradient(ellipse, rgba(29,78,216,0.8) 0%, transparent 70%)' }} />
          </div>
          <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full badge-glow px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              Nederlands softwarebedrijf
            </div>

            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="flex-1 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl"
                  style={{ letterSpacing: '-0.03em' }}>
                  <span className="text-slate-50">Wij bouwen software</span>
                  <br />
                  <span className="text-gradient-blue">die werkt</span>
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400">
                  GBICT is een Nederlands softwarebedrijf. We bouwen apps, platforms en AI-oplossingen
                  voor bedrijven die willen groeien. Geen standaard software — alles op maat,
                  voor jouw situatie.
                </p>
              </div>

              {/* Logo large display */}
              <div className="flex-shrink-0 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
                    style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.8), rgba(8,145,178,0.4))' }} />
                  <Image src="/gbict-logo.webp" alt="GBICT logo" width={180} height={180}
                    className="relative rounded-3xl logo-glow"
                    style={{ boxShadow: '0 0 60px rgba(29,78,216,0.4), 0 0 120px rgba(8,145,178,0.2)' }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap gap-4">
              <div className="glow-card px-8 py-5">
                <p className="text-gradient-gold font-extrabold" style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em' }}>8+</p>
                <p className="mt-1.5 text-sm text-slate-400">jaar ervaring</p>
              </div>
              <div className="glow-card px-8 py-5">
                <p className="text-gradient-gold font-extrabold" style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em' }}>100+</p>
                <p className="mt-1.5 text-sm text-slate-400">projecten opgeleverd</p>
              </div>
              <div className="glow-card px-8 py-5">
                <p className="text-gradient-blue font-extrabold" style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em' }}>NL</p>
                <p className="mt-1.5 text-sm text-slate-400">gevestigd in Nederland</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">Diensten</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 md:text-5xl max-w-2xl"
            style={{ letterSpacing: '-0.03em' }}>
            Wat we doen
          </h2>
          <p className="mt-5 max-w-2xl text-slate-400 leading-relaxed">
            Van software-ontwikkeling tot cloud-infrastructuur en AI — we dekken het hele spectrum
            van digitale oplossingen.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
              <div key={service.title} className="glow-card p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: service.color }}>
                  <Icon className="h-6 w-6 text-slate-100" />
                </div>
                <h3 className="text-lg font-bold text-slate-50 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{service.description}</p>
              </div>
              )
            })}
          </div>
        </section>

        {/* ── GBICT ENERGY SPOTLIGHT ───────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <div className="rounded-3xl p-10 md:p-14"
              style={{
                background: 'linear-gradient(135deg, rgba(29,78,216,0.2) 0%, rgba(8,145,178,0.15) 100%)',
                border: '1px solid rgba(250,204,21,0.2)',
                boxShadow: '0 0 60px rgba(250,204,21,0.05), 0 20px 60px rgba(0,0,0,0.4)',
              }}>
              <div className="mb-5">
                <span className="inline-flex items-center rounded-full badge-glow px-3 py-1 text-xs font-bold text-yellow-300 uppercase tracking-widest">
                  Ons nieuwste product
                </span>
              </div>
              <div className="flex flex-col gap-10 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <Image src="/gbict-logo.webp" alt="GBICT Energy" width={44} height={44}
                      className="rounded-xl logo-glow" />
                    <h2 className="text-3xl font-extrabold text-slate-50" style={{ letterSpacing: '-0.03em' }}>
                      GBICT Energy
                    </h2>
                  </div>
                  <p className="text-slate-300 leading-relaxed max-w-xl">
                    We bouwen niet alleen voor klanten — we bouwen ook eigen producten. GBICT Energy is
                    ons eerste SaaS-platform voor de energiemarkt. Het optimaliseert thuisbatterijen
                    automatisch op basis van dynamische energieprijzen en helpt huishoudens en bedrijven
                    fors besparen op hun energierekening.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Thuisbatterij-optimalisatie', 'Dynamische energieprijzen', 'Virtueel Powerplant (VPP)', 'Hardware-agnostisch'].map(tag => (
                      <span key={tag} className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/" className="btn-3d-primary">
                    Bekijk GBICT Energy →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY GBICT ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">Waarom wij</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 mb-14"
            style={{ letterSpacing: '-0.03em' }}>
            Waarom{' '}
            <span className="text-gradient-blue">GBICT?</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {whyUs.map((item, i) => (
              <div key={item.title} className="glow-card p-7">
                <div className="step-circle mb-6">{i + 1}</div>
                <h3 className="text-xl font-bold text-slate-50 mb-3" style={{ letterSpacing: '-0.02em' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT CTA ──────────────────────────────────── */}
        <section className="relative overflow-hidden py-28">
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(29,78,216,0.22), transparent 70%)' }} />
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl"
              style={{ letterSpacing: '-0.03em' }}>
              Heb je een{' '}
              <span className="text-gradient-blue">project?</span>
            </h2>
            <p className="mt-5 text-lg text-slate-400 leading-relaxed">
              Plan een gesprek in en vertel ons wat je wil bouwen.
              We reageren binnen één werkdag.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
                className="btn-3d-primary">
                Stuur ons een bericht →
              </a>
              <Link href="/" className="btn-3d-secondary">
                GBICT Energy bekijken
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06]" style={{ background: 'rgba(2,6,23,0.95)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/gbict-logo.webp" alt="GBICT" width={32} height={32}
              className="rounded-lg logo-glow" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-300">GBICT</span>
              <span className="text-xs text-slate-600">© {new Date().getFullYear()}</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-200 transition-colors">Energy Platform</Link>
            <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors">gbict.nl</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
