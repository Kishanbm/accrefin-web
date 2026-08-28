import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { latestByCategorySlugQuery, formatDate } from "@/lib/queries";

const FALLBACK =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80";

export function CategoryMegaMenu({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { data: articles = [] } = useQuery({
    ...latestByCategorySlugQuery(slug, 4),
    enabled: open,
  });

  return (
    <div
      className="group relative py-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to="/category/$slug"
        params={{ slug }}
        className="hover:text-primary transition-colors"
      >
        {name}
      </Link>
      <div
        className={`absolute top-full left-0 w-[760px] bg-background border border-border shadow-2xl transition-all p-6 z-50 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-baseline justify-between mb-5 border-b border-border pb-3">
          <div>
            <p className="font-mono text-[10px] text-primary uppercase tracking-widest">
              {name}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground normal-case font-normal mt-1 max-w-md">
                {description}
              </p>
            )}
          </div>
          <Link
            to="/category/$slug"
            params={{ slug }}
            className="text-[11px] font-bold uppercase tracking-widest border-b border-foreground pb-0.5"
          >
            View all
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-xs text-muted-foreground normal-case py-8 text-center">
            Loading latest stories…
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {articles.map((a) => (
              <Link
                key={a.id}
                to="/article/$slug"
                params={{ slug: a.slug }}
                className="block group/card"
              >
                <div className="aspect-[4/3] bg-surface overflow-hidden mb-2">
                  <img
                    src={a.cover_image_url || FALLBACK}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK;
                    }}
                    alt={a.title}
                    className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                </div>
                <h4 className="font-display text-sm leading-tight normal-case line-clamp-2 group-hover/card:text-primary transition-colors">
                  {a.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 normal-case">
                  {formatDate(a.published_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
