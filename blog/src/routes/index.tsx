import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  adsQuery,
  formatDate,
  latestArticlesQuery,
  categoriesQuery,
  bannersQuery,
  type Article,
} from "@/lib/queries";
import { AdSlotCard } from "@/components/ad-slot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blog — ACCREFIN" },
      {
        name: "description",
        content:
          "Expert insights on loans, credit, insurance, and personal finance.",
      },
    ],
  }),
  loader: async ({ context: { queryClient } }) => {
    // Pre-fetch all data before the route renders so we don't show an empty shell
    await Promise.all([
      queryClient.ensureQueryData(latestArticlesQuery(30)),
      queryClient.ensureQueryData(adsQuery),
      queryClient.ensureQueryData(categoriesQuery),
      queryClient.ensureQueryData(bannersQuery),
    ]);
  },
  component: Home,
});

function Home() {
  const { data: latest = [] } = useQuery(latestArticlesQuery(30));
  const { data: ads = [] } = useQuery(adsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: banners = [] } = useQuery(bannersQuery);

  // Buckets by layout_size (with fallbacks so old articles still render)
  const hero =
    latest.find((a) => a.layout_size === "hero_large") ??
    latest.find((a) => a.featured) ??
    latest[0];

  const remaining = latest.filter((a) => a.id !== hero?.id);
  const spotlights = remaining.filter((a) => a.layout_size === "spotlight_single").slice(0, 3);
  const twoColArticles = remaining.filter((a) => a.layout_size === "two_col");
  const standard = remaining.filter(
    (a) =>
      a.layout_size !== "spotlight_single" &&
      a.layout_size !== "two_col" &&
      a.id !== hero?.id,
  );

  // Fallback fillers if admin hasn't tagged sizes yet
  const spotlightPool = spotlights.length ? spotlights : remaining.slice(0, 3);
  const twoColPool = twoColArticles.length ? twoColArticles : remaining.slice(3, 11);
  const standardPool = standard.length ? standard : remaining.slice(11, 20);

  const adSidebar = ads.find((a) => a.slot_key === "home_sidebar");
  const adBanner = ads.find((a) => a.slot_key === "home_banner");

  // Weave: hero → spotlight[0] → 2-col pair → banner ad → spotlight[1] → 2-col pair → sidebar row → spotlight[2] → latest grid
  const twoColRows: Article[][] = [];
  for (let i = 0; i < twoColPool.length; i += 2) {
    const pair = twoColPool.slice(i, i + 2);
    if (pair.length === 2) twoColRows.push(pair);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-24">
      {/* HERO */}
      {hero && <HeroBlock article={hero} sidebar={remaining.slice(0, 2)} adSidebar={adSidebar} />}

      {/* SPOTLIGHT 1 — full-width single card */}
      {spotlightPool[0] && (
        <SpotlightRow article={spotlightPool[0]} sectionLabel={categories[0]?.name ?? "Featured"} />
      )}

      {/* TWO-COLUMN ROW 1 */}
      {twoColRows[0] && <TwoColRow pair={twoColRows[0]} />}

      {/* FULL-WIDTH BANNER AD — YouTube style, edge-to-edge inside container */}
      <FullWidthAd ad={adBanner} />

      {/* SPOTLIGHT 2 */}
      {spotlightPool[1] && (
        <SpotlightRow article={spotlightPool[1]} sectionLabel="Editor's pick" reverse />
      )}

      {/* TWO-COLUMN ROW 2 */}
      {twoColRows[1] && <TwoColRow pair={twoColRows[1]} />}

      {/* Popular + sidebar ad row */}
      {standardPool.length > 0 && (
        <section className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <SectionHeader title="Most Popular" />
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
              {standardPool.slice(0, 4).map((a, i) => (
                <PopularItem key={a.id} article={a} index={i} />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 self-start space-y-6">
            <AdSlotCard ad={adSidebar} />
            {banners.map((b) => (
              <a key={b.id} href={b.link_url || "#"} target="_blank" rel="noopener noreferrer" className="block group">
                <img src={b.image_url} alt={b.title || ""} className="w-full h-auto border border-border group-hover:opacity-90 transition-opacity" />
                {b.title && <p className="text-xs text-muted-foreground mt-2 font-medium">{b.title}</p>}
              </a>
            ))}
          </aside>
        </section>
      )}

      {/* SPOTLIGHT 3 */}
      {spotlightPool[2] && (
        <SpotlightRow article={spotlightPool[2]} sectionLabel="Long read" />
      )}

      {/* TWO-COLUMN ROW 3 */}
      {twoColRows[2] && <TwoColRow pair={twoColRows[2]} />}

      {/* LATEST GRID */}
      {standardPool.length > 4 && (
        <section>
          <SectionHeader title="Latest" />
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {standardPool.slice(4, 13).map((a) => (
              <StandardCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/* ================= HERO ================= */
function HeroBlock({
  article,
  sidebar,
  adSidebar,
}: {
  article: Article;
  sidebar: Article[];
  adSidebar?: any;
}) {
  return (
    <section className="grid lg:grid-cols-12 gap-8">
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="lg:col-span-8 group block"
      >
        <div className="aspect-video w-full bg-surface overflow-hidden">
          {article.cover_image_url && (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          )}
        </div>
        <div className="pt-6">
          {article.category && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">
              {article.category.name}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.04] mb-4 text-balance group-hover:underline">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-base md:text-lg text-muted-foreground mb-3 max-w-3xl">
              {article.excerpt}
            </p>
          )}
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {formatDate(article.published_at)} · by {article.author_name}
          </p>
        </div>
      </Link>
      <aside className="lg:col-span-4 flex flex-col gap-6">
        {sidebar.map((a) => (
          <Link
            key={a.id}
            to="/article/$slug"
            params={{ slug: a.slug }}
            className="group block"
          >
            {a.cover_image_url && (
              <div className="aspect-[4/3] bg-surface overflow-hidden mb-3">
                <img
                  src={a.cover_image_url}
                  alt={a.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            {a.category && (
              <p className="font-mono text-[9px] text-primary uppercase tracking-widest mb-1">
                {a.category.name}
              </p>
            )}
            <h3 className="font-display text-lg leading-tight group-hover:underline">
              {a.title}
            </h3>
          </Link>
        ))}
        {adSidebar && <AdSlotCard ad={adSidebar} />}
      </aside>
    </section>
  );
}

/* ================= SPOTLIGHT (single, full-width card) ================= */
function SpotlightRow({
  article,
  sectionLabel,
  reverse = false,
}: {
  article: Article;
  sectionLabel: string;
  reverse?: boolean;
}) {
  return (
    <section>
      <SectionHeader title={sectionLabel} />
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className={`group grid lg:grid-cols-[3fr_2fr] gap-0 border border-border bg-surface overflow-hidden ${
          reverse ? "lg:[&>a:first-child]:order-2" : ""
        }`}
      >
        <div className={`aspect-[21/9] lg:aspect-auto lg:min-h-[480px] overflow-hidden ${reverse ? "lg:order-2" : ""}`}>
          {article.cover_image_url && (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {article.category && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
              {article.category.name}
            </p>
          )}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] mb-5 text-balance group-hover:underline">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-base text-muted-foreground mb-5 line-clamp-4">
              {article.excerpt}
            </p>
          )}
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatDate(article.published_at)} · by {article.author_name}
          </p>
        </div>
      </Link>
    </section>
  );
}

/* ================= TWO-COLUMN ROW ================= */
function TwoColRow({ pair }: { pair: Article[] }) {
  return (
    <section className="grid md:grid-cols-2 gap-8">
      {pair.map((a) => (
        <Link
          key={a.id}
          to="/article/$slug"
          params={{ slug: a.slug }}
          className="group block"
        >
          {a.cover_image_url && (
            <div className="aspect-[4/3] bg-surface overflow-hidden mb-5">
              <img
                src={a.cover_image_url}
                alt={a.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          )}
          {a.category && (
            <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">
              {a.category.name}
            </p>
          )}
          <h3 className="font-display text-2xl md:text-3xl leading-tight mb-3 text-balance group-hover:underline">
            {a.title}
          </h3>
          {a.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
          )}
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatDate(a.published_at)} · by {a.author_name}
          </p>
        </Link>
      ))}
    </section>
  );
}

/* ================= FULL-WIDTH BANNER AD ================= */
function FullWidthAd({ ad }: { ad?: any }) {
  return (
    <section className="-mx-6 md:-mx-6">
      <div className="bg-muted-surface border-y border-border py-8 md:py-10">
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Advertisement
        </p>
        <div className="max-w-6xl mx-auto px-6">
          {ad ? (
            <a
              href={ad.cta_url || "#"}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block relative bg-foreground text-background overflow-hidden group aspect-[970/250] md:aspect-[970/180]"
            >
              {ad.image_url ? (
                <>
                  <img
                    src={ad.image_url}
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 size-full flex flex-col justify-center p-8 md:p-12 text-white max-w-2xl">
                    <h4 className="font-display text-2xl md:text-4xl leading-tight mb-2">{ad.title}</h4>
                    {ad.body && <p className="text-sm md:text-base opacity-80">{ad.body}</p>}
                    {ad.cta_text && (
                      <span className="mt-4 inline-block w-fit px-5 py-2 border border-white/40 text-xs font-bold uppercase tracking-widest">
                        {ad.cta_text}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="size-full grid md:grid-cols-[1fr_auto] items-center gap-6 p-8 md:p-12">
                  <div>
                    <h4 className="font-display text-3xl md:text-4xl mb-2">{ad.title}</h4>
                    {ad.body && <p className="text-sm text-background/70">{ad.body}</p>}
                  </div>
                  {ad.cta_text && (
                    <span className="px-6 py-3 border border-background/40 text-xs font-bold uppercase tracking-widest">
                      {ad.cta_text}
                    </span>
                  )}
                </div>
              )}
            </a>
          ) : (
            <div className="aspect-[970/180] bg-background border border-dashed border-border grid place-items-center text-xs text-muted-foreground uppercase tracking-widest">
              Full-width banner · 970×250 · YouTube-style slot
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= SUPPORT ================= */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-baseline justify-between mb-8 border-b border-border pb-3">
      <h2 className="font-display text-3xl md:text-4xl italic">{title}</h2>
    </div>
  );
}

function PopularItem({ article, index }: { article: Article; index: number }) {
  return (
    <Link to="/article/$slug" params={{ slug: article.slug }} className="group block">
      <div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-muted-foreground uppercase">
        <span className="text-primary">0{index + 1}.</span>
        {article.category && <span>{article.category.name}</span>}
      </div>
      <h3 className="font-display text-2xl md:text-3xl leading-[1.1] mb-3 group-hover:underline">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}

function StandardCard({ article }: { article: Article }) {
  return (
    <Link to="/article/$slug" params={{ slug: article.slug }} className="group block">
      {article.cover_image_url && (
        <div className="aspect-[4/5] bg-surface overflow-hidden mb-4">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      {article.category && (
        <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">
          {article.category.name}
        </p>
      )}
      <h3 className="font-display text-xl leading-tight mb-2 group-hover:underline">
        {article.title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {formatDate(article.published_at)}
      </p>
    </Link>
  );
}
