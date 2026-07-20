import Fuse from "fuse.js";
import type { Tool } from "./types";

let fuse: Fuse<Tool> | null = null;
let lastTools: Tool[] = [];

export function createSearchIndex(tools: Tool[]) {
  if (fuse && lastTools === tools) return fuse;
  lastTools = tools;
  fuse = new Fuse(tools, {
    keys: ["name", "name_en", "tagline", "tagline_en", "description", "description_en", "category"],
    threshold: 0.4,
    includeScore: true,
  });
  return fuse;
}

export function searchTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return tools;
  const f = createSearchIndex(tools);
  return f.search(query).map((r) => r.item);
}
