import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { ImageUpload, ImageMultiUpload } from "./cms/image-upload";
import { WPEditor } from "./cms/wp-editor";
import { ArticlePreview } from "./ArticlePreview";
import { isBlogAdminLoggedIn, logoutBlogAdmin } from "./blogAuth";
import {
  listAds,
  saveAd,
  deleteAd,
  listBlocks,
  saveBlock,
  deleteBlock,
  listBanners,
  saveBanner,
  deleteBanner,
  reorderBanners,
  getSiteSettings,
  saveSiteSettings,
  listTags,
  listNewsletters,
  saveNewsletter,
  deleteNewsletter,
  listEditors,
  createEditor,
  updateEditorPermissions,
  deleteEditor,
} from "./cmsStore";
import {
  fetchAllArticlesAdmin,
  fetchCategories,
  upsertArticleAdmin,
  removeArticleAdmin,
  upsertCategoryAdmin,
  removeCategoryAdmin,
  ensureDefaultCategories,
} from "./supabaseCms";
import { slugifyTitle } from "./blogStore";
import "./cms/cms-editor.css";

export default function BlogAdmin() {
  return <AdminPage />;
}

type Tab = "articles" | "categories" | "ads" | "blocks" | "banners" | "settings" | "newsletters" | "access";

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("articles");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isBlogAdminLoggedIn()) {
      navigate("/blogs/admin/login");
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) return <Center>Loading…</Center>;

  return (
    <main className="blog-cms max-w-7xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Editorial</p>
          <h1 className="font-display text-4xl mt-1">Admin Console</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/blogs" className="text-xs uppercase tracking-widest">View site</Link>
          <button
            type="button"
            onClick={async () => {
              await logoutBlogAdmin();
              navigate("/blogs/admin/login");
            }}
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <nav className="flex gap-1 mb-8 border-b border-border flex-wrap">
        {(["articles", "categories", "ads", "blocks", "banners", "settings", "newsletters", "access"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "articles" && <ArticlesAdmin />}
      {tab === "categories" && <CategoriesAdmin />}
      {tab === "ads" && <AdsAdmin />}
      {tab === "blocks" && <BlocksAdmin />}
      {tab === "banners" && <BannersAdmin />}
      {tab === "settings" && <SettingsAdmin />}
      {tab === "newsletters" && <NewslettersAdmin />}
      {tab === "access" && <AccessAdmin />}
    </main>
  );
}

function Center({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      {children}
    </main>
  );
}

// ---------------- ARTICLES ----------------
function ArticlesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [previewing, setPreviewing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  async function refetch() {
    setLoading(true);
    try {
      await ensureDefaultCategories();
      const [cats, articles] = await Promise.all([fetchCategories(), fetchAllArticlesAdmin()]);
      setCategories(cats);
      setItems(articles);
    } catch (e: any) {
      console.error(e);
      alert("Failed to load articles: " + (e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function refreshCategories() {
    const cats = await fetchCategories();
    setCategories(cats);
    return cats;
  }

  useEffect(() => { refetch(); }, []);

  function emptyForm() {
    return {
      slug: "",
      title: "",
      subtitle: "",
      excerpt: "",
      body: "",
      cover_image_url: "",
      secondary_image_url: "",
      gallery_images: [] as string[],
      key_moments: [] as { title: string; body: string }[],
      questions: [] as { q: string; a: string }[],
      pull_quote: "",
      instagram_url: "",
      facebook_url: "",
      twitter_url: "",
      linkedin_url: "",
      category_id: categories[0]?.id ?? null,
      author_name: "",
      read_time_minutes: 5,
      featured: false,
      published: true,
      layout_size: "standard" as "hero_large" | "spotlight_single" | "two_col" | "standard",
      tags: [] as string[],
      seo_title: "",
      seo_description: "",
      scheduled_at: "",
      status: "published",
    };
  }


  async function onSave(form: any, asPublished = true) {
    try {
      // ImageUpload returns {url, alt, focal_x, focal_y}; DB column is a string url.
      const norm = { ...form };
      if (norm.cover_image_url && typeof norm.cover_image_url === "object") {
        norm.cover_image_url = norm.cover_image_url.url || "";
      }
      if (norm.secondary_image_url && typeof norm.secondary_image_url === "object") {
        norm.secondary_image_url = norm.secondary_image_url.url || "";
      }
      if (Array.isArray(norm.gallery_images)) {
        norm.gallery_images = norm.gallery_images.map((g: unknown) =>
          typeof g === "string" ? g : imageUrlOf(g),
        );
      }
      // Data-URL images are too large for Supabase text columns — block publish.
      for (const key of ["cover_image_url", "secondary_image_url"] as const) {
        const u = String(norm[key] || "");
        if (u.startsWith("data:")) {
          throw new Error(
            "Cover image must be uploaded to storage (not pasted as a huge file). Re-upload the image while signed in, then Publish again.",
          );
        }
      }
      if (!norm.slug && norm.title) norm.slug = slugifyTitle(norm.title);
      if (asPublished) {
        norm.status = "published";
        norm.published = true;
      }
      await upsertArticleAdmin(norm);
      setEditing(null);
      await refetch();
      if (asPublished) {
        alert("Published! Open /blogs (or View site) to see it publicly.");
      }
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }

  function imageUrlOf(v: unknown): string {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object" && v && "url" in v) return String((v as { url?: string }).url || "");
    return "";
  }

  async function onDelete(id: string) {
    if (!confirm("Delete article?")) return;
    try {
      await removeArticleAdmin(id);
      await refetch();
    } catch (e: any) {
      alert("Delete failed: " + (e?.message ?? e));
    }
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${items.length} articles`} · synced to Supabase
        </p>
        <button
          onClick={() => setEditing(emptyForm())}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          + New article
        </button>
      </div>

      <div className="space-y-2">
        {items.map((a: any) => (
          <div
            key={a.id}
            className="flex items-center gap-4 p-4 border border-border bg-surface"
          >
            <div className="flex-1">
              <p className="font-display text-lg">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                /{a.slug} · {a.category?.name ?? "—"} ·{" "}
                {a.published ? "Published" : "Draft"}
                {a.featured && " · Featured"}
              </p>
            </div>
            <button
              onClick={async () => {
                setEditing({ ...a, tags: a.tags ?? [] });
              }}
              className="text-xs uppercase tracking-widest border border-border px-3 py-1.5"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewing(a)}
              className="text-xs uppercase tracking-widest border border-foreground px-3 py-1.5"
            >
              Preview
            </button>
            <button
              onClick={() => onDelete(a.id)}
              className="text-xs uppercase tracking-widest text-destructive"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {previewing && (
        <ArticlePreview
          article={previewing}
          categoryName={previewing.category?.name || categories.find((c) => c.id === previewing.category_id)?.name || "Uncategorized"}
          onClose={() => setPreviewing(null)}
        />
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit article" : "New article"} wide>
          <ArticleForm
            value={editing}
            onChange={setEditing}
            categories={categories}
            onCategoriesChange={refreshCategories}
            onSave={() => onSave(editing, true)}
            onSaveDraft={() => onSave(editing, false)}
          />
        </Modal>
      )}
    </section>
  );
}

function ArticleForm({
  value,
  onChange,
  categories,
  onCategoriesChange,
  onSave,
  onSaveDraft,
}: {
  value: any;
  onChange: (v: any) => void;
  categories: any[];
  onCategoriesChange?: () => Promise<any[]>;
  onSave: () => void;
  onSaveDraft?: () => void;
}) {
  function set(field: string, v: any) {
    onChange({ ...value, [field]: v });
  }

  const tags: string[] = value.tags ?? [];
  const [tagDraft, setTagDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [removingCategory, setRemovingCategory] = useState(false);
  const [tagOptions, setTagOptions] = useState<{ name: string; slug: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  async function addCategory() {
    const name = categoryDraft.trim();
    if (!name || addingCategory) return;
    setAddingCategory(true);
    try {
      const slug = slugifyTitle(name);
      await upsertCategoryAdmin({ name, slug, sort_order: categories.length });
      const cats = onCategoriesChange ? await onCategoriesChange() : categories;
      const created = cats.find(
        (c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase(),
      );
      if (created) set("category_id", created.id);
      setCategoryDraft("");
    } catch (e: any) {
      alert("Failed to add category: " + (e?.message ?? e));
    } finally {
      setAddingCategory(false);
    }
  }

  async function removeSelectedCategory() {
    const id = value.category_id;
    if (!id || removingCategory) return;
    const cat = categories.find((c) => c.id === id);
    if (!confirm(`Remove category "${cat?.name ?? "this category"}"?`)) return;
    setRemovingCategory(true);
    try {
      await removeCategoryAdmin(id);
      set("category_id", null);
      await onCategoriesChange?.();
    } catch (e: any) {
      alert("Failed to remove category: " + (e?.message ?? e));
    } finally {
      setRemovingCategory(false);
    }
  }

  useEffect(() => {
    setTagOptions(listTags());
  }, []);

  function normalize(raw: string) {
    return raw.replace(/^#+/, "").trim().toLowerCase();
  }
  function addTag(raw: string) {
    const parts = raw.split(/[,\s]+/).map((s) => s.replace(/^#/, "").trim()).filter(Boolean);
    if (parts.length === 0) return;
    const existing = new Set(tags.map((t) => normalize(t)));
    const next = [...tags];
    for (const p of parts) {
      const n = normalize(p);
      if (!n || existing.has(n)) continue;
      existing.add(n);
      next.push(p);
    }
    set("tags", next);
    setTagDraft("");
  }

  const query = normalize(tagDraft.split(/[,\s]+/).pop() ?? "");
  const suggestions = query
    ? tagOptions
        .filter((t) => t.slug.startsWith(query) || t.name.toLowerCase().startsWith(query))
        .filter((t) => !tags.some((x) => normalize(x) === t.slug))
        .slice(0, 8)
    : [];

  const categoryName =
    categories.find((c) => c.id === value.category_id)?.name || "Uncategorized";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-3"
    >
      {showPreview && (
        <ArticlePreview
          article={value}
          categoryName={categoryName}
          onClose={() => setShowPreview(false)}
        />
      )}
      <div className="flex justify-end gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-5 py-2 border border-foreground text-xs font-bold uppercase tracking-widest"
        >
          Preview
        </button>
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-5 py-2 border border-border text-xs font-bold uppercase tracking-widest"
          >
            Save draft
          </button>
        )}
        <button type="submit" className="px-5 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
          Publish
        </button>
      </div>
      <Section title="Basics" defaultOpen>
        <Row>
          <Field label="Title">
            <input className="ipt" value={value.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <Field label="Slug">
            <input className="ipt" value={value.slug} onChange={(e) => set("slug", e.target.value)} required />
          </Field>
        </Row>
        <Field label="Subtitle">
          <input className="ipt" value={value.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
        </Field>
        <Field label="Excerpt">
          <textarea className="ipt h-20" value={value.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} />
        </Field>
        <Row>
          <Field label="Category">
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  className="ipt flex-1 min-w-0"
                  value={value.category_id ?? ""}
                  onChange={(e) => set("category_id", e.target.value || null)}
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={removeSelectedCategory}
                  disabled={!value.category_id || removingCategory}
                  className="shrink-0 flex items-center justify-center px-3 border border-border hover:border-destructive hover:text-destructive disabled:opacity-40"
                  title="Remove selected category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  className="ipt flex-1 min-w-0"
                  placeholder="Add new category"
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCategory}
                  disabled={!categoryDraft.trim() || addingCategory}
                  className="shrink-0 flex items-center justify-center px-3 border border-border hover:border-primary disabled:opacity-40"
                  title="Add category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Field>
          <Field label="Author">
            <input className="ipt" value={value.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Read time (min)">
            <input type="number" className="ipt" value={value.read_time_minutes} onChange={(e) => set("read_time_minutes", Number(e.target.value))} />
          </Field>
          <div className="flex items-end gap-4">
            <Toggle label="Featured" checked={!!value.featured} onChange={(v) => set("featured", v)} />
          </div>
        </Row>
      </Section>

      <Section title="Publishing & SEO" defaultOpen>
        <Row>
          <Field label="Status">
            <select className="ipt" value={value.status ?? "published"} onChange={(e) => {
              set("status", e.target.value);
              if (e.target.value === "published") set("published", true);
              else set("published", false);
            }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Scheduled At (Optional)">
            <input type="datetime-local" className="ipt" value={value.scheduled_at ? new Date(value.scheduled_at).toISOString().slice(0, 16) : ""} onChange={(e) => set("scheduled_at", e.target.value ? new Date(e.target.value).toISOString() : null)} />
          </Field>
        </Row>
        <Row>
          <Field label="SEO Title">
            <input className="ipt" placeholder="Custom title for search engines" value={value.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} />
          </Field>
          <Field label="SEO Description">
            <textarea className="ipt h-16" placeholder="Meta description..." value={value.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} />
          </Field>
        </Row>
      </Section>

      <Section title="Homepage placement — where & what size" defaultOpen>
        <p className="text-[11px] text-muted-foreground mb-3">
          Choose how this article appears on the homepage. Cover-image aspect ratio adapts to your pick.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {([
            { v: "hero_large", label: "Hero (top)", hint: "16:9 · large lead", ratio: "aspect-video" },
            { v: "spotlight_single", label: "Spotlight row", hint: "Full-width single card · 21:9", ratio: "aspect-[21/9]" },
            { v: "two_col", label: "Two-column pair", hint: "4:3 · pairs with another two-col", ratio: "aspect-[4/3]" },
            { v: "standard", label: "Standard grid", hint: "4:5 · latest / grid", ratio: "aspect-[4/5]" },
          ] as const).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => set("layout_size", o.v)}
              className={`text-left p-3 border-2 transition ${value.layout_size === o.v ? "border-primary bg-primary/5" : "border-border hover:border-foreground/40"}`}
            >
              <div className={`${o.ratio} bg-surface border border-border mb-2`} />
              <p className="text-xs font-bold uppercase tracking-widest">{o.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{o.hint}</p>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Cover photo" defaultOpen>
        <p className="text-[10px] text-muted-foreground mb-2">
          Recommended: {value.layout_size === "hero_large" ? "1920×1080 (16:9)"
            : value.layout_size === "spotlight_single" ? "1680×720 (21:9)"
            : value.layout_size === "two_col" ? "1200×900 (4:3)"
            : "1200×1500 (4:5)"}
        </p>
        <ImageUpload
          value={value.cover_image_url}
          onChange={(v) => set("cover_image_url", v)}
        />
      </Section>

      <Section title="Tags & hashtags" defaultOpen>
        <p className="text-[11px] text-muted-foreground mb-2">
          Type <code>#tag</code> and press Enter or space. Suggestions come from your tag library — pick one to reuse it (no duplicates).
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface border border-border text-xs">
              #{normalize(t)}
              <button type="button" className="text-muted-foreground hover:text-destructive"
                onClick={() => set("tags", tags.filter((x) => x !== t))}>×</button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            className="ipt"
            placeholder="e.g. #design #futurism #interview"
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === " " || e.key === "Tab") {
                if (tagDraft.trim()) { e.preventDefault(); addTag(tagDraft); }
              } else if (e.key === "Backspace" && !tagDraft && tags.length) {
                set("tags", tags.slice(0, -1));
              }
            }}
            onBlur={() => tagDraft && addTag(tagDraft)}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 left-0 right-0 bg-background border border-border shadow-lg max-h-56 overflow-auto">
              {suggestions.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); addTag(s.slug); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-surface flex items-center justify-between"
                >
                  <span>#{s.slug}</span>
                  <span className="text-muted-foreground">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Section>


      <Section title="Article body — full block editor" defaultOpen>
        <p className="text-[11px] text-muted-foreground mb-2">
          Use the left rail to insert headings, lists, quotes, key moments, questions, pull quotes, callouts, link buttons, images, galleries, YouTube, dividers, and tables. The right inspector handles colors, font size, alignment, and per-block options.
        </p>
        <WPEditor
          value={value.body ?? ""}
          onChange={(html) => set("body", html)}
        />
      </Section>

      <Section title="Photo gallery (optional, shown below the article)">
        <ImageMultiUpload
          value={value.gallery_images ?? []}
          onChange={(urls) => set("gallery_images", urls)}
        />
      </Section>

      <Section title="Social links">
        <Row>
          <Field label="Instagram URL">
            <input className="ipt" value={value.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} />
          </Field>
          <Field label="Facebook URL">
            <input className="ipt" value={value.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Twitter URL">
            <input className="ipt" value={value.twitter_url ?? ""} onChange={(e) => set("twitter_url", e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <input className="ipt" value={value.linkedin_url ?? ""} onChange={(e) => set("linkedin_url", e.target.value)} />
          </Field>
        </Row>
      </Section>

      <div className="pt-4 flex justify-end gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-5 py-2 border border-foreground text-xs font-bold uppercase tracking-widest"
        >
          Preview
        </button>
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-5 py-2 border border-border text-xs font-bold uppercase tracking-widest"
          >
            Save draft
          </button>
        )}
        <button type="submit" className="px-5 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
          Publish
        </button>
      </div>
    </form>
  );
}


// ---------------- CATEGORIES ----------------
function CategoriesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  async function refetch() {
    setItems(await fetchCategories());
  }
  useEffect(() => { refetch(); }, []);

  async function onSave(form: any) {
    try {
      await upsertCategoryAdmin(form);
      setEditing(null);
      await refetch();
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }
  async function onDelete(id: string) {
    if (!confirm("Delete category?")) return;
    try {
      await removeCategoryAdmin(id);
      await refetch();
    } catch (e: any) {
      alert("Delete failed: " + (e?.message ?? e));
    }
  }

  return (
    <section>
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">{items.length} categories</p>
        <button
          onClick={() =>
            setEditing({ slug: "", name: "", description: "", sort_order: items.length, visible: true, nav_position: "more" })
          }
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          + New
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mb-3">
        Categories marked <strong>Primary</strong> appear directly on the top navigation bar. The rest live under the “More” dropdown. Untick <strong>Visible</strong> to hide a category from navigation entirely (its page stays reachable via direct link).
      </p>
      <div className="space-y-2">
        {items.map((c: any) => (
          <div key={c.id} className="flex items-center gap-4 p-4 border border-border bg-surface">
            <div className="flex-1">
              <p className="font-display text-lg">{c.name}</p>
              <p className="text-xs text-muted-foreground">/{c.slug}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${c.nav_position === "primary" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
              {c.nav_position === "primary" ? "Primary nav" : "More menu"}
            </span>
            {c.visible === false && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-destructive text-destructive">Hidden</span>
            )}
            <button onClick={() => setEditing({ ...c })} className="text-xs uppercase border border-border px-3 py-1.5">
              Edit
            </button>
            <button onClick={() => onDelete(c.id)} className="text-xs uppercase text-destructive">
              Delete
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit category" : "New category"}>
          <form onSubmit={(e) => { e.preventDefault(); onSave(editing); }} className="space-y-3">
            <Row>
              <Field label="Name">
                <input className="ipt" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              </Field>
              <Field label="Slug">
                <input className="ipt" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
              </Field>
            </Row>
            <Field label="Description">
              <textarea className="ipt h-20" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Row>
              <Field label="Sort order">
                <input type="number" className="ipt" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </Field>
              <Field label="Navigation placement">
                <select
                  className="ipt"
                  value={editing.nav_position ?? "more"}
                  onChange={(e) => setEditing({ ...editing, nav_position: e.target.value })}
                >
                  <option value="primary">Primary — top navigation bar</option>
                  <option value="more">More — hidden under "More" dropdown</option>
                </select>
              </Field>
            </Row>
            <Field label="Visibility">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.visible !== false}
                  onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                />
                Show this category in site navigation
              </label>
            </Field>
            <SaveBar />
          </form>
        </Modal>
      )}
    </section>
  );
}

// ---------------- ADS ----------------
function AdsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  function refetch() { setItems(listAds()); }
  useEffect(() => { refetch(); }, []);

  async function onSave(form: any) {
    try {
      const norm = { ...form };
      if (norm.image_url && typeof norm.image_url === "object") {
        norm.image_url = norm.image_url.url || "";
      }
      saveAd(norm);
      setEditing(null);
      refetch();
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }
  async function onDelete(id: string) {
    if (!confirm("Delete ad slot?")) return;
    deleteAd(id);
    refetch();
  }

  return (
    <section>
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">{items.length} ad slots</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Use <code className="font-mono">custom_html</code> to inject any ad network tag
            (Google AdSense, GAM, direct script, etc.).
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              slot_key: "",
              label: "",
              title: "",
              body: "",
              image_url: "",
              cta_text: "",
              cta_url: "",
              custom_html: "",
              active: true,
            })
          }
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          + New ad
        </button>
      </div>
      <div className="space-y-2">
        {items.map((a: any) => (
          <div key={a.id} className="flex items-center gap-4 p-4 border border-border bg-surface">
            <div className="flex-1">
              <p className="font-display text-lg">{a.label}</p>
              <p className="text-xs text-muted-foreground font-mono">
                key: {a.slot_key} · {a.active ? "active" : "inactive"}
                {a.custom_html ? " · ad tag" : ""}
              </p>
            </div>
            <button onClick={() => setEditing({ ...a })} className="text-xs uppercase border border-border px-3 py-1.5">
              Edit
            </button>
            <button onClick={() => onDelete(a.id)} className="text-xs uppercase text-destructive">
              Delete
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit ad" : "New ad"} wide>
          <form onSubmit={(e) => { e.preventDefault(); onSave(editing); }} className="space-y-5">
            <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
              {/* LEFT — photo + CTA */}
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Advertisement image</p>
                  <ImageUpload
                    value={editing.image_url}
                    onChange={(v) => setEditing({ ...editing, image_url: v })}
                    aspect={aspectForSlot(editing.slot_key)}
                  />
                  <p className="text-[11px] text-muted-foreground mt-2 font-mono">
                    Aspect ratio for <b>{editing.slot_key || "this slot"}</b>: {aspectHintForSlot(editing.slot_key)}
                  </p>
                </div>
                <Field label="Destination website URL (where the ad clicks through)">
                  <input
                    className="ipt"
                    type="url"
                    placeholder="https://sponsor.com/campaign"
                    value={editing.cta_url ?? ""}
                    onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })}
                  />
                </Field>
                <Field label="Button label">
                  <input
                    className="ipt"
                    placeholder="Learn more"
                    value={editing.cta_text ?? ""}
                    onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
                  />
                </Field>
              </div>
              {/* RIGHT — placement + copy + advanced */}
              <div className="space-y-4">
                <Row>
                  <Field label="Placement slot">
                    <select
                      className="ipt"
                      value={editing.slot_key || ""}
                      onChange={(e) => setEditing({ ...editing, slot_key: e.target.value })}
                      required
                    >
                      <option value="">— Choose a slot —</option>
                      <option value="homepage_banner">Homepage banner (leaderboard 970×250)</option>
                      <option value="homepage_sidebar">Homepage sidebar (300×600)</option>
                      <option value="article_inline">Article inline (16:9)</option>
                      <option value="article_sidebar">Article sidebar sticky (300×600)</option>
                      <option value="category_top">Category top banner (970×250)</option>
                      <option value="footer_banner">Footer banner (728×90)</option>
                    </select>
                  </Field>
                  <Field label="Internal label">
                    <input className="ipt" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} required />
                  </Field>
                </Row>
                <Field label="Headline (optional overlay)">
                  <input className="ipt" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </Field>
                <Field label="Body / short description">
                  <textarea className="ipt h-20" value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
                </Field>
                <details className="border border-border">
                  <summary className="px-3 py-2 cursor-pointer text-xs uppercase tracking-widest bg-surface">Advanced — custom ad tag</summary>
                  <div className="p-3">
                    <textarea
                      className="ipt h-32 font-mono text-xs"
                      placeholder='<script async src="..."></script><ins class="adsbygoogle" ...></ins>'
                      value={editing.custom_html ?? ""}
                      onChange={(e) => setEditing({ ...editing, custom_html: e.target.value })}
                    />
                    <p className="text-[11px] text-muted-foreground mt-2">
                      When filled, this replaces the image/CTA above (for AdSense, GAM, direct scripts).
                    </p>
                  </div>
                </details>
                <Toggle label="Active — show this ad on the site" checked={!!editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
              </div>
            </div>
            <Toggle label="Active" checked={!!editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
            <SaveBar />
          </form>
        </Modal>
      )}
    </section>
  );
}

function aspectForSlot(slot?: string) {
  switch (slot) {
    case "homepage_sidebar":
    case "article_sidebar": return "aspect-[1/2]"; // 300×600
    case "homepage_banner":
    case "category_top": return "aspect-[970/250]";
    case "footer_banner": return "aspect-[728/90]";
    default: return "aspect-video"; // 16:9
  }
}
function aspectHintForSlot(slot?: string) {
  switch (slot) {
    case "homepage_sidebar":
    case "article_sidebar": return "300 × 600 (half-page, 1:2)";
    case "homepage_banner":
    case "category_top": return "970 × 250 (billboard)";
    case "footer_banner": return "728 × 90 (leaderboard)";
    case "article_inline": return "1600 × 900 (16:9)";
    default: return "16:9 recommended (choose a slot to set the exact size)";
  }
}

// ---------------- HOMEPAGE BLOCKS ----------------
function BlocksAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  function refetch() { setItems(listBlocks()); }
  useEffect(() => { refetch(); }, []);

  async function onSave(form: any) {
    saveBlock(form);
    setEditing(null);
    refetch();
  }
  async function onDelete(id: string) {
    if (!confirm("Delete block?")) return;
    deleteBlock(id);
    refetch();
  }

  return (
    <section>
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">{items.length} homepage blocks</p>
        <button
          onClick={() =>
            setEditing({
              block_key: "",
              title: "",
              subtitle: "",
              block_type: "list",
              category_slug: "",
              sort_order: items.length,
              enabled: true,
            })
          }
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          + New block
        </button>
      </div>
      <div className="space-y-2">
        {items.map((b: any) => (
          <div key={b.id} className="flex items-center gap-4 p-4 border border-border bg-surface">
            <span className="font-mono text-xs text-muted-foreground w-8">#{b.sort_order}</span>
            <div className="flex-1">
              <p className="font-display text-lg">{b.title}</p>
              <p className="text-xs text-muted-foreground font-mono">
                key: {b.block_key} · type: {b.block_type} · {b.enabled ? "on" : "off"}
              </p>
            </div>
            <button onClick={() => setEditing({ ...b })} className="text-xs uppercase border border-border px-3 py-1.5">
              Edit
            </button>
            <button onClick={() => onDelete(b.id)} className="text-xs uppercase text-destructive">
              Delete
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit block" : "New block"}>
          <form onSubmit={(e) => { e.preventDefault(); onSave(editing); }} className="space-y-3">
            <Row>
              <Field label="Block key">
                <input className="ipt" value={editing.block_key} onChange={(e) => setEditing({ ...editing, block_key: e.target.value })} required />
              </Field>
              <Field label="Title">
                <input className="ipt" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
              </Field>
            </Row>
            <Field label="Subtitle">
              <input className="ipt" value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            </Field>
            <Row>
              <Field label="Block type">
                <select
                  className="ipt"
                  value={editing.block_type}
                  onChange={(e) => setEditing({ ...editing, block_type: e.target.value })}
                >
                  <option value="hero">hero</option>
                  <option value="highlights">highlights</option>
                  <option value="list">list</option>
                  <option value="popular">popular</option>
                  <option value="spotlight">spotlight</option>
                </select>
              </Field>
              <Field label="Category slug (optional)">
                <input className="ipt" value={editing.category_slug ?? ""} onChange={(e) => setEditing({ ...editing, category_slug: e.target.value })} />
              </Field>
            </Row>
            <Field label="Sort order">
              <input type="number" className="ipt" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </Field>
            <Toggle label="Enabled" checked={!!editing.enabled} onChange={(v) => setEditing({ ...editing, enabled: v })} />
            <SaveBar />
          </form>
        </Modal>
      )}
    </section>
  );
}

// ---------------- UI HELPERS ----------------
function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <span className="font-display text-base">{title}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">{children}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Row({ children }: { children: ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-3">{children}</div>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
function SaveBar() {
  return (
    <div className="pt-4 flex justify-end">
      <button className="px-5 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
        Save
      </button>
    </div>
  );
}
function Modal({ children, onClose, title, wide }: { children: ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 bg-foreground/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className={`bg-background w-full ${wide ? "max-w-[1400px]" : "max-w-3xl"} border border-border shadow-2xl`}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <h3 className="font-display text-xl">{title}</h3>
          <button onClick={onClose} className="text-xs uppercase tracking-widest">Close</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------- BANNERS ----------------
function BannersAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  function refetch() { setItems(listBanners()); }
  useEffect(() => { refetch(); }, []);

  async function onSave(form: any) {
    try {
      const norm = { ...form };
      if (norm.image_url && typeof norm.image_url === "object") {
        norm.image_url = norm.image_url.url || "";
      }
      saveBanner(norm);
      setEditing(null);
      refetch();
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete banner?")) return;
    deleteBanner(id);
    refetch();
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const sorted = [...items];
    const temp = sorted[index].sort_order;
    sorted[index].sort_order = sorted[index - 1].sort_order;
    sorted[index - 1].sort_order = temp;
    reorderBanners(sorted.map((b: any) => ({ id: b.id, sort_order: b.sort_order })));
    refetch();
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{items.length} banners</p>
        <button
          onClick={() => setEditing({ title: "", image_url: "", link_url: "", sort_order: items.length })}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          + New banner
        </button>
      </div>
      <div className="space-y-2">
        {items.map((b: any, index: number) => (
          <div key={b.id} className="flex items-center gap-4 p-4 border border-border bg-surface">
            <img src={b.image_url} alt="" className="h-12 w-24 object-cover border border-border bg-background" />
            <div className="flex-1">
              <p className="font-bold">{b.title || "(No title)"}</p>
              <p className="text-xs text-muted-foreground">{b.link_url || "No link"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => moveUp(index)} disabled={index === 0} className="text-xs px-2 border disabled:opacity-30">▲</button>
            </div>
            <button onClick={() => setEditing(b)} className="text-xs uppercase tracking-widest border border-border px-3 py-1.5">Edit</button>
            <button onClick={() => onDelete(b.id)} className="text-xs uppercase tracking-widest text-destructive">Delete</button>
          </div>
        ))}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit banner" : "New banner"}>
          <form onSubmit={(e) => { e.preventDefault(); onSave(editing); }} className="space-y-4">
            <Field label="Banner Image">
              <ImageUpload value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            </Field>
            <Field label="Title (optional)">
              <input className="ipt" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Link URL (optional)">
              <input className="ipt" value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
            </Field>
            <SaveBar />
          </form>
        </Modal>
      )}
    </section>
  );
}

// ---------------- SITE SETTINGS ----------------
function SettingsAdmin() {
  const [items, setItems] = useState<{ key: string; value: string }[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});

  function refetch() {
    const rows = getSiteSettings();
    setItems(rows);
    const initial: Record<string, string> = {};
    rows.forEach((i) => { initial[i.key] = i.value || ""; });
    setForm(initial);
  }
  useEffect(() => { refetch(); }, []);

  async function onSave() {
    try {
      const payload = Object.entries(form).map(([key, value]) => ({ key, value }));
      saveSiteSettings(payload);
      alert("Settings saved");
      refetch();
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }

  if (items.length === 0) return <Center>Loading settings...</Center>;

  return (
    <section className="max-w-xl">
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <Field label="Site Name">
          <input className="ipt" value={form["site_name"] ?? ""} onChange={(e) => setForm({ ...form, "site_name": e.target.value })} />
        </Field>
        <Field label="Theme Color">
          <div className="flex gap-2">
            <input type="color" className="h-10 w-12 border-0 bg-transparent p-0 cursor-pointer" value={form["theme_color"] ?? "#000000"} onChange={(e) => setForm({ ...form, "theme_color": e.target.value })} />
            <input className="ipt flex-1" value={form["theme_color"] ?? ""} onChange={(e) => setForm({ ...form, "theme_color": e.target.value })} />
          </div>
        </Field>
        <Field label="Logo URL">
          <input className="ipt" value={form["logo_url"] ?? ""} onChange={(e) => setForm({ ...form, "logo_url": e.target.value })} placeholder="https://..." />
        </Field>
        <SaveBar />
      </form>
    </section>
  );
}

function NewslettersAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  async function load() {
    setRows(listNewsletters());
    setCats(await fetchCategories());
  }
  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">One global default plus optional category-specific overrides.</p>
        <button
          type="button"
          onClick={() => setEditing({ scope: "global", category_id: null, headline: "", body: "", cta_label: "Subscribe", enabled: true, scroll_trigger_pct: 60 })}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest"
        >
          New popup
        </button>
      </div>
      <div className="border border-border divide-y divide-border">
        {rows.map((r) => (
          <div key={r.id} className="p-4 flex flex-wrap items-center gap-4">
            <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${r.scope === "global" ? "bg-primary text-primary-foreground" : "bg-surface"}`}>
              {r.scope === "global" ? "Global" : r.category?.name ?? "Category"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base truncate">{r.headline}</p>
              <p className="text-xs text-muted-foreground truncate">{r.body}</p>
            </div>
            <button type="button" onClick={() => setEditing(r)} className="text-xs underline">Edit</button>
            <button type="button" onClick={() => { deleteNewsletter(r.id); load(); }} className="text-xs text-destructive underline">Delete</button>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">No popups yet.</p>}
      </div>
      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit popup" : "New popup"}>
          <form onSubmit={(e) => { e.preventDefault(); saveNewsletter(editing); setEditing(null); load(); }} className="space-y-3">
            <Field label="Headline">
              <input className="ipt" value={editing.headline} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} required />
            </Field>
            <Field label="Body">
              <textarea className="ipt h-20" value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </Field>
            <Row>
              <Field label="Scope">
                <select className="ipt" value={editing.scope} onChange={(e) => setEditing({ ...editing, scope: e.target.value })}>
                  <option value="global">Global</option>
                  <option value="category">Category</option>
                </select>
              </Field>
              {editing.scope === "category" && (
                <Field label="Category">
                  <select className="ipt" value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
                    <option value="">— Choose —</option>
                    {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              )}
            </Row>
            <SaveBar />
          </form>
        </Modal>
      )}
    </section>
  );
}

function AccessAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canEditOthers, setCanEditOthers] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  function load() { setRows(listEditors()); }
  useEffect(() => { load(); }, []);

  return (
    <section>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        The site login is still the main admin account. Extra editors are stored here so you can manage who should have access.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setErr(null);
          try {
            createEditor({ email, password, can_edit_others: canEditOthers });
            setEmail(""); setPassword(""); setCanEditOthers(false);
            load();
          } catch (ex: any) {
            setErr(ex.message || "Failed");
          }
        }}
        className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end border border-border p-6 bg-surface mb-8"
      >
        <Field label="Email">
          <input required type="email" className="ipt" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input required minLength={8} className="ipt" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Toggle label="Can edit others" checked={canEditOthers} onChange={setCanEditOthers} />
        <button className="px-5 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest">Add editor</button>
      </form>
      {err && <p className="text-xs text-destructive mb-4">{err}</p>}
      <div className="border border-border divide-y divide-border">
        {rows.map((r) => (
          <div key={r.user_id} className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{r.email}</p>
              <p className="text-[11px] text-muted-foreground">Roles: {r.roles.join(", ")}</p>
            </div>
            {r.roles.includes("admin") ? (
              <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">Admin (full)</span>
            ) : (
              <>
                <Toggle label="Edit others" checked={r.can_edit_others} onChange={() => { updateEditorPermissions(r.user_id, !r.can_edit_others); load(); }} />
                <button type="button" className="text-xs text-destructive" onClick={() => { deleteEditor(r.user_id); load(); }}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

