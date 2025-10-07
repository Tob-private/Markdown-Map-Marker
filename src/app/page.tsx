import { readFile } from "fs/promises";
import MarkdownIt from "markdown-it";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import wikiLinks from "markdown-it-wikilinks";
import sanitizeHtml from "sanitize-html";
import { checkObsidianSyntax } from "@/lib/helpers/helpers";

export default async function Home() {
  const rawContent = await readFile("public/md-styling.md", "utf-8");
  const mdContent = checkObsidianSyntax(rawContent);

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(mark)
    .use(taskLists, { label: true })
    .use(wikiLinks, {
      uriSuffix: "",
      generatePageNameFromLabel: (label: string) => label.trim(),
      baseURL: "/notes/",
    });
  const cleanHTML = sanitizeHtml(md.render(mdContent), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["input", "img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      input: ["type", "checked"],
      div: ["class"],
      img: ["src", "alt", "title"],
    },
  });

  return (
    <>
      <main
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
        className="prose prose-stone"
      ></main>
    </>
  );
}
