import MdWrapper from '@/components/md-wrapper'
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
