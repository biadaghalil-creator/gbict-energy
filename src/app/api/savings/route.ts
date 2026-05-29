import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Vandaag
  const { data: today } = await supabase
    .from('optimization_logs')
    .select('savings_eur, action')
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString())

  // Deze maand
  const { data: month } = await supabase
    .from('optimization_logs')
    .select('savings_eur')
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  // Totaal
  const { data: total } = await supabase
    .from('optimization_logs')
    .select('savings_eur')
    .eq('user_id', user.id)

  const sum = (rows: { savings_eur: number | null }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + (r.savings_eur ?? 0), 0)

  // Acties vandaag
  const dischargeCount = (today ?? []).filter(r => r.action === 'discharge').length
  const chargeCount    = (today ?? []).filter(r => r.action === 'charge').length

  return NextResponse.json({
    today_eur:        sum(today),
    month_eur:        sum(month),
    total_eur:        sum(total),
    discharge_count:  dischargeCount,
    charge_count:     chargeCount,
    logs_today:       today?.length ?? 0,
  })
}
