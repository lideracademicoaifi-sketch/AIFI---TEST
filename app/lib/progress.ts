import { supabase } from '@/lib/supabase'

export async function addXP(userId: string, currentXP: number, add: number) {
  const newXP = currentXP + add

  let level = 'A1'

  if (newXP >= 300) level = 'B1'
  else if (newXP >= 100) level = 'A2'

  const { data, error } = await supabase
    .from('profiles')
    .update({
      xp: newXP,
      level
    })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}
