'use client'

import { useEffect, useState } from 'react'
import { Zap, CalendarDays } from 'lucide-react'
import { type TibberPriceData, priceLevel } from '@/lib/tibber'
import { type OptimizationResult } from '@/lib/optimize'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import PriceChart from './PriceChart'

type DashboardData = TibberPriceData & {
  optimization: OptimizationResult
  tomorrowOptimization: OptimizationResult | null
}

const levelConfig = {
  low:    { label: 'Goedkoop',  barColor: 'bg-emerald-400', textColor: 'text-emerald-400' },
  normal: { label: 'Normaal', barColor: 'bg-amber-400',   textColor: 'text-amber-400'   },
  high:   { label: 'Piek',   barColor: 'bg-red-400',     textColor: 'text-red-400'     },
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
  const tomorrowOptimization = data?.tomorrowOptimization ?? null
  const level = current ? priceLevel(current.total, todayPrices) : null
  const cfg = level ? levelConfig[level] : null

  return (
    <>
      {/* Current price card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
          Spotprijs nu
        </p>
        {loading ? (
          <Skeleton className="mt-3 h-10 w-28 bg-white/[0.04]" />
        ) : current ? (
          <>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-[32px] font-semibold leading-none tracking-[-0.03em] text-slate-50">
                €{current.total.toFixed(4)}
              </span>
              <span className="text-[12px] text-slate-500">/kWh</span>
            </div>
            {cfg && (
              <span className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                <span className={`h-[14px] w-[3px] rounded-sm ${cfg.barColor}`} />
                <span className={cfg.textColor}>{cfg.label}</span>
              </span>
            )}
          </>
        ) : (
          <p className="mt-3 font-mono text-[32px] font-semibold text-slate-700">€ —</p>
        )}
      </div>

      {/* Estimated savings card */}
      {!loading && optimization && (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            Estimated savings today
          </p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-[32px] font-semibold leading-none tracking-[-0.03em] text-emerald-400">
              €{optimization.estimatedSavings.toFixed(2)}
            </span>
          </div>
          <p className="mt-2 text-[11.5px] text-slate-600">Based on 5 kWh battery</p>
        </div>
      )}

      {/* Price chart today */}
      {!loading && todayPrices.length > 0 && (
        <div className="col-span-full">
          <PriceChart prices={todayPrices} schedule={optimization?.schedule} />
        </div>
      )}

      {/* Optimization schedule today */}
      {!loading && optimization && optimization.schedule.filter(s => s.action !== 'idle').length > 0 && (
        <div className="col-span-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
            Optimization schedule · today
          </p>
          <div className="space-y-2.5">
            {optimization.schedule
              .filter((s) => s.action !== 'idle')
              .map((slot) => (
                <div key={slot.hour} className="flex items-center gap-4">
                  <span className="w-12 font-mono text-[13px] font-medium tabular-nums text-slate-400">
                    {String(slot.hour).padStart(2, '0')}:00
                  </span>
                  <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium ${
                    slot.action === 'charge'
                      ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'
                      : 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
                  }`}>
                    {slot.action === 'charge' ? '↑ Charge' : '↓ Sell'}
                  </span>
                  <span className="font-mono text-[12px] text-slate-600">
                    €{slot.price.toFixed(4)}/kWh
                  </span>
                </div>
              ))}
          </div>
          <p className="mt-5 text-[11.5px] text-slate-700">
            Schedule updates daily based on EPEX spot prices.
          </p>
        </div>
      )}

      {/* Tomorrow prices */}
      {!loading && tomorrowPrices.length > 0 && (
        <>
          <div className="col-span-full">
            <PriceChart
              prices={tomorrowPrices}
              schedule={tomorrowOptimization?.schedule}
              label="Energy prices tomorrow (€/kWh)"
            />
          </div>

          {tomorrowOptimization && tomorrowOptimization.schedule.filter(s => s.action !== 'idle').length > 0 && (
            <div className="col-span-full overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                  Planned schedule · tomorrow
                </p>
                <span className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-500">
                  ~€{tomorrowOptimization.estimatedSavings.toFixed(2)} expected
                </span>
              </div>
              <div className="space-y-2.5">
                {tomorrowOptimization.schedule
                  .filter((s) => s.action !== 'idle')
                  .map((slot) => (
                    <div key={slot.hour} className="flex items-center gap-4">
                      <span className="w-12 font-mono text-[13px] font-medium tabular-nums text-slate-400">
                        {String(slot.hour).padStart(2, '0')}:00
                      </span>
                      <span className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium ${
                        slot.action === 'charge'
                          ? 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20'
                          : 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20'
                      }`}>
                        {slot.action === 'charge' ? '↑ Charge' : '↓ Sell'}
                      </span>
                      <span className="font-mono text-[12px] text-slate-600">
                        €{slot.price.toFixed(4)}/kWh
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tomorrow not available yet */}
      {!loading && tomorrowPrices.length === 0 && todayPrices.length > 0 && (
        <div className="col-span-full rounded-2xl border border-dashed border-white/[0.06] bg-[#0D0E16]/50 p-5 text-center">
          <p className="text-[12.5px] text-slate-700">
            Tomorrow's prices are published between 13:00 and 15:00.
          </p>
        </div>
      )}
    </>
  )
}
