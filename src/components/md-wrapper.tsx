import MarkdownIt from "markdown-it";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import wikiLinks from "markdown-it-wikilinks";
import sanitizeHtml from "sanitize-html";
import { parseObsidianSyntax } from "@/lib/helpers/helpers";

export default async function MdWrapper({ rawMd }: { rawMd: string }) {
  const mdContent = await parseObsidianSyntax(rawMd);

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
      p: ["class"],
      blockquote: ["class"],
    },
  });
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>;
}
