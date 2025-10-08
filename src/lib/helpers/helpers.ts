import { allowedExtentions } from "../data/fileExtensions";

export function checkObsidianSyntax(mdContent: string) {
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
  //   console.log(substringedLine);

  if (!substringedLine.includes("|")) return line;

  const [before, after] = line.split(substringedLine);
  //   console.dir({ before, after });

  const [, value1] = substringedLine.trim().split("![[");
  const [value2] = value1.split("]]");
  const [filename, alt] = value2.split(" | ");
  //   console.dir({ alt, filename });

  return `${before}![${alt}](${filename})${after}`;
}

function checkBlockForSyntax(block: string) {
  const lines = block.split("\n");
  if (lines.length === 1) return block;

  // Check for multiline syntax. Since all other multilines are handled
  let multilines: string[] = [];
  for (let line of lines) {
    line = getImgFromObsidianSyntax(line);
    if (line.startsWith("> ")) {
      multilines.push(line);
    }
  }
  if (multilines.length < 1) return block;

  const output = [];
  let isCallout = false;

  for (let i = 0; i < multilines.length; i++) {
    const line = multilines[i];

    if (i === 0 && line.startsWith("> [!NOTE] ")) {
      isCallout = true;
      output.push("<blockquote class='callout not-prose'>");
      output.push(`<p class="callout-title">${line.substring(10)}</p>`);
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
