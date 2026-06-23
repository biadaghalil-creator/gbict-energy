// Enode — EV-aggregator. Eén OAuth-koppeling dekt veel automerken (Tesla,
// Renault, Kia, Hyundai, VW, Polestar, ...). We lezen voertuigdata en sturen
// het laden aan (START/STOP) op de goedkoopste uren — merk-onafhankelijk.
// Docs: https://developers.enode.com/api/reference
//
// Env-gated: zonder ENODE_CLIENT_ID/SECRET staat de koppeling "uit" en valt de
// app terug op handmatig registreren. Niks gaat stuk.

const ENV = process.env.ENODE_ENV || 'production'
const OAUTH_BASE = `https://oauth.${ENV}.enode.io`
const API_BASE = `https://enode-api.${ENV}.enode.io`

export function enodeConfigured(): boolean {
  return !!(process.env.ENODE_CLIENT_ID && process.env.ENODE_CLIENT_SECRET)
}

/** Client-credentials access token voor server-to-server calls. */
export async function getEnodeToken(): Promise<string | null> {
  if (!enodeConfigured()) return null
  try {
    const basic = Buffer.from(
      `${process.env.ENODE_CLIENT_ID}:${process.env.ENODE_CLIENT_SECRET}`
    ).toString('base64')
    const res = await fetch(`${OAUTH_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.access_token as string) ?? null
  } catch {
    return null
  }
}

/**
 * Start een Enode "Link"-sessie zodat de gebruiker zijn auto-account koppelt.
 * Geeft de linkUrl terug waar de gebruiker naartoe gestuurd wordt.
 */
export async function createEnodeLinkSession(
  userId: string,
  redirectUri: string
): Promise<string | null> {
  const token = await getEnodeToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/link`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorType: 'vehicle',
        scopes: ['vehicle:read:data', 'vehicle:control:charging'],
        language: 'nl-NL',
        redirectUri,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.linkUrl as string) ?? null
  } catch {
    return null
  }
}

export type EnodeVehicle = {
  id: string
  isReachable: boolean
  isCharging: boolean
  batteryLevel: number | null
}

/** Alle gekoppelde voertuigen van een gebruiker. */
export async function getEnodeVehicles(userId: string): Promise<EnodeVehicle[]> {
  const token = await getEnodeToken()
  if (!token) return []
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    const data = await res.json()
    const list: unknown[] = Array.isArray(data) ? data : (data.data ?? [])
    return list.map((raw) => {
      const v = raw as Record<string, unknown>
      const cs = (v.chargeState ?? {}) as Record<string, unknown>
      return {
        id: String(v.id),
        isReachable: Boolean(v.isReachable),
        isCharging: Boolean(cs.isCharging),
        batteryLevel: typeof cs.batteryLevel === 'number' ? cs.batteryLevel : null,
      }
    })
  } catch {
    return []
  }
}

/** Start of stop het laden van een voertuig. Geeft true bij succes. */
export async function setEnodeCharging(
  vehicleId: string,
  action: 'START' | 'STOP'
): Promise<boolean> {
  const token = await getEnodeToken()
  if (!token) return false
  try {
    const res = await fetch(`${API_BASE}/vehicles/${encodeURIComponent(vehicleId)}/charging`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}
