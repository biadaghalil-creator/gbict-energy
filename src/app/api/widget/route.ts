import { createAdminClient } from '@/lib/supabase/admin'
import { verifyWidgetToken } from '@/lib/widget-token'
import { fetchDayAheadPrices, currentHourPrice } from '@/lib/energyzero'
import { NextRequest, NextResponse } from 'next/server'

// Public, token-authenticated summary for the iOS home-screen widget.
// GET /api/widget?token=<signed token>
// No session cookie — the token (HMAC of the user id) identifies the user.

const DEVICE_LABEL: Record<string, string> = {
  meter_tibber: 'Tibber',
  meter_p1: 'P1 meter',
  battery_sessy: 'Sessy',
  battery_victron: 'Victron',
  battery_enphase: 'Enphase',
  battery_solaredge: 'SolarEdge',
  solar_solaredge: 'SolarEdge',
  solar_enphase: 'Enphase',
  solar_sma: 'SMA',
  solar_fronius: 'Fronius',
  heatpump_tado: 'Tado',
  heatpump_generic: 'Heat pump',
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const userId = verifyWidgetToken(token)
  if (!userId) return NextResponse.json({ error: 'invalid token' }, { status: 401 })

  const supabase = createAdminClient()

  // Connected devices — prefer a battery as the headline device.
  const { data: devices } = await supabase
    .from('devices')
    .select('type, brand, name')
    .eq('user_id', userId)
    .eq('status', 'active')

  const list = devices ?? []
  const battery = list.find((d) => d.type.startsWith('battery_'))
  const headline = battery ?? list[0] ?? null
  const deviceName = headline
    ? (headline.name || headline.brand || DEVICE_LABEL[headline.type] || 'Device')
    : null

  // Savings (today / month / total) + today's charge/sell counts.
  const now = new Date()
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [{ data: today }, { data: month }, { data: total }] = await Promise.all([
    supabase.from('optimization_logs').select('savings_eur, action').eq('user_id', userId).gte('created_at', startOfDay.toISOString()),
    supabase.from('optimization_logs').select('savings_eur').eq('user_id', userId).gte('created_at', startOfMonth.toISOString()),
    supabase.from('optimization_logs').select('savings_eur').eq('user_id', userId),
  ])

  const sum = (rows: { savings_eur: number | null }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + (r.savings_eur ?? 0), 0)

  // Live spot price (EnergyZero, no auth) — best-effort.
  let spotPrice: number | null = null
  try {
    spotPrice = currentHourPrice(await fetchDayAheadPrices())?.total ?? null
  } catch { /* ignore */ }

  return NextResponse.json({
    device: deviceName ? { name: deviceName, type: headline!.type, connected: true } : null,
    deviceCount: list.length,
    today: {
      saved_eur: sum(today),
      charged: (today ?? []).filter((r) => r.action === 'charge').length,
      sold: (today ?? []).filter((r) => r.action === 'discharge').length,
    },
    month_eur: sum(month),
    total_eur: sum(total),
    spotPrice,
    updatedAt: now.toISOString(),
  })
}
