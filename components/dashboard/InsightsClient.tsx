'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { CATEGORIES } from '@/lib/habits'
import type { Habit } from '@/types'
import HeatMap from '@/components/habits/HeatMap'
import ShareCard from '@/components/ui/ShareCard'

interface Props {
  habits:    (Habit & { consistency_30d: number })[]
  chartData: { date: string; label: string; done: number; total: number; rate: number }[]
  dowStats:  { label: string; rate: number; total: number }[]
  allLogs:   { date: string; status: string }[]
  userEmail: string
}

// ── Custom chart tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="card-glass px-3 py-2 text-xs"
      style={{ borderRadius: 10, minWidth: 80 }}
    >
      <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <p className="font-bold" style={{ color: 'var(--text-brand)' }}>{payload[0].value}%</p>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card-glass p-4">
      <p className="section-label mb-2">{label}</p>
      <p
        className="font-display leading-none"
        style={{ fontSize: 32, color: color ?? 'var(--text-brand)' }}
      >
        {value}
      </p>
      {sub && <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InsightsClient({ habits, chartData, dowStats, allLogs, userEmail }: Props) {
  const [showShare, setShowShare] = useState(false)

  const avgConsistency = habits.length === 0 ? 0
    : Math.round(habits.reduce((a, h) => a + h.consistency_30d, 0) / habits.length)

  const bestDow  = [...dowStats].filter(d => d.total > 0).sort((a, b) => b.rate - a.rate)[0]
  const worstDow = [...dowStats].filter(d => d.total > 0).sort((a, b) => a.rate - b.rate)[0]
  const totalLogged = chartData.reduce((a, d) => a + d.done, 0)
  const topHabit    = [...habits].sort((a, b) => b.consistency_30d - a.consistency_30d)[0]

  // Streak
  let streak = 0
  const todayD = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(todayD)
    d.setDate(d.getDate() - i)
    const dateStr  = d.toISOString().slice(0, 10)
    const dayLogs  = allLogs.filter(l => l.date === dateStr && l.status === 'done')
    if (dayLogs.length > 0) streak++
    else if (i > 0) break
  }

  const username = userEmail.split('@')[0]

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="pwa-header px-5 pb-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>Insights</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Last 30 days</p>
        </div>
        <button
          onClick={() => setShowShare(s => !s)}
          className="btn-glass py-2 px-4 text-xs mt-1"
          aria-label="Share your stats"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share
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

        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Consistency"  value={`${avgConsistency}%`} sub="30-day average" />
          <StatCard label="Streak"       value={`${streak}d`}         sub="consecutive days"
            color={streak > 0 ? '#FCD34D' : 'var(--text-secondary)'} />
          <StatCard label="Best day"     value={bestDow?.label  ?? '—'} sub={`${bestDow?.rate  ?? 0}% success`} />
          <StatCard label="Needs work"   value={worstDow?.label ?? '—'} sub={`${worstDow?.rate ?? 0}% success`}
            color="var(--text-warning)" />
        </div>

        {/* Heatmap */}
        <HeatMap logs={allLogs} />

        {/* 30-day area chart */}
        <div className="card-glass p-5">
          <p className="section-label mb-1">Daily completion rate</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Last 30 days</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1D9E75" stopOpacity={0.35}/>
                  <stop offset="100%" stopColor="#1D9E75" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false}/>
              <XAxis dataKey="label" tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }} tickLine={false} axisLine={false} interval={6}/>
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="rate" stroke="#1D9E75" strokeWidth={2.5}
                fill="url(#tealGrad)" dot={false}
                activeDot={{ r: 4, fill: '#1D9E75', strokeWidth: 0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Day-of-week bar chart */}
        <div className="card-glass p-5">
          <p className="section-label mb-1">Success by day of week</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Which days you crush it</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={dowStats} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false}/>
              <XAxis dataKey="label" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Bar dataKey="rate" fill="#1D9E75" radius={[6,6,0,0]} maxBarSize={32}
                style={{ filter: 'drop-shadow(0 0 4px rgba(29,158,117,0.30))' }}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-habit breakdown */}
        {habits.length > 0 && (
          <div className="card-glass p-5">
            <p className="section-label mb-4">Habit breakdown</p>
            <div className="space-y-4">
              {[...habits].sort((a,b) => b.consistency_30d - a.consistency_30d).map(habit => {
                const cat   = CATEGORIES[habit.category]
                const pct   = habit.consistency_30d
                const color = pct >= 70 ? '#1D9E75' : pct >= 40 ? '#F59E0B' : '#EF4444'
                const label = pct >= 70 ? 'Great'  : pct >= 40 ? 'Building' : 'Needs focus'
                return (
                  <div key={habit.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base flex-shrink-0" aria-hidden="true">{cat.emoji}</span>
                        <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                          style={{ background: `${color}18`, color }}
                        >
                          {label}
                        </span>
                        <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--bg-elevated)' }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${habit.name} consistency: ${pct}%`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Science card */}
        <div className="card-glass p-5" style={{ borderColor: 'var(--border-brand)' }}>
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--brand-dim)', color: 'var(--brand)' }}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79A2.5 2.5 0 0 1 4.5 9a2.5 2.5 0 0 1 5-1.23"/>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.79A2.5 2.5 0 0 0 19.5 9a2.5 2.5 0 0 0-5-1.23"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                How the prediction engine works
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                After 21 days, HabitLoop builds a personal logistic regression model per habit. It analyzes your day-of-week skip rate, streak fragility, energy trends, and days since last completion to compute a 0–100 skip risk score. When risk exceeds 70%, you get a proactive nudge — before you fail, not after.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
