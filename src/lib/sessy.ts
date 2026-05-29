// Sessy cloud API — https://api.sessy.nl
// Documentatie: https://docs.sessy.nl

const SESSY_BASE = 'https://api.sessy.nl/v1'

export type SessyToken = {
  access_token: string
  token_type: string
  expires_in: number
}

export type SessyStatus = {
  state_of_charge: number        // 0-100 %
  power: number                  // W — positief = laden, negatief = ontladen
  system_state: string           // 'IDLE' | 'CHARGING' | 'DISCHARGING' | 'ERROR'
  renewable_energy: number       // W van zonnepanelen
  grid_power: number             // W van/naar net
}

export type SessySystemInfo = {
  serial: string
  firmware: string
}

export async function getSessyToken(
  username: string,
  password: string
): Promise<SessyToken | null> {
  try {
    const res = await fetch(`${SESSY_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        username,
        password,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function getSessyStatus(
  accessToken: string
): Promise<SessyStatus | null> {
  try {
    const res = await fetch(`${SESSY_BASE}/power/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()

    return {
      state_of_charge: data.state_of_charge ?? 0,
      power: data.power ?? 0,
      system_state: data.system_state ?? 'IDLE',
      renewable_energy: data.renewable_energy ?? 0,
      grid_power: data.grid_power ?? 0,
    }
  } catch {
    return null
  }
}

export async function setSessySetpoint(
  accessToken: string,
  wattsSetpoint: number  // positief = laden, negatief = ontladen, 0 = idle
): Promise<boolean> {
  try {
    const res = await fetch(`${SESSY_BASE}/power/setpoint`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ setpoint: wattsSetpoint }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

export function sessyStateLabel(state: string): {
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
    case 'ERROR':
      return { label: 'Fout', color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' }
    default:
      return { label: state, color: 'text-zinc-500', dot: 'bg-zinc-400' }
  }
}
