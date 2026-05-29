'use client'

import { type TibberPrice } from '@/lib/tibber'
import { type ScheduleSlot } from '@/lib/optimize'

export default function PriceChart({
  prices,
  schedule,
  label = 'Prijzen vandaag (€/kWh)',
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
  const now = new Date()
  const currentHour = now.getHours()

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
        <div className="flex items-center gap-3 text-[10px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-400" /> Goedkoop
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-amber-400" /> Normaal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-red-400" /> Duur
          </span>
          {schedule && (
            <>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-emerald-600 opacity-60 ring-1 ring-emerald-500" /> Laden
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-orange-500 opacity-60 ring-1 ring-orange-400" /> Ontladen
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex h-24 items-end gap-0.5">
        {prices.map((price, i) => {
          const hour = new Date(price.startsAt).getHours()
          const heightPct = ((price.total - min) / range) * 75 + 25
          const isCurrent = hour === currentHour
          const ratio = (price.total - min) / range
          const slot = schedule?.find((s) => new Date(s.startsAt).getHours() === hour)

          let barColor = ratio < 0.33 ? 'bg-emerald-400' : ratio > 0.66 ? 'bg-red-400' : 'bg-amber-400'
          let ring = ''
          if (slot?.action === 'charge') {
            barColor = 'bg-emerald-500'
            ring = 'ring-2 ring-emerald-300 dark:ring-emerald-700'
          } else if (slot?.action === 'discharge') {
            barColor = 'bg-orange-500'
            ring = 'ring-2 ring-orange-300 dark:ring-orange-700'
          }

          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center">
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded-lg bg-zinc-900 px-2 py-1 text-[10px] text-white group-hover:block dark:bg-zinc-700 whitespace-nowrap z-10">
                {hour}:00 — €{price.total.toFixed(4)}
                {slot?.action === 'charge' && ' ↓ Laden'}
                {slot?.action === 'discharge' && ' ↑ Ontladen'}
              </div>
              <div
                className={`w-full rounded-t-sm transition-all ${barColor} ${ring} ${
                  isCurrent ? 'opacity-100 outline outline-2 outline-zinc-900 dark:outline-zinc-100' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              {hour % 4 === 0 && (
                <span className="mt-1 text-[9px] text-zinc-400">{hour}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
