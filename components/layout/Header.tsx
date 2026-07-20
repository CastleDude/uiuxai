"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";

const NAV_KEYS = ["home", "tools", "guides", "workflows", "updates", "about"] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "zh";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container-site flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="text-xl font-bold text-brand-600 dark:text-brand-400">
          UX.AI.Tools
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_KEYS.map((k) => (
            <Link
              key={k}
              href={`/${locale}${k === "home" ? "" : `/${k}`}`}
              className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {t(k)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
