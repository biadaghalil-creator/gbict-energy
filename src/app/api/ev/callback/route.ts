import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Terugkeer-URL na het koppelen bij Enode. De voertuigen zijn nu gekoppeld aan
 * onze user-id bij Enode; de optimalisatie-cron haalt ze automatisch op en
 * stuurt het laden aan. We sturen de gebruiker terug naar de app.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/app/index.html?ev=connected`)
}
