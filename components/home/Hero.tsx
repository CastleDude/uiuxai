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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-animated opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_transparent_20%,_rgba(0,0,0,0.3)_100%)]" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative container-site py-24 lg:py-36 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white/90 text-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {locale === "zh" ? "2026年7月 · 20款精选AI设计工具" : "July 2026 · 20 Curated AI Design Tools"}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight animate-slide-up">
          {heroTitle}
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          {heroSubtitle}
        </p>

        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="relative">
            <div className="absolute -inset-1 bg-white/20 rounded-xl blur" />
            <div className="relative">
              <SearchBox placeholder={searchPlaceholder} onSearch={handleSearch} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
