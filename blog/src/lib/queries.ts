// Public reads from the browser using the publishable client.
// Admin mutations go through server functions (admin.functions.ts).
import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type KeyMoment = { title: string; body: string };
export type QA = { q: string; a: string };

export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  secondary_image_url: string | null;
  gallery_images: string[];
  key_moments: KeyMoment[];
  questions: QA[];
  pull_quote: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  category_id: string | null;
  author_name: string | null;
  read_time_minutes: number;
  featured: boolean;
  published: boolean;
  layout_size: "hero_large" | "spotlight_single" | "two_col" | "standard";
  published_at: string;
  view_count: number;
  category?: { slug: string; name: string } | null;
};

export type Comment = {
  id: string;
  article_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  visible: boolean;
  nav_position: "primary" | "more";
};

export type AdSlot = {
  id: string;
  slot_key: string;
  label: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  custom_html: string | null;
  active: boolean;
};

export type HomepageBlock = {
  id: string;
  block_key: string;
  title: string;
  subtitle: string | null;
  block_type: string;
  category_slug: string | null;
  sort_order: number;
  enabled: boolean;
};

const ARTICLE_SELECT = "*,category:categories(slug,name)";

function normalizeArticle(row: any): Article {
  return {
    ...row,
    gallery_images: Array.isArray(row?.gallery_images) ? row.gallery_images : [],
    key_moments: Array.isArray(row?.key_moments) ? row.key_moments : [],
    questions: Array.isArray(row?.questions) ? row.questions : [],
  } as Article;
}
function normalizeArticles(rows: any[]): Article[] {
  return (rows ?? []).map(normalizeArticle);
}

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
});

export const featuredArticleQuery = queryOptions({
  queryKey: ["articles", "featured"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("articles")
      .select(ARTICLE_SELECT)
      .eq("published", true)
      .eq("featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeArticle(data) : null;
  },
});

export const latestArticlesQuery = (limit = 6) =>
  queryOptions({
    queryKey: ["articles", "latest", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return normalizeArticles(data ?? []);
    },
  });

export const articlesByCategoryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["articles", "by-category", slug],
    queryFn: async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!cat) return { category: null, articles: [] as Article[] };
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("category_id", cat.id)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return { category: cat as Category, articles: normalizeArticles(data ?? []) };
    },
  });

export const articleBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data ? normalizeArticle(data) : null;
    },
  });

export const relatedArticlesQuery = (categoryId: string | null, excludeId: string) =>
  queryOptions({
    queryKey: ["articles", "related", categoryId, excludeId],
    queryFn: async () => {
      if (!categoryId) return [] as Article[];
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("category_id", categoryId)
        .neq("id", excludeId)
        .limit(3);
      if (error) throw error;
      return normalizeArticles(data ?? []);
    },
  });

export const adsQuery = queryOptions({
  queryKey: ["ad_slots"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("ad_slots")
      .select("*")
      .eq("active", true);
    if (error) throw error;
    return (data ?? []) as AdSlot[];
  },
});

export const homepageBlocksQuery = queryOptions({
  queryKey: ["homepage_blocks"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("homepage_blocks")
      .select("*")
      .eq("enabled", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as HomepageBlock[];
  },
});

export const commentsQuery = (articleId: string) =>
  queryOptions({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .eq("approved", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Comment[];
    },
  });

export const latestByCategorySlugQuery = (slug: string, limit = 4) =>
  queryOptions({
    queryKey: ["articles", "by-category-slug", slug, limit],
    queryFn: async () => {
      const { data: cat } = await supabase
        .from("categories").select("id").eq("slug", slug).maybeSingle();
      if (!cat) return [] as Article[];
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .eq("category_id", cat.id)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return normalizeArticles(data ?? []);
    },
  });

export const mostDiscussedQuery = (categoryId: string | null, limit = 5) =>
  queryOptions({
    queryKey: ["articles", "most-discussed", categoryId, limit],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .order("view_count", { ascending: false })
        .limit(limit);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data, error } = await q;
      if (error) throw error;
      return normalizeArticles(data ?? []);
    },
  });

export const searchArticlesQuery = (term: string) =>
  queryOptions({
    queryKey: ["articles", "search", term],
    queryFn: async () => {
      const q = term.trim();
      if (!q) return [] as Article[];
      const { data, error } = await supabase
        .from("articles")
        .select(ARTICLE_SELECT)
        .eq("status", "published")
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,author_name.ilike.%${q}%`)
        .order("published_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return normalizeArticles(data ?? []);
    },
  });

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type Banner = {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
};

export const bannersQuery = queryOptions({
  queryKey: ["banners"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Banner[];
  },
});

export const siteSettingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw error;
    const settings: Record<string, string> = {};
    if (data) {
      data.forEach((r: any) => settings[r.key] = r.value || "");
    }
    return settings;
  },
});


