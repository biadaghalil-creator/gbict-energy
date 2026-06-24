import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('onboarding_completed').eq('id', user.id).single()
  if (!profile?.onboarding_completed) redirect('/onboarding')

  // The web dashboard view = exactly the design provided by the user
  // (public/webapp/, GBICT-WEBAPP33) — not rebuilt. Access is already
  // restricted by (dashboard)/layout.tsx (allowed emails only).
  redirect('/webapp/index.html')
}
