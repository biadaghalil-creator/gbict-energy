import Link from 'next/link'
import Image from 'next/image'
import { Code, Cloud, Globe, Monitor, Wrench, Bot } from 'lucide-react'

export const metadata = {
  title: 'About GBICT — Dutch software company',
  description: 'GBICT is a Dutch software company. We build apps, platforms, and AI solutions for businesses that want to grow.',
}

const services = [
  { icon: Code, title: 'Software development', description: 'From idea to working app. Web, mobile, or internal platform — fully custom-built.', color: 'rgba(250,204,21,0.1)' },
  { icon: Cloud, title: 'Cloud solutions', description: 'Scalable infrastructure that grows with your business. Lower costs, higher reliability.', color: 'rgba(34,211,238,0.1)' },
  { icon: Globe, title: 'Websites', description: 'Fast, beautiful websites that actually convert. No templates — built around your brand.', color: 'rgba(99,102,241,0.1)' },
  { icon: Monitor, title: 'Workplace management', description: 'Your IT environment, fully taken care of. No hassle, no surprises on the invoice.', color: 'rgba(52,211,153,0.1)' },
  { icon: Wrench, title: 'Technical support', description: 'Immediate help when something goes wrong. No waiting times, no call centers — we are reachable.', color: 'rgba(168,85,247,0.1)' },
  { icon: Bot, title: 'AI & Data', description: 'Smart solutions that automate your processes. From chatbots to predictive models.', color: 'rgba(251,146,60,0.1)' },
]

const whyUs = [
  { title: 'Tailor-made', description: 'No templates, no off-the-shelf packages. Everything built for your situation, your processes, your scale.' },
  { title: 'Direct communication', description: 'Direct communication, no middlemen. You always talk to the people who actually build it.' },
  { title: 'From idea to live', description: 'We guide the entire journey — from first sketch to a live product and ongoing development.' },
]

export default function AboutPage() {
  return (
    <div className="dark flex flex-col min-h-screen text-[var(--text)]" style={{ background: 'var(--bg)' }}>

      {/* ── HEADER ───────────────────────────────────────── */}
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
              <span className="text-xs font-medium text-[var(--text-faint)]">Software</span>
            </div>
          </Link>
          <nav className="hidden gap-7 text-sm font-medium text-[var(--text-muted)] md:flex">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">Energy Platform</Link>
            <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
              className="hover:text-[var(--text)] transition-colors">Contact</a>
          </nav>
          <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
            className="btn-3d-sm">
            Go to gbict.nl →
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
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full badge-glow px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Dutch software company
            </div>

            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="flex-1 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl"
                  style={{ letterSpacing: '-0.03em' }}>
                  <span className="text-[var(--text)]">We build software</span>
                  <br />
                  <span className="text-gradient-blue">that works</span>
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
                  GBICT is a Dutch software company. We build apps, platforms, and AI solutions
                  for businesses that want to grow. No off-the-shelf software — everything tailor-made,
                  for your situation.
                </p>
              </div>

              {/* Logo large display */}
              <div className="flex-shrink-0 flex justify-center md:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-40"
                    style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.8), rgba(8,145,178,0.4))' }} />
                  <Image src="/gbict-logo.png" alt="GBICT logo" width={180} height={180}
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
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">years of experience</p>
              </div>
              <div className="glow-card px-8 py-5">
                <p className="text-gradient-gold font-extrabold" style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em' }}>100+</p>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">projects delivered</p>
              </div>
              <div className="glow-card px-8 py-5">
                <p className="text-gradient-blue font-extrabold" style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em' }}>NL</p>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">based in the Netherlands</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Services</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[var(--text)] md:text-5xl max-w-2xl"
            style={{ letterSpacing: '-0.03em' }}>
            What we do
          </h2>
          <p className="mt-5 max-w-2xl text-[var(--text-muted)] leading-relaxed">
            From software development to cloud infrastructure and AI — we cover the entire spectrum
            of digital solutions.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
              <div key={service.title} className="glow-card p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: service.color }}>
                  <Icon className="h-6 w-6 text-[var(--text)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">{service.description}</p>
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
                <span className="inline-flex items-center rounded-full badge-glow px-3 py-1 text-xs font-bold text-emerald-300 uppercase tracking-widest">
                  Our newest product
                </span>
              </div>
              <div className="flex flex-col gap-10 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <Image src="/gbict-logo.png" alt="GBICT Energy" width={44} height={44}
                      className="rounded-xl logo-glow" />
                    <h2 className="text-3xl font-extrabold text-[var(--text)]" style={{ letterSpacing: '-0.03em' }}>
                      GBICT Energy
                    </h2>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed max-w-xl">
                    We do not just build for clients — we build our own products too. GBICT Energy is
                    our first SaaS platform for the energy market. It optimizes home batteries
                    automatically based on dynamic energy prices and helps households and businesses
                    save significantly on their energy bill.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Home battery optimization', 'Dynamic energy prices', 'Virtual power plant (VPP)', 'Hardware-agnostic'].map(tag => (
                      <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href="/" className="btn-3d-primary">
                    View GBICT Energy →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY GBICT ────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Why us</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[var(--text)] mb-14"
            style={{ letterSpacing: '-0.03em' }}>
            Why{' '}
            <span className="text-gradient-blue">GBICT?</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {whyUs.map((item, i) => (
              <div key={item.title} className="glow-card p-7">
                <div className="step-circle mb-6">{i + 1}</div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3" style={{ letterSpacing: '-0.02em' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{item.description}</p>
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
              Have a{' '}
              <span className="text-gradient-blue">project?</span>
            </h2>
            <p className="mt-5 text-lg text-[var(--text-muted)] leading-relaxed">
              Schedule a call and tell us what you want to build.
              We respond within one business day.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
                className="btn-3d-primary">
                Send us a message →
              </a>
              <Link href="/" className="btn-3d-secondary">
                View GBICT Energy
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)]" style={{ background: 'rgba(2,6,23,0.95)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/gbict-logo.png" alt="GBICT" width={32} height={32}
              className="rounded-lg logo-glow" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-[var(--text-muted)]">GBICT</span>
              <span className="text-xs text-[var(--text-faint)]">© {new Date().getFullYear()}</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm text-[var(--text-faint)]">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">Energy Platform</Link>
            <a href="https://gbict.nl" target="_blank" rel="noopener noreferrer"
              className="hover:text-[var(--text)] transition-colors">gbict.nl</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
