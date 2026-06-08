'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/native'

// When running inside the native iOS app, hand the home-screen widget its
// access token by posting it to the native WKScriptMessageHandler
// ("gbictWidget"). The native side stores it in the shared App Group and the
// widget extension uses it to fetch /api/widget. No-op on web.
export default function WidgetSync() {
  useEffect(() => {
    if (!isNativeApp()) return
    let cancelled = false

    const post = async () => {
      try {
        const res = await fetch('/api/widget/token')
        if (!res.ok) return
        const { token, baseUrl } = await res.json()
        if (cancelled || !token) return
        const handler = (window as unknown as {
          webkit?: { messageHandlers?: { gbictWidget?: { postMessage: (m: unknown) => void } } }
        }).webkit?.messageHandlers?.gbictWidget
        handler?.postMessage({ token, baseUrl })
      } catch {
        /* ignore — widget just shows cached/empty state */
      }
    }

    // Post now, and shortly after (the native handler may attach a beat later).
    post()
    const t = setTimeout(post, 2500)
    return () => { cancelled = true; clearTimeout(t) }
  }, [])

  return null
}
