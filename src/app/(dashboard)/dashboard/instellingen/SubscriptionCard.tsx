'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

type Props = {
  status: string | null
  plan: string | null
  currentPeriodEnd: string | null
  trialEndsAt: string | null
}

const PLAN_OPTIONS = [
  { id: 'starter', name: 'Starter', price: 15, features: ['1 batterij + 1 meter', 'Automatische optimalisatie', 'Besparingsoverzicht'] },
  { id: 'pro', name: 'Pro', price: 25, features: ['Onbeperkt apparaten', 'Zonne-optimalisatie', 'VPP / virtueel energienet', 'Prioriteit support'] },
] as const

function fmt(date: string | null) {
  if (!date) return null
  try {
    return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return null
  }
}

export default function SubscriptionCard({ status, plan, currentPeriodEnd, trialEndsAt }: Props) {
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
      else setError(data.error ?? 'Er ging iets mis.')
    } catch {
      setError('Kon de betaalpagina niet openen.')
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
      else setError(data.error ?? 'Er ging iets mis.')
    } catch {
      setError('Kon het abonnementsbeheer niet openen.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section
      className={
        active
          ? 'relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-600/20 via-[#0D0E16] to-[#0D0E16] p-6 shadow-[0_0_40px_rgba(124,58,237,0.12),inset_0_1px_0_rgba(139,92,246,0.25)] backdrop-blur'
          : 'rounded-2xl border border-white/[0.06] bg-[#0D0E16]/70 p-6 backdrop-blur'
      }
    >
      {active && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25),transparent_70%)]" />
      )}
      <h2 className="relative text-[15px] font-bold tracking-tight text-slate-100">Abonnement</h2>

      {active ? (
        <div className="mt-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {status === 'trialing' ? 'Proefperiode' : 'Actief'}
            </span>
            {plan && <span className="text-[13px] font-medium text-slate-300 capitalize">{plan}</span>}
          </div>
          <p className="mt-3 text-[13px] text-slate-500">
            {status === 'trialing' && trialEndsAt
              ? `Je proefperiode loopt tot ${fmt(trialEndsAt)}.`
              : currentPeriodEnd
              ? `Verlengt automatisch op ${fmt(currentPeriodEnd)}.`
              : 'Je abonnement is actief.'}
          </p>
          <button
            onClick={openPortal}
            disabled={loading !== null}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-6 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.06] disabled:opacity-50"
          >
            {loading === 'portal' && <Loader2 className="h-4 w-4 animate-spin" />}
            Abonnement beheren
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1.5 text-[13px] text-slate-500">
            Kies een plan om automatische optimalisatie aan te zetten. 14 dagen gratis, daarna maandelijks opzegbaar.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {PLAN_OPTIONS.map((p) => (
              <div key={p.id} className="flex flex-col rounded-xl border border-white/[0.07] bg-[#07080D]/60 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] font-bold text-slate-100">{p.name}</span>
                  <span className="text-[15px] font-bold text-slate-100">€{p.price}<span className="text-[12px] font-medium text-slate-500">/mnd</span></span>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12.5px] text-slate-400">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => startCheckout(p.id)}
                  disabled={loading !== null}
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#5B21B6] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#6D28D9] disabled:opacity-50"
                >
                  {loading === p.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  Start 14 dagen gratis
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
