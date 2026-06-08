'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type SolarProduction = {
  currentWatts: number
  todayKwh: number
  source: string
}

function formatWatts(watts: number): string {
  if (watts >= 1000) return `${(watts / 1000).toFixed(2)} kW`
  return `${Math.round(watts)} W`
}

export default function SolarCard() {
  const [data, setData] = useState<SolarProduction | null | undefined>(undefined)

  useEffect(() => {
    fetch('/api/solar/production')
      .then(res => {
        if (!res.ok) return null
        return res.json() as Promise<SolarProduction | null>
      })
      .then(json => setData(json))
      .catch(() => setData(null))
  }, [])

  const isLoading = data === undefined

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
          <Sun className="h-3.5 w-3.5 text-amber-400" />
          Zonneopbrengst
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mt-1 h-8 w-24 bg-[var(--surface-2)]" />
        ) : data ? (
          <>
            <p className="text-2xl font-semibold tracking-tight text-amber-400">
              {formatWatts(data.currentWatts)}
            </p>
            {data.todayKwh > 0 && (
              <p className="mt-1 text-xs text-[var(--text-faint)]">
                vandaag {data.todayKwh.toFixed(2)} kWh
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight text-[var(--text-faint)]">— kW</p>
            <p className="mt-1 text-xs">
              <Link href="/dashboard/koppelingen" className="text-emerald-400 hover:text-emerald-400 hover:underline">
                Koppel zonnepanelen →
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
