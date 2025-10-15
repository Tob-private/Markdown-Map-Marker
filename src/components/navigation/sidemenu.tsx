import React from "react";
import directoryTree from "directory-tree";
import {
  createMenuItemsFromObsidianDirectory,
  renderMenuItems,
} from "@/lib/helpers/nav-helpers";

export default async function Sidemenu() {
  const obsidianDirectory = directoryTree("public/Markdown Map Marker/", {
    extensions: /\.md$/,
    attributes: ["extension", "type"],
  });

  if (!obsidianDirectory.children || obsidianDirectory.children.length < 1) {
    throw new Error("Obsidian directory doesn't have any children");
  }

  const filteredDirectory = obsidianDirectory.children.filter(
    (item) => !item.path.includes(".obsidian") && !item.path.includes("assets")
  );

  const menuItems =
    await createMenuItemsFromObsidianDirectory(filteredDirectory);

  return (
    <aside>
      <h1>Sss</h1>
    </aside>
  );
}
