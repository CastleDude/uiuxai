import { Tool, Category, Guide, Workflow, Update } from "./types";
import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";
import guidesData from "@/data/guides.json";
import workflowsData from "@/data/workflows.json";
import updatesData from "@/data/updates.json";

function pick<T extends Record<string, unknown>>(
  obj: T,
  locale: string,
  keys: string[]
): T {
  if (locale === "en") {
    const result = { ...obj };
    for (const k of keys) {
      const enKey = `${k}_en` as keyof T;
      if (enKey in obj) (result as Record<string, unknown>)[k] = obj[enKey];
    }
    return result;
  }
  return obj;
}

export function localizeTool(t: Tool, locale: string): Tool {
  return pick(t, locale, [
    "name",
    "tagline",
    "description",
    "features",
    "pros",
    "cons",
    "pricing",
  ]) as Tool;
}

export function localizeCategory(c: Category, locale: string): Category {
  return pick(c, locale, ["name", "description"]) as Category;
}

export function getCategories(locale: string = "zh"): Category[] {
  return (categoriesData as Category[])
    .map((c) => localizeCategory(c, locale))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getTools(opts?: {
  category?: string;
  tags?: string[];
  sort?: "rating" | "newest" | "featured";
  locale?: string;
}): Tool[] {
  const locale = opts?.locale || "zh";
  let tools: Tool[] = toolsData as Tool[];
  if (opts?.category) {
    tools = tools.filter((t) => t.category === opts.category);
  }
  if (opts?.tags?.length) {
    tools = tools.filter((t) =>
      opts.tags!.some((tag) => t.tags.includes(tag))
    );
  }
  if (opts?.sort === "rating") {
    tools.sort((a, b) => b.rating - a.rating);
  }
  if (opts?.sort === "newest") {
    tools.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  if (opts?.sort === "featured") {
    tools.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }
  return tools.map((t) => localizeTool(t, locale));
}

export function getTool(slug: string, locale: string = "zh"): Tool | undefined {
  const t = (toolsData as Tool[]).find((t) => t.id === slug);
  return t ? localizeTool(t, locale) : undefined;
}

export function getFeaturedTools(locale: string = "zh"): Tool[] {
  return (toolsData as Tool[])
    .filter((t) => t.is_featured)
    .map((t) => localizeTool(t, locale));
}

export function getNewTools(locale: string = "zh"): Tool[] {
  return (toolsData as Tool[])
    .filter((t) => t.is_new)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)
    .map((t) => localizeTool(t, locale));
}

export function getToolsByCategory(
  cat: string,
  locale: string = "zh"
): Tool[] {
  return (toolsData as Tool[])
    .filter((t) => t.category === cat)
    .map((t) => localizeTool(t, locale));
}

export function getAlternatives(
  toolId: string,
  locale: string = "zh"
): Tool[] {
  const tool = (toolsData as Tool[]).find((t) => t.id === toolId);
  if (!tool?.alternatives?.length) return [];
  return (toolsData as Tool[])
    .filter((t) => tool.alternatives.includes(t.id))
    .map((t) => localizeTool(t, locale));
}

export function getGuides(): Guide[] {
  return guidesData as Guide[];
}

export function getGuide(slug: string): Guide | undefined {
  return (guidesData as Guide[]).find((g) => g.slug === slug);
}

export function getWorkflows(): Workflow[] {
  return workflowsData as Workflow[];
}

export function getWorkflow(slug: string): Workflow | undefined {
  return (workflowsData as Workflow[]).find((w) => w.slug === slug);
}

export function getUpdates(): Update[] {
  return (updatesData as Update[]).sort(
    (a, b) => b.created_at.localeCompare(a.created_at)
  );
}
