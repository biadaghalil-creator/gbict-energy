import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      {/* Violet ambient glow — matches the landing page */}
      <div className="pointer-events-none absolute left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.25),rgba(5,150,105,0.1)_45%,transparent_70%)] blur-xl" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo — same brand mark as the landing page */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="group inline-flex">
            <Image
              src="/gbict-logo.png"
              alt="GBICT Energy"
              width={64}
              height={64}
              priority
              className="block rounded-[15px] transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
