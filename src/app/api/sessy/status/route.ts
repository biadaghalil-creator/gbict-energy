import { createClient } from '@/lib/supabase/server'
import { getSessyToken, getSessyStatus } from '@/lib/sessy'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json(null, { status: 401 })

  const { data: device } = await supabase
    .from('devices')
    .select('config, status')
    .eq('user_id', user.id)
    .eq('type', 'battery_sessy')
    .eq('status', 'active')
    .maybeSingle()

  if (!device?.config?.username || !device?.config?.password) {
    return NextResponse.json(null)
  }

  // Haal vers access token op (tokens verlopen snel)
  const tokenData = await getSessyToken(device.config.username, device.config.password)
  if (!tokenData) return NextResponse.json(null)

  const status = await getSessyStatus(tokenData.access_token)
  return NextResponse.json(status)
}
