import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = Math.min(parseInt(searchParams.get('days') ?? '30'), 90)

  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  const { data: logs } = await supabase
    .from('optimization_logs')
    .select('action, price_eur, kwh, savings_eur, created_at')
    .eq('user_id', user.id)
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: true })

  if (!logs) return NextResponse.json({ days: [], totals: { today: 0, month: 0, total: 0, actions: 0 } })

  // Groepeer per dag
  const byDay: Record<string, { savings: number; charge: number; discharge: number }> = {}

  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().split('T')[0]
    byDay[key] = { savings: 0, charge: 0, discharge: 0 }
  }

  for (const log of logs) {
    const key = log.created_at.split('T')[0]
    if (!byDay[key]) byDay[key] = { savings: 0, charge: 0, discharge: 0 }
    byDay[key].savings += log.savings_eur ?? 0
    if (log.action === 'charge')    byDay[key].charge++
    if (log.action === 'discharge') byDay[key].discharge++
  }

  const daysArray = Object.entries(byDay).map(([date, data]) => ({ date, ...data }))

  // Totalen
  const now = new Date()
  const startOfDay   = new Date(now); startOfDay.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const todayLogs = logs.filter(l => new Date(l.created_at) >= startOfDay)
  const monthLogs = logs.filter(l => new Date(l.created_at) >= startOfMonth)
  const sum = (arr: typeof logs) => arr.reduce((s, l) => s + (l.savings_eur ?? 0), 0)

  // Recente acties (laatste 10)
  const recent = [...logs].reverse().slice(0, 10).map(l => ({
    action: l.action,
    price_eur: l.price_eur,
    kwh: l.kwh,
    savings_eur: l.savings_eur,
    created_at: l.created_at,
  }))

  return NextResponse.json({
    days: daysArray,
    totals: {
      today:   sum(todayLogs),
      month:   sum(monthLogs),
      total:   sum(logs),
      actions: logs.length,
    },
    recent,
  })
}
