import MdWrapper from "@/components/md-wrapper";
import { supabase } from "@/lib/db/supabase";
import { getMdFileById } from "@/lib/leaflet/md-files";
import { readFile } from "fs/promises";

interface PageParams {
  id: string;
}

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { error: asdasdasdasd } = await supabase.auth.signOut();

  if (asdasdasdasd) {
    console.error(asdasdasdasd);
  }

  const usrEmail = process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL ?? "empty";
  const usrPW = process.env.NEXT_PUBLIC_SUPABASE_USER_PW ?? "empty";

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usrEmail,
    password: usrPW,
  });

  if (error || !data || !data.session) {
    console.error(error);
    throw new Error("Login error");
  }
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
