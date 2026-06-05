import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReferralClient from './ReferralClient'

function generateCode(userId: string): string {
  const clean = userId.replace(/-/g, '')
  return clean.slice(0, 8).toUpperCase()
}

export default async function ReferralPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const referralCode = generateCode(user.id)

  return (
    <ReferralClient
      referralCode={referralCode}
      referrals={0}
      creditsEur={0}
    />
  )
}
