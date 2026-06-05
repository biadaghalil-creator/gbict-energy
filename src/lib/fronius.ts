// Fronius Solar API v1 — local network inverter
// Documentatie: https://www.fronius.com/en/solar-energy/installers-partners/technical-data/all-products/system-monitoring/open-interfaces/fronius-solar-api-json-
// Vereist: inverter op hetzelfde lokale netwerk

const FRONIUS_PATH =
  '/solar_api/v1/GetInverterRealtimeData.cgi?Scope=Device&DeviceId=1&DataCollection=CommonInverterData'

export async function testFroniusConnection(
  ip: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`http://${ip}${FRONIUS_PATH}`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })

    if (!res.ok) {
      return { ok: false, error: `Fronius gaf foutcode ${res.status}. Controleer het IP-adres.` }
    }

    const data = await res.json()
    // A valid Fronius response has a Head.Status with Code 0
    const code = data?.Head?.Status?.Code
    if (code !== 0 && code !== undefined) {
      return { ok: false, error: `Fronius fout (code ${code}): ${data?.Head?.Status?.Reason ?? 'onbekend'}` }
    }

    return { ok: true }
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { ok: false, error: 'Omvormer niet bereikbaar. Controleer het IP-adres en netwerkkoppeling.' }
    }
    return { ok: false, error: 'Kon de Fronius omvormer niet bereiken.' }
  }
}

export async function getFroniusProduction(
  ip: string
): Promise<{ currentWatts: number; todayKwh: number } | null> {
  try {
    const res = await fetch(`http://${ip}${FRONIUS_PATH}`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    if (!res.ok) return null

    const data = await res.json()
    const body = data?.Body?.Data

    if (!body) return null

    // PAC = actueel vermogen in W
    const currentWatts = Number(body?.PAC?.Value ?? 0)
    // DAY_ENERGY = energie vandaag in Wh → omrekenen naar kWh
    const dayWh = Number(body?.DAY_ENERGY?.Value ?? 0)
    const todayKwh = Math.round((dayWh / 1000) * 100) / 100

    return { currentWatts, todayKwh }
  } catch {
    return null
  }
}
