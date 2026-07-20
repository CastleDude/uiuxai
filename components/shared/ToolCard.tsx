"use client";

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
      className="group block p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover card-hover"
    >
      <div className="flex items-start gap-4">
        {/* Logo with gradient ring */}
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-brand-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={tool.logo}
            alt={tool.name}
            className="relative w-12 h-12 rounded-2xl object-contain bg-gray-50 dark:bg-gray-800 p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/logos/placeholder.svg";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {tool.name}
            </h3>
            {tool.is_featured && (
              <TagBadge label={isZh ? "推荐" : "Featured"} variant="featured" />
            )}
            {tool.is_new && (
              <TagBadge label={isZh ? "新" : "New"} variant="new" />
            )}
          </div>

          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {tool.tagline}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {tool.tags
                .filter((t) => ["free", "paid", "free-trial", "open-source"].includes(t))
                .slice(0, 2)
                .map((tag) => {
                  const labels: Record<string, string> = {
                    free: isZh ? "免费" : "Free",
                    paid: isZh ? "付费" : "Paid",
                    "free-trial": isZh ? "试用" : "Trial",
                    "open-source": isZh ? "开源" : "OSS",
                  };
                  const v: Record<string, "free" | "paid" | "default"> = {
                    free: "free",
                    paid: "paid",
                    "free-trial": "default",
                    "open-source": "default",
                  };
                  return (
                    <TagBadge key={tag} label={labels[tag] || tag} variant={v[tag] || "default"} />
                  );
                })}
            </div>
            <Rating value={tool.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
}
