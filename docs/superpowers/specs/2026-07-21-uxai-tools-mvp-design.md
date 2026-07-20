# UX.AI.Tools — MVP 设计方案

> 版本：v1.0
> 日期：2026-07-21
> 仓库：https://github.com/CastleDude/uiuxai.git

---

## 一、项目概述

### 1.1 定位

UI/UX 设计师的 AI 工具「决策引擎」——不做大而全的工具列表，而是按设计师真实工作流组织、提供深度对比和选购指南的垂直导航站。

### 1.2 核心原则

- **按工作流组织，不做技术类别堆砌**
- **决策导向，不简单罗列**——告诉用户「用不用」
- **AI 友好**——结构化内容，便于被 AI 搜索引擎引用
- **不做大而全，做精而深**——聚焦 UI/UX 垂直领域

### 1.3 目标用户

- UI/UX 设计师（初级到高级）
- 产品经理、创业者（快速原型验证）
- 设计团队负责人（工具选型决策）
- 设计专业学生

---

## 二、技术决策

### 2.1 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | 与 EasyToolHub 一致，SSR/SSG 原生支持 |
| 语言 | TypeScript | 类型安全 |
| UI | React 19 + Tailwind CSS 3.4 | 与 EasyToolHub 一致 |
| 国际化 | next-intl | 中文 + 英文，与 EasyToolHub 一致 |
| 内容 | MDX | 指南和工作流长文内容 |
| 数据 | JSON 文件 | 手写维护，MVP 无需数据库 |
| 搜索 | fuse.js | 客户端模糊搜索，20-25 个工具无需 Algolia |
| 部署 | PM2 + Nginx | 与 EasyToolHub 同服务器，宝塔面板管理 |

### 2.2 渲染策略（混合模式）

| 页面类型 | 策略 | 原因 |
|----------|------|------|
| 首页 `/` | SSR + ISR (revalidate: 3600) | 热门工具/最新收录会变化，1h 缓存 |
| 工具详情 `/tools/[slug]` | SSG | SEO 核心页面，静态 HTML 最优 |
| 分类页 `/tools/[category]` | SSG | 6 个分类固定，构建时全生成 |
| 工具列表 `/tools` | SSR | 筛选/排序/搜索参数动态变化 |
| 指南详情 `/guides/[slug]` | SSG + MDX | 内容稳定，编译为静态页 |
| 工作流详情 `/workflows/[slug]` | SSG + MDX | 同上 |
| 更新动态 `/updates` | SSR | 内容更新频繁 |
| 关于 `/about` | SSG | 纯静态页面 |

### 2.3 部署

- **服务器**：腾讯云 OpenCloudOS（与 EasyToolHub 共享）
- **面板**：宝塔面板
- **Web 服务器**：Nginx 反向代理 → Next.js
- **进程管理**：PM2
- **域名**：www.uiuxai.top，Let's Encrypt SSL 证书
- **部署流程**：`git pull → npm run build → PM2 restart`

---

## 三、项目结构

```
uiuxai/
├── app/
│   └── [locale]/                 # next-intl 语言前缀 (zh / en)
│       ├── layout.tsx            # 根布局（导航栏 + 页脚 + 主题切换 + 语言切换）
│       ├── page.tsx              # 首页 SSR + ISR
│       ├── tools/
│       │   ├── page.tsx          # 工具列表 SSR
│       │   ├── [category]/page.tsx   # 分类列表 SSG
│       │   └── [slug]/page.tsx       # 工具详情 SSG
│       ├── guides/
│       │   ├── page.tsx          # 指南列表 SSG
│       │   └── [slug]/page.tsx       # 指南详情 SSG + MDX
│       ├── workflows/
│       │   ├── page.tsx          # 工作流列表 SSG
│       │   └── [slug]/page.tsx       # 工作流详情 SSG + MDX
│       ├── updates/page.tsx      # 更新动态 SSR
│       └── about/page.tsx        # 关于 SSG
│
├── messages/
│   ├── zh.json                   # 中文 UI 文案
│   └── en.json                   # 英文 UI 文案
│
├── components/
│   ├── layout/                   # Header, Footer, Breadcrumb, ThemeToggle, LocaleSwitcher
│   ├── home/                     # Hero, FeaturedTools, CategoryGrid, NewArrivals
│   ├── tools/                    # ToolCard, ToolFilter, ToolHeader, ProsConsTable
│   ├── guides/                   # GuideCard, ComparisonTable
│   └── shared/                   # SearchBox, TagBadge, CTAButton, Rating
│
├── data/
│   ├── tools.json                # 工具数组（20-25个，含中英双语字段）
│   ├── categories.json           # 分类定义（6个，含中英双语字段）
│   ├── guides.json               # 指南元数据
│   ├── workflows.json            # 工作流元数据
│   └── updates.json              # 更新日志
│
├── content/
│   ├── guides/                   # MDX 对比指南（按语言分目录）
│   │   ├── zh/
│   │   └── en/
│   └── workflows/                # MDX 工作流文章
│       ├── zh/
│       └── en/
│
├── lib/
│   ├── data.ts                   # JSON 读取、筛选、排序（唯一数据入口，按 locale 返回）
│   ├── search.ts                 # fuse.js 搜索
│   └── types.ts                  # TypeScript 类型定义
│
├── i18n/
│   └── request.ts                # next-intl 配置
│
├── middleware.ts                  # 语言检测 + 重定向
├── public/logos/                 # 工具 Logo 图片
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 设计要点

- `lib/data.ts` 是唯一数据入口——所有页面通过它获取数据，换存储层只改此文件
- 组件按页面域划分（home/tools/guides），共享组件放 shared/
- `data/`（结构化 JSON）和 `content/`（MDX 长文）分离
- Logo 放 `public/logos/`，不依赖外部 CDN

---

## 四、数据模型

### 4.1 分类（categories.json）

```json
[
  {
    "id": "inspiration",
    "name": "灵感与调研",
    "icon": "🧠",
    "description": "竞品分析、用户反馈分析、趋势洞察",
    "sort_order": 1
  },
  {
    "id": "ui-design",
    "name": "视觉与UI设计",
    "icon": "🎨",
    "description": "AI辅助设计、界面生成",
    "sort_order": 2
  },
  {
    "id": "prototyping",
    "name": "原型与交互",
    "icon": "🧩",
    "description": "快速原型、高保真生成",
    "sort_order": 3
  },
  {
    "id": "code",
    "name": "设计稿转代码",
    "icon": "💻",
    "description": "代码生成、设计交付",
    "sort_order": 4
  },
  {
    "id": "review",
    "name": "设计走查与评审",
    "icon": "✅",
    "description": "可用性检测、设计规范检查",
    "sort_order": 5
  },
  {
    "id": "design-system",
    "name": "设计系统与规范",
    "icon": "📦",
    "description": "设计令牌、组件库管理",
    "sort_order": 6
  }
]
```

### 4.2 工具（tools.json）

```typescript
interface Tool {
  id: string;                    // URL slug，语言无关，如 "galileo-ai"
  name: string;                  // 工具名称（默认中文）
  name_en: string;               // 英文名称
  logo: string;                  // "/logos/xxx.png"
  tagline: string;               // 一句话描述（中文）
  tagline_en: string;            // 一句话描述（英文）
  description: string;           // 详细介绍（中文，300-500字）
  description_en: string;        // 详细介绍（英文）
  category: string;              // 对应 categories.id
  tags: string[];                // free-trial | free | paid | open-source | featured | new
  features: Feature[];           // 核心功能（中文）
  features_en: Feature[];        // 核心功能（英文）
  pros: string[];                // 优势（中文）
  pros_en: string[];             // 优势（英文）
  cons: string[];                // 劣势（中文）
  cons_en: string[];             // 劣势（英文）
  pricing: Pricing;              // {free, paid, enterprise}（价格数字通用，描述双语）
  pricing_en: Pricing;           // 英文价格描述
  website_url: string;           // 官网链接
  alternatives: string[];        // 替代工具 id 数组
  rating: number;                // 1-5
  is_featured: boolean;          // 是否推荐
  is_new: boolean;               // 是否新工具
  created_at: string;            // 收录日期
  updated_at: string;            // 更新日期
}

interface Feature {
  title: string;
  description: string;
}

interface Pricing {
  free: string;
  paid: string;
  enterprise: string;
}
```

**双语策略：** 数据文件用一个 JSON 同时存储中英字段（`_en` 后缀），`lib/data.ts` 按当前 locale 返回对应语言的字段。URL slug（工具 id、分类 id）保持语言无关，不做翻译路由。

### 4.3 设计决策记录

| 决策 | 理由 |
|------|------|
| features 用对象数组而非纯字符串 | 详情页需要标题+描述层级展示 |
| pricing 固定三档 | 方便跨工具对比，命中设计师核心关切 |
| alternatives 手写 id 关联 | MVP 不建数据库，手写关联最可控 |
| 不存 view_count | JSON 文件无法运行时写入 |
| 图片放 public/logos/ | Nginx 直接 serve，零依赖 |

---

## 五、路由与页面

### 5.1 路由表

| 路由 | 渲染策略 | 说明 |
|------|----------|------|
| `/` → redirect to `/zh` | middleware | 语言检测，默认中文 |
| `/[locale]` (zh/en) | SSR + ISR (1h) | 首页 |
| `/[locale]/tools` | SSR | 工具列表 |
| `/[locale]/tools/[category]` | SSG | 分类列表（zh×6 + en×6 = 12页） |
| `/[locale]/tools/[slug]` | SSG | 工具详情（zh×25 + en×25 = 50页） |
| `/[locale]/guides` | SSG | 指南列表 |
| `/[locale]/guides/[slug]` | SSG + MDX | 指南详情 |
| `/[locale]/workflows` | SSG | 工作流列表 |
| `/[locale]/workflows/[slug]` | SSG + MDX | 工作流详情 |
| `/[locale]/updates` | SSR | 更新动态 |
| `/[locale]/about` | SSG | 关于/提交入口 |

### 5.2 页面架构

**首页 `/`**
- Hero区：大标题 + 副标题 + 搜索框（居中，渐变背景）
- 热门推荐：6-8个 ToolCard，带 featured 角标
- 分类入口：6个分类，2行×3列网格，配图标+名称+工具数量
- 最新收录：5个列表项，带日期
- 精选指南：2-3个 GuideCard

**工具列表 `/tools`**
- 筛选栏：分类（一级）、费用模式（全部/免费/付费/免费增值/开源）
- 排序：按热度/按最新/按评分
- 视图切换：网格/列表
- 搜索框（客户端 fuse.js）
- 分页：每页 20 个

**工具详情 `/tools/[slug]`**
- 面包屑：首页 > 工具库 > [分类] > 工具名称
- 头部：Logo + 名称 + 标签 + CTA（访问官网）
- 一句话描述（粗体突出）
- 核心功能（3-5个，带图标）
- 适用场景
- 优劣势对比（表格）
- 价格方案（免费/付费/企业三档）
- 替代工具推荐（3-4个卡片）
- 评分展示
- 相关推荐（同分类下其他工具）

**对比指南 `/guides/[slug]`**
- 标题 + 适用对象 + 解决的问题
- 选择标准（3-5个维度）
- 精选推荐（3-5款）
- 横向对比表格
- 分场景建议
- FAQ

**工作流 `/workflows/[slug]`**
- 步骤式结构，每步配推荐工具
- 工具可直接链接到详情页

### 5.3 SEO/GEO 策略

- 每个工具详情页独立 TDK（Title-Description-Keywords）
- 自动生成 sitemap.xml
- 结构化数据标记（Schema.org SoftwareApplication / Article）
- 内容使用 FAQ、对比表格等 AI 友好格式
- MDX 内容经编译输出完整 HTML

---

## 六、MVP 范围

### 6.1 内容目标

| 内容类型 | MVP 目标 | 生产方式 |
|----------|----------|----------|
| 工具收录 | 20-25 个 | 手写 JSON |
| 分类页 | 6 个 | SSG 自动生成 |
| 对比指南 | 3 篇 | 手写 MDX |
| 工作流方案 | 2 篇 | 手写 MDX |
| 更新动态 | 按需 | 手写 JSON |

### 6.2 功能清单

| 功能 | 优先级 | 状态 |
|------|--------|------|
| 首页完整展示 | P0 | 本阶段 |
| 工具列表 + 筛选排序 | P0 | 本阶段 |
| 工具详情页 | P0 | 本阶段 |
| 搜索（客户端 fuse.js） | P0 | 本阶段 |
| 中英文国际化（next-intl） | P0 | 本阶段 |
| 对比指南页 | P0 | 本阶段 |
| 工作流页 | P1 | 本阶段 |
| 夜间模式 | P1 | 本阶段 |
| 响应式适配 | P0 | 本阶段 |
| sitemap.xml 生成 | P0 | 本阶段 |
| 管理后台 | - | 不做，手写 JSON |
| 数据库 | - | 不做，JSON 文件 |
| 用户认证 | - | 不做 |
| 评论/评分系统 | - | 不做 |

---

## 七、与 EasyToolHub 的关系

| 维度 | EasyToolHub | UX.AI.Tools |
|------|-------------|-------------|
| 仓库 | 独立 | 独立 (CastleDude/uiuxai) |
| 定位 | 通用工具导航 | UI/UX 设计师垂直决策引擎 |
| 技术栈 | Next.js 15 + Tailwind + JSON | 完全一致 |
| 服务器 | 腾讯云 OpenCloudOS | 共享 |
| 域名 | easytoolhub.top | www.uiuxai.top |
| 部署 | PM2 + Nginx | 共享服务器，独立 PM2 进程 + Nginx vhost |
| 管理后台 | 有 | 无（MVP 手写 JSON） |
| 国际化 | 8语言 (next-intl) | 2语言 zh + en (next-intl) |

---

## 八、非目标（明确不做）

- 管理后台 / CMS
- 用户系统、收藏、评论
- 数据库（Supabase 等）
- 中英文以外的语言
- 联盟营销链接追踪
- 自动化工具信息采集
- 邮件订阅
- PWA / Service Worker
