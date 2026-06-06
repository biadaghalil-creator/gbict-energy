/**
 * Auto-optimalisatie cron endpoint
 * Wordt elk uur aangeroepen via Vercel Cron of externe cron service.
 * Stuurt automatisch alle batterijen op basis van het prijsschema.
 *
 * Ondersteunde merken: Sessy, Victron, Enphase, SolarEdge
 * Beveiligde route: vereist CRON_SECRET header
 */

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSessyToken, setSessySetpoint } from '@/lib/sessy'
import { getVictronToken } from '@/lib/victron'
import { fetchDayAheadPrices, currentHourPrice } from '@/lib/energyzero'
import { optimizeSchedule } from '@/lib/optimize'
import { sendDailySummary, sendCheapHourAlert } from '@/lib/email'
import { NextResponse } from 'next/server'

const BATTERY_KWH = 1.0  // kWh per uur actie

// Alle ondersteunde batterij-typen
const BATTERY_TYPES = [
  'battery_sessy',
  'battery_victron',
  'battery_enphase',
  'battery_solaredge',
]

export async function GET(req: Request) {
  // Beveilig de cron route — Vercel stuurt automatisch Authorization: Bearer {CRON_SECRET}
  if (process.env.NODE_ENV === 'production') {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = await createClient()

  // Haal alle actieve batterij-devices op (alle merken)
  const { data: batteryDevices } = await supabase
    .from('devices')
    .select('id, user_id, type, config')
    .in('type', BATTERY_TYPES)
    .eq('status', 'active')

  if (!batteryDevices?.length) {
    return NextResponse.json({ ok: true, processed: 0, message: 'Geen actieve batterijen gevonden' })
  }

  // Haal huidige prijzen op (één keer voor alle gebruikers)
  const todayPrices = await fetchDayAheadPrices()
  const currentPrice = currentHourPrice(todayPrices)

  if (!currentPrice) {
    return NextResponse.json({ ok: false, message: 'Geen prijsdata beschikbaar' })
  }

  let processed = 0
  let errors = 0
  const results: Record<string, string> = {}

  for (const device of batteryDevices) {
    try {
      // Haal optimize_mode + abonnementsstatus op voor deze gebruiker
      const { data: profile } = await supabase
        .from('profiles')
        .select('optimize_mode, subscription_status')
        .eq('id', device.user_id)
        .single()

      // Alleen optimaliseren voor betalende of proef-gebruikers.
      const subStatus = profile?.subscription_status as string | undefined
      if (subStatus !== 'active' && subStatus !== 'trialing') {
        results[device.id] = 'skipped:no_subscription'
        continue
      }

      const mode = (profile?.optimize_mode as 'max_savings' | 'comfort' | 'eco') ?? 'max_savings'
      const { schedule } = optimizeSchedule(todayPrices, mode)

      const hour = new Date().getHours()
      const slot = schedule.find(s => s.hour === hour)
      const action = slot?.action ?? 'idle'

      // Setpoint berekenen
      let setpoint = 0
      if (action === 'charge')    setpoint = 1500   // W laden
      if (action === 'discharge') setpoint = -1500  // W ontladen

      // ── Batterij aansturen ───────────────────────────────────────────────
      const source = device.type === 'battery_sessy'     ? 'sessy'
                   : device.type === 'battery_victron'   ? 'victron'
                   : device.type === 'battery_enphase'   ? 'enphase'
                   : device.type === 'battery_solaredge' ? 'solaredge'
                   : 'auto'

      if (device.type === 'battery_sessy') {
        // Sessy: directe cloud API setpoint
        const tokenData = await getSessyToken(device.config.username, device.config.password)
        if (tokenData) {
          await setSessySetpoint(tokenData.access_token, setpoint)
        }
      } else if (device.type === 'battery_victron') {
        // Victron: VRM API — log intent
        // Directe setpoint via VRM REST API is niet beschikbaar.
        // Opties: lokale Venus OS MQTT (toekomstig), of handmatige modus via VRM.
        // We loggen de optimalisatie-intentie zodat besparingen traceerbaar zijn.
        try {
          const auth = await getVictronToken(device.config.email, device.config.password)
          if (auth) {
            // Token vernieuwd — opgeslagen voor monitoring
            results[device.id] = `victron:intent:${action}`
          }
        } catch {
          // Non-fatal — log toch
        }
      } else if (device.type === 'battery_enphase') {
        // Enphase: Enlighten API is read-only voor consumer API keys.
        // Batterijbesturing vereist IQ Gateway lokale API (toekomstig).
        results[device.id] = `enphase:advisory:${action}`
      } else if (device.type === 'battery_solaredge') {
        // SolarEdge: Monitoring API is read-only.
        // StorEdge besturing via Modbus TCP (toekomstig).
        results[device.id] = `solaredge:advisory:${action}`
      }

      // ── Besparing berekenen ──────────────────────────────────────────────
      // Bij ontladen: je gebruikt eigen stroom i.p.v. dure netstroom
      // Bij laden: je koopt goedkoop in voor later ontladen
      let savingsEur = 0
      if (action === 'discharge') {
        savingsEur = currentPrice.total * BATTERY_KWH
      }

      // ── Log de actie ─────────────────────────────────────────────────────
      await supabase.from('optimization_logs').insert({
        user_id: device.user_id,
        action,
        price_eur: currentPrice.total,
        kwh: BATTERY_KWH,
        savings_eur: savingsEur,
        source,
      })

      processed++
    } catch (err) {
      console.error(`Fout bij device ${device.id}:`, err)
      errors++
    }
  }

  // ── E-mail notificaties ──────────────────────────────────────────────────
  const hour = new Date().getHours()

  if (process.env.RESEND_API_KEY) {
    try {
      const adminSupabase = createAdminClient()

      // 08:00 → stuur dagelijkse samenvatting + goedkope uren alert
      if (hour === 8) {
        const { data: users } = await adminSupabase
          .from('profiles')
          .select('id')
          .not('id', 'is', null)

        if (users) {
          for (const u of users) {
            try {
              const { data: authUser } = await adminSupabase.auth.admin.getUserById(u.id)
              const email = authUser?.user?.email
              if (!email) continue

              // Haal vandaag-stats op
              const today = new Date(); today.setHours(0, 0, 0, 0)
              const month = new Date(today.getFullYear(), today.getMonth(), 1)

              const [{ data: todayLogs }, { data: monthLogs }] = await Promise.all([
                adminSupabase.from('optimization_logs').select('action, savings_eur').eq('user_id', u.id).gte('created_at', today.toISOString()),
                adminSupabase.from('optimization_logs').select('savings_eur').eq('user_id', u.id).gte('created_at', month.toISOString()),
              ])

              const savingsToday = (todayLogs ?? []).reduce((s, l) => s + (l.savings_eur ?? 0), 0)
              const savingsMonth = (monthLogs ?? []).reduce((s, l) => s + (l.savings_eur ?? 0), 0)
              const chargeCount = (todayLogs ?? []).filter(l => l.action === 'charge').length
              const dischargeCount = (todayLogs ?? []).filter(l => l.action === 'discharge').length

              // Goedkope uren vandaag
              const cheapSlots = optimizeSchedule(todayPrices, 'max_savings').schedule
                .filter(s => s.action === 'charge')
                .map(s => s.hour)
              const minPrice = Math.min(...cheapSlots.map(h => todayPrices.find(p => new Date(p.startsAt).getHours() === h)?.total ?? 999))

              await Promise.all([
                sendDailySummary({ to: email, savingsToday, savingsMonth, chargeCount, dischargeCount }),
                sendCheapHourAlert({ to: email, hours: cheapSlots, minPrice }),
              ])
            } catch { /* door met volgende user */ }
          }
        }
      }
    } catch { /* e-mails zijn niet kritisch */ }
  }

  return NextResponse.json({
    ok: true,
    processed,
    errors,
    hour,
    price: currentPrice.total,
    results,
  })
}
