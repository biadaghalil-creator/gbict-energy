'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

type DayData   = { date: string; savings: number; charge: number; discharge: number }
type RecentLog = { action: string; price_eur: number; kwh: number; savings_eur: number; created_at: string }
type HistoryData = {
  days: DayData[]
  totals: { today: number; month: number; total: number; actions: number }
  recent: RecentLog[]
}

const RANGES: { key: 'range7d' | 'range30d' | 'range90d'; days: number }[] = [
  { key: 'range7d', days: 7 }, { key: 'range30d', days: 30 }, { key: 'range90d', days: 90 },
]
const fmt   = (n: number) => `€${n.toFixed(2).replace('.', ',')}`
const fmtDt = (iso: string, tag: string) => new Date(iso).toLocaleString(tag, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const fmtD  = (iso: string, tag: string) => new Date(iso).toLocaleDateString(tag, { day: 'numeric', month: 'short' })

function SavingsChart({ days, loading, activeDays, t, tag }: { days: DayData[]; loading: boolean; activeDays: number; t: TranslationDict; tag: string }) {
  if (loading) return (
    <div className="flex h-[120px] items-end gap-[3px]">
      {Array.from({ length: activeDays }).map((_, i) => (
        <div key={i} className="flex-1 animate-pulse rounded-t-[3px] bg-[var(--surface-2)]" style={{ height: `${20 + (i % 7) * 10}%` }} />
      ))}
    </div>
  )
  if (!days.length) return (
    <div className="flex h-[120px] items-center justify-center rounded-xl bg-[var(--surface-2)]">
      <p className="text-[13px] text-[var(--text-faint)]">{t.dashboard.savings.noData}</p>
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
              <div className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[10.5px] text-[var(--text-muted)] shadow-xl group-hover:block">
                {fmtD(day.date, tag)}: {fmt(day.savings)}
              </div>
              <div
                className={`w-full rounded-t-[3px] transition-all ${
                  day.savings > 0 ? isToday ? 'bg-emerald-500' : 'bg-emerald-500/60 group-hover:bg-emerald-500/80' : 'bg-[var(--surface-2)]'
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
            {i % labelEvery === 0 && <span className="text-[9px] tabular-nums text-[var(--text-faint)]">{fmtD(day.date, tag).split(' ')[0]}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function TopSavingsList({ recent, loading, t, tag }: { recent: RecentLog[]; loading: boolean; t: TranslationDict; tag: string }) {
  const top = recent.filter(r => (r.savings_eur ?? 0) > 0).slice(0, 5)
  const maxSaving = Math.max(...top.map(r => r.savings_eur), 0.01)

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-[var(--text)]">{t.dashboard.savings.topTitle}</p>
          <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">{t.dashboard.savings.topSubtitle}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-[var(--text-faint)]" />
      </div>
      {loading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-full bg-[var(--surface-2)]" />)}</div>
      ) : top.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-[var(--text-faint)]">{t.dashboard.savings.topNone}</p>
      ) : (
        <div className="space-y-4">
          {top.map((log, i) => {
            const isCharge = log.action === 'charge'
            return (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[12.5px] text-[var(--text-muted)]">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${isCharge ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {isCharge ? t.dashboard.savings.charge : t.dashboard.savings.sell}
                    </span>
                    {fmtDt(log.created_at, tag)}
                  </span>
                  <span className="font-mono text-[12.5px] font-semibold text-emerald-400">+{fmt(log.savings_eur)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
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
  const { t, tag } = useT()
  const [activeDays, setActiveDays] = useState(30)
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true); setData(null)
    fetch(`/api/savings/history?days=${activeDays}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [activeDays])

  const stats = [
    { label: t.dashboard.savings.statToday,   value: data?.totals.today   ?? 0, money: true,  color: 'text-emerald-400' },
    { label: t.dashboard.savings.statMonth,   value: data?.totals.month   ?? 0, money: true,  color: 'text-emerald-400' },
    { label: t.dashboard.savings.statTotal,   value: data?.totals.total   ?? 0, money: true,  color: 'text-emerald-400'  },
    { label: t.dashboard.savings.statActions, value: data?.totals.actions ?? 0, money: false, color: 'text-[var(--text-muted)]'   },
  ]

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-[var(--text)]">{t.dashboard.savings.title}</h1>
          <p className="mt-1 text-[13px] text-[var(--text-faint)]">{t.dashboard.savings.subtitle}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">{s.label}</p>
            {loading
              ? <Skeleton className="mt-3 h-8 w-20 bg-[var(--surface-2)]" />
              : <>
                  <p className={`mt-3 font-mono text-[26px] font-bold tracking-[-0.03em] ${s.value > 0 ? s.color : 'text-[var(--text-faint)]'}`}>
                    {s.money ? fmt(s.value) : s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--text-faint)]">{s.money ? t.dashboard.common.free : t.dashboard.common.automated}</p>
                </>
            }
          </div>
        ))}
      </div>

      {/* Chart + top list */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[var(--text)]">{t.dashboard.savings.breakdownTitle}</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">{t.dashboard.savings.breakdownSubtitle}</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-[var(--surface-2)] p-1">
              {RANGES.map(r => (
                <button key={r.days} onClick={() => setActiveDays(r.days)}
                  className={cn('rounded-md px-3 py-1 text-[11px] font-semibold transition-colors',
                    activeDays === r.days ? 'bg-emerald-500/15 text-emerald-400' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]')}>
                  {t.dashboard.savings[r.key]}
                </button>
              ))}
            </div>
          </div>
          <SavingsChart days={data?.days ?? []} loading={loading} activeDays={activeDays} t={t} tag={tag} />
          <div className="mt-4 flex gap-5 text-[11px] text-[var(--text-faint)]">
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500/60" />{t.dashboard.savings.legendSavings}</span>
            <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />{t.dashboard.savings.legendToday}</span>
          </div>
        </div>
        <TopSavingsList recent={data?.recent ?? []} loading={loading} t={t} tag={tag} />
      </div>

      {/* Transaction table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <p className="text-[14px] font-semibold text-[var(--text)]">{t.dashboard.savings.historyTitle}</p>
          <span className="text-[11px] text-[var(--text-faint)]">{fill(t.dashboard.savings.historyLastDays, { days: activeDays })}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-[var(--border)] px-6 py-2.5">
          {[
            { label: t.dashboard.savings.colAction, right: false },
            { label: t.dashboard.savings.colTime, right: false },
            { label: t.dashboard.savings.colKwh, right: true },
            { label: t.dashboard.savings.colSaved, right: true },
          ].map(h => (
            <span key={h.label} className={cn('text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]', h.right ? 'text-right' : '')}>{h.label}</span>
          ))}
        </div>
        {loading ? (
          <div className="divide-y divide-white/[0.04]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-6 py-3.5">
                <Skeleton className="h-8 w-8 rounded-xl bg-[var(--surface-2)]" />
                <Skeleton className="h-3.5 w-32 bg-[var(--surface-2)]" />
                <Skeleton className="h-3.5 w-10 bg-[var(--surface-2)]" />
                <Skeleton className="h-3.5 w-14 bg-[var(--surface-2)]" />
              </div>
            ))}
          </div>
        ) : !data?.recent.length ? (
          <div className="flex flex-col items-center justify-center py-14">
            <TrendingDown className="h-8 w-8 text-[var(--text-faint)]" />
            <p className="mt-3 text-[13px] text-[var(--text-faint)]">{t.dashboard.savings.noTransactions}</p>
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
                    <p className="text-[13px] font-medium text-[var(--text-muted)]">{isCharge ? t.dashboard.savings.charged : t.dashboard.savings.discharged}</p>
                    <p className="mt-0.5 text-[11.5px] text-[var(--text-faint)]">{fmtDt(log.created_at, tag)}{log.price_eur > 0 && <span className="ml-2">@ €{log.price_eur.toFixed(4)}/kWh</span>}</p>
                  </div>
                  <span className="font-mono text-[12.5px] text-[var(--text-faint)] text-right">{log.kwh > 0 ? log.kwh.toFixed(1) : '—'}</span>
                  <span className={`font-mono text-[13px] font-semibold text-right ${(log.savings_eur ?? 0) > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
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
