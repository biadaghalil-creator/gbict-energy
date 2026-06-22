import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Satoshi — same warm typeface as the app / dashboard design */}
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap"
        rel="stylesheet"
      />

      <div
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
        style={{
          fontFamily: "'Satoshi', -apple-system, system-ui, sans-serif",
          background:
            'radial-gradient(120% 90% at 50% -10%, #FBF7EF 0%, #F0E9DC 46%, #E7DECD 100%)',
          color: '#211D16',
        }}
      >
        {/* soft warm glow blobs — organic, never blocks interaction */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="absolute left-[12%] top-[-14%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(92,138,94,0.18),transparent_70%)] blur-3xl" />
          <div className="absolute right-[6%] bottom-[-10%] h-[54vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.14),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo — same brand mark as the landing page */}
          <div className="mb-9 flex flex-col items-center">
            <Link href="/" className="group inline-flex">
              <Image
                src="/gbict-logo.png"
                alt="GBICT Energy"
                width={60}
                height={60}
                priority
                className="block rounded-[16px] shadow-[0_8px_24px_rgba(33,29,22,0.10)] transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
            <span
              className="mt-3 text-[13px] font-bold tracking-[-0.01em]"
              style={{ color: '#2F5D3A' }}
            >
              GBICT Energy
            </span>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
