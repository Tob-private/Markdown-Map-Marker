import { readFile } from "fs/promises";
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import mila from 'markdown-it-link-attributes';
import mark from 'markdown-it-mark';
import taskLists from 'markdown-it-task-lists';
import wikiLinks from 'markdown-it-wikilinks';
import container from 'markdown-it-container';
import sanitizeHtml from "sanitize-html";

// Custom preprocessing for Obsidian callouts
function preprocessCallouts(src: string): string {
  const lines = src.split('\n');
  const processed: string[] = [];
  let inCallout = false;
  let calloutType = '';

  for (let line of lines) {
    const match = /^>\s*\[!([A-Z]+)\](.*)/.exec(line);
    if (match) {
      if (inCallout) processed.push(':::');
      inCallout = true;
      calloutType = match[1].toLowerCase();
      const rest = match[2].trim();
      processed.push(`::: callout-${calloutType}`); // important: use dynamic container
      if (rest) processed.push(rest);
    } else if (inCallout && line.startsWith('>')) {
      processed.push(line.replace(/^>\s?/, ''));
    } else {
      if (inCallout) {
        processed.push(':::');
        inCallout = false;
      }
      processed.push(line);
    }
  }

  if (inCallout) processed.push(':::');
  return processed.join('\n');
}



export default async function Home() {
  const rawContent = await readFile("public/md-styling.md", "utf-8");
    const mdContent = preprocessCallouts(rawContent);

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(mark)
    .use(taskLists, { label: true })
    .use(wikiLinks, {
      uriSuffix: '',
      generatePageNameFromLabel: (label: string) => label.trim(),
      baseURL: '/notes/',
    })
   const calloutTypes = ['note', 'info', 'warning', 'tip'];

for (const type of calloutTypes) {
  
  md.use(container, `callout-${type}`, {
    render(tokens: Token[], idx: number) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // opening tag
        return `<div class="callout callout-${type}"><div class="callout-title">${type.toUpperCase()}</div>\n`;
      } else {
        // closing tag
        return '</div>\n';
      }
    },
  });
}


  const cleanHTML = sanitizeHtml(md.render(mdContent), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['input']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      input: ['type', 'checked'],
      div: ['class']
    }
  });
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHTML }}></div>
  );
}
