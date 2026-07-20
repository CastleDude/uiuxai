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
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-gray-100/50 dark:border-gray-800/50">
      <div className="container-site flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            UX
          </span>
          <span className="hidden sm:inline gradient-text">UX.AI.Tools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_KEYS.map((k) => {
            const href = `/${locale}${k === "home" ? "" : `/${k}`}`;
            const isActive = pathname === href || (k !== "home" && pathname.startsWith(href));
            return (
              <Link
                key={k}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {t(k)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
