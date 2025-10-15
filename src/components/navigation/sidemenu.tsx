import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import directoryTree from "directory-tree";
import Link from "next/link";
import { getMdFileByIdentifier } from "@/lib/leaflet/md-files";

type MenuItem = Required<MenuProps>["items"][number];

const createMenuItemsFromObsidianDirectory = async (
  directory: directoryTree.DirectoryTree<Record<string, any>>[]
): Promise<MenuItem[]> => {
  const menuItems = await Promise.all(
    directory.map(async (item, index) => {
      if (item.type === "file") {
        const mdFile = await getMdFileByIdentifier("md_path", item.path);

        return {
          key: mdFile.id,
          label: (
            <Link href={"/" + mdFile.id}>{item.name.replace(/\.md$/, "")}</Link>
          ),
        };
      } else if (item.type === "directory" && item.children) {
        const children = await createMenuItemsFromObsidianDirectory(
          item.children
        );

        return {
          key: item.name + index,
          label: item.name,
          children,
        };
      }
      return null;
    })
  );
  return menuItems.filter(Boolean) as MenuItem[];
};

export default async function Sidemenu() {
  const obsidianDirectory = directoryTree("public/Markdown Map Marker/", {
    extensions: /\.md$/,
    attributes: ["extension", "type"],
  });

  if (!obsidianDirectory.children || obsidianDirectory.children.length < 1) {
    throw new Error("Obsidian directory doesnt have any children");
  }

  const filteredDirectory = obsidianDirectory.children.filter(
    (item) => !item.path.includes(".obsidian") && !item.path.includes("assets")
  );

  const menuItems =
    await createMenuItemsFromObsidianDirectory(filteredDirectory);

  return <Menu mode="inline" items={menuItems} />;
}
