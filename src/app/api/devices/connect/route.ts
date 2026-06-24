import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getSessyToken } from '@/lib/sessy'
import { fetchTibberPrices } from '@/lib/tibber'
import { getSolarEdgeStatus } from '@/lib/solaredge'

export const runtime = 'nodejs'

// Devices that connect via credentials/token (not OAuth).
// OAuth brands (Enphase, EV via Enode) go through their own /connect redirect.
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
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const type: string = body?.type
  const config: Record<string, string> = body?.config || {}
  const meta = BRANDS[type]
  if (!meta) return NextResponse.json({ error: 'Unknown device.' }, { status: 400 })

  for (const f of meta.fields) {
    if (!config[f] || !String(config[f]).trim()) {
      return NextResponse.json({ error: `Please fill in "${f}".` }, { status: 400 })
    }
  }

  // Real verification where possible (cloud APIs); local devices can't be
  // reached from the server, so we save those without a live check.
  try {
    if (type === 'battery_sessy') {
      const tok = await getSessyToken(config.username, config.password)
      if (!tok) return NextResponse.json({ error: 'Couldn\'t sign in to Sessy — check your email and password.' }, { status: 400 })
    } else if (type === 'meter_tibber') {
      const data = await fetchTibberPrices(config.token)
      if (!data) return NextResponse.json({ error: 'That Tibber token doesn\'t work — check your token.' }, { status: 400 })
    } else if (type === 'solar_solaredge') {
      const st = await getSolarEdgeStatus(config.apiKey, config.siteId)
      if (!st) return NextResponse.json({ error: 'SolarEdge details don\'t match — check your API key and Site ID.' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Couldn\'t verify the connection — please try again.' }, { status: 400 })
  }

  // One active device per type: replace the existing one.
  await supabase.from('devices').delete().eq('user_id', user.id).eq('type', type)
  const { error } = await supabase.from('devices').insert({
    user_id: user.id,
    type,
    brand: meta.brand,
    name: meta.name,
    config,
    status: 'active',
  })
  if (error) return NextResponse.json({ error: 'Couldn\'t save.' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
