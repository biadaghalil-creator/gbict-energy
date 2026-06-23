/**
 * Telemetrie-snapshot cron — bouwt onze eigen dataset.
 * Draait elk uur: leest per klant de live meterstanden (Sessy/solar) + de prijs
 * van dat uur en schrijft één rij in energy_readings. Dit is de trainingsdata
 * voor onze eigen AI (verbruiksvoorspelling, opbrengstprognose, anomalie).
 *
 * Beveiligd: vereist CRON_SECRET (Vercel stuurt Authorization: Bearer ...).
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { getSessyToken, getSessyStatus } from '@/lib/sessy'
import { getSolarEdgeStatus } from '@/lib/solaredge'
import { getFroniusProduction } from '@/lib/fronius'
import { fetchDayAheadPrices, currentHourPrice } from '@/lib/energyzero'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Device = { user_id: string; type: string; config: Record<string, string> }

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createAdminClient()

  // Prijs van dit uur (markt) — voor iedereen gelijk.
  let price: number | null = null
  try {
    const prices = await fetchDayAheadPrices()
    price = currentHourPrice(prices)?.total ?? null
  } catch {}

  const { data: devices } = await supabase
    .from('devices')
    .select('user_id, type, config')
    .eq('status', 'active')

  // Groepeer per klant.
  const byUser = new Map<string, Device[]>()
  for (const d of (devices ?? []) as Device[]) {
    const list = byUser.get(d.user_id) ?? []
    list.push(d)
    byUser.set(d.user_id, list)
  }

  let written = 0
  for (const [userId, list] of byUser) {
    const reading: Record<string, unknown> = { user_id: userId, price_eur: price }
    try {
      const sessy = list.find((d) => d.type === 'battery_sessy')
      if (sessy?.config?.username && sessy?.config?.password) {
        const tok = await getSessyToken(sessy.config.username, sessy.config.password)
        const st = tok ? await getSessyStatus(tok.access_token) : null
        if (st) {
          const solarW = st.renewable_energy ?? 0
          const battW = st.power ?? 0
          const gridW = st.grid_power ?? 0
          reading.production_w = solarW
          reading.battery_w = battW
          reading.grid_w = gridW
          reading.soc = st.state_of_charge
          // Energiebalans: wat het huis verbruikt = zon − naar batterij + van net.
          reading.consumption_w = Math.max(0, solarW - battW + gridW)
          reading.source = 'sessy'
        }
      }

      if (reading.production_w === undefined) {
        const se = list.find((d) => d.type === 'solar_solaredge')
        const fr = list.find((d) => d.type === 'solar_fronius')
        if (se?.config?.apiKey && se?.config?.siteId) {
          const st = await getSolarEdgeStatus(se.config.apiKey, se.config.siteId)
          if (st) { reading.production_w = (st as { currentProduction?: number }).currentProduction ?? 0; reading.source = 'solaredge' }
        } else if (fr?.config?.ip) {
          const prod = await getFroniusProduction(fr.config.ip)
          if (prod) { reading.production_w = prod.currentWatts; reading.source = 'fronius' }
        }
      }
    } catch {
      // één klant die faalt mag de rest niet blokkeren
    }

    // Alleen schrijven als we iets zinnigs hebben (telemetrie of prijs).
    if (reading.source || price !== null) {
      const { error } = await supabase.from('energy_readings').insert(reading)
      if (!error) written++
    }
  }

  return NextResponse.json({ ok: true, users: byUser.size, written })
}
