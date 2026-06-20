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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  if (!enodeConfigured()) {
    return NextResponse.redirect(`${origin}/dashboard/koppelingen?ev=manual`)
  }

  const linkUrl = await createEnodeLinkSession(user.id, `${origin}/api/ev/callback`)
  if (!linkUrl) return NextResponse.redirect(`${origin}/dashboard/koppelingen?ev=error`)
  return NextResponse.redirect(linkUrl)
}
