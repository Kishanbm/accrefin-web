import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Article } from "@/lib/queries";
import { formatDate } from "@/lib/queries";

type Variant = "default" | "compact" | "tall";

const FALLBACK =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80";

export function ArticleCard({ article, variant = "default" }: { article: Article; variant?: Variant }) {
  const cat = article.category;
  const aspect = variant === "tall" ? "aspect-[4/5]" : variant === "compact" ? "aspect-[4/3]" : "aspect-video";
  const titleSize =
    variant === "compact" ? "text-lg" : variant === "tall" ? "text-xl" : "text-2xl";

  const [src, setSrc] = useState(article.cover_image_url || FALLBACK);

  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="group block"
    >
      <div
        className={`w-full ${aspect} bg-surface outline-1 -outline-offset-1 outline-black/5 overflow-hidden mb-4`}
      >
        <img
          src={src}
          alt={article.title}
          loading="lazy"
          onError={() => src !== FALLBACK && setSrc(FALLBACK)}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center gap-3 mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {cat && <span className="text-primary">{cat.name}</span>}
        <span>•</span>
        <span>{article.read_time_minutes} min read</span>
      </div>
      <h3
        className={`font-display ${titleSize} leading-tight text-balance group-hover:text-primary transition-colors`}
      >
        {article.title}
      </h3>
      {variant !== "compact" && article.excerpt && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{article.author_name}</span>
        <span>•</span>
        <span>{formatDate(article.published_at)}</span>
      </div>
    </Link>
  );
}
