import MdWrapper from "@/components/md-wrapper";
import { getMdFileById } from "@/lib/db/supabase";
import { readFile } from "fs/promises";

interface PageParams {
  id: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;

  const mdFile = await getMdFileById(id);

  if (!mdFile) return <div>Loading content...</div>;

  const rawContent = await readFile(mdFile.md_path, "utf-8");

  return (
    <main>
      <MdWrapper rawMd={rawContent} />
    </main>
  );
}
