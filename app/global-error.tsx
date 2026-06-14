'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ background: '#0F0E0C', color: '#F5F4F0', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '1.5rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>
          Something went wrong
        </h2>
        <p style={{ color: '#88867F', fontSize: '0.875rem', marginBottom: '2rem', maxWidth: 320, lineHeight: 1.6 }}>
          An unexpected error occurred. Your habit data is safe — please refresh the page.
        </p>
        <button
          onClick={reset}
          style={{ background: '#1D9E75', color: '#0F0E0C', fontWeight: 600, padding: '0.875rem 2rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
