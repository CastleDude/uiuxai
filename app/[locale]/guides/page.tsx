import Link from "next/link";
import { getGuides } from "@/lib/data";

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const guides = getGuides();

  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {locale === "zh" ? "对比指南" : "Comparison Guides"}
      </h1>
      {guides.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
          {locale === "zh" ? "暂无指南" : "No guides yet"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/${locale}/guides/${g.slug}`}
              className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {locale === "zh" ? g.title : g.title_en || g.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {locale === "zh" ? g.excerpt : g.excerpt_en || g.excerpt}
              </p>
              <span className="inline-block mt-3 text-brand-600 dark:text-brand-400 text-sm font-medium">
                {locale === "zh" ? "阅读更多 →" : "Read more →"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
