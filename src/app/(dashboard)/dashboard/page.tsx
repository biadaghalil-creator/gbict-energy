import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('onboarding_completed').eq('id', user.id).single()
  if (!profile?.onboarding_completed) redirect('/onboarding')

  // De webdashboard-weergave = exact het door de gebruiker aangeleverde design
  // (public/webapp/, GBICT-WEBAPP33) — niet nagebouwd. De toegang is al
  // afgeschermd door (dashboard)/layout.tsx (alleen toegestane e-mails).
  redirect('/webapp/index.html')
}
