'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })

    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="px-6 py-5">
        <Link href="/" className="font-display text-2xl gradient-text">HabitLoop</Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {!sent ? (
            <div className="animate-scale-in">
              <div className="text-center mb-10">
                <h1 className="font-display text-4xl text-ink-50 mb-3">Welcome back</h1>
                <p className="text-ink-400 text-sm leading-relaxed">
                  Enter your email and we'll send you a magic link.<br />No password needed.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full text-base py-4 glow-teal"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : 'Send magic link'}
                </button>
              </form>

              <p className="text-center text-ink-600 text-xs mt-6">
                New here? Just enter your email — we'll create your account.
              </p>

              <div className="mt-10 pt-6 border-t border-ink-700/30">
                <p className="section-label text-center mb-4">Why HabitLoop?</p>
                <div className="space-y-3">
                  {[
                    { icon: '🧠', text: 'Predicts when you\'ll skip — before it happens' },
                    { icon: '⚡', text: 'One tap to log any habit' },
                    { icon: '📊', text: 'Real insights, not just streaks' },
                  ].map(f => (
                    <div key={f.icon} className="flex items-center gap-3">
                      <span className="text-lg">{f.icon}</span>
                      <span className="text-ink-400 text-xs">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center animate-scale-in">
              <div className="w-20 h-20 rounded-3xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-4xl mx-auto mb-6">
                ✉️
              </div>
              <h2 className="font-display text-3xl text-ink-50 mb-3">Check your email</h2>
              <p className="text-ink-400 text-sm leading-relaxed mb-2">
                We sent a magic link to
              </p>
              <p className="text-ink-200 font-medium text-sm mb-8">{email}</p>
              <p className="text-ink-500 text-xs mb-8">
                Click the link in your email to sign in instantly — no password needed.
              </p>
              <button
                onClick={() => { setSent(false); setError(null) }}
                className="btn-ghost text-sm"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
