import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let email = '', password = ''
  try { ({ email, password } = await req.json()) } catch { /* ignore */ }
  if (!email || !password) return NextResponse.json({ error: 'Vul je e-mail en wachtwoord in.' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Wachtwoord moet minstens 6 tekens zijn.' }, { status: 400 })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gbict-energy.vercel.app'
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(), password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  // If email confirmation is required there is no active session yet.
  const needsConfirm = !data.session
  return NextResponse.json({ ok: true, needsConfirm })
}
