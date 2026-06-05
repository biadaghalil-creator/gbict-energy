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
    <Card className="border-white/[0.06] bg-[#0D0E16]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Sun className="h-3.5 w-3.5 text-amber-400" />
          Zonneopbrengst
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mt-1 h-8 w-24 bg-white/[0.04]" />
        ) : data ? (
          <>
            <p className="text-2xl font-semibold tracking-tight text-amber-400">
              {formatWatts(data.currentWatts)}
            </p>
            {data.todayKwh > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                vandaag {data.todayKwh.toFixed(2)} kWh
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold tracking-tight text-slate-600">— kW</p>
            <p className="mt-1 text-xs">
              <Link href="/dashboard/koppelingen" className="text-violet-400 hover:text-violet-400 hover:underline">
                Koppel zonnepanelen →
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
