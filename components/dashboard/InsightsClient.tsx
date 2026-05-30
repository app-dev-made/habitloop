'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, CartesianGrid
} from 'recharts'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/habits'
import type { Habit } from '@/types'

interface Props {
  habits: (Habit & { consistency_30d: number })[]
  chartData: { date: string; label: string; done: number; total: number; rate: number }[]
  dowStats: { label: string; rate: number; total: number }[]
}

export default function InsightsClient({ habits, chartData, dowStats }: Props) {
  const avgConsistency = habits.length === 0 ? 0
    : Math.round(habits.reduce((a, h) => a + h.consistency_30d, 0) / habits.length)

  const bestDow = [...dowStats].sort((a, b) => b.rate - a.rate)[0]
  const worstDow = [...dowStats].filter(d => d.total > 0).sort((a, b) => a.rate - b.rate)[0]

  return (
    <div className="min-h-screen bg-ink-900 max-w-lg mx-auto">
      {/* Header */}
      <header className="safe-top px-6 pt-6 pb-4 flex items-center gap-3">
        <Link href="/dashboard" className="w-9 h-9 rounded-full bg-ink-800 border border-ink-600/40 flex items-center justify-center text-ink-300 hover:text-teal-400 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4"/>
          </svg>
        </Link>
        <h1 className="font-display text-2xl text-ink-50">Your insights</h1>
      </header>

      <div className="px-4 pb-12 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '30d avg', value: `${avgConsistency}%`, sub: 'consistency' },
            { label: 'Best day', value: bestDow?.label ?? '—', sub: `${bestDow?.rate ?? 0}% done` },
            { label: 'Watch out', value: worstDow?.label ?? '—', sub: `${worstDow?.rate ?? 0}% done` },
          ].map(s => (
            <div key={s.label} className="card px-3 py-4 text-center">
              <p className="text-teal-400 font-display text-2xl">{s.value}</p>
              <p className="text-ink-400 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 30-day area chart */}
        <div className="card p-5">
          <p className="section-label mb-4">Daily completion rate — 30 days</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2926" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#88867F', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: '#88867F', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip
                contentStyle={{ background: '#1E1D1A', border: '1px solid #2a2926', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#E8E6DF' }}
                itemStyle={{ color: '#1D9E75' }}
                formatter={(v: number) => [`${v}%`, 'Completion']}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#1D9E75"
                strokeWidth={2}
                fill="url(#tealGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Day of week bar chart */}
        <div className="card p-5">
          <p className="section-label mb-4">Success rate by day of week</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={dowStats} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2926" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#88867F', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#88867F', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ background: '#1E1D1A', border: '1px solid #2a2926', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#E8E6DF' }}
                itemStyle={{ color: '#1D9E75' }}
                formatter={(v: number) => [`${v}%`, 'Done']}
              />
              <Bar dataKey="rate" fill="#1D9E75" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-habit consistency */}
        <div className="card p-5">
          <p className="section-label mb-4">Habit consistency — 30 days</p>
          <div className="space-y-4">
            {habits.length === 0 && (
              <p className="text-ink-500 text-sm text-center py-4">No habits yet</p>
            )}
            {habits.map(habit => {
              const cat = CATEGORIES[habit.category]
              return (
                <div key={habit.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span className="text-sm text-ink-200">{habit.name}</span>
                    </div>
                    <span className="text-sm font-medium text-teal-400">{habit.consistency_30d}%</span>
                  </div>
                  <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${habit.consistency_30d}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
