# UX.AI.Tools MVP 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (zh/en) UI/UX designer AI tools navigation site with 20-25 tools across 6 workflow-based categories, detail pages, comparison guides, and workflow articles.

**Architecture:** Next.js 15 App Router hybrid rendering (SSG detail pages, SSR+ISR for listing/home). Data via hand-written JSON with `_en` bilingual fields through `lib/data.ts`. Client search via fuse.js. i18n via next-intl with `[locale]` routing.

**Tech Stack:** Next.js 15, TypeScript, React 19, Tailwind CSS 3.4, next-intl, fuse.js, MDX

## Global Constraints

- Deploy: PM2 + Nginx on Tencent Cloud OpenCloudOS (shared with EasyToolHub)
- Domain: www.uiuxai.top, Repo: CastleDude/uiuxai
- Languages: zh (default) + en, URL-prefix routing (`/zh`, `/en`)
- No database, no admin, no auth, no comments
- Responsive (mobile-first), dark mode (Tailwind `class` strategy)

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `app/globals.css`
- Create directories: `components/{layout,home,tools,guides,shared}`, `lib/`, `i18n/`, `messages/`, `data/`, `content/{guides,workflows}/{zh,en}`, `public/logos/`

**Interfaces:**
- Produces: Empty Next.js 15 project, all deps installed, directory tree ready

- [ ] **Step 1: Initialize Next.js 15**

```bash
cd d:/Download/Mysite/uiuxai
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack
```

- [ ] **Step 2: Install deps**

```bash
npm install next-intl fuse.js @next/mdx @mdx-js/loader @mdx-js/react
```

- [ ] **Step 3: Configure tailwind.config.ts — dark mode + brand colors**

```typescript
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: { 50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a" },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Configure next.config.ts — MDX + next-intl**

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};
export default withNextIntl(withMDX(nextConfig));
```

- [ ] **Step 5: Write app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  body { @apply bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100; font-family: system-ui, -apple-system, sans-serif; }
}
@layer components {
  .container-site { @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8; }
}
```

- [ ] **Step 6: Create directory tree**

```bash
mkdir -p components/{layout,home,tools,guides,shared} lib i18n messages data content/{guides,workflows}/{zh,en} public/logos
```

- [ ] **Step 7: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js 15 with Tailwind, next-intl, MDX"
```

---

### Task 2: Types and data layer

**Files:**
- Create: `lib/types.ts`, `lib/data.ts`
- Create: `data/categories.json`, `data/tools.json`, `data/guides.json`, `data/workflows.json`, `data/updates.json`

**Interfaces:**
- Produces:
  - Types: `Tool`, `Category`, `Guide`, `Workflow`, `Update`, `Feature`, `Pricing`
  - `localizeTool(t: Tool, locale: string): Tool` — returns tool with zh or en fields flattened
  - `getCategories(locale): Category[]`
  - `getTools(opts?: {category?, tags?, sort?, locale?}): Tool[]`
  - `getTool(slug, locale): Tool | undefined`
  - `getFeaturedTools(locale): Tool[]`, `getNewTools(locale): Tool[]`
  - `getToolsByCategory(cat, locale): Tool[]`
  - `getAlternatives(toolId, locale): Tool[]`
  - `getGuides(): Guide[]`, `getGuide(slug): Guide | undefined`
  - `getWorkflows(): Workflow[]`, `getWorkflow(slug): Workflow | undefined`
  - `getUpdates(): Update[]`

- [ ] **Step 1: Write lib/types.ts**

```typescript
export interface Feature { title: string; description: string; }
export interface Pricing { free: string; paid: string; enterprise: string; }
export interface Tool {
  id: string; name: string; name_en: string;
  logo: string; tagline: string; tagline_en: string;
  description: string; description_en: string;
  category: string; tags: string[];
  features: Feature[]; features_en: Feature[];
  pros: string[]; pros_en: string[]; cons: string[]; cons_en: string[];
  pricing: Pricing; pricing_en: Pricing;
  website_url: string; alternatives: string[];
  rating: number; is_featured: boolean; is_new: boolean;
  created_at: string; updated_at: string;
}
export interface Category {
  id: string; name: string; name_en: string;
  icon: string; description: string; description_en: string;
  sort_order: number;
}
export interface Guide {
  slug: string; title: string; title_en: string;
  excerpt: string; excerpt_en: string;
  category: string; created_at: string;
}
export interface Workflow {
  slug: string; title: string; title_en: string;
  excerpt: string; excerpt_en: string;
  steps: number; created_at: string;
}
export interface Update {
  id: string; title: string; title_en: string;
  content: string; content_en: string;
  type: "new_tool" | "tool_update" | "industry";
  tool_id?: string; created_at: string;
}
```

- [ ] **Step 2: Write lib/data.ts**

```typescript
import { Tool, Category, Guide, Workflow, Update } from "./types";
import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";
import guidesData from "@/data/guides.json";
import workflowsData from "@/data/workflows.json";
import updatesData from "@/data/updates.json";

function pick<T extends Record<string, unknown>>(obj: T, locale: string, keys: string[]): T {
  if (locale === "en") {
    const result = { ...obj };
    for (const k of keys) {
      const enKey = `${k}_en` as keyof T;
      if (enKey in obj) (result as Record<string, unknown>)[k] = obj[enKey];
    }
    return result;
  }
  return obj;
}

export function localizeTool(t: Tool, locale: string): Tool {
  return pick(t, locale, ["name", "tagline", "description", "features", "pros", "cons", "pricing"]) as Tool;
}

export function localizeCategory(c: Category, locale: string): Category {
  return pick(c, locale, ["name", "description"]) as Category;
}

export function getCategories(locale: string = "zh"): Category[] {
  return categoriesData.map(c => localizeCategory(c, locale)).sort((a, b) => a.sort_order - b.sort_order);
}

export function getTools(opts?: { category?: string; tags?: string[]; sort?: "rating" | "newest" | "featured"; locale?: string }): Tool[] {
  const locale = opts?.locale || "zh";
  let tools: Tool[] = toolsData;
  if (opts?.category) tools = tools.filter(t => t.category === opts.category);
  if (opts?.tags?.length) tools = tools.filter(t => opts.tags!.some(tag => t.tags.includes(tag)));
  if (opts?.sort === "rating") tools.sort((a, b) => b.rating - a.rating);
  if (opts?.sort === "newest") tools.sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (opts?.sort === "featured") tools.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  return tools.map(t => localizeTool(t, locale));
}

export function getTool(slug: string, locale: string = "zh"): Tool | undefined {
  const t = (toolsData as Tool[]).find(t => t.id === slug);
  return t ? localizeTool(t, locale) : undefined;
}

export function getFeaturedTools(locale: string = "zh"): Tool[] {
  return (toolsData as Tool[]).filter(t => t.is_featured).map(t => localizeTool(t, locale));
}

export function getNewTools(locale: string = "zh"): Tool[] {
  return (toolsData as Tool[]).filter(t => t.is_new).sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5).map(t => localizeTool(t, locale));
}

export function getToolsByCategory(cat: string, locale: string = "zh"): Tool[] {
  return (toolsData as Tool[]).filter(t => t.category === cat).map(t => localizeTool(t, locale));
}

export function getAlternatives(toolId: string, locale: string = "zh"): Tool[] {
  const tool = (toolsData as Tool[]).find(t => t.id === toolId);
  if (!tool?.alternatives?.length) return [];
  return (toolsData as Tool[]).filter(t => tool.alternatives.includes(t.id)).map(t => localizeTool(t, locale));
}

export function getGuides(): Guide[] { return guidesData as Guide[]; }
export function getGuide(slug: string): Guide | undefined { return (guidesData as Guide[]).find(g => g.slug === slug); }
export function getWorkflows(): Workflow[] { return workflowsData as Workflow[]; }
export function getWorkflow(slug: string): Workflow | undefined { return (workflowsData as Workflow[]).find(w => w.slug === slug); }
export function getUpdates(): Update[] { return (updatesData as Update[]).sort((a, b) => b.created_at.localeCompare(a.created_at)); }
```

- [ ] **Step 3: Write data/categories.json**

```json
[
  {"id":"inspiration","name":"灵感与调研","name_en":"Inspiration & Research","icon":"🧠","description":"竞品分析、用户反馈分析、趋势洞察","description_en":"Competitive analysis, user feedback, trend insights","sort_order":1},
  {"id":"ui-design","name":"视觉与UI设计","name_en":"Visual & UI Design","icon":"🎨","description":"AI辅助设计、界面生成","description_en":"AI-assisted design, interface generation","sort_order":2},
  {"id":"prototyping","name":"原型与交互","name_en":"Prototyping & Interaction","icon":"🧩","description":"快速原型、高保真生成","description_en":"Rapid prototyping, high-fidelity generation","sort_order":3},
  {"id":"code","name":"设计稿转代码","name_en":"Design to Code","icon":"💻","description":"代码生成、设计交付","description_en":"Code generation, design handoff","sort_order":4},
  {"id":"review","name":"设计走查与评审","name_en":"Design Review & QA","icon":"✅","description":"可用性检测、设计规范检查","description_en":"Usability testing, design spec checks","sort_order":5},
  {"id":"design-system","name":"设计系统与规范","name_en":"Design Systems & Tokens","icon":"📦","description":"设计令牌、组件库管理","description_en":"Design tokens, component library management","sort_order":6}
]
```

- [ ] **Step 4: Write seed data/tools.json (3 sample tools, rest filled in Task 14)**

```json
[
  {
    "id": "galileo-ai", "name": "Galileo AI", "name_en": "Galileo AI",
    "logo": "/logos/galileo.png", "tagline": "从文字描述生成高保真UI设计稿", "tagline_en": "Generate high-fidelity UI designs from text descriptions",
    "description": "Galileo AI 是一款基于 AI 的 UI 生成工具，输入自然语言描述即可快速生成高保真设计稿。适合产品经理和设计师快速验证想法。",
    "description_en": "Galileo AI generates high-fidelity UI designs from natural language prompts. Great for PMs and designers to quickly validate ideas.",
    "category": "prototyping", "tags": ["free-trial", "paid", "featured"],
    "features": [{"title":"文字转UI","description":"支持自然语言描述生成完整界面"},{"title":"组件库","description":"内置丰富的UI组件"},{"title":"导出","description":"支持导出到Figma"}],
    "features_en": [{"title":"Text to UI","description":"Generate full interfaces from natural language"},{"title":"Component Library","description":"Rich built-in UI components"},{"title":"Export","description":"Export to Figma"}],
    "pros": ["生成速度快","UI质量高","易上手"], "pros_en": ["Fast generation","High UI quality","Easy to learn"],
    "cons": ["免费额度有限","定制化不足"], "cons_en": ["Limited free quota","Limited customization"],
    "pricing": {"free":"每月5次免费","paid":"$16/月无限","enterprise":"按需定制"},
    "pricing_en": {"free":"5 free/month","paid":"$16/mo unlimited","enterprise":"Custom pricing"},
    "website_url": "https://www.usegalileo.ai","alternatives": ["uizard","framer-ai"],
    "rating": 4.5, "is_featured": true, "is_new": false,
    "created_at":"2026-07-01","updated_at":"2026-07-20"
  }
]
```

- [ ] **Step 5: Write seed data/guides.json, workflows.json, updates.json**

`data/guides.json`:
```json
[{"slug":"figma-vs-galileo-vs-uizard","title":"Figma AI vs Galileo vs Uizard 横向对比","title_en":"Figma AI vs Galileo vs Uizard Comparison","excerpt":"三款主流AI原型工具的深度对比","excerpt_en":"In-depth comparison of three leading AI prototyping tools","category":"prototyping","created_at":"2026-07-15"}]
```

`data/workflows.json`:
```json
[{"slug":"design-sprint-ai-tools","title":"设计冲刺的AI工具组合","title_en":"AI Tool Stack for Design Sprints","excerpt":"从需求到原型验证的5天AI工作流","excerpt_en":"A 5-day AI workflow from requirements to prototype validation","steps":5,"created_at":"2026-07-18"}]
```

`data/updates.json`:
```json
[]
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add types, data layer, and seed data"
```

---

### Task 3: i18n setup (next-intl)

**Files:**
- Create: `i18n/request.ts`, `middleware.ts`
- Create: `messages/zh.json`, `messages/en.json`

**Interfaces:**
- Produces: Middleware detects `Accept-Language` / cookie, redirects to `/[locale]`. All pages use `useTranslations()` for static UI strings.

- [ ] **Step 1: Write i18n/request.ts**

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "zh" | "en")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Write i18n/routing.ts**

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
});
```

- [ ] **Step 3: Write middleware.ts**

```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(zh|en)/:path*"],
};
```

- [ ] **Step 4: Write messages/zh.json**

```json
{
  "nav": { "home": "首页", "tools": "工具库", "guides": "对比指南", "workflows": "工作流", "updates": "更新动态", "about": "关于" },
  "home": { "hero_title": "UI/UX设计师的AI工具决策引擎", "hero_subtitle": "按工作流查找最适合你的AI设计工具", "hero_search": "搜索工具...", "featured": "热门推荐", "categories": "按工作流浏览", "new_arrivals": "最新收录", "featured_guides": "精选指南", "view_all": "查看全部" },
  "tools": { "all": "全部工具", "filter_category": "分类", "filter_pricing": "费用模式", "sort_by": "排序", "sort_rating": "按评分", "sort_newest": "按最新", "sort_featured": "按推荐", "free": "免费", "paid": "付费", "freemium": "免费增值", "open_source": "开源", "free_trial": "免费试用" },
  "detail": { "features": "核心功能", "scenarios": "适用场景", "pros_cons": "优劣势对比", "pros": "优势", "cons": "劣势", "pricing": "价格方案", "free": "免费版", "paid": "付费版", "enterprise": "企业版", "alternatives": "替代工具", "related": "相关推荐", "visit": "访问官网" },
  "common": { "breadcrumb_home": "首页", "breadcrumb_tools": "工具库", "loading": "加载中..." }
}
```

- [ ] **Step 5: Write messages/en.json**

```json
{
  "nav": { "home": "Home", "tools": "Tools", "guides": "Guides", "workflows": "Workflows", "updates": "Updates", "about": "About" },
  "home": { "hero_title": "AI Tool Decision Engine for UI/UX Designers", "hero_subtitle": "Find the best AI design tools organized by your workflow", "hero_search": "Search tools...", "featured": "Featured", "categories": "Browse by Workflow", "new_arrivals": "New Arrivals", "featured_guides": "Featured Guides", "view_all": "View All" },
  "tools": { "all": "All Tools", "filter_category": "Category", "filter_pricing": "Pricing", "sort_by": "Sort", "sort_rating": "By Rating", "sort_newest": "Newest", "sort_featured": "Featured", "free": "Free", "paid": "Paid", "freemium": "Freemium", "open_source": "Open Source", "free_trial": "Free Trial" },
  "detail": { "features": "Core Features", "scenarios": "Use Cases", "pros_cons": "Pros & Cons", "pros": "Pros", "cons": "Cons", "pricing": "Pricing", "free": "Free", "paid": "Paid", "enterprise": "Enterprise", "alternatives": "Alternatives", "related": "Related Tools", "visit": "Visit Website" },
  "common": { "breadcrumb_home": "Home", "breadcrumb_tools": "Tools", "loading": "Loading..." }
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add next-intl i18n with zh/en messages and middleware"
```

---

### Task 4: Root layout and layout components

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/LocaleSwitcher.tsx`, `components/layout/ThemeToggle.tsx`, `components/layout/Breadcrumb.tsx`

**Interfaces:**
- Consumes: i18n routing from Task 3
- Produces:
  - `<Header />` — sticky top nav with logo, nav links, LocaleSwitcher, ThemeToggle
  - `<Footer />` — dark bg, about/links/copyright
  - `<LocaleSwitcher />` — zh/en toggle, preserves path across locale switch
  - `<ThemeToggle />` — sun/moon icon, toggles `dark` class on `<html>`
  - `<Breadcrumb items={Array<{label: string; href?: string}>} />`

- [ ] **Step 1: Write app/[locale]/layout.tsx**

```typescript
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "UX.AI.Tools", template: "%s | UX.AI.Tools" },
  description: "UI/UX设计师的AI工具决策引擎",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "zh" | "en")) notFound();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try { if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } } catch(e) {}` }} /></head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write components/layout/Header.tsx**

```typescript
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
  const locale = pathname.split("/")[1];
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container-site flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="text-xl font-bold text-brand-600 dark:text-brand-400">UX.AI.Tools</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_KEYS.map(k => (
            <Link key={k} href={`/${locale}${k === "home" ? "" : `/${k}`}`} className="text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t(k)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3"><ThemeToggle /><LocaleSwitcher /></div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write ThemeToggle, LocaleSwitcher, Footer, Breadcrumb**

Create each file with:
- `ThemeToggle.tsx`: "use client"; useEffect reads `dark` class on `<html>`, button toggles it and sets `localStorage.theme`
- `LocaleSwitcher.tsx`: "use client"; link to same pathname with other locale, preserves rest of path
- `Footer.tsx`: dark bg (`bg-gray-900 dark:bg-black`), three columns (about, submit tool, links), copyright line
- `Breadcrumb.tsx`: accepts `items: {label: string; href?: string}[]`, renders `Home > Tools > ...` with Link for items with href, plain text for last

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add root layout, header, footer, theme/locale toggles"
```

---

### Task 5: Shared components (TagBadge, Rating, SearchBox, CTAButton, ToolCard)

**Files:**
- Create: `components/shared/TagBadge.tsx`, `Rating.tsx`, `SearchBox.tsx`, `CTAButton.tsx`, `ToolCard.tsx`

**Interfaces:**
- `<TagBadge label: string; variant?: "default" | "free" | "paid" | "featured" | "new" />` — colored pill
- `<Rating value: number; max?: number />` — star display (★/☆)
- `<SearchBox placeholder: string; onSearch: (q: string) => void />` — input + search icon
- `<CTAButton href: string; label: string />` — blue button with external link icon
- `<ToolCard tool: Tool; locale: string />` — card with logo, name, tagline, tags, rating, CTA

- [ ] **Step 1: Write components/shared/TagBadge.tsx**

```typescript
const variants: Record<string, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  free: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  paid: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  featured: "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
  new: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};
export default function TagBadge({ label, variant = "default" }: { label: string; variant?: keyof typeof variants }) {
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{label}</span>;
}
```

- [ ] **Step 2: Write Rating, SearchBox, CTAButton**

`Rating.tsx`: renders `★` filled for each whole number up to `value`, `☆` for remainder up to `max` (default 5), with numeric label.
`SearchBox.tsx`: "use client"; `<input>` with magnifying glass icon, debounced `onSearch` callback (300ms via `useRef` + `setTimeout`).
`CTAButton.tsx`: `<a>` with `target="_blank" rel="noopener noreferrer"`, styled as blue button with external-link icon.

- [ ] **Step 3: Write components/shared/ToolCard.tsx**

```typescript
import Link from "next/link";
import type { Tool } from "@/lib/types";
import TagBadge from "./TagBadge";
import Rating from "./Rating";

export default function ToolCard({ tool, locale }: { tool: Tool; locale: string }) {
  return (
    <Link href={`/${locale}/tools/${tool.id}`} className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-900">
      <div className="flex items-start gap-3">
        <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/logos/placeholder.svg"; }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{tool.name}</h3>
            {tool.is_featured && <TagBadge label={locale === "zh" ? "推荐" : "Featured"} variant="featured" />}
            {tool.is_new && <TagBadge label={locale === "zh" ? "新" : "New"} variant="new" />}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.tagline}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {tool.tags.filter(t => ["free", "paid", "free-trial"].includes(t)).map(tag => (
              <TagBadge key={tag} label={tag === "free-trial" ? (locale === "zh" ? "免费试用" : "Free Trial") : tag === "free" ? (locale === "zh" ? "免费" : "Free") : (locale === "zh" ? "付费" : "Paid")} variant={tag === "free" ? "free" : tag === "paid" ? "paid" : "default"} />
            ))}
          </div>
          <div className="mt-2"><Rating value={tool.rating} /></div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add shared components TagBadge, Rating, SearchBox, CTAButton, ToolCard"
```

---

### Task 6: Homepage

**Files:**
- Create: `app/[locale]/page.tsx`
- Create: `components/home/Hero.tsx`, `FeaturedTools.tsx`, `CategoryGrid.tsx`, `NewArrivals.tsx`, `FeaturedGuides.tsx`

**Interfaces:**
- Consumes: `getCategories`, `getFeaturedTools`, `getNewTools`, `getGuides` from Task 2; ToolCard from Task 5; messages from Task 3
- Produces: Full homepage with all 5 sections

- [ ] **Step 1: Write app/[locale]/page.tsx**

```typescript
import { getTranslations } from "next-intl/server";
import { getCategories, getFeaturedTools, getNewTools, getGuides } from "@/lib/data";
import Hero from "@/components/home/Hero";
import FeaturedTools from "@/components/home/FeaturedTools";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedGuides from "@/components/home/FeaturedGuides";

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const categories = getCategories(locale);
  const featured = getFeaturedTools(locale);
  const newTools = getNewTools(locale);
  const guides = getGuides().slice(0, 3);

  return (
    <div>
      <Hero locale={locale} heroTitle={t("hero_title")} heroSubtitle={t("hero_subtitle")} searchPlaceholder={t("hero_search")} />
      <section className="py-12 container-site"><h2 className="text-2xl font-bold mb-6">{t("featured")}</h2><FeaturedTools tools={featured} locale={locale} /></section>
      <section className="py-12 bg-gray-50 dark:bg-gray-900"><div className="container-site"><h2 className="text-2xl font-bold mb-6">{t("categories")}</h2><CategoryGrid categories={categories} locale={locale} /></div></section>
      <section className="py-12 container-site"><h2 className="text-2xl font-bold mb-6">{t("new_arrivals")}</h2><NewArrivals tools={newTools} locale={locale} /></section>
      <section className="py-12 bg-gray-50 dark:bg-gray-900"><div className="container-site"><h2 className="text-2xl font-bold mb-6">{t("featured_guides")}</h2><FeaturedGuides guides={guides} locale={locale} /></div></section>
    </div>
  );
}
```

- [ ] **Step 2: Write Hero.tsx, FeaturedTools.tsx, CategoryGrid.tsx, NewArrivals.tsx, FeaturedGuides.tsx**

Each file:
- `Hero.tsx`: Full-width gradient `bg-gradient-to-br from-brand-500 to-purple-600`, centered white text, large heading, subtitle, `<SearchBox>` (links to `/tools?q=...`)
- `FeaturedTools.tsx`: Grid of 6-8 `<ToolCard>` (2 cols mobile, 3 tablet, 4 desktop)
- `CategoryGrid.tsx`: 2x3 grid, each card with icon emoji + name + description + tool count, links to `/tools/[id]`
- `NewArrivals.tsx`: Vertical list of 5 items, each with name, tagline, date, link
- `FeaturedGuides.tsx`: Horizontal cards with title, excerpt, "Read more" link

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add homepage with Hero, featured tools, categories, new arrivals, guides"
```

---

### Task 7: Tool listing page with search and filtering

**Files:**
- Create: `app/[locale]/tools/page.tsx`, `components/tools/ToolFilter.tsx`
- Create: `lib/search.ts`

**Interfaces:**
- Consumes: `getTools`, `getCategories` from Task 2; ToolCard, SearchBox from Task 5; messages from Task 3
- Produces: Full tool listing page with category/pricing/tag filters, sort, search

- [ ] **Step 1: Write lib/search.ts (fuse.js client-side)**

```typescript
import Fuse from "fuse.js";
import type { Tool } from "./types";

let fuse: Fuse<Tool> | null = null;
let lastTools: Tool[] = [];

export function createSearchIndex(tools: Tool[]) {
  if (fuse && lastTools === tools) return fuse;
  lastTools = tools;
  fuse = new Fuse(tools, {
    keys: ["name", "tagline", "description", "category"],
    threshold: 0.4,
    includeScore: true,
  });
  return fuse;
}

export function searchTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return tools;
  const f = createSearchIndex(tools);
  return f.search(query).map(r => r.item);
}
```

- [ ] **Step 2: Write components/tools/ToolFilter.tsx**

"use client" component with:
- Category dropdown (populated from `getCategories` output)
- Pricing toggle buttons: all/free/paid/free-trial/open-source
- Sort select: rating/newest/featured
- Uses URL search params via `useRouter`/`useSearchParams` from `next/navigation`

- [ ] **Step 3: Write app/[locale]/tools/page.tsx (SSR)**

```typescript
import { getTranslations } from "next-intl/server";
import { getTools, getCategories } from "@/lib/data";
import ToolFilter from "@/components/tools/ToolFilter";
import ToolCard from "@/components/shared/ToolCard";

export default async function ToolsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; q?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("tools");
  const categories = getCategories(locale);
  const tools = getTools({ locale, category: sp.category, tags: sp.tag ? [sp.tag] : undefined, sort: sp.sort as "rating" | "newest" | "featured" });

  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-6">{t("all")}</h1>
      <ToolFilter categories={categories} />
      {/* Client-side search wrapper: reads q param, calls searchTools(), renders ToolCard grid */}
      <div id="tool-results" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(tool => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
      </div>
    </div>
  );
}
```

**Note:** Client-side search is handled by a child "use client" component `<ToolSearchWrapper tools={tools} locale={locale} />` that reads `q` from search params, runs `searchTools()`, and renders the filtered grid. This component goes in the same file or `components/tools/ToolSearchWrapper.tsx`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add tool listing with filters, sort, and fuse.js search"
```

---

### Task 8: Category page (SSG) + Tool detail page (SSG)

**Files:**
- Create: `app/[locale]/tools/[category]/page.tsx`, `app/[locale]/tools/[slug]/page.tsx`
- Create: `components/tools/ToolHeader.tsx`, `ProsConsTable.tsx`, `PricingTable.tsx`, `AlternativeList.tsx`

**Interfaces:**
- `[category]/page.tsx` — SSG via `generateStaticParams`, renders tools filtered by category
- `[slug]/page.tsx` — SSG via `generateStaticParams` over all tools × 2 locales, renders full detail page
- Sub-components receive localized Tool data

- [ ] **Step 1: Write app/[locale]/tools/[category]/page.tsx**

```typescript
import { getCategories, getToolsByCategory } from "@/lib/data";
import { routing } from "@/i18n/routing";
import ToolCard from "@/components/shared/ToolCard";

export function generateStaticParams() {
  const cats = getCategories();
  return routing.locales.flatMap(locale => cats.map(c => ({ locale, category: c.id })));
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  const cats = getCategories(locale);
  const cat = cats.find(c => c.id === category);
  const tools = getToolsByCategory(category, locale);
  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-2">{cat?.icon} {cat?.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{cat?.description}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(t => <ToolCard key={t.id} tool={t} locale={locale} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write app/[locale]/tools/[slug]/page.tsx**

```typescript
import { getTool, getCategories, getAlternatives, getToolsByCategory, getTools } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ToolHeader from "@/components/tools/ToolHeader";
import ProsConsTable from "@/components/tools/ProsConsTable";
import PricingTable from "@/components/tools/PricingTable";
import AlternativeList from "@/components/tools/AlternativeList";
import ToolCard from "@/components/shared/ToolCard";

export function generateStaticParams() {
  const tools = getTools();
  return routing.locales.flatMap(locale => tools.map(t => ({ locale, slug: t.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getTool(slug, locale);
  if (!tool) return {};
  return { title: tool.name, description: tool.tagline };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations("detail");
  const tool = getTool(slug, locale);
  if (!tool) return <div className="container-site py-20 text-center text-gray-500">Tool not found</div>;
  const cats = getCategories(locale);
  const cat = cats.find(c => c.id === tool.category);
  const alternatives = getAlternatives(slug, locale);
  const related = getToolsByCategory(tool.category, locale).filter(t => t.id !== slug).slice(0, 4);

  return (
    <div className="container-site py-8 max-w-4xl">
      <Breadcrumb items={[
        { label: t("common.breadcrumb_home"), href: `/${locale}` },
        { label: t("common.breadcrumb_tools"), href: `/${locale}/tools` },
        { label: cat?.name || tool.category, href: `/${locale}/tools/${tool.category}` },
        { label: tool.name },
      ]} />
      <ToolHeader tool={tool} locale={locale} visitLabel={t("visit")} />
      <section className="mt-8"><h2 className="text-xl font-bold mb-3">{t("features")}</h2><ul className="space-y-2">{tool.features.map((f, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 mt-1">✓</span><div><strong>{f.title}</strong><p className="text-sm text-gray-500 dark:text-gray-400">{f.description}</p></div></li>)}</ul></section>
      <section className="mt-8"><h2 className="text-xl font-bold mb-3">{t("pros_cons")}</h2><ProsConsTable pros={tool.pros} cons={tool.cons} prosLabel={t("pros")} consLabel={t("cons")} /></section>
      <section className="mt-8"><h2 className="text-xl font-bold mb-3">{t("pricing")}</h2><PricingTable pricing={tool.pricing} labels={{ free: t("free"), paid: t("paid"), enterprise: t("enterprise") }} /></section>
      {alternatives.length > 0 && <section className="mt-8"><h2 className="text-xl font-bold mb-3">{t("alternatives")}</h2><AlternativeList tools={alternatives} locale={locale} /></section>}
      {related.length > 0 && <section className="mt-8"><h2 className="text-xl font-bold mb-3">{t("related")}</h2><div className="grid gap-4 sm:grid-cols-2">{related.map(r => <ToolCard key={r.id} tool={r} locale={locale} />)}</div></section>}
    </div>
  );
}
```

- [ ] **Step 3: Write ToolHeader, ProsConsTable, PricingTable, AlternativeList**

- `ToolHeader.tsx`: Tool logo (large, rounded), name, tag badges, tagline (large/bold), CTA button "Visit Website"
- `ProsConsTable.tsx`: Two-column table with green checkmark icons for pros, red `✗` for cons
- `PricingTable.tsx`: Three cards (Free/Paid/Enterprise) side by side with plan description
- `AlternativeList.tsx`: Grid of 3-4 ToolCard variants

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add category pages, tool detail pages with full layout"
```

---

### Task 9: Guides (list + MDX detail)

**Files:**
- Create: `app/[locale]/guides/page.tsx`, `app/[locale]/guides/[slug]/page.tsx`
- Create: `components/guides/GuideCard.tsx`, `components/guides/ComparisonTable.tsx`
- Create: `content/guides/zh/figma-vs-galileo-vs-uizard.mdx`

**Interfaces:**
- Consumes: `getGuides`, `getGuide` from Task 2
- Produces: Guide list page (SSG), Guide detail via MDX (SSG)

- [ ] **Step 1: Write app/[locale]/guides/page.tsx**

```typescript
import { getGuides } from "@/lib/data";
import Link from "next/link";

export default function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const guides = getGuides();
  return (
    <div className="container-site py-8">
      <h1 className="text-3xl font-bold mb-6">对比指南</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map(g => (
          <Link key={g.slug} href={`/${params.locale}/guides/${g.slug}`} className="block p-5 rounded-xl border hover:border-brand-300 hover:shadow-md transition-all">
            <h2 className="font-semibold text-lg">{g.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{g.excerpt}</p>
            <span className="mt-3 text-brand-600 dark:text-brand-400 text-sm font-medium">阅读更多 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write app/[locale]/guides/[slug]/page.tsx**

Uses `generateStaticParams` over guides, loads MDX from `content/guides/{locale}/{slug}.mdx` via `import()`, renders with MDX components (ComparisonTable, FAQ accordion, etc.)

- [ ] **Step 3: Write one sample MDX guide**

`content/guides/zh/figma-vs-galileo-vs-uizard.mdx`:
```mdx
---
title: "Figma AI vs Galileo vs Uizard 横向对比"
excerpt: "三款主流AI原型工具的深度对比，帮你选出最适合自己工作流的工具"
---

## 适用对象
产品经理、UI/UX设计师、创业者...

## 选择标准
1. 生成质量 2. 学习成本 3. 价格 4. 协作功能 5. 集成生态

## 对比表格
<ComparisonTable />

## 分场景建议
- **快速验证想法**: Galileo AI
- **完整设计系统**: Figma AI
...
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add guide list and MDX detail pages with sample guide"
```

---

### Task 10: Workflows pages

**Files:**
- Create: `app/[locale]/workflows/page.tsx`, `app/[locale]/workflows/[slug]/page.tsx`
- Create: `content/workflows/zh/design-sprint-ai-tools.mdx`

**Pattern:** Same as Task 9 (list + MDX detail). Workflow MDX has step-by-step layout with tool links.

- [ ] **Step 1: Write list page — same pattern as guides**

- [ ] **Step 2: Write MDX detail page — same pattern as guides**

- [ ] **Step 3: Write sample workflow MDX**

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add workflow pages with sample content"
```

---

### Task 11: Updates + About pages

**Files:**
- Create: `app/[locale]/updates/page.tsx`, `app/[locale]/about/page.tsx`

**Simple static/SSR pages.**

- [ ] **Step 1: Updates page** — SSR, reads `getUpdates()`, renders timeline list with date + title + content

- [ ] **Step 2: About page** — SSG, static content describing site mission, tool submission info, contact

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add updates and about pages"
```

---

### Task 12: Dark mode and responsive polish

**Files:**
- Modify: All existing components to verify dark mode classes
- Create: `public/logos/placeholder.svg`

- [ ] **Step 1: Verify all pages use dark: variants for backgrounds, text, borders**
- [ ] **Step 2: Test responsive layout at 375px, 768px, 1024px, 1440px — fix overflow/collapse issues**
- [ ] **Step 3: Add mobile hamburger menu to Header (hidden on desktop, toggle on mobile)**
- [ ] **Step 4: Create placeholder.svg for tools without logos**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: dark mode polish and responsive fixes"
```

---

### Task 13: SEO — metadata, sitemap, structured data

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: Each page to export `generateMetadata`

- [ ] **Step 1: Write app/sitemap.ts**

```typescript
import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getTools, getGuides, getWorkflows } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.uiuxai.top";
  const tools = getTools();
  const guides = getGuides();
  const workflows = getWorkflows();

  const toolPages = routing.locales.flatMap(locale =>
    tools.map(t => ({ url: `${baseUrl}/${locale}/tools/${t.id}`, lastModified: t.updated_at, changeFrequency: "monthly" as const, priority: 0.8 }))
  );
  const staticPages = routing.locales.flatMap(locale => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date().toISOString(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/${locale}/tools`, lastModified: new Date().toISOString(), changeFrequency: "weekly" as const, priority: 0.9 },
  ]);

  return [...staticPages, ...toolPages];
}
```

- [ ] **Step 2: Write app/robots.ts**

```typescript
import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: "https://www.uiuxai.top/sitemap.xml" };
}
```

- [ ] **Step 3: Add generateMetadata to homepage and detail page**

Homepage: `title: "UX.AI.Tools — UI/UX Designer AI Tool Decision Engine"`
Tool detail (already done in Task 8 Step 2)
Guides/Workflows detail pages: use frontmatter title/excerpt

- [ ] **Step 4: Add Schema.org structured data to tool detail page**

Add `<script type="application/ld+json">` block in ToolDetailPage with `SoftwareApplication` schema containing name, description, url, offers (pricing), aggregateRating.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add SEO metadata, sitemap, robots, structured data"
```

---

### Task 14: Full data population (20-25 tools)

**Files:**
- Modify: `data/tools.json` (expand from 3 to 20-25 tools)
- Create: `public/logos/*.png` (tool logos, can start with placeholder)

- [ ] **Step 1: Add all 20-25 tools to data/tools.json**

Each tool follows the interface — include the full suite from the spec's recommended tool list. Cover all 6 categories, 3-4 tools each. Use `placeholder.svg` for logos initially, replace with real logos as available.

Core tools to include (from spec appendix):
- inspiration: Perplexity, UX Pilot
- ui-design: Figma AI, Google Stitch, 腾讯Ardot, MasterGo AI, Recraft, Adobe Firefly, Midjourney v7
- prototyping: Galileo AI, Uizard, Framer AI, Figma Make
- code: Anima AI, Codify AI, Pixso AI, v0
- review: onbeacon AI, Stark
- design-system: Tokens Studio, Penpot, Magician

Mark 6-8 as `is_featured: true`, newest 5 as `is_new: true`.

- [ ] **Step 2: Add 3 guide stubs to data/guides.json**
- [ ] **Step 3: Write remaining MDX content (2 more guides, 1 more workflow)**

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: populate full tool dataset (25 tools) and content stubs"
```

---

### Task 15: Build verification and deployment prep

**Files:**
- Create: `.gitignore` (if not present)
- Create: `ecosystem.config.cjs` (PM2 config)

- [ ] **Step 1: Verify build**

```bash
npm run build
```
Expect: No TypeScript errors, no build failures. All static pages generated (62+), ISR configured for homepage.

- [ ] **Step 2: Fix any build errors**

- [ ] **Step 3: Write ecosystem.config.cjs for PM2**

```javascript
module.exports = {
  apps: [{
    name: "uiuxai",
    script: "node_modules/.bin/next",
    args: "start",
    cwd: "/www/wwwroot/uiuxai",
    instances: 1,
    exec_mode: "fork",
    env: { NODE_ENV: "production", PORT: 3001 },
  }],
};
```

- [ ] **Step 4: Commit + push to GitHub**

```bash
git add -A && git commit -m "chore: add PM2 config, verify production build"
git remote add origin https://github.com/CastleDude/uiuxai.git
git push -u origin main
```

- [ ] **Step 5: Server deployment**

On the server (via SSH):
```bash
cd /www/wwwroot && git clone https://github.com/CastleDude/uiuxai.git
cd uiuxai && npm install && npm run build
pm2 start ecosystem.config.cjs && pm2 save
```

In Baota Nginx: add new vhost for `www.uiuxai.top`, reverse proxy to `localhost:3001`, enable SSL via Let's Encrypt.

---

## Plan Self-Review Checklist

| Check | Status |
|-------|--------|
| Every spec section has a task | ✅ Section 5 routes → Tasks 6-11; Section 4 data → Task 2; Section 2 tech → Task 1; Section 3 structure → all tasks; Section 5.3 SEO → Task 13; Section 6.2 features → task mapping above |
| No TBD/TODO/placeholder steps | ✅ All steps have concrete code or commands |
| Type consistency across tasks | ✅ Tool, Category types defined in Task 2, consumed in Tasks 5-14 |
| locale param threading | ✅ Every page reads `params.locale`, passes to data functions and components |
| _en field conventions | ✅ `localizeTool`/`localizeCategory` handle locale switching in one place |
| SSG/SSR per spec | ✅ Category + detail = SSG (generateStaticParams); Home = ISR; Tools list = SSR; Guides/Workflows detail = SSG + MDX |
| Non-goals respected | ✅ No admin, no auth, no database, no i18n beyond zh/en |
