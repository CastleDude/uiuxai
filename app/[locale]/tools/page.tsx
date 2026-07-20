import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getTools, getCategories } from "@/lib/data";
import ToolFilter from "@/components/tools/ToolFilter";
import ToolSearchWrapper from "@/components/tools/ToolSearchWrapper";

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    tag?: string;
    sort?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("tools");
  const categories = getCategories(locale);
  const tools = getTools({
    locale,
    category: sp.category,
    tags: sp.tag ? [sp.tag] : undefined,
    sort: sp.sort as "rating" | "newest" | "featured",
  });

  const filterDict: Record<string, string> = {
    all: t("all"),
    filter_category: t("filter_category"),
    filter_pricing: t("filter_pricing"),
    sort_by: t("sort_by"),
    sort_rating: t("sort_rating"),
    sort_newest: t("sort_newest"),
    sort_featured: t("sort_featured"),
    free: t("free"),
    paid: t("paid"),
    freemium: t("freemium"),
    open_source: t("open_source"),
    free_trial: t("free_trial"),
  };

  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {t("all")}
      </h1>

      <Suspense fallback={null}>
        <ToolFilter categories={categories} dict={filterDict} />
      </Suspense>

      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">
            {t("common.loading") || "Loading..."}
          </div>
        }
      >
        <ToolSearchWrapper tools={tools} locale={locale} />
      </Suspense>
    </div>
  );
}
