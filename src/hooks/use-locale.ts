'use client'

import { useState, useEffect, useCallback } from 'react'

export type Locale = 'en' | 'nl' | 'de' | 'fr'

const LOCALES: Locale[] = ['en', 'nl', 'de', 'fr']
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN', nl: 'NL', de: 'DE', fr: 'FR',
}
const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English', nl: 'Nederlands', de: 'Deutsch', fr: 'Français',
}

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)GBICT_LOCALE=([^;]+)/)
  const val = match?.[1]
  return LOCALES.includes(val as Locale) ? (val as Locale) : 'en'
}

function setLocaleCookie(locale: Locale) {
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)
  document.cookie = `GBICT_LOCALE=${locale};path=/;expires=${expires.toUTCString()};samesite=lax`
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    setLocaleState(readLocaleCookie())
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    setLocaleCookie(next)
  }, [])

  return { locale, setLocale, locales: LOCALES, labels: LOCALE_LABELS, names: LOCALE_NAMES }
}
