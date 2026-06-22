'use client'

import { useState, useTransition } from 'react'
import { Zap, Shield, Settings, BarChart3, CheckCircle, Users } from 'lucide-react'
import { enrollVpp, unenrollVpp } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

const YEARLY_ESTIMATE = { min: 280, max: 650 }

const HOW_IT_WORKS: {
  icon: typeof Zap
  titleKey: 'how1Title' | 'how2Title' | 'how3Title' | 'how4Title'
  bodyKey: 'how1Body' | 'how2Body' | 'how3Body' | 'how4Body'
  iconClass: string
}[] = [
  { icon: Zap,       titleKey: 'how1Title', bodyKey: 'how1Body', iconClass: 'text-emerald-400 bg-emerald-500/10' },
  { icon: Settings,  titleKey: 'how2Title', bodyKey: 'how2Body', iconClass: 'text-emerald-400 bg-emerald-400/10' },
  { icon: Zap,       titleKey: 'how3Title', bodyKey: 'how3Body', iconClass: 'text-emerald-200 bg-emerald-200/10' },
  { icon: BarChart3, titleKey: 'how4Title', bodyKey: 'how4Body', iconClass: 'text-emerald-300 bg-emerald-300/10' },
]

const GUARANTEES: { icon: typeof Shield; labelKey: 'guarantee1' | 'guarantee2' | 'guarantee3' }[] = [
  { icon: Shield, labelKey: 'guarantee1' },
  { icon: Settings, labelKey: 'guarantee2' },
  { icon: BarChart3, labelKey: 'guarantee3' },
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
  const { t } = useT()
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
        <Badge className="mb-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 inline-block" />
          {t.dashboard.vpp.badge}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          {t.dashboard.vpp.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          {t.dashboard.vpp.subtitle}
        </p>
      </div>

      {/* Earning estimate card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-[var(--surface)] to-[var(--surface)] p-6 ring-1 ring-emerald-500/20">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5" />
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-emerald-500/5" />
        <p className="text-sm font-medium text-emerald-400/80">{t.dashboard.vpp.estimateLabel}</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-400">
          €{estMin} – €{estMax}
        </p>
        <p className="mt-1 text-sm text-emerald-400/60">{t.dashboard.vpp.estimatePerYear}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-faint)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
            {t.dashboard.vpp.estimateBasis1}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
            {t.dashboard.vpp.estimateBasis2}
          </span>
        </div>
      </div>

      {/* How it works */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-[var(--text)]">
            {t.dashboard.vpp.howTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {HOW_IT_WORKS.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.titleKey} className="flex gap-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.iconClass} ring-1 ring-white/5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{t.dashboard.vpp[step.titleKey]}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-faint)]">{t.dashboard.vpp[step.bodyKey]}</p>
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
            <Card key={g.labelKey} className="border-[var(--border)] bg-[var(--surface)] text-center">
              <CardContent className="flex flex-col items-center py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)]">
                  <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{t.dashboard.vpp[g.labelKey]}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Social proof */}
      <Card className="border-[var(--border)] bg-[var(--surface)]/40">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['bg-emerald-400', 'bg-emerald-500', 'bg-emerald-300', 'bg-emerald-600'].map((c, i) => (
                <div key={i} className={`h-6 w-6 rounded-full ${c} ring-2 ring-[var(--surface)]`} />
              ))}
            </div>
            <p className="text-xs text-[var(--text-faint)]">
              <strong className="text-[var(--text-muted)]">{fill(t.dashboard.vpp.socialProofUsers, { n: enrolledCount })}</strong>{' '}
              {t.dashboard.vpp.socialProof}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      {isEnrolled ? (
        <div className="space-y-3">
          <Card className="border-emerald-800/40 bg-emerald-950/20">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  {t.dashboard.vpp.enrolledTitle}
                </p>
                <p className="text-xs text-emerald-400">
                  {t.dashboard.vpp.enrolledDesc}
                </p>
              </div>
            </CardContent>
          </Card>
          <button
            onClick={toggle}
            disabled={isPending}
            className="text-xs text-[var(--text-faint)] transition-colors hover:text-[var(--text-muted)]"
          >
            {t.dashboard.vpp.withdraw}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            onClick={toggle}
            disabled={isPending}
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#2F5D3A] px-7 text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#24492D] disabled:opacity-50"
          >
            <Zap className="h-4 w-4" />
            {isPending ? t.dashboard.vpp.enrolling : t.dashboard.vpp.enroll}
          </button>
          <p className="text-center text-xs text-[var(--text-faint)]">
            {t.dashboard.vpp.noObligation}
          </p>
        </div>
      )}
    </div>
  )
}
