import { type TibberPrice } from './tibber'

export type OptimizeMode = 'max_savings' | 'comfort' | 'eco'

export type ScheduleSlot = {
  hour: number        // 0-23
  startsAt: string    // ISO
  action: 'charge' | 'discharge' | 'idle'
  price: number
  reason: string
}

export type OptimizationResult = {
  schedule: ScheduleSlot[]
  estimatedSavings: number   // €
  chargeHours: number[]
  dischargeHours: number[]
}

/**
 * Regel-gebaseerde optimalisatie v1:
 * - Laad in de goedkoopste N uur
 * - Ontlaad in de duurste N uur
 * - De rest = idle
 *
 * Aanname: batterij 5 kWh bruikbaar vermogen
 */
export function optimizeSchedule(
  prices: TibberPrice[],
  mode: OptimizeMode = 'max_savings',
  batteryCapacityKwh = 5
): OptimizationResult {
  if (prices.length === 0) {
    return { schedule: [], estimatedSavings: 0, chargeHours: [], dischargeHours: [] }
  }

  // Hoeveel uur laden/ontladen per modus
  const slots = {
    max_savings: { charge: 4, discharge: 4 },
    comfort: { charge: 3, discharge: 3 },
    eco: { charge: 2, discharge: 2 },
  }[mode]

  const sorted = [...prices].sort((a, b) => a.total - b.total)
  const cheapest = sorted.slice(0, slots.charge).map((p) => new Date(p.startsAt).getHours())
  const mostExpensive = sorted.slice(-slots.discharge).map((p) => new Date(p.startsAt).getHours())

  const schedule: ScheduleSlot[] = prices.map((p) => {
    const hour = new Date(p.startsAt).getHours()
    if (cheapest.includes(hour)) {
      return {
        hour,
        startsAt: p.startsAt,
        action: 'charge',
        price: p.total,
        reason: 'Goedkoopste uur — batterij laden',
      }
    }
    if (mostExpensive.includes(hour)) {
      return {
        hour,
        startsAt: p.startsAt,
        action: 'discharge',
        price: p.total,
        reason: 'Duurste uur — batterij ontladen',
      }
    }
    return {
      hour,
      startsAt: p.startsAt,
      action: 'idle',
      price: p.total,
      reason: 'Geen actie',
    }
  })

  // Schatting besparing: (gemiddelde ontlaadprijs - gemiddelde laadprijs) * kWh
  const avgChargePrice =
    cheapest.reduce((sum, h) => {
      const p = prices.find((x) => new Date(x.startsAt).getHours() === h)
      return sum + (p?.total ?? 0)
    }, 0) / cheapest.length

  const avgDischargePrice =
    mostExpensive.reduce((sum, h) => {
      const p = prices.find((x) => new Date(x.startsAt).getHours() === h)
      return sum + (p?.total ?? 0)
    }, 0) / mostExpensive.length

  const estimatedSavings = Math.max(0, (avgDischargePrice - avgChargePrice) * batteryCapacityKwh)

  return {
    schedule,
    estimatedSavings,
    chargeHours: cheapest.sort((a, b) => a - b),
    dischargeHours: mostExpensive.sort((a, b) => a - b),
  }
}
