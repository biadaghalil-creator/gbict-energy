'use client'

import { useState, useTransition } from 'react'
import { User, Zap, FileText, Home, Check, AlertCircle, TrendingUp, Sliders, Leaf } from 'lucide-react'
import { saveSettings, type ProfileSettings } from './actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

type Props = {
  profile: {
    optimize_mode: string | null
    contract_type: string | null
    postcode: string | null
    household_size: number | null
  }
  email: string
}

const OPTIMIZE_OPTIONS: {
  id: string
  labelKey: 'modeMaxLabel' | 'modeComfortLabel' | 'modeEcoLabel'
  descKey: 'modeMaxDesc' | 'modeComfortDesc' | 'modeEcoDesc'
  Icon: typeof TrendingUp
  activeClass: string
  idleClass: string
  labelColor: string
  iconColor: string
  dotClass: string
}[] = [
  {
    id: 'max_savings',
    labelKey: 'modeMaxLabel',
    Icon: TrendingUp,
    descKey: 'modeMaxDesc',
    activeClass: 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20',
    idleClass: 'border-[var(--border)] bg-[var(--surface-2)] hover:border-emerald-500/20 hover:bg-[var(--surface-2)]',
    labelColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    dotClass: 'border-emerald-500 bg-emerald-500',
  },
  {
    id: 'comfort',
    labelKey: 'modeComfortLabel',
    Icon: Sliders,
    descKey: 'modeComfortDesc',
    activeClass: 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20',
    idleClass: 'border-[var(--border)] bg-[var(--surface-2)] hover:border-emerald-500/20 hover:bg-[var(--surface-2)]',
    labelColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    dotClass: 'border-emerald-400 bg-emerald-400',
  },
  {
    id: 'eco',
    labelKey: 'modeEcoLabel',
    Icon: Leaf,
    descKey: 'modeEcoDesc',
    activeClass: 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20',
    idleClass: 'border-[var(--border)] bg-[var(--surface-2)] hover:border-emerald-500/20 hover:bg-[var(--surface-2)]',
    labelColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    dotClass: 'border-emerald-400 bg-emerald-400',
  },
]

/** Contract options. Brand names stay; the two generic options are translated. */
const CONTRACT_OPTIONS: { value: string; labelKey?: 'contractFixed' | 'contractUnknown' }[] = [
  { value: 'Tibber' }, { value: 'Frank Energie' }, { value: 'EnergyZero' }, { value: 'ANWB Energie' },
  { value: 'Vandebron' }, { value: 'fixed', labelKey: 'contractFixed' }, { value: 'unknown', labelKey: 'contractUnknown' },
]

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7]

function Section({ icon: Icon, title, sub, children }: {
  icon: React.ElementType
  title: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_2px_26px_-16px_rgba(20,24,15,0.30)]">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text)]">
          <Icon className="h-4 w-4 text-[var(--text-faint)]" />
          {title}
        </h2>
        {sub && <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">{sub}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export default function InstellingenClient({ profile, email }: Props) {
  const { t } = useT()
  const [optimizeMode, setOptimizeMode] = useState(profile.optimize_mode ?? 'max_savings')
  const [contractType, setContractType] = useState(profile.contract_type ?? '')
  const [postcode, setPostcode] = useState(profile.postcode ?? '')
  const [householdSize, setHouseholdSize] = useState(profile.household_size ?? 2)
  const [saved, setOpgeslagen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError('')
    setOpgeslagen(false)
    startTransition(async () => {
      const result = await saveSettings({
        optimize_mode: optimizeMode as ProfileSettings['optimize_mode'],
        contract_type: contractType,
        postcode,
        household_size: householdSize,
      })
      if (result.error) {
        setError(result.error)
      } else {
        setOpgeslagen(true)
        setTimeout(() => setOpgeslagen(false), 3000)
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.035em] text-[var(--text)]">{t.dashboard.settings.title}</h1>
        <p className="mt-1.5 text-[14px] text-[var(--text-faint)]">{t.dashboard.settings.subtitle}</p>
      </div>

      {/* Account */}
      <Section icon={User} title={t.dashboard.settings.accountTitle}>
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-emerald-500/10 text-[15px] font-bold text-emerald-400 ring-1 ring-emerald-500/20">
              {email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[14px] font-medium text-[var(--text)]">{email}</p>
            <p className="mt-0.5 text-[12px] text-[var(--text-faint)]">{t.dashboard.settings.accountLabel}</p>
          </div>
          <span className="ml-auto rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-faint)]">
            {t.dashboard.settings.freePlan}
          </span>
        </div>
      </Section>

      {/* Optimization mode */}
      <Section icon={Zap} title={t.dashboard.settings.optimizeTitle} sub={t.dashboard.settings.optimizeSubtitle}>
        <div className="space-y-2">
          {OPTIMIZE_OPTIONS.map((opt) => {
            const isActive = optimizeMode === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setOptimizeMode(opt.id)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-xl border px-4 py-3.5 text-left transition-all',
                  isActive ? opt.activeClass : opt.idleClass
                )}
              >
                <opt.Icon className={cn('mt-0.5 h-4 w-4 shrink-0', isActive ? opt.iconColor : 'text-[var(--text-faint)]')} />
                <div className="flex-1">
                  <p className={cn('text-[13.5px] font-semibold', isActive ? opt.labelColor : 'text-[var(--text-muted)]')}>
                    {t.dashboard.settings[opt.labelKey]}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-[var(--text-faint)]">{t.dashboard.settings[opt.descKey]}</p>
                </div>
                <div className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-all',
                  isActive ? opt.dotClass : 'border-[var(--border)]'
                )} />
              </button>
            )
          })}
        </div>
      </Section>

      {/* Energy contract */}
      <Section icon={FileText} title={t.dashboard.settings.contractTitle}>
        <div className="flex flex-wrap gap-2">
          {CONTRACT_OPTIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setContractType(c.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all',
                contractType === c.value
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-[var(--border)] text-[var(--text-faint)] hover:border-emerald-500/20 hover:text-[var(--text-muted)]'
              )}
            >
              {c.labelKey ? t.dashboard.settings[c.labelKey] : c.value}
            </button>
          ))}
        </div>
      </Section>

      {/* Household */}
      <Section icon={Home} title={t.dashboard.settings.householdTitle}>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[12.5px] font-medium text-[var(--text-faint)]">{t.dashboard.settings.postcodeLabel}</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="1234 AB"
              maxLength={7}
              className="w-40 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[13.5px] text-[var(--text)] placeholder-slate-700 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12.5px] font-medium text-[var(--text-faint)]">{t.dashboard.settings.peopleLabel}</label>
            <div className="flex gap-2">
              {HOUSEHOLD_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => setHouseholdSize(n)}
                  className={cn(
                    'h-9 w-9 rounded-xl border text-[13px] font-semibold transition-all',
                    householdSize === n
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-[var(--border)] text-[var(--text-faint)] hover:border-emerald-500/20 hover:text-[var(--text-muted)]'
                  )}
                >
                  {n === 7 ? '7+' : n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#047857] px-7 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#059669] disabled:opacity-50"
        >
          {isPending ? t.dashboard.settings.saving : t.dashboard.settings.saveChanges}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-[13px] text-emerald-400">
            <Check className="h-4 w-4" />
            {t.dashboard.settings.saved}
          </span>
        )}
      </div>
    </div>
  )
}
