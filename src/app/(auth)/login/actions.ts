'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let errorMessage: string | null = null
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) errorMessage = error.message
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while signing in.'
  }

  if (errorMessage) {
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  redirect('/dashboard')
}
