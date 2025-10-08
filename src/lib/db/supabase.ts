import { createClient } from "@supabase/supabase-js";
import directoryTree, { type DirectoryTree } from "directory-tree";

type DirTree = DirectoryTree<Record<string, any>>;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase env var is undefined");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const flatten = <T extends { children?: T[] }>(routes: T[]) => {
  return routes.reduce((acc, r) => {
    if (r.children && r.children.length) {
      acc = acc.concat(flatten(r.children));
    } else {
      acc.push(r);
    }
    return acc;
  }, [] as T[]);
};

export const testSupabase = async (path: string) => {
  const mdFiles = await supabase.from("md_files").select();

  const obsidianDirectory = directoryTree(path, {
    extensions: /\.md$/,
    attributes: ["extension"],
  });

  if (!obsidianDirectory.children) {
    throw new Error("Obsidian directory is undefined");
  }

  const flattenedDirectory = flatten<DirTree>(obsidianDirectory.children);

  const filteredDirectory = flattenedDirectory.filter(
    (child) => child.extension && child.extension === ".md" && !child.children
  );

  filteredDirectory.forEach(async (obsidianFile) => {
    const md_file = {
      updated_at: new Date(),
      filename: obsidianFile.name,
      md_path: obsidianFile.path,
    };

    const files = mdFiles.data ?? [];

    const hasFileWithSameName = files.some(
      (el) => el.filename === obsidianFile.name
    );

    const fileNeedsUpdate = files.find(
      (el) =>
        (el.filename === obsidianFile.name &&
          el.md_path !== obsidianFile.path) ||
        (el.filename !== obsidianFile.name && el.md_path === obsidianFile.path)
    );

    if (!hasFileWithSameName) {
      // Insert new file
      await supabase.from("md_files").insert(md_file);
    } else if (fileNeedsUpdate) {
      // Update existing file
      await supabase
        .from("md_files")
        .update(md_file)
        .eq("id", fileNeedsUpdate.id);
    }
  });
};
