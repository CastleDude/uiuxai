import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getTool,
  getTools,
  getCategories,
  getAlternatives,
  getToolsByCategory,
} from "@/lib/data";
import { routing } from "@/i18n/routing";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ToolHeader from "@/components/tools/ToolHeader";
import ProsConsTable from "@/components/tools/ProsConsTable";
import PricingTable from "@/components/tools/PricingTable";
import AlternativeList from "@/components/tools/AlternativeList";
import ToolCard from "@/components/shared/ToolCard";

export function generateStaticParams() {
  const tools = getTools();
  return routing.locales.flatMap((locale) =>
    tools.map((t) => ({ locale, slug: t.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getTool(slug, locale);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.tagline,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("detail");
  const common = await getTranslations("common");
  const tool = getTool(slug, locale);

  if (!tool) {
    return (
      <div className="container-site py-20 text-center text-gray-500 dark:text-gray-400">
        {locale === "zh" ? "工具未找到" : "Tool not found"}
      </div>
    );
  }

  const cats = getCategories(locale);
  const cat = cats.find((c) => c.id === tool.category);
  const alternatives = getAlternatives(slug, locale);
  const related = getToolsByCategory(tool.category, locale)
    .filter((t) => t.id !== slug)
    .slice(0, 4);

  return (
    <div className="container-site py-8 max-w-4xl">
      <Breadcrumb
        items={[
          { label: common("breadcrumb_home"), href: `/${locale}` },
          { label: common("breadcrumb_tools"), href: `/${locale}/tools` },
          {
            label: cat?.name || tool.category,
            href: `/${locale}/tools/${tool.category}`,
          },
          { label: tool.name },
        ]}
      />

      <ToolHeader tool={tool} locale={locale} visitLabel={t("visit")} />

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("features")}
        </h2>
        <ul className="space-y-3">
          {tool.features.map((f, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-brand-500 mt-1 flex-shrink-0">✓</span>
              <div>
                <strong className="text-gray-900 dark:text-white">
                  {f.title}
                </strong>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {f.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("pros_cons")}
        </h2>
        <ProsConsTable
          pros={tool.pros}
          cons={tool.cons}
          prosLabel={t("pros")}
          consLabel={t("cons")}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {t("pricing")}
        </h2>
        <PricingTable
          pricing={tool.pricing}
          labels={{
            free: t("free"),
            paid: t("paid"),
            enterprise: t("enterprise"),
          }}
        />
      </section>

      {alternatives.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            {t("alternatives")}
          </h2>
          <AlternativeList tools={alternatives} locale={locale} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
            {t("related")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <ToolCard key={r.id} tool={r} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
