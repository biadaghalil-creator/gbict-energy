'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type DeviceType =
  | 'meter_p1'
  | 'meter_tibber'
  | 'battery_sessy'
  | 'battery_victron'
  | 'battery_enphase'
  | 'battery_solaredge'
  | 'solar_solaredge'
  | 'solar_enphase'
  | 'solar_sma'
  | 'solar_fronius'
  | 'heatpump_tado'
  | 'heatpump_generic'
  | 'thermostat_generic'
  | 'ev_generic'
  | 'ev_v2g'
  | 'battery_other'

export type NewDevice = {
  type: DeviceType
  brand: string
  label: string
  config: Record<string, string>
  status?: string
}

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function saveDevice(device: NewDevice) {
  const { supabase, user } = await getUser()

  const { error } = await supabase.from('devices').insert({
    user_id: user.id,
    type: device.type,
    brand: device.brand,
    name: device.label,
    config: device.config,
    status: device.status ?? 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/koppelingen')
  return { ok: true }
}

export async function deleteDevice(id: string) {
  const { supabase, user } = await getUser()

  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/koppelingen')
  return { ok: true }
}

// ── Tibber ──────────────────────────────────────────────────────────────────

export async function testTibberToken(
  token: string
): Promise<{ ok: boolean; name?: string; error?: string }> {
  try {
    const res = await fetch('https://api.tibber.com/v1-beta/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `{ viewer { name homes { id address { address1 city } } } }`,
      }),
    })

    if (!res.ok) {
      return { ok: false, error: 'Connection failed. Check your token.' }
    }

    const json = await res.json()

    if (json.errors) {
      return { ok: false, error: 'Invalid token.' }
    }

    const name = json.data?.viewer?.name ?? 'unknown'
    return { ok: true, name }
  } catch {
    return { ok: false, error: 'Couldn\'t reach Tibber.' }
  }
}

// ── Sessy ────────────────────────────────────────────────────────────────────

export async function testSessyCredentials(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const { getSessyToken } = await import('@/lib/sessy')
  const token = await getSessyToken(username, password)
  if (!token) return { ok: false, error: 'Wrong credentials or Sessy is unreachable.' }
  return { ok: true }
}

// ── Victron ──────────────────────────────────────────────────────────────────

export async function testVictronCredentials(
  email: string,
  password: string
): Promise<{
  ok: boolean
  idUser?: number
  installations?: { idSite: number; name: string }[]
  error?: string
}> {
  const { getVictronToken, getVictronInstallations } = await import('@/lib/victron')

  const auth = await getVictronToken(email, password)
  if (!auth) {
    return { ok: false, error: 'Wrong credentials or VRM is unreachable.' }
  }

  const installations = await getVictronInstallations(auth.token, auth.idUser)
  if (!installations.length) {
    return {
      ok: false,
      error: 'No installations found on this account. Check your VRM portal.',
    }
  }

  return { ok: true, idUser: auth.idUser, installations }
}

// ── Enphase ──────────────────────────────────────────────────────────────────
// Enphase v4 requires a registered GBICT app + OAuth consent flow (no more
// simple key+id — the old v2 key API has been phased out). As long as the app
// env vars aren't set, the connection isn't available; the UI therefore shows
// Enphase as 'coming soon'. The signature stays so the UI keeps compiling.

export async function testEnphaseCredentials(
  _apiKey: string,
  _systemId: string
): Promise<{ ok: boolean; systemName?: string; error?: string }> {
  const { enphaseConfigured } = await import('@/lib/enphase')
  if (!enphaseConfigured()) {
    return { ok: false, error: 'Enphase connection is coming soon via "Connect with Enphase".' }
  }
  // App registered → connecting goes through the OAuth consent flow, not key+id.
  return { ok: false, error: 'Connect your Enphase account with the "Connect with Enphase" button.' }
}

// ── SolarEdge ────────────────────────────────────────────────────────────────

export async function testSolarEdgeCredentials(
  apiKey: string,
  siteId: string
): Promise<{ ok: boolean; siteName?: string; error?: string }> {
  const { testSolarEdgeCredentials: _test } = await import('@/lib/solaredge')
  return _test(apiKey, siteId)
}

// ── Fronius ──────────────────────────────────────────────────────────────────

export async function testFroniusConnection(
  ip: string
): Promise<{ ok: boolean; error?: string }> {
  const { testFroniusConnection: _test } = await import('@/lib/fronius')
  return _test(ip)
}

// ── SMA ──────────────────────────────────────────────────────────────────────

export async function testSmaCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; plantName?: string; error?: string }> {
  const { testSmaCredentials: _test } = await import('@/lib/sma')
  return _test(email, password)
}

// ── Tado (heat pump / thermostat) — OAuth device-code flow ────────────────────
// Since March 2025, password login is dead. We start a device-code flow:
// the user approves the connection on a Tado URL, and we poll for the token.

export async function startTadoAuth(): Promise<{
  ok: boolean
  deviceCode?: string
  userCode?: string
  verificationUri?: string
  interval?: number
  error?: string
}> {
  const { startTadoDeviceAuth } = await import('@/lib/tado')
  const auth = await startTadoDeviceAuth()
  if (!auth) return { ok: false, error: 'Couldn\'t reach Tado. Please try again later.' }
  return {
    ok: true,
    deviceCode: auth.deviceCode,
    userCode: auth.userCode,
    verificationUri: auth.verificationUri,
    interval: auth.interval,
  }
}

export async function pollTadoAuth(deviceCode: string): Promise<{
  status: 'ok' | 'pending' | 'denied' | 'expired' | 'error'
  refreshToken?: string
  homeName?: string
}> {
  const { pollTadoToken, getTadoHomeName } = await import('@/lib/tado')
  const result = await pollTadoToken(deviceCode)
  if (result.status !== 'ok' || !result.tokens) return { status: result.status }
  const homeName = await getTadoHomeName(result.tokens.accessToken)
  return { status: 'ok', refreshToken: result.tokens.refreshToken, homeName }
}
