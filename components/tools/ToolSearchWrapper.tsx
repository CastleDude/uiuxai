"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Tool } from "@/lib/types";
import { searchTools } from "@/lib/search";
import ToolCard from "@/components/shared/ToolCard";

export default function ToolSearchWrapper({
  tools,
  locale,
}: {
  tools: Tool[];
  locale: string;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    return query ? searchTools(tools, query) : tools;
  }, [tools, query]);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        {locale === "zh" ? "没有找到匹配的工具" : "No tools found"}
      </div>
    );
  }

  return (
    <div
      id="tool-results"
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {filtered.map((tool) => (
        <ToolCard key={tool.id} tool={tool} locale={locale} />
      ))}
    </div>
  );
}
