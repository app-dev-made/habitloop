import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { last30Days, computeConsistency } from '@/lib/habits'
import { format, subDays, getDay } from 'date-fns'
import InsightsClient from '@/components/dashboard/InsightsClient'
import BottomNav from '@/components/ui/BottomNav'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Insights' }

export default async function InsightsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  const sixMonthsAgo  = format(subDays(new Date(), 180), 'yyyy-MM-dd')

  const [habitsRes, logsRes, allLogsRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user.id).eq('active', true),
    supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', thirtyDaysAgo),
    supabase.from('habit_logs').select('date, status').eq('user_id', user.id).gte('date', sixMonthsAgo),
  ])

  const habits = habitsRes.data ?? []
  const logs   = logsRes.data ?? []
  const allLogs = allLogsRes.data ?? []

  const habitsWithStats = habits.map(habit => {
    const habitLogs = logs.filter(l => l.habit_id === habit.id)
    return { ...habit, consistency_30d: computeConsistency(habitLogs, habit.target_frequency) }
  })

  const days = last30Days()
  const chartData = days.map(date => {
    const dayLogs = logs.filter(l => l.date === date)
    const done = dayLogs.filter(l => l.status === 'done').length
    const total = habits.length
    return { date, label: format(new Date(date + 'T12:00:00'), 'MMM d'), done, total, rate: total > 0 ? Math.round((done / total) * 100) : 0 }
  })

  const dowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const dowStats = dowLabels.map((label, dow) => {
    const dowLogs = logs.filter(l => getDay(new Date(l.date + 'T12:00:00')) === dow)
    const done = dowLogs.filter(l => l.status === 'done').length
    return { label, rate: dowLogs.length > 0 ? Math.round((done / dowLogs.length) * 100) : 0, total: dowLogs.length }
  })

  return (
    <div className="min-h-screen max-w-lg mx-auto" style={{ background: 'var(--bg-primary)' }}>
      <InsightsClient
        habits={habitsWithStats}
        chartData={chartData}
        dowStats={dowStats}
        allLogs={allLogs}
        userEmail={user.email ?? ''}
      />
      <BottomNav />
    </div>
  )
}
