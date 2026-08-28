import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginBlogAdmin } from "./blogAuth";
import { ensureDefaultCategories } from "./supabaseCms";

export default function BlogAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyFont = "font-['DM_Sans',_sans-serif]";
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await loginBlogAdmin(email, password);
      if (!result.ok) {
        setError(result.error || "Invalid email or password.");
        return;
      }
      await ensureDefaultCategories();
      navigate("/blogs/admin");
    } catch (err: any) {
      setError(err?.message || "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[70vh] bg-[#f4f9ff] flex items-center justify-center px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
      >
        <h1 className={`text-2xl text-gray-900 mb-2 ${headingFont}`}>Blog admin</h1>
        <p className={`text-sm text-gray-500 mb-6 ${bodyFont}`}>
          Sign in to publish posts to Supabase (visible to everyone on /blogs).
        </p>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${bodyFont}`}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-[#1d4ed8]"
          required
        />
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${bodyFont}`}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-[#1d4ed8]"
          required
        />
        {error && <p className={`text-sm text-red-600 mb-4 ${bodyFont}`}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold py-2.5 rounded-lg disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </section>
  );
}
