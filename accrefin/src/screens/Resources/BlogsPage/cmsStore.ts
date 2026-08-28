import { blogPosts } from "./blogPosts";

const KEY = "accrefin_editorial_cms";

export type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  secondary_image_url: string;
  gallery_images: string[];
  category_id: string | null;
  author_name: string;
  read_time_minutes: number;
  featured: boolean;
  published: boolean;
  layout_size: "hero_large" | "spotlight_single" | "two_col" | "standard";
  tags: string[];
  seo_title: string;
  seo_description: string;
  scheduled_at: string;
  status: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  publishedAt: string;
};

export type CmsCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  visible: boolean;
  nav_position: "primary" | "more";
};

export type CmsAd = {
  id: string;
  slot_key: string;
  label: string;
  title: string;
  body: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  custom_html: string;
  active: boolean;
};

export type CmsBlock = {
  id: string;
  block_key: string;
  title: string;
  subtitle: string;
  block_type: string;
  category_slug: string;
  sort_order: number;
  enabled: boolean;
};

export type CmsBanner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  sort_order: number;
};

export type CmsNewsletter = {
  id: string;
  scope: "global" | "category";
  category_id: string | null;
  headline: string;
  body: string;
  cta_label: string;
  enabled: boolean;
  scroll_trigger_pct: number;
};

export type CmsEditor = {
  user_id: string;
  email: string;
  password: string;
  roles: string[];
  can_edit_others: boolean;
};

type CmsState = {
  articles: CmsArticle[];
  categories: CmsCategory[];
  ads: CmsAd[];
  blocks: CmsBlock[];
  banners: CmsBanner[];
  settings: Record<string, string>;
  tags: { name: string; slug: string }[];
  newsletters: CmsNewsletter[];
  editors: CmsEditor[];
};

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultCategories(): CmsCategory[] {
  return [
    { id: "cat-credit", slug: "credit-tips", name: "Credit Tips", description: "", sort_order: 0, visible: true, nav_position: "primary" },
    { id: "cat-home", slug: "home-loans", name: "Home Loans", description: "", sort_order: 1, visible: true, nav_position: "primary" },
    { id: "cat-business", slug: "business", name: "Business", description: "", sort_order: 2, visible: true, nav_position: "more" },
  ];
}

function seedArticles(categories: CmsCategory[]): CmsArticle[] {
  return blogPosts.map((post) => {
    const cat = categories.find((c) => c.name === post.category);
    return {
      id: `seed-${post.slug}`,
      slug: post.slug,
      title: post.title,
      subtitle: "",
      excerpt: post.excerpt,
      body: post.content.map((p) => `<p>${p}</p>`).join(""),
      cover_image_url: post.coverImage,
      secondary_image_url: "",
      gallery_images: [],
      category_id: cat?.id ?? null,
      author_name: post.author,
      read_time_minutes: parseInt(post.readTime, 10) || 5,
      featured: false,
      published: true,
      layout_size: "standard",
      tags: [post.category.replace(/\s+/g, ""), "Finance", "Loans"],
      seo_title: "",
      seo_description: "",
      scheduled_at: "",
      status: "published",
      instagram_url: "",
      facebook_url: "",
      twitter_url: "",
      linkedin_url: "",
      publishedAt: post.publishedAt,
    };
  });
}

function emptyState(): CmsState {
  const categories = defaultCategories();
  return {
    articles: seedArticles(categories),
    categories,
    ads: [
      {
        id: "seed-sidebar",
        slot_key: "article_sidebar",
        label: "Article sidebar",
        title: "Smart loans, clearer decisions",
        body: "Compare offers and apply with Accrefin — built for Indian borrowers.",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1000&fit=crop",
        cta_text: "Learn more",
        cta_url: "/",
        custom_html: "",
        active: true,
      },
    ],
    blocks: [],
    banners: [],
    settings: { site_name: "Accrefin", theme_color: "#1d4ed8", logo_url: "" },
    tags: [],
    newsletters: [],
    editors: [
      {
        user_id: "admin-1",
        email: "chirag@qodet.com",
        password: "",
        roles: ["admin"],
        can_edit_others: true,
      },
    ],
  };
}

function read(): CmsState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = emptyState();
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

function write(state: CmsState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function imageUrl(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v && "url" in v) return String((v as { url?: string }).url || "");
  return "";
}

export function listArticles() {
  return read().articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function saveArticle(data: Partial<CmsArticle> & { title: string; slug: string }) {
  const state = read();
  const next: CmsArticle = {
    id: data.id || id(),
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle ?? "",
    excerpt: data.excerpt ?? "",
    body: data.body ?? "",
    cover_image_url: imageUrl(data.cover_image_url),
    secondary_image_url: imageUrl(data.secondary_image_url),
    gallery_images: data.gallery_images ?? [],
    category_id: data.category_id ?? null,
    author_name: data.author_name ?? "Accrefin Team",
    read_time_minutes: data.read_time_minutes ?? 5,
    featured: !!data.featured,
    published: data.published !== false && data.status !== "draft",
    layout_size: data.layout_size ?? "standard",
    tags: data.tags ?? [],
    seo_title: data.seo_title ?? "",
    seo_description: data.seo_description ?? "",
    scheduled_at: data.scheduled_at ?? "",
    status: data.status ?? "published",
    instagram_url: data.instagram_url ?? "",
    facebook_url: data.facebook_url ?? "",
    twitter_url: data.twitter_url ?? "",
    linkedin_url: data.linkedin_url ?? "",
    publishedAt: data.publishedAt || new Date().toISOString().slice(0, 10),
  };
  const idx = state.articles.findIndex((a) => a.id === next.id || a.slug === next.slug);
  if (idx >= 0) state.articles[idx] = { ...state.articles[idx], ...next, id: state.articles[idx].id };
  else state.articles.unshift(next);
  const extraTags = (next.tags || []).map((t) => t.replace(/^#/, "").trim().toLowerCase()).filter(Boolean);
  for (const tag of extraTags) {
    if (!state.tags.some((x) => x.slug === tag)) state.tags.push({ name: tag, slug: tag });
  }
  write(state);
}

export function deleteArticle(articleId: string) {
  const state = read();
  state.articles = state.articles.filter((a) => a.id !== articleId);
  write(state);
}

export function listCategories() {
  return [...read().categories].sort((a, b) => a.sort_order - b.sort_order);
}

export function saveCategory(data: Partial<CmsCategory> & { name: string; slug: string }) {
  const state = read();
  const next: CmsCategory = {
    id: data.id || id(),
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
    sort_order: data.sort_order ?? state.categories.length,
    visible: data.visible !== false,
    nav_position: data.nav_position ?? "more",
  };
  const idx = state.categories.findIndex((c) => c.id === next.id);
  if (idx >= 0) state.categories[idx] = next;
  else state.categories.push(next);
  write(state);
}

export function deleteCategory(categoryId: string) {
  const state = read();
  state.categories = state.categories.filter((c) => c.id !== categoryId);
  write(state);
}

export function listAds() {
  return read().ads;
}
export function saveAd(data: Partial<CmsAd> & { slot_key: string; label: string }) {
  const state = read();
  const next: CmsAd = {
    id: data.id || id(),
    slot_key: data.slot_key,
    label: data.label,
    title: data.title ?? "",
    body: data.body ?? "",
    image_url: imageUrl(data.image_url),
    cta_text: data.cta_text ?? "",
    cta_url: data.cta_url ?? "",
    custom_html: data.custom_html ?? "",
    active: data.active !== false,
  };
  const idx = state.ads.findIndex((a) => a.id === next.id);
  if (idx >= 0) state.ads[idx] = next;
  else state.ads.push(next);
  write(state);
}
export function deleteAd(adId: string) {
  const state = read();
  state.ads = state.ads.filter((a) => a.id !== adId);
  write(state);
}

export function listBlocks() {
  return [...read().blocks].sort((a, b) => a.sort_order - b.sort_order);
}
export function saveBlock(data: Partial<CmsBlock> & { block_key: string; title: string }) {
  const state = read();
  const next: CmsBlock = {
    id: data.id || id(),
    block_key: data.block_key,
    title: data.title,
    subtitle: data.subtitle ?? "",
    block_type: data.block_type ?? "list",
    category_slug: data.category_slug ?? "",
    sort_order: data.sort_order ?? state.blocks.length,
    enabled: data.enabled !== false,
  };
  const idx = state.blocks.findIndex((b) => b.id === next.id);
  if (idx >= 0) state.blocks[idx] = next;
  else state.blocks.push(next);
  write(state);
}
export function deleteBlock(blockId: string) {
  const state = read();
  state.blocks = state.blocks.filter((b) => b.id !== blockId);
  write(state);
}

export function listBanners() {
  return [...read().banners].sort((a, b) => a.sort_order - b.sort_order);
}
export function saveBanner(data: Partial<CmsBanner>) {
  const state = read();
  const next: CmsBanner = {
    id: data.id || id(),
    title: data.title ?? "",
    image_url: imageUrl(data.image_url),
    link_url: data.link_url ?? "",
    sort_order: data.sort_order ?? state.banners.length,
  };
  const idx = state.banners.findIndex((b) => b.id === next.id);
  if (idx >= 0) state.banners[idx] = next;
  else state.banners.push(next);
  write(state);
}
export function deleteBanner(bannerId: string) {
  const state = read();
  state.banners = state.banners.filter((b) => b.id !== bannerId);
  write(state);
}
export function reorderBanners(items: { id: string; sort_order: number }[]) {
  const state = read();
  for (const item of items) {
    const row = state.banners.find((b) => b.id === item.id);
    if (row) row.sort_order = item.sort_order;
  }
  write(state);
}

export function getSiteSettings() {
  return Object.entries(read().settings).map(([key, value]) => ({ key, value }));
}
export function saveSiteSettings(settings: { key: string; value: string }[]) {
  const state = read();
  for (const row of settings) state.settings[row.key] = row.value;
  write(state);
}

export function listTags() {
  return read().tags;
}

export function listNewsletters() {
  const state = read();
  return state.newsletters.map((n) => ({
    ...n,
    category: state.categories.find((c) => c.id === n.category_id) ?? null,
  }));
}
export function saveNewsletter(data: Partial<CmsNewsletter> & { headline: string }) {
  const state = read();
  const next: CmsNewsletter = {
    id: data.id || id(),
    scope: data.scope ?? "global",
    category_id: data.category_id ?? null,
    headline: data.headline,
    body: data.body ?? "",
    cta_label: data.cta_label ?? "Subscribe",
    enabled: data.enabled !== false,
    scroll_trigger_pct: data.scroll_trigger_pct ?? 60,
  };
  const idx = state.newsletters.findIndex((n) => n.id === next.id);
  if (idx >= 0) state.newsletters[idx] = next;
  else state.newsletters.push(next);
  write(state);
}
export function deleteNewsletter(newsletterId: string) {
  const state = read();
  state.newsletters = state.newsletters.filter((n) => n.id !== newsletterId);
  write(state);
}

export function listEditors() {
  return read().editors.map(({ password: _p, ...rest }) => rest);
}
export function createEditor(data: { email: string; password: string; can_edit_others: boolean }) {
  const state = read();
  if (state.editors.some((e) => e.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("That email already has access.");
  }
  state.editors.push({
    user_id: id(),
    email: data.email,
    password: data.password,
    roles: ["editor"],
    can_edit_others: data.can_edit_others,
  });
  write(state);
}
export function updateEditorPermissions(userId: string, canEditOthers: boolean) {
  const state = read();
  const row = state.editors.find((e) => e.user_id === userId);
  if (row) row.can_edit_others = canEditOthers;
  write(state);
}
export function deleteEditor(userId: string) {
  const state = read();
  state.editors = state.editors.filter((e) => e.user_id !== userId && !e.roles.includes("admin"));
  write(state);
}

export function getPublishedPosts() {
  return listArticles()
    .filter((a) => a.published && a.status !== "draft" && a.status !== "archived")
    .map((a) => {
      const cat = listCategories().find((c) => c.id === a.category_id);
      return {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: cat?.name || "General",
        author: a.author_name || "Accrefin Team",
        publishedAt: a.publishedAt,
        readTime: `${a.read_time_minutes} min read`,
        coverImage: a.cover_image_url,
        content: [] as string[],
        htmlBody: a.body,
        subtitle: a.subtitle,
        gallery: a.gallery_images,
        tags: a.tags ?? [],
        facebook_url: a.facebook_url,
        twitter_url: a.twitter_url,
        linkedin_url: a.linkedin_url,
        instagram_url: a.instagram_url,
        readMinutes: a.read_time_minutes,
      };
    });
}

export function getPublishedPost(slug: string) {
  return getPublishedPosts().find((p) => p.slug === slug);
}
