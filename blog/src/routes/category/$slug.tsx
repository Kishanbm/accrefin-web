import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  articlesByCategoryQuery,
  adsQuery,
  mostDiscussedQuery,
  formatDate,
  type Article,
} from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { AdSlotCard } from "@/components/ad-slot";
import { ArticleCard } from "@/components/article-card";

const FALLBACK =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      articlesByCategoryQuery(params.slug),
    );
    if (!data.category) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.category
      ? [
          { title: `${loaderData.category.name} — ACCREFIN` },
          { name: "description", content: loaderData.category.description ?? "" },
        ]
      : [],
  }),
  component: CategoryPage,
});

function ListItem({ article, index }: { article: Article; index?: number }) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="group flex gap-4 items-start"
    >
      <div className="relative w-28 h-20 shrink-0 bg-surface overflow-hidden">
        {typeof index === "number" && (
          <span className="absolute top-1 left-1 z-10 bg-background/90 text-foreground font-display text-xs px-1.5 py-0.5">
            {index + 1}
          </span>
        )}
        <img
          src={article.cover_image_url || FALLBACK}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK;
          }}
          alt={article.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {article.category && <span>{article.category.name}</span>}
          <span>·</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}

function CategoryPage() {
  const { category, articles } = Route.useLoaderData();
  const { data: ads = [] } = useQuery(adsQuery);
  const { data: discussed = [] } = useQuery(
    mostDiscussedQuery(category?.id ?? null, 5),
  );
  const banner = ads.find((a) => a.slot_key === "home_banner");

  const featured = articles[0];
  const latest = articles.slice(1, 6);
  const rest = articles.slice(6);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="border-b border-border pb-8 mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-3">
          Section
        </p>
        <h1 className="font-display text-5xl md:text-6xl italic leading-none">
          {category!.name}
        </h1>
        {category!.description && (
          <p className="text-base text-muted-foreground mt-5 max-w-2xl leading-relaxed">
            {category!.description}
          </p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">
          No articles yet in this section.
        </p>
      ) : (
        <>
          {/* Featured + Latest + Most Discussed */}
          <section className="grid lg:grid-cols-12 gap-8 mb-16">
            {/* Featured */}
            <div className="lg:col-span-6">
              <p className="font-mono text-[11px] uppercase tracking-widest mb-4">
                Featured
              </p>
              {featured && (
                <Link
                  to="/article/$slug"
                  params={{ slug: featured.slug }}
                  className="group relative block overflow-hidden bg-surface"
                >
                  <div className="aspect-[4/5] w-full">
                    {featured.cover_image_url && (
                      <img
                        src={featured.cover_image_url}
                        alt={featured.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                    <h2 className="font-display text-2xl md:text-3xl leading-tight mb-3 text-balance">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-sm text-white/80 line-clamp-2 mb-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/80">
                      <span>{formatDate(featured.published_at)}</span>
                      <span>·</span>
                      <span>by {featured.author_name}</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Latest Posts */}
            <div className="lg:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-widest mb-4">
                Latest Posts
              </p>
              <div className="space-y-5">
                {latest.map((a: Article) => (
                  <ListItem key={a.id} article={a} />
                ))}
              </div>
            </div>

            {/* Most Discussed */}
            <div className="lg:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-widest mb-4">
                Most Discussed
              </p>
              <div className="space-y-5">
                {discussed.map((a, i) => (
                  <ListItem key={a.id} article={a} index={i} />
                ))}
              </div>
            </div>
          </section>

          {banner && (
            <section className="mb-16">
              <AdSlotCard ad={banner} variant="banner" />
            </section>
          )}

          {rest.length > 0 && (
            <>
              <h3 className="font-display text-2xl italic border-b border-border pb-3 mb-8">
                More in {category!.name}
              </h3>
              <section className="grid md:grid-cols-3 gap-x-8 gap-y-12">
                {rest.map((a: Article) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
