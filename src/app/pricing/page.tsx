import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/i18n'
import type { TranslationDict } from '@/lib/i18n'
import { PricingClient } from './PricingClient'

export default async function PricingPage() {
  const locale = await getLocale()
  const translations = getTranslations(locale)
  return <PricingClient translations={translations} />
}
