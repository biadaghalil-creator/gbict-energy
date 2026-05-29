'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type ProfileSettings = {
  optimize_mode: 'max_savings' | 'comfort' | 'eco'
  contract_type: string
  postcode: string
  household_size: number
}

export async function saveSettings(settings: ProfileSettings) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profiles')
    .update({
      optimize_mode: settings.optimize_mode,
      contract_type: settings.contract_type,
      postcode: settings.postcode,
      household_size: settings.household_size,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/instellingen')
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase.auth.signOut()
  redirect('/login')
}
