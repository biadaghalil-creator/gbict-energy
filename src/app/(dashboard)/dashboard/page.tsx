import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient, { type DeviceSummary } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('onboarding_completed').eq('id', user.id).single()
  if (!profile?.onboarding_completed) redirect('/onboarding')

  const { data: rows } = await supabase
    .from('devices').select('type, name, brand, status, config').eq('user_id', user.id)

  // Bouw een VEILIGE samenvatting voor de client — nooit de ruwe config
  // (die bevat tokens/wachtwoorden). Alleen niet-gevoelige EV-velden meenemen.
  const devices: DeviceSummary[] = (rows ?? []).map((d) => {
    const cfg = (d.config ?? {}) as Record<string, string>
    const base: DeviceSummary = { type: d.type, name: d.name, brand: d.brand, status: d.status }
    if (d.type === 'ev_generic' || d.type === 'ev_v2g') {
      base.capacityKwh = cfg.capacity_kwh || undefined
      base.v2g = cfg.v2g === 'true' || d.type === 'ev_v2g'
      base.minChargePct = cfg.min_charge_pct || undefined
    }
    return base
  })

  const active = devices.filter(d => d.status === 'active')
  const hasTibber = active.some(d => d.type === 'meter_tibber')
  const hasSessy  = active.some(d => d.type === 'battery_sessy')
  const hasSolar  = active.some(
    d => d.type.startsWith('solar_') || d.type === 'battery_solaredge' || d.type === 'battery_enphase'
  )

  return (
    <DashboardClient hasTibber={hasTibber} hasSessy={hasSessy} hasSolar={hasSolar} devices={devices} />
  )
}
