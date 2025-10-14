import { readFile } from "fs/promises";

import MdWrapper from "@/components/md-wrapper";
import { supabase } from "@/lib/db/supabase";

export default async function Home() {
  const usrEmail = process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL ?? "empty";
  const usrPW = process.env.NEXT_PUBLIC_SUPABASE_USER_PW ?? "empty";

  const { error } = await supabase.auth.signInWithPassword({
    email: usrEmail,
    password: usrPW,
  });

  if (error) {
    console.error(error);
    throw new Error("Error loging in");
  }

  const rawContent = await readFile(
    "public/Markdown Map Marker/md-styling.md",
    "utf-8"
  );

  return (
    <main>
      <MdWrapper rawMd={rawContent} />
    </main>
  );
}
