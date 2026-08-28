import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Popup = {
  id: string;
  scope: string;
  category_id: string | null;
  headline: string;
  body: string | null;
  cta_label: string | null;
  enabled: boolean;
  scroll_trigger_pct: number;
};

export function NewsletterPopup() {
  const location = useLocation();
  const [popup, setPopup] = useState<Popup | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // Pick the right popup for the current route
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Identify category slug from path
      const path = location.pathname;
      let slug: string | null = null;
      const catMatch = path.match(/^\/category\/([^/]+)/);
      if (catMatch) slug = catMatch[1];
      if (path.startsWith("/article/")) {
        const articleSlug = path.split("/")[2];
        const { data: art } = await supabase
          .from("articles").select("category_id,categories(slug)").eq("slug", articleSlug).maybeSingle();
        slug = (art as any)?.categories?.slug ?? null;
      }

      let chosen: Popup | null = null;
      if (slug) {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
        if (cat) {
          const { data } = await supabase
            .from("newsletter_popups").select("*")
            .eq("scope", "category").eq("category_id", (cat as any).id).eq("enabled", true).maybeSingle();
          chosen = (data as Popup) ?? null;
        }
      }
      if (!chosen) {
        const { data } = await supabase
          .from("newsletter_popups").select("*").eq("scope", "global").eq("enabled", true).maybeSingle();
        chosen = (data as Popup) ?? null;
      }
      if (!cancelled) {
        setPopup(chosen);
        setOpen(false);
        setDone(false);
      }
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  // Time + scroll trigger — once ever per device (localStorage)
  useEffect(() => {
    if (!popup) return;
    if (typeof window === "undefined") return;
    // Global "seen" flag — do not show again on this device once dismissed/subscribed.
    if (localStorage.getItem("np:seen") === "1") return;
    const pct = (popup.scroll_trigger_pct ?? 60) / 100;
    // Require both: user has been around a bit AND actually scrolled.
    const MIN_MS = 45_000;
    const startedAt = Date.now();
    let shown = false;
    const maybeShow = () => {
      if (shown) return;
      const scrolledEnough = window.scrollY > window.innerHeight * pct;
      const stayedLongEnough = Date.now() - startedAt > MIN_MS;
      if (scrolledEnough && stayedLongEnough) {
        shown = true;
        setOpen(true);
        window.removeEventListener("scroll", maybeShow);
        clearInterval(interval);
      }
    };
    const interval = window.setInterval(maybeShow, 5_000);
    window.addEventListener("scroll", maybeShow, { passive: true });
    return () => {
      window.removeEventListener("scroll", maybeShow);
      clearInterval(interval);
    };
  }, [popup]);

  function dismiss() {
    if (!popup) return;
    setOpen(false);
    if (typeof window !== "undefined") {
      // Never show again on this device.
      localStorage.setItem("np:seen", "1");
    }
  }

  if (!popup || !open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto bg-foreground text-background shadow-2xl relative overflow-hidden">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 size-8 grid place-items-center text-background/70 hover:text-background"
        >
          <X className="size-4" />
        </button>
        <div className="p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-5 items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-background/60 mb-2">
              {popup.scope === "category" ? "Category newsletter" : "Newsletter"}
            </p>
            <h3 className="font-display text-2xl md:text-3xl leading-tight">{popup.headline}</h3>
            {popup.body && <p className="text-sm opacity-80 mt-2 max-w-prose">{popup.body}</p>}
          </div>
          {done ? (
            <p className="text-sm">Thanks — we'll be in touch.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setDone(true);
                setTimeout(dismiss, 1500);
              }}
              className="flex w-full md:w-auto bg-background text-foreground"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 text-sm w-full md:w-72 bg-transparent outline-none"
              />
              <button className="px-5 py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
                <Send className="size-3.5" /> {popup.cta_label || "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
