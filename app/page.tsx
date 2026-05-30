import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-900 flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 pt-8 pb-4">
        <span className="font-display text-2xl text-teal-400">HabitLoop</span>
        <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <p className="section-label mb-4">Habit tracking, reimagined</p>
          <h1 className="font-display text-5xl md:text-7xl text-ink-50 leading-tight mb-6">
            Build habits<br />
            <span className="text-teal-400">that stick.</span>
          </h1>
          <p className="text-ink-300 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            HabitLoop predicts when you're about to skip — and nudges you
            before it happens. One tap to log. No streaks to break. Just progress.
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          <Link href="/auth/login" className="btn-primary text-center text-base">
            Start for free
          </Link>
          <a href="#how-it-works" className="btn-ghost text-center text-base">
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <p className="text-ink-500 text-sm mt-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Free forever · No app store needed · Works on any device
        </p>
      </section>

      {/* Feature grid */}
      <section id="how-it-works" className="px-6 pb-20 max-w-4xl mx-auto w-full">
        <p className="section-label text-center mb-10">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'One tap to log',
              desc: 'Your habits live on your home screen. Tap once — done. Faster than ignoring it.',
            },
            {
              step: '02',
              title: 'We learn your patterns',
              desc: 'After 21 days, HabitLoop builds a personal model of when and why you skip.',
            },
            {
              step: '03',
              title: 'Smart nudges before you fail',
              desc: '"You usually skip this on Tuesdays — want to do 5 min instead?" Not after. Before.',
            },
          ].map((f, i) => (
            <div
              key={f.step}
              className="card p-6 animate-fade-up"
              style={{ animationDelay: `${i * 60 + 100}ms` }}
            >
              <span className="font-display text-teal-400/40 text-4xl block mb-3">{f.step}</span>
              <h3 className="font-body font-medium text-ink-50 text-lg mb-2">{f.title}</h3>
              <p className="text-ink-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-16 text-center">
        <Link href="/auth/login" className="btn-primary inline-block text-base px-8">
          Get started — it's free
        </Link>
      </section>

    </main>
  )
}
