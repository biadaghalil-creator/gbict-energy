import Link from 'next/link'
import Image from 'next/image'
import EcoGlow from '@/components/EcoGlow'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      <EcoGlow />

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
