import { getTranslations } from "next-intl/server";
import {
  getCategories,
  getFeaturedTools,
  getNewTools,
  getGuides,
} from "@/lib/data";
import Hero from "@/components/home/Hero";
import FeaturedTools from "@/components/home/FeaturedTools";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedGuides from "@/components/home/FeaturedGuides";

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const categories = getCategories(locale);
  const featured = getFeaturedTools(locale);
  const newTools = getNewTools(locale);
  const guides = getGuides().slice(0, 3);

  return (
    <div>
      <Hero
        locale={locale}
        heroTitle={t("hero_title")}
        heroSubtitle={t("hero_subtitle")}
        searchPlaceholder={t("hero_search")}
      />

      <section className="py-12 container-site">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {t("featured")}
        </h2>
        <FeaturedTools tools={featured} locale={locale} />
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-site">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t("categories")}
          </h2>
          <CategoryGrid categories={categories} locale={locale} />
        </div>
      </section>

      <section className="py-12 container-site">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {t("new_arrivals")}
        </h2>
        <NewArrivals tools={newTools} locale={locale} />
      </section>

      {guides.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {t("featured_guides")}
            </h2>
            <FeaturedGuides guides={guides} locale={locale} />
          </div>
        </section>
      )}
    </div>
  );
}
