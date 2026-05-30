'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { today } from '@/lib/habits'
import type { LogStatus, HabitCategory } from '@/types'

// ─── Log a habit for today ─────────────────────────────────────────────────────

export async function logHabit({
  habitId,
  userId,
  status,
  skipReason,
  energyLevel,
}: {
  habitId: string
  userId: string
  status: LogStatus
  skipReason?: string
  energyLevel?: number
}) {
  const supabase = createServerSupabaseClient()
  const todayStr = today()

  // Upsert: insert or update today's log for this habit
  const { error } = await supabase
    .from('habit_logs')
    .upsert(
      {
        habit_id:     habitId,
        user_id:      userId,
        date:         todayStr,
        status,
        skip_reason:  skipReason ?? null,
        energy_level: energyLevel ?? null,
        logged_at:    new Date().toISOString(),
      },
      { onConflict: 'habit_id,date' }  // unique constraint in DB
    )

  if (error) {
    console.error('logHabit error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null }
}

// ─── Create a new habit ────────────────────────────────────────────────────────

export async function createHabit({
  userId,
  name,
  category,
  targetFrequency,
  targetTime,
  difficulty,
}: {
  userId: string
  name: string
  category: HabitCategory
  targetFrequency: number
  targetTime: string | null
  difficulty: 1 | 2 | 3 | 4 | 5
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id:          userId,
      name,
      category,
      target_frequency: targetFrequency,
      target_time:      targetTime,
      difficulty,
      active:           true,
    })
    .select()
    .single()

  if (error) {
    console.error('createHabit error:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  return { data, error: null }
}

// ─── Archive (soft-delete) a habit ────────────────────────────────────────────

export async function archiveHabit(habitId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('habits')
    .update({ active: false })
    .eq('id', habitId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { error: null }
}
