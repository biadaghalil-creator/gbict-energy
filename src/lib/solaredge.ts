// SolarEdge Monitoring API — https://developers.solaredge.com
// Vereist: API key + Site ID (verkrijgbaar via monitoring.solaredge.com)

const SE_BASE = 'https://monitoringapi.solaredge.com'

export type SolarEdgeSiteInfo = {
  siteId: number
  name: string
  status: string
  peakPower: number
}

export type SolarEdgeBatteryStatus = {
  soc: number         // state of charge 0-100 %
  power: number       // W — positief = laden, negatief = ontladen
  state: string       // 'CHARGING' | 'DISCHARGING' | 'IDLE'
  currentProduction: number  // W actuele zonneopbrengst
}

export async function testSolarEdgeCredentials(
  apiKey: string,
  siteId: string
): Promise<{ ok: boolean; siteName?: string; error?: string }> {
  try {
    const res = await fetch(
      `${SE_BASE}/site/${siteId}/details?api_key=${encodeURIComponent(apiKey)}`,
      { signal: AbortSignal.timeout(8000) }
    )

    if (res.status === 403) {
      return { ok: false, error: 'Ongeldige API key. Activeer API toegang in je SolarEdge monitoring portal.' }
    }
    if (res.status === 404) {
      return { ok: false, error: 'Site ID niet gevonden. Controleer het nummer in je monitoring portal.' }
    }
    if (!res.ok) {
      return { ok: false, error: `SolarEdge API fout (${res.status}). Probeer opnieuw.` }
    }

    const data = await res.json()
    const name = data.details?.name ?? data.name ?? `Site ${siteId}`
    return { ok: true, siteName: name }
  } catch {
    return { ok: false, error: 'Kon SolarEdge niet bereiken. Controleer je internetverbinding.' }
  }
}

export async function getSolarEdgeStatus(
  apiKey: string,
  siteId: string
): Promise<SolarEdgeBatteryStatus | null> {
  try {
    // Overview endpoint — huidige productie
    const res = await fetch(
      `${SE_BASE}/site/${siteId}/overview?api_key=${encodeURIComponent(apiKey)}`,
      { signal: AbortSignal.timeout(8000), cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()

    const overview = data.overview ?? {}
    const currentPower = Number(overview.currentPower?.power ?? 0)

    // StorEdge battery data (apart endpoint)
    // Hier vereenvoudigd — volledige implementatie via storageData endpoint
    return {
      soc: 0,      // Vereist premium StorEdge API endpoint
      power: 0,
      state: 'IDLE',
      currentProduction: currentPower,
    }
  } catch {
    return null
  }
}

export function solarEdgeStateLabel(state: string): {
  label: string
  color: string
  dot: string
} {
  switch (state) {
    case 'CHARGING':
      return { label: 'Aan het laden', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' }
    case 'DISCHARGING':
      return { label: 'Aan het ontladen', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' }
    default:
      return { label: 'Standby', color: 'text-zinc-500', dot: 'bg-zinc-400' }
  }
}
