import { createClient } from '@/lib/supabase/server'
import { fetchTibberPrices, type TibberPrice } from '@/lib/tibber'
import { fetchDayAheadPrices, currentHourPrice } from '@/lib/energyzero'
import { optimizeSchedule } from '@/lib/optimize'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json(null, { status: 401 })

  // Haal optimize_mode op uit profiel
  const { data: profile } = await supabase
    .from('profiles')
    .select('optimize_mode')
    .eq('id', user.id)
    .single()

  const mode = (profile?.optimize_mode as 'max_savings' | 'comfort' | 'eco') ?? 'max_savings'

  // Probeer eerst Tibber (als gekoppeld en abonnement actief)
  const { data: tibberDevice } = await supabase
    .from('devices')
    .select('config')
    .eq('user_id', user.id)
    .eq('type', 'meter_tibber')
    .eq('status', 'active')
    .maybeSingle()

  let todayPrices: TibberPrice[] = []
  let tomorrowPrices: TibberPrice[] = []
  let current: TibberPrice | null = null

  if (tibberDevice?.config?.token) {
    const tibberData = await fetchTibberPrices(tibberDevice.config.token)
    if (tibberData?.today?.length) {
      todayPrices = tibberData.today
      tomorrowPrices = tibberData.tomorrow ?? []
      current = tibberData.current
    }
  }

  // Fallback: EnergyZero EPEX day-ahead
  if (!todayPrices.length) {
    todayPrices = await fetchDayAheadPrices()
    current = currentHourPrice(todayPrices)

    // Morgen ophalen
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrowPrices = await fetchDayAheadPrices(tomorrow)
  }

  // Optimalisatie berekenen (vandaag + morgen)
  const optimization = optimizeSchedule(todayPrices, mode)
  const tomorrowOptimization = tomorrowPrices.length > 0
    ? optimizeSchedule(tomorrowPrices, mode)
    : null

  return NextResponse.json({
    current,
    today: todayPrices,
    tomorrow: tomorrowPrices,
    optimization,
    tomorrowOptimization,
  })
}
