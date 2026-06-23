import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Terugkeer-URL na het koppelen bij Enode. De voertuigen zijn nu gekoppeld aan
 * onze user-id bij Enode; de optimalisatie-cron haalt ze automatisch op en
 * stuurt het laden aan. We zetten ook een device-rij zodat de auto in de
 * Connections-lijst verschijnt, en sturen de gebruiker terug naar de app.
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const app = `${origin}/app/index.html`
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: existing } = await supabase
        .from('devices')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'ev')
        .maybeSingle()
      if (!existing) {
        await supabase.from('devices').insert({
          user_id: user.id,
          type: 'ev',
          brand: 'Enode',
          name: 'Electric car',
          config: { enode: true },
          status: 'active',
        })
      }
    }
  } catch {
    // koppeling bij Enode is gelukt; alleen de lokale rij faalde — niet blokkeren
  }
  return NextResponse.redirect(`${app}?ev=connected`)
}
