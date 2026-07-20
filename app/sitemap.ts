import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getTools, getGuides, getWorkflows } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.uiuxai.top";
  const tools = getTools();
  const guides = getGuides();
  const workflows = getWorkflows();

  const toolPages = routing.locales.flatMap((locale) =>
    tools.map((t) => ({
      url: `${baseUrl}/${locale}/tools/${t.id}`,
      lastModified: t.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  const guidePages = routing.locales.flatMap((locale) =>
    guides.map((g) => ({
      url: `${baseUrl}/${locale}/guides/${g.slug}`,
      lastModified: g.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const workflowPages = routing.locales.flatMap((locale) =>
    workflows.map((w) => ({
      url: `${baseUrl}/${locale}/workflows/${w.slug}`,
      lastModified: w.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  const staticPages = routing.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/tools`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]);

  return [...staticPages, ...toolPages, ...guidePages, ...workflowPages];
}
