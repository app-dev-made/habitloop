'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setDark(false)
      document.documentElement.classList.add('light')
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      className="w-12 h-6 rounded-full border border-ink-600/60 flex items-center px-0.5 transition-all duration-300 relative overflow-hidden"
      style={{ background: dark ? '#1E1D1A' : '#E8E6DF' }}
      aria-label="Toggle theme"
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300"
        style={{
          background: dark ? '#1D9E75' : '#FFD700',
          transform: dark ? 'translateX(0)' : 'translateX(24px)',
        }}
      >
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  )
}
