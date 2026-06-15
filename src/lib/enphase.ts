// Enphase API v4 — https://developer-v4.enphase.com
// De oude v2 key-API (enlighten.enphaseenergy.com/api/v2) is uitgefaseerd en
// redirect nu naar /login. v4 vereist een GEREGISTREERDE Enphase-app:
//   - OAuth2 authorization-code flow (per gebruiker een access/refresh-token)
//   - elke datacall stuurt header `key: <API_KEY>` + `Authorization: Bearer <token>`
// GBICT moet de app aanmaken op developer-v4.enphase.com en deze env-vars zetten:
//   ENPHASE_CLIENT_ID, ENPHASE_CLIENT_SECRET, ENPHASE_API_KEY
// Zolang die ontbreken is de koppeling niet beschikbaar (UI toont 'binnenkort').

const ENPHASE_API = 'https://api.enphaseenergy.com/api/v4'
const ENPHASE_OAUTH = 'https://api.enphaseenergy.com/oauth'

export type EnphaseBatteryStatus = {
  soc: number         // state of charge 0-100 %
  power: number       // W — positief = laden, negatief = ontladen
  state: string       // 'CHARGING' | 'DISCHARGING' | 'IDLE'
  energyToday: number // Wh geproduceerd vandaag
}

export function enphaseConfigured(): boolean {
  return Boolean(
    process.env.ENPHASE_CLIENT_ID &&
    process.env.ENPHASE_CLIENT_SECRET &&
    process.env.ENPHASE_API_KEY
  )
}

// Bouw de OAuth-consent URL waar de gebruiker zijn Enphase-account koppelt.
export function enphaseAuthUrl(redirectUri: string): string | null {
  const clientId = process.env.ENPHASE_CLIENT_ID
  if (!clientId) return null
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
  })
  return `${ENPHASE_OAUTH}/authorize?${params}`
}

// Wissel de authorization-code in voor access/refresh tokens (Basic auth).
export async function exchangeEnphaseCode(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const clientId = process.env.ENPHASE_CLIENT_ID
  const clientSecret = process.env.ENPHASE_CLIENT_SECRET
  if (!clientId || !clientSecret) return null
  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch(`${ENPHASE_OAUTH}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const d = await res.json()
    if (!d.access_token) return null
    return { accessToken: d.access_token, refreshToken: d.refresh_token }
  } catch {
    return null
  }
}

export type EnphaseSystem = { systemId: string; name: string }

// Haal de installaties (systems) op die bij dit Enphase-account horen.
export async function getEnphaseSystems(accessToken: string): Promise<EnphaseSystem[]> {
  const apiKey = process.env.ENPHASE_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch(`${ENPHASE_API}/systems?key=${encodeURIComponent(apiKey)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    const systems: Record<string, unknown>[] = data.systems ?? []
    return systems.map((s) => ({
      systemId: String(s.system_id ?? s.systemId ?? ''),
      name: String(s.name ?? `Systeem ${s.system_id ?? ''}`),
    }))
  } catch {
    return []
  }
}

export async function getEnphaseStatus(
  accessToken: string,
  systemId: string
): Promise<EnphaseBatteryStatus | null> {
  const apiKey = process.env.ENPHASE_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(`${ENPHASE_API}/systems/${systemId}/summary`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        key: apiKey,
      },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()

    // v4 summary — battery/storage velden
    const soc = Number(data.battery?.percentFull ?? data.energy_lifetime ? data.battery?.percentFull ?? 0 : 0)
    const power = Number(data.battery?.power ?? 0)

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
