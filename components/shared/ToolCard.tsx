import Link from "next/link";
import type { Tool } from "@/lib/types";
import TagBadge from "./TagBadge";
import Rating from "./Rating";

export default function ToolCard({
  tool,
  locale,
}: {
  tool: Tool;
  locale: string;
}) {
  const isZh = locale === "zh";

  return (
    <Link
      href={`/${locale}/tools/${tool.id}`}
      className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
    >
      <div className="flex items-start gap-3">
        <img
          src={tool.logo}
          alt={tool.name}
          className="w-12 h-12 rounded-xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logos/placeholder.svg";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {tool.name}
            </h3>
            {tool.is_featured && (
              <TagBadge
                label={isZh ? "推荐" : "Featured"}
                variant="featured"
              />
            )}
            {tool.is_new && (
              <TagBadge label={isZh ? "新" : "New"} variant="new" />
            )}
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {tool.tagline}
          </p>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {tool.tags
              .filter((t) =>
                ["free", "paid", "free-trial", "open-source"].includes(t)
              )
              .map((tag) => {
                const labels: Record<string, string> = {
                  free: isZh ? "免费" : "Free",
                  paid: isZh ? "付费" : "Paid",
                  "free-trial": isZh ? "免费试用" : "Free Trial",
                  "open-source": isZh ? "开源" : "Open Source",
                };
                const v: Record<string, "free" | "paid" | "default"> = {
                  free: "free",
                  paid: "paid",
                  "free-trial": "default",
                  "open-source": "default",
                };
                return (
                  <TagBadge
                    key={tag}
                    label={labels[tag] || tag}
                    variant={v[tag] || "default"}
                  />
                );
              })}
          </div>

          <div className="mt-2">
            <Rating value={tool.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}
