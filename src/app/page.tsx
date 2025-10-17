import { readFile } from 'fs/promises'

import MdWrapper from '@/components/md-wrapper'

export default async function Home() {
  const rawContent = await readFile(
    'public/Markdown Map Marker/md-styling.md',
    'utf-8'
  )

  return (
    <main>
      <MdWrapper rawMd={rawContent} />
    </main>
  )
}
