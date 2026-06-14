'use client'

import { useEffect, useRef } from 'react'

export default function Confetti({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timersRef    = useRef<number[]>([])

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const colors    = ['#1D9E75', '#9FE1CB', '#FFD700', '#FF8C69', '#A78BFA', '#60A5FA']
    const pieces    = 70

    // Add keyframe if not already present
    const styleId  = 'habitloop-confetti-style'
    if (!document.getElementById(styleId)) {
      const style   = document.createElement('style')
      style.id      = styleId
      style.textContent = `
        @keyframes confettifall {
          0%   { transform: translateY(-10px) rotate(0deg) scale(1);   opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg) scale(0.5); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    for (let i = 0; i < pieces; i++) {
      const el       = document.createElement('div')
      const color    = colors[Math.floor(Math.random() * colors.length)]
      const size     = Math.random() * 9 + 4
      const x        = Math.random() * 100
      const delay    = Math.random() * 0.8
      const duration = Math.random() * 2.5 + 2
      const isCircle = Math.random() > 0.4

      el.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: -16px;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.4}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        animation: confettifall ${duration}s ease-in ${delay}s forwards;
        pointer-events: none;
        z-index: 9999;
        will-change: transform;
      `
      container.appendChild(el)

      const timer = window.setTimeout(() => {
        if (container.contains(el)) container.removeChild(el)
      }, (duration + delay) * 1000 + 200)

      timersRef.current.push(timer)
    }

    return () => {
      // Cleanup all pending timers and DOM nodes on unmount
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [active])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      aria-hidden="true"
    />
  )
}
