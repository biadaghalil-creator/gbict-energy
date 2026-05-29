'use client'

import { useEffect, useState } from 'react'
import { type SessyStatus, sessyStateLabel } from '@/lib/sessy'

export default function SessyCard() {
  const [status, setStatus] = useState<SessyStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessy/status')
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false) })
      .catch(() => setLoading(false))

    // Ververs elke 30 seconden
    const interval = setInterval(() => {
      fetch('/api/sessy/status')
        .then(r => r.json())
        .then(d => setStatus(d))
        .catch(() => {})
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  const stateInfo = status ? sessyStateLabel(status.system_state) : null

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Batterij status</p>
        <span className="text-lg">🔋</span>
      </div>

      {loading ? (
        <div className="mt-3 space-y-2">
          <div className="h-6 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-2 w-full animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : status ? (
        <>
          {/* State of charge */}
          <div className="mt-3">
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {status.state_of_charge}%
              </p>
              <p className={`text-xs font-medium ${stateInfo?.color}`}>
                {status.power !== 0 && (
                  <span>{status.power > 0 ? '+' : ''}{status.power}W </span>
                )}
                {stateInfo?.label}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status.state_of_charge > 60 ? 'bg-emerald-500'
                  : status.state_of_charge > 25 ? 'bg-amber-500'
                  : 'bg-red-500'
                }`}
                style={{ width: `${status.state_of_charge}%` }}
              />
            </div>
          </div>

          {/* Vermogen details */}
          <div className="mt-3 flex gap-4 text-xs text-zinc-400">
            {status.renewable_energy > 0 && (
              <span>☀️ {status.renewable_energy}W zon</span>
            )}
            {status.grid_power !== 0 && (
              <span>🔌 {Math.abs(status.grid_power)}W {status.grid_power > 0 ? 'net in' : 'net uit'}</span>
            )}
          </div>

          {/* Optimalisatie knop */}
          <OptimizeButton />
        </>
      ) : (
        <p className="mt-2 text-sm text-zinc-400">Niet bereikbaar</p>
      )}
    </div>
  )
}

function OptimizeButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function applySchedule() {
    setState('loading')
    try {
      // Haal huidig uur op en stuur juiste setpoint
      const hour = new Date().getHours()
      const pricesRes = await fetch('/api/tibber/prices')
      const pricesData = await pricesRes.json()
      const schedule = pricesData?.optimization?.schedule ?? []
      const slot = schedule.find((s: { hour: number }) => s.hour === hour)

      let setpoint = 0
      if (slot?.action === 'charge')    setpoint = 1500   // 1500W laden
      if (slot?.action === 'discharge') setpoint = -1500  // 1500W ontladen

      const res = await fetch('/api/sessy/setpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setpoint }),
      })
      setState(res.ok ? 'done' : 'error')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={applySchedule}
      disabled={state === 'loading'}
      className={`mt-3 w-full rounded-xl py-2 text-xs font-medium transition-colors ${
        state === 'done'  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
        : state === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-950/30'
        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {state === 'loading' ? 'Toepassen…'
        : state === 'done'    ? '✓ Schema toegepast'
        : state === 'error'   ? '✗ Mislukt — probeer opnieuw'
        : '⚡ Pas optimalisatie toe'}
    </button>
  )
}
