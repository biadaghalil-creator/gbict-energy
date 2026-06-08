'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveOnboarding } from './actions'
import { Sun, BatteryCharging, Zap, Car, Gauge, CheckCircle2 } from 'lucide-react'
import { useT } from '@/hooks/use-t'

interface OnboardingWizardProps {
  userId: string
}

type SituationKey = 'zonnepanelen' | 'thuisbatterij' | 'dynamisch' | 'elektrischeAuto'

interface WizardState {
  situation: Set<SituationKey>
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < step
              ? 'w-6 bg-emerald-500'
              : 'w-2 bg-[var(--surface-2)]'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingWizard({ userId: _userId }: OnboardingWizardProps) {
  const { t } = useT()
  const [step, setStep] = useState(1)
  const [state, setState] = useState<WizardState>({ situation: new Set() })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const totalSteps = 4

  function toggleSituation(key: SituationKey) {
    setState((s) => {
      const next = new Set(s.situation)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return { ...s, situation: next }
    })
  }

  async function handleFinish() {
    setLoading(true)
    // Build minimal onboarding data from wizard state
    await saveOnboarding({
      has_battery: state.situation.has('thuisbatterij'),
      has_solar: state.situation.has('zonnepanelen'),
      has_p1: false,
      contract_type: state.situation.has('dynamisch') ? 'dynamisch' : 'onbekend',
      hardware_brand: '',
      postcode: '',
      household_size: 2,
      optimize_mode: 'max_savings',
    })
  }

  const situationItems: { key: SituationKey; icon: React.ElementType; label: string }[] = [
    { key: 'zonnepanelen', icon: Sun, label: t.dashboard.onboarding.optSolar },
    { key: 'thuisbatterij', icon: BatteryCharging, label: t.dashboard.onboarding.optBattery },
    { key: 'dynamisch', icon: Zap, label: t.dashboard.onboarding.optDynamic },
    { key: 'elektrischeAuto', icon: Car, label: t.dashboard.onboarding.optEv },
  ]

  const deviceCards: { icon: React.ElementType; name: string; desc: string }[] = [
    {
      icon: BatteryCharging,
      name: t.dashboard.onboarding.deviceBatteryName,
      desc: t.dashboard.onboarding.deviceBatteryDesc,
    },
    {
      icon: Sun,
      name: t.dashboard.onboarding.deviceSolarName,
      desc: t.dashboard.onboarding.deviceSolarDesc,
    },
    {
      icon: Gauge,
      name: t.dashboard.onboarding.deviceMeterName,
      desc: t.dashboard.onboarding.deviceMeterDesc,
    },
  ]

  // Step 1 — Welkom
  if (step === 1) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
          <Zap className="h-9 w-9 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t.dashboard.onboarding.welcomeTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-[var(--text-faint)]">
          {t.dashboard.onboarding.welcomeDesc}
        </p>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="mt-10 rounded-full bg-[#047857] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-[#059669] hover:shadow-emerald-500/40"
        >
          {t.dashboard.onboarding.getStarted}
        </button>
        <div className="mt-12">
          <ProgressDots step={1} total={totalSteps} />
        </div>
      </div>
    )
  }

  // Step 2 — Situatie
  if (step === 2) {
    return (
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            {t.dashboard.onboarding.situationTitle}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-faint)]">
            {t.dashboard.onboarding.situationDesc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {situationItems.map(({ key, icon: Icon, label }) => {
            const selected = state.situation.has(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleSituation(key)}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                  selected
                    ? 'border-emerald-500 bg-emerald-500/[0.08]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/30'
                }`}
              >
                <Icon className={`h-7 w-7 ${selected ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`} />
                <span className={`text-sm font-medium ${selected ? 'text-emerald-300' : 'text-[var(--text-muted)]'}`}>
                  {label}
                </span>
                {selected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full rounded-full bg-[#047857] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#059669]"
          >
            {t.dashboard.onboarding.next}
          </button>
        </div>

        <div className="mt-8">
          <ProgressDots step={2} total={totalSteps} />
        </div>
      </div>
    )
  }

  // Step 3 — Eerste koppeling
  if (step === 3) {
    return (
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            {t.dashboard.onboarding.connectTitle}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-faint)]">
            {t.dashboard.onboarding.connectDesc}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {deviceCards.map((card) => {
            const Icon = card.icon
            return (
            <a
              key={card.name}
              href="/dashboard/koppelingen"
              className="flex items-center gap-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition-all hover:border-emerald-500 hover:bg-emerald-500/[0.06]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                <Icon className="h-6 w-6 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{card.name}</p>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">{card.desc}</p>
              </div>
              <svg className="ml-auto h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12l4-4-4-4" />
              </svg>
            </a>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-faint)]"
          >
            {t.dashboard.onboarding.doLater}
          </button>
        </div>

        <div className="mt-8">
          <ProgressDots step={3} total={totalSteps} />
        </div>
      </div>
    )
  }

  // Step 4 — Klaar!
  if (step === 4) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="mb-8 h-16 w-16 text-emerald-500" />
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {t.dashboard.onboarding.doneTitle}
        </h2>
        <p className="mt-3 text-base text-[var(--text-faint)]">
          {t.dashboard.onboarding.doneDesc}
        </p>

        <ul className="mx-auto mt-8 w-full max-w-xs space-y-3 text-left">
          {[
            t.dashboard.onboarding.benefit1,
            t.dashboard.onboarding.benefit2,
            t.dashboard.onboarding.benefit3,
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l3.5 3.5L12 3" />
                </svg>
              </div>
              <span className="text-sm text-[var(--text-muted)]">{item}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleFinish}
          disabled={loading}
          className="mt-10 rounded-full bg-[#047857] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-[#059669] disabled:opacity-60"
        >
          {loading ? t.dashboard.onboarding.saving : t.dashboard.onboarding.toDashboard}
        </button>

        <div className="mt-12">
          <ProgressDots step={4} total={totalSteps} />
        </div>
      </div>
    )
  }

  return null
}
