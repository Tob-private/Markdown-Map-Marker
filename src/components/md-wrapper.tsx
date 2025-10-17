import MarkdownIt from 'markdown-it'
import mark from 'markdown-it-mark'
import taskLists from 'markdown-it-task-lists'
import wikiLinks from 'markdown-it-wikilinks'
import sanitizeHtml from 'sanitize-html'
import { parseObsidianSyntax } from '@/lib/helpers/md-helpers'
import LeafletMap from './leaflet/leaflet-map'
import { getMarkersFromImgPath } from '@/lib/leaflet/leaflet'
import { getMdFilesLight } from '@/lib/leaflet/md-files'
import { MdFileLight } from '@/lib/types/supabase'

export default async function MdWrapper({ rawMd }: { rawMd: string }) {
  const mdContent = await parseObsidianSyntax(rawMd)

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })
    .use(mark)
    .use(taskLists, { label: true })
    .use(wikiLinks, {
      uriSuffix: '',
      generatePageNameFromLabel: (label: string) => label.trim(),
      baseURL: '/notes/'
    })

  const cleanHTML = sanitizeHtml(md.render(mdContent), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['input', 'img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      input: ['type', 'checked'],
      i: ['data-lucide'],
      div: ['class', 'id', 'data-map-src'],
      img: ['src', 'id', 'class', 'alt'],
      p: ['class'],
      blockquote: ['class']
    }
  })

  const mapImgs = cleanHTML
    .split('\n')
    .filter((line: string) =>
      line.includes(`<div data-map-src="Markdown Map Marker/assets/maps/`)
    )
  const mapMarkers = await Promise.all(
    mapImgs.map((mapImg) => {
      const [, srcRight] = mapImg.split(`src="`)
      const [src] = srcRight.split(`"`)
      const url = `/${src}`
      return getMarkersFromImgPath(url)
    })
  )

  const mdFiles = await getMdFilesLight()
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
      {mapImgs.length > 0 &&
        mapImgs.map(async (mapImg, idx) => (
          <LeafletMap
            imgElement={mapImg}
            mapMarkers={mapMarkers[0]}
            key={idx}
            mdFiles={mdFiles}
          />
        ))}
    </>
  )
}
