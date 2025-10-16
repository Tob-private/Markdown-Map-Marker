import MdWrapper from '@/components/md-wrapper'
import { supabase } from '@/lib/db/supabase'
import { getMdFileById } from '@/lib/leaflet/md-files'
import { readFile } from 'fs/promises'
import path from 'path'

interface PageParams {
  id: string
}

export default async function Page({
  params
}: {
  params: Promise<PageParams>
}) {
  const usrEmail = process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL ?? 'empty'
  const usrPW = process.env.NEXT_PUBLIC_SUPABASE_USER_PW ?? 'empty'

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usrEmail,
    password: usrPW
  })

  if (error || !data || !data.session) {
    console.error(error)
    throw new Error('Login error')
  }
  const { id } = await params

  const mdFile = await getMdFileById(id)

  if (!mdFile) return <div>Loading content...</div>

  const filePath = path.join(process.cwd(), mdFile.md_path)

  console.log('Reading markdown file at:', filePath)

  const rawContent = await readFile(filePath, 'utf-8')

  return (
    <main>
      <MdWrapper rawMd={rawContent} />
    </main>
  )
}
