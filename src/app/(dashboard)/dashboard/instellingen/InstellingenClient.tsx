'use client'

import { useState, useTransition } from 'react'
import { User, Zap, FileText, Home, Check, AlertCircle, TrendingUp, Sliders, Leaf } from 'lucide-react'
import { saveSettings, type ProfileSettings } from './actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Props = {
  profile: {
    optimize_mode: string | null
    contract_type: string | null
    postcode: string | null
    household_size: number | null
  }
  email: string
}

const OPTIMIZE_OPTIONS = [
  {
    id: 'max_savings',
    label: 'Max savings',
    Icon: TrendingUp,
    desc: 'Charges and discharges as often as possible at the best price moments.',
    activeClass: 'border-violet-500/40 bg-violet-500/[0.06] ring-1 ring-violet-500/20',
    idleClass: 'border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04]',
    labelColor: 'text-violet-400',
    iconColor: 'text-violet-400',
    dotClass: 'border-violet-500 bg-violet-500',
  },
  {
    id: 'comfort',
    label: 'Comfort',
    Icon: Sliders,
    desc: 'Balance between savings and always having a charged battery.',
    activeClass: 'border-blue-500/40 bg-blue-500/[0.06] ring-1 ring-blue-500/20',
    idleClass: 'border-white/[0.06] bg-white/[0.02] hover:border-blue-500/20 hover:bg-white/[0.04]',
    labelColor: 'text-blue-400',
    iconColor: 'text-blue-400',
    dotClass: 'border-blue-400 bg-blue-400',
  },
  {
    id: 'eco',
    label: 'Eco',
    Icon: Leaf,
    desc: 'Charges only on solar energy and cheapest grid hours.',
    activeClass: 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20',
    idleClass: 'border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04]',
    labelColor: 'text-emerald-400',
    iconColor: 'text-emerald-400',
    dotClass: 'border-emerald-400 bg-emerald-400',
  },
]

const CONTRACT_OPTIONS = [
  'Tibber', 'Frank Energie', 'EnergyZero', 'ANWB Energie',
  'Vandebron', 'Vast contract', 'Weet ik niet',
]

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7]

function Section({ icon: Icon, title, sub, children }: {
  icon: React.ElementType
  title: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0E16]">
      <div className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold text-slate-200">
          <Icon className="h-4 w-4 text-slate-500" />
          {title}
        </h2>
        {sub && <p className="mt-0.5 text-[12px] text-slate-600">{sub}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export default function InstellingenClient({ profile, email }: Props) {
  const [optimizeMode, setOptimizeMode] = useState(profile.optimize_mode ?? 'max_savings')
  const [contractType, setContractType] = useState(profile.contract_type ?? '')
  const [postcode, setPostcode] = useState(profile.postcode ?? '')
  const [householdSize, setHouseholdSize] = useState(profile.household_size ?? 2)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError('')
    setSaved(false)
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
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.035em] text-slate-50">Settings</h1>
        <p className="mt-1.5 text-[14px] text-slate-500">Manage your profile and optimization preferences.</p>
      </div>

      {/* Account */}
      <Section icon={User} title="Account">
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-violet-500/10 text-[15px] font-bold text-violet-400 ring-1 ring-violet-500/20">
              {email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[14px] font-medium text-slate-200">{email}</p>
            <p className="mt-0.5 text-[12px] text-slate-600">GBICT Energy account</p>
          </div>
          <span className="ml-auto rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-500">
            Free plan
          </span>
        </div>
      </Section>

      {/* Optimization mode */}
      <Section icon={Zap} title="Optimization mode" sub="How should GBICT Energy control your battery?">
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
                <opt.Icon className={cn('mt-0.5 h-4 w-4 shrink-0', isActive ? opt.iconColor : 'text-slate-600')} />
                <div className="flex-1">
                  <p className={cn('text-[13.5px] font-semibold', isActive ? opt.labelColor : 'text-slate-400')}>
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-slate-600">{opt.desc}</p>
                </div>
                <div className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-all',
                  isActive ? opt.dotClass : 'border-slate-700'
                )} />
              </button>
            )
          })}
        </div>
      </Section>

      {/* Energy contract */}
      <Section icon={FileText} title="Energy contract">
        <div className="flex flex-wrap gap-2">
          {CONTRACT_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setContractType(c)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all',
                contractType === c
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                  : 'border-white/[0.06] text-slate-500 hover:border-violet-500/20 hover:text-slate-300'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* Household */}
      <Section icon={Home} title="Household">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[12.5px] font-medium text-slate-500">Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="1234 AB"
              maxLength={7}
              className="w-40 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[13.5px] text-slate-200 placeholder-slate-700 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-[12.5px] font-medium text-slate-500">Number of people</label>
            <div className="flex gap-2">
              {HOUSEHOLD_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => setHouseholdSize(n)}
                  className={cn(
                    'h-9 w-9 rounded-xl border text-[13px] font-semibold transition-all',
                    householdSize === n
                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                      : 'border-white/[0.06] text-slate-600 hover:border-violet-500/20 hover:text-slate-300'
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
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#5B21B6] px-7 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#6D28D9] disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-[13px] text-emerald-400">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </div>
  )
}
