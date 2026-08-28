import { supabase, isSupabaseConfigured } from "../../../lib/supabaseClient";
import type { BlogPost } from "./blogPosts";
import {
  getPublishedPost as localGetPost,
  getPublishedPosts as localGetPosts,
  listArticles as localListArticles,
  listCategories as localListCategories,
  saveArticle as localSaveArticle,
  deleteArticle as localDeleteArticle,
  saveCategory as localSaveCategory,
  deleteCategory as localDeleteCategory,
  type CmsArticle,
  type CmsCategory,
} from "./cmsStore";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  secondary_image_url: string | null;
  gallery_images: unknown;
  category_id: string | null;
  author_name: string | null;
  read_time_minutes: number;
  featured: boolean;
  published: boolean;
  layout_size: string;
  tags_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  scheduled_at: string | null;
  status: string;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  published_at: string;
  categories?: { id: string; slug: string; name: string } | null;
};

function galleryOf(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "url" in x) return String((x as { url?: string }).url || "");
    return "";
  }).filter(Boolean);
}

function tagsOf(row: ArticleRow): string[] {
  if (!row.tags_text) return [];
  return row.tags_text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function imageUrl(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v && "url" in v) return String((v as { url?: string }).url || "");
  return "";
}

function toCmsArticle(row: ArticleRow): CmsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || "",
    excerpt: row.excerpt || "",
    body: row.body || "",
    cover_image_url: row.cover_image_url || "",
    secondary_image_url: row.secondary_image_url || "",
    gallery_images: galleryOf(row.gallery_images),
    category_id: row.category_id,
    author_name: row.author_name || "Accrefin Team",
    read_time_minutes: row.read_time_minutes || 5,
    featured: !!row.featured,
    published: !!row.published,
    layout_size: (row.layout_size as CmsArticle["layout_size"]) || "standard",
    tags: tagsOf(row),
    seo_title: row.seo_title || "",
    seo_description: row.seo_description || "",
    scheduled_at: row.scheduled_at || "",
    status: row.status || (row.published ? "published" : "draft"),
    instagram_url: row.instagram_url || "",
    facebook_url: row.facebook_url || "",
    twitter_url: row.twitter_url || "",
    linkedin_url: row.linkedin_url || "",
    publishedAt: (row.published_at || "").slice(0, 10),
  };
}

function toBlogPost(row: ArticleRow): BlogPost {
  const cat = row.categories?.name || "General";
  const minutes = row.read_time_minutes || 5;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    category: cat,
    author: row.author_name || "Accrefin Team",
    publishedAt: (row.published_at || "").slice(0, 10),
    readTime: `${minutes} min read`,
    coverImage: row.cover_image_url || "",
    content: [],
    htmlBody: row.body || "",
    subtitle: row.subtitle || "",
    gallery: galleryOf(row.gallery_images),
    tags: tagsOf(row),
    facebook_url: row.facebook_url || "",
    twitter_url: row.twitter_url || "",
    linkedin_url: row.linkedin_url || "",
    instagram_url: row.instagram_url || "",
    readMinutes: minutes,
  };
}

const ARTICLE_SELECT =
  "id,slug,title,subtitle,excerpt,body,cover_image_url,secondary_image_url,gallery_images,category_id,author_name,read_time_minutes,featured,published,layout_size,tags_text,seo_title,seo_description,scheduled_at,status,instagram_url,facebook_url,twitter_url,linkedin_url,published_at,categories(id,slug,name)";

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return localGetPosts();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("published", true)
    .neq("status", "draft")
    .neq("status", "archived")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[blog] fetchPublishedPosts", error.message);
    return localGetPosts();
  }
  return (data as ArticleRow[] | null)?.map(toBlogPost) ?? [];
}

export async function fetchPublishedPost(slug: string): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured()) return localGetPost(slug);
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("[blog] fetchPublishedPost", error.message);
    return localGetPost(slug);
  }
  return data ? toBlogPost(data as ArticleRow) : undefined;
}

export async function fetchCategories(): Promise<CmsCategory[]> {
  if (!isSupabaseConfigured()) return localListCategories();
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,description,sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[blog] fetchCategories", error.message);
    return localListCategories();
  }
  return (data || []).map((c, i) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || "",
    sort_order: c.sort_order ?? i,
    visible: true,
    nav_position: i < 2 ? ("primary" as const) : ("more" as const),
  }));
}

export async function fetchAllArticlesAdmin(): Promise<(CmsArticle & { category?: CmsCategory })[]> {
  if (!isSupabaseConfigured()) {
    const cats = localListCategories();
    return localListArticles().map((a) => ({
      ...a,
      category: cats.find((c) => c.id === a.category_id),
    }));
  }
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as ArticleRow[]) || []).map((row) => {
    const article = toCmsArticle(row);
    return {
      ...article,
      category: row.categories
        ? {
            id: row.categories.id,
            slug: row.categories.slug,
            name: row.categories.name,
            description: "",
            sort_order: 0,
            visible: true,
            nav_position: "primary" as const,
          }
        : undefined,
    };
  });
}

export async function upsertArticleAdmin(
  data: Partial<CmsArticle> & { title: string; slug: string },
): Promise<void> {
  if (!isSupabaseConfigured()) {
    localSaveArticle(data);
    return;
  }

  const published =
    data.status === "published" ||
    (data.published === true && data.status !== "draft" && data.status !== "archived" && data.status !== "scheduled");
  const status = published ? "published" : (data.status ?? "draft");
  const payload = {
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? "",
    excerpt: data.excerpt ?? "",
    body: data.body ?? "",
    cover_image_url: imageUrl(data.cover_image_url),
    secondary_image_url: imageUrl(data.secondary_image_url),
    gallery_images: data.gallery_images ?? [],
    category_id: data.category_id || null,
    author_name: data.author_name || "Accrefin Team",
    read_time_minutes: data.read_time_minutes ?? 5,
    featured: !!data.featured,
    published,
    layout_size: data.layout_size ?? "standard",
    tags_text: (data.tags || []).join(", "),
    seo_title: data.seo_title ?? "",
    seo_description: data.seo_description ?? "",
    scheduled_at: data.scheduled_at || null,
    status,
    instagram_url: data.instagram_url ?? "",
    facebook_url: data.facebook_url ?? "",
    twitter_url: data.twitter_url ?? "",
    linkedin_url: data.linkedin_url ?? "",
    published_at: data.publishedAt
      ? new Date(data.publishedAt).toISOString()
      : new Date().toISOString(),
  };

  // Guard: never send multi‑MB data URLs into Postgres
  if (String(payload.cover_image_url).startsWith("data:") || String(payload.secondary_image_url).startsWith("data:")) {
    throw new Error(
      "Image is still a local data URL. Re-upload the image (must go to Supabase Storage), then click Publish.",
    );
  }

  if (data.id && !String(data.id).startsWith("seed-")) {
    const { error } = await supabase.from("articles").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("articles").insert(payload);
  if (error) throw new Error(error.message);
}

export async function removeArticleAdmin(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    localDeleteArticle(id);
    return;
  }
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertCategoryAdmin(
  data: Partial<CmsCategory> & { name: string; slug: string },
): Promise<void> {
  if (!isSupabaseConfigured()) {
    localSaveCategory(data);
    return;
  }
  const payload = {
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
    sort_order: data.sort_order ?? 0,
  };
  if (data.id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", data.id);
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await supabase.from("categories").insert(payload);
  if (error) throw new Error(error.message);
}

export async function removeCategoryAdmin(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    localDeleteCategory(id);
    return;
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Ensure Accerfin loan categories exist (idempotent). */
export async function ensureDefaultCategories(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const defaults = [
    { slug: "credit-tips", name: "Credit Tips", sort_order: 0 },
    { slug: "home-loans", name: "Home Loans", sort_order: 1 },
    { slug: "business", name: "Business", sort_order: 2 },
  ];
  for (const d of defaults) {
    await supabase.from("categories").upsert(d, { onConflict: "slug" });
  }
}
