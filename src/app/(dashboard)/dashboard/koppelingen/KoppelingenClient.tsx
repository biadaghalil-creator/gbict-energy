'use client'

import { useState, useTransition } from 'react'
import {
  saveDevice, deleteDevice,
  testTibberToken, testSessyCredentials,
  testVictronCredentials, testEnphaseCredentials, testSolarEdgeCredentials,
  testFroniusConnection, testSmaCredentials,
  testTadoCredentials,
  type DeviceType,
} from './actions'
import { Zap, Gauge, BatteryCharging, Sun, CloudSun, Plug, Flame, Thermometer, Car } from 'lucide-react'

type Device = {
  id: string
  type: DeviceType
  brand: string
  name: string
  status: string
  created_at: string
}

type Step =
  | 'idle' | 'category'
  | 'tibber-token' | 'p1-setup'
  | 'sessy-setup'
  | 'victron-setup' | 'enphase-setup' | 'solaredge-setup'
  | 'battery-other'
  | 'solar-solaredge-setup' | 'solar-fronius-setup' | 'solar-sma-setup'
  | 'heatpump-setup'
  | 'done'

const DEVICE_ICONS: Record<string, React.ElementType> = {
  meter_tibber:         Zap,
  meter_p1:             Gauge,
  battery_sessy:        BatteryCharging,
  battery_victron:      BatteryCharging,
  battery_enphase:      Sun,
  battery_solaredge:    CloudSun,
  solar_solaredge:      Sun,
  solar_enphase:        Sun,
  solar_sma:            Sun,
  solar_fronius:        Sun,
  heatpump_tado:        Flame,
  heatpump_generic:     Flame,
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: 'Verbinden…', color: 'text-amber-500' },
  active:  { label: 'Verbonden',  color: 'text-emerald-500' },
  error:   { label: 'Fout',       color: 'text-red-500' },
}

const MODAL_TITLES: Partial<Record<Step, string>> = {
  category:              'Wat wil je koppelen?',
  'tibber-token':        'Tibber koppelen',
  'p1-setup':            'P1 Meter koppelen',
  'sessy-setup':         'Sessy batterij koppelen',
  'victron-setup':       'Victron Energy koppelen',
  'enphase-setup':       'Enphase koppelen',
  'solaredge-setup':     'SolarEdge koppelen',
  'battery-other':       'Batterij koppelen',
  'solar-solaredge-setup': 'SolarEdge zonnepanelen',
  'solar-fronius-setup': 'Fronius omvormer koppelen',
  'solar-sma-setup':     'SMA koppelen',
  'heatpump-setup':      'Warmtepomp koppelen',
  done:                  'Gekoppeld!',
}

export default function KoppelingenClient({ initialDevices }: { initialDevices: Device[] }) {
  const [devices, setDevices]        = useState<Device[]>(initialDevices)
  const [step, setStep]              = useState<Step>('idle')
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId]  = useState<string | null>(null)

  // Tibber
  const [tibberToken,   setTibberToken]   = useState('')
  const [tibberName,    setTibberName]    = useState('')
  const [tibberError,   setTibberError]   = useState('')
  const [tibberTesting, setTibberTesting] = useState(false)

  // P1
  const [p1Ip,    setP1Ip]    = useState('')
  const [p1Error, setP1Error] = useState('')

  // Sessy
  const [sessyUser,    setSessyUser]    = useState('')
  const [sessyPass,    setSessyPass]    = useState('')
  const [sessyOk,      setSessyOk]      = useState(false)
  const [sessyError,   setSessyError]   = useState('')
  const [sessyTesting, setSessyTesting] = useState(false)

  // Victron
  const [victronEmail,    setVictronEmail]    = useState('')
  const [victronPass,     setVictronPass]     = useState('')
  const [victronIdUser,   setVictronIdUser]   = useState<number | null>(null)
  const [victronSites,    setVictronSites]    = useState<{ idSite: number; name: string }[]>([])
  const [victronSiteId,   setVictronSiteId]   = useState<number | null>(null)
  const [victronSiteName, setVictronSiteName] = useState('')
  const [victronOk,       setVictronOk]       = useState(false)
  const [victronError,    setVictronError]    = useState('')
  const [victronTesting,  setVictronTesting]  = useState(false)

  // Enphase
  const [enphaseKey,     setEnphaseKey]     = useState('')
  const [enphaseId,      setEnphaseId]      = useState('')
  const [enphaseName,    setEnphaseName]    = useState('')
  const [enphaseOk,      setEnphaseOk]      = useState(false)
  const [enphaseError,   setEnphaseError]   = useState('')
  const [enphaseTesting, setEnphaseTesting] = useState(false)

  // SolarEdge (battery)
  const [seKey,     setSeKey]     = useState('')
  const [seSiteId,  setSeSiteId]  = useState('')
  const [seName,    setSeName]    = useState('')
  const [seOk,      setSeOk]      = useState(false)
  const [seError,   setSeError]   = useState('')
  const [seTesting, setSeTesting] = useState(false)

  // SolarEdge Solar (zonnepanelen)
  const [solarSeKey,     setSolarSeKey]     = useState('')
  const [solarSeSiteId,  setSolarSeSiteId]  = useState('')
  const [solarSeName,    setSolarSeName]    = useState('')
  const [solarSeOk,      setSolarSeOk]      = useState(false)
  const [solarSeError,   setSolarSeError]   = useState('')
  const [solarSeTesting, setSolarSeTesting] = useState(false)

  // Fronius
  const [froniusIp,      setFroniusIp]      = useState('')
  const [froniusOk,      setFroniusOk]      = useState(false)
  const [froniusError,   setFroniusError]   = useState('')
  const [froniusTesting, setFroniusTesting] = useState(false)

  // SMA
  const [smaEmail,   setSmaEmail]   = useState('')
  const [smaPass,    setSmaPass]    = useState('')
  const [smaError,   setSmaError]   = useState('')
  const [smaTesting, setSmaTesting] = useState(false)

  // Warmtepomp (Tado / handmatig)
  const [heatpumpBrand,   setHeatpumpBrand]   = useState<'tado' | 'generic'>('tado')
  const [heatpumpEmail,   setHeatpumpEmail]   = useState('')
  const [heatpumpPass,    setHeatpumpPass]    = useState('')
  const [heatpumpLabel,   setHeatpumpLabel]   = useState('')
  const [heatpumpHome,    setHeatpumpHome]    = useState('')
  const [heatpumpOk,      setHeatpumpOk]      = useState(false)
  const [heatpumpError,   setHeatpumpError]   = useState('')
  const [heatpumpTesting, setHeatpumpTesting] = useState(false)

  function openModal() {
    setStep('category')
    setTibberToken(''); setTibberName(''); setTibberError('')
    setP1Ip(''); setP1Error('')
    setSessyUser(''); setSessyPass(''); setSessyOk(false); setSessyError('')
    setVictronEmail(''); setVictronPass(''); setVictronIdUser(null)
    setVictronSites([]); setVictronSiteId(null); setVictronSiteName('')
    setVictronOk(false); setVictronError('')
    setEnphaseKey(''); setEnphaseId(''); setEnphaseName(''); setEnphaseOk(false); setEnphaseError('')
    setSeKey(''); setSeSiteId(''); setSeName(''); setSeOk(false); setSeError('')
    setSolarSeKey(''); setSolarSeSiteId(''); setSolarSeName(''); setSolarSeOk(false); setSolarSeError('')
    setFroniusIp(''); setFroniusOk(false); setFroniusError('')
    setSmaEmail(''); setSmaPass(''); setSmaError('')
    setHeatpumpBrand('tado'); setHeatpumpEmail(''); setHeatpumpPass('')
    setHeatpumpLabel(''); setHeatpumpHome(''); setHeatpumpOk(false)
    setHeatpumpError('')
  }
  function closeModal() { setStep('idle') }

  function addDevice(partial: Omit<Device, 'id' | 'created_at'>) {
    setDevices(prev => [...prev, { ...partial, id: crypto.randomUUID(), created_at: new Date().toISOString() }])
    setStep('done')
    setTimeout(closeModal, 1200)
  }

  // ── Tibber ──────────────────────────────────────────────────────────────
  async function handleTestTibber() {
    setTibberError(''); setTibberName('')
    if (!tibberToken.trim()) { setTibberError('Voer je token in.'); return }
    setTibberTesting(true)
    const r = await testTibberToken(tibberToken.trim())
    setTibberTesting(false)
    r.ok ? setTibberName(r.name ?? '') : setTibberError(r.error ?? 'Onbekende fout.')
  }

  function handleSaveTibber() {
    if (!tibberName) return
    startTransition(async () => {
      const r = await saveDevice({ type: 'meter_tibber', brand: 'Tibber', label: 'Tibber', config: { token: tibberToken.trim() }, status: 'active' })
      if (r.error) { setTibberError(r.error); return }
      addDevice({ type: 'meter_tibber', brand: 'Tibber', name: 'Tibber', status: 'active' })
    })
  }

  // ── P1 ──────────────────────────────────────────────────────────────────
  function handleSaveP1() {
    if (!p1Ip.trim()) { setP1Error('Voer het IP-adres in.'); return }
    startTransition(async () => {
      const r = await saveDevice({ type: 'meter_p1', brand: 'HomeWizard', label: 'P1 Meter', config: { ip: p1Ip.trim() } })
      if (r.error) { setP1Error(r.error); return }
      addDevice({ type: 'meter_p1', brand: 'HomeWizard', name: 'P1 Meter', status: 'pending' })
    })
  }

  // ── Sessy ────────────────────────────────────────────────────────────────
  async function handleTestSessy() {
    setSessyError(''); setSessyOk(false)
    if (!sessyUser.trim() || !sessyPass.trim()) { setSessyError('Vul je e-mail en wachtwoord in.'); return }
    setSessyTesting(true)
    const r = await testSessyCredentials(sessyUser.trim(), sessyPass.trim())
    setSessyTesting(false)
    r.ok ? setSessyOk(true) : setSessyError(r.error ?? 'Inloggen mislukt.')
  }

  function handleSaveSessy() {
    if (!sessyOk) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'battery_sessy', brand: 'Sessy', label: 'Sessy Batterij',
        config: { username: sessyUser.trim(), password: sessyPass.trim() },
        status: 'active',
      })
      if (r.error) { setSessyError(r.error); return }
      addDevice({ type: 'battery_sessy', brand: 'Sessy', name: 'Sessy Batterij', status: 'active' })
    })
  }

  // ── Victron ──────────────────────────────────────────────────────────────
  async function handleTestVictron() {
    setVictronError(''); setVictronOk(false); setVictronSites([])
    if (!victronEmail.trim() || !victronPass.trim()) { setVictronError('Vul je e-mail en wachtwoord in.'); return }
    setVictronTesting(true)
    const r = await testVictronCredentials(victronEmail.trim(), victronPass.trim())
    setVictronTesting(false)
    if (!r.ok) { setVictronError(r.error ?? 'Inloggen mislukt.'); return }
    setVictronIdUser(r.idUser ?? null)
    setVictronSites(r.installations ?? [])
    if (r.installations?.length === 1) {
      setVictronSiteId(r.installations[0].idSite)
      setVictronSiteName(r.installations[0].name)
    }
    setVictronOk(true)
  }

  function handleSaveVictron() {
    if (!victronOk || !victronSiteId) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'battery_victron',
        brand: 'Victron Energy',
        label: victronSiteName || 'Victron Batterij',
        config: {
          email: victronEmail.trim(),
          password: victronPass.trim(),
          idUser: String(victronIdUser ?? ''),
          idSite: String(victronSiteId),
        },
        status: 'active',
      })
      if (r.error) { setVictronError(r.error); return }
      addDevice({ type: 'battery_victron', brand: 'Victron Energy', name: victronSiteName || 'Victron Batterij', status: 'active' })
    })
  }

  // ── Enphase ──────────────────────────────────────────────────────────────
  async function handleTestEnphase() {
    setEnphaseError(''); setEnphaseOk(false); setEnphaseName('')
    if (!enphaseKey.trim() || !enphaseId.trim()) { setEnphaseError('Vul je API key en systeem ID in.'); return }
    setEnphaseTesting(true)
    const r = await testEnphaseCredentials(enphaseKey.trim(), enphaseId.trim())
    setEnphaseTesting(false)
    if (!r.ok) { setEnphaseError(r.error ?? 'Verificatie mislukt.'); return }
    setEnphaseName(r.systemName ?? `Systeem ${enphaseId}`)
    setEnphaseOk(true)
  }

  function handleSaveEnphase() {
    if (!enphaseOk) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'battery_enphase',
        brand: 'Enphase',
        label: enphaseName,
        config: { apiKey: enphaseKey.trim(), systemId: enphaseId.trim() },
        status: 'active',
      })
      if (r.error) { setEnphaseError(r.error); return }
      addDevice({ type: 'battery_enphase', brand: 'Enphase', name: enphaseName, status: 'active' })
    })
  }

  // ── SolarEdge ────────────────────────────────────────────────────────────
  async function handleTestSolarEdge() {
    setSeError(''); setSeOk(false); setSeName('')
    if (!seKey.trim() || !seSiteId.trim()) { setSeError('Vul je API key en site ID in.'); return }
    setSeTesting(true)
    const r = await testSolarEdgeCredentials(seKey.trim(), seSiteId.trim())
    setSeTesting(false)
    if (!r.ok) { setSeError(r.error ?? 'Verificatie mislukt.'); return }
    setSeName(r.siteName ?? `Site ${seSiteId}`)
    setSeOk(true)
  }

  function handleSaveSolarEdge() {
    if (!seOk) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'battery_solaredge',
        brand: 'SolarEdge',
        label: seName,
        config: { apiKey: seKey.trim(), siteId: seSiteId.trim() },
        status: 'active',
      })
      if (r.error) { setSeError(r.error); return }
      addDevice({ type: 'battery_solaredge', brand: 'SolarEdge', name: seName, status: 'active' })
    })
  }

  // ── SolarEdge Solar ──────────────────────────────────────────────────────
  async function handleTestSolarSe() {
    setSolarSeError(''); setSolarSeOk(false); setSolarSeName('')
    if (!solarSeKey.trim() || !solarSeSiteId.trim()) { setSolarSeError('Vul je API key en site ID in.'); return }
    setSolarSeTesting(true)
    const r = await testSolarEdgeCredentials(solarSeKey.trim(), solarSeSiteId.trim())
    setSolarSeTesting(false)
    if (!r.ok) { setSolarSeError(r.error ?? 'Verificatie mislukt.'); return }
    setSolarSeName(r.siteName ?? `Site ${solarSeSiteId}`)
    setSolarSeOk(true)
  }

  function handleSaveSolarSe() {
    if (!solarSeOk) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'solar_solaredge',
        brand: 'SolarEdge',
        label: solarSeName,
        config: { apiKey: solarSeKey.trim(), siteId: solarSeSiteId.trim() },
        status: 'active',
      })
      if (r.error) { setSolarSeError(r.error); return }
      addDevice({ type: 'solar_solaredge', brand: 'SolarEdge', name: solarSeName, status: 'active' })
    })
  }

  // ── Fronius ──────────────────────────────────────────────────────────────
  async function handleTestFronius() {
    setFroniusError(''); setFroniusOk(false)
    if (!froniusIp.trim()) { setFroniusError('Voer het IP-adres in.'); return }
    setFroniusTesting(true)
    const r = await testFroniusConnection(froniusIp.trim())
    setFroniusTesting(false)
    r.ok ? setFroniusOk(true) : setFroniusError(r.error ?? 'Verbinding mislukt.')
  }

  function handleSaveFronius() {
    if (!froniusOk) return
    startTransition(async () => {
      const r = await saveDevice({
        type: 'solar_fronius',
        brand: 'Fronius',
        label: `Fronius (${froniusIp.trim()})`,
        config: { ip: froniusIp.trim() },
        status: 'active',
      })
      if (r.error) { setFroniusError(r.error); return }
      addDevice({ type: 'solar_fronius', brand: 'Fronius', name: `Fronius (${froniusIp.trim()})`, status: 'active' })
    })
  }

  // ── SMA ──────────────────────────────────────────────────────────────────
  async function handleTestSma() {
    setSmaError('')
    if (!smaEmail.trim() || !smaPass.trim()) { setSmaError('Vul je e-mail en wachtwoord in.'); return }
    setSmaTesting(true)
    const r = await testSmaCredentials(smaEmail.trim(), smaPass.trim())
    setSmaTesting(false)
    setSmaError(r.error ?? 'Onbekende fout.')
  }

  // ── Warmtepomp ─────────────────────────────────────────────────────────────
  async function handleTestHeatpump() {
    setHeatpumpError(''); setHeatpumpOk(false); setHeatpumpHome('')
    if (!heatpumpEmail.trim() || !heatpumpPass.trim()) { setHeatpumpError('Vul je e-mail en wachtwoord in.'); return }
    setHeatpumpTesting(true)
    const r = await testTadoCredentials(heatpumpEmail.trim(), heatpumpPass.trim())
    setHeatpumpTesting(false)
    if (!r.ok) { setHeatpumpError(r.error ?? 'Inloggen mislukt.'); return }
    setHeatpumpHome(r.homeName ?? '')
    if (r.error) setHeatpumpError(r.error)
    setHeatpumpOk(true)
  }

  function handleSaveHeatpump() {
    if (heatpumpBrand === 'tado') {
      if (!heatpumpOk) return
      startTransition(async () => {
        const r = await saveDevice({
          type: 'heatpump_tado', brand: 'Tado', label: 'Warmtepomp',
          config: { username: heatpumpEmail.trim(), password: heatpumpPass.trim() },
          status: 'active',
        })
        if (r.error) { setHeatpumpError(r.error); return }
        addDevice({ type: 'heatpump_tado', brand: 'Tado', name: 'Warmtepomp', status: 'active' })
      })
    } else {
      const label = heatpumpLabel.trim() || 'Warmtepomp'
      startTransition(async () => {
        const r = await saveDevice({
          type: 'heatpump_generic', brand: 'Warmtepomp', label,
          config: {}, status: 'pending',
        })
        if (r.error) { setHeatpumpError(r.error); return }
        addDevice({ type: 'heatpump_generic', brand: 'Warmtepomp', name: label, status: 'pending' })
      })
    }
  }

  // ── Verwijderen ──────────────────────────────────────────────────────────
  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteDevice(id)
      setDevices(prev => prev.filter(d => d.id !== id))
      setDeletingId(null)
    })
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[var(--text)]">Koppelingen</h1>
          <p className="mt-1 text-sm text-[var(--text-faint)]">Verbind je slimme meter, batterij of energiecontract.</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#047857] px-5 text-sm font-medium text-white transition-colors hover:bg-[#059669]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Apparaat toevoegen
        </button>
      </div>

      {/* Device list */}
      {devices.length === 0 ? (
        <EmptyState onAdd={openModal} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => {
            const statusInfo = STATUS_LABEL[device.status] ?? STATUS_LABEL.pending
            return (
              <div key={device.id} className="relative rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[var(--surface)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-[var(--surface)]">
                      {(() => { const Icon = DEVICE_ICONS[device.type] ?? Plug; return <Icon className="h-5 w-5 text-[var(--text-faint)] dark:text-[var(--text-muted)]" /> })()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-[var(--text)]">{device.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{device.brand}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(device.id)}
                    disabled={deletingId === device.id}
                    className="text-[var(--text-muted)] transition-colors hover:text-red-400 dark:text-[var(--text-faint)]"
                    title="Verwijderen"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${device.status === 'active' ? 'bg-emerald-500' : device.status === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {step !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-900 dark:text-[var(--text)]">
                {MODAL_TITLES[step] ?? ''}
              </h2>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-faint)]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
              {step === 'category' && <CategoryStep onSelect={setStep} />}

              {step === 'tibber-token' && (
                <TibberStep
                  token={tibberToken} onTokenChange={setTibberToken}
                  onTest={handleTestTibber} onSave={handleSaveTibber}
                  onBack={() => setStep('category')}
                  testPending={tibberTesting} savePending={isPending}
                  tibberName={tibberName} error={tibberError}
                />
              )}

              {step === 'p1-setup' && (
                <P1Step
                  ip={p1Ip} onIpChange={setP1Ip}
                  onSave={handleSaveP1} onBack={() => setStep('category')}
                  pending={isPending} error={p1Error}
                />
              )}

              {step === 'sessy-setup' && (
                <SessyStep
                  username={sessyUser} password={sessyPass}
                  onUsernameChange={setSessyUser} onPasswordChange={setSessyPass}
                  onTest={handleTestSessy} onSave={handleSaveSessy}
                  onBack={() => setStep('category')}
                  testPending={sessyTesting} savePending={isPending}
                  verified={sessyOk} error={sessyError}
                />
              )}

              {step === 'victron-setup' && (
                <VictronStep
                  email={victronEmail} password={victronPass}
                  onEmailChange={setVictronEmail} onPasswordChange={setVictronPass}
                  sites={victronSites} selectedSiteId={victronSiteId}
                  onSelectSite={(id, name) => { setVictronSiteId(id); setVictronSiteName(name) }}
                  onTest={handleTestVictron} onSave={handleSaveVictron}
                  onBack={() => setStep('category')}
                  testPending={victronTesting} savePending={isPending}
                  verified={victronOk} error={victronError}
                />
              )}

              {step === 'enphase-setup' && (
                <EnphaseStep
                  apiKey={enphaseKey} systemId={enphaseId}
                  onApiKeyChange={setEnphaseKey} onSystemIdChange={setEnphaseId}
                  systemName={enphaseName}
                  onTest={handleTestEnphase} onSave={handleSaveEnphase}
                  onBack={() => setStep('category')}
                  testPending={enphaseTesting} savePending={isPending}
                  verified={enphaseOk} error={enphaseError}
                />
              )}

              {step === 'solaredge-setup' && (
                <SolarEdgeStep
                  apiKey={seKey} siteId={seSiteId}
                  onApiKeyChange={setSeKey} onSiteIdChange={setSeSiteId}
                  siteName={seName}
                  onTest={handleTestSolarEdge} onSave={handleSaveSolarEdge}
                  onBack={() => setStep('category')}
                  testPending={seTesting} savePending={isPending}
                  verified={seOk} error={seError}
                />
              )}

              {step === 'solar-solaredge-setup' && (
                <SolarSolarEdgeStep
                  apiKey={solarSeKey} siteId={solarSeSiteId}
                  onApiKeyChange={setSolarSeKey} onSiteIdChange={setSolarSeSiteId}
                  siteName={solarSeName}
                  onTest={handleTestSolarSe} onSave={handleSaveSolarSe}
                  onBack={() => setStep('category')}
                  testPending={solarSeTesting} savePending={isPending}
                  verified={solarSeOk} error={solarSeError}
                />
              )}

              {step === 'solar-fronius-setup' && (
                <FroniusStep
                  ip={froniusIp} onIpChange={setFroniusIp}
                  onTest={handleTestFronius} onSave={handleSaveFronius}
                  onBack={() => setStep('category')}
                  testPending={froniusTesting} savePending={isPending}
                  verified={froniusOk} error={froniusError}
                />
              )}

              {step === 'solar-sma-setup' && (
                <SmaStep
                  email={smaEmail} password={smaPass}
                  onEmailChange={setSmaEmail} onPasswordChange={setSmaPass}
                  onTest={handleTestSma} onBack={() => setStep('category')}
                  testPending={smaTesting} error={smaError}
                />
              )}

              {step === 'heatpump-setup' && (
                <HeatpumpStep
                  brand={heatpumpBrand} onBrandChange={setHeatpumpBrand}
                  email={heatpumpEmail} password={heatpumpPass}
                  onEmailChange={setHeatpumpEmail} onPasswordChange={setHeatpumpPass}
                  label={heatpumpLabel} onLabelChange={setHeatpumpLabel}
                  homeName={heatpumpHome}
                  onTest={handleTestHeatpump} onSave={handleSaveHeatpump}
                  onBack={() => setStep('category')}
                  testPending={heatpumpTesting} savePending={isPending}
                  verified={heatpumpOk} error={heatpumpError}
                />
              )}

              {step === 'battery-other' && <BatteryOtherStep onBack={() => setStep('category')} />}

              {step === 'done' && (
                <div className="py-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-950">✓</div>
                  <p className="mt-3 text-sm font-medium text-emerald-600">Apparaat opgeslagen!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Category step ──────────────────────────────────────────────────────────

const METER_CATEGORIES = [
  { id: 'tibber-token' as Step, icon: Zap,   title: 'Tibber',   sub: 'Dynamisch energiecontract' },
  { id: 'p1-setup'     as Step, icon: Gauge, title: 'P1 Meter', sub: 'HomeWizard via lokaal netwerk' },
] as const

const BATTERY_CATEGORIES = [
  { id: 'sessy-setup'    as Step, icon: BatteryCharging, title: 'Sessy',            sub: 'Thuisbatterij via my.sessy.nl' },
  { id: 'victron-setup'  as Step, icon: BatteryCharging, title: 'Victron Energy',   sub: 'Via VRM cloud portal' },
  { id: 'enphase-setup'  as Step, icon: Sun,             title: 'Enphase',          sub: 'Encharge via Enlighten portal' },
  { id: 'solaredge-setup'as Step, icon: CloudSun,        title: 'SolarEdge',        sub: 'StorEdge via monitoring portal' },
  { id: 'battery-other'  as Step, icon: Plug,            title: 'Andere batterij',  sub: 'Tesla, GoodWe, Growatt…', soon: true },
] as const

const SOLAR_CATEGORIES = [
  { id: 'solar-solaredge-setup' as Step, icon: Sun, title: 'SolarEdge',  sub: 'Via monitoring portal API' },
  { id: 'solar-fronius-setup'   as Step, icon: Sun, title: 'Fronius',    sub: 'Lokale omvormer via IP-adres' },
  { id: 'solar-sma-setup'       as Step, icon: Sun, title: 'SMA',        sub: 'Sunny Portal', soon: true },
] as const

// Roadmap: alles onder één dak. Nog niet koppelbaar, wel zichtbaar.
const HEATING_CATEGORIES = [
  { id: 'heatpump-setup' as Step, icon: Flame,       title: 'Warmtepomp',         sub: 'Tado of handmatig' },
  { id: 'idle' as Step,           icon: Thermometer, title: 'Slimme thermostaat', sub: 'Tado, Nest, Honeywell', soon: true },
] as const

const CHARGING_CATEGORIES = [
  { id: 'idle' as Step, icon: Car,             title: 'Laadpaal — slim laden',     sub: 'Laad je auto op de goedkoopste uren', soon: true },
  { id: 'idle' as Step, icon: BatteryCharging, title: 'V2G — auto als thuisbatterij', sub: 'Voed je huis met je auto-accu',        soon: true },
] as const

function CategoryList({
  items,
  onSelect,
}: {
  items: ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }>
  onSelect: (s: Step) => void
}) {
  return (
    <>
      {items.map((cat) => {
        const isSoon = cat.soon === true
        const Icon = cat.icon
        return (
          <button
            key={cat.id}
            onClick={() => !isSoon && onSelect(cat.id)}
            disabled={isSoon}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
              isSoon
                ? 'cursor-default border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-[var(--surface)]/50'
                : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-[var(--surface)] dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30'
            }`}
          >
            <Icon className="h-6 w-6 shrink-0 text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-[var(--text)]">{cat.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{cat.sub}</p>
            </div>
            {isSoon ? (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-[var(--text-faint)] dark:bg-slate-700 dark:text-[var(--text-muted)]">
                Binnenkort
              </span>
            ) : (
              <svg className="h-4 w-4 shrink-0 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )
      })}
    </>
  )
}

function CategoryStep({ onSelect }: { onSelect: (s: Step) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Energie & meter</p>
        <div className="grid gap-2">
          <CategoryList items={[...METER_CATEGORIES]} onSelect={onSelect} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Thuisbatterij</p>
        <div className="grid gap-2">
          <CategoryList items={[...BATTERY_CATEGORIES]} onSelect={onSelect} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Zonnepanelen</p>
        <div className="grid gap-2">
          <CategoryList items={[...SOLAR_CATEGORIES]} onSelect={onSelect} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Auto &amp; laden</p>
        <div className="grid gap-2">
          <CategoryList items={[...CHARGING_CATEGORIES]} onSelect={onSelect} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Verwarming</p>
        <div className="grid gap-2">
          <CategoryList items={[...HEATING_CATEGORIES]} onSelect={onSelect} />
        </div>
      </div>
    </div>
  )
}

// ── Input field helper ─────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-[var(--surface)] dark:text-[var(--text)]"
    />
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-950/30">{msg}</p>
}

function SuccessBox({ msg }: { msg: string }) {
  return <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">{msg}</p>
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm text-[var(--text-faint)] hover:bg-slate-50 dark:border-slate-700 dark:text-[var(--text-muted)]">
      Terug
    </button>
  )
}

function SaveBtn({ onClick, pending, label }: { onClick: () => void; pending: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={pending} className="flex-1 rounded-xl bg-[#047857] py-2.5 text-sm font-medium text-white hover:bg-[#059669] disabled:opacity-50">
      {pending ? 'Opslaan…' : (label ?? 'Koppeling opslaan')}
    </button>
  )
}

function TestBtn({ onClick, pending, label }: { onClick: () => void; pending: boolean; label?: string }) {
  return (
    <button onClick={onClick} disabled={pending} className="flex-1 rounded-xl bg-[#047857] py-2.5 text-sm font-medium text-white hover:bg-[#059669] disabled:opacity-50">
      {pending ? 'Verifiëren…' : (label ?? 'Verbinding testen')}
    </button>
  )
}

// ── Tibber step ────────────────────────────────────────────────────────────

function TibberStep({ token, onTokenChange, onTest, onSave, onBack, testPending, savePending, tibberName, error }: {
  token: string; onTokenChange: (v: string) => void; onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; tibberName: string; error: string
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">
        Ga naar{' '}
        <a href="https://developer.tibber.com/settings/access-token" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
          developer.tibber.com
        </a>{' '}
        en kopieer je persoonlijke toegangstoken.
      </p>
      <Field label="Tibber API token">
        <Input type="password" value={token} onChange={e => onTokenChange(e.target.value)} placeholder="dXNlcjox…" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {tibberName && <SuccessBox msg={`✓ Verbonden als ${tibberName}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!tibberName
          ? <TestBtn onClick={onTest} pending={testPending || !token.trim()} />
          : <SaveBtn onClick={onSave} pending={savePending} />
        }
      </div>
    </div>
  )
}

// ── Sessy step ─────────────────────────────────────────────────────────────

function SessyStep({ username, password, onUsernameChange, onPasswordChange, onTest, onSave, onBack, testPending, savePending, verified, error }: {
  username: string; password: string; onUsernameChange: (v: string) => void; onPasswordChange: (v: string) => void
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Je Sessy account</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Gebruik je inloggegevens van <strong>my.sessy.nl</strong>. Je batterij blijft volledig onder jouw controle.</p>
      </div>
      <Field label="E-mailadres">
        <Input type="email" value={username} onChange={e => onUsernameChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label="Wachtwoord">
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg="✓ Sessy account geverifieerd — klaar om te koppelen" />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !username.trim() || !password.trim()} label="Account verifiëren" />
          : <SaveBtn onClick={onSave} pending={savePending} label="Batterij koppelen" />
        }
      </div>
    </div>
  )
}

// ── Victron step ───────────────────────────────────────────────────────────

function VictronStep({
  email, password, onEmailChange, onPasswordChange,
  sites, selectedSiteId, onSelectSite,
  onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  email: string; password: string; onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void
  sites: { idSite: number; name: string }[]
  selectedSiteId: number | null
  onSelectSite: (id: number, name: string) => void
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">VRM Portal account</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Gebruik je inloggegevens van{' '}
          <a href="https://vrm.victronenergy.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">vrm.victronenergy.com</a>.
        </p>
      </div>
      <Field label="E-mailadres">
        <Input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label="Wachtwoord">
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && sites.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">
            ✓ {sites.length} installatie{sites.length !== 1 ? 's' : ''} gevonden — selecteer er één:
          </p>
          <div className="space-y-1.5">
            {sites.map(s => (
              <button
                key={s.idSite}
                onClick={() => onSelectSite(s.idSite, s.name)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedSiteId === s.idSite
                    ? 'border-emerald-400 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !email.trim() || !password.trim()} label="Inloggen & verificeren" />
          : <SaveBtn onClick={onSave} pending={savePending || !selectedSiteId} label="Batterij koppelen" />
        }
      </div>
    </div>
  )
}

// ── Enphase step ───────────────────────────────────────────────────────────

function EnphaseStep({
  apiKey, systemId, onApiKeyChange, onSystemIdChange,
  systemName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  apiKey: string; systemId: string
  onApiKeyChange: (v: string) => void; onSystemIdChange: (v: string) => void
  systemName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Enlighten API toegang</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Haal je API key op via{' '}
          <a href="https://developer.enphase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">developer.enphase.com</a>.
          Je systeem ID staat in de URL van je{' '}
          <a href="https://enlighten.enphaseenergy.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Enlighten portal</a>.
        </p>
      </div>
      <Field label="API key">
        <Input type="password" value={apiKey} onChange={e => onApiKeyChange(e.target.value)} placeholder="••••••••••••••••" />
      </Field>
      <Field label="Systeem ID" hint="Cijfer in de URL: enlighten.enphaseenergy.com/systems/123456">
        <Input type="text" value={systemId} onChange={e => onSystemIdChange(e.target.value)} placeholder="123456" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ Systeem gevonden: ${systemName}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !apiKey.trim() || !systemId.trim()} />
          : <SaveBtn onClick={onSave} pending={savePending} label="Batterij koppelen" />
        }
      </div>
    </div>
  )
}

// ── SolarEdge step ─────────────────────────────────────────────────────────

function SolarEdgeStep({
  apiKey, siteId, onApiKeyChange, onSiteIdChange,
  siteName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  apiKey: string; siteId: string
  onApiKeyChange: (v: string) => void; onSiteIdChange: (v: string) => void
  siteName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Monitoring portal toegang</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Activeer API toegang via{' '}
          <a href="https://monitoring.solaredge.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">monitoring.solaredge.com</a>{' '}
          → Admin → Site Access → API Access.
        </p>
      </div>
      <Field label="API key">
        <Input type="password" value={apiKey} onChange={e => onApiKeyChange(e.target.value)} placeholder="••••••••••••••••" />
      </Field>
      <Field label="Site ID" hint="Te vinden in de URL: monitoring.solaredge.com/solaredge-web/p/site/123456">
        <Input type="text" value={siteId} onChange={e => onSiteIdChange(e.target.value)} placeholder="123456" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ Site gevonden: ${siteName}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !apiKey.trim() || !siteId.trim()} />
          : <SaveBtn onClick={onSave} pending={savePending} label="Systeem koppelen" />
        }
      </div>
    </div>
  )
}

// ── P1 step ────────────────────────────────────────────────────────────────

function P1Step({ ip, onIpChange, onSave, onBack, pending, error }: {
  ip: string; onIpChange: (v: string) => void; onSave: () => void; onBack: () => void; pending: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">Zorg dat je HomeWizard P1 meter op hetzelfde netwerk zit. Vind het IP-adres via je router of de HomeWizard app.</p>
      <Field label="IP-adres">
        <Input type="text" value={ip} onChange={e => onIpChange(e.target.value)} placeholder="192.168.1.42" />
      </Field>
      {error && <ErrorBox msg={error} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        <SaveBtn onClick={onSave} pending={pending || !ip.trim()} />
      </div>
    </div>
  )
}

// ── SolarEdge Solar step ───────────────────────────────────────────────────

function SolarSolarEdgeStep({
  apiKey, siteId, onApiKeyChange, onSiteIdChange,
  siteName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  apiKey: string; siteId: string
  onApiKeyChange: (v: string) => void; onSiteIdChange: (v: string) => void
  siteName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Monitoring portal toegang</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Activeer API toegang via{' '}
          <a href="https://monitoring.solaredge.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">monitoring.solaredge.com</a>{' '}
          → Admin → Site Access → API Access.
        </p>
      </div>
      <Field label="API key">
        <Input type="password" value={apiKey} onChange={e => onApiKeyChange(e.target.value)} placeholder="••••••••••••••••" />
      </Field>
      <Field label="Site ID" hint="Te vinden in de URL: monitoring.solaredge.com/solaredge-web/p/site/123456">
        <Input type="text" value={siteId} onChange={e => onSiteIdChange(e.target.value)} placeholder="123456" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ Site gevonden: ${siteName}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !apiKey.trim() || !siteId.trim()} />
          : <SaveBtn onClick={onSave} pending={savePending} label="Zonnepanelen koppelen" />
        }
      </div>
    </div>
  )
}

// ── Fronius step ───────────────────────────────────────────────────────────

function FroniusStep({
  ip, onIpChange, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  ip: string; onIpChange: (v: string) => void
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
        <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Lokale netwerkkoppeling</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Je Fronius omvormer moet op hetzelfde lokale netwerk zitten. Zoek het IP-adres via je router of de Fronius Solar.web app.
        </p>
      </div>
      <Field label="IP-adres van de omvormer" hint="Bijv. 192.168.1.100">
        <Input type="text" value={ip} onChange={e => onIpChange(e.target.value)} placeholder="192.168.1.100" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg="✓ Fronius omvormer bereikbaar — klaar om te koppelen" />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !ip.trim()} label="Verbinding testen" />
          : <SaveBtn onClick={onSave} pending={savePending} label="Omvormer koppelen" />
        }
      </div>
    </div>
  )
}

// ── SMA step ───────────────────────────────────────────────────────────────

function SmaStep({
  email, password, onEmailChange, onPasswordChange,
  onTest, onBack, testPending, error,
}: {
  email: string; password: string
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void
  onTest: () => void; onBack: () => void
  testPending: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/20">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Binnenkort beschikbaar</p>
        <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-500/80">
          SMA Sunny Portal integratie is in ontwikkeling. Neem contact op voor vroege toegang.
        </p>
      </div>
      <Field label="E-mailadres (Sunny Portal)">
        <Input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label="Wachtwoord">
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} />
        <TestBtn onClick={onTest} pending={testPending || !email.trim() || !password.trim()} label="Status controleren" />
      </div>
    </div>
  )
}

// ── Warmtepomp step ────────────────────────────────────────────────────────

function HeatpumpStep({
  brand, onBrandChange,
  email, password, onEmailChange, onPasswordChange,
  label, onLabelChange,
  homeName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  brand: 'tado' | 'generic'
  onBrandChange: (b: 'tado' | 'generic') => void
  email: string; password: string
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void
  label: string; onLabelChange: (v: string) => void
  homeName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">
        Koppel je warmtepomp om slim te verwarmen op de goedkoopste uren. Kies je merk.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onBrandChange('tado')}
          className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
            brand === 'tado'
              ? 'border-emerald-400 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
          }`}
        >
          <span className="block font-medium">Tado</span>
          <span className="block text-xs text-[var(--text-muted)]">Via je Tado account</span>
        </button>
        <button
          onClick={() => onBrandChange('generic')}
          className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
            brand === 'generic'
              ? 'border-emerald-400 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
          }`}
        >
          <span className="block font-medium">Andere (handmatig)</span>
          <span className="block text-xs text-[var(--text-muted)]">Adviezen zonder koppeling</span>
        </button>
      </div>

      {brand === 'tado' ? (
        <>
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
            <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Je Tado account</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Gebruik je inloggegevens van{' '}
              <a href="https://app.tado.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">app.tado.com</a>.
              Je warmtepomp blijft volledig onder jouw controle.
            </p>
          </div>
          <Field label="E-mailadres">
            <Input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="naam@email.nl" />
          </Field>
          <Field label="Wachtwoord">
            <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
          </Field>
          {error && <ErrorBox msg={error} />}
          {verified && <SuccessBox msg={homeName ? `✓ Tado account geverifieerd: ${homeName}` : '✓ Tado account geverifieerd — klaar om te koppelen'} />}
          <div className="flex gap-2 pt-1">
            <BackBtn onClick={onBack} />
            {!verified
              ? <TestBtn onClick={onTest} pending={testPending || !email.trim() || !password.trim()} label="Account verifiëren" />
              : <SaveBtn onClick={onSave} pending={savePending} label="Warmtepomp koppelen" />
            }
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-[var(--surface)]">
            <p className="text-xs font-medium text-[var(--text-faint)] dark:text-[var(--text-muted)]">Handmatige warmtepomp</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Geen directe koppeling. Je ontvangt adviezen over de goedkoopste uren om te verwarmen, die je zelf kunt instellen.
            </p>
          </div>
          <Field label="Naam" hint="Bijv. Warmtepomp woonkamer">
            <Input type="text" value={label} onChange={e => onLabelChange(e.target.value)} placeholder="Warmtepomp" />
          </Field>
          {error && <ErrorBox msg={error} />}
          <div className="flex gap-2 pt-1">
            <BackBtn onClick={onBack} />
            <SaveBtn onClick={onSave} pending={savePending} label="Warmtepomp toevoegen" />
          </div>
        </>
      )}
    </div>
  )
}

// ── Battery other step ─────────────────────────────────────────────────────

const OTHER_BRANDS = ['Tesla Powerwall', 'GoodWe', 'Growatt', 'Huawei FusionSolar', 'Alpha ESS', 'Pylontech']

function BatteryOtherStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">Directe koppelingen voor deze merken komen binnenkort via partner-API&apos;s.</p>
      <div className="grid grid-cols-2 gap-2">
        {OTHER_BRANDS.map(b => (
          <div key={b} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-[var(--surface)]/50">
            <span className="text-sm text-[var(--text-faint)]">{b}</span>
            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] dark:bg-slate-700">Binnenkort</span>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm text-[var(--text-faint)] hover:bg-slate-50 dark:border-slate-700 dark:text-[var(--text-muted)]">Terug</button>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[var(--surface)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20"><Plug className="h-6 w-6 text-emerald-400" /></div>
      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-[var(--text)]">Nog geen apparaten gekoppeld</h2>
      <p className="mt-2 text-sm text-[var(--text-faint)]">Voeg je slimme meter, batterij of energiecontract toe om te beginnen.</p>
      <button onClick={onAdd} className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-medium text-white transition-colors hover:bg-[#059669]">
        Apparaat toevoegen
      </button>
    </div>
  )
}
