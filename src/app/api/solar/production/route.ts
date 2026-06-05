import { createClient } from '@/lib/supabase/server'
import { getSolarEdgeStatus } from '@/lib/solaredge'
import { getFroniusProduction } from '@/lib/fronius'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json(null, { status: 401 })

  // Find first active solar device
  const { data: devices } = await supabase
    .from('devices')
    .select('type, config')
    .eq('user_id', user.id)
    .in('type', [
      'solar_solaredge',
      'solar_enphase',
      'solar_sma',
      'solar_fronius',
      'battery_solaredge',
      'battery_enphase',
    ])
    .eq('status', 'active')
    .limit(1)

  const device = devices?.[0]
  if (!device) return NextResponse.json(null)

  try {
    if (
      device.type === 'solar_solaredge' ||
      device.type === 'battery_solaredge'
    ) {
      const status = await getSolarEdgeStatus(
        device.config.apiKey as string,
        device.config.siteId as string
      )
      if (!status) return NextResponse.json(null)
      return NextResponse.json({
        currentWatts: status.currentProduction,
        todayKwh: 0,
        source: 'SolarEdge',
      })
    }

    if (device.type === 'solar_fronius') {
      const prod = await getFroniusProduction(device.config.ip as string)
      if (!prod) return NextResponse.json(null)
      return NextResponse.json({ ...prod, source: 'Fronius' })
    }
  } catch {
    return NextResponse.json(null)
  }

  return NextResponse.json(null)
}
