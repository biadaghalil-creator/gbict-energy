'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plug, TrendingDown, Bell, Settings } from 'lucide-react'
import { useIsNative } from '@/lib/native'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

const tabs: { href: string; key: keyof TranslationDict['dashboard']['nav']; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { href: '/dashboard',              key: 'home',        icon: LayoutDashboard, exact: true },
  { href: '/dashboard/koppelingen',  key: 'connections', icon: Plug },
  { href: '/dashboard/besparingen',  key: 'savings',     icon: TrendingDown },
  { href: '/dashboard/notificaties', key: 'activity',    icon: Bell },
  { href: '/dashboard/instellingen', key: 'profile',     icon: Settings },
]

// Each circular slot is 56px wide (w-14); the active highlight slides along it.
const SLOT = 56

/**
 * Floating, rounded bottom navigation — ONLY in the native app.
 * A glass pill that floats free of the screen edge at the bottom, with a
 * smoothly sliding 3D emerald orb behind the active icon. It adapts
 * automatically to light/dark (the --surface/--border/--text variables
 * change with the time of day — see ThemeController). It does not appear on
 * the web; the horizontal top bar is used there instead.
 */
export default function NativeTabBar() {
  const native = useIsNative()
  const pathname = usePathname()
  const { t } = useT()

  if (!native) return null

  const activeIndex = tabs.findIndex((tab) =>
    tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
  )

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center pb-[calc(env(safe-area-inset-bottom)+14px)]"
      aria-label="Main navigation"
    >
      <div
        className="pointer-events-auto relative flex rounded-full bg-[var(--surface)] p-1.5 backdrop-blur-2xl"
        style={{
          backgroundColor: 'color-mix(in oklab, var(--surface) 78%, transparent)',
          boxShadow:
            '0 12px 34px -10px rgba(2,6,23,0.35), 0 6px 18px -10px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px var(--border)',
        }}
      >
        {/* Smoothly sliding 3D emerald orb behind the active icon */}
        <span
          aria-hidden
          className={cn(
            'nav-orb absolute left-1.5 top-1.5 h-14 w-14 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.5,1)]',
            activeIndex < 0 && 'scale-0 opacity-0'
          )}
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * SLOT}px)` }}
        />

        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={t.dashboard.nav[tab.key]}
              aria-current={active ? 'page' : undefined}
              className="relative z-10 flex h-14 w-14 items-center justify-center"
            >
              <Icon
                className={cn(
                  'h-[23px] w-[23px] transition-all duration-300',
                  active
                    ? 'scale-105 text-white drop-shadow-[0_1px_2px_rgba(13,23,17,0.4)]'
                    : 'text-[var(--text-faint)]'
                )}
                strokeWidth={active ? 2.4 : 2}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
