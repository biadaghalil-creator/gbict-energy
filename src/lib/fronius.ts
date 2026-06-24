// Fronius Solar API v1 — local network inverter
// Documentation: https://www.fronius.com/en/solar-energy/installers-partners/technical-data/all-products/system-monitoring/open-interfaces/fronius-solar-api-json-
// Required: inverter on the same local network

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
      return { ok: false, error: `Fronius returned error code ${res.status}. Check the IP address.` }
    }

    const data = await res.json()
    // A valid Fronius response has a Head.Status with Code 0
    const code = data?.Head?.Status?.Code
    if (code !== 0 && code !== undefined) {
      return { ok: false, error: `Fronius error (code ${code}): ${data?.Head?.Status?.Reason ?? 'unknown'}` }
    }

    return { ok: true }
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { ok: false, error: 'Inverter unreachable. Check the IP address and network connection.' }
    }
    return { ok: false, error: 'Couldn\'t reach the Fronius inverter.' }
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

    // PAC = current power in W
    const currentWatts = Number(body?.PAC?.Value ?? 0)
    // DAY_ENERGY = energy today in Wh → convert to kWh
    const dayWh = Number(body?.DAY_ENERGY?.Value ?? 0)
    const todayKwh = Math.round((dayWh / 1000) * 100) / 100

    return { currentWatts, todayKwh }
  } catch {
    return null
  }
}
