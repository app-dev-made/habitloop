'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { CATEGORIES } from '@/lib/habits'
import type { HabitCategory } from '@/types'

const STARTER_HABITS = [
  { name: 'Exercise for 30 min',    category: 'fitness'      as HabitCategory, emoji: '🏃', freq: 5 },
  { name: 'Read for 20 minutes',    category: 'learning'     as HabitCategory, emoji: '📚', freq: 7 },
  { name: 'Meditate',               category: 'mindfulness'  as HabitCategory, emoji: '🧘', freq: 7 },
  { name: 'Drink 8 glasses water',  category: 'health'       as HabitCategory, emoji: '💧', freq: 7 },
  { name: 'Journal',                category: 'mindfulness'  as HabitCategory, emoji: '✍️', freq: 7 },
  { name: 'No phone before 9am',    category: 'mindfulness'  as HabitCategory, emoji: '📵', freq: 7 },
  { name: 'Practice gratitude',     category: 'mindfulness'  as HabitCategory, emoji: '🙏', freq: 7 },
  { name: 'Study / homework',       category: 'learning'     as HabitCategory, emoji: '🎓', freq: 5 },
  { name: 'Sleep by 11pm',          category: 'health'       as HabitCategory, emoji: '😴', freq: 7 },
  { name: 'Walk 10,000 steps',      category: 'fitness'      as HabitCategory, emoji: '👟', freq: 5 },
  { name: 'Eat a healthy meal',     category: 'health'       as HabitCategory, emoji: '🥗', freq: 7 },
  { name: 'Call family or friend',  category: 'social'       as HabitCategory, emoji: '📞', freq: 3 },
]

const STEPS = ['welcome', 'habits', 'reminder'] as const
type Step = typeof STEPS[number]

const REMINDER_OPTIONS = [
  { time: '06:00', label: '🌅 6:00 AM', sub: 'Early bird' },
  { time: '07:00', label: '☀️ 7:00 AM', sub: 'Morning routine' },
  { time: '08:00', label: '🏃 8:00 AM', sub: 'After warmup' },
  { time: '12:00', label: '🌤 12:00 PM', sub: 'Midday check' },
  { time: '18:00', label: '🌇 6:00 PM', sub: 'After work/school' },
  { time: '21:00', label: '🌙 9:00 PM', sub: 'Evening wind-down' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep]         = useState<Step>('welcome')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [reminder, setReminder] = useState('08:00')
  const [loading, setLoading]   = useState(false)
  const [name, setName]         = useState('')
  const [error, setError]       = useState<string | null>(null)

  const stepIndex = STEPS.indexOf(step)
  const progress  = ((stepIndex + 1) / STEPS.length) * 100

  function toggleHabit(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else if (next.size < 5) next.add(i)
      return next
    })
  }

  async function handleFinish() {
    setLoading(true)
    setError(null)
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      if (userErr || !user) { router.push('/auth/login'); return }

      // Save name to auth metadata
      if (name.trim()) {
        await supabase.auth.updateUser({ data: { name: name.trim() } })
      }

      // Create selected habits
      const habits = Array.from(selected).map(i => ({
        user_id:          user.id,
        name:             STARTER_HABITS[i].name,
        category:         STARTER_HABITS[i].category,
        target_frequency: STARTER_HABITS[i].freq,
        target_time:      reminder,
        difficulty:       3,
        active:           true,
      }))
      if (habits.length > 0) {
        const { error: habErr } = await supabase.from('habits').insert(habits)
        if (habErr) console.warn('Habit insert error (non-fatal):', habErr.message)
      }

      // Mark onboarding complete — retry up to 3 times in case trigger is slow
      let marked = false
      for (let attempt = 0; attempt < 3; attempt++) {
        const { error: markErr } = await supabase
          .from('users')
          .update({ onboarding_complete: true })
          .eq('id', user.id)
        if (!markErr) { marked = true; break }
        await new Promise(r => setTimeout(r, 600 * (attempt + 1)))
      }

      if (!marked) {
        // Non-fatal — user can still proceed, onboarding_complete will be false
        // but they'll land on dashboard anyway
        console.warn('Could not mark onboarding complete — proceeding anyway')
      }

      router.push('/dashboard')
    } catch (e: any) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto" style={{ background: 'var(--bg-primary)' }}>

      {/* Progress bar */}
      <div className="h-1" style={{ background: 'var(--bg-secondary)' }}>
        <div className="h-full bg-teal-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: s === step ? 24 : 8, background: i <= stepIndex ? '#1D9E75' : 'var(--bg-secondary)' }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto no-scrollbar">

        {/* STEP 1: Welcome */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 glow-teal"
              style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)' }}
              aria-hidden="true"
            >
              <img src="/icons/icon-96.png" alt="" className="w-14 h-14 rounded-xl" />
            </div>
            <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Welcome to<br /><span className="gradient-text">HabitLoop</span>
            </h1>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Behavioral science meets daily habits. We predict when you'll slip — and nudge you before it happens.
            </p>

            <div className="w-full max-w-xs space-y-3 mb-8">
              {[
                { icon: '⚡', text: 'One tap to log any habit' },
                { icon: '🧠', text: 'Predicts your skip days before they happen' },
                { icon: '📊', text: 'Real insights, not just streaks' },
              ].map(f => (
                <div key={f.icon} className="card flex items-center gap-3 p-3.5">
                  <span className="text-xl" aria-hidden="true">{f.icon}</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="w-full max-w-xs space-y-3">
              <label className="section-label block text-left mb-1">What should we call you?</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your first name (optional)"
                className="input text-base"
                autoFocus
                maxLength={30}
                onKeyDown={e => e.key === 'Enter' && setStep('habits')}
                aria-label="Your first name"
              />
              <button onClick={() => setStep('habits')} className="btn-primary w-full py-4 text-base glow-teal">
                Let's build your habits →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Pick habits */}
        {step === 'habits' && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="mb-5">
              <h2 className="font-display text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>Pick your habits</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Choose up to 5. Start small — you can always add more later.
              </p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar mb-4" role="list">
              {STARTER_HABITS.map((h, i) => {
                const isSelected = selected.has(i)
                const isDisabled = !isSelected && selected.size >= 5
                const cat = CATEGORIES[h.category]
                return (
                  <button
                    key={i}
                    onClick={() => toggleHabit(i)}
                    disabled={isDisabled}
                    role="listitem"
                    aria-pressed={isSelected}
                    aria-label={`${h.name} — ${cat.label}`}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left"
                    style={{
                      borderColor: isSelected ? '#1D9E75' : 'var(--border-color)',
                      background:  isSelected ? 'rgba(29,158,117,0.08)' : 'transparent',
                      opacity:     isDisabled ? 0.35 : 1,
                    }}
                  >
                    <span className="text-2xl" aria-hidden="true">{h.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{h.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center text-ink-900 text-xs font-bold animate-bounce-in" aria-hidden="true">✓</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{selected.size}/5 selected</p>
                <div className="flex gap-1" aria-hidden="true">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: selected.size >= n ? '#1D9E75' : 'var(--border-color)' }} />
                  ))}
                </div>
              </div>
              <button onClick={() => setStep('reminder')} disabled={selected.size === 0} className="btn-primary w-full py-4 disabled:opacity-40">
                Continue with {selected.size} habit{selected.size !== 1 ? 's' : ''} →
              </button>
              <button onClick={() => setStep('reminder')} className="btn-ghost w-full py-3 text-sm">
                Skip — I'll add habits manually
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Reminder */}
        {step === 'reminder' && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="mb-6">
              <h2 className="font-display text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>Set your reminder</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                When should we check in? We'll only notify if you haven't logged yet.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {REMINDER_OPTIONS.map(opt => (
                <button
                  key={opt.time}
                  onClick={() => setReminder(opt.time)}
                  className="p-4 rounded-2xl border-2 text-left transition-all"
                  aria-pressed={reminder === opt.time}
                  style={{
                    borderColor: reminder === opt.time ? '#1D9E75' : 'var(--border-color)',
                    background:  reminder === opt.time ? 'rgba(29,158,117,0.08)' : 'transparent',
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{opt.sub}</p>
                </button>
              ))}
            </div>

            <div className="card p-4 mb-6">
              <label className="section-label block mb-2" htmlFor="custom-time">Custom time</label>
              <input
                id="custom-time"
                type="time"
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                className="input text-xl font-display text-center py-3"
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button onClick={handleFinish} disabled={loading} className="btn-primary w-full py-4 glow-teal">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" aria-hidden="true" />
                  Setting up your habits…
                </span>
              ) : "Let's go! 🚀"}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
