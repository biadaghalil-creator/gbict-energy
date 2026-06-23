/**
 * Onze eigen AI-laag (fase 1: statistische modellen op onze eigen data).
 *  #1 Verbruiksvoorspelling — gemiddeld profiel per uur-van-de-dag → dag-kWh.
 *  #3 Opbrengstprognose morgen — spread tussen goedkoopste/duurste uren.
 *  #4 Anomalie-detectie — dagtotalen vergeleken met de eigen baseline.
 * Geeft eerlijke "learning"-staten tot er genoeg data is; wordt automatisch
 * scherper naarmate energy_readings vollopt. Later vervangbaar door een
 * getraind ML-model op dezelfde data.
 */
import { createClient } from '@/lib/supabase/server'
import { fetchDayAheadPrices } from '@/lib/energyzero'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Reading = { ts: string; consumption_w: number | null; production_w: number | null; soc: number | null }
type Anomaly = { kind: string; message: string; severity: 'info' | 'warn' }

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null, { status: 401 })

  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  const { data } = await supabase
    .from('energy_readings')
    .select('ts, consumption_w, production_w, soc')
    .eq('user_id', user.id)
    .gte('ts', since)
    .order('ts', { ascending: true })

  const rs = (data ?? []) as Reading[]
  const dataPoints = rs.length

  // ── #1 verbruiksvoorspelling: gemiddeld profiel per uur → verwachte dag-kWh ──
  const byHour = new Map<number, number[]>()
  const allCons: number[] = []
  for (const r of rs) {
    if (r.consumption_w == null) continue
    allCons.push(r.consumption_w)
    const h = new Date(r.ts).getHours()
    const arr = byHour.get(h) ?? []; arr.push(r.consumption_w); byHour.set(h, arr)
  }
  let consumptionKwh: number | null = null
  if (dataPoints >= 24 && byHour.size >= 12 && allCons.length) {
    const globalAvg = allCons.reduce((a, c) => a + c, 0) / allCons.length
    let sumW = 0
    for (let h = 0; h < 24; h++) {
      const arr = byHour.get(h)
      sumW += arr && arr.length ? arr.reduce((a, c) => a + c, 0) / arr.length : globalAvg
    }
    consumptionKwh = Math.round((sumW / 1000) * 10) / 10
  }

  // ── #3 opbrengstprognose morgen ──
  let tomorrow: { available: boolean; estSavingsEur: number | null; cheapWindow: string | null } =
    { available: false, estSavingsEur: null, cheapWindow: null }
  try {
    const t = new Date(); t.setDate(t.getDate() + 1)
    const prices = await fetchDayAheadPrices(t)
    if (prices && prices.length >= 6) {
      const vals = prices.map((p) => p.total)
      const sorted = [...vals].sort((a, b) => a - b)
      const cheap = sorted.slice(0, 3).reduce((a, c) => a + c, 0)
      const exp = sorted.slice(-3).reduce((a, c) => a + c, 0)
      const estSavings = Math.max(0, Math.round((exp - cheap) * 100) / 100) // ~3 kWh cyclus
      const pad = (h: number) => String(h % 24).padStart(2, '0') + ':00'
      let bestStart = 0, best = Infinity
      for (let i = 0; i + 4 <= vals.length; i++) { const s = vals.slice(i, i + 4).reduce((a, c) => a + c, 0); if (s < best) { best = s; bestStart = i } }
      const startH = new Date(prices[bestStart].startsAt).getHours()
      tomorrow = { available: true, estSavingsEur: estSavings, cheapWindow: `${pad(startH)}–${pad(startH + 4)}` }
    }
  } catch {}

  // ── #4 anomalie-detectie ──
  const anomalies: Anomaly[] = []
  const prodSum = new Map<string, number>()
  const prodCnt = new Map<string, number>()
  for (const r of rs) {
    if (r.production_w == null) continue
    const day = new Date(r.ts).toISOString().slice(0, 10)
    prodSum.set(day, (prodSum.get(day) ?? 0) + r.production_w)
    prodCnt.set(day, (prodCnt.get(day) ?? 0) + 1)
  }
  const days = [...prodSum.keys()].sort()
  if (days.length >= 4) {
    const avgW = (d: string) => prodSum.get(d)! / Math.max(1, prodCnt.get(d)!)
    const last = days[days.length - 1]
    const prior = days.slice(0, -1).map(avgW)
    const base = prior.reduce((a, c) => a + c, 0) / prior.length
    if (base > 50 && avgW(last) < base * 0.5) {
      anomalies.push({ kind: 'solar', message: `Zonopbrengst ligt ~${Math.round((1 - avgW(last) / base) * 100)}% onder normaal — mogelijk vervuilde panelen of een storing.`, severity: 'warn' })
    }
  }
  const recentSoc = rs.filter((r) => r.soc != null).slice(-12).map((r) => r.soc as number)
  if (recentSoc.length >= 12 && Math.max(...recentSoc) - Math.min(...recentSoc) < 1) {
    anomalies.push({ kind: 'battery', message: 'Batterij is al 12 uur niet geladen of ontladen — controleer de koppeling.', severity: 'info' })
  }

  return NextResponse.json({
    forecast: { consumptionKwh, dataPoints, learning: consumptionKwh == null },
    tomorrow,
    anomalies,
    dataPoints,
  })
}
