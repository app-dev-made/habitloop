'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { CATEGORIES } from '@/lib/habits'
import type { Habit } from '@/types'
import HeatMap from '@/components/habits/HeatMap'
import ShareCard from '@/components/ui/ShareCard'
import { useState } from 'react'

interface Props {
  habits: (Habit & { consistency_30d: number })[]
  chartData: { date: string; label: string; done: number; total: number; rate: number }[]
  dowStats: { label: string; rate: number; total: number }[]
  allLogs: { date: string; status: string }[]
  userEmail: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#1D9E75', fontWeight: 600 }}>{payload[0].value}%</p>
    </div>
  )
}

export default function InsightsClient({ habits, chartData, dowStats, allLogs, userEmail }: Props) {
  const [showShare, setShowShare] = useState(false)

  const avgConsistency = habits.length === 0 ? 0
    : Math.round(habits.reduce((a, h) => a + h.consistency_30d, 0) / habits.length)

  const bestDow = [...dowStats].filter(d => d.total > 0).sort((a, b) => b.rate - a.rate)[0]
  const worstDow = [...dowStats].filter(d => d.total > 0).sort((a, b) => a.rate - b.rate)[0]
  const totalLogged = chartData.reduce((a, d) => a + d.done, 0)
  const topHabit = [...habits].sort((a,b) => b.consistency_30d - a.consistency_30d)[0]

  // Streak calculation
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayLogs = allLogs.filter(l => l.date === dateStr && l.status === 'done')
    if (dayLogs.length > 0) streak++
    else if (i > 0) break
  }

  const username = userEmail.split('@')[0]

  return (
    <div className="pb-28">
      <header className="pwa-header px-5 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>Insights</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Last 30 days</p>
        </div>
        <button
          onClick={() => setShowShare(s => !s)}
          className="btn-primary py-2 px-4 text-xs"
        >
          📤 Share
        </button>
      </header>

      <div className="px-4 space-y-4">

        {/* Share card */}
        {showShare && (
          <div className="animate-fade-up">
            <ShareCard
              username={username}
              consistency={avgConsistency}
              topHabit={topHabit?.name ?? 'None yet'}
              streak={streak}
              totalDays={totalLogged}
            />
          </div>
        )}

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="section-label mb-2">Consistency</p>
            <p className="font-display text-4xl gradient-text">{avgConsistency}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>30-day average</p>
          </div>
          <div className="card p-4">
            <p className="section-label mb-2">Streak</p>
            <p className="font-display text-4xl" style={{ color: streak > 0 ? '#F59E0B' : 'var(--text-secondary)' }}>{streak}🔥</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>consecutive days</p>
          </div>
          <div className="card p-4">
            <p className="section-label mb-2">Best day</p>
            <p className="font-display text-3xl text-teal-400">{bestDow?.label ?? '—'}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{bestDow?.rate ?? 0}% success</p>
          </div>
          <div className="card p-4">
            <p className="section-label mb-2">Needs work</p>
            <p className="font-display text-3xl text-amber-400">{worstDow?.label ?? '—'}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{worstDow?.rate ?? 0}% success</p>
          </div>
        </div>

        {/* Heatmap */}
        <HeatMap logs={allLogs} />

        {/* 30-day area chart */}
        <div className="card p-5">
          <p className="section-label mb-1">Daily completion rate</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Last 30 days</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1D9E75" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1D9E75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,72,68,0.2)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#4A4844', fontSize: 9 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: '#4A4844', fontSize: 9 }} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rate" stroke="#1D9E75" strokeWidth={2.5} fill="url(#tealGrad)" dot={false} activeDot={{ r: 4, fill: '#1D9E75', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Day of week */}
        <div className="card p-5">
          <p className="section-label mb-1">Success by day</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Which days you crush it</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={dowStats} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,72,68,0.2)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#4A4844', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#4A4844', fontSize: 9 }} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" fill="#1D9E75" radius={[6,6,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-habit breakdown */}
        {habits.length > 0 && (
          <div className="card p-5">
            <p className="section-label mb-4">Habit breakdown</p>
            <div className="space-y-4">
              {habits.sort((a,b) => b.consistency_30d - a.consistency_30d).map(habit => {
                const cat = CATEGORIES[habit.category]
                const pct = habit.consistency_30d
                const color = pct >= 70 ? '#1D9E75' : pct >= 40 ? '#F59E0B' : '#EF4444'
                const label = pct >= 70 ? 'Great' : pct >= 40 ? 'Building' : 'Needs focus'
                return (
                  <div key={habit.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color}20`, color }}>
                          {label}
                        </span>
                        <span className="text-sm font-semibold" style={{ color }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Science card */}
        <div className="card p-5" style={{ borderColor: 'rgba(29,158,117,0.2)' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>How the prediction engine works</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                After 21 days, HabitLoop builds a personal logistic regression model per habit. It analyzes your day-of-week skip rate, streak fragility, energy trends, and days since last completion to compute a skip risk score (0–100). If risk exceeds 70%, you get a proactive nudge before your usual habit window.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
