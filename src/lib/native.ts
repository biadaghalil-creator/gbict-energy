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
  const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }
  if (w.Capacitor?.isNativePlatform?.()) return true
  return /GBICTEnergyApp/i.test(navigator.userAgent)
}

/** React hook variant. Returns false during SSR / first paint, then resolves on mount. */
export function useIsNative(): boolean {
  const [native, setNative] = useState(false)
  useEffect(() => {
    setNative(isNativeApp())
  }, [])
  return native
}
