import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enodeConfigured, createEnodeLinkSession } from '@/lib/enode'

export const runtime = 'nodejs'

/**
 * EV-koppeling via Enode — merk-onafhankelijk (Tesla/Renault/Kia/Hyundai/VW/…).
 * Start een Enode Link-sessie voor de ingelogde gebruiker en stuurt 'm door
 * naar de koppelpagina van zijn automerk. Zonder Enode-credentials valt 'ie
 * terug op handmatig registreren — niks gaat stuk.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin

  const app = `${origin}/app/index.html`

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(app)

  if (!enodeConfigured()) {
    return NextResponse.redirect(`${app}?ev=unavailable`)
  }

  const linkUrl = await createEnodeLinkSession(user.id, `${origin}/api/ev/callback`)
  if (!linkUrl) return NextResponse.redirect(`${app}?ev=error`)
  return NextResponse.redirect(linkUrl)
}
