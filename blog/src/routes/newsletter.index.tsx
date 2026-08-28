import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, TrendingUp } from "lucide-react";
import { latestArticlesQuery, categoriesQuery, formatDate, type Article } from "@/lib/queries";
import { BeehiivSubscribeForm } from "@/components/beehiiv-subscribe-form";

export const Route = createFileRoute("/newsletter/")({
  head: () => ({
    meta: [
      { title: "Accrefin Newsletter — Weekly briefings for B2B builders" },
      {
        name: "description",
        content:
          "Deep-dive reviews of emerging developer platforms, architectural trade-offs, and enterprise B2B SaaS trends.",
      },
      { property: "og:title", content: "Accrefin Newsletter" },
      { property: "og:description", content: "Weekly briefings on developer tools, cybersecurity, AI, and B2B SaaS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const { data: articles = [] } = useQuery(latestArticlesQuery(24));
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");

  const filterCats = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) if (a.category?.name) set.add(a.category.name);
    return ["All", ...Array.from(set).slice(0, 6)];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (activeCat !== "All" && a.category?.name !== activeCat) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        a.title.toLowerCase().includes(needle) ||
        (a.excerpt ?? "").toLowerCase().includes(needle)
      );
    });
  }, [articles, activeCat, q]);

  const phoneCards = articles.slice(0, 3);
  const carouselCards = articles.slice(3, 9);

  return (
    <main className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
          ACCREFIN
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/newsletter" className="hover:text-foreground">Newsletter</Link>
          <Link to="/search" search={{ q: "" }} className="hover:text-foreground">Archive</Link>
          <Link to="/" className="hover:text-foreground">About</Link>
        </div>
        <a
          href="#subscribe"
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-xs font-semibold"
        >
          Subscribe Free
        </a>
      </div>

      {/* HERO + PHONE — first scroll */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-2 md:pt-4 pb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
          <span className="size-1.5 rounded-full bg-foreground animate-pulse" /> Updated today
        </span>
        <h1 className="mt-4 font-display font-extrabold tracking-tight text-3xl md:text-5xl leading-[1.05] text-balance max-w-4xl mx-auto">
          The intelligence layer for B2B software &amp; dev tools.
        </h1>

        <BeehiivSubscribeForm className="mt-6 w-full max-w-[450px] mx-auto" />

        {/* Phone + overlapping color cards */}
        <div className="relative mt-4 md:mt-6">
          <div className="relative flex justify-center">
            <div className="relative z-10 w-[260px] sm:w-[290px] md:w-[320px] aspect-[9/19.5] rounded-[3rem] bg-neutral-900 p-[10px] shadow-[0_60px_100px_-40px] shadow-foreground/40 ring-1 ring-black/20">
              <div className="relative h-full w-full rounded-[2.6rem] bg-white overflow-hidden">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 h-6 w-24 rounded-full bg-neutral-900" />
                <div className="h-10 flex items-center justify-between px-6 text-[10px] font-semibold text-neutral-900">
                  <span>9:41</span>
                  <span>••• 􀋂 􀛨</span>
                </div>
                <div className="px-5 pb-6">
                  <h3 className="font-display font-bold text-lg text-neutral-900 text-left">This week in accrefin</h3>
                  <p className="mt-1 text-[11px] text-neutral-500 leading-relaxed text-left">
                    Your weekly briefing on B2B SaaS, dev tools and enterprise tech.
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {phoneCards.map((a, i) => (
                      <PhoneCard key={a.id} article={a} idx={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-x-0 bottom-[-2rem] md:bottom-[-2.5rem] z-20 pointer-events-none [perspective:1400px]"
              aria-hidden
            >
              <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 px-2 md:px-0">
                {carouselCards.map((a, i) => (
                  <CarouselCard key={a.id} article={a} idx={i} total={carouselCards.length} />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-24 md:mt-32">
            <p className="text-xs font-medium text-muted-foreground">Rated 4.9/5 by 4,900+ clients</p>
            <p className="mt-1 text-foreground text-lg tracking-widest">★★★★★</p>
          </div>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end mb-10">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                <TrendingUp className="size-3.5" /> Historic Library
              </p>
              <h2 className="mt-3 font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Inside accrefin archives
              </h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md">
                Check out our previous briefings from modern developer tools to scaling solutions.
              </p>
            </div>
            <div className="w-full md:w-96">
              <div className="flex items-center gap-2 rounded-full bg-muted/40 border border-border px-4 py-2.5">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search previous topics..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filterCats.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      activeCat === c
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.slice(0, 8).map((a, i) => (
              <ArchiveCard key={a.id} article={a} idx={i} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2 py-10 text-center">
                No briefings match that search yet.
              </p>
            )}
          </div>

          {categories.length > 0 && null}
        </div>
      </section>

      {/* WHY TECHQUAZ — pull quote */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Why accrefin?
          </p>
          <blockquote className="mt-8 font-display italic text-2xl md:text-4xl leading-[1.3] tracking-tight text-balance">
            &ldquo;We noticed that most enterprise tech newsletters are either thinly veiled PR pitches
            or high-level generalizations. Accrefin exists to give technical operators the real,
            objective, and specific trade-offs of B2B platforms and developer tools.&rdquo;
          </blockquote>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            — Accrefin Labs Editorial Team
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-24">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                FAQ
              </p>
              <h2 className="mt-3 font-display font-extrabold text-3xl md:text-4xl tracking-tight">
                Frequently asked questions.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Everything you need to know before subscribing. Still curious?{" "}
                <a href="mailto:hello@accrefin.com" className="underline underline-offset-4 hover:text-foreground">
                  Email the editors
                </a>
                .
              </p>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {FAQS.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PhoneCard({ article, idx }: { article: Article; idx: number }) {
  const cat = article.category?.name ?? "Tech";
  const initials = (article.author_name ?? "TQ").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm p-3">
      <div className="flex items-start gap-3">
        <div className="size-8 rounded-full bg-neutral-900 text-white grid place-items-center text-[10px] font-semibold shrink-0">
          {initials || "TQ"}
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-700">
            {cat}
          </span>
          <h4 className="mt-1.5 font-display font-bold text-[13px] leading-snug line-clamp-2 text-neutral-900">
            {article.title}
          </h4>
          <p className="mt-1 text-[11px] leading-snug text-neutral-500 line-clamp-2">
            {article.excerpt ?? "Weekly deep dive on the tools shaping modern engineering teams."}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400">
            <span>#{48 - idx} · {article.read_time_minutes ?? 4} min read</span>
            <ArrowRight className="size-3.5 text-neutral-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselCard({ article, idx, total }: { article: Article; idx: number; total: number }) {
  const mid = (total - 1) / 2;
  const offset = idx - mid;
  const rotY = offset * 10;
  const translateY = Math.abs(offset) * 10;
  const translateZ = -Math.abs(offset) * 25;
  return (
    <article
      className="relative rounded-2xl overflow-hidden bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5 aspect-[3/4] transition-transform duration-500"
      style={{
        transform: `perspective(1200px) rotateY(${rotY}deg) translateY(${translateY}px) translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {article.cover_image_url ? (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 p-2.5 md:p-3.5 flex flex-col justify-end text-white">
        <span className="self-start inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-neutral-900 backdrop-blur">
          {article.category?.name ?? "Tech"}
        </span>
        <h4 className="mt-2 font-display font-bold text-[11px] md:text-sm leading-tight line-clamp-3 drop-shadow">
          {article.title}
        </h4>
      </div>
    </article>
  );
}

function ArchiveCard({ article, idx }: { article: Article; idx: number }) {
  const cat = article.category?.name ?? "Tech";
  const momentum = 92 + ((idx * 3) % 8);
  return (
    <article className="rounded-2xl bg-muted/30 border border-border p-6 flex gap-5 transition-colors hover:bg-muted/50">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground">{formatDate(article.published_at)}</p>
        <h3 className="mt-2 font-display font-bold text-lg leading-snug line-clamp-2">{article.title}</h3>
        <p className="mt-2 text-[11px] text-muted-foreground">
          #{48 - idx} · {article.read_time_minutes ?? 4} min read
        </p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {article.excerpt ?? "A weekly deep-dive briefing from the accrefin editors."}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold rounded-full border border-border px-2 py-1">
            {momentum}% Momentum
          </span>
          <Link
            to="/article/$slug"
            params={{ slug: article.slug }}
            className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-70"
          >
            Read More <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
      <div className="w-32 shrink-0 hidden sm:block">
        <span className="inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border border-border">
          {cat}
        </span>
        <div className="mt-3 aspect-square rounded-xl overflow-hidden bg-muted">
          {article.cover_image_url ? (
            <img src={article.cover_image_url} alt={article.title} className="size-full object-cover" loading="lazy" />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </div>
      </div>
    </article>
  );
}

const FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly do I get when I subscribe?",
    a: "A weekly editorial briefing with deep dives on developer tools, B2B SaaS platforms, and enterprise architecture — no PR, no fluff, just objective trade-offs written by working engineers.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The core weekly briefing is free forever. We may launch a paid tier later with private teardowns and vendor comparisons, but the flagship newsletter stays free.",
  },
  {
    q: "How is accrefin different from other tech newsletters?",
    a: "Most enterprise tech newsletters are lightly rewritten press releases. We benchmark, install, and stress-test the tools ourselves, then publish the specific numbers and gotchas that actually matter for technical operators.",
  },
  {
    q: "Who writes it?",
    a: "The accrefin Labs editorial team — a mix of former staff engineers, platform leads, and B2B analysts. Every piece is reviewed by at least one practitioner before it ships.",
  },
  {
    q: "Can I sponsor or advertise?",
    a: "We accept a limited number of clearly-labelled sponsor slots per issue. Editorial coverage is never for sale. Email hello@accrefin.com for the current rate card.",
  },
  {
    q: "How do I unsubscribe?",
    a: "One click at the bottom of any issue. No dark patterns, no retention emails, no hard feelings.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-6 text-left group"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-base md:text-lg leading-snug group-hover:opacity-80">
          {q}
        </span>
        <span className="shrink-0 mt-1 size-7 rounded-full border border-border grid place-items-center transition-transform">
          {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed pr-10">{a}</p>
        </div>
      </div>
    </div>
  );
}

