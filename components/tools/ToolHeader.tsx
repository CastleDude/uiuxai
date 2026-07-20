import type { Tool } from "@/lib/types";
import TagBadge from "@/components/shared/TagBadge";
import Rating from "@/components/shared/Rating";
import CTAButton from "@/components/shared/CTAButton";

export default function ToolHeader({
  tool,
  locale,
  visitLabel,
}: {
  tool: Tool;
  locale: string;
  visitLabel: string;
}) {
  const isZh = locale === "zh";

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <img
        src={tool.logo}
        alt={tool.name}
        className="w-20 h-20 rounded-2xl object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/logos/placeholder.svg";
        }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
          {tool.is_featured && (
            <TagBadge label={isZh ? "推荐" : "Featured"} variant="featured" />
          )}
          {tool.is_new && (
            <TagBadge label={isZh ? "新收录" : "New"} variant="new" />
          )}
        </div>

        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tool.tagline}
        </p>

        <div className="flex items-center gap-3 flex-wrap mb-3">
          {tool.tags.map((tag) => {
            const labels: Record<string, string> = {
              free: isZh ? "免费" : "Free",
              paid: isZh ? "付费" : "Paid",
              "free-trial": isZh ? "免费试用" : "Free Trial",
              "open-source": isZh ? "开源" : "Open Source",
            };
            return (
              <TagBadge
                key={tag}
                label={labels[tag] || tag}
                variant={
                  tag === "free" ? "free" : tag === "paid" ? "paid" : "default"
                }
              />
            );
          })}
          <Rating value={tool.rating} />
        </div>

        <CTAButton href={tool.website_url} label={visitLabel} />
      </div>
    </div>
  );
}
