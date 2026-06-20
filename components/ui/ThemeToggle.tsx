'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    setDark(!document.documentElement.classList.contains('light'))
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
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark: next } }))
  }

  return (
    <button
      onClick={toggle}
      className="relative flex items-center transition-all duration-300"
      style={{
        width:        48,
        height:       26,
        borderRadius: 13,
        background:   dark ? 'var(--bg-elevated)' : '#E8E6DF',
        border:       '1px solid var(--border-default)',
        padding:      2,
      }}
      role="switch"
      aria-checked={!dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
    >
      <span
        className="flex items-center justify-center rounded-full text-xs transition-all duration-300"
        style={{
          width:      20,
          height:     20,
          background: dark ? 'var(--brand)' : '#FFB800',
          transform:  dark ? 'translateX(0)' : 'translateX(22px)',
          boxShadow:  dark ? '0 0 8px rgba(29,158,117,0.40)' : '0 0 8px rgba(255,184,0,0.40)',
        }}
        aria-hidden="true"
      >
        {dark ? '🌙' : '☀️'}
      </span>
      <span className="sr-only">{dark ? 'Dark mode active' : 'Light mode active'}</span>
    </button>
  )
}
