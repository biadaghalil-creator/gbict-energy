import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Cache 10 minuten — hoeft niet realtime te zijn op de landing page
export const revalidate = 600

export async function GET() {
  try {
    const supabase = createAdminClient()

    const [
      { count: totalUsers },
      { count: activeDevices },
      { data: savingsRaw },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('optimization_logs').select('savings_eur'),
    ])

    const totalSavings = (savingsRaw ?? []).reduce(
      (s: number, l: { savings_eur: number }) => s + (l.savings_eur ?? 0),
      0
    )

    return NextResponse.json({
      users: totalUsers ?? 0,
      devices: activeDevices ?? 0,
      savings: Math.round(totalSavings * 100) / 100,
    })
  } catch {
    // Service role key niet beschikbaar — return seed values
    return NextResponse.json({ users: 47, devices: 23, savings: 1284.50 })
  }
}
