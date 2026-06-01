'use client'

import { useEffect } from 'react'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg-primary)' }}>
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Couldn't load your habits</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Check your internet connection and try again.</p>
      <button onClick={reset} className="btn-primary">Retry</button>
    </div>
  )
}
