import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function generateCode(userId: string): string {
  const clean = userId.replace(/-/g, '')
  return clean.slice(0, 8).toUpperCase()
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const referralCode = generateCode(user.id)

  return NextResponse.json({
    referralCode,
    referrals: 0,
    creditsEur: 0,
  })
}
