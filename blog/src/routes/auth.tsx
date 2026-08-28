import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — ACCREFIN" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMsg("Account created. Check your inbox if confirmation is required, otherwise sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-display text-4xl mb-2">{mode === "signin" ? "Sign in" : "Create account"}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {mode === "signin"
          ? "Access the editorial admin."
          : "The first registered user becomes the admin automatically."}
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-3 py-2 bg-surface border border-border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-3 py-2 bg-surface border border-border rounded-md text-sm"
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {msg && <p className="text-xs text-primary">{msg}</p>}

        <button
          disabled={busy}
          className="w-full py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {busy ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="text-xs text-muted-foreground hover:text-foreground mt-6 underline"
      >
        {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
