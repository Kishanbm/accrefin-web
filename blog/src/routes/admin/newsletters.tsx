import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listNewsletters, saveNewsletter, deleteNewsletter, listCategoriesForAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/newsletters")({
  component: NewsletterAdmin,
});

type Row = {
  id?: string;
  scope: "global" | "category";
  category_id: string | null;
  headline: string;
  body: string | null;
  cta_label: string | null;
  enabled: boolean;
  scroll_trigger_pct: number;
  category?: { name: string; slug: string } | null;
};

function NewsletterAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [cats, setCats] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [n, c] = await Promise.all([listNewsletters(), listCategoriesForAdmin()]);
    setRows(n as any);
    setCats(c as any);
  }
  useEffect(() => { load(); }, []);

  function blank(): Row {
    return {
      scope: "global", category_id: null, headline: "",
      body: "", cta_label: "Subscribe", enabled: true, scroll_trigger_pct: 60,
    };
  }
  async function save() {
    if (!editing) return;
    setBusy(true);
    try {
      await saveNewsletter({
        data: {
          id: editing.id,
          scope: editing.scope,
          category_id: editing.scope === "category" ? editing.category_id : null,
          headline: editing.headline,
          body: editing.body,
          cta_label: editing.cta_label,
          enabled: editing.enabled,
          scroll_trigger_pct: editing.scroll_trigger_pct,
        } as any,
      });
      setEditing(null);
      await load();
    } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this newsletter popup?")) return;
    await deleteNewsletter({ data: { id } });
    await load();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin" className="text-xs uppercase tracking-widest text-muted-foreground">← Admin</Link>
          <h1 className="font-display text-3xl md:text-4xl mt-2">Newsletter pop-ups</h1>
          <p className="text-sm text-muted-foreground mt-1">One global default plus optional category-specific overrides.</p>
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest"
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
            <span className="text-xs text-muted-foreground">Trigger {r.scroll_trigger_pct}%</span>
            <span className={`text-xs ${r.enabled ? "text-emerald-600" : "text-muted-foreground"}`}>
              {r.enabled ? "Enabled" : "Disabled"}
            </span>
            <button onClick={() => setEditing(r)} className="text-xs underline">Edit</button>
            <button onClick={() => r.id && remove(r.id)} className="text-xs text-destructive underline">Delete</button>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">No popups yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-foreground/50 grid place-items-center p-4 z-50">
          <div className="bg-background w-full max-w-2xl p-6 border border-border space-y-4">
            <h2 className="font-display text-2xl">{editing.id ? "Edit popup" : "New popup"}</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                <span className="block mb-1 text-muted-foreground">Scope</span>
                <select
                  value={editing.scope}
                  onChange={(e) => setEditing({ ...editing, scope: e.target.value as any })}
                  className="w-full px-3 py-2 border border-border bg-background"
                >
                  <option value="global">Global (default)</option>
                  <option value="category">Category-specific</option>
                </select>
              </label>
              {editing.scope === "category" && (
                <label className="text-xs">
                  <span className="block mb-1 text-muted-foreground">Category</span>
                  <select
                    value={editing.category_id ?? ""}
                    onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                    className="w-full px-3 py-2 border border-border bg-background"
                  >
                    <option value="">— Choose —</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              )}
            </div>
            <label className="text-xs block">
              <span className="block mb-1 text-muted-foreground">Headline</span>
              <input
                value={editing.headline}
                onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background"
              />
            </label>
            <label className="text-xs block">
              <span className="block mb-1 text-muted-foreground">Body</span>
              <textarea
                value={editing.body ?? ""}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border bg-background"
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs">
                <span className="block mb-1 text-muted-foreground">CTA label</span>
                <input
                  value={editing.cta_label ?? ""}
                  onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background"
                />
              </label>
              <label className="text-xs">
                <span className="block mb-1 text-muted-foreground">Scroll trigger %</span>
                <input
                  type="number" min={10} max={100}
                  value={editing.scroll_trigger_pct}
                  onChange={(e) => setEditing({ ...editing, scroll_trigger_pct: parseInt(e.target.value || "60") })}
                  className="w-full px-3 py-2 border border-border bg-background"
                />
              </label>
              <label className="text-xs flex items-end gap-2">
                <input
                  type="checkbox"
                  checked={editing.enabled}
                  onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                />
                <span>Enabled</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-xs border border-border">Cancel</button>
              <button disabled={busy} onClick={save} className="px-4 py-2 text-xs bg-foreground text-background disabled:opacity-50">
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
