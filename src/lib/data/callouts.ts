import { Callout } from "../types/callout";

export const callouts: Callout[] = [
  {
    name: "note",
  },
  {
    name: "abstract",
    aliases: ["summary", "tldr"],
  },
  {
    name: "info",
  },
  {
    name: "todo",
  },
  {
    name: "tip",
    aliases: ["hint", "important"],
  },
  {
    name: "success",
    aliases: ["check", "done"],
  },
  {
    name: "question",
    aliases: ["help", "faq"],
  },
  {
    name: "warning",
    aliases: ["caution", "attention"],
  },
  {
    name: "failure",
    aliases: ["fail", "missing"],
  },
  {
    name: "danger",
    aliases: ["error"],
  },
  {
    name: "bug",
  },
  {
    name: "example",
  },
  {
    name: "quote",
    aliases: ["cite"],
  },
];
