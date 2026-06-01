'use client'

import { useEffect, useRef } from 'react'

export default function Confetti({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return
    const container = containerRef.current
    const colors = ['#1D9E75', '#9FE1CB', '#FFD700', '#FF6B6B', '#A78BFA']
    const pieces = 60

    for (let i = 0; i < pieces; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 8 + 4
      const x = Math.random() * 100
      const delay = Math.random() * 0.5
      const duration = Math.random() * 2 + 2
      const rotation = Math.random() * 720

      el.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confettifall ${duration}s ease-in ${delay}s forwards;
        pointer-events: none;
        z-index: 9999;
      `
      container.appendChild(el)
      setTimeout(() => el.remove(), (duration + delay) * 1000 + 100)
    }

    const style = document.createElement('style')
    style.textContent = `
      @keyframes confettifall {
        to { transform: translateY(110vh) rotate(${Math.random() * 720}deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [active])

  return <div ref={containerRef} className="pointer-events-none" />
}
