import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { categoriesQuery } from "@/lib/queries";
import { BeehiivSubscribeForm } from "@/components/beehiiv-subscribe-form";

export function SiteFooter({ siteName }: { siteName?: string }) {
  const displaySiteName = siteName ? siteName.replace(/accrefin/gi, "ACCREFIN") : "ACCREFIN";
  const brand = displaySiteName.toLowerCase().replace(/\s+/g, "");
  const { data: categories = [] } = useQuery(categoriesQuery);

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="font-display text-3xl font-bold tracking-tighter block mb-6 uppercase">
            {displaySiteName}
          </span>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Expert guides on loans, credit, insurance, and smarter money decisions.
          </p>
        </div>
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest">Sections</p>
          <ul className="text-sm space-y-2">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-primary transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest">Stay updated</p>
          <Link to="/newsletter" className="inline-block text-xs font-bold uppercase tracking-widest hover:text-primary">
            Visit the Newsletter →
          </Link>
          <BeehiivSubscribeForm id="footer-subscribe" className="justify-start max-w-full" />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/" className="font-display text-lg font-extrabold tracking-tight">
              {brand}<span className="text-foreground">.</span>
            </Link>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {brand}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/newsletter" className="hover:text-foreground">Newsletter</Link>
            <Link to="/search" search={{ q: "" }} className="hover:text-foreground">Archive</Link>
            <Link to="/" className="hover:text-foreground">About</Link>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><Twitter className="size-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="size-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="size-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
