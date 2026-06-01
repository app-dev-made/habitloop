'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/ui/BottomNav'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
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
    if (!('Notification' in window)) { alert('Not supported'); return }
    const p = await Notification.requestPermission()
    setNotifGranted(p === 'granted')
    if (p === 'granted') {
      new Notification('HabitLoop 🔁', {
        body: '✓ You\'ll now get smart reminders before you skip',
        icon: '/icons/icon-192.png',
      })
    }
  }

  async function exportData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: logs } = await supabase.from('habit_logs').select('*').eq('user_id', user.id).order('date')
    const { data: habits } = await supabase.from('habits').select('*').eq('user_id', user.id)
    
    const habitMap = new Map(habits?.map(h => [h.id, h.name]) ?? [])
    const csv = [
      'Date,Habit,Status,Energy Level',
      ...(logs ?? []).map(l => `${l.date},${habitMap.get(l.habit_id) ?? l.habit_id},${l.status},${l.energy_level ?? ''}`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habitloop-export-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>
      <header className="pwa-header px-5 pt-6 pb-4">
        <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{email}</p>
      </header>

      <div className="px-4 space-y-3">

        {/* Appearance */}
        <div>
          <p className="section-label px-1 mb-2">Appearance</p>
          <div className="card divide-y overflow-hidden" style={{ borderColor: 'var(--border-color)', '--tw-divide-opacity': 1 } as any}>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl w-8">🎨</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Dark / Light mode</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* App */}
        <div>
          <p className="section-label px-1 mb-2">App</p>
          <div className="card divide-y overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={registerSW} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-ink-700/10 transition-colors">
              <span className="text-xl w-8">📡</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Enable offline mode</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Use HabitLoop without internet</p>
              </div>
            </button>
            <button onClick={requestNotifications} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-ink-700/10 transition-colors">
              <span className="text-xl w-8">🔔</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Push notifications</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {notifGranted ? '✓ Enabled — you\'ll get smart nudges' : 'Get reminded before you skip'}
                </p>
              </div>
              {notifGranted && <span className="text-teal-400 text-xs font-medium">On</span>}
            </button>
          </div>
        </div>

        {/* Data */}
        <div>
          <p className="section-label px-1 mb-2">Your data</p>
          <div className="card divide-y overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={exportData} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-ink-700/10 transition-colors">
              <span className="text-xl w-8">📥</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Export my data</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Download all your habit logs as CSV</p>
              </div>
            </button>
            <Link href="/dashboard/insights" className="flex items-center gap-3 px-4 py-4 hover:bg-ink-700/10 transition-colors">
              <span className="text-xl w-8">📊</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>View insights</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Your patterns and statistics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="section-label px-1 mb-2">Account</p>
          <div className="card overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-red-900/10 transition-colors">
              <span className="text-xl w-8">👋</span>
              <p className="text-sm text-red-400">Sign out</p>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="text-center pt-4 pb-8">
          <p className="font-display text-xl gradient-text mb-1">HabitLoop</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>v2.0 · Built with behavioral science · Free forever</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a href="https://habitloop-rosy.vercel.app" className="text-xs text-teal-400 hover:underline">Website</a>
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Made with ❤️</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
