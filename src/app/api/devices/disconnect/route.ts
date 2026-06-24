import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Disconnects a device (removes the signed-in user's row).
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const id = body?.id
  if (!id) return NextResponse.json({ error: 'No id.' }, { status: 400 })

  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('user_id', user.id)
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Couldn\'t disconnect.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
