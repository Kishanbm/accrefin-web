import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUpload, ImageMultiUpload } from "@/components/image-upload";
import { WPEditor } from "@/components/wp-editor";
import { useAuth } from "@/lib/use-auth";
import {
  listAllArticles,
  saveArticle,
  deleteArticle,
  saveCategory,
  deleteCategory,
  listAllAds,
  saveAd,
  deleteAd,
  listAllBlocks,
  saveBlock,
  deleteBlock,
  listBanners,
  saveBanner,
  deleteBanner,
  reorderBanners,
  getSiteSettings,
  saveSiteSettings,
} from "@/lib/admin.functions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — ACCREFIN" }] }),
  component: AdminPage,
});

type Tab = "articles" | "categories" | "ads" | "blocks" | "banners" | "settings";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("articles");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) return <Center>Loading…</Center>;
  if (!user) return null;
  if (!isAdmin)
    return (
      <Center>
        <p className="font-display text-3xl mb-3">Restricted</p>
        <p className="text-sm text-muted-foreground mb-6">
          Your account does not have admin access.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs underline"
        >
          Sign out
        </button>
      </Center>
    );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex items-center justify-between mb-10 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Editorial</p>
          <h1 className="font-display text-4xl mt-1">Admin Console</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs uppercase tracking-widest">View site</Link>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))}
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <nav className="flex gap-1 mb-8 border-b border-border">
        {(["articles", "categories", "ads", "blocks", "banners", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
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
        <a href="/admin/newsletters" className="px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-muted-foreground hover:text-foreground">
          Newsletters
        </a>
        <a href="/admin/access" className="px-5 py-3 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent text-muted-foreground hover:text-foreground">
          Admin Access
        </a>
      </nav>

      {tab === "articles" && <ArticlesAdmin />}
      {tab === "categories" && <CategoriesAdmin />}
      {tab === "ads" && <AdsAdmin />}
      {tab === "blocks" && <BlocksAdmin />}
      {tab === "banners" && <BannersAdmin />}
      {tab === "settings" && <SettingsAdmin />}
    </main>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      {children}
    </main>
  );
}

// ---------------- ARTICLES ----------------
function ArticlesAdmin() {
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: () => listAllArticles(),
  });
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<any | null>(null);

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


  async function onSave(form: any) {
    try {
      // ImageUpload returns {url, alt, focal_x, focal_y}; DB column is a string url.
      const norm = { ...form };
      if (norm.cover_image_url && typeof norm.cover_image_url === "object") {
        norm.cover_image_url = norm.cover_image_url.url || "";
      }
      if (norm.secondary_image_url && typeof norm.secondary_image_url === "object") {
        norm.secondary_image_url = norm.secondary_image_url.url || "";
      }
      await saveArticle({ data: norm });
      setEditing(null);
      refetch();
      qc.invalidateQueries({ queryKey: ["articles"] });
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete article?")) return;
    await deleteArticle({ data: { id } });
    refetch();
    qc.invalidateQueries({ queryKey: ["articles"] });
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{items.length} articles</p>
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
                const { data } = await supabase
                  .from("article_tags").select("tags(name)").eq("article_id", a.id);
                const tags = ((data ?? []) as any[]).map((r) => r.tags?.name).filter(Boolean);
                setEditing({ ...a, tags });
              }}
              className="text-xs uppercase tracking-widest border border-border px-3 py-1.5"
            >
              Edit
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

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit article" : "New article"} wide>
          <ArticleForm
            value={editing}
            onChange={setEditing}
            categories={categories}
            onSave={() => onSave(editing)}
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
  onSave,
}: {
  value: any;
  onChange: (v: any) => void;
  categories: any[];
  onSave: () => void;
}) {
  function set(field: string, v: any) {
    onChange({ ...value, [field]: v });
  }

  const tags: string[] = value.tags ?? [];
  const [tagDraft, setTagDraft] = useState("");
  const [tagOptions, setTagOptions] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    supabase.from("tags").select("name,slug").order("name").limit(500).then(({ data }) => {
      setTagOptions((data ?? []) as any);
    });
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-3"
    >
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
            <select
              className="ipt"
              value={value.category_id ?? ""}
              onChange={(e) => set("category_id", e.target.value || null)}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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

      <SaveBar />
    </form>
  );
}


// ---------------- CATEGORIES ----------------
function CategoriesAdmin() {
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<any | null>(null);

  async function onSave(form: any) {
    await saveCategory({ data: form });
    setEditing(null);
    refetch();
    qc.invalidateQueries({ queryKey: ["categories"] });
  }
  async function onDelete(id: string) {
    if (!confirm("Delete category?")) return;
    await deleteCategory({ data: { id } });
    refetch();
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
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin", "ads"],
    queryFn: () => listAllAds(),
  });
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);

  async function onSave(form: any) {
    try {
      const norm = { ...form };
      if (norm.image_url && typeof norm.image_url === "object") {
        norm.image_url = norm.image_url.url || "";
      }
      await saveAd({ data: norm });
      setEditing(null);
      refetch();
      qc.invalidateQueries({ queryKey: ["ad_slots"] });
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }
  async function onDelete(id: string) {
    if (!confirm("Delete ad slot?")) return;
    await deleteAd({ data: { id } });
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
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin", "blocks"],
    queryFn: () => listAllBlocks(),
  });
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);

  async function onSave(form: any) {
    await saveBlock({ data: form });
    setEditing(null);
    refetch();
    qc.invalidateQueries({ queryKey: ["homepage_blocks"] });
  }
  async function onDelete(id: string) {
    if (!confirm("Delete block?")) return;
    await deleteBlock({ data: { id } });
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
function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Row({ children }: { children: React.ReactNode }) {
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
function Modal({ children, onClose, title, wide }: { children: React.ReactNode; onClose: () => void; title: string; wide?: boolean }) {
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
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: () => listBanners(),
  });
  const [editing, setEditing] = useState<any | null>(null);

  async function onSave(form: any) {
    try {
      const norm = { ...form };
      if (norm.image_url && typeof norm.image_url === "object") {
        norm.image_url = norm.image_url.url || "";
      }
      await saveBanner({ data: norm });
      setEditing(null);
      refetch();
    } catch (e: any) {
      alert("Save failed: " + (e?.message ?? e));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete banner?")) return;
    await deleteBanner({ data: { id } });
    refetch();
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const sorted = [...items];
    const temp = sorted[index].sort_order;
    sorted[index].sort_order = sorted[index - 1].sort_order;
    sorted[index - 1].sort_order = temp;
    await reorderBanners({ data: sorted.map(b => ({ id: b.id, sort_order: b.sort_order })) });
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
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: () => getSiteSettings(),
  });
  
  const [form, setForm] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (items.length > 0) {
      const initial: Record<string, string> = {};
      items.forEach((i: any) => initial[i.key] = i.value || "");
      setForm(initial);
    }
  }, [items]);

  async function onSave() {
    try {
      const payload = Object.entries(form).map(([key, value]) => ({ key, value }));
      await saveSiteSettings({ data: { settings: payload } });
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

