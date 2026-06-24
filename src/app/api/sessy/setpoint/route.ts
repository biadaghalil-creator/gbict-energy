import { createClient } from '@/lib/supabase/server'
import { getSessyToken, setSessySetpoint } from '@/lib/sessy'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json(null, { status: 401 })

  const { setpoint } = await req.json() as { setpoint: number }

  const { data: device } = await supabase
    .from('devices')
    .select('config')
    .eq('user_id', user.id)
    .eq('type', 'battery_sessy')
    .eq('status', 'active')
    .maybeSingle()

  if (!device?.config?.username || !device?.config?.password) {
    return NextResponse.json({ ok: false, error: 'No Sessy connected.' }, { status: 400 })
  }

  const tokenData = await getSessyToken(device.config.username, device.config.password)
  if (!tokenData) return NextResponse.json({ ok: false, error: 'Sessy sign-in failed.' }, { status: 500 })

  const ok = await setSessySetpoint(tokenData.access_token, setpoint)
  return NextResponse.json({ ok })
}
