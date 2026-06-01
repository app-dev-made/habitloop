'use client'

import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-install-dismissed')) return

    // iOS detection
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    if (ios) {
      // Show iOS install instructions after 3s
      setTimeout(() => setShow(true), 3000)
      return
    }

    // Android/Desktop — listen for beforeinstallprompt
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => setShow(false))
    }
  }

  function handleDismiss() {
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto z-50 animate-slide-up">
      <div className="card-glass border border-teal-400/20 p-4 flex items-start gap-3 shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">📲</span>
        </div>
        <div className="flex-1">
          <p className="text-ink-50 text-sm font-semibold mb-0.5">Add to Home Screen</p>
          {isIOS ? (
            <p className="text-ink-400 text-xs leading-relaxed">
              Tap <span className="text-ink-200">Share</span> then <span className="text-ink-200">Add to Home Screen</span> for the full app experience
            </p>
          ) : (
            <p className="text-ink-400 text-xs">Install HabitLoop for offline access and push notifications</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!isIOS && (
            <button onClick={handleInstall} className="text-teal-400 text-xs font-semibold whitespace-nowrap hover:text-teal-300 transition-colors">
              Install
            </button>
          )}
          <button onClick={handleDismiss} className="text-ink-500 text-xs hover:text-ink-300 transition-colors">
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
