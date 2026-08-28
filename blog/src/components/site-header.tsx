import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Search, Sun, User as UserIcon, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/queries";
import { useAuth } from "@/lib/use-auth";
import { CategoryMegaMenu } from "@/components/category-mega-menu";

export function SiteHeader({ logoUrl, siteName }: { logoUrl?: string; siteName?: string }) {
  const displaySiteName = siteName ? siteName.replace(/accrefin/gi, "ACCREFIN") : "ACCREFIN";
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [term, setTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Categories that are visible in navigation.
  const visible = categories.filter((c) => c.visible !== false);
  const primary = visible.filter((c) => c.nav_position === "primary");
  const more = visible.filter((c) => c.nav_position !== "primary");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    if (!q) {
      navigate({ to: "/search", search: { q: "" } });
      return;
    }
    navigate({ to: "/search", search: { q } });
    setMobileOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top strip: brand + search */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-6">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-tighter shrink-0 flex items-center gap-3 uppercase">
          {logoUrl ? <img src={logoUrl} alt={displaySiteName} className="h-8 md:h-10 w-auto" /> : displaySiteName}
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden md:flex border border-border bg-surface focus-within:border-primary transition-colors"
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search articles, categories, authors…"
            className="flex-1 bg-transparent px-5 py-3 outline-none text-sm"
          />
          <button
            type="submit"
            className="px-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border-l border-border cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="size-4" />
            Search
          </button>
        </form>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Link
            to="/search"
            search={{ q: "" }}
            className="md:hidden p-2 hover:bg-surface rounded-full"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-surface rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          {user ? (
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="p-2 hover:bg-surface rounded-full transition-colors"
              aria-label="Account"
            >
              <UserIcon className="size-4" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-3 md:px-4 py-1.5 bg-foreground text-background text-[11px] md:text-xs font-bold rounded-full uppercase tracking-wider"
            >
              Sign in
            </Link>
          )}
          <button
            className="md:hidden p-2 hover:bg-surface rounded-full"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Bottom strip: nav (desktop) */}
      <div className="border-t border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
          <a
            href="/"
            className="py-3 hover:text-primary transition-colors flex items-center"
          >
            Loans
          </a>
          {primary.map((c) => (
            <CategoryMegaMenu
              key={c.id}
              slug={c.slug}
              name={c.name}
              description={c.description}
            />
          ))}
          <Link
            to="/blogs"
            className="py-3 hover:text-primary transition-colors flex items-center"
          >
            Blogs
          </Link>
          <Link
            to="/newsletter"
            className="py-3 hover:text-primary transition-colors flex items-center"
          >
            Newsletter
          </Link>
          {more.length > 0 && (
            <div className="group relative py-3">
              <span className="cursor-default hover:text-primary transition-colors">More</span>
              <div className="absolute top-full left-0 w-[640px] bg-background border border-border shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all p-5 grid grid-cols-3 gap-2 z-50">
                {more.map((c) => (
                  <Link
                    key={c.id}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="block px-3 py-2 text-xs hover:bg-surface hover:text-primary normal-case"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background max-h-[70vh] overflow-y-auto">
          <form onSubmit={submitSearch} className="p-4 flex border-b border-border">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-surface px-3 py-2 text-sm outline-none border border-border"
            />
            <button className="px-4 bg-foreground text-background text-xs font-bold uppercase">Go</button>
          </form>
          <div className="p-2 grid grid-cols-2 gap-1">
            <a
              href="/"
              className="px-3 py-2 text-xs uppercase tracking-wider hover:bg-surface font-semibold text-primary"
            >
              Loans
            </a>
            {visible.map((c) => (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="px-3 py-2 text-xs uppercase tracking-wider hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/blogs"
              className="px-3 py-2 text-xs uppercase tracking-wider hover:bg-surface font-semibold text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/newsletter"
              className="px-3 py-2 text-xs uppercase tracking-wider hover:bg-surface font-semibold text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Newsletter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
