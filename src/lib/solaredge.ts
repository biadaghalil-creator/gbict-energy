// SolarEdge Monitoring API — https://developers.solaredge.com
// Required: API key + Site ID (available via monitoring.solaredge.com)

const SE_BASE = 'https://monitoringapi.solaredge.com'

export type SolarEdgeSiteInfo = {
  siteId: number
  name: string
  status: string
  peakPower: number
}

export type SolarEdgeBatteryStatus = {
  soc: number         // state of charge 0-100 %
  power: number       // W — positive = charging, negative = discharging
  state: string       // 'CHARGING' | 'DISCHARGING' | 'IDLE'
  currentProduction: number  // W current solar output
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
      return { ok: false, error: 'Invalid API key. Enable API access in your SolarEdge monitoring portal.' }
    }
    if (res.status === 404) {
      return { ok: false, error: 'Site ID not found. Check the number in your monitoring portal.' }
    }
    if (!res.ok) {
      return { ok: false, error: `SolarEdge API error (${res.status}). Please try again.` }
    }

    const data = await res.json()
    const name = data.details?.name ?? data.name ?? `Site ${siteId}`
    return { ok: true, siteName: name }
  } catch {
    return { ok: false, error: 'Couldn\'t reach SolarEdge. Check your internet connection.' }
  }
}

export async function getSolarEdgeStatus(
  apiKey: string,
  siteId: string
): Promise<SolarEdgeBatteryStatus | null> {
  try {
    // Overview endpoint — current production
    const res = await fetch(
      `${SE_BASE}/site/${siteId}/overview?api_key=${encodeURIComponent(apiKey)}`,
      { signal: AbortSignal.timeout(8000), cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()

    const overview = data.overview ?? {}
    const currentPower = Number(overview.currentPower?.power ?? 0)

    // StorEdge battery data (separate endpoint)
    // Simplified here — full implementation via the storageData endpoint
    return {
      soc: 0,      // Requires the premium StorEdge API endpoint
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
      return { label: 'Charging', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' }
    case 'DISCHARGING':
      return { label: 'Discharging', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' }
    default:
      return { label: 'Standby', color: 'text-zinc-500', dot: 'bg-zinc-400' }
  }
}
