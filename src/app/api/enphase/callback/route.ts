import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangeEnphaseCode, getEnphaseSystems } from '@/lib/enphase'

// Enphase stuurt de gebruiker hierheen terug met ?code=... na goedkeuring.
// We wisselen de code in voor tokens, halen het systeem op en slaan de
// koppeling op als device.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const koppelingen = `${origin}/app/index.html`   // terug naar de app i.p.v. oude web-dashboard

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(koppelingen)

  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  if (error || !code) {
    return NextResponse.redirect(`${koppelingen}?enphase=denied`)
  }

  const redirectUri = `${origin}/api/enphase/callback`
  const tokens = await exchangeEnphaseCode(code, redirectUri)
  if (!tokens) {
    return NextResponse.redirect(`${koppelingen}?enphase=error`)
  }

  // Haal het eerste systeem op voor een nette naam + system_id.
  const systems = await getEnphaseSystems(tokens.accessToken)
  const system = systems[0]
  const name = system ? `Enphase (${system.name})` : 'Enphase'

  const { error: dbError } = await supabase.from('devices').insert({
    user_id: user.id,
    type: 'battery_enphase',
    brand: 'Enphase',
    name,
    config: {
      refresh_token: tokens.refreshToken,
      access_token: tokens.accessToken,
      system_id: system?.systemId ?? '',
    },
    status: 'active',
  })

  if (dbError) {
    return NextResponse.redirect(`${koppelingen}?enphase=savefailed`)
  }

  return NextResponse.redirect(`${koppelingen}?enphase=connected`)
}
