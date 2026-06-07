'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Plug, TrendingDown, Bell, Users,
  Zap, Settings, LogOut, Menu, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useIsNative } from '@/lib/native'
import NativeTabBar from './NativeTabBar'

const navItems = [
  { href: '/dashboard',               label: 'Dashboard',   icon: LayoutDashboard, exact: true },
  { href: '/dashboard/koppelingen',   label: 'Koppelingen', icon: Plug },
  { href: '/dashboard/besparingen',   label: 'Besparingen', icon: TrendingDown },
  { href: '/dashboard/notificaties',  label: 'Activiteit',  icon: Bell },
  { href: '/dashboard/referral',      label: 'Vrienden',    icon: Users },
  { href: '/dashboard/vpp',           label: 'VPP',         icon: Zap, badge: 'Bèta' },
  { href: '/dashboard/instellingen',  label: 'Instellingen',icon: Settings },
]

function NavLink({
  item, isActive, collapsed, onClick,
}: {
  item: typeof navItems[number]
  isActive: boolean
  collapsed?: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={item.label}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
        collapsed && 'justify-center px-0',
        isActive
          ? 'bg-violet-500/[0.12] text-violet-300'
          : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
      )}
    >
      {/* Active indicator */}
      {isActive && !collapsed && (
        <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-violet-500" />
      )}
      <Icon className={cn(
        'h-4 w-4 shrink-0 transition-colors',
        isActive ? 'text-violet-400' : 'text-slate-600 group-hover:text-slate-400'
      )} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-bold text-violet-400">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

function SidebarInner({
  pathname, userEmail, collapsed, onNavClick,
}: {
  pathname: string
  userEmail: string
  collapsed?: boolean
  onNavClick?: () => void
}) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const active = (item: typeof navItems[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const initials = userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn('flex h-[68px] items-center px-4', collapsed && 'justify-center px-0')}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <img
            src="/gbict-logo.png"
            alt="GBICT"
            width={collapsed ? 36 : 40}
            height={collapsed ? 36 : 40}
            className="block rounded-[10px] transition-transform group-hover:scale-105"
          />
          {!collapsed && (
            <div className="leading-none">
              <p className="text-[14px] font-extrabold tracking-tight text-slate-50">GBICT</p>
              <p className="text-[11px] font-medium text-violet-400">Energy</p>
            </div>
          )}
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className={cn('flex-1 space-y-0.5 overflow-y-auto px-3 py-4', collapsed && 'px-2')}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={active(item)}
            collapsed={collapsed}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/[0.06]" />

      {/* User */}
      <div className={cn('px-3 py-4', collapsed && 'px-2')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-violet-500/10 text-xs font-bold text-violet-400 ring-1 ring-violet-500/20">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleLogout}
              title="Uitloggen"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/[0.06]">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-violet-500/10 text-[11px] font-bold text-violet-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-slate-200">{userEmail}</p>
                <p className="text-[10.5px] text-slate-600">Gratis plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Uitloggen</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardShell({
  children, userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const pathname = usePathname()
  const native = useIsNative()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPage = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  )

  return (
    <div className={cn(
      'flex bg-[#07080D] text-slate-100 antialiased',
      native ? 'h-screen overflow-hidden' : 'min-h-screen'
    )}>
      {/* ── Background atmosphere (same as landing page) ── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(124,58,237,0.18),rgba(109,40,217,0.07)_45%,transparent_70%)] blur-xl" />

      {/* ── Desktop Sidebar ── */}
      <aside className={cn(
        'relative z-10 hidden md:flex flex-col shrink-0 border-r border-white/[0.06] bg-[#0D0E16]/90 backdrop-blur-md transition-all duration-300',
        collapsed ? 'w-[4.5rem]' : 'w-[220px]'
      )}>
        <SidebarInner pathname={pathname} userEmail={userEmail} collapsed={collapsed} />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-[#0D0E16] text-slate-500 shadow-lg transition-colors hover:border-violet-500/30 hover:text-violet-400"
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />
          }
        </button>
      </aside>

      {/* ── Mobile drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[220px] border-r border-white/[0.06] bg-[#0D0E16] p-0">
          <SheetTitle className="sr-only">Navigatie</SheetTitle>
          <SidebarInner
            pathname={pathname}
            userEmail={userEmail}
            onNavClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* ── Main ── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className={cn(
          'sticky top-0 z-20 flex items-center gap-4 border-b border-white/[0.06] bg-[#07080D]/80 px-5 backdrop-blur-md',
          native ? 'min-h-[56px] pt-[env(safe-area-inset-top)]' : 'h-[68px]'
        )}>
          {!native && (
            <button
              className="text-slate-500 transition-colors hover:text-slate-100 md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Title: clean app-style title in the app, breadcrumb on the web */}
          {native ? (
            <span className="text-[17px] font-bold tracking-[-0.02em] text-slate-100">
              {currentPage?.label ?? 'Dashboard'}
            </span>
          ) : (
            <div className="flex items-center gap-2 text-[13.5px]">
              <span className="text-slate-600">GBICT</span>
              <span className="text-slate-700">/</span>
              <span className="font-semibold text-slate-200">
                {currentPage?.label ?? 'Dashboard'}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard/notificaties"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <div className="hidden h-7 w-7 items-center justify-center md:flex">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-violet-500/10 text-[11px] font-bold text-violet-400 ring-1 ring-violet-500/20">
                  {userEmail?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className={cn('mx-auto w-full max-w-6xl px-5 py-8', native && 'pb-28')}>
            {children}
          </div>
        </main>
      </div>

      {/* Native bottom tab bar (app only) */}
      <NativeTabBar />
    </div>
  )
}
