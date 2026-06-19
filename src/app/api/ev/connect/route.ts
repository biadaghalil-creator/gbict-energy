import { NextResponse } from 'next/server'

/**
 * EV-partner koppeling — merk-onafhankelijk via een EV-aggregator
 * (bv. Enode / Jedlix / We Drive Solar). Eén OAuth-flow dekt veel automerken.
 *
 * Zodra de partner-credentials in de omgeving staan (EV_PARTNER_AUTH_URL +
 * EV_PARTNER_CLIENT_ID), stuurt deze route de gebruiker naar de OAuth-consent
 * van de partner. Tot die tijd valt 'ie terug op handmatig registreren, zodat
 * de app nooit stuk gaat en de klant z'n auto altijd kan toevoegen.
 *
 * De terugkoppeling (token opslaan) komt op /api/ev/callback zodra de partner
 * getekend is — die wordt pas gebouwd als het OAuth-contract bekend is.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const authUrl = process.env.EV_PARTNER_AUTH_URL
  const clientId = process.env.EV_PARTNER_CLIENT_ID

  // Nog geen partner-key → handmatig registreren.
  if (!authUrl || !clientId) {
    return NextResponse.redirect(`${origin}/dashboard/koppelingen?ev=manual`)
  }

  const url = new URL(authUrl)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `${origin}/api/ev/callback`)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', process.env.EV_PARTNER_SCOPE ?? 'read:vehicle control:charging')
  return NextResponse.redirect(url.toString())
}
