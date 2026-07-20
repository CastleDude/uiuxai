"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split("/")[1];
  const targetLocale = currentLocale === "zh" ? "en" : "zh";

  function switchLocale() {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    router.push(segments.join("/"));
  }

  return (
    <button
      onClick={switchLocale}
      className="px-2 py-1 text-xs font-medium rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {targetLocale === "zh" ? "中" : "EN"}
    </button>
  );
}
