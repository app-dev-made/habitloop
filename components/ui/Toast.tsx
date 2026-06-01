'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onDone?: () => void
}

export function Toast({ message, type = 'success', onDone }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDone?.(), 300)
    }, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  const icons = { success: '✓', error: '✕', info: 'ℹ' }
  const colors = {
    success: 'text-teal-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  }

  return (
    <div className={`toast transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <span className={`font-bold ${colors[type]}`}>{icons[type]}</span>
      {message}
    </div>
  )
}

// Toast manager
let toastCallback: ((msg: string, type?: 'success' | 'error' | 'info') => void) | null = null

export function setToastCallback(cb: typeof toastCallback) {
  toastCallback = cb
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toastCallback?.(message, type)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([])

  useEffect(() => {
    setToastCallback((message, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
    })
    return () => setToastCallback(null)
  }, [])

  return (
    <>
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDone={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
        />
      ))}
    </>
  )
}
