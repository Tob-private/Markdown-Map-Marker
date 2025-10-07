import { readFile } from "fs/promises";
import Markdown from "react-markdown";

export default async function Home() {
    const md = await readFile("public/md-styling.md", "utf-8");

  
  return (
    <Markdown>{md}</Markdown>
  );
}
