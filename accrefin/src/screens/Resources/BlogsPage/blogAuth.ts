import { supabase, isSupabaseConfigured } from "../../../lib/supabaseClient";

const SESSION_KEY = "accrefin_blog_admin";

const ADMIN_EMAIL = (import.meta.env.VITE_BLOG_ADMIN_EMAIL as string | undefined) || "chirag@qodet.com";
const ADMIN_PASSWORD = (import.meta.env.VITE_BLOG_ADMIN_PASSWORD as string | undefined) || ".qodet@123";

export async function loginBlogAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();

  // Hard gate: only the configured admin email can enter the admin UI.
  if (normalized !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return { ok: false, error: "Invalid email or password." };
  }

  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error) {
      // Do not auto-create accounts from the login form.
      // Admin user must already exist in Supabase Auth (we created chirag@qodet.com).
      return {
        ok: false,
        error: error.message || "Supabase sign-in failed. Check Auth user exists.",
      };
    }
  }

  sessionStorage.setItem(SESSION_KEY, "1");
  return { ok: true };
}

export async function logoutBlogAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
}

export function isBlogAdminLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
