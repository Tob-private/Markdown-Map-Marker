import { createClient } from "@supabase/supabase-js";
import directoryTree from "directory-tree";
// require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase env var is undefined");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const testSupabase = async (path: string) => {
  const mdFiles = await supabase.from("md_files").select();

  //   if (mdFiles.data?.length === 0) {

  const obsidianDirectory = directoryTree(path, {
    extensions: /\.md$/,
    attributes: ["extension"],
  });

  if (!obsidianDirectory.children) {
    throw new Error("Obsidian directory is undefined");
  }

  const filteredDirectory = obsidianDirectory.children.filter(
    (child) => child.extension && child.extension == ".md"
  );

  filteredDirectory.forEach(async (obsidianFile) => {
    const md_file = {
      updated_at: new Date(),
      filename: obsidianFile.name,
      md_path: obsidianFile.path,
    };

    if (!mdFiles.data?.includes(obsidianFile.name)) {
      await supabase.from("md_files").insert(md_file);
    }
  });
};
