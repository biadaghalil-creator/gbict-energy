// Tado° OAuth 2.0 Device Code Flow
// Sinds 21 maart 2025 heeft Tado de wachtwoord-login (auth.tado.com) uitgezet.
// Authenticatie verloopt nu via de device-code grant op login.tado.com met de
// publieke client-id van de Tado-web-app. Geen GBICT-registratie nodig.
// Refs: https://help.tado.com/en/articles/8565472-how-do-i-authenticate-to-access-the-rest-api

const TADO_CLIENT_ID = '1bb50063-6b0c-4d11-bd99-387f4a91cc46'
const TADO_OAUTH = 'https://login.tado.com/oauth2'
const TADO_API = 'https://my.tado.com/api/v2'

export type TadoDeviceAuth = {
  deviceCode: string
  userCode: string
  verificationUri: string // verification_uri_complete — bevat al de user_code
  expiresIn: number
  interval: number
}

export type TadoTokens = {
  accessToken: string
  refreshToken: string
}

// Stap 1 — vraag een device-code aan. De gebruiker keurt 'm goed op de URL.
export async function startTadoDeviceAuth(): Promise<TadoDeviceAuth | null> {
  try {
    const res = await fetch(`${TADO_OAUTH}/device_authorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TADO_CLIENT_ID,
        scope: 'offline_access',
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const d = await res.json()
    if (!d.device_code || !d.user_code) return null
    return {
      deviceCode: d.device_code,
      userCode: d.user_code,
      verificationUri: d.verification_uri_complete ?? d.verification_uri,
      expiresIn: Number(d.expires_in ?? 300),
      interval: Number(d.interval ?? 5),
    }
  } catch {
    return null
  }
}

// Stap 2 — pol de token-endpoint. Zolang de gebruiker nog niet heeft
// goedgekeurd geeft Tado 400 met error 'authorization_pending'.
export async function pollTadoToken(
  deviceCode: string
): Promise<{ status: 'ok' | 'pending' | 'denied' | 'expired' | 'error'; tokens?: TadoTokens }> {
  try {
    const res = await fetch(`${TADO_OAUTH}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TADO_CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (res.ok) {
      const d = await res.json()
      if (d.access_token && d.refresh_token) {
        return { status: 'ok', tokens: { accessToken: d.access_token, refreshToken: d.refresh_token } }
      }
      return { status: 'error' }
    }

    const d = await res.json().catch(() => ({}))
    switch (d.error) {
      case 'authorization_pending':
      case 'slow_down':
        return { status: 'pending' }
      case 'access_denied':
        return { status: 'denied' }
      case 'expired_token':
        return { status: 'expired' }
      default:
        return { status: 'error' }
    }
  } catch {
    return { status: 'error' }
  }
}

// Vernieuw een verlopen access-token met het opgeslagen refresh-token.
export async function refreshTadoToken(refreshToken: string): Promise<TadoTokens | null> {
  try {
    const res = await fetch(`${TADO_OAUTH}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TADO_CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const d = await res.json()
    if (!d.access_token) return null
    return { accessToken: d.access_token, refreshToken: d.refresh_token ?? refreshToken }
  } catch {
    return null
  }
}

// Best-effort: haal de naam van het eerste huis op (voor een nette label).
export async function getTadoHomeName(accessToken: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${TADO_API}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return undefined
    const d = await res.json()
    return d?.homes?.[0]?.name
  } catch {
    return undefined
  }
}
