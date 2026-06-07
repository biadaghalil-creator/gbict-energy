'use client'

import { useState, useTransition } from 'react'
import { Zap, Shield, Settings, BarChart3, CheckCircle, Users } from 'lucide-react'
import { enrollVpp, unenrollVpp } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const YEARLY_ESTIMATE = { min: 280, max: 650 }

const HOW_IT_WORKS = [
  {
    icon: Zap,
    title: 'Netbeheerder vraagt balans',
    body: 'TenneT heeft te veel of te weinig stroom op het net. Ze sturen een signaal naar onze pool.',
    iconClass: 'text-violet-400 bg-violet-500/10',
  },
  {
    icon: Settings,
    title: 'GBICT AI beslist',
    body: 'Onze algoritme checkt jouw SoC, comfort-instellingen en schema — en beslist of jij meedoet.',
    iconClass: 'text-violet-400 bg-violet-400/10',
  },
  {
    icon: Zap,
    title: 'Batterij reageert in seconden',
    body: 'Jouw Sessy laadt of ontlaadt automatisch. Je merkt er niets van — behalve de uitbetaling.',
    iconClass: 'text-violet-200 bg-violet-200/10',
  },
  {
    icon: BarChart3,
    title: 'Maandelijkse uitbetaling',
    body: 'Inkomsten worden maandelijks bijgeschreven. Transparant per dag inzichtelijk in je dashboard.',
    iconClass: 'text-violet-300 bg-violet-300/10',
  },
]

const GUARANTEES = [
  { icon: Shield, label: 'Batterij altijd jouw eigendom' },
  { icon: Settings, label: 'Zelf in/uitschakelen' },
  { icon: BarChart3, label: 'Volledige transparantie' },
]

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

  const sizeMultiplier = Math.min(householdSize / 3, 1.5)
  const estMin = Math.round(YEARLY_ESTIMATE.min * sizeMultiplier)
  const estMax = Math.round(YEARLY_ESTIMATE.max * sizeMultiplier)

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Badge className="mb-3 border-violet-500/30 bg-violet-500/10 text-violet-400">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 inline-block" />
          Bèta — beperkt aantal plekken
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50" style={{ letterSpacing: '-0.02em' }}>
          Virtueel Energienet
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Verdien extra geld door jouw batterij beschikbaar te stellen aan het energienet
          op momenten dat Nederland extra stroom nodig heeft. Volledig automatisch, volledig onder jouw controle.
        </p>
      </div>

      {/* Earning estimate card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 p-6 ring-1 ring-violet-500/20">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/5" />
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-violet-500/5" />
        <p className="text-sm font-medium text-violet-200/70">Jouw geschatte extra verdienste</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-violet-400">
          €{estMin} – €{estMax}
        </p>
        <p className="mt-1 text-sm text-violet-400/60">per jaar, bovenop je normale besparing</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
            Gebaseerd op EPEX FCR/aFRR marktprijzen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400/60" />
            5 kWh batterij aanname
          </span>
        </div>
      </div>

      {/* How it works */}
      <Card className="border-white/[0.06] bg-[#0D0E16]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-200">
            Hoe het Virtueel Energienet werkt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="flex gap-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.iconClass} ring-1 ring-white/5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{step.body}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Guarantees */}
      <div className="grid grid-cols-3 gap-3">
        {GUARANTEES.map((g) => {
          const Icon = g.icon
          return (
            <Card key={g.label} className="border-white/[0.06] bg-[#0D0E16] text-center">
              <CardContent className="flex flex-col items-center py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-2 text-xs text-slate-400">{g.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Social proof */}
      <Card className="border-white/[0.06] bg-slate-900/40">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['bg-violet-400', 'bg-violet-500', 'bg-violet-300', 'bg-violet-600'].map((c, i) => (
                <div key={i} className={`h-6 w-6 rounded-full ${c} ring-2 ring-slate-900`} />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              <strong className="text-slate-300">{enrolledCount} gebruikers</strong>{' '}
              hebben zich al aangemeld voor het VPP bèta-programma.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      {isEnrolled ? (
        <div className="space-y-3">
          <Card className="border-violet-800/40 bg-violet-950/20">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-300">
                  Je staat op de wachtlijst!
                </p>
                <p className="text-xs text-violet-400">
                  We activeren jouw VPP deelname zodra we live gaan in jouw regio.
                </p>
              </div>
            </CardContent>
          </Card>
          <button
            onClick={toggle}
            disabled={isPending}
            className="text-xs text-slate-600 transition-colors hover:text-slate-400"
          >
            Aanmelding intrekken
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={toggle}
            disabled={isPending}
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#5B21B6] px-7 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#6D28D9] disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            {isPending ? 'Aanmelden…' : 'Meld je aan voor het VPP bèta-programma'}
          </button>
          <p className="text-center text-xs text-slate-600">
            Geen verplichtingen. Je kunt je op elk moment afmelden.
          </p>
        </div>
      )}
    </div>
  )
}
