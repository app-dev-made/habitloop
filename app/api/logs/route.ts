import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { today } from '@/lib/habits'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? today()

  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Rate limit: 120 log requests per minute per user
  const { success } = rateLimit(`logs:${user.id}`, 120, 60_000)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const body = await request.json()
  const { habit_id, status, skip_reason, energy_level } = body

  if (!habit_id || !status) {
    return NextResponse.json({ error: 'habit_id and status are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('habit_logs')
    .upsert({
      habit_id,
      user_id:      user.id,
      date:         today(),
      status,
      skip_reason:  skip_reason ?? null,
      energy_level: energy_level ?? null,
      logged_at:    new Date().toISOString(),
    }, { onConflict: 'habit_id,date' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
