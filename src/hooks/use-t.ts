'use client'

import { getTranslations, type Locale, type TranslationDict } from '@/lib/i18n'
import { useLocale } from './use-locale'

/** Map our app locale to a BCP-47 tag for Intl date/number formatting. */
const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-GB',
  nl: 'nl-NL',
  de: 'de-DE',
  fr: 'fr-FR',
}

export function localeTag(locale: Locale): string {
  return LOCALE_TAGS[locale] ?? 'en-GB'
}

/** Replace {key} placeholders in a translation string with the given values. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`))
}

/**
 * Client-side translation hook. Reads the active locale (cookie-backed via
 * useLocale) and returns the matching dictionary. Re-renders when the locale
 * changes. Use in client components: `const { t, tag } = useT()`.
 */
export function useT(): { t: TranslationDict; locale: Locale; tag: string } {
  const { locale } = useLocale()
  return { t: getTranslations(locale), locale, tag: localeTag(locale) }
}
