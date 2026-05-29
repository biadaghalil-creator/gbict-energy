'use client'

import { useState, useTransition } from 'react'
import { saveSettings, type ProfileSettings } from './actions'

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
    label: 'Max besparing',
    icon: '💰',
    desc: 'Laadt en ontlaadt zo vaak mogelijk op de beste prijsmomenten.',
  },
  {
    id: 'comfort',
    label: 'Comfort',
    icon: '⚖️',
    desc: 'Balans tussen besparing en een altijd beschikbare batterij.',
  },
  {
    id: 'eco',
    label: 'Eco',
    icon: '🌱',
    desc: 'Laadt alleen op zonne-energie en goedkoopste uren.',
  },
]

const CONTRACT_OPTIONS = [
  'Tibber', 'Frank Energie', 'EnergyZero', 'ANWB Energie',
  'Vandebron', 'Vast contract', 'Weet ik niet',
]

const HOUSEHOLD_SIZES = [1, 2, 3, 4, 5, 6, 7]

export default function InstellingenClient({ profile, email }: Props) {
  const [optimizeMode, setOptimizeMode] = useState<string>(profile.optimize_mode ?? 'max_savings')
  const [contractType, setContractType] = useState<string>(profile.contract_type ?? '')
  const [postcode, setPostcode] = useState<string>(profile.postcode ?? '')
  const [householdSize, setHouseholdSize] = useState<number>(profile.household_size ?? 2)
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
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Instellingen
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Beheer je profiel en optimalisatievoorkeuren.
        </p>
      </div>

      {/* Account */}
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Account</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
              {email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{email}</p>
              <p className="text-xs text-zinc-400">GBICT Energy account</p>
            </div>
          </div>
        </div>
      </section>

      {/* Optimalisatie modus */}
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Optimalisatie modus</h2>
          <p className="mt-0.5 text-xs text-zinc-400">Hoe wil je dat GBICT Energy je batterij aanstuurt?</p>
        </div>
        <div className="space-y-2 px-6 py-4">
          {OPTIMIZE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setOptimizeMode(opt.id)}
              className={`flex w-full items-start gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                optimizeMode === opt.id
                  ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30'
                  : 'border-zinc-100 bg-white hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${optimizeMode === opt.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                  {opt.label}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">{opt.desc}</p>
              </div>
              <div className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors ${
                optimizeMode === opt.id
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`} />
            </button>
          ))}
        </div>
      </section>

      {/* Energiecontract */}
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Energiecontract</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {CONTRACT_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setContractType(c)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  contractType === c
                    ? 'border-emerald-400 bg-emerald-500 text-white'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Huishouden */}
      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Huishouden</h2>
        </div>
        <div className="space-y-4 px-6 py-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Postcode
            </label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="1234 AB"
              maxLength={7}
              className="w-40 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-300 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-emerald-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Aantal personen
            </label>
            <div className="flex gap-2">
              {HOUSEHOLD_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => setHouseholdSize(n)}
                  className={`h-9 w-9 rounded-xl border text-sm font-medium transition-colors ${
                    householdSize === n
                      ? 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  {n === 7 ? '7+' : n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Opslaan */}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500 dark:bg-red-950/30">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full bg-emerald-500 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
        >
          {isPending ? 'Opslaan…' : 'Wijzigingen opslaan'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Opgeslagen
          </span>
        )}
      </div>
    </div>
  )
}
