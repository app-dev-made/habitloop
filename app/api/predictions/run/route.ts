import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { computeSkipRisk } from '@/lib/prediction-engine'
import { today } from '@/lib/habits'
import { subDays, format } from 'date-fns'
import { rateLimit } from '@/lib/rate-limit'

export async function POST() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { success } = rateLimit(`predictions-run:${user.id}`, 5, 60_000)
  if (!success) return NextResponse.json({ skipped: true, reason: 'rate_limited' })

  const todayStr      = today()
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const { data: existing } = await supabase
    .from('predictions').select('id').eq('user_id', user.id).eq('date', todayStr).limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ skipped: true, reason: 'already_computed' })
  }

  const { data: habits } = await supabase
    .from('habits').select('id, target_frequency').eq('user_id', user.id).eq('active', true)

  if (!habits?.length) return NextResponse.json({ predictions: [] })

  const { data: logs } = await supabase
    .from('habit_logs').select('*').eq('user_id', user.id).gte('date', thirtyDaysAgo)

  const logsByHabit = new Map<string, any[]>()
  for (const log of (logs ?? [])) {
    if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, [])
    logsByHabit.get(log.habit_id)!.push(log)
  }

  const predictions = habits.map(habit => {
    const { skipRiskScore } = computeSkipRisk({
      logs: logsByHabit.get(habit.id) ?? [],
      targetDate: new Date(),
    })
    return {
      habit_id: habit.id, user_id: user.id, date: todayStr,
      skip_risk_score: skipRiskScore, nudge_sent: false, model_version: 'v1-logistic',
    }
  })

  await supabase.from('predictions').upsert(predictions, { onConflict: 'habit_id,date' })
  return NextResponse.json({ predictions, computed: true })
}
