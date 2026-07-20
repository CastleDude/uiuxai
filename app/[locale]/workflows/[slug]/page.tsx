import { Metadata } from "next";
import { getWorkflow, getWorkflows } from "@/lib/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const workflows = getWorkflows();
  return routing.locales.flatMap((locale) =>
    workflows.map((w) => ({ locale, slug: w.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const wf = getWorkflow(slug);
  if (!wf) return {};
  return {
    title: locale === "zh" ? wf.title : wf.title_en || wf.title,
    description: locale === "zh" ? wf.excerpt : wf.excerpt_en || wf.excerpt,
  };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const wf = getWorkflow(slug);

  if (!wf) {
    return (
      <div className="container-site py-20 text-center text-gray-500 dark:text-gray-400">
        {locale === "zh" ? "工作流未找到" : "Workflow not found"}
      </div>
    );
  }

  const title = locale === "zh" ? wf.title : wf.title_en || wf.title;

  let Content: React.ComponentType | null = null;
  try {
    const mdxModule = await import(
      `@/content/workflows/${locale}/${slug}.mdx`
    ).catch(() => null);
    if (mdxModule) Content = mdxModule.default;
  } catch {
    Content = null;
  }

  return (
    <div className="container-site py-8 max-w-4xl">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {locale === "zh" ? wf.excerpt : wf.excerpt_en || wf.excerpt}
          {" · "}
          {wf.steps} {locale === "zh" ? "个步骤" : "steps"}
        </p>
        {Content ? (
          <Content />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
            {locale === "zh" ? "内容即将上线" : "Content coming soon"}
          </p>
        )}
      </article>
    </div>
  );
}
