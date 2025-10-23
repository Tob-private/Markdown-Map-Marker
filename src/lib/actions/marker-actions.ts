'use server'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseFromCookies } from '../db/supabase/server'

export async function deleteMarker(id: string, path: string) {
  const supabase = await createServerSupabaseFromCookies()
  const { data, error } = await supabase
    .from('map_markers')
    .delete()
    .eq('id', id)
    .select()
  if (error) {
    console.error(error)
  } else if (data.length === 0) {
    console.log('Item to delete wasnt found')
  } else {
    console.dir({ data }, { depth: null })
    console.log('id ' + id + ' has been deleted')
    revalidatePath(path)
  }
}
