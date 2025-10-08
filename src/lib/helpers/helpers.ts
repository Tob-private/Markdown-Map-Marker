import { callouts } from "../data/callouts";
import { allowedExtentions } from "../data/fileExtensions";

export function parseObsidianSyntax(mdContent: string) {
  const blocks = mdContent.split("\n\n").map(checkBlockForSyntax);

  return blocks.join("\n\n");
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
  const imgEnd = line.indexOf("]]");

  const substringedLine = line.substring(imgStart, imgEnd + 2);

  if (!substringedLine.includes("|")) return line;

  const [before, after] = line.split(substringedLine);

  const [, value1] = substringedLine.trim().split("![[");
  const [value2] = value1.split("]]");
  const [filename, alt] = value2.split(" | ");

  return `${before}![${alt}](${filename})${after}`;
}

function checkBlockForSyntax(block: string) {
  const lines = block.split("\n");
  if (lines.length === 1) return block;

  // Check for multiline syntax. Since all other multilines are handled
  let multilines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
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
