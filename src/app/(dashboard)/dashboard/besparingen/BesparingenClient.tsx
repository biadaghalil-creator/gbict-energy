'use client'

import { useEffect, useState } from 'react'

type DayData = {
  date: string
  savings: number
  charge: number
  discharge: number
}

type RecentLog = {
  action: string
  price_eur: number
  kwh: number
  savings_eur: number
  created_at: string
}

type HistoryData = {
  days: DayData[]
  totals: {
    today: number
    month: number
    total: number
    actions: number
  }
  recent: RecentLog[]
}

const RANGES = [
  { label: '7 dagen', days: 7 },
  { label: '30 dagen', days: 30 },
  { label: '90 dagen', days: 90 },
]

function fmt(n: number) {
  return `€${n.toFixed(2).replace('.', ',')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── SVG-free bar chart ───────────────────────────────────────────────────────
function SavingsChart({ days }: { days: DayData[] }) {
  const maxSavings = Math.max(...days.map((d) => d.savings), 0.01)

  // Show only every Nth label to avoid clutter
  const labelEvery = days.length <= 7 ? 1 : days.length <= 30 ? 5 : 10

  return (
    <div className="mt-4">
      <div className="flex h-40 items-end gap-[2px]">
        {days.map((day, i) => {
          const pct = (day.savings / maxSavings) * 100
          const isToday = day.date === new Date().toISOString().split('T')[0]
          return (
            <div
              key={day.date}
              className="group relative flex flex-1 flex-col items-center"
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full mb-1 hidden -translate-x-1/2 left-1/2 z-10 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-zinc-700">
                {fmtDate(day.date)}: {fmt(day.savings)}
                {(day.charge + day.discharge) > 0 && (
                  <span className="ml-1 text-zinc-400">
                    ({day.charge}↑ {day.discharge}↓)
                  </span>
                )}
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t-sm transition-all ${
                  day.savings > 0
                    ? isToday
                      ? 'bg-emerald-400 dark:bg-emerald-500'
                      : 'bg-emerald-500/70 dark:bg-emerald-600/70 group-hover:bg-emerald-500'
                    : 'bg-zinc-100 dark:bg-zinc-800'
                }`}
                style={{ height: `${Math.max(pct, day.savings > 0 ? 4 : 2)}%` }}
              />
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="mt-1 flex gap-[2px]">
        {days.map((day, i) => (
          <div key={day.date} className="flex flex-1 justify-center">
            {i % labelEvery === 0 && (
              <span className="text-[9px] text-zinc-400 dark:text-zinc-600">
                {fmtDate(day.date).split(' ')[0]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BesparingenClient() {
  const [activeDays, setActiveDays] = useState(30)
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData(null)
    fetch(`/api/savings/history?days=${activeDays}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeDays])

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Vandaag', value: data?.totals.today ?? 0, sub: 'bespaard' },
          { label: 'Deze maand', value: data?.totals.month ?? 0, sub: 'bespaard' },
          { label: 'Totaal ooit', value: data?.totals.total ?? 0, sub: 'bespaard' },
          { label: 'Acties', value: null, count: data?.totals.actions ?? 0, sub: 'geautomatiseerd' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
            {loading ? (
              <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            ) : (
              <>
                <p
                  className={`mt-2 text-2xl font-semibold tracking-tight ${
                    (card.value ?? 0) > 0 || (card.count ?? 0) > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {card.value !== null ? fmt(card.value ?? 0) : (card.count ?? 0)}
                </p>
                <p className="mt-1 text-xs text-zinc-400">{card.sub}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Dagelijkse besparingen
          </p>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setActiveDays(r.days)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeDays === r.days
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-4 flex h-40 items-end gap-[2px]">
            {Array.from({ length: activeDays }).map((_, i) => (
              <div
                key={i}
                className="flex-1 animate-pulse rounded-t-sm bg-zinc-100 dark:bg-zinc-800"
                style={{ height: `${20 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        ) : data && data.days.length > 0 ? (
          <SavingsChart days={data.days} />
        ) : (
          <div className="mt-4 flex h-40 flex-col items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-400">Nog geen besparingsdata</p>
            <p className="mt-1 text-xs text-zinc-400">
              Koppel een batterij om automatisch te besparen
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span className="text-xs text-zinc-500">Besparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-zinc-100 dark:bg-zinc-700" />
            <span className="text-xs text-zinc-500">Geen actie</span>
          </div>
        </div>
      </div>

      {/* Recent actions table */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Recente acties
          </p>
        </div>

        {loading ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-7 w-7 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                  <div className="h-3 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
                <div className="h-4 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : data && data.recent.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.recent.map((log, i) => {
              const isCharge = log.action === 'charge'
              const isDischarge = log.action === 'discharge'
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  {/* Icon */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
                      isCharge
                        ? 'bg-emerald-100 dark:bg-emerald-950'
                        : isDischarge
                        ? 'bg-orange-100 dark:bg-orange-950'
                        : 'bg-zinc-100 dark:bg-zinc-800'
                    }`}
                  >
                    {isCharge ? '⬆' : isDischarge ? '⬇' : '—'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {isCharge ? 'Opladen' : isDischarge ? 'Ontladen' : 'Inactief'}
                      {log.kwh > 0 && (
                        <span className="ml-1.5 font-normal text-zinc-500">
                          {log.kwh.toFixed(1)} kWh
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {fmtDateTime(log.created_at)}
                      {log.price_eur > 0 && (
                        <span className="ml-1.5">@ €{log.price_eur.toFixed(4)}/kWh</span>
                      )}
                    </p>
                  </div>

                  {/* Savings */}
                  <div className="text-right">
                    {(log.savings_eur ?? 0) > 0 ? (
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        +{fmt(log.savings_eur)}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-zinc-400">Nog geen acties uitgevoerd</p>
            <p className="mt-1 text-xs text-zinc-400">
              De optimizer runt elk uur automatisch
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
