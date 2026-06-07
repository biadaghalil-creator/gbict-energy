'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string

  let errorMessage: string | null = null
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) errorMessage = error.message
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Onbekende fout'
  }

  if (errorMessage) {
    redirect(`/reset-password?error=${encodeURIComponent(errorMessage)}`)
  }
  redirect('/dashboard')
}
