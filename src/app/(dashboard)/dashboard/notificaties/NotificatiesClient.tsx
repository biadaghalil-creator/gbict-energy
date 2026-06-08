'use client'

import { useState } from 'react'
import { Zap, BatteryCharging, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

interface OptimizationLog {
  id: string; action: string; price_eur: number; savings_eur: number; created_at: string
}

type FilterTab = 'all' | 'charge' | 'discharge' | 'savings'

const tabs: { id: FilterTab; key: 'filterAll' | 'filterCharge' | 'filterDischarge' | 'filterSavings' }[] = [
  { id: 'all',       key: 'filterAll' },
  { id: 'charge',    key: 'filterCharge' },
  { id: 'discharge', key: 'filterDischarge' },
  { id: 'savings',   key: 'filterSavings' },
]

function timeAgo(dateStr: string, t: TranslationDict, tag: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24)
  if (s < 60) return t.dashboard.activity.justNow
  if (m < 60) return fill(t.dashboard.activity.minutesAgo, { n: m })
  if (h < 24) return fill(t.dashboard.activity.hoursAgo, { n: h })
  if (d === 1) return t.dashboard.activity.yesterday
  if (d < 7)  return fill(t.dashboard.activity.daysAgo, { n: d })
  return new Date(dateStr).toLocaleDateString(tag, { day: 'numeric', month: 'short' })
}

function formatDateGroup(dateStr: string, t: TranslationDict, tag: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  if (d.getTime() === today.getTime()) return t.dashboard.activity.today
  if (d.getTime() === yesterday.getTime()) return t.dashboard.activity.yesterdayGroup
  return date.toLocaleDateString(tag, { weekday: 'long', day: 'numeric', month: 'long' })
}

function isChargeAction(action: string): boolean {
  return action.toLowerCase().includes('charge') || action.toLowerCase().includes('laden')
}

export default function NotificatiesClient({ logs }: { logs: OptimizationLog[] }) {
  const { t, tag } = useT()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filtered = logs.filter(log => {
    if (activeTab === 'all')        return true
    if (activeTab === 'charge')     return isChargeAction(log.action)
    if (activeTab === 'discharge')  return !isChargeAction(log.action)
    if (activeTab === 'savings')    return log.savings_eur > 0
    return true
  })

  /* Group by date */
  const grouped: Record<string, OptimizationLog[]> = {}
  for (const log of filtered) {
    const key = formatDateGroup(log.created_at, t, tag)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(log)
  }

  /* Stats from all logs */
  const totalSaved   = logs.reduce((sum, l) => sum + (l.savings_eur ?? 0), 0)
  const chargeCount  = logs.filter(l => isChargeAction(l.action)).length
  const dischargeCount = logs.filter(l => !isChargeAction(l.action)).length

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-[var(--text)]">{t.dashboard.activity.title}</h1>
          <p className="mt-1 text-[13px] text-[var(--text-faint)]">{t.dashboard.activity.subtitle}</p>
        </div>
      </div>

      {/* Mini stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">{t.dashboard.activity.statTotalActions}</p>
          <p className="mt-3 font-mono text-[26px] font-bold tracking-[-0.03em] text-[var(--text)]">{logs.length}</p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">{t.dashboard.activity.statAutomated}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">{t.dashboard.activity.statChargeSell}</p>
          <p className="mt-3 font-mono text-[26px] font-bold tracking-[-0.03em] text-[var(--text)]">
            {chargeCount}<span className="text-[var(--text-faint)]">/</span>{dischargeCount}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">{t.dashboard.activity.statSplit}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">{t.dashboard.activity.statTotalSaved}</p>
          <p className={`mt-3 font-mono text-[26px] font-bold tracking-[-0.03em] ${totalSaved > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
            €{totalSaved.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-faint)]">{t.dashboard.activity.statTotal}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-[var(--surface)] p-1 ring-1 ring-white/[0.06]">
        {tabs.map(tab => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all',
              activeTab === tab.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'
            )}>
            {t.dashboard.activity[tab.key]}
          </button>
        ))}
      </div>

      {/* Activity feed */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-16">
          <Activity className="h-10 w-10 text-[var(--text-faint)]" />
          <p className="mt-4 text-[13px] text-[var(--text-faint)]">{t.dashboard.activity.emptyTitle}</p>
          <p className="mt-1 text-[12px] text-[var(--text-faint)]">{t.dashboard.activity.emptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([dateLabel, dayLogs]) => (
            <div key={dateLabel}>
              {/* Date group header */}
              <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-faint)]">
                {dateLabel}
                <span className="flex-1 border-t border-[var(--border)]" />
              </p>

              {/* Log items */}
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {dayLogs.map((log, index) => {
                  const charging = isChargeAction(log.action)
                  return (
                    <div key={log.id}
                      className={cn('flex items-center gap-4 px-5 py-4', index < dayLogs.length - 1 && 'border-b border-[var(--border)]')}>
                      {/* Icon */}
                      <div className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                        charging ? 'bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'bg-amber-500/10 ring-1 ring-amber-500/20'
                      )}>
                        {charging
                          ? <BatteryCharging className="h-4 w-4 text-emerald-400" />
                          : <Zap className="h-4 w-4 text-amber-400" />
                        }
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-medium text-[var(--text)]">
                          {charging ? t.dashboard.activity.charged : t.dashboard.activity.discharged}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-[var(--text-faint)]">
                          €{log.price_eur.toFixed(4)}/kWh
                          {log.savings_eur > 0 && (
                            <span className="ml-2 text-emerald-400">· €{log.savings_eur.toFixed(3)} {t.dashboard.activity.saved}</span>
                          )}
                        </p>
                      </div>

                      {/* Right side */}
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {log.savings_eur > 0 && (
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                            +€{log.savings_eur.toFixed(3)}
                          </span>
                        )}
                        <time className="text-[11px] text-[var(--text-faint)]">{timeAgo(log.created_at, t, tag)}</time>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
