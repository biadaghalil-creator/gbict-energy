'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type OnboardingData = {
  has_battery: boolean
  has_solar: boolean
  has_p1: boolean
  contract_type: string
  hardware_brand: string
  postcode: string
  household_size: number
  optimize_mode: string
}

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...data,
    onboarding_completed: true,
  })

  if (error) {
    console.error('Onboarding opslaan mislukt:', error.message)
    return { error: error.message }
  }

  redirect('/dashboard')
}
