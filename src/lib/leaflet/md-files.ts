import { supabase } from "../db/supabase";
import { MdFile } from "../types/supabase";

export async function getMdFiles() {
  const { data, error } = await supabase.from("md_files").select();

  if (error) {
    console.dir({ error });
  }

  return data;
}

export async function getMdFileById(id: string): Promise<MdFile> {
  const { data, error } = await supabase
    .from("md_files")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.dir({ error });
  }

  return data;
}

export async function getMdFileByIdentifier(
  identifier: string,
  value: string
): Promise<MdFile> {
  const { data, error } = await supabase
    .from("md_files")
    .select()
    .like(identifier, value)
    .single();

  if (error) {
    console.error({ error });
  }

  return data;
}
