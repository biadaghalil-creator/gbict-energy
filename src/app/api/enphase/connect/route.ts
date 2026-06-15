import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enphaseAuthUrl } from '@/lib/enphase'

// Start de Enphase OAuth-consent flow: stuur de ingelogde gebruiker door naar
// Enphase om toegang tot zijn systeem goed te keuren.
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const origin = new URL(request.url).origin

  if (!user) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const redirectUri = `${origin}/api/enphase/callback`
  const authUrl = enphaseAuthUrl(redirectUri)
  if (!authUrl) {
    return NextResponse.redirect(`${origin}/dashboard/koppelingen?enphase=unavailable`)
  }
  return NextResponse.redirect(authUrl)
}
