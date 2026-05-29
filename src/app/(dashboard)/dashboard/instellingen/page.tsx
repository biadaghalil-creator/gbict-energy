import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InstellingenClient from './InstellingenClient'

export default async function InstellingenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('optimize_mode, contract_type, postcode, household_size')
    .eq('id', user.id)
    .single()

  return (
    <InstellingenClient
      profile={{
        optimize_mode: profile?.optimize_mode ?? null,
        contract_type: profile?.contract_type ?? null,
        postcode: profile?.postcode ?? null,
        household_size: profile?.household_size ?? null,
      }}
      email={user.email ?? ''}
    />
  )
}
