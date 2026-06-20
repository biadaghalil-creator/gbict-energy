// Victron VRM cloud API — https://vrmapi.victronenergy.com
// Documentatie: https://vrm-api-docs.victronenergy.com

const VRM_BASE = 'https://vrmapi.victronenergy.com/v2'

export type VictronAuth = {
  token: string
  idUser: number
}

export type VictronInstallation = {
  idSite: number
  name: string
  identifier?: string   // VRM portal-ID (GX-identifier) — nodig voor MQTT-control
}

export type VictronBatteryStatus = {
  soc: number          // state of charge 0-100 %
  power: number        // W — positief = laden, negatief = ontladen
  voltage: number      // V
  state: string        // 'CHARGING' | 'DISCHARGING' | 'IDLE'
}

export async function getVictronToken(
  email: string,
  password: string
): Promise<VictronAuth | null> {
  try {
    const res = await fetch(`${VRM_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.token || !data.idUser) return null
    return { token: data.token, idUser: Number(data.idUser) }
  } catch {
    return null
  }
}

export async function getVictronInstallations(
  token: string,
  idUser: number
): Promise<VictronInstallation[]> {
  try {
    const res = await fetch(`${VRM_BASE}/users/${idUser}/installations`, {
      headers: { 'X-Authorization': `Token ${token}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.records ?? []).map((r: Record<string, unknown>) => ({
      idSite: Number(r.idSite),
      name: String(r.name ?? `Site ${r.idSite}`),
      identifier: r.identifier ? String(r.identifier) : undefined,
    }))
  } catch {
    return []
  }
}

/** Zoek de VRM portal-ID (GX-identifier) van een installatie op via idSite. */
export async function getVictronPortalId(
  token: string,
  idUser: number,
  idSite: number
): Promise<string | null> {
  const installations = await getVictronInstallations(token, idUser)
  return installations.find(i => i.idSite === idSite)?.identifier ?? null
}

export async function getVictronBatteryStatus(
  token: string,
  idSite: number
): Promise<VictronBatteryStatus | null> {
  try {
    const res = await fetch(
      `${VRM_BASE}/installations/${idSite}/widgets/BatterySummary`,
      {
        headers: { 'X-Authorization': `Token ${token}` },
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    const data = await res.json()

    // VRM API response may vary — defensively extract what we can
    const rec = data.records ?? data.data ?? {}
    const soc = Number(rec.soc ?? rec.state_of_charge ?? 0)
    const power = Number(rec.totalPower ?? rec.power ?? 0)
    const voltage = Number(rec.voltage ?? 0)

    return {
      soc,
      power,
      voltage,
      state: power > 50 ? 'CHARGING' : power < -50 ? 'DISCHARGING' : 'IDLE',
    }
  } catch {
    return null
  }
}

export function victronStateLabel(state: string): {
  label: string
  color: string
  dot: string
} {
  switch (state) {
    case 'CHARGING':
      return { label: 'Aan het laden', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' }
    case 'DISCHARGING':
      return { label: 'Aan het ontladen', color: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' }
    case 'IDLE':
      return { label: 'Standby', color: 'text-zinc-500', dot: 'bg-zinc-400' }
    default:
      return { label: state, color: 'text-zinc-500', dot: 'bg-zinc-400' }
  }
}
