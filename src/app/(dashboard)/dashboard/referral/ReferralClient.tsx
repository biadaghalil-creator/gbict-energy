'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Mail, Gift, Users, Euro } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useT, fill } from '@/hooks/use-t'

interface ReferralClientProps {
  referralCode: string
  referrals: number
  creditsEur: number
}

const STEPS: {
  icon: typeof Share2
  titleKey: 'step1Title' | 'step2Title' | 'step3Title'
  descKey: 'step1Desc' | 'step2Desc' | 'step3Desc'
  color: string
}[] = [
  { icon: Share2, titleKey: 'step1Title', descKey: 'step1Desc', color: 'text-emerald-400 bg-emerald-500/10' },
  { icon: Users, titleKey: 'step2Title', descKey: 'step2Desc', color: 'text-emerald-300 bg-emerald-300/10' },
  { icon: Euro, titleKey: 'step3Title', descKey: 'step3Desc', color: 'text-emerald-400 bg-emerald-400/10' },
]

export default function ReferralClient({
  referralCode,
  referrals,
  creditsEur,
}: ReferralClientProps) {
  const { t } = useT()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = `https://gbict-energy.vercel.app/signup?ref=${referralCode}`
  const shareText = fill(t.dashboard.referral.shareText, { code: referralCode, url: shareUrl })
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(t.dashboard.referral.shareSubject)}&body=${encodeURIComponent(shareText)}`

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]" style={{ letterSpacing: '-0.02em' }}>
          {t.dashboard.referral.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {t.dashboard.referral.subtitle}
        </p>
      </div>

      {/* Referral code card */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            {t.dashboard.referral.yourCode}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-[var(--surface-2)]/60 px-5 py-4 text-center font-mono text-3xl font-bold tracking-widest text-emerald-400 ring-1 ring-[var(--border)]">
              {referralCode}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 rounded-xl px-4 py-4 text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {copied
                ? <><Check className="h-4 w-4" /> {t.dashboard.referral.copied}</>
                : <><Copy className="h-4 w-4" /> {t.dashboard.referral.copy}</>
              }
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">{t.dashboard.referral.earnedCredits}</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${creditsEur > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
              €{creditsEur.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--surface)]">
          <CardContent className="py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">{t.dashboard.referral.friendsSignedUp}</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${referrals > 0 ? 'text-[var(--text)]' : 'text-[var(--text-faint)]'}`}>
              {referrals}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            {t.dashboard.referral.howTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.titleKey} className="flex flex-col gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-white/5 ${step.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{t.dashboard.referral[step.titleKey]}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-faint)]">{t.dashboard.referral[step.descKey]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Share buttons */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            {t.dashboard.referral.shareVia}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={mailtoUrl}
              className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]"
            >
              <Mail className="h-4 w-4" />
              {t.dashboard.referral.email}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Friends list placeholder */}
      {referrals === 0 && (
        <Card className="border-dashed border-[var(--border)] bg-[var(--surface)]/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Gift className="h-10 w-10 text-[var(--text-faint)]" />
            <p className="mt-2 text-sm text-[var(--text-faint)]">
              {t.dashboard.referral.emptyState}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
