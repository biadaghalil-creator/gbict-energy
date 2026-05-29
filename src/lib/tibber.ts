export type TibberPrice = {
  total: number
  energy: number
  tax: number
  startsAt: string // ISO timestamp
}

export type TibberPriceData = {
  current: TibberPrice | null
  today: TibberPrice[]
  tomorrow: TibberPrice[]
}

const TIBBER_GQL = `
{
  viewer {
    homes {
      currentSubscription {
        priceInfo {
          current {
            total
            energy
            tax
            startsAt
          }
          today {
            total
            energy
            tax
            startsAt
          }
          tomorrow {
            total
            energy
            tax
            startsAt
          }
        }
      }
    }
  }
}
`

export async function fetchTibberPrices(token: string): Promise<TibberPriceData | null> {
  try {
    const res = await fetch('https://api.tibber.com/v1-beta/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: TIBBER_GQL }),
      signal: AbortSignal.timeout(5000), // 5 seconden timeout
      cache: 'no-store',
    })

    if (!res.ok) return null

    const json = await res.json()
    console.log('[Tibber raw]', JSON.stringify(json?.data?.viewer?.homes?.[0]))
    const priceInfo = json.data?.viewer?.homes?.[0]?.currentSubscription?.priceInfo

    if (!priceInfo) return null

    return {
      current: priceInfo.current ?? null,
      today: priceInfo.today ?? [],
      tomorrow: priceInfo.tomorrow ?? [],
    }
  } catch {
    return null
  }
}

export function priceLevel(price: number, prices: TibberPrice[]): 'low' | 'normal' | 'high' {
  if (prices.length === 0) return 'normal'
  const totals = prices.map((p) => p.total)
  const min = Math.min(...totals)
  const max = Math.max(...totals)
  const range = max - min
  if (range === 0) return 'normal'
  const ratio = (price - min) / range
  if (ratio < 0.33) return 'low'
  if (ratio > 0.66) return 'high'
  return 'normal'
}
