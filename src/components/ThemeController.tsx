'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/native'

// Auto day/night: light between 07:00–18:00, dark otherwise — unless the user
// picked a theme manually (cookie GBICT_THEME). Re-checks every 5 minutes so it
// flips at the day/night boundary even while the app stays open.
function applyAuto() {
  if (/GBICT_THEME=(light|dark)/.test(document.cookie)) return
  const h = new Date().getHours()
  document.documentElement.classList.toggle('dark', !(h >= 7 && h < 18))
}

// In the native app: keep the iOS status bar text readable for the active theme
// (light text on dark, dark text on light).
async function syncStatusBar() {
  if (!isNativeApp()) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    const dark = document.documentElement.classList.contains('dark')
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light })
  } catch {
    // not available outside the native shell — ignore
  }
}

export default function ThemeController() {
  useEffect(() => {
    applyAuto()
    syncStatusBar()
    const id = setInterval(() => { applyAuto(); syncStatusBar() }, 5 * 60 * 1000)
    // React to any theme change (auto or the manual toggle).
    const obs = new MutationObserver(() => syncStatusBar())
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => { clearInterval(id); obs.disconnect() }
  }, [])
  return null
}
