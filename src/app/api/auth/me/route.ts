import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const ALLOWED_EMAILS = ['ghalil@gbict.nl']

// Lightweight session check for the static dashboard page (public/webapp/).
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const email = (user?.email ?? '').toLowerCase()
  const res = NextResponse.json({
    authed: !!user,
    allowed: !!user && ALLOWED_EMAILS.includes(email),
  })
  res.headers.set('Cache-Control', 'no-store')
  return res
}
