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
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-ink-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-scale-in">

        {/* Logo */}
        <Link href="/" className="block text-center mb-10">
          <span className="font-display text-3xl text-teal-400">HabitLoop</span>
        </Link>

        {!sent ? (
          <>
            <h1 className="font-display text-3xl text-ink-50 text-center mb-2">
              Welcome back
            </h1>
            <p className="text-ink-400 text-center mb-8 text-sm">
              Enter your email — we'll send you a magic link. No password needed.
            </p>

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
                  className="input"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>

            <p className="text-center text-ink-500 text-xs mt-6">
              New here? Just enter your email — we'll create your account automatically.
            </p>
          </>
        ) : (
          <div className="text-center animate-fade-up">
            <div className="text-5xl mb-6">✉️</div>
            <h2 className="font-display text-3xl text-ink-50 mb-3">Check your email</h2>
            <p className="text-ink-400 text-sm leading-relaxed mb-8">
              We sent a magic link to <span className="text-ink-200">{email}</span>.
              Click it to sign in — no password needed.
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
  )
}
