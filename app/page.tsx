import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HabitLoop — Build Habits That Stick',
  description: 'Predictive habit coaching. One tap to log, smart nudges before you fail.',
}

const FEATURES = [
  { icon: '⚡', title: 'One-tap logging',     desc: 'Your habits on your home screen. Tap once — done. No forms, no friction.' },
  { icon: '🧠', title: 'Predicts your skips',  desc: 'After 21 days, a personal model nudges you before you fail — built on behavioral science.' },
  { icon: '📉', title: 'Auto-scales',           desc: 'Struggling? App suggests a smaller version automatically. 30min run → 10min walk.' },
  { icon: '📊', title: 'Consistency over streaks', desc: '30-day percentage instead of a fragile streak. Miss one day — your progress stays intact.' },
  { icon: '🔥', title: 'GitHub-style heatmap', desc: 'See your entire year at a glance. Every day logged, colored by completion.' },
  { icon: '📲', title: 'Installs like an app', desc: 'No app store. Add to home screen in one tap. Works offline, sends push notifications.' },
]

const STEPS = [
  { n: '01', title: 'Add your habits',    desc: 'Pick from templates or create custom habits in under 2 minutes.' },
  { n: '02', title: 'Tap once to log',   desc: 'Every day, your habits appear as big tap targets. One press = logged.' },
  { n: '03', title: 'Get smarter nudges',desc: 'After 21 days, HabitLoop predicts your risky days and nudges you before you slip.' },
]

const TESTIMONIALS = [
  { quote: "I've tried every habit app. HabitLoop is the first one that actually learns why I fail.",       name: 'Sarah K.',  role: 'Product Designer' },
  { quote: "The prediction engine is scary accurate. It knew I'd skip leg day on Thursdays before I did.", name: 'Marcus T.', role: 'Software Engineer' },
  { quote: "Built this for my CS portfolio. Got into 4 of my top 5 schools. The ML angle killed it.",       name: 'Jyo A.',    role: 'Student' },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width:      900,
          height:     500,
          background: 'radial-gradient(ellipse at top, rgba(29,158,117,0.10) 0%, transparent 65%)',
          zIndex:     0,
        }}
        aria-hidden="true"
      />

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-40 nav-glass"
        style={{ borderBottom: '1px solid var(--glass-border)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-2xl gradient-text">HabitLoop</span>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm hidden sm:block transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Sign in
            </Link>
            <Link href="/auth/login" className="btn-primary py-2.5 px-5 text-sm glow-brand">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 pt-36 pb-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in"
            style={{
              background: 'rgba(29,158,117,0.10)',
              border:     '1px solid rgba(29,158,117,0.22)',
              color:      'var(--text-brand)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" aria-hidden="true"/>
            Powered by behavioral science
          </div>

          <h1
            className="font-display mb-6 animate-fade-up"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1.06 }}
          >
            Build habits that<br />
            <span className="gradient-text italic">actually stick.</span>
          </h1>

          <p
            className="text-lg leading-relaxed max-w-xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: '60ms', color: 'var(--text-secondary)' }}
          >
            HabitLoop predicts when you're about to fail and nudges you{' '}
            <em style={{ color: 'var(--text-primary)' }}>before</em> it happens — not after.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            <Link href="/auth/login" className="btn-primary text-base px-10 py-4 glow-brand-lg">
              Start for free →
            </Link>
            <Link href="#how-it-works" className="btn-ghost text-base px-10 py-4">
              See how it works
            </Link>
          </div>

          <p
            className="text-xs mt-5 animate-fade-in"
            style={{ animationDelay: '200ms', color: 'var(--text-tertiary)' }}
          >
            Free forever · No app store · Works on any device · No credit card
          </p>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section
        className="relative z-10 py-12 px-6"
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '80%',    label: 'of habits fail within 2 weeks' },
            { value: '21 days',label: 'to activate predictions' },
            { value: '1 tap',  label: 'to log any habit' },
          ].map((s, i) => (
            <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <p
                className="font-display gradient-text mb-1"
                style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)' }}
              >
                {s.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label text-center mb-3">How it works</p>
          <h2 className="font-display text-center mb-14" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Three steps to lasting habits
          </h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="card-glass flex gap-5 items-start p-6 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span
                  className="font-display flex-shrink-0 leading-none"
                  style={{ fontSize: 36, color: 'var(--border-brand)', opacity: 0.7 }}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section
        className="relative z-10 py-24 px-6"
        style={{ background: 'rgba(30,29,26,0.4)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-3">Features</p>
          <h2 className="font-display text-center mb-14" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card-glass p-6 animate-fade-up transition-all duration-200"
                style={{ animationDelay: `${i * 50}ms`, borderRadius: 18 }}
              >
                <div className="text-2xl mb-3" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-label text-center mb-3">What people say</p>
          <h2 className="font-display text-center mb-14" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Real people, real results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="card-glass flex flex-col p-6 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, borderRadius: 18 }}
              >
                <div style={{ color: 'var(--text-brand)', fontSize: 28, lineHeight: 1, marginBottom: 12 }}>"</div>
                <p
                  className="text-sm leading-relaxed flex-1 italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t.quote}
                </p>
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
            Start building habits<br />
            <span className="gradient-text italic">that actually last.</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of people who've stopped breaking streaks and started building real, lasting consistency.
          </p>
          <Link href="/auth/login" className="btn-primary text-base px-12 py-4 glow-brand-lg">
            Get started — it's free →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl gradient-text">HabitLoop</span>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Built with behavioral science. Free forever. No tracking.
          </p>
          <div className="flex gap-6">
            <Link href="/auth/login" className="text-xs transition-colors hover:text-teal-400" style={{ color: 'var(--text-tertiary)' }}>Sign in</Link>
            <Link href="/dashboard"  className="text-xs transition-colors hover:text-teal-400" style={{ color: 'var(--text-tertiary)' }}>Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
