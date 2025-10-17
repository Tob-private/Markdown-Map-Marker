import { createServerSupabaseFromCookies } from '../db/supabase/server'
import { MdFile, MdFileLight } from '../types/supabase'

export async function getMdFiles() {
  const supabase = await createServerSupabaseFromCookies()

  const { data, error } = await supabase.from('md_files').select()

  if (error && data === null) {
    console.error({ error })
  }

  return data
}
export async function getMdFilesLight(): Promise<MdFileLight[]> {
  const supabase = await createServerSupabaseFromCookies()

  const { data, error } = await supabase.from('md_files').select('id,filename')

  if (error && data === null) {
    console.error({ error })
  }

  return data as MdFileLight[]
}

export async function getMdFileById(id: string): Promise<MdFile> {
  const supabase = await createServerSupabaseFromCookies()

  const { data, error } = await supabase
    .from('md_files')
    .select()
    .eq('id', id)
    .maybeSingle()

  if (error && data === null) {
    console.error({ error })
  }

  return data
}

export async function getMdFileByIdentifier(
  identifier: string,
  value: string
): Promise<MdFile> {
  const supabase = await createServerSupabaseFromCookies()

  const { data, error } = await supabase
    .from('md_files')
    .select()
    .like(identifier, value)
    .maybeSingle()

  if (error && data === null) {
    console.error({ error })
  }

  return data
}
