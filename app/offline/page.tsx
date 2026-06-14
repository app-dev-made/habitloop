'use client'

export default function OfflinePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        aria-hidden="true"
      >
        📡
      </div>
      <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
        You're offline
      </h1>
      <p className="text-sm max-w-xs leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
        No internet connection detected. Your habit data is cached and safe. Come back online to sync.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  )
}
