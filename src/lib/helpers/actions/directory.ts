'use server'
import { DirectoryTreeInterface } from '@/lib/types/directory-tree'
import directoryTree from 'directory-tree'

export async function getDirectoryTree(
  path: string,
  options: directoryTree.DirectoryTreeOptions
): Promise<DirectoryTreeInterface> {
  return directoryTree(path, options) as DirectoryTreeInterface
}
