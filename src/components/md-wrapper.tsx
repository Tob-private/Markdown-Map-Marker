import MarkdownIt from "markdown-it";
import mark from "markdown-it-mark";
import taskLists from "markdown-it-task-lists";
import wikiLinks from "markdown-it-wikilinks";
import sanitizeHtml from "sanitize-html";
import { parseObsidianSyntax } from "@/lib/helpers/md-helpers";
import LeafletMap from "./leaflet/leaflet-map";
import { User } from "@supabase/supabase-js";
import UserProvider from "@/context-providers/user-provider";

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
      i: ["data-lucide"],
      div: ["class", "id", "data-map-src"],
      img: ["src", "id", "class", "alt"],
      p: ["class"],
      blockquote: ["class"],
    },
  });

  const mapImgs = cleanHTML
    .split("\n")
    .filter((line: string) =>
      line.includes(`<div data-map-src="Markdown Map Marker/assets/maps/`)
    );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
      <UserProvider>
        {mapImgs.length > 0 &&
          mapImgs.map(async (mapImg, idx) => (
            <LeafletMap imgElement={mapImg} key={idx} />
          ))}
      </UserProvider>
    </>
  );
}
