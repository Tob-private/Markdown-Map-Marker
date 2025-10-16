import { readFile } from 'fs/promises'
import { callouts } from '../data/callouts'
import { allowedExtentions } from '../data/fileExtensions'
import { flatten } from './helpers'
import { getMdFileByIdentifier } from '../leaflet/md-files'
import { getDirectoryTree } from './actions/directory'
import { DirectoryTreeInterface } from '../types/directory-tree'

export async function parseObsidianSyntax(mdContent: string) {
  const blocks = mdContent.split('\n\n')

  const promises = blocks.map((block) => checkBlockForSyntax(block))

  const resolvedBlocks = await Promise.all(promises)

  return resolvedBlocks.join('\n\n')
}

async function checkBlockForSyntax(block: string) {
  const lines = block.split('\n')
  if (lines.length === 1) {
    lines[0] = await handleNoteSyntax(lines[0])
    lines[0] = await getImgFromObsidianSyntax(lines[0])
  }

  // Check for multiline syntax. Since all other multilines are handled
  let blockquoteLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    lines[i] = await handleNoteSyntax(lines[i])
    lines[i] = await getImgFromObsidianSyntax(lines[i])
    if (lines[i].startsWith('> ')) {
      blockquoteLines.push(lines[i])
    }
  }
  if (blockquoteLines.length < 1) return lines.join('\n') // Cant just return block, since then imgs wont be parsed correctly

  blockquoteLines = await handleBlockquotes(blockquoteLines, lines)

  return blockquoteLines.join('')
}

async function handleNoteSyntax(line: string): Promise<string> {
  if (
    line.includes('![[') &&
    line.includes(']]') &&
    allowedExtentions.some((ext) => line.includes(ext))
  )
    return line

  if (line.includes('![[') && line.includes(']]')) {
    // Embeded note
    const [, rest] = line.split('![[')
    const [link] = rest.split(']]')
    const [note, linktext] = link.split(' | ')
    const mdFile = await getMdFileByIdentifier('filename', note + '.md')

    const rawMd = await readFile(mdFile.md_path, 'utf-8')

    const embededStyle = handleEmbededStyle(rawMd)

    return `>#### ${linktext ?? note}\n ${embededStyle}`
  } else if (line.includes('[[') && line.includes(']]')) {
    // Note link
    const [before, rest] = line.split('[[')
    const [link, after] = rest.split(']]')
    const [note, linkText] = link.split(' | ')

    const mdFile = await getMdFileByIdentifier('filename', note + '.md')

    return `${before}[${linkText}](/${mdFile.id})${after}`
  }
  return line
}

function handleEmbededStyle(md: string) {
  return md
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')
}

async function getImgFromObsidianSyntax(line: string) {
  if (
    !(
      line.includes('![[') &&
      line.includes(']]') &&
      allowedExtentions.some((ext) => line.includes(ext))
    )
  )
    return line

  const imgStart = line.indexOf('![[')
  const imgEnd = line.indexOf(']]') + 2

  const substringedLine = line.substring(imgStart, imgEnd)

  const obsidianMapDirectory = await getDirectoryTree(
    'public/Markdown Map Marker/assets/maps/',
    {
      attributes: ['extension']
    }
  )

  if (!obsidianMapDirectory.children) {
    throw new Error('Obsidian assets/maps/ directory is undefined')
  }

  const flattenedMapDirectory = flatten<DirectoryTreeInterface>(
    obsidianMapDirectory.children
  )

  const filteredMapDirectory = flattenedMapDirectory.filter(
    (child) =>
      child.extension &&
      allowedExtentions.includes(child.extension) &&
      !child.children
  )

  const mapFileNames = filteredMapDirectory.map((file) => file.name)

  const [beforeImg, afterImg] = line.split(substringedLine)

  const [, value1] = substringedLine.trim().split('![[')
  const [value2] = value1.split(']]')
  const [filename, alt] = value2.split(' | ')

  if (line.startsWith('>')) {
    return `${beforeImg}![[Image of ${filename}]]${afterImg}`
  }
  if (mapFileNames.includes(filename)) {
    const map = filteredMapDirectory.find((map) => map.name == filename)
    if (!map) {
      throw new Error('Map not found')
    }
    const mapPath = map.path.slice(7)

    return `<div data-map-src="${mapPath}"/>`
  } else {
    if (!substringedLine.includes('|')) {
      console.error('Image requires an alt text', substringedLine)
      throw new Error(
        'Image requires alt text. Insert one using this syntax: ![[image.png | alt text]]'
      )
    }

    return `${beforeImg}![${alt}]${encodeURI(`(Markdown Map Marker/assets/${filename})`)}${afterImg}`
  }
}

async function handleBlockquotes(
  blockquoteLines: string[],
  lines: string[]
): Promise<string[]> {
  const output = []
  let prevLine = ''

  for (let i = 0; i < blockquoteLines.length; i++) {
    const line = blockquoteLines[i]
    lines[i] = await handleNoteSyntax(lines[i])
    lines[i] = await getImgFromObsidianSyntax(lines[i])

    if (
      line.split('> ').length > prevLine.split('> ').length &&
      prevLine.length > 0
    ) {
      output.push('<blockquote>')
    } else if (
      line.split('> ').length < prevLine.split('> ').length &&
      prevLine.length > 0
    ) {
      output.push('</blockquote>\n')
    }
    if (i === 0 && !line.split('> ').join('').startsWith('[!')) {
      output.push('<blockquote>')
    }

    if (i === 0 && line.split('> ').join('').startsWith('[!')) {
      const { blockquote, title } = handleCalloutType(line)
      output.push(blockquote)
      output.push(title)
    } else if (line.startsWith('> ')) {
      output.push(`<p>${line.split('> ').join('')}</p>`)
    } else if (line.trim() !== '') {
      output.push(`<p>${line}</p>`)
    }
    prevLine = line
  }

  // For each opened blockquote, we need to close each one
  let endTagsNeeded = 0
  output.forEach((line) => {
    if (line.includes('<blockquote')) {
      endTagsNeeded++
    } else if (line.includes('</blockquote>')) {
      endTagsNeeded--
    }
  })

  for (let i = 0; i < endTagsNeeded; i++) {
    output.push('</blockquote>')
  }

  return output
}

function handleCalloutType(line: string): {
  blockquote: string
  title: string
} {
  const startInx = line.indexOf('[!') + 2
  const endInx = line.indexOf(']')
  const calloutType = line.slice(startInx, endInx)

  const calloutObj = callouts.find(
    (callout) =>
      callout.name === calloutType.toLowerCase() ||
      callout.aliases?.includes(calloutType.toLowerCase())
  )

  if (calloutObj === undefined) {
    console.error('Reading callout type:', calloutType)
    throw new Error('Callout type not recognized')
  }

  const blockquote = `<blockquote class='callout not-prose callout-${calloutObj.name}'>`
  const title = `<p class="callout-title"><i data-lucide="${calloutObj.icon}"></i> ${line.substring(endInx + 1)}</p>`

  return { blockquote, title }
}
