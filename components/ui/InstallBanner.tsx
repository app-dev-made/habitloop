'use client'

import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [show,           setShow]           = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS,          setIsIOS]          = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-install-dismissed')) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
      && !('MSStream' in window)
    setIsIOS(ios)

    if (ios) {
      const t = setTimeout(() => setShow(true), 4000)
      return () => clearTimeout(t)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShow(true), 4000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto z-50 animate-slide-up">
      <div
        className="card-glass flex items-start gap-3 p-4 shadow-2xl"
        style={{ borderColor: 'rgba(29,158,117,0.22)' }}
        role="dialog"
        aria-label="Install HabitLoop"
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--brand-dim)', border: '1px solid rgba(29,158,117,0.20)' }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="3"/>
            <path d="M12 18h.01"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Add to Home Screen
          </p>
          {isIOS ? (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Tap <strong style={{ color: 'var(--text-primary)' }}>Share</strong> →{' '}
              <strong style={{ color: 'var(--text-primary)' }}>Add to Home Screen</strong>{' '}
              for the full native experience
            </p>
          ) : (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Install for offline access, push notifications, and a faster experience
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="text-xs font-bold transition-colors whitespace-nowrap"
              style={{ color: 'var(--text-brand)' }}
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-xs transition-colors whitespace-nowrap"
            style={{ color: 'var(--text-tertiary)' }}
            aria-label="Dismiss install prompt"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
