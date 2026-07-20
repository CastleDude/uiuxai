import Link from "next/link";
import type { Category } from "@/lib/types";
import { getToolsByCategory } from "@/lib/data";

export default function CategoryGrid({
  categories,
  locale,
}: {
  categories: Category[];
  locale: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => {
        const count = getToolsByCategory(cat.id).length;
        return (
          <Link
            key={cat.id}
            href={`/${locale}/tools/${cat.id}`}
            className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
          >
            <span className="text-3xl">{cat.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {cat.description}
              </p>
              <span className="inline-block mt-2 text-xs text-brand-600 dark:text-brand-400 font-medium">
                {count} {locale === "zh" ? "个工具" : "tools"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
