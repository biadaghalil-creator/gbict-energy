import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VppClient from './VppClient'

export default async function VppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check of gebruiker al ingeschreven is
  const { data: profile } = await supabase
    .from('profiles')
    .select('vpp_enrolled, household_size, optimize_mode')
    .eq('id', user.id)
    .single()

  // Tel totaal ingeschreven gebruikers (voor social proof)
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('vpp_enrolled', true)

  return (
    <VppClient
      enrolled={profile?.vpp_enrolled ?? false}
      enrolledCount={(count ?? 0) + 47} // + seed voor social proof
      householdSize={profile?.household_size ?? 2}
    />
  )
}
