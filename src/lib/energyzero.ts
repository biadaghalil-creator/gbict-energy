import { type TibberPrice } from './tibber'

// EnergyZero publieke API — geen auth nodig, EPEX day-ahead prijzen NL incl. BTW
// Zelfde prijzen als Tibber, Frank, EnergyZero contracten

export async function fetchDayAheadPrices(date?: Date): Promise<TibberPrice[]> {
  const d = date ?? new Date()

  // Vandaag 00:00 t/m 23:59 UTC
  const from = new Date(d)
  from.setUTCHours(0, 0, 0, 0)
  const till = new Date(d)
  till.setUTCHours(23, 59, 59, 999)

  const params = new URLSearchParams({
    fromDate: from.toISOString(),
    tillDate: till.toISOString(),
    interval: '4',       // uurlijks
    usageType: '1',      // elektriciteit
    inclBtw: 'true',     // incl. BTW
  })

  try {
    const res = await fetch(
      `https://api.energyzero.nl/v1/energyprices?${params}`,
      {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
      }
    )

    if (!res.ok) return []

    const json = await res.json()
    const raw: { price: number; readingDate: string }[] = json?.Prices ?? []

    // Zet om naar hetzelfde formaat als Tibber
    return raw.map((item) => ({
      total: item.price,
      energy: item.price,
      tax: 0,
      startsAt: item.readingDate,
    }))
  } catch {
    return []
  }
}

export function currentHourPrice(prices: TibberPrice[]): TibberPrice | null {
  const now = new Date()
  const currentHour = now.getUTCHours()

  return (
    prices.find((p) => {
      const h = new Date(p.startsAt).getUTCHours()
      return h === currentHour
    }) ?? null
  )
}
