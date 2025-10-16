import React from 'react'
import { createMenuItemsFromObsidianDirectory } from '@/lib/helpers/nav-helpers'
import { getDirectoryTree } from '@/lib/helpers/actions/directory'
import SidemenuClient from './sidemenu-client'

export default async function Sidemenu() {
  const obsidianDirectory = await getDirectoryTree(
    'public/Markdown Map Marker/',
    {
      extensions: /\.md$/,
      attributes: ['extension', 'type']
    }
  )

  if (!obsidianDirectory.children || obsidianDirectory.children.length < 1) {
    throw new Error("Obsidian directory doesn't have any children")
  }

  const filteredDirectory = obsidianDirectory.children.filter(
    (item) => !item.path.includes('.obsidian') && !item.path.includes('assets')
  )

  const menuItems =
    await createMenuItemsFromObsidianDirectory(filteredDirectory)

  return <SidemenuClient menuItems={menuItems} />
}
