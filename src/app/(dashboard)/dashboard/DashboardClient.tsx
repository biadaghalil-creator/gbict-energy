'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, BatteryCharging,
  ArrowUpRight, Plug, Car, Sun, ArrowDown,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

/* ── Types ─────────────────────────────────────────────── */
export type DeviceSummary = {
  type: string
  name: string
  brand: string
  status: string
  capacityKwh?: string
  v2g?: boolean
  minChargePct?: string
}

type SavingsData = {
  today_eur: number; month_eur: number; total_eur: number
  discharge_count: number; charge_count: number; logs_today: number
}
type SessyStatus = {
  state_of_charge: number; power: number
  system_state: string; renewable_energy: number; grid_power: number
}
type PricePoint = { total: number; startsAt: string }
type ScheduleSlot = { hour: number; action: string; price: number; startsAt: string }
type TibberData = {
  current: PricePoint | null
  today: PricePoint[]
  optimization: { estimatedSavings: number; schedule: ScheduleSlot[] } | null
}

const fmt = (n: number) => `€${n.toFixed(2).replace('.', ',')}`
const fmtSmall = (n: number) => `€${n.toFixed(4)}`

/* ── Battery ring (SVG) ─────────────────────────────────── */
function Ring({ pct, size = 86, sw = 9, color = '#ffffff', track = 'rgba(255,255,255,0.28)', children }: {
  pct: number; size?: number; sw?: number; color?: string; track?: string; children?: React.ReactNode
}) {
  const r = (size - sw) / 2
  const C = 2 * Math.PI * r
  const off = C * (1 - Math.max(0, Math.min(100, pct)) / 100)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.68,.32,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/* ── Smooth price curve (SVG) ───────────────────────────── */
function PriceCurve({ prices }: { prices: PricePoint[] }) {
  if (prices.length < 2) return null
  const totals = prices.map(p => p.total)
  const min = Math.min(...totals), max = Math.max(...totals)
  const range = max - min || 0.01
  const norm = totals.map(v => (v - min) / range)
  const W = 320, H = 96, pad = 6, n = norm.length
  const xs = (i: number) => pad + (i / (n - 1)) * (W - pad * 2)
  const ys = (v: number) => pad + (1 - v) * (H - pad * 2)
  let d = `M ${xs(0)} ${ys(norm[0])}`
  for (let i = 1; i < n; i++) {
    const x0 = xs(i - 1), y0 = ys(norm[i - 1]), x1 = xs(i), y1 = ys(norm[i])
    const cx = (x0 + x1) / 2
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
  }
  const area = `${d} L ${xs(n - 1)} ${H} L ${xs(0)} ${H} Z`
  const nowHour = new Date().getHours()
  let nowI = prices.findIndex(p => new Date(p.startsAt).getHours() === nowHour)
  if (nowI < 0) nowI = 0
  const nowX = xs(nowI), nowY = ys(norm[nowI])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-emerald-500)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--color-emerald-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pcFill)" />
      <path d={d} fill="none" stroke="var(--color-emerald-500)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1={nowX} y1="2" x2={nowX} y2={H - 2} stroke="var(--text-faint)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx={nowX} cy={nowY} r="5.5" fill="var(--color-emerald-500)" stroke="var(--surface)" strokeWidth="2.5" />
    </svg>
  )
}

/* ── Stat card ──────────────────────────────────────────── */
function Stat({ k, v, d, dpos }: { k: string; v: string; d?: string; dpos?: boolean }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_2px_26px_-18px_rgba(20,24,15,0.30)]">
      <p className="text-[12px] text-[var(--text-muted)]">{k}</p>
      <p className="mt-2 font-mono text-[26px] font-bold tracking-[-0.02em] text-[var(--text)]">{v}</p>
      {d && <p className={`mt-1 text-[12px] ${dpos ? 'text-emerald-500' : 'text-[var(--text-faint)]'}`}>{d}</p>}
    </div>
  )
}

/* ── EV / V2G card ──────────────────────────────────────── */
function fmtHour(startsAt: string) {
  return `${String(new Date(startsAt).getHours()).padStart(2, '0')}:00`
}

function EvCard({ ev, prices, t }: { ev: DeviceSummary; prices: PricePoint[]; t: TranslationDict }) {
  const isV2g = ev.v2g === true || ev.type === 'ev_v2g'
  const capacity = Number(ev.capacityKwh)
  const hasPrices = prices.length >= 6
  const chargeHours = capacity > 0 ? Math.min(6, Math.max(3, Math.round(capacity / 11))) : 4
  const byPriceAsc = [...prices].sort((a, b) => a.total - b.total)
  const cheap = byPriceAsc.slice(0, chargeHours)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const peak = isV2g
    ? [...prices].sort((a, b) => b.total - a.total).slice(0, 3)
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    : []
  const avgAll = prices.length ? prices.reduce((s, p) => s + p.total, 0) / prices.length : 0
  const avgCheap = cheap.length ? cheap.reduce((s, p) => s + p.total, 0) / cheap.length : 0
  const cheaperPct = avgAll > 0 ? Math.round(((avgAll - avgCheap) / avgAll) * 100) : 0

  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)]">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Car className="h-4 w-4 text-emerald-500" />
        </div>
        {isV2g && (
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-500 ring-1 ring-emerald-500/20">V2G</span>
        )}
      </div>
      <p className="mt-4 text-[15px] font-semibold text-[var(--text)]">{ev.name}</p>
      {capacity > 0 && (
        <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">{t.dashboard.evCard.capacity} · {capacity} kWh</p>
      )}
      {hasPrices ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[11px] font-medium text-[var(--text-muted)]">{t.dashboard.evCard.chargePlan}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {cheap.map((p) => (
                <span key={p.startsAt} className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-500">
                  {fmtHour(p.startsAt)}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--text-faint)]">
              {t.dashboard.evCard.avgPrice} {fmtSmall(avgCheap)}{t.dashboard.overview.perKwh}
              {cheaperPct > 0 && <span className="ml-2 text-emerald-500">· {fill(t.dashboard.evCard.cheaper, { pct: cheaperPct })}</span>}
            </p>
          </div>
          {isV2g && peak.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-[var(--text-muted)]">{t.dashboard.evCard.sellPlan}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {peak.map((p) => (
                  <span key={p.startsAt} className="rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-600">
                    {fmtHour(p.startsAt)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-[12px] text-[var(--text-faint)]">{t.dashboard.evCard.noPrices}</p>
      )}
      <p className="mt-4 border-t border-[var(--border)] pt-3 text-[11px] leading-relaxed text-[var(--text-faint)]">
        {t.dashboard.evCard.pendingNote}
      </p>
    </div>
  )
}

/* ── Today's plan (schedule rows) ───────────────────────── */
function PlanCard({ schedule, estimatedSavings, t }: { schedule: ScheduleSlot[]; estimatedSavings: number; t: TranslationDict }) {
  const active = schedule.filter(s => s.action !== 'idle').slice(0, 6)
  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[16px] font-bold text-[var(--text)]">{t.dashboard.schedule.title}</p>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[12px] font-semibold text-emerald-600 ring-1 ring-emerald-500/20">~{fmt(estimatedSavings)}</span>
      </div>
      {active.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-[var(--text-faint)]">{t.dashboard.schedule.none}</p>
      ) : (
        <div>
          {active.map((slot, i) => {
            const isCharge = slot.action === 'charge'
            return (
              <div key={slot.hour} className={`flex items-center gap-3.5 py-3 ${i > 0 ? 'border-t border-[var(--border)]' : ''}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCharge ? 'bg-emerald-500/12 text-emerald-600' : 'bg-amber-500/12 text-amber-600'}`}>
                  {isCharge ? <ArrowDown className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-[var(--text)]">{isCharge ? t.dashboard.schedule.charge : t.dashboard.schedule.sell}</p>
                  <p className="mt-0.5 font-mono text-[12px] text-[var(--text-muted)]">{fmtSmall(slot.price)}{t.dashboard.overview.perKwh}</p>
                </div>
                <span className="shrink-0 font-mono text-[13px] font-semibold text-[var(--text-muted)] tabular-nums">{String(slot.hour).padStart(2, '0')}:00</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Recent activity table ──────────────────────────────── */
type LogRow = { action: string; created_at: string; kwh: number; price_eur: number; savings_eur: number }

function ActivityTable({ t, tag }: { t: TranslationDict; tag: string }) {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/savings/history?days=7')
      .then(r => r.json())
      .then(d => { setLogs(d?.recent?.slice(0, 6) ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <p className="text-[14px] font-semibold text-[var(--text)]">{t.dashboard.activityTable.title}</p>
        <Link href="/dashboard/besparingen" className="flex items-center gap-1 text-[12px] font-medium text-emerald-500 hover:text-emerald-400">
          {t.dashboard.common.viewAll} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {loading ? (
        <div className="divide-y divide-[var(--border)]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5">
              <Skeleton className="h-8 w-8 rounded-xl bg-[var(--surface-2)]" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-28 bg-[var(--surface-2)]" />
                <Skeleton className="h-3 w-20 bg-[var(--surface-2)]" />
              </div>
              <Skeleton className="h-4 w-12 bg-[var(--surface-2)]" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[13px] text-[var(--text-faint)]">{t.dashboard.activityTable.noneTitle}</p>
          <p className="mt-1 text-[12px] text-[var(--text-faint)]">{t.dashboard.activityTable.noneDesc}</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {logs.map((log: LogRow, i: number) => {
            const isCharge = log.action === 'charge'
            const dt = new Date(log.created_at)
            const timeStr = dt.toLocaleString(tag, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isCharge ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 ring-1 ring-amber-500/20'}`}>
                  {isCharge ? <TrendingDown className="h-3.5 w-3.5 text-emerald-500" /> : <TrendingUp className="h-3.5 w-3.5 text-amber-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[var(--text-muted)]">
                    {isCharge ? t.dashboard.activityTable.charged : t.dashboard.activityTable.discharged}
                    {log.kwh > 0 && <span className="ml-2 font-normal text-[var(--text-faint)]">{log.kwh.toFixed(1)} kWh</span>}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[var(--text-faint)]">
                    {timeStr}
                    {log.price_eur > 0 && <span className="ml-2">@ {fmtSmall(log.price_eur)}/kWh</span>}
                  </p>
                </div>
                <span className={`text-[13px] font-semibold ${(log.savings_eur ?? 0) > 0 ? 'text-emerald-500' : 'text-[var(--text-faint)]'}`}>
                  {(log.savings_eur ?? 0) > 0 ? `+${fmt(log.savings_eur)}` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Main dashboard client component ───────────────────── */
export default function DashboardClient({
  hasTibber, hasSessy, devices = [],
}: {
  hasTibber: boolean
  hasSessy: boolean
  hasSolar?: boolean
  devices?: DeviceSummary[]
}) {
  const { t, tag } = useT()
  const ev = devices.find(d => d.type === 'ev_generic' || d.type === 'ev_v2g')
  const [savings, setSavings] = useState<SavingsData | null>(null)
  const [sessy, setSessy] = useState<SessyStatus | null>(null)
  const [tibber, setTibber] = useState<TibberData | null>(null)

  useEffect(() => {
    if (hasSessy) {
      fetch('/api/savings').then(r => r.json()).then(setSavings).catch(() => {})
      fetch('/api/sessy/status').then(r => r.json()).then(setSessy).catch(() => {})
    }
    fetch('/api/tibber/prices').then(r => r.json()).then(setTibber).catch(() => {})
  }, [hasTibber, hasSessy])

  const schedule = tibber?.optimization?.schedule ?? []
  const todayPrices = tibber?.today ?? []
  const estimatedSavings = tibber?.optimization?.estimatedSavings ?? 0
  const todaySaved = savings?.today_eur ?? 0
  const monthSaved = savings?.month_eur ?? 0
  const totalSaved = savings?.total_eur ?? 0
  const soc = sessy?.state_of_charge ?? 0
  const currentPrice = tibber?.current?.total
  const dayAvg = todayPrices.length ? todayPrices.reduce((s, p) => s + p.total, 0) / todayPrices.length : 0
  const belowAvg = currentPrice != null && dayAvg > 0 ? currentPrice <= dayAvg : true

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[var(--text)]">{t.dashboard.overview.title}</h1>
          <p className="mt-0.5 text-[13px] text-[var(--text-faint)]">{t.dashboard.overview.subtitle}</p>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/12 px-3 py-1.5 text-[12px] font-semibold text-emerald-600 ring-1 ring-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {hasSessy ? t.dashboard.battery.charging : t.dashboard.nav.dashboard}
        </span>
      </div>

      {/* Hero — green accent: saved today + battery ring */}
      <div
        className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_14px_34px_-18px_rgba(47,93,58,0.7)]"
        style={{ background: 'linear-gradient(155deg, var(--color-emerald-600) 0%, var(--color-emerald-700) 100%)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-white/85">{t.dashboard.overview.savedToday}</p>
            <p className="mt-1 font-mono text-[42px] font-bold leading-none tracking-[-0.03em]">{fmt(todaySaved)}</p>
            <p className="mt-2 text-[13px] text-white/85">{fmt(monthSaved)} · {fmt(totalSaved)}</p>
          </div>
          <Ring pct={soc} size={88} sw={9}>
            <BatteryCharging className="h-5 w-5 text-white" />
            <span className="mt-0.5 font-mono text-[15px] font-bold text-white">{soc}%</span>
          </Ring>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/dashboard/besparingen" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-[var(--color-emerald-700)] transition hover:brightness-[0.97]">
            <TrendingUp className="h-4 w-4" /> {t.dashboard.overview.viewSavings}
          </Link>
          {!hasSessy && (
            <Link href="/dashboard/koppelingen" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] font-medium text-white transition hover:bg-white/10">
              <Plug className="h-4 w-4" /> {t.dashboard.overview.connectDevice}
            </Link>
          )}
        </div>
      </div>

      {/* Two stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <Stat k={t.dashboard.overview.thisMonth} v={fmt(monthSaved)} d={monthSaved > 0 ? fmt(totalSaved) : undefined} dpos />
        <Stat
          k={t.dashboard.overview.spotPriceNow}
          v={currentPrice != null ? fmtSmall(currentPrice) : '—'}
          d={currentPrice != null ? (belowAvg ? t.dashboard.priceChart.cheap : t.dashboard.priceChart.peak) : undefined}
          dpos={belowAvg}
        />
      </div>

      {/* Price card with smooth curve */}
      {todayPrices.length > 0 ? (
        <div className="rounded-[26px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[var(--text-muted)]">{t.dashboard.priceChart.title}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-[24px] font-bold text-[var(--text)]">{currentPrice != null ? fmtSmall(currentPrice) : '—'}</span>
                <span className="text-[12px] text-[var(--text-faint)]">{t.dashboard.overview.perKwh}</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${belowAvg ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
              {belowAvg ? <ArrowDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
              {belowAvg ? t.dashboard.priceChart.cheap : t.dashboard.priceChart.peak}
            </span>
          </div>
          <PriceCurve prices={todayPrices} />
        </div>
      ) : (
        <div className="rounded-[26px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <Plug className="mx-auto h-8 w-8 text-[var(--text-faint)]" />
          <p className="mt-4 text-[14px] font-medium text-[var(--text-faint)]">{t.dashboard.priceChart.loading}</p>
        </div>
      )}

      {/* EV card */}
      {ev && <EvCard ev={ev} prices={todayPrices} t={t} />}

      {/* Today's plan */}
      {todayPrices.length > 0 && <PlanCard schedule={schedule} estimatedSavings={estimatedSavings} t={t} />}

      {/* Recent activity */}
      {hasSessy && <ActivityTable t={t} tag={tag} />}

      {/* Solar loading hint (keeps Sun import used) */}
      {savings == null && hasSessy && (
        <p className="flex items-center justify-center gap-1.5 text-[12px] text-[var(--text-faint)]">
          <Sun className="h-3.5 w-3.5" /> {t.dashboard.priceChart.loading}
        </p>
      )}
    </div>
  )
}
