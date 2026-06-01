import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import HabitManagerClient from '@/components/habits/HabitManagerClient'
import BottomNav from '@/components/ui/BottomNav'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Habits' }

export default async function HabitsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-28" style={{ background: 'var(--bg-primary)' }}>
      <header className="pwa-header px-5 pt-6 pb-4">
        <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>Manage habits</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Edit, activate, or archive your habits</p>
      </header>
      <HabitManagerClient habits={habits ?? []} userId={user.id} />
      <BottomNav />
    </div>
  )
}
