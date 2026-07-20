export interface Feature {
  title: string;
  description: string;
}

export interface Pricing {
  free: string;
  paid: string;
  enterprise: string;
}

export interface Tool {
  id: string;
  name: string;
  name_en: string;
  logo: string;
  tagline: string;
  tagline_en: string;
  description: string;
  description_en: string;
  category: string;
  tags: string[];
  features: Feature[];
  features_en: Feature[];
  pros: string[];
  pros_en: string[];
  cons: string[];
  cons_en: string[];
  pricing: Pricing;
  pricing_en: Pricing;
  website_url: string;
  alternatives: string[];
  rating: number;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  description: string;
  description_en: string;
  sort_order: number;
}

export interface Guide {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  category: string;
  created_at: string;
}

export interface Workflow {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  steps: number;
  created_at: string;
}

export interface Update {
  id: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  type: "new_tool" | "tool_update" | "industry";
  tool_id?: string;
  created_at: string;
}
