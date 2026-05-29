// Enphase Enlighten cloud API v2 — https://developer.enphase.com
// Vereist: API key + System ID (verkrijgbaar via enlighten.enphaseenergy.com)

const ENPHASE_BASE = 'https://enlighten.enphaseenergy.com/api/v2'

export type EnphaseSystemInfo = {
  systemId: number
  name: string
  status: string
}

export type EnphaseBatteryStatus = {
  soc: number         // state of charge 0-100 %
  power: number       // W — positief = laden, negatief = ontladen
  state: string       // 'CHARGING' | 'DISCHARGING' | 'IDLE'
  energyToday: number // Wh geproduceerd vandaag
}

export async function testEnphaseCredentials(
  apiKey: string,
  systemId: string
): Promise<{ ok: boolean; systemName?: string; error?: string }> {
  try {
    // Probeer een systeem-info call te doen
    const res = await fetch(
      `${ENPHASE_BASE}/systems/${systemId}/summary?key=${encodeURIComponent(apiKey)}`,
      { signal: AbortSignal.timeout(8000) }
    )

    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: 'Ongeldige API key. Controleer je Enphase developer account.' }
    }
    if (res.status === 404) {
      return { ok: false, error: 'Systeem ID niet gevonden. Controleer het nummer in je Enlighten portal.' }
    }
    if (!res.ok) {
      return { ok: false, error: `Enphase API fout (${res.status}). Probeer opnieuw.` }
    }

    const data = await res.json()
    const name = data.system_name ?? data.name ?? `Systeem ${systemId}`
    return { ok: true, systemName: name }
  } catch {
    return { ok: false, error: 'Kon Enphase niet bereiken. Controleer je internetverbinding.' }
  }
}

export async function getEnphaseStatus(
  apiKey: string,
  systemId: string
): Promise<EnphaseBatteryStatus | null> {
  try {
    const res = await fetch(
      `${ENPHASE_BASE}/systems/${systemId}/summary?key=${encodeURIComponent(apiKey)}`,
      { signal: AbortSignal.timeout(8000), cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()

    // Enlighten API v2 — storage info
    const storage = data.storage ?? {}
    const soc = Number(storage.charge_status ?? 0) * 100
    const power = Number(storage.current_power_kw ?? 0) * 1000

    return {
      soc,
      power,
      state: power > 50 ? 'CHARGING' : power < -50 ? 'DISCHARGING' : 'IDLE',
      energyToday: Number(data.energy_today ?? 0),
    }
  } catch {
    return null
  }
}

export function enphaseStateLabel(state: string): {
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
