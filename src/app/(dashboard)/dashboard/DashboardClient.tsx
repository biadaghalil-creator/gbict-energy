'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, BatteryCharging,
  ArrowUpRight, Plug, Car, ArrowDown,
} from 'lucide-react'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'
import '../gbapp.css'

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
type LogRow = { action: string; created_at: string; kwh: number; price_eur: number; savings_eur: number }

const fmt = (n: number) => `€${n.toFixed(2).replace('.', ',')}`
const fmtSmall = (n: number) => `€${n.toFixed(4)}`
const hh = (startsAt: string) => `${String(new Date(startsAt).getHours()).padStart(2, '0')}:00`

/* ── Battery ring (SVG) ─────────────────────────────────── */
function Ring({ pct, size = 86, sw = 9, color = '#ffffff', track = 'rgba(255,255,255,0.28)', children }: {
  pct: number; size?: number; sw?: number; color?: string; track?: string; children?: React.ReactNode
}) {
  const r = (size - sw) / 2
  const C = 2 * Math.PI * r
  const off = C * (1 - Math.max(0, Math.min(100, pct)) / 100)
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,.68,.32,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
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
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block', marginTop: 14 }}>
      <defs>
        <linearGradient id="gbPc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gbPc)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1={nowX} y1="2" x2={nowX} y2={H - 2} stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx={nowX} cy={nowY} r="5.5" fill="var(--accent)" stroke="var(--card)" strokeWidth="2.5" />
    </svg>
  )
}

/* ── EV / V2G card ──────────────────────────────────────── */
function EvCard({ ev, prices, t }: { ev: DeviceSummary; prices: PricePoint[]; t: TranslationDict }) {
  const isV2g = ev.v2g === true || ev.type === 'ev_v2g'
  const capacity = Number(ev.capacityKwh)
  const hasPrices = prices.length >= 6
  const chargeHours = capacity > 0 ? Math.min(6, Math.max(3, Math.round(capacity / 11))) : 4
  const cheap = [...prices].sort((a, b) => a.total - b.total).slice(0, chargeHours)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const avgAll = prices.length ? prices.reduce((s, p) => s + p.total, 0) / prices.length : 0
  const avgCheap = cheap.length ? cheap.reduce((s, p) => s + p.total, 0) / cheap.length : 0
  const cheaperPct = avgAll > 0 ? Math.round(((avgAll - avgCheap) / avgAll) * 100) : 0

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row-ic"><Car size={20} /></div>
        {isV2g && <span className="pill">V2G</span>}
      </div>
      <div style={{ marginTop: 14, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{ev.name}</div>
      {capacity > 0 && <div style={{ marginTop: 2, fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.evCard.capacity} · {capacity} kWh</div>}
      {hasPrices ? (
        <>
          <div style={{ marginTop: 14, fontSize: 12.5, fontWeight: 600, color: 'var(--ink-2)' }}>{t.dashboard.evCard.chargePlan}</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cheap.map(p => <span key={p.startsAt} className="pill num">{hh(p.startsAt)}</span>)}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-3)' }}>
            {t.dashboard.evCard.avgPrice} {fmtSmall(avgCheap)}{t.dashboard.overview.perKwh}
            {cheaperPct > 0 && <span style={{ color: 'var(--accent)' }}> · {fill(t.dashboard.evCard.cheaper, { pct: cheaperPct })}</span>}
          </div>
        </>
      ) : (
        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.evCard.noPrices}</div>
      )}
      <div style={{ marginTop: 14, borderTop: '.5px solid var(--line)', paddingTop: 12, fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>{t.dashboard.evCard.pendingNote}</div>
    </div>
  )
}

/* ── Activity rows ──────────────────────────────────────── */
function ActivityCard({ t, tag }: { t: TranslationDict; tag: string }) {
  const [logs, setLogs] = useState<LogRow[]>([])
  useEffect(() => {
    fetch('/api/savings/history?days=7').then(r => r.json()).then(d => setLogs(d?.recent?.slice(0, 5) ?? [])).catch(() => {})
  }, [])
  if (!logs.length) return null
  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{t.dashboard.activityTable.title}</b>
        <Link href="/dashboard/besparingen" className="num" style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>{t.dashboard.common.viewAll}</Link>
      </div>
      {logs.map((log, i) => {
        const isCharge = log.action === 'charge'
        const dt = new Date(log.created_at)
        return (
          <div className="row" key={i}>
            <div className={'row-ic' + (isCharge ? '' : ' sell')}>{isCharge ? <TrendingDown size={18} /> : <TrendingUp size={18} />}</div>
            <div className="row-tx">
              <b>{isCharge ? t.dashboard.activityTable.charged : t.dashboard.activityTable.discharged}</b>
              <span>{dt.toLocaleString(tag, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="row-val num" style={{ color: (log.savings_eur ?? 0) > 0 ? 'var(--accent)' : 'var(--ink-3)' }}>
              {(log.savings_eur ?? 0) > 0 ? `+${fmt(log.savings_eur)}` : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Main ───────────────────────────────────────────────── */
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

  const schedule = (tibber?.optimization?.schedule ?? []).filter(s => s.action !== 'idle').slice(0, 6)
  const todayPrices = tibber?.today ?? []
  const estimatedSavings = tibber?.optimization?.estimatedSavings ?? 0
  const todaySaved = savings?.today_eur ?? 0
  const monthSaved = savings?.month_eur ?? 0
  const totalSaved = savings?.total_eur ?? 0
  const soc = sessy?.state_of_charge ?? 0
  const currentPrice = tibber?.current?.total
  const dayAvg = todayPrices.length ? todayPrices.reduce((s, p) => s + p.total, 0) / todayPrices.length : 0
  const belowAvg = currentPrice != null && dayAvg > 0 ? currentPrice <= dayAvg : true
  const priceLabel = belowAvg ? t.dashboard.priceChart.cheap : t.dashboard.priceChart.peak

  return (
    <div className="gbapp stack" style={{ paddingBottom: 8 }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, color: 'var(--ink-2)', fontWeight: 500 }}>{t.dashboard.overview.subtitle}</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>{t.dashboard.overview.title}</div>
        </div>
        <span className="pill live">{hasSessy ? t.dashboard.battery.charging : t.dashboard.nav.dashboard}</span>
      </div>

      {/* hero accent */}
      <div className="card-accent" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>{t.dashboard.overview.savedToday}</div>
            <div className="num" style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', margin: '4px 0' }}>{fmt(todaySaved)}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{fmt(monthSaved)} · {fmt(totalSaved)}</div>
          </div>
          <Ring pct={soc} size={86} sw={9}>
            <BatteryCharging size={20} color="#fff" />
            <div className="num" style={{ fontSize: 16, fontWeight: 700, marginTop: 3, color: '#fff' }}>{soc}%</div>
          </Ring>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Link href="/dashboard/besparingen" className="btn btn-onaccent"><TrendingUp size={18} /> {t.dashboard.overview.viewSavings}</Link>
        </div>
      </div>

      {/* stats */}
      <div className="grid2">
        <div className="card card-pad">
          <div className="stat-k">{t.dashboard.overview.thisMonth}</div>
          <div className="stat-v num sm">{fmt(monthSaved)}</div>
          {monthSaved > 0 && <div className="stat-d pos">{fmt(totalSaved)}</div>}
        </div>
        <div className="card card-pad">
          <div className="stat-k">{t.dashboard.overview.spotPriceNow}</div>
          <div className="stat-v num sm">{currentPrice != null ? fmtSmall(currentPrice) : '—'}</div>
          {currentPrice != null && <div className={'stat-d ' + (belowAvg ? 'pos' : 'neg')}>{priceLabel}</div>}
        </div>
      </div>

      {/* price card */}
      {todayPrices.length > 0 ? (
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{t.dashboard.priceChart.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
                <span className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{currentPrice != null ? fmtSmall(currentPrice) : '—'}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.overview.perKwh}</span>
              </div>
            </div>
            <span className="pill"><ArrowDown size={14} /> {priceLabel}</span>
          </div>
          <PriceCurve prices={todayPrices} />
        </div>
      ) : (
        <div className="card card-pad" style={{ textAlign: 'center', padding: 36 }}>
          <Plug size={30} color="var(--ink-3)" style={{ display: 'inline-block' }} />
          <div style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-3)' }}>{t.dashboard.priceChart.loading}</div>
        </div>
      )}

      {/* EV */}
      {ev && <EvCard ev={ev} prices={todayPrices} t={t} />}

      {/* today's plan */}
      {todayPrices.length > 0 && (
        <div className="card card-pad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <b style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{t.dashboard.schedule.title}</b>
            <span className="pill num">~{fmt(estimatedSavings)}</span>
          </div>
          {schedule.length === 0 ? (
            <div style={{ padding: '18px 0', textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.schedule.none}</div>
          ) : schedule.map((s) => {
            const isCharge = s.action === 'charge'
            return (
              <div className="row" key={s.hour}>
                <div className={'row-ic' + (isCharge ? '' : ' sell')}>{isCharge ? <ArrowDown size={19} /> : <ArrowUpRight size={19} />}</div>
                <div className="row-tx">
                  <b>{isCharge ? t.dashboard.schedule.charge : t.dashboard.schedule.sell}</b>
                  <span className="num">{fmtSmall(s.price)}{t.dashboard.overview.perKwh}</span>
                </div>
                <div className="row-val num">{String(s.hour).padStart(2, '0')}:00</div>
              </div>
            )
          })}
        </div>
      )}

      {/* recent activity */}
      {hasSessy && <ActivityCard t={t} tag={tag} />}
    </div>
  )
}
