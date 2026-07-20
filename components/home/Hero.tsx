"use client";

import { useRouter } from "next/navigation";
import SearchBox from "@/components/shared/SearchBox";

export default function Hero({
  locale,
  heroTitle,
  heroSubtitle,
  searchPlaceholder,
}: {
  locale: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
}) {
  const router = useRouter();

  function handleSearch(q: string) {
    if (q.trim()) {
      router.push(`/${locale}/tools?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <section className="bg-gradient-to-br from-brand-500 to-purple-600 py-20 lg:py-28">
      <div className="container-site text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {heroTitle}
        </h1>
        <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBox placeholder={searchPlaceholder} onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
}
