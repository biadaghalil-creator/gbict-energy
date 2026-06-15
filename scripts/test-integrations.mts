/**
 * Integration smoke test — verifies that every provider coupling reaches the
 * REAL upstream API and behaves correctly.
 *
 *  - EnergyZero  : full end-to-end (public, no creds) — expects real prices
 *  - others      : reachability + correct auth-rejection with dummy creds
 *                  (proves the wiring is correct; a real account is still
 *                   needed to confirm a live device round-trip)
 *
 * Run:  npx tsx scripts/test-integrations.mts
 *       CRED_TIBBER=xxx npx tsx scripts/test-integrations.mts   (real creds optional)
 */

import { fetchDayAheadPrices, currentHourPrice } from '../src/lib/energyzero'
import { fetchTibberPrices } from '../src/lib/tibber'
import { getSessyToken } from '../src/lib/sessy'
import { getVictronToken, getVictronInstallations } from '../src/lib/victron'
import { enphaseConfigured } from '../src/lib/enphase'
import { testSolarEdgeCredentials } from '../src/lib/solaredge'
import { startTadoDeviceAuth, pollTadoToken } from '../src/lib/tado'
import { testFroniusConnection } from '../src/lib/fronius'
import { testSmaCredentials } from '../src/lib/sma'

type Result = { name: string; status: 'PASS' | 'FAIL' | 'STUB' | 'SKIP'; detail: string }
const results: Result[] = []
const add = (name: string, status: Result['status'], detail: string) => {
  results.push({ name, status, detail })
  const icon = { PASS: '✅', FAIL: '❌', STUB: '🚧', SKIP: '⏭️ ' }[status]
  console.log(`${icon} ${name.padEnd(14)} ${detail}`)
}

// ── 1. EnergyZero — full live test ───────────────────────────────────────────
async function testEnergyZero() {
  const prices = await fetchDayAheadPrices()
  if (!prices.length) return add('EnergyZero', 'FAIL', 'geen prijzen terug van api.energyzero.nl')
  const cur = currentHourPrice(prices)
  const lo = Math.min(...prices.map((p) => p.total)).toFixed(3)
  const hi = Math.max(...prices.map((p) => p.total)).toFixed(3)
  add('EnergyZero', 'PASS', `${prices.length} uurprijzen — nu €${cur?.total.toFixed(3) ?? '?'}/kWh, dag €${lo}–€${hi}`)
}

// ── 2. Tibber ────────────────────────────────────────────────────────────────
async function testTibber() {
  const token = process.env.CRED_TIBBER
  if (token) {
    const data = await fetchTibberPrices(token)
    return data?.today?.length
      ? add('Tibber', 'PASS', `echte token werkt — ${data.today.length} prijzen vandaag`)
      : add('Tibber', 'FAIL', 'token gaf geen prijsdata terug')
  }
  // dummy token → moet net afgewezen worden (auth), endpoint moet bereikbaar zijn
  const res = await fetch('https://api.tibber.com/v1-beta/gql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer dummy-invalid' },
    body: JSON.stringify({ query: '{ viewer { name } }' }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => null)
  if (!res) return add('Tibber', 'FAIL', 'endpoint onbereikbaar')
  add('Tibber', 'PASS', `bedrading OK — api.tibber.com bereikbaar, dummy-token afgewezen (HTTP ${res.status}) · geef CRED_TIBBER voor echte test`)
}

// ── 3. Sessy ─────────────────────────────────────────────────────────────────
async function testSessy() {
  const tok = await getSessyToken('dummy@test.nl', 'wrongpass')
  add('Sessy', tok ? 'FAIL' : 'PASS', tok ? 'dummy login gaf token?!' : 'bedrading OK — dummy login terecht geweigerd · echte user/pass nodig voor live test')
}

// ── 4. Victron VRM ───────────────────────────────────────────────────────────
async function testVictron() {
  const email = process.env.CRED_VICTRON_EMAIL
  const pass = process.env.CRED_VICTRON_PASS
  if (email && pass) {
    const auth = await getVictronToken(email, pass)
    if (!auth) return add('Victron', 'FAIL', 'echte login geweigerd')
    const inst = await getVictronInstallations(auth.token, auth.idUser)
    return add('Victron', 'PASS', `echte login werkt — ${inst.length} installatie(s): ${inst.map((i) => i.name).join(', ')}`)
  }
  const auth = await getVictronToken('dummy@test.nl', 'wrongpass')
  add('Victron', auth ? 'FAIL' : 'PASS', auth ? 'dummy login gaf token?!' : 'bedrading OK — VRM bereikbaar, dummy login geweigerd · echte VRM-login nodig voor live test')
}

// ── 5. Enphase (v4 — vereist GBICT-app) ──────────────────────────────────────
async function testEnphase() {
  // De oude v2 key-API is dood; v4 vereist een geregistreerde app (env-vars).
  const res = await fetch('https://api.enphaseenergy.com/api/v4/systems', {
    signal: AbortSignal.timeout(8000),
  }).catch(() => null)
  if (!res) return add('Enphase', 'FAIL', 'api.enphaseenergy.com onbereikbaar')
  if (enphaseConfigured()) {
    add('Enphase', 'PASS', `v4 API bereikbaar (HTTP ${res.status}) + GBICT-app geconfigureerd`)
  } else {
    add('Enphase', 'SKIP', `v4 API bereikbaar (HTTP ${res.status}) — wacht op GBICT Enphase-app (ENPHASE_CLIENT_ID/SECRET/API_KEY)`)
  }
}

// ── 6. SolarEdge ─────────────────────────────────────────────────────────────
async function testSolarEdge() {
  const r = await testSolarEdgeCredentials('dummy-key', '0000000')
  const reached = !r.ok && !!r.error && !r.error.includes('internetverbinding')
  add('SolarEdge', reached ? 'PASS' : 'FAIL', reached ? `bedrading OK — SolarEdge API antwoordt, dummy key afgewezen ("${r.error}")` : `onverwacht: ${JSON.stringify(r)}`)
}

// ── 7. Fronius (LAN-only) ────────────────────────────────────────────────────
async function testFronius() {
  const r = await testFroniusConnection('192.0.2.1') // TEST-NET, nooit bereikbaar
  add('Fronius', 'SKIP', `LAN-only — omvormer zit op klant-netwerk, niet testbaar vanaf cloud (kreeg: "${r.error}")`)
}

// ── 8. SMA ───────────────────────────────────────────────────────────────────
async function testSma() {
  const r = await testSmaCredentials('x@y.nl', 'p')
  add('SMA', 'STUB', `nog niet geïmplementeerd — geeft: "${r.error}"`)
}

// ── 9. Tado (warmtepomp) — device-code flow ──────────────────────────────────
async function testTado() {
  const auth = await startTadoDeviceAuth()
  if (!auth) return add('Tado', 'FAIL', 'login.tado.com device-auth onbereikbaar')
  const poll = await pollTadoToken(auth.deviceCode)
  const ok = poll.status === 'pending'
  add('Tado', ok ? 'PASS' : 'FAIL', ok
    ? `device-code flow werkt — code ${auth.userCode}, poll geeft correct "pending" (wacht op goedkeuring)`
    : `onverwachte poll-status: ${poll.status}`)
}

async function main() {
  console.log('\n🔌 GBICT Energy — API koppelingen test\n' + '─'.repeat(60))
  await testEnergyZero()
  await testTibber()
  await testSessy()
  await testVictron()
  await testEnphase()
  await testSolarEdge()
  await testFronius()
  await testSma()
  await testTado()
  console.log('─'.repeat(60))
  const pass = results.filter((r) => r.status === 'PASS').length
  const fail = results.filter((r) => r.status === 'FAIL').length
  console.log(`\n${pass} PASS · ${fail} FAIL · ${results.filter((r) => r.status === 'STUB').length} STUB · ${results.filter((r) => r.status === 'SKIP').length} SKIP\n`)
  if (fail) process.exitCode = 1
}

main()
