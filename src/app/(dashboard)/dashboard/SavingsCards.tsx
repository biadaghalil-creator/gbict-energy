'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Vandaag bespaard</p>
        {loading ? (
          <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        ) : (
          <>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${(data?.today_eur ?? 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {data ? fmt(data.today_eur) : '€ —'}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {data && data.logs_today > 0
                ? `${data.discharge_count}× ontladen · ${data.charge_count}× geladen`
                : 'Nog geen acties vandaag'}
            </p>
          </>
        )}
      </div>

      {/* Deze maand */}
      <Link href="/dashboard/besparingen" className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-900">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Deze maand</p>
        {loading ? (
          <div className="mt-2 h-8 w-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        ) : (
          <>
            <p className={`mt-2 text-2xl font-semibold tracking-tight ${(data?.month_eur ?? 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {data ? fmt(data.month_eur) : '€ —'}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {data && data.total_eur > 0
                ? `Totaal ooit: ${fmt(data.total_eur)}`
                : 'Koppel Sessy voor automatisch besparen'}
            </p>
          </>
        )}
      </Link>
    </>
  )
}
