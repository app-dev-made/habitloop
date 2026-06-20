'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

export default function LoginPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(29,158,117,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-5">
        <Link href="/" className="font-display text-2xl gradient-text" aria-label="HabitLoop home">
          HabitLoop
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10" id="main-content">
        <div className="w-full max-w-sm">

          {!sent ? (
            <div className="animate-scale-in">
              <div className="text-center mb-10">
                {/* Logo mark */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-brand"
                  style={{ background: 'var(--brand-dim)', border: '1px solid var(--border-brand)' }}
                  aria-hidden="true"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.5 6 7 9 8 13c-2-1-3-3-2.5-5.5C2 10 1 14 3 17c1 2 3 4 6 4.5V18c0-1.5 1-3 2-4 .5 1 .5 2 0 3 2-1 3.5-3 3.5-5.5 0-3-2-5.5-2-9.5z"/>
                  </svg>
                </div>
                <h1 className="font-display text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
                  Welcome back
                </h1>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Enter your email — we'll send a magic link.<br />No password needed, ever.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="section-label block mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input text-base"
                    autoComplete="email"
                    autoFocus
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                </div>

                {error && (
                  <div
                    id="login-error"
                    role="alert"
                    className="px-4 py-3 rounded-xl text-sm text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary w-full py-4 text-base glow-brand"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" aria-hidden="true"/>
                      Sending magic link…
                    </span>
                  ) : 'Send magic link →'}
                </button>
              </form>

              <p className="text-center text-xs mt-5" style={{ color: 'var(--text-tertiary)' }}>
                New here? Just enter your email — we'll create your account automatically.
              </p>

              {/* Value props */}
              <div className="mt-10 pt-6 space-y-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="section-label text-center mb-3">Why HabitLoop?</p>
                {[
                  { icon: '🧠', text: 'Predicts when you\'ll skip — before it happens' },
                  { icon: '⚡', text: 'One tap to log any habit' },
                  { icon: '📊', text: 'Real behavioral insights, not just streaks' },
                  { icon: '📲', text: 'Installs on your home screen like a native app' },
                ].map(f => (
                  <div
                    key={f.icon}
                    className="flex items-center gap-3 card-glass px-4 py-3"
                    style={{ borderRadius: 14 }}
                  >
                    <span className="text-lg flex-shrink-0" aria-hidden="true">{f.icon}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

          ) : (
            <div className="text-center animate-scale-in">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6"
                style={{ background: 'var(--brand-dim)', border: '1px solid var(--border-brand)' }}
                role="img"
                aria-label="Email sent"
              >
                ✉️
              </div>
              <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
                Check your email
              </h2>
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                We sent a magic link to
              </p>
              <p
                className="font-semibold text-sm mb-6 px-4 py-2 rounded-xl inline-block"
                style={{ color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                {email}
              </p>
              <p className="text-xs mb-8 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                Click the link in your email to sign in instantly.<br />
                Expires in 1 hour. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setSent(false); setError(null) }}
                className="btn-ghost text-sm"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
