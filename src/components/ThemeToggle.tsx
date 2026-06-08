'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

// Manual day/night toggle. Stores the choice in a cookie so it sticks and wins
// over the automatic time-based switching.
export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    document.cookie = `GBICT_THEME=${next ? 'dark' : 'light'}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Licht of donker thema"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
