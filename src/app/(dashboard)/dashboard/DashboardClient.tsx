'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Zap, TrendingUp, TrendingDown, BatteryCharging,
  ArrowUpRight, Plug, ExternalLink,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

/* ── Types ─────────────────────────────────────────────── */
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

/* ── Hero card ──────────────────────────────────────────── */
function HeroCard({ savings, tibber, hasSessy }: {
  savings: SavingsData | null
  tibber: TibberData | null
  hasSessy: boolean
}) {
  const todaySaved = savings?.today_eur ?? 0
  const monthSaved = savings?.month_eur ?? 0
  const currentPrice = tibber?.current?.total

  return (
    <div className="relative lg:col-span-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
      {/* Gradient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.3),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.15),transparent_70%)]" />

      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
          Today's overview
        </p>
        <h2 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.035em] text-[var(--text)]">
          {hasSessy ? 'Automatische optimalisatie actief' : 'Koppel je eerste apparaat'}
        </h2>
        <p className="mt-2 max-w-md text-[14px] leading-[1.6] text-[var(--text-faint)]">
          {hasSessy
            ? 'GBICT volgt continu de EPEX-spotprijzen en stuurt je batterij automatisch aan.'
            : 'Link your smart meter or battery in 2 minutes and start saving automatically.'}
        </p>

        {/* Stats row */}
        <div className="mt-7 flex flex-wrap gap-6">
          <div>
            <p className="text-[11px] text-[var(--text-faint)]">Vandaag bespaard</p>
            <p className={`mt-1 font-mono text-[22px] font-semibold tracking-tight ${todaySaved > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
              {fmt(todaySaved)}
            </p>
          </div>
          <div className="w-px bg-[var(--surface-2)]" />
          <div>
            <p className="text-[11px] text-[var(--text-faint)]">Deze maand</p>
            <p className={`mt-1 font-mono text-[22px] font-semibold tracking-tight ${monthSaved > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
              {fmt(monthSaved)}
            </p>
          </div>
          {currentPrice && (
            <>
              <div className="w-px bg-[var(--surface-2)]" />
              <div>
                <p className="text-[11px] text-[var(--text-faint)]">Spotprijs nu</p>
                <p className="mt-1 font-mono text-[22px] font-semibold tracking-tight text-[var(--text)]">
                  {fmtSmall(currentPrice)}<span className="ml-1 text-[12px] text-[var(--text-faint)]">/kWh</span>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-7 flex items-center gap-3">
          <Link
            href="/dashboard/besparingen"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-[#047857] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#059669]"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Bekijk besparing
          </Link>
          {!hasSessy && (
            <Link
              href="/dashboard/koppelingen"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-[13px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <Plug className="h-3.5 w-3.5" />
              Apparaat koppelen
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Battery status card ────────────────────────────────── */
function BatteryCard({ sessy }: { sessy: SessyStatus | null }) {
  if (!sessy) {
    return (
      <div className="flex flex-col justify-between rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)]">
          <BatteryCharging className="h-4 w-4 text-[var(--text-faint)]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-faint)]">Batterij</p>
          <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">Geen apparaat gekoppeld</p>
          <Link href="/dashboard/koppelingen" className="mt-3 flex items-center gap-1 text-[12px] font-medium text-emerald-400 hover:text-emerald-300">
            Connect <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <BatteryCharging className="h-4 w-4 text-emerald-400" />
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
          <span className="h-[12px] w-[3px] rounded-sm bg-emerald-400" />
          {sessy.power !== 0 ? (sessy.power > 0 ? 'Aan het laden' : 'Aan het ontladen') : 'Standby'}
        </span>
      </div>
      <div>
        <p className="text-[11px] text-[var(--text-faint)]">Batterij · Sessy</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono text-[32px] font-bold tracking-[-0.03em] text-[var(--text)]">
            {sessy.state_of_charge}
          </span>
          <span className="text-[13px] text-[var(--text-faint)]">%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${sessy.state_of_charge}%`, background: 'linear-gradient(90deg, #047857, #A78BFA)' }}
          />
        </div>
        {sessy.power !== 0 && (
          <p className="mt-2 text-[11.5px] text-[var(--text-faint)]">{Math.abs(sessy.power)}W {sessy.power > 0 ? 'charging' : 'discharging'}</p>
        )}
      </div>
    </div>
  )
}

/* ── VPP / upgrade card ─────────────────────────────────── */
function VppCard({ enrolled }: { enrolled: boolean }) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-[var(--surface)] p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2),transparent_70%)]" />
      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Zap className="h-4 w-4 text-emerald-400" />
        </div>
        <p className="mt-4 text-[13px] font-semibold text-[var(--text)]">Virtueel energienet</p>
        <p className="mt-1 text-[12px] text-[var(--text-faint)]">Verdien extra door stroom terug te leveren op piekmomenten.</p>
      </div>
      <Link
        href="/dashboard/vpp"
        className="relative mt-5 inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 text-[12px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/15"
      >
        {enrolled ? 'Bekijk status' : 'Aanmelden bèta'} <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  )
}

/* ── Price bar chart ────────────────────────────────────── */
function PriceChart({ prices, schedule }: { prices: PricePoint[]; schedule?: ScheduleSlot[] }) {
  if (!prices.length) return null
  const totals = prices.map(p => p.total)
  const min = Math.min(...totals), max = Math.max(...totals)
  const range = max - min || 0.01
  const now = new Date().getHours()

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-[var(--text)]">Energieprijzen</p>
          <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">EPEX-spotprijzen vandaag (€/kWh)</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-[var(--surface-2)] p-1">
          <span className="rounded-md bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-400">Vandaag</span>
          <span className="px-3 py-1 text-[11px] font-medium text-[var(--text-faint)]">Morgen</span>
        </div>
      </div>

      <div className="flex h-[96px] items-end gap-[3px]">
        {prices.map((price, i) => {
          const hour = new Date(price.startsAt).getHours()
          const h = ((price.total - min) / range) * 70 + 30
          const ratio = (price.total - min) / range
          const slot = schedule?.find(s => new Date(s.startsAt).getHours() === hour)
          let color = ratio < 0.33 ? 'bg-emerald-500/50' : ratio > 0.66 ? 'bg-red-500/50' : 'bg-slate-500/30'
          if (slot?.action === 'charge') color = 'bg-emerald-500'
          else if (slot?.action === 'discharge') color = 'bg-amber-500'

          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center">
              <div className="pointer-events-none absolute bottom-[calc(100%+4px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5 text-[10.5px] text-[var(--text-muted)] shadow-xl group-hover:block">
                {String(hour).padStart(2,'0')}:00 · €{price.total.toFixed(4)}
              </div>
              <div className={`w-full rounded-t-[3px] ${color} ${hour === now ? 'ring-1 ring-white/30' : ''}`}
                style={{ height: `${h}%` }} />
              {hour % 6 === 0 && <span className="mt-1 text-[9px] tabular-nums text-[var(--text-faint)]">{hour}</span>}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-5 text-[11px] text-[var(--text-faint)]">
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />Laden</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-amber-500" />Verkopen</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-emerald-500/50" />Goedkoop</span>
        <span className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-sm bg-red-500/50" />Piek</span>
      </div>
    </div>
  )
}

/* ── Optimization schedule list ─────────────────────────── */
function ScheduleList({ schedule, estimatedSavings }: {
  schedule: ScheduleSlot[]
  estimatedSavings: number
}) {
  const active = schedule.filter(s => s.action !== 'idle')
  const maxPrice = Math.max(...schedule.map(s => s.price), 0.01)

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-[var(--text)]">Optimalisatieschema</p>
          <p className="mt-0.5 text-[11px] text-[var(--text-faint)]">Geplande acties vandaag</p>
        </div>
        <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
          ~{fmt(estimatedSavings)}
        </span>
      </div>

      {active.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-[var(--text-faint)]">Geen acties gepland voor vandaag</p>
      ) : (
        <div className="space-y-3">
          {active.slice(0, 6).map((slot) => {
            const barPct = (slot.price / maxPrice) * 100
            const isCharge = slot.action === 'charge'
            return (
              <div key={slot.hour} className="flex items-center gap-3">
                <span className="w-10 shrink-0 font-mono text-[12px] tabular-nums text-[var(--text-faint)]">
                  {String(slot.hour).padStart(2, '0')}:00
                </span>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  isCharge ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {isCharge ? '↑ Laden' : '↓ Verkopen'}
                </span>
                <div className="relative flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]" style={{ height: '6px' }}>
                  <div
                    className={`h-full rounded-full transition-all ${isCharge ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px] text-[var(--text-faint)]">
                  €{slot.price.toFixed(4)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Recent activity table ──────────────────────────────── */
function ActivityTable() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/savings/history?days=7')
      .then(r => r.json())
      .then(d => { setLogs(d?.recent?.slice(0, 6) ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
        <p className="text-[14px] font-semibold text-[var(--text)]">Recente activiteit</p>
        <Link href="/dashboard/besparingen" className="flex items-center gap-1 text-[12px] font-medium text-emerald-400 hover:text-emerald-300">
          Alles bekijken <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-0 divide-y divide-white/[0.04]">
          {[1,2,3,4].map(i => (
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
          <p className="text-[13px] text-[var(--text-faint)]">Nog geen activiteit</p>
          <p className="mt-1 text-[12px] text-[var(--text-faint)]">De optimizer draait elk uur automatisch</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {logs.map((log: any, i: number) => {
            const isCharge = log.action === 'charge'
            const dt = new Date(log.created_at)
            const timeStr = dt.toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
            return (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  isCharge ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 ring-1 ring-amber-500/20'
                }`}>
                  {isCharge
                    ? <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                    : <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[var(--text-muted)]">
                    {isCharge ? 'Batterij geladen' : 'Batterij ontladen'}
                    {log.kwh > 0 && <span className="ml-2 font-normal text-[var(--text-faint)]">{log.kwh.toFixed(1)} kWh</span>}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-[var(--text-faint)]">
                    {timeStr}
                    {log.price_eur > 0 && <span className="ml-2">@ €{log.price_eur.toFixed(4)}/kWh</span>}
                  </p>
                </div>
                <span className={`text-[13px] font-semibold ${(log.savings_eur ?? 0) > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
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
  hasTibber, hasSessy, hasSolar,
}: {
  hasTibber: boolean
  hasSessy: boolean
  hasSolar: boolean
}) {
  const [savings, setSavings] = useState<SavingsData | null>(null)
  const [sessy, setSessy] = useState<SessyStatus | null>(null)
  const [tibber, setTibber] = useState<TibberData | null>(null)

  useEffect(() => {
    if (hasSessy) {
      fetch('/api/savings').then(r => r.json()).then(setSavings).catch(() => {})
      fetch('/api/sessy/status').then(r => r.json()).then(setSessy).catch(() => {})
    }
    if (hasTibber) {
      fetch('/api/tibber/prices').then(r => r.json()).then(setTibber).catch(() => {})
    }
  }, [hasTibber, hasSessy])

  const schedule = tibber?.optimization?.schedule ?? []
  const todayPrices = tibber?.today ?? []
  const estimatedSavings = tibber?.optimization?.estimatedSavings ?? 0

  return (
    <div className="space-y-5">
      {/* Row 1: Hero + Battery + VPP */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <HeroCard savings={savings} tibber={tibber} hasSessy={hasSessy} />
        <BatteryCard sessy={sessy} />
        <VppCard enrolled={false} />
      </div>

      {/* Row 2: Price chart + Schedule */}
      {(hasTibber && todayPrices.length > 0) ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <PriceChart prices={todayPrices} schedule={schedule} />
          <ScheduleList schedule={schedule} estimatedSavings={estimatedSavings} />
        </div>
      ) : !hasTibber ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <Plug className="mx-auto h-8 w-8 text-[var(--text-faint)]" />
          <p className="mt-4 text-[14px] font-medium text-[var(--text-faint)]">Koppel Tibber om live energieprijzen en grafieken te zien</p>
          <Link href="/dashboard/koppelingen"
            className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-[#047857] px-5 text-[13px] font-semibold text-white hover:bg-[#059669]">
            Connect Tibber
          </Link>
        </div>
      ) : null}

      {/* Row 3: Activity table */}
      {hasSessy && <ActivityTable />}
    </div>
  )
}
