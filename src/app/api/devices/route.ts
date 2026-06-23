import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Lijst van de gekoppelde apparaten van de ingelogde gebruiker.
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { data } = await supabase
    .from('devices')
    .select('id, type, brand, name, status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  return NextResponse.json(data ?? [])
}
