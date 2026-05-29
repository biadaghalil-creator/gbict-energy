import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import KoppelingenClient from './KoppelingenClient'

export default async function KoppelingenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: devices } = await supabase
    .from('devices')
    .select('id, type, brand, name, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <KoppelingenClient initialDevices={devices ?? []} />
}
