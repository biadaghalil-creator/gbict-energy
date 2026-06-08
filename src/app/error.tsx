'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surfaces in the browser console and Vercel logs for diagnosis.
    console.error('App error:', error.message, error.digest)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07080D] px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-[-320px] h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.18),transparent_70%)] blur-xl" />
      <div className="relative z-10 max-w-sm">
        <h1 className="text-[22px] font-bold tracking-tight text-slate-50">Er ging iets mis</h1>
        <p className="mt-2 text-[14px] text-slate-400">
          Er trad een fout op. Probeer het opnieuw — gebeurt het vaker, herlaad dan de pagina.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#059669]"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.06]"
          >
            Naar start
          </a>
        </div>
        {error.digest && (
          <p className="mt-5 text-[11px] text-slate-600">Referentie: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
