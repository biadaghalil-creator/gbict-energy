import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasActiveSubscription } from '@/lib/plans'
import StartClient from './StartClient'

// Plan + payment step. Requires login but NOT a subscription (this is where a
// new user starts the trial). Lives outside the (dashboard) group so the
// subscription gate there can safely redirect here without a loop.
export default async function StartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  // Already subscribed → no need to be here.
  if (hasActiveSubscription(profile?.subscription_status)) redirect('/dashboard')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      <div className="pointer-events-none absolute left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.22),transparent_70%)] blur-xl" />
      <div className="relative z-10 flex w-full justify-center">
        <StartClient />
      </div>
    </div>
  )
}
