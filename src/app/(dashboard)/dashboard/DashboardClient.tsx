'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, BatteryCharging, ArrowUpRight, Plug, Car, ArrowDown,
  Wallet, Sun, Zap, Sparkles, ChevronRight, Home,
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
type SolarProduction = { currentWatts: number; todayKwh: number; source: string }
type PricePoint = { total: number; startsAt: string }
type ScheduleSlot = { hour: number; action: string; price: number; startsAt: string }
type TibberData = {
  current: PricePoint | null
  today: PricePoint[]
  optimization: { estimatedSavings: number; schedule: ScheduleSlot[] } | null
}

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
      <div className="ring-rc" style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  )
}

/* ── Smooth price curve (SVG) ───────────────────────────── */
function PriceCurve({ prices, height = 170 }: { prices: PricePoint[]; height?: number }) {
  if (prices.length < 2) return null
  const totals = prices.map(p => p.total)
  const min = Math.min(...totals), max = Math.max(...totals)
  const range = max - min || 0.01
  const norm = totals.map(v => (v - min) / range)
  const W = 1000, H = 200, pad = 8, n = norm.length
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
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="gbPc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gbPc)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <line x1={nowX} y1="8" x2={nowX} y2={H - 2} stroke="var(--ink-3)" strokeWidth="2" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" opacity="0.6" />
      <circle cx={nowX} cy={nowY} r="6" fill="var(--accent)" stroke="var(--card)" strokeWidth="3" />
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
    <div className="card pad col6">
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

/* ── Main ───────────────────────────────────────────────── */
export default function DashboardClient({
  hasTibber, hasSessy, hasSolar, devices = [],
}: {
  hasTibber: boolean
  hasSessy: boolean
  hasSolar?: boolean
  devices?: DeviceSummary[]
}) {
  const { t } = useT()
  const ev = devices.find(d => d.type === 'ev_generic' || d.type === 'ev_v2g')
  const [savings, setSavings] = useState<SavingsData | null>(null)
  const [sessy, setSessy] = useState<SessyStatus | null>(null)
  const [tibber, setTibber] = useState<TibberData | null>(null)
  const [solar, setSolar] = useState<SolarProduction | null>(null)

  useEffect(() => {
    if (hasSessy) {
      fetch('/api/savings').then(r => r.json()).then(setSavings).catch(() => {})
      fetch('/api/sessy/status').then(r => r.json()).then(setSessy).catch(() => {})
    }
    if (hasSolar) {
      fetch('/api/solar/production').then(r => r.json()).then(setSolar).catch(() => {})
    }
    fetch('/api/tibber/prices').then(r => r.json()).then(setTibber).catch(() => {})
  }, [hasTibber, hasSessy, hasSolar])

  const schedule = (tibber?.optimization?.schedule ?? []).filter(s => s.action !== 'idle').slice(0, 6)
  const todayPrices = tibber?.today ?? []
  const estimatedSavings = tibber?.optimization?.estimatedSavings ?? 0
  const todaySaved = savings?.today_eur ?? 0
  const monthSaved = savings?.month_eur ?? 0
  const totalSaved = savings?.total_eur ?? 0
  const soc = sessy?.state_of_charge ?? 0
  const battPower = sessy?.power ?? 0
  const isDischarging = battPower < 0
  const currentPrice = tibber?.current?.total
  const dayAvg = todayPrices.length ? todayPrices.reduce((s, p) => s + p.total, 0) / todayPrices.length : 0
  const belowAvg = currentPrice != null && dayAvg > 0 ? currentPrice <= dayAvg : true
  const priceLabel = belowAvg ? t.dashboard.priceChart.cheap : t.dashboard.priceChart.peak

  // forecast: derive cheapest / peak from today's prices
  const sortedPrices = [...todayPrices].sort((a, b) => a.total - b.total)
  const cheapest = sortedPrices[0]?.total
  const peak = sortedPrices[sortedPrices.length - 1]?.total

  // live energy flow rows (from live device data)
  const flowRows: { k: string; icon: React.ReactNode; t: string; s: string; v: string; pos?: boolean }[] = []
  if (hasSolar && solar) {
    flowRows.push({
      k: 'solar', icon: <Sun size={21} />, t: t.dashboard.connections.catSolar,
      s: solar.source, v: `${(solar.currentWatts / 1000).toFixed(1)} kW`,
    })
  }
  if (hasSessy && sessy) {
    flowRows.push({
      k: 'home', icon: <Home size={21} />, t: t.dashboard.nav.dashboard,
      s: t.dashboard.battery.charging,
      v: `${Math.abs((sessy.grid_power ?? 0) / 1000).toFixed(1)} kW`,
    })
    flowRows.push({
      k: 'bat', icon: <BatteryCharging size={21} />, t: t.dashboard.battery.title,
      s: isDischarging ? t.dashboard.schedule.sell : t.dashboard.schedule.charge,
      v: `${battPower >= 0 ? '+' : ''}${(battPower / 1000).toFixed(1)} kW`,
      pos: battPower >= 0,
    })
  }

  return (
    <div className="gbapp">
      {/* page head */}
      <div className="page-head">
        <div>
          <div className="eyebrow">{t.dashboard.overview.subtitle}</div>
          <h1>{t.dashboard.overview.title}</h1>
        </div>
        <div className="head-r">
          <span className="pill live">{hasSessy ? t.dashboard.battery.charging : t.dashboard.nav.dashboard}</span>
        </div>
      </div>

      <div className="bento">
        {/* HERO — saved today + battery ring */}
        <div className="hero col8">
          <div className="hero-grid">
            <div>
              <div className="k">{t.dashboard.overview.savedToday}</div>
              <div className="big num">{fmt(todaySaved)}</div>
              <div className="sub">{fmt(monthSaved)} · {fmt(totalSaved)}</div>
              <div className="hero-cta">
                <Link href="/dashboard/besparingen" className="wbtn wbtn-white"><TrendingUp size={17} /> {t.dashboard.overview.viewSavings}</Link>
                <Link href="/dashboard/koppelingen" className="wbtn wbtn-glass"><Plug size={17} /> {t.dashboard.overview.connectDevice}</Link>
              </div>
            </div>
            {hasSessy && (
              <div className="hero-ring">
                <Ring pct={soc} size={118} sw={9} color="#fff" track="rgba(255,255,255,0.22)">
                  <BatteryCharging size={20} color="#fff" />
                  <b className="num" style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{soc}%</b>
                </Ring>
              </div>
            )}
          </div>
        </div>

        {/* BATTERY card */}
        {hasSessy && (
          <div className="card col4 bat">
            <Ring pct={soc} size={130} sw={11} color="var(--accent)" track="color-mix(in srgb, var(--ink) 9%, transparent)">
              <div className="rc">
                <b className="num">{soc}%</b>
                {sessy?.power != null && <span className="num">{(Math.abs(battPower) / 1000).toFixed(1)} kW</span>}
              </div>
            </Ring>
            <div className="title">{t.dashboard.battery.title}</div>
            <div className="pill-sell">
              <ArrowUpRight size={14} />
              {isDischarging ? t.dashboard.schedule.sell : t.dashboard.schedule.charge}
            </div>
          </div>
        )}

        {/* STAT — this month */}
        <div className="card pad stat col4">
          <div className="ic"><Wallet size={19} /></div>
          <div className="k">{t.dashboard.overview.thisMonth}</div>
          <div className="v num">{fmt(monthSaved)}</div>
          {monthSaved > 0 && <div className="d pos"><ArrowUpRight size={14} /> {fmt(totalSaved)}</div>}
        </div>

        {/* STAT — solar today */}
        <div className="card pad stat col4">
          <div className="ic sun"><Sun size={19} /></div>
          <div className="k">{t.dashboard.connections.catSolar}</div>
          <div className="v num">{hasSolar && solar ? `${solar.todayKwh.toFixed(1)} kWh` : '—'}</div>
          {hasSolar && solar && (
            <div className="d pos"><BatteryCharging size={14} /> {(solar.currentWatts / 1000).toFixed(1)} kW</div>
          )}
        </div>

        {/* STAT — power price now */}
        <div className="card pad stat col4">
          <div className="ic"><Zap size={19} /></div>
          <div className="k">{t.dashboard.overview.spotPriceNow}</div>
          <div className="v num">
            {currentPrice != null ? fmtSmall(currentPrice) : '—'}
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-3)' }}>{t.dashboard.overview.perKwh}</span>
          </div>
          {currentPrice != null && (
            <div className={'d ' + (belowAvg ? 'pos' : 'neg')}><ArrowDown size={14} /> {priceLabel}</div>
          )}
        </div>

        {/* PRICE CURVE */}
        {todayPrices.length > 0 ? (
          <div className="card pad ep col8">
            <div className="ep-head">
              <div>
                <div className="lab">{t.dashboard.priceChart.title}</div>
                <div className="price num">
                  {currentPrice != null ? fmtSmall(currentPrice) : '—'}
                  <small>{t.dashboard.overview.perKwh}</small>
                </div>
              </div>
              <span className={'chip' + (belowAvg ? '' : ' neg')}><ArrowDown size={14} /> {priceLabel}</span>
            </div>
            <div className="chartbox">
              <PriceCurve prices={todayPrices} height={170} />
            </div>
          </div>
        ) : (
          <div className="card pad ep col8" style={{ textAlign: 'center', padding: 36 }}>
            <Plug size={30} color="var(--ink-3)" style={{ display: 'inline-block' }} />
            <div style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-3)' }}>{t.dashboard.priceChart.loading}</div>
          </div>
        )}

        {/* LIVE FLOW */}
        <div className="card pad flow col4">
          <div className="lab">{t.dashboard.battery.title}</div>
          <div className="flow-list">
            {flowRows.length > 0 ? flowRows.map(r => (
              <div className="frow" key={r.k}>
                <div className={'fic ' + r.k}>{r.icon}</div>
                <div className="ft"><b>{r.t}</b><span>{r.s}</span></div>
                <div className={'fv num' + (r.pos ? ' pos' : '')}>{r.v}</div>
              </div>
            )) : (
              <div style={{ padding: '18px 0', fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.priceChart.loading}</div>
            )}
          </div>
        </div>

        {/* EV / V2G */}
        {ev && <EvCard ev={ev} prices={todayPrices} t={t} />}

        {/* TODAY'S PLAN */}
        {todayPrices.length > 0 && (
          <div className="card pad col7">
            <div className="sc-head">
              <h3>{t.dashboard.schedule.title}</h3>
              <Link href="/dashboard/besparingen" className="sc-link">{t.dashboard.common.viewAll} <ChevronRight size={15} /></Link>
            </div>
            {schedule.length === 0 ? (
              <div style={{ padding: '18px 0', textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>{t.dashboard.schedule.none}</div>
            ) : schedule.map((s) => {
              const isCharge = s.action === 'charge'
              return (
                <div className="sline" key={s.hour}>
                  <div className={'sc-ic ' + (isCharge ? 'charge' : 'sell')}>{isCharge ? <ArrowDown size={20} /> : <ArrowUpRight size={20} />}</div>
                  <div className="sc-main">
                    <div className="t">{isCharge ? t.dashboard.schedule.charge : t.dashboard.schedule.sell}</div>
                    <div className="s num">{fmtSmall(s.price)}{t.dashboard.overview.perKwh}</div>
                  </div>
                  <div className="sc-time num">{String(s.hour).padStart(2, '0')}:00</div>
                </div>
              )
            })}
          </div>
        )}

        {/* FORECAST */}
        {todayPrices.length > 0 && (
          <div className="card pad forecast col5">
            <div className="fc-head"><span className="fci"><Sparkles size={20} /></span><b>{t.dashboard.schedule.title}</b></div>
            <p>
              {estimatedSavings > 0
                ? <>~<b className="acc">{fmt(estimatedSavings)}</b></>
                : t.dashboard.schedule.none}
            </p>
            <div className="fc-foot">
              <div className="mini"><span className="mk">{t.dashboard.connections.catSolar}</span><span className="mv num">{hasSolar && solar ? `${solar.todayKwh.toFixed(1)} kWh` : '—'}</span></div>
              <div className="mini"><span className="mk">{t.dashboard.priceChart.cheap}</span><span className="mv num">{cheapest != null ? fmtSmall(cheapest) : '—'}</span></div>
              <div className="mini"><span className="mk">{t.dashboard.priceChart.peak}</span><span className="mv num">{peak != null ? fmtSmall(peak) : '—'}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
