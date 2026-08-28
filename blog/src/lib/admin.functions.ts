import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Auth check failed");
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- Articles ----------
const KeyMoment = z.object({ title: z.string(), body: z.string() });
const QA = z.object({ q: z.string(), a: z.string() });

const ArticleInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  body: z.string().default(""),
  cover_image_url: z.string().nullable().optional(),
  secondary_image_url: z.string().nullable().optional(),
  gallery_images: z.array(z.string()).default([]),
  key_moments: z.array(KeyMoment).default([]),
  questions: z.array(QA).default([]),
  pull_quote: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional(),
  twitter_url: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  author_name: z.string().nullable().optional(),
  read_time_minutes: z.coerce.number().int().min(1).default(5),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  layout_size: z.enum(["hero_large", "spotlight_single", "two_col", "standard"]).default("standard"),
  tags: z.array(z.string()).default([]),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  scheduled_at: z.string().nullable().optional().transform(v => v === "" ? null : v),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("published"),
});

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/^#+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function syncArticleTags(supabase: any, articleId: string, tagNames: string[]) {
  const clean = Array.from(new Set(
    tagNames.map((t) => t.trim()).filter(Boolean)
  ));
  const tagIds: string[] = [];
  for (const name of clean) {
    const slug = slugify(name);
    if (!slug) continue;
    const { data: existing } = await supabase
      .from("tags").select("id").eq("slug", slug).maybeSingle();
    if (existing) { tagIds.push(existing.id); continue; }
    const { data: created, error } = await supabase
      .from("tags").insert({ slug, name: name.replace(/^#+/, "") }).select("id").single();
    if (error) throw new Error(error.message);
    tagIds.push(created.id);
  }
  await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (tagIds.length > 0) {
    await supabase.from("article_tags").insert(
      tagIds.map((tag_id) => ({ article_id: articleId, tag_id })),
    );
  }
}


export const listAllArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("articles")
      .select("*,category:categories(slug,name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveArticle = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ArticleInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, tags, ...payload } = data;
    let articleId = id;
    if (articleId) {
      const { error } = await context.supabase.from("articles").update(payload).eq("id", articleId);
      if (error) throw new Error(error.message);
    } else {
      const { data: row, error } = await context.supabase
        .from("articles").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      articleId = row.id;
    }
    await syncArticleTags(context.supabase, articleId!, tags ?? []);
    return { id: articleId };
  });


export const deleteArticle = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Categories ----------
const CategoryInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
  nav_position: z.enum(["primary", "more"]).default("more"),
});

export const saveCategory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CategoryInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("categories").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("categories").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Ad slots ----------
const AdInput = z.object({
  id: z.string().uuid().optional(),
  slot_key: z.string().min(1),
  label: z.string().min(1),
  title: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  cta_text: z.string().nullable().optional(),
  cta_url: z.string().nullable().optional(),
  custom_html: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export const listAllAds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("ad_slots").select("*").order("slot_key");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveAd = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AdInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("ad_slots").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("ad_slots").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteAd = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("ad_slots").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Homepage blocks ----------
const BlockInput = z.object({
  id: z.string().uuid().optional(),
  block_key: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  block_type: z.string().default("list"),
  category_slug: z.string().nullable().optional(),
  sort_order: z.coerce.number().int().default(0),
  enabled: z.boolean().default(true),
});

export const listAllBlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("homepage_blocks").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveBlock = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => BlockInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("homepage_blocks").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("homepage_blocks").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteBlock = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("homepage_blocks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Admin check ----------
export const whoami = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return {
      userId: context.userId,
      roles: (data ?? []).map((r: any) => r.role),
      isAdmin: (data ?? []).some((r: any) => r.role === "admin"),
    };
  });

// ---------- Newsletter Popups ----------
const NewsletterInput = z.object({
  id: z.string().uuid().optional(),
  scope: z.enum(["global", "category"]).default("global"),
  category_id: z.string().uuid().nullable().optional(),
  headline: z.string().min(1),
  body: z.string().nullable().optional(),
  cta_label: z.string().nullable().optional(),
  enabled: z.boolean().default(true),
  scroll_trigger_pct: z.coerce.number().int().min(10).max(100).default(60),
});

export const listNewsletters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("newsletter_popups")
      .select("*,category:categories(slug,name)")
      .order("scope", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NewsletterInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("newsletter_popups").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("newsletter_popups").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("newsletter_popups").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Editor / Admin Access ----------
const EditorInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  can_edit_others: z.boolean().default(false),
});

export const listEditors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles").select("user_id,role").in("role", ["editor", "admin"]);
    const { data: perms } = await supabaseAdmin.from("editor_permissions").select("*");
    const userIds = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
    const list: any[] = [];
    for (const uid of userIds) {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(uid);
      list.push({
        user_id: uid,
        email: u?.user?.email ?? "(unknown)",
        roles: (roles ?? []).filter((r: any) => r.user_id === uid).map((r: any) => r.role),
        can_edit_others: (perms ?? []).find((p: any) => p.user_id === uid)?.can_edit_others ?? false,
      });
    }
    return list;
  });

export const createEditor = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EditorInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const uid = created.user!.id;
    await supabaseAdmin.from("user_roles").insert({ user_id: uid, role: "editor" });
    await supabaseAdmin.from("editor_permissions").upsert({
      user_id: uid, can_edit_others: data.can_edit_others,
    });
    return { ok: true, user_id: uid };
  });

export const updateEditorPermissions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid(), can_edit_others: z.boolean() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("editor_permissions").upsert({
      user_id: data.user_id, can_edit_others: data.can_edit_others,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEditor = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", "editor");
    await supabaseAdmin.from("editor_permissions").delete().eq("user_id", data.user_id);
    await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    return { ok: true };
  });

export const listCategoriesForAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data } = await context.supabase.from("categories").select("id,slug,name").order("name");
    return data ?? [];
  });

// ---------- Banners ----------
const BannerInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().nullable().optional(),
  image_url: z.string().min(1),
  link_url: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const listBanners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveBanner = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => BannerInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...payload } = data;
    if (id) {
      const { error } = await context.supabase.from("banners").update(payload).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("banners").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteBanner = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("banners").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderBanners = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // update multiple banners
    for (const b of data) {
      await context.supabase.from("banners").update({ sort_order: b.sort_order }).eq("id", b.id);
    }
    return { ok: true };
  });

// ---------- Site Settings ----------
const SiteSettingsInput = z.object({
  settings: z.array(z.object({
    key: z.string(),
    value: z.string().nullable()
  }))
});

export const getSiteSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase.from("site_settings").select("*");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveSiteSettings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SiteSettingsInput.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (const setting of data.settings) {
      await context.supabase
        .from("site_settings")
        .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" });
    }
    return { ok: true };
  });
