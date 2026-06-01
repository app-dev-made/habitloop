import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { today, computeConsistency } from '@/lib/habits'
import type { Habit, HabitLog } from '@/types'
import TodayView from '@/components/dashboard/TodayView'
import DashboardNav from '@/components/dashboard/DashboardNav'
import BottomNav from '@/components/ui/BottomNav'
import WeeklySummary from '@/components/dashboard/WeeklySummary'
import type { Metadata } from 'next'
import { format, subDays } from 'date-fns'

export const metadata: Metadata = { title: 'Today' }

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const todayStr      = today()
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  const sevenDaysAgo  = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const [habitsRes, logsRes, predictionsRes, historicLogsRes, weekLogsRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: true }),
    supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('date', todayStr),
    supabase.from('predictions').select('*').eq('user_id', user.id).eq('date', todayStr),
    supabase.from('habit_logs').select('habit_id, date, status').eq('user_id', user.id).gte('date', thirtyDaysAgo),
    supabase.from('habit_logs').select('date, status').eq('user_id', user.id).gte('date', sevenDaysAgo),
  ])

  const habits: Habit[]  = habitsRes.data ?? []
  const logs: HabitLog[] = logsRes.data ?? []
  const predictions      = predictionsRes.data ?? []
  const historicLogs     = historicLogsRes.data ?? []
  const weekLogs         = weekLogsRes.data ?? []

  const habitsWithData = habits.map(habit => {
    const habitHistoricLogs = historicLogs.filter(l => l.habit_id === habit.id)
    return {
      ...habit,
      today_log:       logs.find(l => l.habit_id === habit.id) ?? null,
      skip_risk:       predictions.find(p => p.habit_id === habit.id)?.skip_risk_score ?? null,
      consistency_30d: computeConsistency(habitHistoricLogs as HabitLog[], habit.target_frequency),
    }
  })

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto" style={{ background: 'var(--bg-primary)' }}>
      <DashboardNav user={user} />

      {/* Weekly summary — show when there's data */}
      {habits.length > 0 && weekLogs.length > 0 && (
        <div className="px-4 pb-2">
          <WeeklySummary logs={weekLogs} habitCount={habits.length} />
        </div>
      )}

      <TodayView habits={habitsWithData} userId={user.id} />
      <BottomNav />
    </div>
  )
}
