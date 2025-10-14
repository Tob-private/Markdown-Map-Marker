import { PostgrestSingleResponse } from "@supabase/supabase-js";
import directoryTree, { type DirectoryTree } from "directory-tree";
import { MdFile } from "../../types/supabase";
import { flatten } from "../../helpers/helpers";
import { supabase } from "../supabase";

type DirTree<TAny> = DirectoryTree<Record<string, TAny>>;

export const supabaseMdFilesSetup = async () => {
  const { data }: PostgrestSingleResponse<MdFile[]> = await supabase
    .from("md_files")
    .select();
  const mdFiles = data ?? [];
  const obsidianDirectory = directoryTree("public/Markdown Map Marker/", {
    extensions: /\.md$/,
    attributes: ["extension"],
  });

  if (!obsidianDirectory.children) {
    throw new Error("Obsidian directory is undefined");
  }

  const flattenedDirectory = flatten<DirTree<string>>(
    obsidianDirectory.children
  );

  const filteredDirectory = flattenedDirectory.filter(
    (child) => child.extension && child.extension === ".md" && !child.children
  );

  const localFileNames = filteredDirectory.map((file) => file.name);

  const missingFiles = mdFiles.filter(
    (dbFile) => !localFileNames.includes(dbFile.filename)
  );

  if (missingFiles.length > 0) {
    const { error: deleteError } = await supabase
      .from("md_files")
      .delete()
      .in(
        "id",
        missingFiles.map((f) => f.id)
      );

    if (deleteError) {
      console.error("Error while deleting old files:", deleteError);
    }
  }

  filteredDirectory.forEach(async (obsidianFile) => {
    const hasFileWithSameName = mdFiles.some(
      (el) => el.filename === obsidianFile.name
    );

    const fileNeedsUpdate: MdFile | undefined = mdFiles.find(
      (el) =>
        (el.filename === obsidianFile.name &&
          el.md_path !== obsidianFile.path) ||
        (el.filename !== obsidianFile.name && el.md_path === obsidianFile.path)
    );

    if (!hasFileWithSameName) {
      // Insert new file
      const md_file = {
        updated_at: new Date(),
        filename: obsidianFile.name,
        md_path: obsidianFile.path,
      };
      const { error } = await supabase.from("md_files").insert(md_file);
      if (error) {
        console.error(error);
        throw new Error("Error creating md file");
      }
    } else if (fileNeedsUpdate) {
      // Update existing file
      const md_file = {
        updated_at: new Date(),
        filename: obsidianFile.name,
        md_path: obsidianFile.path,
      };
      console.dir({ md_file });
      const { error } = await supabase
        .from("md_files")
        .update(md_file)
        .eq("id", fileNeedsUpdate.id);

      if (error) {
        console.error(error);
        throw new Error("Error creating md file");
      }
    }
  });
};
