'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type SavingsData = {
  today_eur: number
  month_eur: number
  total_eur: number
  discharge_count: number
  charge_count: number
  logs_today: number
}

export default function SavingsCards() {
  const [data, setData] = useState<SavingsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/savings')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (n: number) =>
    n === 0 ? '€0,00' : `€${n.toFixed(2).replace('.', ',')}`

  return (
    <>
      {/* Vandaag bespaard */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
            <TrendingDown className="h-3.5 w-3.5" />
            Vandaag bespaard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="mt-1 h-8 w-24 bg-[var(--surface-2)]" />
          ) : (
            <>
              <p className={`text-2xl font-semibold tracking-tight ${(data?.today_eur ?? 0) > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
                {data ? fmt(data.today_eur) : '€ —'}
              </p>
              <p className="mt-1 text-xs text-[var(--text-faint)]">
                {data && data.logs_today > 0
                  ? `${data.discharge_count}× ontladen · ${data.charge_count}× geladen`
                  : 'Nog geen acties vandaag'}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Deze maand */}
      <Link href="/dashboard/besparingen" className="block">
        <Card className="h-full border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-emerald-800/50 hover:bg-[var(--surface)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
              <TrendingUp className="h-3.5 w-3.5" />
              Deze maand
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="mt-1 h-8 w-24 bg-[var(--surface-2)]" />
            ) : (
              <>
                <p className={`text-2xl font-semibold tracking-tight ${(data?.month_eur ?? 0) > 0 ? 'text-emerald-400' : 'text-[var(--text-faint)]'}`}>
                  {data ? fmt(data.month_eur) : '€ —'}
                </p>
                <p className="mt-1 text-xs text-[var(--text-faint)]">
                  {data && data.total_eur > 0
                    ? `Totaal ooit: ${fmt(data.total_eur)}`
                    : 'Koppel Sessy voor automatisch besparen'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </Link>
    </>
  )
}
