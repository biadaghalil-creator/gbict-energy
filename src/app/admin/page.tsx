import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function getPlatformStats() {
  try {
    const supabase = createAdminClient()

    const [
      { count: totalUsers },
      { count: activeDevices },
      { count: vppEnrolled },
      { data: savingsRaw },
      { data: deviceBreakdown },
      { data: recentUsers },
      { data: recentLogs },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('vpp_enrolled', true),
      supabase.from('optimization_logs').select('savings_eur'),
      supabase.from('devices').select('type').eq('status', 'active'),
      supabase.from('profiles').select('id, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('optimization_logs').select('action, savings_eur, source, created_at').order('created_at', { ascending: false }).limit(20),
    ])

    const totalSavings = (savingsRaw ?? []).reduce((s: number, l: { savings_eur: number }) => s + (l.savings_eur ?? 0), 0)

    const byType: Record<string, number> = {}
    for (const d of (deviceBreakdown ?? [])) {
      byType[d.type] = (byType[d.type] ?? 0) + 1
    }

    return { totalUsers, activeDevices, vppEnrolled, totalSavings, byType, recentUsers, recentLogs }
  } catch {
    return null
  }
}

function StatCard({ label, value, sub, color = 'emerald' }: { label: string; value: string | number; sub?: string; color?: 'emerald' | 'zinc' | 'blue' | 'amber' }) {
  const colors = {
    emerald: 'text-emerald-400',
    zinc: 'text-zinc-300',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  }
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${colors[color]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-600">{sub}</p>}
    </div>
  )
}

const DEVICE_LABELS: Record<string, string> = {
  meter_tibber: 'Tibber',
  meter_p1: 'P1 Meter',
  battery_sessy: 'Sessy',
  battery_victron: 'Victron',
  battery_enphase: 'Enphase',
  battery_solaredge: 'SolarEdge',
}

export default async function AdminPage() {
  const stats = await getPlatformStats()
  const noKey = stats === null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform overzicht</h1>
        <p className="mt-1 text-sm text-zinc-500">Realtime statistieken van alle gebruikers en apparaten.</p>
      </div>

      {noKey && (
        <div className="rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-400">
          ⚠️ <strong>SUPABASE_SERVICE_ROLE_KEY</strong> niet ingesteld. Voeg deze toe in Vercel env vars (Supabase → Settings → API → service_role key).
        </div>
      )}

      {/* Hoofd statistieken */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gebruikers" value={stats?.totalUsers ?? '—'} sub="geregistreerd" color="zinc" />
        <StatCard label="Actieve apparaten" value={stats?.activeDevices ?? '—'} sub="gekoppeld" color="blue" />
        <StatCard label="Totaal bespaard" value={stats?.totalSavings != null ? `€${stats.totalSavings.toFixed(2)}` : '—'} sub="platform-breed" color="emerald" />
        <StatCard label="VPP ingeschreven" value={stats?.vppEnrolled ?? '—'} sub="batterijen in net" color="amber" />
      </div>

      {/* Device breakdown */}
      {stats?.byType && Object.keys(stats.byType).length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="mb-4 text-sm font-medium text-zinc-300">Apparaten per type</p>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="rounded-xl border border-zinc-800 bg-zinc-800/50 p-3 text-center">
                <p className="text-xl font-semibold text-zinc-200">{count}</p>
                <p className="mt-1 text-xs text-zinc-500">{DEVICE_LABELS[type] ?? type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recente acties */}
      {stats?.recentLogs && stats.recentLogs.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-5 py-4">
            <p className="text-sm font-medium text-zinc-300">Recente optimalisaties</p>
          </div>
          <div className="divide-y divide-zinc-800">
            {stats.recentLogs.map((log: { action: string; savings_eur: number; source: string; created_at: string }, i: number) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${log.action === 'charge' ? 'text-emerald-400' : log.action === 'discharge' ? 'text-orange-400' : 'text-zinc-500'}`}>
                    {log.action === 'charge' ? '↑ Laden' : log.action === 'discharge' ? '↓ Ontladen' : 'Idle'}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{log.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-400">
                    {(log.savings_eur ?? 0) > 0 ? `+€${log.savings_eur.toFixed(3)}` : '—'}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {new Date(log.created_at).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recente signups */}
      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="mb-3 text-sm font-medium text-zinc-300">Laatste {stats.recentUsers.length} aanmeldingen</p>
          <div className="space-y-1.5">
            {stats.recentUsers.map((u: { id: string; created_at: string }) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                <p className="font-mono text-xs text-zinc-400">{u.id.slice(0, 8)}…</p>
                <p className="text-xs text-zinc-600">
                  {new Date(u.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
