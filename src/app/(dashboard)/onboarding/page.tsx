'use client'

import { useState } from 'react'
import { saveOnboarding } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  has_battery: boolean
  has_solar: boolean
  has_p1: boolean
  contract_type: string
  hardware_brand: string
  postcode: string
  household_size: number
  optimize_mode: string
}

const initial: FormData = {
  has_battery: false,
  has_solar: false,
  has_p1: false,
  contract_type: '',
  hardware_brand: '',
  postcode: '',
  household_size: 2,
  optimize_mode: 'max_savings',
}

// ─── Opties ───────────────────────────────────────────────────────────────────

const CONTRACTS = [
  { id: 'tibber', label: 'Tibber', sub: 'Dynamisch' },
  { id: 'frank', label: 'Frank Energie', sub: 'Dynamisch' },
  { id: 'energyzero', label: 'EnergyZero', sub: 'Dynamisch' },
  { id: 'anwb', label: 'ANWB Energie', sub: 'Dynamisch' },
  { id: 'vandebron', label: 'Vandebron', sub: 'Dynamisch' },
  { id: 'vast', label: 'Vast contract', sub: 'Vaste prijs' },
  { id: 'onbekend', label: 'Weet ik niet', sub: '' },
]

const BRANDS = [
  { id: 'sessy', label: 'Sessy' },
  { id: 'enphase', label: 'Enphase' },
  { id: 'solaredge', label: 'SolarEdge' },
  { id: 'victron', label: 'Victron' },
  { id: 'goodwe', label: 'GoodWe' },
  { id: 'growatt', label: 'Growatt' },
  { id: 'huawei', label: 'Huawei' },
  { id: 'tesla', label: 'Tesla Powerwall' },
  { id: 'anders', label: 'Anders / weet ik niet' },
]

const OPTIMIZE = [
  {
    id: 'max_savings',
    label: 'Maximaal besparen',
    sub: 'Laad en ontlaad zo agressief mogelijk op de beste prijsmomenten',
  },
  {
    id: 'comfort',
    label: 'Comfort eerst',
    sub: 'Batterij altijd deels gevuld voor stroomuitval, dan pas besparen',
  },
  {
    id: 'eco',
    label: 'Groen & bewust',
    sub: 'Prioriteit op zelf opgewekte stroom, minimale netafname',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>Stap {step} van {total}</span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
    </div>
  )
}

// ─── Hoofd component ──────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [loading, setLoading] = useState(false)

  // Stap 3 (merk) overslaan als geen batterij
  const totalSteps = form.has_battery ? 5 : 4

  function next() {
    setStep((s) => {
      const nextStep = s + 1
      // Stap 3 overslaan als geen batterij
      if (nextStep === 3 && !form.has_battery) return 4
      return nextStep
    })
  }

  function back() {
    setStep((s) => {
      const prevStep = s - 1
      if (prevStep === 3 && !form.has_battery) return 2
      return prevStep
    })
  }

  async function handleFinish() {
    setLoading(true)
    await saveOnboarding(form)
  }

  // Stap 1 — Wat heb je thuis?
  if (step === 1) {
    type HardwareKey = 'has_battery' | 'has_solar' | 'has_p1'
    const items: { key: HardwareKey; label: string; sub: string; icon: string }[] = [
      { key: 'has_battery', label: 'Thuisbatterij', sub: 'Sessy, Enphase, Tesla, etc.', icon: '🔋' },
      { key: 'has_solar', label: 'Zonnepanelen', sub: 'Op het dak', icon: '☀️' },
      { key: 'has_p1', label: 'Slimme meter (P1)', sub: 'HomeWizard, DSMR-reader', icon: '📡' },
    ]

    return (
      <div className="mx-auto max-w-lg">
        <ProgressBar step={1} total={totalSteps} />
        <StepTitle
          title="Wat heb je thuis?"
          sub="Selecteer alles wat van toepassing is. Meerdere keuzes mogelijk."
        />

        <div className="flex flex-col gap-3">
          {items.map(({ key, label, sub, icon }) => {
            const selected = form[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                  <p className="text-xs text-zinc-500">{sub}</p>
                </div>
                {selected && (
                  <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                has_battery: false,
                has_solar: false,
                has_p1: false,
              }))
            }
            className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all ${
              !form.has_battery && !form.has_solar && !form.has_p1
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700'
            }`}
          >
            <span className="text-2xl">🤔</span>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Ik denk erover na</p>
              <p className="text-xs text-zinc-500">Nog niets gekocht, wel benieuwd</p>
            </div>
          </button>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={next}
            className="w-full rounded-full bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Volgende
          </button>
        </div>
      </div>
    )
  }

  // Stap 2 — Contract
  if (step === 2) {
    return (
      <div className="mx-auto max-w-lg">
        <ProgressBar step={2} total={totalSteps} />
        <StepTitle
          title="Welk energiecontract heb je?"
          sub="Dit bepaalt hoe we de uurprijzen ophalen voor optimalisatie."
        />

        <div className="grid grid-cols-2 gap-3">
          {CONTRACTS.map(({ id, label, sub }) => {
            const selected = form.contract_type === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, contract_type: id }))}
                className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="flex-1 rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Terug
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!form.contract_type}
            className="flex-[2] rounded-full bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          >
            Volgende
          </button>
        </div>
      </div>
    )
  }

  // Stap 3 — Merk (alleen als has_battery)
  if (step === 3 && form.has_battery) {
    return (
      <div className="mx-auto max-w-lg">
        <ProgressBar step={3} total={totalSteps} />
        <StepTitle
          title="Welk batterijmerk heb je?"
          sub="We gebruiken dit om de juiste koppeling in te stellen."
        />

        <div className="grid grid-cols-2 gap-3">
          {BRANDS.map(({ id, label }) => {
            const selected = form.hardware_brand === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, hardware_brand: id }))}
                className={`rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="flex-1 rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Terug
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!form.hardware_brand}
            className="flex-[2] rounded-full bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          >
            Volgende
          </button>
        </div>
      </div>
    )
  }

  // Stap 4 — Woning
  if (step === 4) {
    const currentStep = form.has_battery ? 4 : 3
    const isValid = form.postcode.length >= 6

    return (
      <div className="mx-auto max-w-lg">
        <ProgressBar step={currentStep} total={totalSteps} />
        <StepTitle
          title="Jouw woning"
          sub="Nodig voor de zon-voorspelling en jouw verbruiksbaseline."
        />

        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Postcode
            </label>
            <input
              type="text"
              placeholder="1234 AB"
              value={form.postcode}
              maxLength={7}
              onChange={(e) =>
                setForm((f) => ({ ...f, postcode: e.target.value.toUpperCase() }))
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Aantal personen in huis
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, household_size: n }))}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 text-sm font-medium transition-all ${
                    form.household_size === n
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, household_size: 7 }))}
                className={`flex h-11 flex-1 items-center justify-center rounded-xl border-2 text-sm font-medium transition-all ${
                  form.household_size >= 7
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                7+
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="flex-1 rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Terug
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!isValid}
            className="flex-[2] rounded-full bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          >
            Volgende
          </button>
        </div>
      </div>
    )
  }

  // Stap 5 — Optimalisatie + Klaar
  if (step === 5) {
    return (
      <div className="mx-auto max-w-lg">
        <ProgressBar step={totalSteps} total={totalSteps} />
        <StepTitle
          title="Hoe wil je optimaliseren?"
          sub="Je kunt dit later altijd aanpassen in de instellingen."
        />

        <div className="flex flex-col gap-3">
          {OPTIMIZE.map(({ id, label, sub }) => {
            const selected = form.optimize_mode === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, optimize_mode: id }))}
                className={`rounded-xl border-2 px-5 py-4 text-left transition-all ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
                <p className="mt-1 text-xs text-zinc-500">{sub}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={back}
            className="flex-1 rounded-full border border-zinc-300 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Terug
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="flex-[2] rounded-full bg-emerald-500 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Opslaan…' : 'Naar mijn dashboard →'}
          </button>
        </div>
      </div>
    )
  }

  return null
}
