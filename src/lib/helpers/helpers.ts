import { allowedExtentions } from "../data/fileExtensions";

export function checkObsidianSyntax(mdContent: string) {
  const blocks = mdContent.split("\n\n").map(checkBlockForMultiline);

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

function checkBlockForMultiline(block: string) {
  const lines = block.split("\n");
  if (lines.length === 1) return block;

  // Check for multiline syntax. Since all other multilines are handled
  const result: string[] = [];
  for (let line of lines) {
    line = getImgFromObsidianSyntax(line);
    if (line.startsWith("> ")) {
      result.push(line);
    }
  }
  if (result.length < 1) return block;

  for (let i = 0; i < result.length; i++) {
    result[i] = `<p>${result[i].substring(2, result[i].length)}</p>`;
  }
  result.unshift("<blockquote>");
  result.push("</blockquote>\n");

  return result.join("");
}
