import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InstellingenClient from './InstellingenClient'
import SubscriptionCard from './SubscriptionCard'

export default async function InstellingenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('optimize_mode, contract_type, postcode, household_size, subscription_status, plan, current_period_end, trial_ends_at')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <SubscriptionCard
        status={profile?.subscription_status ?? null}
        plan={profile?.plan ?? null}
        currentPeriodEnd={profile?.current_period_end ?? null}
        trialEndsAt={profile?.trial_ends_at ?? null}
      />
      <InstellingenClient
        profile={{
          optimize_mode: profile?.optimize_mode ?? null,
          contract_type: profile?.contract_type ?? null,
          postcode: profile?.postcode ?? null,
          household_size: profile?.household_size ?? null,
        }}
        email={user.email ?? ''}
      />
    </div>
  )
}
