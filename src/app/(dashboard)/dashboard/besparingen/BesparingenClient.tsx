'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type DayData   = { date: string; savings: number; charge: number; discharge: number }
type RecentLog = { action: string; price_eur: number; kwh: number; savings_eur: number; created_at: string }
type HistoryData = {
  days: DayData[]
  totals: { today: number; month: number; total: number; actions: number }
  recent: RecentLog[]
}

const RANGES = [{ label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: '90d', days: 90 }]
const fmt   = (n: number) => `€${n.toFixed(2).replace('.', ',')}`
const fmtDt = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const fmtD  = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function SavingsChart({ days, loading, activeDays }: { days: DayData[]; loading: boolean; activeDays: number }) {
  if (loading) return (
    <div className="flex h-[120px] items-end gap-[3px]">
      {Array.from({ length: activeDays }).map((_, i) => (
        <div key={i} className="flex-1 animate-pulse rounded-t-[3px] bg-white/[0.04]" style={{ height: `${20 + (i % 7) * 10}%` }} />
      ))}
    </div>
  )
  if (!days.length) return (
    <div className="flex h-[120px] items-center justify-center rounded-xl bg-white/[0.02]">
      <p className="text-[13px] text-slate-700">Nog geen besparingsdata</p>
    </div>
  )

  const max = Math.max(...days.map(d => d.savings), 0.01)
  const labelEvery = days.length <= 7 ? 1 : days.length <= 30 ? 5 : 10

  return (
    <div>
      <div className="flex h-[120px] items-end gap-[3px]">
        {days.map((day) => {
          const pct = (day.savings / max) * 100
          const isToday = day.date === new Date().toISOString().split('T')[0]
          return (
            <div key={day.date} className="group relative flex flex-1 flex-col items-center">
              <div className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#07080D] px-2 py-1.5 text-[10.5px] text-slate-300 shadow-xl group-hover:block">
                {fmtD(day.date)}: {fmt(day.savings)}
              </div>
              <div
                className={`w-full rounded-t-[3px] transition-all ${
                  day.savings > 0 ? isToday ? 'bg-emerald-500' : 'bg-emerald-500/60 group-hover:bg-emerald-500/80' : 'bg-white/[0.03]'
                }`}
                style={{ height: `${Math.max(pct, day.savings > 0 ? 4 : 2)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-[3px]">
        {days.map((day, i) => (
          <div key={day.date} className="flex flex-1 justify-center">
            {i % labelEvery === 0 && <span className="text-[9px] tabular-nums text-slate-700">{fmtD(day.date).split(' ')[0]}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function TopSavingsList({ recent, loading }: { recent: RecentLog[]; loading: boolean }) {
  const top = recent.filter(r => (r.savings_eur ?? 0) > 0).slice(0, 5)
  const maxSaving = Math.max(...top.map(r => r.savings_eur), 0.01)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-slate-200">Grootste besparingen</p>
          <p className="mt-0.5 text-[11px] text-slate-600">Best presterende acties</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-700" />
      </div>
      {loading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-full bg-white/[0.04]" />)}</div>
      ) : top.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-slate-700">Nog geen besparingen vastgelegd</p>
      ) : (
        <div className="space-y-4">
          {top.map((log, i) => {
            const isCharge = log.action === 'charge'
            return (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12.5px] text-slate-300">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isCharge ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {isCharge ? '↑ Laden' : '↓ Verkopen'}
                    </span>
                    {fmtDt(log.created_at)}
                  </span>
                  <span className="font-mono text-[12.5px] font-semibold text-emerald-400">+{fmt(log.savings_eur)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                  <div className={`h-full rounded-full ${isCharge ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${(log.savings_eur / maxSaving) * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BesparingenClient() {
  const [activeDays, setActiveDays] = useState(30)
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true); setData(null)
    fetch(`/api/savings/history?days=${activeDays}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [activeDays])

  const stats = [
    { label: 'Vandaag',      value: data?.totals.today   ?? 0, money: true,  color: 'text-emerald-400' },
    { label: 'Deze maand', value: data?.totals.month   ?? 0, money: true,  color: 'text-emerald-400' },
    { label: 'Totaal',   value: data?.totals.total   ?? 0, money: true,  color: 'text-emerald-400'  },
    { label: 'Acties',    value: data?.totals.actions ?? 0, money: false, color: 'text-slate-300'   },
  ]

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-slate-50">Besparingsoverzicht</h1>
          <p className="mt-1 text-[13px] text-slate-600">Je automatische energiebesparing</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">{s.label}</p>
            {loading
              ? <Skeleton className="mt-3 h-8 w-20 bg-white/[0.04]" />
              : <>
                  <p className={`mt-3 font-mono text-[26px] font-bold tracking-[-0.03em] ${s.value > 0 ? s.color : 'text-slate-700'}`}>
                    {s.money ? fmt(s.value) : s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-700">{s.money ? 'saved' : 'automated'}</p>
                </>
            }
          </div>
        ))}
      </div>

      {/* Chart + top list */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-slate-200">Besparing uitgesplitst</p>
              <p className="mt-0.5 text-[11px] text-slate-600">Daily savings (€)</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1">
              {RANGES.map(r => (
                <button key={r.days} onClick={() => setActiveDays(r.days)}
                  className={cn('rounded-md px-3 py-1 text-[11px] font-semibold transition-colors',
                    activeDays === r.days ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-600 hover:text-slate-300')}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <SavingsChart days={data?.days ?? []} loading={loading} activeDays={activeDays} />
          <div className="mt-4 flex gap-5 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500/60" />Besparing</span>
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />Vandaag</span>
          </div>
        </div>
        <TopSavingsList recent={data?.recent ?? []} loading={loading} />
      </div>

      {/* Transaction table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0D0E16]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <p className="text-[14px] font-semibold text-slate-200">Transactiehistorie</p>
          <span className="text-[11px] text-slate-600">Last {activeDays} days</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-white/[0.04] px-6 py-2.5">
          {['Action','Time','kWh','Saved'].map(h => (
            <span key={h} className={cn('text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700', h === 'kWh' || h === 'Saved' ? 'text-right' : '')}>{h}</span>
          ))}
        </div>
        {loading ? (
          <div className="divide-y divide-white/[0.04]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-6 py-3.5">
                <Skeleton className="h-8 w-8 rounded-xl bg-white/[0.04]" />
                <Skeleton className="h-3.5 w-32 bg-white/[0.04]" />
                <Skeleton className="h-3.5 w-10 bg-white/[0.04]" />
                <Skeleton className="h-3.5 w-14 bg-white/[0.04]" />
              </div>
            ))}
          </div>
        ) : !data?.recent.length ? (
          <div className="flex flex-col items-center justify-center py-14">
            <TrendingDown className="h-8 w-8 text-slate-800" />
            <p className="mt-3 text-[13px] text-slate-700">Nog geen transacties</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {data.recent.map((log, i) => {
              const isCharge = log.action === 'charge'
              return (
                <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-6 py-3.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isCharge ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 ring-1 ring-amber-500/20'
                  }`}>
                    {isCharge ? <TrendingDown className="h-3.5 w-3.5 text-emerald-400" /> : <TrendingUp className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-300">{isCharge ? 'Batterij geladen' : 'Batterij ontladen'}</p>
                    <p className="mt-0.5 text-[11.5px] text-slate-600">{fmtDt(log.created_at)}{log.price_eur > 0 && <span className="ml-2">@ €{log.price_eur.toFixed(4)}/kWh</span>}</p>
                  </div>
                  <span className="font-mono text-[12.5px] text-slate-500 text-right">{log.kwh > 0 ? log.kwh.toFixed(1) : '—'}</span>
                  <span className={`font-mono text-[13px] font-semibold text-right ${(log.savings_eur ?? 0) > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>
                    {(log.savings_eur ?? 0) > 0 ? `+${fmt(log.savings_eur)}` : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
