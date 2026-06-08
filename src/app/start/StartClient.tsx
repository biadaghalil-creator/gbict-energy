'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

const PLAN_OPTIONS = [
  { id: 'starter', name: 'Starter', price: 15, features: ['1 batterij + 1 meter', 'Automatische optimalisatie', 'Besparingsoverzicht'] },
  { id: 'pro', name: 'Pro', price: 25, features: ['Onbeperkt apparaten', 'Zonne-optimalisatie', 'VPP / virtueel energienet', 'Prioriteit support'] },
] as const

export default function StartClient() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      else { setError(data.error ?? 'Er ging iets mis.'); setLoading(null) }
    } catch {
      setError('Kon de betaalpagina niet openen.')
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center">
        <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--text)]">Start je proefperiode</h1>
        <p className="mt-2 text-[14px] text-[var(--text-muted)]">
          14 dagen gratis. Je betaalt nu niets — we leggen alleen je kaart vast. Daarna {''}
          maandelijks opzegbaar.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PLAN_OPTIONS.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 backdrop-blur">
            <div className="flex items-baseline justify-between">
              <span className="text-[16px] font-bold text-[var(--text)]">{p.name}</span>
              <span className="text-[16px] font-bold text-[var(--text)]">€{p.price}<span className="text-[12px] font-medium text-[var(--text-faint)]">/mnd</span></span>
            </div>
            <ul className="mt-4 flex-1 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--text-muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => startCheckout(p.id)}
              disabled={loading !== null}
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#047857] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#059669] disabled:opacity-50"
            >
              {loading === p.id && <Loader2 className="h-4 w-4 animate-spin" />}
              Start 14 dagen gratis
            </button>
          </div>
        ))}
      </div>

      {error && <p className="mt-5 text-center text-[13px] text-red-400">{error}</p>}
    </div>
  )
}
