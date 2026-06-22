import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Cookie-based login for the static auth pages (public/auth/*). The @supabase/ssr
// server client sets the session cookies on the response, so /dashboard recognises it.
export async function POST(req: Request) {
  let email = '', password = ''
  try { ({ email, password } = await req.json()) } catch { /* ignore */ }
  if (!email || !password) return NextResponse.json({ error: 'Vul je e-mail en wachtwoord in.' }, { status: 400 })
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
