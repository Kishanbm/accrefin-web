import React, { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import { formatBlogDate, type BlogPost } from "./blogPosts";
import { fetchCategories, fetchPublishedPost, fetchPublishedPosts } from "./supabaseCms";
import { listAds, listBanners } from "./cmsStore";
import { BlogAdCard, DEFAULT_SIDEBAR_AD } from "./BlogAdCard";
import { BlogCategoryNav } from "./BlogCategoryNav";
import { bodyFont, headingFont } from "./blogTheme";
import "./cms/cms-editor.css";

const COMMENTS_KEY = "accrefin_blog_comments";

type Comment = { id: string; slug: string; author_name: string; body: string; created_at: string };

function readComments(slug: string): Comment[] {
  try {
    const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]") as Comment[];
    return all.filter((c) => c.slug === slug);
  } catch {
    return [];
  }
}

function addComment(slug: string, author_name: string, body: string) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]") as Comment[];
    } catch {
      return [];
    }
  })();
  all.push({
    id: `${Date.now()}`,
    slug,
    author_name,
    body,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [latest, setLatest] = useState<BlogPost[]>([]);
  const [sidebarAd, setSidebarAd] = useState(DEFAULT_SIDEBAR_AD);
  const [banners, setBanners] = useState<{ id: string; image_url: string; link_url: string; title: string }[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categorySlug, setCategorySlug] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [found, all, cats] = await Promise.all([
        slug ? fetchPublishedPost(slug) : Promise.resolve(undefined),
        fetchPublishedPosts(),
        fetchCategories(),
      ]);
      if (cancelled) return;
      setPost(found);
      setLatest(all.filter((p) => p.slug !== slug).slice(0, 5));
      const sameCategory = all.filter((p) => p.slug !== slug && p.category === found?.category);
      setRelated((sameCategory.length > 0 ? sameCategory : all.filter((p) => p.slug !== slug)).slice(0, 4));
      const ads = listAds().filter((a) => a.active && (a.slot_key === "article_sidebar" || a.slot_key === "homepage_sidebar"));
      setSidebarAd(ads[0] || DEFAULT_SIDEBAR_AD);
      setBanners(listBanners());
      setCategorySlug(cats.find((c) => c.name === found?.category)?.slug);
      if (slug) setComments(readComments(slug));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!ready) return null;

  if (!post) {
    return (
      <section className="min-h-[60vh] bg-[#ffffff] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className={`text-3xl text-black mb-4 ${headingFont}`}>Article not found</h1>
          <Link to="/blogs" className={`text-sm font-semibold text-[#000000] ${bodyFont}`}>
            ← Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const minutes = (post.readMinutes ?? parseInt(post.readTime, 10)) || 5;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const moreStories = related.length > 0 ? related : latest.slice(0, 3);
  const tags = (post.tags && post.tags.length > 0)
    ? post.tags
    : [post.category.replace(/\s+/g, ""), "Finance"];

  return (
    <article className={`blog-cms bg-[#ffffff] ${bodyFont}`}>
      <BlogCategoryNav />
      <div className="sticky top-0 z-30 bg-[#ffffff]/90 backdrop-blur border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center gap-3 text-sm overflow-x-auto whitespace-nowrap">
          <Link to="/" className="text-neutral-500 hover:text-[#000000]">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link to="/blogs" className="text-neutral-500 hover:text-[#000000]">{post.category}</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-800 truncate">{post.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-32 flex flex-col gap-3 items-center">
            <ShareIcon href={post.facebook_url || `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} label="Facebook">
              <Facebook className="size-4" />
            </ShareIcon>
            <ShareIcon href={post.twitter_url || `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} label="Twitter">
              <Twitter className="size-4" />
            </ShareIcon>
            <ShareIcon href={post.linkedin_url || `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} label="LinkedIn">
              <Linkedin className="size-4" />
            </ShareIcon>
            {post.instagram_url && (
              <ShareIcon href={post.instagram_url} label="Instagram">
                <Instagram className="size-4" />
              </ShareIcon>
            )}
            <button
              type="button"
              aria-label="Copy link"
              onClick={copyLink}
              className="size-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-[#000000] hover:border-[#000000] transition"
            >
              <LinkIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Share"
              onClick={copyLink}
              className="size-10 rounded-full border border-[#000000] bg-[#000000] text-white flex items-center justify-center"
            >
              <Share2 className="size-4" />
            </button>
            {copied && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Copied</span>}
          </div>
        </aside>

        <div className="min-w-0">
          <span className={`text-[11px] font-bold text-[#000000] tracking-widest uppercase border border-[#000000]/30 rounded-full px-3 py-1 inline-block ${bodyFont}`}>
            {post.category}
          </span>
          <h1 className={`text-3xl lg:text-5xl leading-tight mt-4 text-black ${headingFont}`}>
            {post.title}
          </h1>
          {(post.subtitle || post.excerpt) && (
            <p className={`text-base md:text-lg text-neutral-600 mt-4 leading-relaxed ${bodyFont}`}>
              {post.subtitle || post.excerpt}
            </p>
          )}
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 text-sm text-neutral-500 ${bodyFont}`}>
            <span className="font-medium text-black">{post.author}</span>
            <span>•</span>
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{minutes} min read</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3" /> {comments.length} comments
            </span>
          </div>

          <div className="lg:hidden flex gap-3 mt-5">
            <ShareIcon href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} label="Twitter">
              <Twitter className="size-4" />
            </ShareIcon>
            <ShareIcon href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} label="LinkedIn">
              <Linkedin className="size-4" />
            </ShareIcon>
            <button type="button" onClick={copyLink} className="size-10 rounded-full border border-border flex items-center justify-center">
              <LinkIcon className="size-4" />
            </button>
          </div>

          {post.coverImage && (
            <div className="w-full aspect-video bg-surface overflow-hidden mt-6 md:mt-8">
              <img src={post.coverImage} alt={post.title} className="size-full object-cover" />
            </div>
          )}
        </div>

        <aside>
          <div className="lg:sticky lg:top-32 space-y-6">
            <div>
              <h3 className={`text-[11px] font-bold uppercase tracking-widest border-b border-neutral-200 pb-3 mb-4 text-black ${bodyFont}`}>
                Top News
              </h3>
              <ol className="space-y-4">
                {latest.map((a, i) => (
                  <li key={a.slug} className="flex gap-3">
                    <span className={`text-2xl text-neutral-300 w-6 shrink-0 ${headingFont}`}>{i + 1}</span>
                    <Link to={`/blogs/${a.slug}`} className="group flex gap-3 min-w-0 no-underline">
                      <div className="w-16 h-14 bg-neutral-100 overflow-hidden shrink-0">
                        {a.coverImage && <img src={a.coverImage} alt={a.title} className="size-full object-cover" />}
                      </div>
                      <p className={`text-sm leading-snug text-black group-hover:text-[#000000] line-clamp-3 ${bodyFont}`}>
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

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10">
        <div className="hidden lg:block" />
        <div className="min-w-0">
          <div className={`prose-editorial text-neutral-800 ${bodyFont}`}>
            {post.htmlBody ? (
              <div dangerouslySetInnerHTML={{ __html: post.htmlBody }} />
            ) : (
              post.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </div>

          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {post.gallery.map((url) => (
                <img key={url} src={url} alt="" className="w-full object-cover" />
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="my-16 p-8 md:p-10 bg-white border border-neutral-200">
              <div className="flex items-end justify-between mb-6 pb-4 border-b border-neutral-200">
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest text-[#000000] ${bodyFont}`}>
                    Read also in {post.category}
                  </p>
                  <h3 className={`text-3xl mt-1 text-black ${headingFont}`}>More stories like this</h3>
                </div>
                <Link
                  to={categorySlug ? `/blogs?category=${encodeURIComponent(categorySlug)}` : "/blogs"}
                  className={`text-xs uppercase tracking-widest text-neutral-400 hover:text-[#000000] whitespace-nowrap no-underline ${bodyFont}`}
                >
                  See all →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {related.slice(0, 4).map((r) => (
                  <Link key={r.slug} to={`/blogs/${r.slug}`} className="flex gap-4 group no-underline">
                    <div className="w-28 h-20 bg-neutral-100 overflow-hidden shrink-0">
                      {r.coverImage && (
                        <img src={r.coverImage} alt={r.title} className="size-full object-cover group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-base text-black group-hover:text-[#000000] line-clamp-3 ${headingFont}`}>{r.title}</p>
                      <p className={`text-[11px] text-neutral-400 mt-1.5 uppercase tracking-wider ${bodyFont}`}>
                        {formatBlogDate(r.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 pt-8 border-t border-neutral-200">
            <p className={`text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3 ${bodyFont}`}>Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center px-3 py-1.5 bg-white border border-neutral-200 text-xs font-medium text-neutral-800">
                  #{t.replace(/^#/, "")}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-widest text-neutral-400 ${bodyFont}`}>Written by</p>
              <p className={`text-2xl mt-1 text-black ${headingFont}`}>{post.author}</p>
            </div>
            <Link to="/blogs" className={`text-sm font-semibold text-[#000000] no-underline ${bodyFont}`}>
              ← More stories
            </Link>
          </div>

          <div className="my-14 p-10 bg-black text-white flex flex-col md:flex-row md:items-end gap-6">
            <div className="md:flex-1">
              <h3 className={`text-3xl leading-tight ${headingFont}`}>Keep up to date with our newest improvements.</h3>
              <p className={`text-sm text-neutral-400 mt-3 ${bodyFont}`}>A weekly dispatch from Accrefin — no spam, just the work worth your attention.</p>
            </div>
            <form
              className="flex w-full md:w-auto"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent border border-background/30 px-4 py-3 text-sm w-full md:w-72 placeholder:text-background/40 outline-none focus:border-background"
              />
              <button className={`px-5 py-3 bg-white text-black text-sm font-semibold ${bodyFont}`}>
                {subscribed ? "Joined" : "Sign up"}
              </button>
            </form>
          </div>

          <section className="mt-14 border-t border-border pt-10 pb-10">
            <h4 className={`text-2xl mb-4 text-black ${headingFont}`}>Leave a response</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!slug || !body.trim()) return;
                addComment(slug, name.trim() || "Reader", body.trim());
                setComments(readComments(slug));
                setBody("");
                setName("");
              }}
              className="p-6 bg-white border border-border"
            >
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
              <button className={`px-5 py-3 bg-[#000000] text-white text-sm font-semibold ${bodyFont}`}>
                Post response
              </button>
            </form>
            <ul className="mt-8 space-y-8">
              {comments.map((c) => (
                <li key={c.id} className="border-b border-border pb-6">
                  <p className="text-base leading-relaxed">{c.body}</p>
                  <p className={`text-[12px] text-neutral-400 mt-2 ${bodyFont}`}>
                    by <span className="text-foreground font-semibold">{c.author_name}</span> ·{" "}
                    {new Date(c.created_at).toLocaleString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <BlogAdCard ad={sidebarAd} />
            {banners.map((b) => (
              <a key={b.id} href={b.link_url || "#"} target="_blank" rel="noopener noreferrer" className="block group">
                <img src={b.image_url} alt={b.title || ""} className="w-full h-auto border border-neutral-200 group-hover:opacity-90 transition-opacity" />
                {b.title && <p className={`text-xs text-neutral-400 mt-2 ${bodyFont}`}>{b.title}</p>}
              </a>
            ))}
          </div>
        </aside>
      </div>

      {moreStories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-10 pb-24">
          <div className="flex items-end justify-between border-b border-border pb-3 mb-8">
            <h3 className={`text-3xl text-black ${headingFont}`}>Recent Stories</h3>
            <Link to="/blogs" className={`text-sm font-semibold text-[#000000] no-underline ${bodyFont}`}>More →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {moreStories.map((a) => (
              <Link key={a.slug} to={`/blogs/${a.slug}`} className="group block no-underline">
                <div className="w-full aspect-video bg-surface overflow-hidden mb-4">
                  {a.coverImage && (
                    <img src={a.coverImage} alt={a.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <h3 className={`text-xl leading-snug text-black group-hover:text-[#000000] ${headingFont}`}>{a.title}</h3>
                <p className={`mt-2 text-[12px] text-neutral-500 ${bodyFont}`}>
                  {a.author} · {formatBlogDate(a.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function ShareIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="size-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500 hover:text-[#000000] hover:border-[#000000] transition"
    >
      {children}
    </a>
  );
}
