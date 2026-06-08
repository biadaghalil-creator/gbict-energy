'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

type Props = {
  status: string | null
  plan: string | null
  currentPeriodEnd: string | null
  trialEndsAt: string | null
}

const PLAN_OPTIONS: {
  id: 'starter' | 'pro'
  nameKey: 'planStarter' | 'planPro'
  price: number
  featureKeys: ('starterF1' | 'starterF2' | 'starterF3' | 'proF1' | 'proF2' | 'proF3' | 'proF4')[]
}[] = [
  { id: 'starter', nameKey: 'planStarter', price: 15, featureKeys: ['starterF1', 'starterF2', 'starterF3'] },
  { id: 'pro', nameKey: 'planPro', price: 25, featureKeys: ['proF1', 'proF2', 'proF3', 'proF4'] },
]

function fmt(date: string | null, tag: string) {
  if (!date) return null
  try {
    return new Date(date).toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return null
  }
}

export default function SubscriptionCard({ status, plan, currentPeriodEnd, trialEndsAt }: Props) {
  const { t, tag } = useT()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const active = status === 'active' || status === 'trialing'

  async function startCheckout(planId: string) {
    setLoading(planId)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? t.dashboard.settings.subError)
    } catch {
      setError(t.dashboard.settings.subError)
    } finally {
      setLoading(null)
    }
  }

  async function openPortal() {
    setLoading('portal')
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? t.dashboard.settings.subError)
    } catch {
      setError(t.dashboard.settings.subError)
    } finally {
      setLoading(null)
    }
  }

  return (
    <section
      className={
        active
          ? 'relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-600/20 via-[var(--surface)] to-[var(--surface)] p-6 shadow-[0_0_40px_rgba(16,185,129,0.12),inset_0_1px_0_rgba(16,185,129,0.25)] backdrop-blur'
          : 'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 backdrop-blur'
      }
    >
      {active && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.25),transparent_70%)]" />
      )}
      <h2 className="relative text-[15px] font-bold tracking-tight text-[var(--text)]">{t.dashboard.settings.subTitle}</h2>

      {active ? (
        <div className="mt-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {status === 'trialing' ? t.dashboard.settings.subTrialing : t.dashboard.settings.subActive}
            </span>
            {plan && <span className="text-[13px] font-medium text-[var(--text-muted)] capitalize">{plan}</span>}
          </div>
          <p className="mt-3 text-[13px] text-[var(--text-faint)]">
            {status === 'trialing' && trialEndsAt
              ? fill(t.dashboard.settings.subTrialEnds, { date: fmt(trialEndsAt, tag) ?? '' })
              : currentPeriodEnd
              ? fill(t.dashboard.settings.subRenews, { date: fmt(currentPeriodEnd, tag) ?? '' })
              : t.dashboard.settings.subActivePlain}
          </p>
          <button
            onClick={openPortal}
            disabled={loading !== null}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-6 text-[14px] font-medium text-white transition-colors hover:bg-[var(--surface-2)] disabled:opacity-50"
          >
            {loading === 'portal' && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.dashboard.settings.subManage}
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1.5 text-[13px] text-[var(--text-faint)]">
            {t.dashboard.settings.subChooseDesc}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {PLAN_OPTIONS.map((p) => (
              <div key={p.id} className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-bold text-[var(--text)]">{t.dashboard.settings[p.nameKey]}</span>
                  <span className="text-[15px] font-bold text-[var(--text)]">€{p.price}<span className="text-[12px] font-medium text-[var(--text-faint)]">{t.common.perMonth}</span></span>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {p.featureKeys.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-[var(--text-muted)]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {t.dashboard.settings[f]}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => startCheckout(p.id)}
                  disabled={loading !== null}
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#047857] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#059669] disabled:opacity-50"
                >
                  {loading === p.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t.dashboard.settings.subStartTrial}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {error && <p className="mt-4 text-[13px] text-red-400">{error}</p>}
    </section>
  )
}
