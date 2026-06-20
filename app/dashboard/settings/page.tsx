'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/ui/BottomNav'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useState, useEffect } from 'react'

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M6 4l4 4-4 4"/>
    </svg>
  )
}

export default function SettingsPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [email,       setEmail]       = useState('')
  const [notifGranted, setNotifGranted] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? '')
    })
    if ('Notification' in window) {
      setNotifGranted(Notification.permission === 'granted')
    }
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function registerSW() {
    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/sw.js')
      alert('✓ Offline mode enabled!')
    }
  }

  async function requestNotifications() {
    if (!('Notification' in window)) { alert('Notifications not supported'); return }
    const p = await Notification.requestPermission()
    setNotifGranted(p === 'granted')
    if (p === 'granted') {
      new Notification('HabitLoop 🔁', {
        body: "✓ You'll now get smart reminders before you slip",
        icon: '/icons/icon-192.png',
      })
    }
  }

  async function exportData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: logs   } = await supabase.from('habit_logs').select('*').eq('user_id', user.id).order('date')
    const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id)
    const habitMap = new Map(habits?.map(h => [h.id, h.name]) ?? [])
    const csv = [
      'Date,Habit,Status,Skip Reason,Energy Level,Note',
      ...(logs ?? []).map(l =>
        `${l.date},"${habitMap.get(l.habit_id) ?? l.habit_id}",${l.status},${l.skip_reason ?? ''},${l.energy_level ?? ''},${l.note ? `"${l.note}"` : ''}`
      )
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `habitloop-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const SETTINGS = [
    {
      group: 'Appearance',
      items: [
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ),
          label: 'Dark / Light mode',
          right: <ThemeToggle />,
        },
      ],
    },
    {
      group: 'App',
      items: [
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/>
            </svg>
          ),
          label: 'Enable offline mode',
          sub:   'Use HabitLoop without internet',
          action: registerSW,
        },
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          ),
          label: 'Push notifications',
          sub:   notifGranted ? '✓ Enabled — smart nudges active' : 'Get reminded before you skip',
          action: requestNotifications,
          badge:  notifGranted ? 'On' : undefined,
        },
      ],
    },
    {
      group: 'Your data',
      items: [
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          ),
          label: 'Export my data',
          sub:   'Download all habit logs as CSV',
          action: exportData,
        },
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          ),
          label: 'View insights',
          sub:   'Your patterns and statistics',
          href:  '/dashboard/insights',
        },
      ],
    },
  ]

  return (
    <div className="min-h-dvh pb-28" style={{ background: 'var(--bg-primary)' }}>
      <header className="pwa-header px-5 pb-4">
        <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{email}</p>
      </header>

      <div className="px-4 space-y-4">
        {SETTINGS.map(group => (
          <div key={group.group}>
            <p className="section-label px-1 mb-2">{group.group}</p>
            <div className="card-glass overflow-hidden" style={{ borderRadius: 18 }}>
              {group.items.map((item, i) => {
                const isLast = i === group.items.length - 1
                const Row = (
                  <div
                    className="flex items-center gap-3 px-4 py-4"
                    style={{
                      borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          {item.sub}
                        </p>
                      )}
                    </div>
                    {'right' in item && item.right
                      ? item.right
                      : 'badge' in item && item.badge
                      ? <span className="badge badge-brand">{item.badge}</span>
                      : <span style={{ color: 'var(--text-tertiary)' }}><ChevronIcon /></span>
                    }
                  </div>
                )

                if ('href' in item && item.href) {
                  return (
                    <Link key={item.label} href={item.href} className="block hover:bg-white/3 transition-colors">
                      {Row}
                    </Link>
                  )
                }
                if ('action' in item && item.action) {
                  return (
                    <button key={item.label} onClick={item.action}
                      className="w-full text-left hover:bg-white/3 transition-colors">
                      {Row}
                    </button>
                  )
                }
                return <div key={item.label}>{Row}</div>
              })}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <div>
          <p className="section-label px-1 mb-2">Account</p>
          <div className="card-glass overflow-hidden" style={{ borderRadius: 18 }}>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors"
              style={{ color: '#F87171' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(239,68,68,0.10)' }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="text-center pt-3 pb-8">
          <p className="font-display text-lg gradient-text mb-1">HabitLoop</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            v1.0 · Built with behavioral science · Free forever
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
