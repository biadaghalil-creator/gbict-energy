import { cookies } from 'next/headers'
import type { Locale } from './i18n'
import { DEFAULT_LOCALE, LOCALES } from './i18n'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('GBICT_LOCALE')?.value
  if (locale && LOCALES.includes(locale as Locale)) {
    return locale as Locale
  }
  return DEFAULT_LOCALE
}
