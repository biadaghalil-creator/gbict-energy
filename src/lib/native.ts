'use client'

import { useEffect, useState } from 'react'

/**
 * True when the web app is running inside the native iOS/Android shell
 * (Capacitor). Works two ways so it is reliable even on the live-URL setup:
 *  - Capacitor injects window.Capacitor into the webview at runtime
 *  - the native shell appends "GBICTEnergyApp" to the user agent
 *
 * Safe to call on the server (returns false) — real detection happens client-side.
 */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  const cap = (window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string }
  }).Capacitor
  if (cap) {
    if (typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) return true
    if (typeof cap.getPlatform === 'function' && cap.getPlatform() !== 'web') return true
  }
  // Preview-schakelaar: ?appview in de URL toont de app-look in een gewone
  // browser (handig om het app-design te bekijken/finetunen zonder app-cache).
  if (/[?&]appview\b/.test(window.location.search)) return true
  return /GBICTEnergyApp/i.test(navigator.userAgent)
}

/** React hook variant. Returns false during SSR / first paint, then resolves on mount. */
export function useIsNative(): boolean {
  const [native, setNative] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- native/preview detectie kan pas na mount (browser-only)
    setNative(isNativeApp())
  }, [])
  return native
}
