'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { type SessyStatus, sessyStateLabel } from '@/lib/sessy'
import { Skeleton } from '@/components/ui/skeleton'

export default function SessyCard() {
  const [status, setStatus] = useState<SessyStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessy/status')
      .then(r => r.json())
      .then(d => { setStatus(d); setLoading(false) })
      .catch(() => setLoading(false))

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
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
           Home battery · Sessy
        </span>
        {stateInfo && (
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
            <span className="h-[14px] w-[3px] rounded-sm bg-emerald-400" />
            {stateInfo.label}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-24 bg-white/[0.04]" />
          <Skeleton className="h-2 w-full rounded-full bg-white/[0.04]" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-xl bg-white/[0.04]" />
            <Skeleton className="h-16 rounded-xl bg-white/[0.04]" />
          </div>
        </div>
      ) : status ? (
        <>
          {/* SoC number */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[44px] font-semibold leading-none tracking-[-0.03em] text-slate-50">
              {status.state_of_charge}
            </span>
            <span className="text-[13px] text-slate-500">% state of charge</span>
          </div>

          {status.power !== 0 && (
            <p className="mt-1 text-[11.5px] text-slate-600">
              {status.power > 0 ? 'charging' : 'discharging'} · {Math.abs(status.power)}W
            </p>
          )}

          {/* Gradient progress bar — same as hero */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${status.state_of_charge}%`,
                background: 'linear-gradient(90deg, #5B21B6, #A78BFA)',
              }}
            />
          </div>

          {/* Mini stat cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {status.renewable_energy > 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                <p className="text-[11px] text-slate-500">Zon</p>
                <p className="mt-1 font-mono text-[17px] text-amber-400">
                  {status.renewable_energy}W
                </p>
              </div>
            )}
            {status.grid_power !== 0 && (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                <p className="text-[11px] text-slate-500">Grid</p>
                <p className="mt-1 font-mono text-[17px] text-slate-300">
                  {Math.abs(status.grid_power)}W
                  <span className="ml-1 text-[11px] text-slate-600">
                    {status.grid_power > 0 ? 'in' : 'out'}
                  </span>
                </p>
              </div>
            )}
          </div>

          <OptimizeButton />
        </>
      ) : (
        <p className="mt-4 text-[13px] text-slate-600">Batterij niet bereikbaar</p>
      )}
    </div>
  )
}

function OptimizeButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function applySchedule() {
    setState('loading')
    try {
      const hour = new Date().getHours()
      const pricesRes = await fetch('/api/tibber/prices')
      const pricesData = await pricesRes.json()
      const schedule = pricesData?.optimization?.schedule ?? []
      const slot = schedule.find((s: { hour: number }) => s.hour === hour)

      let setpoint = 0
      if (slot?.action === 'charge') setpoint = 1500
      if (slot?.action === 'discharge') setpoint = -1500

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
      className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-medium transition-colors ${
        state === 'done'
          ? 'bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/20'
          : state === 'error'
            ? 'bg-red-950/30 text-red-400'
            : 'bg-white/[0.04] text-slate-400 hover:bg-violet-500/10 hover:text-violet-400 ring-1 ring-white/[0.06]'
      }`}
    >
      <Zap className="h-3.5 w-3.5" />
      {state === 'loading' ? 'Applying…'
        : state === 'done' ? 'Schema toegepast'
        : state === 'error' ? 'Failed — try again'
        : 'Optimalisatie toepassen'}
    </button>
  )
}
