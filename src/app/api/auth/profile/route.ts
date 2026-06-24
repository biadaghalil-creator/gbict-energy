import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Saves the profile from the static "Create your profile" page (public/auth/web-profile.html)
// and marks onboarding as completed, so /dashboard lets the user through to the dashboard design.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  let b: { postcode?: string; has_battery?: boolean; has_solar?: boolean; has_meter?: boolean } = {}
  try { b = await req.json() } catch { /* ignore */ }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    postcode: typeof b.postcode === 'string' && b.postcode ? b.postcode : null,
    has_battery: !!b.has_battery,
    has_solar: !!b.has_solar,
    has_p1: !!b.has_meter, // "Smart meter" chip → P1 meter
    onboarding_completed: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
