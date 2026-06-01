'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        ⚠️
      </div>
      <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Something went wrong</h2>
      <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Don't worry — your habit data is safe. Try refreshing the page.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">Try again</button>
        <Link href="/dashboard" className="btn-ghost">Go home</Link>
      </div>
    </div>
  )
}
