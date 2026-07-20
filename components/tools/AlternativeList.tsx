import type { Tool } from "@/lib/types";
import ToolCard from "@/components/shared/ToolCard";

export default function AlternativeList({
  tools,
  locale,
}: {
  tools: Tool[];
  locale: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} locale={locale} />
      ))}
    </div>
  );
}
