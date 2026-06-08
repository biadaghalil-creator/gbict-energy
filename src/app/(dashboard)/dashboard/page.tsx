import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('onboarding_completed').eq('id', user.id).single()
  if (!profile?.onboarding_completed) redirect('/onboarding')

  const { data: devices } = await supabase
    .from('devices').select('type').eq('user_id', user.id).eq('status', 'active')

  const hasTibber = devices?.some(d => d.type === 'meter_tibber') ?? false
  const hasSessy  = devices?.some(d => d.type === 'battery_sessy') ?? false
  const hasSolar  = devices?.some(
    d => d.type.startsWith('solar_') || d.type === 'battery_solaredge' || d.type === 'battery_enphase'
  ) ?? false

  return (
    <DashboardClient hasTibber={hasTibber} hasSessy={hasSessy} hasSolar={hasSolar} />
  )
}
