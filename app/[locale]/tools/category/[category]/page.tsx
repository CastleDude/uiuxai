import { getCategories, getToolsByCategory } from "@/lib/data";
import { routing } from "@/i18n/routing";
import ToolCard from "@/components/shared/ToolCard";

export function generateStaticParams() {
  const cats = getCategories();
  return routing.locales.flatMap((locale) =>
    cats.map((c) => ({ locale, category: c.id }))
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const cats = getCategories(locale);
  const cat = cats.find((c) => c.id === category);
  const tools = getToolsByCategory(category, locale);

  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        {cat?.icon} {cat?.name || category}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {cat?.description}
      </p>

      {tools.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
          {locale === "zh" ? "该分类暂无工具" : "No tools in this category yet"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
