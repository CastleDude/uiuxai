"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@/lib/types";

const PRICING_OPTIONS = [
  { value: "", labelKey: "all" },
  { value: "free", labelKey: "free" },
  { value: "paid", labelKey: "paid" },
  { value: "free-trial", labelKey: "free_trial" },
  { value: "open-source", labelKey: "open_source" },
] as const;

export default function ToolFilter({
  categories,
  dict,
}: {
  categories: Category[];
  dict: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSort = searchParams.get("sort") || "";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        value={currentCategory}
        onChange={(e) => updateParam("category", e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label={dict.filter_category || "Category"}
      >
        <option value="">{dict.filter_category || "All Categories"}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icon} {c.name}
          </option>
        ))}
      </select>

      <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
        {PRICING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParam("tag", currentTag === opt.value ? "" : opt.value)}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              currentTag === opt.value
                ? "bg-brand-600 text-white"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {dict[opt.labelKey] || opt.labelKey}
          </button>
        ))}
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label={dict.sort_by || "Sort"}
      >
        <option value="">{dict.sort_by || "Sort"}</option>
        <option value="rating">{dict.sort_rating || "By Rating"}</option>
        <option value="newest">{dict.sort_newest || "Newest"}</option>
        <option value="featured">{dict.sort_featured || "Featured"}</option>
      </select>
    </div>
  );
}
