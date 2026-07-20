import Link from "next/link";
import { getWorkflows } from "@/lib/data";

export default async function WorkflowsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const workflows = getWorkflows();

  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {locale === "zh" ? "工作流" : "Workflows"}
      </h1>
      {workflows.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
          {locale === "zh" ? "暂无工作流方案" : "No workflows yet"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((w) => (
            <Link
              key={w.slug}
              href={`/${locale}/workflows/${w.slug}`}
              className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {locale === "zh" ? w.title : w.title_en || w.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {locale === "zh" ? w.excerpt : w.excerpt_en || w.excerpt}
              </p>
              <span className="inline-block mt-2 text-xs text-gray-400">
                {w.steps} {locale === "zh" ? "步" : "steps"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
