'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── SVG tab icons — consistent 2px stroke, rounded caps ──────────────────────
const ICONS = {
  today: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2.5"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
      {active && <path d="M8 14l2.5 2.5L16 11" strokeWidth="2.2"/>}
    </svg>
  ),
  habits: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  insights: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  settings: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
    </svg>
  ),
}

const TABS = [
  { href: '/dashboard',          label: 'Today',    icon: ICONS.today,    exact: true  },
  { href: '/dashboard/habits',   label: 'Habits',   icon: ICONS.habits,   exact: false },
  { href: '/dashboard/insights', label: 'Insights', icon: ICONS.insights, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: ICONS.settings, exact: false },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{
        background:   'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop:    '1px solid var(--glass-border)',
        boxShadow:    '0 -8px 24px rgba(0,0,0,0.30), inset 0 1px 0 var(--glass-border-strong)',
      }}
      aria-label="Main navigation"
    >
      {/* Subtle top shimmer line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--glass-border-strong), transparent)' }}
        aria-hidden="true"
      />

      <div className="max-w-lg mx-auto flex items-stretch justify-around px-1 pt-2 pb-1">
        {TABS.map(tab => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="tab-item flex-1 flex flex-col items-center gap-1 py-2 px-1
                         transition-all duration-150 active:scale-90 rounded-xl"
              style={{
                color:      active ? 'var(--brand)' : 'var(--text-tertiary)',
                background: active ? 'rgba(29,158,117,0.06)' : 'transparent',
                minHeight:  44,
                minWidth:   44,
              }}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active indicator bar — top of tab item */}
              <div
                className="absolute top-0 rounded-b-full transition-all duration-300"
                style={{
                  left:       '50%',
                  transform:  'translateX(-50%)',
                  width:      active ? 24 : 0,
                  height:     2,
                  background: active ? 'var(--brand)' : 'transparent',
                  boxShadow:  active ? '0 0 8px rgba(29,158,117,0.6)' : 'none',
                }}
                aria-hidden="true"
              />

              {/* Icon */}
              <span
                className="transition-transform duration-200"
                style={{ transform: active ? 'scale(1.10)' : 'scale(1)' }}
              >
                {tab.icon(active)}
              </span>

              {/* Label */}
              <span
                className="font-semibold transition-all duration-200"
                style={{
                  fontSize:      10,
                  letterSpacing: '0.04em',
                  opacity:       active ? 1 : 0.7,
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
