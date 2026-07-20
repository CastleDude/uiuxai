"use client";

import Link from "next/link";
import type { Tool } from "@/lib/types";

export default function NewArrivals({
  tools,
  locale,
}: {
  tools: Tool[];
  locale: string;
}) {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {tools.map((tool) => (
        <li key={tool.id}>
          <Link
            href={`/${locale}/tools/${tool.id}`}
            className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-900 px-3 -mx-3 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logos/placeholder.svg";
                }}
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {tool.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {tool.tagline}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400">{tool.created_at}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
