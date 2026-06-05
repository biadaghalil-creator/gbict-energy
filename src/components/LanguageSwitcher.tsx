'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

const LOCALE_LABELS: Record<Locale, { flag: string; code: string }> = {
  en: { flag: '🇬🇧', code: 'EN' },
  nl: { flag: '🇳🇱', code: 'NL' },
  de: { flag: '🇩🇪', code: 'DE' },
  fr: { flag: '🇫🇷', code: 'FR' },
  es: { flag: '🇪🇸', code: 'ES' },
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

  const current = LOCALE_LABELS[currentLocale]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        aria-label="Select language"
      >
        <span>{current.flag}</span>
        <span>{current.code}</span>
        <svg
          className={`h-3 w-3 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-28 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {LOCALES.map((locale) => {
            const item = LOCALE_LABELS[locale]
            const isActive = locale === currentLocale
            return (
              <button
                key={locale}
                type="button"
                onClick={() => handleSelect(locale)}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{item.flag}</span>
                <span>{item.code}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
