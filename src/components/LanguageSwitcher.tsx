'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

const LOCALE_LABELS: Record<Locale, { name: string; code: string }> = {
  en: { name: 'English', code: 'EN' },
  nl: { name: 'Nederlands', code: 'NL' },
  de: { name: 'Deutsch', code: 'DE' },
  fr: { name: 'Français', code: 'FR' },
}

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(locale: Locale) {
    document.cookie = `GBICT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    setOpen(false)
    window.location.reload()
  }

  const current = LOCALE_LABELS[currentLocale] ?? LOCALE_LABELS.en

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-violet-500/40 hover:text-slate-100"
        aria-label="Taal kiezen"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.code}</span>
        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D0E16] py-1 shadow-xl backdrop-blur">
          {LOCALES.map((locale) => {
            const item = LOCALE_LABELS[locale]
            const isActive = locale === currentLocale
            return (
              <button
                key={locale}
                type="button"
                onClick={() => handleSelect(locale)}
                className={`flex w-full items-center justify-between px-3 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-violet-500/[0.12] font-medium text-violet-300'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                <span>{item.name}</span>
                {isActive && <Check className="h-3.5 w-3.5 text-violet-400" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
