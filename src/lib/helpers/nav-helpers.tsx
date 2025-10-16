import { getMdFileByIdentifier } from "../leaflet/md-files";

interface MenuItem {
  key: string | number;
  label: string;
  href?: string;
  children?: MenuItem[];
}

export async function createMenuItemsFromObsidianDirectory(
  directory: directoryTree.DirectoryTree<Record<string, never>>[]
): Promise<MenuItem[]> {
  const menuItems: MenuItem[] = [];

  for (const [index, item] of directory.entries()) {
    if (item.type === "file") {
      const mdFile = await getMdFileByIdentifier("md_path", item.path);
      const itemId = mdFile ? mdFile.id : "";

      menuItems.push({
        key: index,
        label: item.name.replace(/\.md$/, ""),
        href: "/" + itemId,
      });
    } else if (item.type === "directory" && item.children) {
      const children = await createMenuItemsFromObsidianDirectory(
        item.children
      );
      menuItems.push({
        key: index,
        label: item.name,
        children,
      });
    }
  }

  return menuItems;
}
