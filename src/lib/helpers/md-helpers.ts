import { readFile } from "fs/promises";
import { callouts } from "../data/callouts";
import { allowedExtentions } from "../data/fileExtensions";
import { getMdFileByIdentifier } from "../db/supabase";
import directoryTree, { DirectoryTree } from "directory-tree";
import { flatten } from "./helpers";
import { randomUUID } from "crypto";

type DirTree<TAny> = DirectoryTree<Record<string, TAny>>;

export async function parseObsidianSyntax(mdContent: string) {
  const blocks = mdContent.split("\n\n");

  const promises = blocks.map((block) => checkBlockForSyntax(block));

  const resolvedBlocks = await Promise.all(promises);

  return resolvedBlocks.join("\n\n");
}

async function checkBlockForSyntax(block: string) {
  const lines = block.split("\n");
  if (lines.length === 1) {
    lines[0] = await handleNoteSyntax(lines[0]);
    lines[0] = getImgFromObsidianSyntax(lines[0]);
  }

  // Check for multiline syntax. Since all other multilines are handled
  let multilines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    lines[i] = await handleNoteSyntax(lines[i]);
    lines[i] = getImgFromObsidianSyntax(lines[i]);
    if (lines[i].startsWith("> ")) {
      multilines.push(lines[i]);
    }
  }
  if (multilines.length < 1) return lines.join("\n"); // Cant just return block, since then imgs wont be parsed correctly

  const output = [];
  let isCallout = false;

  for (let i = 0; i < multilines.length; i++) {
    const line = multilines[i];
    lines[i] = await handleNoteSyntax(lines[i]);
    lines[i] = getImgFromObsidianSyntax(lines[i]);

    if (i === 0 && line.startsWith("> [!")) {
      const { blockquote, title } = handleCalloutType(line);
      isCallout = true;
      output.push(blockquote);
      output.push(title);
    } else if (line.startsWith("> ")) {
      output.push(`<p>${line.substring(2)}</p>`);
    } else if (line.trim() !== "") {
      output.push(`<p>${line}</p>`);
    }
  }

  if (isCallout) output.push("</blockquote>\n");
  else {
    output.unshift("<blockquote class='not-prose'>");
    output.push("</blockquote>\n");
  }

  multilines = output;

  return multilines.join("");
}

function getImgFromObsidianSyntax(line: string) {
  if (
    !(
      line.includes("![[") &&
      line.includes("]]") &&
      allowedExtentions.some((ext) => line.includes(ext))
    )
  )
    return line;

  const imgStart = line.indexOf("![[");
  const imgEnd = line.indexOf("]]") + 2;

  const substringedLine = line.substring(imgStart, imgEnd);

  const obsidianDirectory = directoryTree(
    "public/Markdown Map Marker/assets/maps/",
    {
      attributes: ["extension"],
    }
  );

  if (!obsidianDirectory.children) {
    throw new Error("Obsidian assets/maps/ directory is undefined");
  }

  const flattenedDirectory = flatten<DirTree<string>>(
    obsidianDirectory.children
  );

  const filteredDirectory = flattenedDirectory.filter(
    (child) =>
      child.extension &&
      allowedExtentions.includes(child.extension) &&
      !child.children
  );

  const mapFileNames = filteredDirectory.map((file) => file.name);

  const [beforeImg, afterImg] = line.split(substringedLine);

  const [, value1] = substringedLine.trim().split("![[");
  const [value2] = value1.split("]]");
  const [filename, alt] = value2.split(" | ");

  if (mapFileNames.includes(filename)) {
    const map = filteredDirectory.find((map) => map.name == filename);
    if (!map) {
      throw new Error("Map not found");
    }
    const mapPath = map.path.slice(7);

    return `<img src="${mapPath}" id="${randomUUID()}" class="map"/>`;
  } else {
    if (!substringedLine.includes("|")) {
      console.error("Image requires an alt text", substringedLine);
      throw new Error(
        "Image requires alt text. Insert one using this syntax: ![[image.png | alt text]]"
      );
    }

    return `${beforeImg}![${alt}]${encodeURI(`(Markdown Map Marker/assets/${filename})`)}${afterImg}`;
  }
}

function handleCalloutType(line: string): {
  blockquote: string;
  title: string;
} {
  const startInx = line.indexOf("[!") + 2;
  const endInx = line.indexOf("]");
  const calloutType = line.slice(startInx, endInx);

  const calloutObj = callouts.find(
    (callout) =>
      callout.name === calloutType.toLowerCase() ||
      callout.aliases?.includes(calloutType.toLowerCase())
  );

  if (calloutObj === undefined) {
    console.error("Reading callout type:", calloutType);
    throw new Error("Callout type not recognized");
  }

  const blockquote = `<blockquote class='callout not-prose callout-${calloutObj.name}'>`;
  const title = `<p class="callout-title">${line.substring(endInx + 1)}</p>`;

  return { blockquote, title };
}

async function handleNoteSyntax(line: string): Promise<string> {
  if (
    line.includes("![[") &&
    line.includes("]]") &&
    allowedExtentions.some((ext) => line.includes(ext))
  )
    return line;

  if (line.includes("![[") && line.includes("]]")) {
    // Embeded note
    const [before, rest] = line.split("![[");
    const [link, after] = rest.split("]]");
    const [note, linktext] = link.split(" | ");
    const mdFile = await getMdFileByIdentifier("filename", note + ".md");

    const rawMd = await readFile(mdFile.md_path, "utf-8");

    const embededStyle = handleEmbededStyle(rawMd);

    return `>#### ${linktext ?? note}\n ${embededStyle}`;
  } else if (line.includes("[[") && line.includes("]]")) {
    // Note link
    const [before, rest] = line.split("[[");
    const [link, after] = rest.split("]]");
    const [note, linkText] = link.split(" | ");

    const mdFile = await getMdFileByIdentifier("filename", note + ".md");

    return `${before}[${linkText}](/${mdFile.id})${after}`;
  }
  return line;
}

function handleEmbededStyle(md: string) {
  return md
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}
