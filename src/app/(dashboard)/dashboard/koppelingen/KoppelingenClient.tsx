'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import {
  saveDevice, deleteDevice,
  testTibberToken, testSessyCredentials,
  testVictronCredentials, testSolarEdgeCredentials,
  testFroniusConnection, testSmaCredentials,
  startTadoAuth, pollTadoAuth,
  type DeviceType,
} from './actions'
import { Zap, Gauge, BatteryCharging, Sun, CloudSun, Plug, Flame, Thermometer, Car } from 'lucide-react'
import { useT, fill } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

type Conn = TranslationDict['dashboard']['connections']

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

function statusLabel(status: string, c: Conn): { label: string; color: string } {
  if (status === 'active') return { label: c.statusConnected, color: 'text-emerald-500' }
  if (status === 'error') return { label: c.statusError, color: 'text-red-500' }
  return { label: c.statusConnecting, color: 'text-amber-500' }
}

function modalTitle(step: Step, c: Conn): string {
  const titles: Partial<Record<Step, string>> = {
    category:                c.modalCategory,
    'tibber-token':          c.modalTibber,
    'p1-setup':              c.modalP1,
    'sessy-setup':           c.modalSessy,
    'victron-setup':         c.modalVictron,
    'enphase-setup':         c.modalEnphase,
    'solaredge-setup':       c.modalSolarEdge,
    'battery-other':         c.modalBatteryOther,
    'solar-solaredge-setup': c.modalSolarSolarEdge,
    'solar-fronius-setup':   c.modalFronius,
    'solar-sma-setup':       c.modalSma,
    'heatpump-setup':        c.modalHeatpump,
    done:                    c.modalDone,
  }
  return titles[step] ?? ''
}

export default function KoppelingenClient({ initialDevices }: { initialDevices: Device[] }) {
  const { t } = useT()
  const c = t.dashboard.connections
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

  // Warmtepomp (Tado device-code flow / handmatig)
  const [heatpumpBrand,   setHeatpumpBrand]   = useState<'tado' | 'generic'>('tado')
  const [heatpumpLabel,   setHeatpumpLabel]   = useState('')
  const [heatpumpHome,    setHeatpumpHome]    = useState('')
  const [heatpumpError,   setHeatpumpError]   = useState('')
  // Tado device-flow status: idle → waiting (gebruiker keurt goed) → connected
  const [tadoStatus,    setTadoStatus]    = useState<'idle' | 'starting' | 'waiting' | 'connected'>('idle')
  const [tadoUserCode,  setTadoUserCode]  = useState('')
  const [tadoVerifyUrl, setTadoVerifyUrl] = useState('')
  const tadoDeviceCode = useRef('')
  const tadoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  function openModal() {
    setStep('category')
    setTibberToken(''); setTibberName(''); setTibberError('')
    setP1Ip(''); setP1Error('')
    setSessyUser(''); setSessyPass(''); setSessyOk(false); setSessyError('')
    setVictronEmail(''); setVictronPass(''); setVictronIdUser(null)
    setVictronSites([]); setVictronSiteId(null); setVictronSiteName('')
    setVictronOk(false); setVictronError('')
    setSeKey(''); setSeSiteId(''); setSeName(''); setSeOk(false); setSeError('')
    setSolarSeKey(''); setSolarSeSiteId(''); setSolarSeName(''); setSolarSeOk(false); setSolarSeError('')
    setFroniusIp(''); setFroniusOk(false); setFroniusError('')
    setSmaEmail(''); setSmaPass(''); setSmaError('')
    setHeatpumpBrand('tado'); setHeatpumpLabel(''); setHeatpumpHome('')
    setHeatpumpError(''); resetTado()
  }
  function resetTado() {
    if (tadoTimer.current) { clearInterval(tadoTimer.current); tadoTimer.current = null }
    tadoDeviceCode.current = ''
    setTadoStatus('idle'); setTadoUserCode(''); setTadoVerifyUrl('')
  }
  function closeModal() { resetTado(); setStep('idle') }

  // Stop de Tado-poll als de modal sluit / component unmount.
  useEffect(() => () => { if (tadoTimer.current) clearInterval(tadoTimer.current) }, [])

  function addDevice(partial: Omit<Device, 'id' | 'created_at'>) {
    setDevices(prev => [...prev, { ...partial, id: crypto.randomUUID(), created_at: new Date().toISOString() }])
    setStep('done')
    setTimeout(closeModal, 1200)
  }

  // ── Tibber ──────────────────────────────────────────────────────────────
  async function handleTestTibber() {
    setTibberError(''); setTibberName('')
    if (!tibberToken.trim()) { setTibberError(c.errEnterToken); return }
    setTibberTesting(true)
    const r = await testTibberToken(tibberToken.trim())
    setTibberTesting(false)
    r.ok ? setTibberName(r.name ?? '') : setTibberError(r.error ?? c.errUnknown)
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
    if (!p1Ip.trim()) { setP1Error(c.errEnterIp); return }
    startTransition(async () => {
      const r = await saveDevice({ type: 'meter_p1', brand: 'HomeWizard', label: 'P1 Meter', config: { ip: p1Ip.trim() } })
      if (r.error) { setP1Error(r.error); return }
      addDevice({ type: 'meter_p1', brand: 'HomeWizard', name: 'P1 Meter', status: 'pending' })
    })
  }

  // ── Sessy ────────────────────────────────────────────────────────────────
  async function handleTestSessy() {
    setSessyError(''); setSessyOk(false)
    if (!sessyUser.trim() || !sessyPass.trim()) { setSessyError(c.errEnterEmailPassword); return }
    setSessyTesting(true)
    const r = await testSessyCredentials(sessyUser.trim(), sessyPass.trim())
    setSessyTesting(false)
    r.ok ? setSessyOk(true) : setSessyError(r.error ?? c.errLoginFailed)
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
    if (!victronEmail.trim() || !victronPass.trim()) { setVictronError(c.errEnterEmailPassword); return }
    setVictronTesting(true)
    const r = await testVictronCredentials(victronEmail.trim(), victronPass.trim())
    setVictronTesting(false)
    if (!r.ok) { setVictronError(r.error ?? c.errLoginFailed); return }
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

  // ── SolarEdge ────────────────────────────────────────────────────────────
  async function handleTestSolarEdge() {
    setSeError(''); setSeOk(false); setSeName('')
    if (!seKey.trim() || !seSiteId.trim()) { setSeError(c.errEnterApiSite); return }
    setSeTesting(true)
    const r = await testSolarEdgeCredentials(seKey.trim(), seSiteId.trim())
    setSeTesting(false)
    if (!r.ok) { setSeError(r.error ?? c.errVerifyFailed); return }
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
    if (!solarSeKey.trim() || !solarSeSiteId.trim()) { setSolarSeError(c.errEnterApiSite); return }
    setSolarSeTesting(true)
    const r = await testSolarEdgeCredentials(solarSeKey.trim(), solarSeSiteId.trim())
    setSolarSeTesting(false)
    if (!r.ok) { setSolarSeError(r.error ?? c.errVerifyFailed); return }
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
    if (!froniusIp.trim()) { setFroniusError(c.errEnterIp); return }
    setFroniusTesting(true)
    const r = await testFroniusConnection(froniusIp.trim())
    setFroniusTesting(false)
    r.ok ? setFroniusOk(true) : setFroniusError(r.error ?? c.errConnectionFailed)
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
    if (!smaEmail.trim() || !smaPass.trim()) { setSmaError(c.errEnterEmailPassword); return }
    setSmaTesting(true)
    const r = await testSmaCredentials(smaEmail.trim(), smaPass.trim())
    setSmaTesting(false)
    setSmaError(r.error ?? c.errUnknown)
  }

  // ── Warmtepomp — Tado device-code flow ─────────────────────────────────────
  // 1. Start: vraag een device-code aan en open de Tado-goedkeuringspagina.
  // 2. Poll: wacht tot de gebruiker goedkeurt, sla dan het refresh-token op.
  async function handleStartTado() {
    setHeatpumpError(''); resetTado(); setTadoStatus('starting')
    const r = await startTadoAuth()
    if (!r.ok || !r.deviceCode || !r.userCode || !r.verificationUri) {
      setTadoStatus('idle'); setHeatpumpError(r.error ?? c.errLoginFailed); return
    }
    tadoDeviceCode.current = r.deviceCode
    setTadoUserCode(r.userCode)
    setTadoVerifyUrl(r.verificationUri)
    setTadoStatus('waiting')
    // Open de goedkeuringspagina meteen in een nieuw tabblad.
    window.open(r.verificationUri, '_blank', 'noopener,noreferrer')
    const intervalMs = Math.max((r.interval ?? 5), 5) * 1000
    tadoTimer.current = setInterval(pollTado, intervalMs)
  }

  async function pollTado() {
    if (!tadoDeviceCode.current) return
    const r = await pollTadoAuth(tadoDeviceCode.current)
    if (r.status === 'pending') return
    if (tadoTimer.current) { clearInterval(tadoTimer.current); tadoTimer.current = null }
    if (r.status !== 'ok' || !r.refreshToken) {
      setTadoStatus('idle')
      setHeatpumpError(r.status === 'expired' ? c.tadoExpired : r.status === 'denied' ? c.tadoDenied : c.errLoginFailed)
      return
    }
    setHeatpumpHome(r.homeName ?? '')
    const refreshToken = r.refreshToken
    const name = r.homeName ? `Tado (${r.homeName})` : 'Warmtepomp'
    startTransition(async () => {
      const save = await saveDevice({
        type: 'heatpump_tado', brand: 'Tado', label: name,
        config: { refresh_token: refreshToken },
        status: 'active',
      })
      if (save.error) { setTadoStatus('idle'); setHeatpumpError(save.error); return }
      addDevice({ type: 'heatpump_tado', brand: 'Tado', name, status: 'active' })
      setTadoStatus('connected')
    })
  }

  function handleSaveHeatpumpGeneric() {
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
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{c.title}</h1>
          <p className="mt-1 text-sm text-[var(--text-faint)]">{c.subtitle}</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#047857] px-5 text-sm font-medium text-white transition-colors hover:bg-[#059669]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {c.addDevice}
        </button>
      </div>

      {/* Device list */}
      {devices.length === 0 ? (
        <EmptyState onAdd={openModal} c={c} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => {
            const statusInfo = statusLabel(device.status, c)
            return (
              <div key={device.id} className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                      {(() => { const Icon = DEVICE_ICONS[device.type] ?? Plug; return <Icon className="h-5 w-5 text-[var(--text-muted)]" /> })()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{device.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{device.brand}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(device.id)}
                    disabled={deletingId === device.id}
                    className="text-[var(--text-faint)] transition-colors hover:text-red-400"
                    title={c.delete}
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
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 className="text-base font-semibold text-[var(--text)]">
                {modalTitle(step, c)}
              </h2>
              <button onClick={closeModal} className="text-[var(--text-muted)] hover:text-[var(--text-faint)]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
              {step === 'category' && <CategoryStep onSelect={setStep} c={c} />}

              {step === 'tibber-token' && (
                <TibberStep
                  c={c}
                  token={tibberToken} onTokenChange={setTibberToken}
                  onTest={handleTestTibber} onSave={handleSaveTibber}
                  onBack={() => setStep('category')}
                  testPending={tibberTesting} savePending={isPending}
                  tibberName={tibberName} error={tibberError}
                />
              )}

              {step === 'p1-setup' && (
                <P1Step
                  c={c}
                  ip={p1Ip} onIpChange={setP1Ip}
                  onSave={handleSaveP1} onBack={() => setStep('category')}
                  pending={isPending} error={p1Error}
                />
              )}

              {step === 'sessy-setup' && (
                <SessyStep
                  c={c}
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
                  c={c}
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
                <EnphaseStep c={c} onBack={() => setStep('category')} />
              )}

              {step === 'solaredge-setup' && (
                <SolarEdgeStep
                  c={c}
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
                  c={c}
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
                  c={c}
                  ip={froniusIp} onIpChange={setFroniusIp}
                  onTest={handleTestFronius} onSave={handleSaveFronius}
                  onBack={() => setStep('category')}
                  testPending={froniusTesting} savePending={isPending}
                  verified={froniusOk} error={froniusError}
                />
              )}

              {step === 'solar-sma-setup' && (
                <SmaStep
                  c={c}
                  email={smaEmail} password={smaPass}
                  onEmailChange={setSmaEmail} onPasswordChange={setSmaPass}
                  onTest={handleTestSma} onBack={() => setStep('category')}
                  testPending={smaTesting} error={smaError}
                />
              )}

              {step === 'heatpump-setup' && (
                <HeatpumpStep
                  c={c}
                  brand={heatpumpBrand} onBrandChange={setHeatpumpBrand}
                  label={heatpumpLabel} onLabelChange={setHeatpumpLabel}
                  homeName={heatpumpHome}
                  tadoStatus={tadoStatus} tadoUserCode={tadoUserCode} tadoVerifyUrl={tadoVerifyUrl}
                  onStartTado={handleStartTado} onSaveGeneric={handleSaveHeatpumpGeneric}
                  onBack={() => setStep('category')}
                  savePending={isPending}
                  error={heatpumpError}
                />
              )}

              {step === 'battery-other' && <BatteryOtherStep onBack={() => setStep('category')} c={c} />}

              {step === 'done' && (
                <div className="py-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">✓</div>
                  <p className="mt-3 text-sm font-medium text-emerald-500">{c.saved}</p>
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

function meterCategories(c: Conn): ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }> {
  return [
    { id: 'tibber-token', icon: Zap,   title: 'Tibber',   sub: c.tibberSub },
    { id: 'p1-setup',     icon: Gauge, title: 'P1 Meter', sub: c.p1Sub },
  ]
}
function batteryCategories(c: Conn): ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }> {
  return [
    { id: 'sessy-setup',     icon: BatteryCharging, title: 'Sessy',            sub: c.sessySub },
    { id: 'victron-setup',   icon: BatteryCharging, title: 'Victron Energy',   sub: c.victronSub },
    { id: 'enphase-setup',   icon: Sun,             title: 'Enphase',          sub: c.enphaseSub },
    { id: 'solaredge-setup', icon: CloudSun,        title: 'SolarEdge',        sub: c.solarEdgeSub },
    { id: 'battery-other',   icon: Plug,            title: c.batteryOtherTitle, sub: c.batteryOtherSub, soon: true },
  ]
}
function solarCategories(c: Conn): ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }> {
  return [
    { id: 'solar-solaredge-setup', icon: Sun, title: 'SolarEdge', sub: c.solarSolarEdgeSub },
    { id: 'solar-fronius-setup',   icon: Sun, title: 'Fronius',   sub: c.froniusSub },
    { id: 'solar-sma-setup',       icon: Sun, title: c.smaTitle,  sub: c.smaSub, soon: true },
  ]
}
function heatingCategories(c: Conn): ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }> {
  return [
    { id: 'heatpump-setup', icon: Flame,       title: c.heatpumpTitle,   sub: c.heatpumpSub },
    { id: 'idle',           icon: Thermometer, title: c.thermostatTitle, sub: c.thermostatSub, soon: true },
  ]
}
function chargingCategories(c: Conn): ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }> {
  return [
    { id: 'idle', icon: Car,             title: c.chargerTitle, sub: c.chargerSub, soon: true },
    { id: 'idle', icon: BatteryCharging, title: c.v2gTitle,     sub: c.v2gSub,     soon: true },
  ]
}

function CategoryList({
  items,
  onSelect,
  c,
}: {
  items: ReadonlyArray<{ id: Step; icon: React.ElementType; title: string; sub: string; soon?: boolean }>
  onSelect: (s: Step) => void
  c: Conn
}) {
  return (
    <>
      {items.map((cat) => {
        const isSoon = cat.soon === true
        const Icon = cat.icon
        return (
          <button
            key={cat.title}
            onClick={() => !isSoon && onSelect(cat.id)}
            disabled={isSoon}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
              isSoon
                ? 'cursor-default border-[var(--border)] bg-[var(--surface-2)] opacity-60'
                : 'border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/40 hover:bg-emerald-500/[0.06]'
            }`}
          >
            <Icon className="h-6 w-6 shrink-0 text-[var(--text-muted)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text)]">{cat.title}</p>
              <p className="text-xs text-[var(--text-muted)]">{cat.sub}</p>
            </div>
            {isSoon ? (
              <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                {c.comingSoon ?? ''}
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

function CategoryStep({ onSelect, c }: { onSelect: (s: Step) => void; c: Conn }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{c.catEnergyMeter}</p>
        <div className="grid gap-2">
          <CategoryList items={meterCategories(c)} onSelect={onSelect} c={c} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{c.catBattery}</p>
        <div className="grid gap-2">
          <CategoryList items={batteryCategories(c)} onSelect={onSelect} c={c} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{c.catSolar}</p>
        <div className="grid gap-2">
          <CategoryList items={solarCategories(c)} onSelect={onSelect} c={c} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{c.catCarCharging}</p>
        <div className="grid gap-2">
          <CategoryList items={chargingCategories(c)} onSelect={onSelect} c={c} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{c.catHeating}</p>
        <div className="grid gap-2">
          <CategoryList items={heatingCategories(c)} onSelect={onSelect} c={c} />
        </div>
      </div>
    </div>
  )
}

// ── Input field helper ─────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
    />
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-500">{msg}</p>
}

function SuccessBox({ msg }: { msg: string }) {
  return <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">{msg}</p>
}

function BackBtn({ onClick, c }: { onClick: () => void; c: Conn }) {
  return (
    <button onClick={onClick} className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]">
      {c.back}
    </button>
  )
}

function SaveBtn({ onClick, pending, label, c }: { onClick: () => void; pending: boolean; label?: string; c: Conn }) {
  return (
    <button onClick={onClick} disabled={pending} className="flex-1 rounded-xl bg-[#047857] py-2.5 text-sm font-medium text-white hover:bg-[#059669] disabled:opacity-50">
      {pending ? c.saving : (label ?? c.saveConnection)}
    </button>
  )
}

function TestBtn({ onClick, pending, label, c }: { onClick: () => void; pending: boolean; label?: string; c: Conn }) {
  return (
    <button onClick={onClick} disabled={pending} className="flex-1 rounded-xl bg-[#047857] py-2.5 text-sm font-medium text-white hover:bg-[#059669] disabled:opacity-50">
      {pending ? c.verifying : (label ?? c.testConnection)}
    </button>
  )
}

// ── Tibber step ────────────────────────────────────────────────────────────

function TibberStep({ c, token, onTokenChange, onTest, onSave, onBack, testPending, savePending, tibberName, error }: {
  token: string; onTokenChange: (v: string) => void; onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; tibberName: string; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">
        {c.tibberIntro}{' '}
        <a href="https://developer.tibber.com/settings/access-token" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
          developer.tibber.com
        </a>{' '}
        {c.tibberIntro2}
      </p>
      <Field label={c.tibberTokenLabel}>
        <Input type="password" value={token} onChange={e => onTokenChange(e.target.value)} placeholder="dXNlcjox…" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {tibberName && <SuccessBox msg={`✓ ${fill(c.tibberConnectedAs, { name: tibberName })}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!tibberName
          ? <TestBtn onClick={onTest} pending={testPending || !token.trim()} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending} c={c} />
        }
      </div>
    </div>
  )
}

// ── Sessy step ─────────────────────────────────────────────────────────────

function SessyStep({ c, username, password, onUsernameChange, onPasswordChange, onTest, onSave, onBack, testPending, savePending, verified, error }: {
  username: string; password: string; onUsernameChange: (v: string) => void; onPasswordChange: (v: string) => void
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.sessyAccountTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.sessyAccountDesc}</p>
      </div>
      <Field label={c.email}>
        <Input type="email" value={username} onChange={e => onUsernameChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label={c.password}>
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ ${c.sessyVerified}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !username.trim() || !password.trim()} label={c.sessyVerifyAccount} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending} label={c.solarEdgeConnectBattery} c={c} />
        }
      </div>
    </div>
  )
}

// ── Victron step ───────────────────────────────────────────────────────────

function VictronStep({ c,
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
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.victronAccountTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {c.victronAccountDesc}{' '}
          <a href="https://vrm.victronenergy.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">vrm.victronenergy.com</a>
        </p>
      </div>
      <Field label={c.email}>
        <Input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label={c.password}>
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && sites.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">
            ✓ {fill(sites.length === 1 ? c.victronFoundOne : c.victronFound, { n: sites.length })}
          </p>
          <div className="space-y-1.5">
            {sites.map(s => (
              <button
                key={s.idSite}
                onClick={() => onSelectSite(s.idSite, s.name)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedSiteId === s.idSite
                    ? 'border-emerald-500/40 bg-emerald-500/[0.08] font-medium text-emerald-400'
                    : 'border-[var(--border)] hover:border-emerald-500/30'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !email.trim() || !password.trim()} label={c.victronLoginVerify} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending || !selectedSiteId} label={c.solarEdgeConnectBattery} c={c} />
        }
      </div>
    </div>
  )
}

// ── Enphase step ───────────────────────────────────────────────────────────

function EnphaseStep({ c, onBack }: { onBack: () => void; c: Conn }) {
  // Enphase v4 verloopt via OAuth: de gebruiker keurt de toegang goed bij
  // Enphase zelf. Geen API-key/systeem-ID meer invoeren — gewoon doorklikken.
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.enphaseAccessTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.enphaseConnectIntro}</p>
      </div>
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        <a
          href="/api/enphase/connect"
          className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          {c.enphaseConnectBtn}
        </a>
      </div>
    </div>
  )
}

// ── SolarEdge step ─────────────────────────────────────────────────────────

function SolarEdgeStep({ c,
  apiKey, siteId, onApiKeyChange, onSiteIdChange,
  siteName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  apiKey: string; siteId: string
  onApiKeyChange: (v: string) => void; onSiteIdChange: (v: string) => void
  siteName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.solarEdgeAccessTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Activeer API toegang via{' '}
          <a href="https://monitoring.solaredge.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">monitoring.solaredge.com</a>{' '}
          → Admin → Site Access → API Access.
        </p>
      </div>
      <Field label={c.solarEdgeApiKey}>
        <Input type="password" value={apiKey} onChange={e => onApiKeyChange(e.target.value)} placeholder="••••••••••••••••" />
      </Field>
      <Field label={c.solarEdgeSiteId} hint={c.solarEdgeSiteIdHint}>
        <Input type="text" value={siteId} onChange={e => onSiteIdChange(e.target.value)} placeholder="123456" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ ${fill(c.solarEdgeSiteFound, { name: siteName })}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !apiKey.trim() || !siteId.trim()} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending} label={c.solarEdgeConnectSystem} c={c} />
        }
      </div>
    </div>
  )
}

// ── P1 step ────────────────────────────────────────────────────────────────

function P1Step({ c, ip, onIpChange, onSave, onBack, pending, error }: {
  ip: string; onIpChange: (v: string) => void; onSave: () => void; onBack: () => void; pending: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">{c.p1Intro}</p>
      <Field label={c.p1IpLabel}>
        <Input type="text" value={ip} onChange={e => onIpChange(e.target.value)} placeholder="192.168.1.42" />
      </Field>
      {error && <ErrorBox msg={error} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        <SaveBtn onClick={onSave} pending={pending || !ip.trim()} c={c} />
      </div>
    </div>
  )
}

// ── SolarEdge Solar step ───────────────────────────────────────────────────

function SolarSolarEdgeStep({ c,
  apiKey, siteId, onApiKeyChange, onSiteIdChange,
  siteName, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  apiKey: string; siteId: string
  onApiKeyChange: (v: string) => void; onSiteIdChange: (v: string) => void
  siteName: string
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.solarEdgeAccessTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          Activeer API toegang via{' '}
          <a href="https://monitoring.solaredge.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">monitoring.solaredge.com</a>{' '}
          → Admin → Site Access → API Access.
        </p>
      </div>
      <Field label={c.solarEdgeApiKey}>
        <Input type="password" value={apiKey} onChange={e => onApiKeyChange(e.target.value)} placeholder="••••••••••••••••" />
      </Field>
      <Field label={c.solarEdgeSiteId} hint={c.solarEdgeSiteIdHint}>
        <Input type="text" value={siteId} onChange={e => onSiteIdChange(e.target.value)} placeholder="123456" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ ${fill(c.solarEdgeSiteFound, { name: siteName })}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !apiKey.trim() || !siteId.trim()} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending} label={c.solarEdgeConnectSolar} c={c} />
        }
      </div>
    </div>
  )
}

// ── Fronius step ───────────────────────────────────────────────────────────

function FroniusStep({ c,
  ip, onIpChange, onTest, onSave, onBack,
  testPending, savePending, verified, error,
}: {
  ip: string; onIpChange: (v: string) => void
  onTest: () => void; onSave: () => void; onBack: () => void
  testPending: boolean; savePending: boolean; verified: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--text-muted)]">{c.froniusTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {c.froniusDesc}
        </p>
      </div>
      <Field label={c.froniusIpLabel} hint={c.froniusIpHint}>
        <Input type="text" value={ip} onChange={e => onIpChange(e.target.value)} placeholder="192.168.1.100" />
      </Field>
      {error && <ErrorBox msg={error} />}
      {verified && <SuccessBox msg={`✓ ${c.froniusReachable}`} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        {!verified
          ? <TestBtn onClick={onTest} pending={testPending || !ip.trim()} label={c.testConnection} c={c} />
          : <SaveBtn onClick={onSave} pending={savePending} label={c.froniusConnect} c={c} />
        }
      </div>
    </div>
  )
}

// ── SMA step ───────────────────────────────────────────────────────────────

function SmaStep({ c,
  email, password, onEmailChange, onPasswordChange,
  onTest, onBack, testPending, error,
}: {
  email: string; password: string
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void
  onTest: () => void; onBack: () => void
  testPending: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/20">
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">{c.smaComingTitle}</p>
        <p className="mt-0.5 text-xs text-amber-600/80 dark:text-amber-500/80">
          {c.smaComingDesc}
        </p>
      </div>
      <Field label={c.smaEmailLabel}>
        <Input type="email" value={email} onChange={e => onEmailChange(e.target.value)} placeholder="naam@email.nl" />
      </Field>
      <Field label={c.password}>
        <Input type="password" value={password} onChange={e => onPasswordChange(e.target.value)} placeholder="••••••••" />
      </Field>
      {error && <ErrorBox msg={error} />}
      <div className="flex gap-2 pt-1">
        <BackBtn onClick={onBack} c={c} />
        <TestBtn onClick={onTest} pending={testPending || !email.trim() || !password.trim()} label={c.smaCheckStatus} c={c} />
      </div>
    </div>
  )
}

// ── Warmtepomp step ────────────────────────────────────────────────────────

function HeatpumpStep({ c,
  brand, onBrandChange,
  label, onLabelChange,
  homeName, onBack,
  tadoStatus, tadoUserCode, tadoVerifyUrl,
  onStartTado, onSaveGeneric,
  savePending, error,
}: {
  brand: 'tado' | 'generic'
  onBrandChange: (b: 'tado' | 'generic') => void
  label: string; onLabelChange: (v: string) => void
  homeName: string
  onBack: () => void
  tadoStatus: 'idle' | 'starting' | 'waiting' | 'connected'
  tadoUserCode: string; tadoVerifyUrl: string
  onStartTado: () => void; onSaveGeneric: () => void
  savePending: boolean; error: string
  c: Conn
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">
        {c.heatpumpIntro}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onBrandChange('tado')}
          className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
            brand === 'tado'
              ? 'border-emerald-500/40 bg-emerald-500/[0.08] font-medium text-emerald-400'
              : 'border-[var(--border)] hover:border-emerald-500/30'
          }`}
        >
          <span className="block font-medium">{c.heatpumpTado}</span>
          <span className="block text-xs text-[var(--text-muted)]">{c.heatpumpTadoSub}</span>
        </button>
        <button
          onClick={() => onBrandChange('generic')}
          className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
            brand === 'generic'
              ? 'border-emerald-500/40 bg-emerald-500/[0.08] font-medium text-emerald-400'
              : 'border-[var(--border)] hover:border-emerald-500/30'
          }`}
        >
          <span className="block font-medium">{c.heatpumpManual}</span>
          <span className="block text-xs text-[var(--text-muted)]">{c.heatpumpManualSub}</span>
        </button>
      </div>

      {brand === 'tado' ? (
        <>
          {tadoStatus === 'connected' ? (
            <SuccessBox msg={homeName ? `✓ ${fill(c.heatpumpVerifiedNamed, { name: homeName })}` : `✓ ${c.heatpumpVerified}`} />
          ) : tadoStatus === 'waiting' ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
                <p className="text-xs font-medium text-[var(--text-muted)]">{c.tadoApproveTitle}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.tadoApproveDesc}</p>
                <div className="mt-2 rounded-lg bg-[var(--surface)] px-3 py-2 text-center font-mono text-lg font-semibold tracking-[0.3em] text-emerald-400">
                  {tadoUserCode}
                </div>
                <a href={tadoVerifyUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center text-xs text-emerald-400 hover:underline">
                  {c.tadoOpenLink}
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {c.tadoWaiting}
              </div>
              {error && <ErrorBox msg={error} />}
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
                <p className="text-xs font-medium text-[var(--text-muted)]">{c.heatpumpTadoAccountTitle}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.tadoConnectIntro}</p>
              </div>
              {error && <ErrorBox msg={error} />}
            </>
          )}
          <div className="flex gap-2 pt-1">
            <BackBtn onClick={onBack} c={c} />
            {tadoStatus !== 'connected' && (
              <SaveBtn onClick={onStartTado} pending={savePending || tadoStatus === 'starting' || tadoStatus === 'waiting'} label={c.tadoConnectBtn} c={c} />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-[var(--surface-2)] px-4 py-3">
            <p className="text-xs font-medium text-[var(--text-muted)]">{c.heatpumpManualTitle}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {c.heatpumpManualDesc}
            </p>
          </div>
          <Field label={c.heatpumpNameLabel} hint={c.heatpumpNameHint}>
            <Input type="text" value={label} onChange={e => onLabelChange(e.target.value)} placeholder="Warmtepomp" />
          </Field>
          {error && <ErrorBox msg={error} />}
          <div className="flex gap-2 pt-1">
            <BackBtn onClick={onBack} c={c} />
            <SaveBtn onClick={onSaveGeneric} pending={savePending} label={c.heatpumpAdd} c={c} />
          </div>
        </>
      )}
    </div>
  )
}

// ── Battery other step ─────────────────────────────────────────────────────

const OTHER_BRANDS = ['Tesla Powerwall', 'GoodWe', 'Growatt', 'Huawei FusionSolar', 'Alpha ESS', 'Pylontech']

function BatteryOtherStep({ c, onBack }: { onBack: () => void; c: Conn }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-faint)]">{c.batteryOtherIntro}</p>
      <div className="grid grid-cols-2 gap-2">
        {OTHER_BRANDS.map(b => (
          <div key={b} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
            <span className="text-sm text-[var(--text-faint)]">{b}</span>
            <span className="rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">{c.comingSoon}</span>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="w-full rounded-xl border border-[var(--border)] py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-2)]">{c.back}</button>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState({ onAdd, c }: { onAdd: () => void; c: Conn }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20"><Plug className="h-6 w-6 text-emerald-400" /></div>
      <h2 className="mt-4 text-base font-semibold text-[var(--text)]">{c.emptyTitle}</h2>
      <p className="mt-2 text-sm text-[var(--text-faint)]">{c.emptyDesc}</p>
      <button onClick={onAdd} className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-medium text-white transition-colors hover:bg-[#059669]">
        {c.addDevice}
      </button>
    </div>
  )
}
