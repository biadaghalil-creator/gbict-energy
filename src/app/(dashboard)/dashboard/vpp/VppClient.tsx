'use client'

import { useState, useTransition } from 'react'
import { enrollVpp, unenrollVpp } from './actions'

const YEARLY_ESTIMATE = { min: 280, max: 650 }

export default function VppClient({
  enrolled,
  enrolledCount,
  householdSize,
}: {
  enrolled: boolean
  enrolledCount: number
  householdSize: number
}) {
  const [isEnrolled, setIsEnrolled] = useState(enrolled)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      if (isEnrolled) {
        await unenrollVpp()
        setIsEnrolled(false)
      } else {
        await enrollVpp()
        setIsEnrolled(true)
      }
    })
  }

  // Schatting op basis van huishouden grootte
  const sizeMultiplier = Math.min(householdSize / 3, 1.5)
  const estMin = Math.round(YEARLY_ESTIMATE.min * sizeMultiplier)
  const estMax = Math.round(YEARLY_ESTIMATE.max * sizeMultiplier)

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Bèta — beperkt aantal plekken
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Virtueel Energienet
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Verdien extra geld door jouw batterij beschikbaar te stellen aan het energienet
          op momenten dat Nederland extra stroom nodig heeft — of juist te veel heeft.
          Volledig automatisch, volledig onder jouw controle.
        </p>
      </div>

      {/* Verdien kaart */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
        <p className="text-sm font-medium text-emerald-100">Jouw geschatte extra verdienste</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">
          €{estMin} – €{estMax}
        </p>
        <p className="mt-1 text-sm text-emerald-200">per jaar, bovenop je normale besparing</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-emerald-100">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Gebaseerd op EPEX FCR/aFRR marktprijzen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            5 kWh batterij aanname
          </span>
        </div>
      </div>

      {/* Hoe het werkt */}
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Hoe het Virtueel Energienet werkt
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: '📡',
              title: 'Netbeheerder vraagt balans',
              body: 'TenneT heeft te veel of te weinig stroom op het net. Ze sturen een signaal naar onze pool.',
            },
            {
              icon: '🧠',
              title: 'GBICT AI beslist',
              body: 'Onze algoritme checkt jouw SoC, jouw comfort-instellingen en jouw schema — en beslist of jij meedoet.',
            },
            {
              icon: '⚡',
              title: 'Batterij reageert in seconden',
              body: 'Jouw Sessy laadt of ontlaadt automatisch. Je merkt er niets van — behalve de uitbetaling.',
            },
            {
              icon: '💶',
              title: 'Maandelijkse uitbetaling',
              body: 'Inkomsten worden maandelijks bijgeschreven. Transparant per dag inzichtelijk in je dashboard.',
            },
          ].map((step) => (
            <div key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-lg dark:bg-zinc-800">
                {step.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{step.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garanties */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: '🔒', label: 'Batterij altijd jouw eigendom' },
          { icon: '⚙️', label: 'Zelf in/uitschakelen' },
          { icon: '📊', label: 'Volledige transparantie' },
        ].map((g) => (
          <div key={g.label} className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xl">{g.icon}</span>
            <p className="mt-1 text-xs text-zinc-500">{g.label}</p>
          </div>
        ))}
      </div>

      {/* Social proof */}
      <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-amber-400'].map((c, i) => (
              <div key={i} className={`h-6 w-6 rounded-full ${c} border-2 border-white dark:border-zinc-900`} />
            ))}
          </div>
          <p className="text-xs text-zinc-500">
            <strong className="text-zinc-900 dark:text-zinc-100">{enrolledCount} gebruikers</strong>{' '}
            hebben zich al aangemeld voor het VPP bèta-programma.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        {isEnrolled ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Je staat op de wachtlijst!
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">
                  We activeren jouw VPP deelname zodra we live gaan in jouw regio.
                </p>
              </div>
            </div>
            <button
              onClick={toggle}
              disabled={isPending}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Aanmelding intrekken
            </button>
          </div>
        ) : (
          <button
            onClick={toggle}
            disabled={isPending}
            className="w-full rounded-2xl bg-emerald-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            {isPending ? 'Aanmelden…' : '⚡ Meld je aan voor het VPP bèta-programma'}
          </button>
        )}
        <p className="mt-2 text-center text-xs text-zinc-400">
          Geen verplichtingen. Je kunt je op elk moment afmelden.
        </p>
      </div>
    </div>
  )
}
