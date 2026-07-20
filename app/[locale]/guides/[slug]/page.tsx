import { Metadata } from "next";
import { getGuide, getGuides } from "@/lib/data";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const guides = getGuides();
  return routing.locales.flatMap((locale) =>
    guides.map((g) => ({ locale, slug: g.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: locale === "zh" ? guide.title : guide.title_en || guide.title,
    description: locale === "zh" ? guide.excerpt : guide.excerpt_en || guide.excerpt,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return (
      <div className="container-site py-20 text-center text-gray-500 dark:text-gray-400">
        {locale === "zh" ? "指南未找到" : "Guide not found"}
      </div>
    );
  }

  const title = locale === "zh" ? guide.title : guide.title_en || guide.title;

  // Dynamic MDX import
  let Content: React.ComponentType | null = null;
  try {
    const mdxModule = await import(
      `@/content/guides/${locale}/${slug}.mdx`
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
          {locale === "zh" ? guide.excerpt : guide.excerpt_en || guide.excerpt}
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
