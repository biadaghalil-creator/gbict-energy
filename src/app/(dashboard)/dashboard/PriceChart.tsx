'use client'

import { type TibberPrice } from '@/lib/tibber'
import { type ScheduleSlot } from '@/lib/optimize'

export default function PriceChart({
  prices,
  schedule,
  label = 'Energy prices today (€/kWh)',
}: {
  prices: TibberPrice[]
  schedule?: ScheduleSlot[]
  label?: string
}) {
  if (prices.length === 0) return null

  const totals = prices.map((p) => p.total)
  const min = Math.min(...totals)
  const max = Math.max(...totals)
  const range = max - min || 0.01
  const currentHour = new Date().getHours()

  return (
    <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)] p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">{label}</p>
        <div className="flex items-center gap-4 text-[11px] text-[var(--text-faint)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Charge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" /> Sell
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-slate-600" /> Idle
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex h-[80px] items-end gap-[3px]">
        {prices.map((price, i) => {
          const hour = new Date(price.startsAt).getHours()
          const heightPct = ((price.total - min) / range) * 70 + 30
          const isCurrent = hour === currentHour
          const ratio = (price.total - min) / range
          const slot = schedule?.find((s) => new Date(s.startsAt).getHours() === hour)

          let barColor = ratio < 0.33
            ? 'bg-emerald-500/60'
            : ratio > 0.66
              ? 'bg-red-500/60'
              : 'bg-slate-500/40'

          if (slot?.action === 'charge') barColor = 'bg-emerald-500'
          else if (slot?.action === 'discharge') barColor = 'bg-amber-500'

          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center">
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 text-[11px] text-[var(--text-muted)] shadow-xl group-hover:block">
                {String(hour).padStart(2, '0')}:00 — €{price.total.toFixed(4)}
                {slot?.action === 'charge' && <span className="ml-1 text-emerald-400">↑ Charge</span>}
                {slot?.action === 'discharge' && <span className="ml-1 text-amber-400">↓ Sell</span>}
              </div>

              <div
                className={`w-full rounded-t-[3px] transition-all ${barColor} ${
                  isCurrent ? 'ring-1 ring-white/40' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {hour % 6 === 0 && (
                <span className="mt-1.5 text-[9px] tabular-nums text-[var(--text-faint)]">{hour}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
