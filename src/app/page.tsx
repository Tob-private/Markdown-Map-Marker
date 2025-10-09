import { readFile } from "fs/promises";

import MdWrapper from "@/components/md-wrapper";

export default async function Home() {
  const rawContent = await readFile(
    "public/Markdown Map Marker/md-styling.md",
    "utf-8"
  );

  // supabaseSetup("public/Markdown Map Marker/");

  return (
    <>
      <main className="prose">
        <MdWrapper rawMd={rawContent} />
      </main>
    </>
  );
}
