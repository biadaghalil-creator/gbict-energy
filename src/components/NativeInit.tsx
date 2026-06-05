'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/native'

/**
 * Tags <html> with `native-app` when running inside the Capacitor shell, so
 * CSS can apply app-only polish (no text selection, no rubber-band scroll)
 * without touching the website.
 */
export default function NativeInit() {
  useEffect(() => {
    if (isNativeApp()) {
      document.documentElement.classList.add('native-app')
    }
  }, [])
  return null
}
