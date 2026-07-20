import Link from "next/link";
import type { Guide } from "@/lib/types";

export default function FeaturedGuides({
  guides,
  locale,
}: {
  guides: Guide[];
  locale: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((g) => (
        <Link
          key={g.slug}
          href={`/${locale}/guides/${g.slug}`}
          className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {locale === "zh" ? g.title : g.title_en || g.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {locale === "zh" ? g.excerpt : g.excerpt_en || g.excerpt}
          </p>
          <span className="inline-block mt-3 text-sm font-medium text-brand-600 dark:text-brand-400">
            {locale === "zh" ? "阅读更多 →" : "Read more →"}
          </span>
        </Link>
      ))}
    </div>
  );
}
