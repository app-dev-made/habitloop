import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg-primary)' }}>
      <p className="font-display text-8xl gradient-text mb-4">404</p>
      <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>Page not found</h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
        This page doesn't exist. But your habits are still waiting.
      </p>
      <Link href="/dashboard" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  )
}
