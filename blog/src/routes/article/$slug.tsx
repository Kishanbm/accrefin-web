import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  articleBySlugQuery,
  relatedArticlesQuery,
  latestArticlesQuery,
  adsQuery,
  commentsQuery,
  bannersQuery,
  formatDate,
  type Article,
} from "@/lib/queries";
import { ArticleCard } from "@/components/article-card";
import { AdSlotCard } from "@/components/ad-slot";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { ShareModal } from "@/components/share-modal";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  Quote,
  Share2,
  Twitter,
} from "lucide-react";

export const Route = createFileRoute("/article/$slug")({
  loader: async ({ context, params }) => {
    const article = await context.queryClient.ensureQueryData(
      articleBySlugQuery(params.slug),
    );
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — ACCREFIN` },
          { name: "description", content: loaderData.article.excerpt ?? "" },
          { property: "og:title", content: loaderData.article.title },
          { property: "og:image", content: loaderData.article.cover_image_url ?? "" },
        ]
      : [],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData() as { article: Article };
  const { data: related = [] } = useQuery(
    relatedArticlesQuery(article.category_id, article.id),
  );
  const { data: latest = [] } = useQuery(latestArticlesQuery(5));
  const { data: ads = [] } = useQuery(adsQuery);
  const { data: comments = [], refetch: refetchComments } = useQuery(
    commentsQuery(article.id),
  );
  const { data: banners = [] } = useQuery(bannersQuery);
  const sidebarAd = ads.find((a) => a.slot_key === "homepage_sidebar");
  const inlineAd = ads.find((a) => a.slot_key === "article_inline");
  const topNews = latest.filter((a) => a.id !== article.id).slice(0, 5);
  const [shareOpen, setShareOpen] = useState(false);
  const [tags, setTags] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
    (async () => {
      const { data } = await supabase
        .from("article_tags").select("tags(id,slug,name)").eq("article_id", article.id);
      setTags(((data ?? []) as any[]).map((r) => r.tags).filter(Boolean));
    })();
  }, [article.id]);

  return (
    <article className="bg-background">
      {/* PROGRESS / BREADCRUMB BAR */}
      <div className="sticky top-14 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center gap-3 text-xs overflow-x-auto whitespace-nowrap">
          <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <span className="text-muted-foreground">/</span>
          {article.category && (
            <>
              <Link
                to="/category/$slug"
                params={{ slug: article.category.slug }}
                className="text-muted-foreground hover:text-primary"
              >
                {article.category.name}
              </Link>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          <span className="font-medium truncate">{article.title}</span>
        </div>
      </div>

      {/* COMPACT HEADER — title left, top news right, image below — all above the fold */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10">
        {/* Social rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-3 items-center">
            <ShareIcon href={article.facebook_url} label="Facebook"><Facebook className="size-4" /></ShareIcon>
            <ShareIcon href={article.twitter_url} label="Twitter"><Twitter className="size-4" /></ShareIcon>
            <ShareIcon href={article.linkedin_url} label="LinkedIn"><Linkedin className="size-4" /></ShareIcon>
            <ShareIcon href={article.instagram_url} label="Instagram"><Instagram className="size-4" /></ShareIcon>
            <CopyLink />
            <button
              onClick={() => setShareOpen(true)}
              aria-label="Share"
              className="size-10 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </aside>

        {/* Main column: title, excerpt, meta, image */}
        <div className="min-w-0">
          {article.category && (
            <Link
              to="/category/$slug"
              params={{ slug: article.category.slug }}
              className="font-mono text-[11px] text-primary tracking-widest uppercase border border-primary/30 rounded-full px-3 py-1 inline-block"
            >
              {article.category.name}
            </Link>
          )}
          <h1 className="font-display text-3xl md:text-5xl leading-[1.05] mt-4 text-balance">
            {article.title}
          </h1>
          {(article.subtitle || article.excerpt) && (
            <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
              {article.subtitle || article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{article.author_name}</span>
            <span>•</span>
            <span>{formatDate(article.published_at)}</span>
            <span>•</span>
            <span>{article.read_time_minutes} min read</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3" /> {comments.length} comments
            </span>
          </div>

          {/* Mobile social rail */}
          <div className="lg:hidden flex gap-3 mt-5">
            <ShareIcon href={article.facebook_url} label="Facebook"><Facebook className="size-4" /></ShareIcon>
            <ShareIcon href={article.twitter_url} label="Twitter"><Twitter className="size-4" /></ShareIcon>
            <ShareIcon href={article.linkedin_url} label="LinkedIn"><Linkedin className="size-4" /></ShareIcon>
            <ShareIcon href={article.instagram_url} label="Instagram"><Instagram className="size-4" /></ShareIcon>
            <CopyLink />
            <button onClick={() => setShareOpen(true)} aria-label="Share" className="size-10 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center">
              <Share2 className="size-4" />
            </button>
          </div>

          {/* COVER — properly sized */}
          {article.cover_image_url && (
            <div className="w-full aspect-video bg-surface overflow-hidden mt-6 md:mt-8">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="size-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Top News rail — visible above the fold */}
        <aside className="lg:block">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-widest border-b border-border pb-3 mb-4">
                Top News
              </h3>
              <ol className="space-y-4">
                {topNews.map((a, i) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="font-display text-2xl text-muted-foreground w-6 shrink-0">
                      {i + 1}
                    </span>
                    <Link
                      to="/article/$slug"
                      params={{ slug: a.slug }}
                      className="group flex gap-3 min-w-0"
                    >
                      <div className="w-16 h-14 bg-surface overflow-hidden shrink-0">
                        {a.cover_image_url && (
                          <img src={a.cover_image_url} alt={a.title} className="size-full object-cover" />
                        )}
                      </div>
                      <p className="text-sm leading-snug group-hover:text-primary line-clamp-3">
                        {a.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>

      {/* BODY THREE COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10">
        <div className="hidden lg:block" />


        {/* MIDDLE: body */}
        <div className="min-w-0">
          <div className="prose-editorial">
            {/^\s*</.test(article.body || "") ? (
              <div dangerouslySetInnerHTML={{ __html: article.body || "" }} />
            ) : (
              <ReactMarkdown>{article.body || article.excerpt || ""}</ReactMarkdown>
            )}
          </div>


          {/* KEY MOMENTS */}
          {article.key_moments.length > 0 && (
            <div className="mt-14 p-8 bg-surface border border-border">
              <h3 className="font-display text-2xl mb-6">Key Moments</h3>
              <ol className="space-y-5">
                {article.key_moments.map((m, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="font-mono text-xs text-primary pt-1 w-6">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <p className="font-display text-lg">{m.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{m.body}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground self-center" />
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* SECONDARY IMAGE */}
          {article.secondary_image_url && (
            <figure className="my-14">
              <img
                src={article.secondary_image_url}
                alt=""
                className="w-full aspect-[16/9] object-cover"
              />
              <figcaption className="text-[11px] uppercase tracking-widest text-muted-foreground mt-3">
                Image · {article.category?.name ?? "Editorial"}
              </figcaption>
            </figure>
          )}

          {/* PULL QUOTE */}
          {article.pull_quote && (
            <blockquote className="my-14 p-8 bg-surface border-l-4 border-primary">
              <Quote className="size-6 text-primary mb-3" />
              <p className="font-display text-2xl leading-snug">{article.pull_quote}</p>
            </blockquote>
          )}

          {/* INLINE AD */}
          {inlineAd && (
            <div className="my-12">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Advertisement</p>
              <AdSlotCard ad={inlineAd} variant="banner" />
            </div>
          )}

          {/* READ ALSO — prominent, category-specific */}
          {related.length > 0 && (
            <div className="my-16 p-8 md:p-10 bg-gradient-to-br from-primary/5 via-surface to-surface border-2 border-primary/20">
              <div className="flex items-end justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-primary">Read also in {article.category?.name ?? "this category"}</p>
                  <h3 className="font-display text-3xl mt-1">More stories like this</h3>
                </div>
                {article.category && (
                  <Link to="/category/$slug" params={{ slug: article.category.slug }} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary whitespace-nowrap">
                    See all →
                  </Link>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {related.slice(0, 4).map((r) => (
                  <Link key={r.id} to="/article/$slug" params={{ slug: r.slug }} className="flex gap-4 group">
                    <div className="w-28 aspect-video bg-background overflow-hidden shrink-0">
                      {r.cover_image_url && (
                        <img src={r.cover_image_url} alt={r.title} className="size-full object-cover group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base group-hover:text-primary line-clamp-3">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1.5 font-mono uppercase tracking-wider">{formatDate(r.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* QUESTIONS ANSWERED */}
          {article.questions.length > 0 && (
            <div className="my-14 p-8 bg-surface border border-border">
              <h3 className="font-display text-2xl mb-6">Questions Answered</h3>
              <ul className="space-y-5">
                {article.questions.map((q, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="size-2 rounded-full bg-primary mt-2.5 shrink-0" />
                    <div>
                      <p className="font-display text-base">{q.q}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{q.a}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAGS / HASHTAGS */}
          {tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t.id}
                    to="/tag/$slug"
                    params={{ slug: t.slug }}
                    className="inline-flex items-center px-3 py-1.5 bg-surface hover:bg-primary hover:text-primary-foreground border border-border text-xs font-medium transition"
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AUTHOR / NEXT UP */}
          <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Written by</p>
              <p className="font-display text-2xl mt-1">{article.author_name}</p>
            </div>
            <Link to="/" className="text-xs font-bold uppercase tracking-widest border-b border-foreground pb-0.5">
              ← More stories
            </Link>
          </div>

          {/* NEWSLETTER */}
          <div className="my-14 p-10 bg-foreground text-background flex flex-col md:flex-row md:items-end gap-6">
            <div className="md:flex-1">
              <h3 className="font-display text-3xl leading-tight">Keep up to date with the most important stories.</h3>
              <p className="text-sm opacity-70 mt-3">A weekly dispatch from ACCREFIN — no spam, just the work worth your attention.</p>
            </div>
            <form className="flex w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="bg-transparent border border-background/30 px-4 py-3 text-sm w-full md:w-72 placeholder:text-background/40 outline-none focus:border-background"
              />
              <button className="px-5 py-3 bg-background text-foreground text-xs font-bold uppercase tracking-widest">
                Subscribe
              </button>
            </form>
          </div>

          {/* COMMENTS */}
          <CommentsSection articleId={article.id} comments={comments} onPosted={() => refetchComments()} />
        </div>

        {/* RIGHT: sticky sidebar ad & banners */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-8">
            {sidebarAd && <AdSlotCard ad={sidebarAd} />}
            {banners.map((b) => (
              <a key={b.id} href={b.link_url || "#"} target="_blank" rel="noopener noreferrer" className="block group">
                <img src={b.image_url} alt={b.title || ""} className="w-full h-auto border border-border group-hover:opacity-90 transition-opacity" />
                {b.title && <p className="text-xs text-muted-foreground mt-2 font-medium">{b.title}</p>}
              </a>
            ))}
          </div>
        </aside>
      </div>

      {/* RECOMMENDED FOR YOU */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24 pb-24">
          <div className="flex items-end justify-between border-b border-border pb-3 mb-8">
            <h3 className="font-display text-3xl">Recommended for you</h3>
            <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground">More →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        article={{
          title: article.title,
          excerpt: article.excerpt,
          cover_image_url: article.cover_image_url,
          category: article.category,
        }}
        url={shareUrl}
      />
    </article>
  );
}

function ShareIcon({ href, label, children }: { href: string | null; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
    >
      {children}
    </a>
  );
}

function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      aria-label="Copy link"
      onClick={() => {
        if (typeof window === "undefined") return;
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
    >
      <LinkIcon className="size-4" />
      {copied && <span className="sr-only">Link copied</span>}
    </button>
  );
}

function CommentsSection({
  articleId,
  comments,
  onPosted,
}: {
  articleId: string;
  comments: { id: string; author_name: string; body: string; created_at: string }[];
  onPosted: () => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("Please sign in to leave a comment.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      author_name: name || user.email?.split("@")[0] || "Reader",
      body,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setBody("");
    setName("");
    onPosted();
    qc.invalidateQueries({ queryKey: ["comments", articleId] });
  }

  return (
    <section className="mt-14 border-t border-border pt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full py-4 bg-surface border border-border flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest"
      >
        View Comments ({comments.length}) {open ? "▴" : "▾"}
      </button>

      {open && (
        <>
          <ul className="mt-8 space-y-8">
            {comments.map((c) => (
              <li key={c.id} className="border-b border-border pb-6">
                <p className="text-base leading-relaxed">{c.body}</p>
                <p className="text-[11px] text-muted-foreground mt-2 font-mono">
                  by <span className="text-foreground font-semibold">{c.author_name}</span> ·{" "}
                  {new Date(c.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="text-sm text-muted-foreground">Be the first to comment.</li>
            )}
          </ul>

          <form onSubmit={submit} className="mt-10 p-6 bg-surface border border-border">
            <h4 className="font-display text-2xl mb-4">Leave a Reply</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Your email address will not be published. Required fields are marked *
            </p>
            <textarea
              required
              placeholder="Comment *"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full ipt h-32 mb-3"
            />
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full ipt mb-4"
            />
            {error && <p className="text-xs text-destructive mb-3">{error}</p>}
            {!user && (
              <p className="text-xs text-muted-foreground mb-3">
                <Link to="/auth" className="underline">Sign in</Link> to post a comment.
              </p>
            )}
            <button
              disabled={submitting}
              className="px-5 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Comment"}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
