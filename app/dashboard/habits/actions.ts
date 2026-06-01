'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { HabitCategory } from '@/types'

export async function updateHabit({
  habitId,
  name,
  category,
  targetFrequency,
}: {
  habitId: string
  name: string
  category: HabitCategory
  targetFrequency: number
}) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('habits')
    .update({ name, category, target_frequency: targetFrequency })
    .eq('id', habitId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
  return { error: null }
}

export async function archiveHabit(habitId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('habits').update({ active: false }).eq('id', habitId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
  return { error: null }
}

export async function restoreHabit(habitId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('habits').update({ active: true }).eq('id', habitId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
  return { error: null }
}
