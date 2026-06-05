import type { Locale, TranslationDict } from './types'
import { en } from './en'
import { nl } from './nl'
import { de } from './de'
import { fr } from './fr'
import { es } from './es'

const translations: Record<Locale, TranslationDict> = { en, nl, de, fr, es }

export function getTranslations(locale: Locale): TranslationDict {
  return translations[locale] ?? translations.en
}

export * from './types'
