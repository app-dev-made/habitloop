'use client'

import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router  = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/sw.js')
      alert('Service worker registered! Offline mode active.')
    } else {
      alert('Service workers not supported in this browser.')
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 max-w-lg mx-auto">
      <header className="safe-top px-6 pt-6 pb-4 flex items-center gap-3">
        <Link href="/dashboard" className="w-9 h-9 rounded-full bg-ink-800 border border-ink-600/40 flex items-center justify-center text-ink-300 hover:text-teal-400 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4"/>
          </svg>
        </Link>
        <h1 className="font-display text-2xl text-ink-50">Settings</h1>
      </header>

      <div className="px-4 space-y-4 pb-12">

        <div className="card divide-y divide-ink-700/50">
          {[
            { label: 'Enable offline mode', action: registerServiceWorker, icon: '📡' },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-ink-700/20 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-ink-200 text-sm">{item.label}</span>
              <svg className="ml-auto text-ink-500" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4l4 4-4 4"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="card divide-y divide-ink-700/50">
          <Link href="/dashboard/insights" className="flex items-center gap-3 px-4 py-4 hover:bg-ink-700/20 transition-colors">
            <span className="text-xl">📊</span>
            <span className="text-ink-200 text-sm">View insights</span>
            <svg className="ml-auto text-ink-500" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4"/>
            </svg>
          </Link>
        </div>

        <div className="card">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-ink-700/20 transition-colors"
          >
            <span className="text-xl">👋</span>
            <span className="text-red-400 text-sm">Sign out</span>
          </button>
        </div>

        <p className="text-center text-ink-600 text-xs pt-4">
          HabitLoop v0.1 · Built with Next.js + Supabase
        </p>
      </div>
    </div>
  )
}
