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
  | 'ev_generic'
  | 'ev_v2g'

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
      return { ok: false, error: 'Verbinding mislukt. Controleer je token.' }
    }

    const json = await res.json()

    if (json.errors) {
      return { ok: false, error: 'Ongeldig token.' }
    }

    const name = json.data?.viewer?.name ?? 'onbekend'
    return { ok: true, name }
  } catch {
    return { ok: false, error: 'Kon Tibber niet bereiken.' }
  }
}

// ── Sessy ────────────────────────────────────────────────────────────────────

export async function testSessyCredentials(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const { getSessyToken } = await import('@/lib/sessy')
  const token = await getSessyToken(username, password)
  if (!token) return { ok: false, error: 'Inloggegevens onjuist of Sessy niet bereikbaar.' }
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
    return { ok: false, error: 'Inloggegevens onjuist of VRM niet bereikbaar.' }
  }

  const installations = await getVictronInstallations(auth.token, auth.idUser)
  if (!installations.length) {
    return {
      ok: false,
      error: 'Geen installaties gevonden op dit account. Controleer je VRM portal.',
    }
  }

  return { ok: true, idUser: auth.idUser, installations }
}

// ── Enphase ──────────────────────────────────────────────────────────────────
// Enphase v4 vereist een geregistreerde GBICT-app + OAuth-consent flow (geen
// simpele key+id meer — de oude v2 key-API is uitgefaseerd). Zolang de app-env-
// vars niet gezet zijn, is de koppeling niet beschikbaar; de UI toont Enphase
// daarom als 'binnenkort'. Signatuur blijft staan zodat de UI blijft compileren.

export async function testEnphaseCredentials(
  _apiKey: string,
  _systemId: string
): Promise<{ ok: boolean; systemName?: string; error?: string }> {
  const { enphaseConfigured } = await import('@/lib/enphase')
  if (!enphaseConfigured()) {
    return { ok: false, error: 'Enphase-koppeling is binnenkort beschikbaar via "Koppel met Enphase".' }
  }
  // App geregistreerd → koppelen verloopt via de OAuth-consent flow, niet via key+id.
  return { ok: false, error: 'Koppel je Enphase-account via de knop "Koppel met Enphase".' }
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

// ── Tado (warmtepomp / thermostaat) — OAuth device-code flow ──────────────────
// Sinds maart 2025 is de wachtwoord-login dood. We starten een device-code flow:
// de gebruiker keurt de koppeling goed op een Tado-URL, wij pollen de token.

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
  if (!auth) return { ok: false, error: 'Kon Tado niet bereiken. Probeer het later opnieuw.' }
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
