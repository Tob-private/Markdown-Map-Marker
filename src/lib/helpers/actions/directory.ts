"use server";
import directoryTree from "directory-tree";

export async function getDirectoryTree(
  path: string,
  options: directoryTree.DirectoryTreeOptions
) {
  return directoryTree(path, options);
}
