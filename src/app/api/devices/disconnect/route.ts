import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Koppelt een apparaat los (verwijdert de rij van de ingelogde gebruiker).
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const id = body?.id
  if (!id) return NextResponse.json({ error: 'Geen id' }, { status: 400 })

  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('user_id', user.id)
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Loskoppelen mislukt' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
