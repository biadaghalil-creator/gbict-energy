import { createClient } from '@/lib/supabase/server'
import { signWidgetToken } from '@/lib/widget-token'
import { NextResponse } from 'next/server'

// Authenticated: returns the signed widget token + base URL for the current
// user. The iOS app calls this on load and stores it in the App Group so the
// home-screen widget can fetch /api/widget without a session.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  return NextResponse.json({
    token: signWidgetToken(user.id),
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://gbict-energy.com',
  })
}
