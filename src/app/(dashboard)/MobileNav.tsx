'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plug, TrendingDown, Bell, Users, Zap, Settings } from 'lucide-react'
import { useT } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

type NavKey = keyof TranslationDict['dashboard']['nav']

const navLinks: { href: string; key: NavKey; icon: typeof LayoutDashboard; badgeKey?: 'vppBadge' }[] = [
  { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { href: '/dashboard/koppelingen', key: 'connections', icon: Plug },
  { href: '/dashboard/besparingen', key: 'savings', icon: TrendingDown },
  { href: '/dashboard/notificaties', key: 'activity', icon: Bell },
  { href: '/dashboard/referral', key: 'friends', icon: Users },
  { href: '/dashboard/vpp', key: 'vppFull', icon: Zap, badgeKey: 'vppBadge' },
  { href: '/dashboard/instellingen', key: 'settings', icon: Settings },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useT()

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        aria-label={t.dashboard.nav.menu}
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu panel */}
      {open && (
        <div className="absolute left-0 right-0 top-[61px] z-50 border-b border-[var(--border)] bg-[var(--surface)] shadow-lg">
          <nav className="mx-auto max-w-6xl px-6 py-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-500/[0.12] font-medium text-emerald-300'
                      : 'text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                  }`}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{t.dashboard.nav[link.key]}</span>
                  {link.badgeKey && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      {t.dashboard.nav[link.badgeKey]}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}
