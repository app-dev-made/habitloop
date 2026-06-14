'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    // Read current theme from DOM (set by layout inline script)
    const isDark = !document.documentElement.classList.contains('light')
    setDark(isDark)
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

    // Dispatch event so any listeners can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark: next } }))
  }

  return (
    <button
      onClick={toggle}
      className="relative flex items-center w-12 h-6 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      style={{ background: dark ? '#1E1D1A' : '#E8E6DF', border: '1px solid var(--border-color)' }}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      aria-pressed={!dark}
      role="switch"
    >
      <span
        className="absolute w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300 shadow-sm"
        style={{
          background:  dark ? '#1D9E75' : '#FFB800',
          left:        dark ? 2 : 'calc(100% - 22px)',
          top:         '50%',
          transform:   'translateY(-50%)',
        }}
        aria-hidden="true"
      >
        {dark ? '🌙' : '☀️'}
      </span>
      <span className="sr-only">{dark ? 'Dark mode on' : 'Light mode on'}</span>
    </button>
  )
}
