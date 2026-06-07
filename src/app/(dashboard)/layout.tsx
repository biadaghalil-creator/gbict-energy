import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasActiveSubscription } from '@/lib/plans'
import DashboardShell from './DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Payment first: no access to the app (incl. onboarding) without an active
  // or trialing subscription. New users are sent to the plan + card step.
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  if (!hasActiveSubscription(profile?.subscription_status)) redirect('/start')

  return (
    <DashboardShell userEmail={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
