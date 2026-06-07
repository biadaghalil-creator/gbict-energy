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
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-slate-50">
            Dashboardoverzicht
          </h1>
          <p className="mt-1 text-[13px] text-slate-600">
            Je thuisenergie in één oogopslag
          </p>
        </div>
        <a
          href="/dashboard/besparingen"
          className="flex items-center gap-1 text-[13px] font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          Meer bekijken →
        </a>
      </div>

      <DashboardClient hasTibber={hasTibber} hasSessy={hasSessy} hasSolar={hasSolar} />
    </div>
  )
}
