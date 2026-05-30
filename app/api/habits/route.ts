import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase.from('habits').select('*').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, category, target_frequency, target_time, difficulty } = body
  if (!name || !category) return NextResponse.json({ error: 'name and category are required' }, { status: 400 })

  const { data, error } = await supabase.from('habits').insert({ user_id: user.id, name, category, target_frequency: target_frequency ?? 7, target_time: target_time ?? null, difficulty: difficulty ?? 3, active: true }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
