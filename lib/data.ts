import { Tool, Category, Guide, Workflow, Update } from "./types";
import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";
import guidesData from "@/data/guides.json";
import workflowsData from "@/data/workflows.json";
import updatesData from "@/data/updates.json";


export function localizeTool(t: Tool, locale: string): Tool {
  if (locale === "en") {
    return {
      ...t,
      name: t.name_en || t.name,
      tagline: t.tagline_en || t.tagline,
      description: t.description_en || t.description,
      features: t.features_en?.length ? t.features_en : t.features,
      pros: t.pros_en?.length ? t.pros_en : t.pros,
      cons: t.cons_en?.length ? t.cons_en : t.cons,
      pricing: t.pricing_en?.free ? t.pricing_en : t.pricing,
    };
  }
  return t;
}

export function localizeCategory(c: Category, locale: string): Category {
  if (locale === "en") {
    return {
      ...c,
      name: c.name_en || c.name,
      description: c.description_en || c.description,
    };
  }
  return c;
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
