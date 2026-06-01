'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: '#0F0E0C', color: '#F5F4F0', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: '#88867F', fontSize: 14, marginBottom: 24, maxWidth: 280, lineHeight: 1.6 }}>
          An unexpected error occurred. Your data is safe.
        </p>
        <button
          onClick={reset}
          style={{ background: '#1D9E75', color: '#0F0E0C', fontWeight: 600, padding: '12px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
