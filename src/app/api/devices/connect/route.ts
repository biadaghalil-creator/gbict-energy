import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSessyToken } from '@/lib/sessy'
import { fetchTibberPrices } from '@/lib/tibber'
import { getSolarEdgeStatus } from '@/lib/solaredge'

export const runtime = 'nodejs'

// Apparaten die via credentials/token gekoppeld worden (geen OAuth).
// OAuth-merken (Enphase, EV via Enode) lopen via hun eigen /connect-redirect.
const BRANDS: Record<
  string,
  { brand: string; name: string; fields: string[] }
> = {
  battery_sessy: { brand: 'Sessy', name: 'Sessy battery', fields: ['username', 'password'] },
  battery_victron: { brand: 'Victron', name: 'Victron', fields: ['username', 'password'] },
  meter_tibber: { brand: 'Tibber', name: 'Tibber', fields: ['token'] },
  solar_solaredge: { brand: 'SolarEdge', name: 'SolarEdge', fields: ['apiKey', 'siteId'] },
  solar_fronius: { brand: 'Fronius', name: 'Fronius', fields: ['ip'] },
  meter_homewizard: { brand: 'HomeWizard', name: 'HomeWizard P1', fields: ['host'] },
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const type: string = body?.type
  const config: Record<string, string> = body?.config || {}
  const meta = BRANDS[type]
  if (!meta) return NextResponse.json({ error: 'Onbekend apparaat' }, { status: 400 })

  for (const f of meta.fields) {
    if (!config[f] || !String(config[f]).trim()) {
      return NextResponse.json({ error: `Vul "${f}" in` }, { status: 400 })
    }
  }

  // Echte verificatie waar het kan (cloud-API's); lokale apparaten kunnen we
  // vanaf de server niet bereiken, die slaan we op zonder live-check.
  try {
    if (type === 'battery_sessy') {
      const tok = await getSessyToken(config.username, config.password)
      if (!tok) return NextResponse.json({ error: 'Inloggen bij Sessy mislukt — controleer e-mail en wachtwoord' }, { status: 400 })
    } else if (type === 'meter_tibber') {
      const data = await fetchTibberPrices(config.token)
      if (!data) return NextResponse.json({ error: 'Tibber-token werkt niet — controleer je token' }, { status: 400 })
    } else if (type === 'solar_solaredge') {
      const st = await getSolarEdgeStatus(config.apiKey, config.siteId)
      if (!st) return NextResponse.json({ error: 'SolarEdge-gegevens kloppen niet — controleer API-key en Site ID' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Kon de koppeling niet verifiëren — probeer het opnieuw' }, { status: 400 })
  }

  // Eén actief apparaat per type: bestaande vervangen.
  await supabase.from('devices').delete().eq('user_id', user.id).eq('type', type)
  const { error } = await supabase.from('devices').insert({
    user_id: user.id,
    type,
    brand: meta.brand,
    name: meta.name,
    config,
    status: 'active',
  })
  if (error) return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
