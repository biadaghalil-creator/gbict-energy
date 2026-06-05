'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Mail, Gift, Users, Euro } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ReferralClientProps {
  referralCode: string
  referrals: number
  creditsEur: number
}

const STEPS = [
  { icon: Share2, title: 'Deel je code', desc: 'Stuur je persoonlijke referral code naar vrienden', color: 'text-violet-400 bg-violet-500/10' },
  { icon: Users, title: 'Vriend meldt aan', desc: 'Ze registreren zich met jouw code', color: 'text-blue-400 bg-blue-400/10' },
  { icon: Euro, title: 'Jij krijgt €5', desc: 'Per vriend die zich aanmeldt, ontvang jij €5 credit', color: 'text-emerald-400 bg-emerald-400/10' },
]

export default function ReferralClient({
  referralCode,
  referrals,
  creditsEur,
}: ReferralClientProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = `https://gbict-energy.vercel.app/signup?ref=${referralCode}`
  const shareText = `Gebruik mijn code ${referralCode} voor 1 maand gratis Pro op GBICT Energy! ${shareUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const mailtoUrl = `mailto:?subject=${encodeURIComponent('1 maand gratis Pro op GBICT Energy')}&body=${encodeURIComponent(shareText)}`

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50" style={{ letterSpacing: '-0.02em' }}>
          Vrienden uitnodigen
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Nodig vrienden uit en verdien credits voor elk succesvolle aanmelding.
        </p>
      </div>

      {/* Referral code card */}
      <Card className="border-white/[0.06] bg-[#0D0E16]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Jouw referral code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-white/[0.04]/60 px-5 py-4 text-center font-mono text-3xl font-bold tracking-widest text-violet-400 ring-1 ring-slate-700">
              {referralCode}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-2 rounded-xl px-4 py-4 text-sm font-medium transition-all ${
                copied
                  ? 'bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/30'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              }`}
            >
              {copied
                ? <><Check className="h-4 w-4" /> Gekopieerd!</>
                : <><Copy className="h-4 w-4" /> Kopieer</>
              }
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-white/[0.06] bg-[#0D0E16]">
          <CardContent className="py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Verdiende credits</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${creditsEur > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
              €{creditsEur.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-[#0D0E16]">
          <CardContent className="py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Vrienden aangemeld</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${referrals > 0 ? 'text-slate-50' : 'text-slate-600'}`}>
              {referrals}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="border-white/[0.06] bg-[#0D0E16]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Hoe het werkt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex flex-col gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-white/5 ${step.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{step.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Share buttons */}
      <Card className="border-white/[0.06] bg-[#0D0E16]">
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Deel via
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
              className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
            >
              <Mail className="h-4 w-4" />
              E-mail
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Friends list placeholder */}
      {referrals === 0 && (
        <Card className="border-dashed border-white/[0.06] bg-slate-900/30">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Gift className="h-10 w-10 text-slate-700" />
            <p className="mt-2 text-sm text-slate-500">
              Nog niemand uitgenodigd. Deel je code om te beginnen!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
