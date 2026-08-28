import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listEditors, createEditor, updateEditorPermissions, deleteEditor } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/access")({
  component: AccessAdmin,
});

type Editor = {
  user_id: string;
  email: string;
  roles: string[];
  can_edit_others: boolean;
};

function AccessAdmin() {
  const [rows, setRows] = useState<Editor[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canEditOthers, setCanEditOthers] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setRows(await listEditors() as any);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      await createEditor({ data: { email, password, can_edit_others: canEditOthers } as any });
      setEmail(""); setPassword(""); setCanEditOthers(false);
      await load();
    } catch (ex: any) { setErr(ex.message || "Failed"); }
    finally { setBusy(false); }
  }

  async function togglePerm(r: Editor) {
    await updateEditorPermissions({ data: { user_id: r.user_id, can_edit_others: !r.can_edit_others } as any });
    await load();
  }
  async function remove(r: Editor) {
    if (!confirm(`Remove access for ${r.email}? This deletes the user.`)) return;
    await deleteEditor({ data: { user_id: r.user_id } as any });
    await load();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <Link to="/admin" className="text-xs uppercase tracking-widest text-muted-foreground">← Admin</Link>
      <h1 className="font-display text-3xl md:text-4xl mt-2">Admin Access</h1>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
        Create editor accounts that can sign in and publish articles. Choose whether they can edit only their own posts or every author's posts.
      </p>

      <section className="mt-8 border border-border p-6 bg-surface">
        <h2 className="font-display text-xl mb-4">Invite a new editor</h2>
        <form onSubmit={add} className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
          <label className="text-xs">
            <span className="block mb-1 text-muted-foreground">Email (Gmail or any)</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-border bg-background" />
          </label>
          <label className="text-xs">
            <span className="block mb-1 text-muted-foreground">Password (min 8 chars)</span>
            <input required type="text" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-border bg-background font-mono" />
          </label>
          <label className="text-xs inline-flex items-center gap-2">
            <input type="checkbox" checked={canEditOthers} onChange={(e) => setCanEditOthers(e.target.checked)} />
            <span>Can edit others' blogs</span>
          </label>
          <button disabled={busy} className="px-5 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest disabled:opacity-50">
            {busy ? "Adding…" : "Add editor"}
          </button>
        </form>
        {err && <p className="text-xs text-destructive mt-3">{err}</p>}
        <p className="text-[11px] text-muted-foreground mt-3">
          • <strong>Unchecked</strong>: editor can publish their own blogs only, can't touch other authors' posts.<br />
          • <strong>Checked</strong>: editor has full access to edit every author's blog.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl mb-4">Current users with access</h2>
        <div className="border border-border divide-y divide-border">
          {rows.map((r) => (
            <div key={r.user_id} className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.email}</p>
                <p className="text-[11px] text-muted-foreground">
                  Roles: {r.roles.join(", ") || "—"}
                </p>
              </div>
              {r.roles.includes("admin") ? (
                <span className="text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">Admin (full)</span>
              ) : (
                <>
                  <label className="text-xs inline-flex items-center gap-2">
                    <input type="checkbox" checked={r.can_edit_others} onChange={() => togglePerm(r)} />
                    <span>Edit others</span>
                  </label>
                  <button onClick={() => remove(r)} className="text-xs text-destructive underline">Remove</button>
                </>
              )}
            </div>
          ))}
          {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">No editors yet.</p>}
        </div>
      </section>
    </main>
  );
}
