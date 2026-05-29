'use client'

import { useEffect, useState } from 'react'
import { type TibberPriceData, priceLevel } from '@/lib/tibber'
import { type OptimizationResult } from '@/lib/optimize'
import PriceChart from './PriceChart'

type DashboardData = TibberPriceData & {
  optimization: OptimizationResult
}

export default function TibberData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tibber/prices')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const current = data?.current ?? null
  const todayPrices = data?.today ?? []
  const tomorrowPrices = data?.tomorrow ?? []
  const optimization = data?.optimization
  const level = current ? priceLevel(current.total, todayPrices) : null

  const levelConfig = {
    low:    { label: 'Goedkoop', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    normal: { label: 'Normaal',  color: 'text-amber-600 dark:text-amber-400',     dot: 'bg-amber-500'   },
    high:   { label: 'Duur',     color: 'text-red-600 dark:text-red-400',          dot: 'bg-red-500'     },
  }
  const currentConfig = level ? levelConfig[level] : null

  return (
    <>
      {/* Huidige prijs kaart */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Huidige prijs</p>
        {loading ? (
          <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        ) : current ? (
          <>
            <div className="mt-2 flex items-end gap-2">
              <p className={`text-2xl font-semibold tracking-tight ${currentConfig?.color}`}>
                €{current.total.toFixed(4)}
              </p>
              <span className="mb-0.5 text-sm text-zinc-400">/kWh</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${currentConfig?.dot}`} />
              <p className="text-xs text-zinc-400">{currentConfig?.label}</p>
            </div>
          </>
        ) : (
          <p className="mt-2 text-2xl font-semibold text-zinc-400">€ —</p>
        )}
      </div>

      {/* Geschatte besparing kaart */}
      {!loading && optimization && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Besparing vandaag</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
            ~€{optimization.estimatedSavings.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">Schatting o.b.v. 5 kWh batterij</p>
        </div>
      )}

      {/* Prijsgrafiek vandaag */}
      {!loading && todayPrices.length > 0 && (
        <div className="col-span-full">
          <PriceChart prices={todayPrices} schedule={optimization?.schedule} />
        </div>
      )}

      {/* Optimalisatie schema */}
      {!loading && optimization && (
        <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Optimalisatie schema vandaag
          </p>
          <div className="space-y-2">
            {optimization.schedule
              .filter((s) => s.action !== 'idle')
              .map((slot) => (
                <div key={slot.hour} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
                    {String(slot.hour).padStart(2, '0')}:00
                  </span>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      slot.action === 'charge'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                    }`}
                  >
                    {slot.action === 'charge' ? '↓ Laden' : '↑ Ontladen'}
                  </span>
                  <span className="text-xs text-zinc-400">€{slot.price.toFixed(4)}/kWh</span>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            Schema wordt elke dag automatisch bijgewerkt op basis van de EPEX spotprijzen.
          </p>
        </div>
      )}

      {/* Morgen's prijzen */}
      {!loading && tomorrowPrices.length > 0 && (
        <div className="col-span-full">
          <PriceChart prices={tomorrowPrices} label="Prijzen morgen (€/kWh)" />
        </div>
      )}

      {/* Morgen nog niet beschikbaar */}
      {!loading && tomorrowPrices.length === 0 && todayPrices.length > 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-xs text-zinc-400">
            Prijzen van morgen worden gepubliceerd tussen 13:00 en 15:00 uur.
          </p>
        </div>
      )}
    </>
  )
}
