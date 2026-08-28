import { Facebook, Linkedin, Link as LinkIcon, MessageCircle, Share2, Twitter } from "lucide-react";
import type { ReactNode } from "react";
import { formatBlogDate } from "./blogPosts";
import { bodyFont, headingFont } from "./blogTheme";
import "./cms/cms-editor.css";

function mediaUrl(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "url" in v) {
    return String((v as { url?: string }).url || "");
  }
  return "";
}

export type ArticlePreviewData = {
  title?: string;
  subtitle?: string;
  excerpt?: string;
  body?: string;
  cover_image_url?: unknown;
  gallery_images?: unknown[];
  author_name?: string;
  read_time_minutes?: number;
  tags?: string[];
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  published_at?: string;
  created_at?: string;
};

type Props = {
  article: ArticlePreviewData;
  categoryName?: string;
  onClose: () => void;
};

/** Full-page preview matching the public blog article layout. */
export function ArticlePreview({ article, categoryName = "Uncategorized", onClose }: Props) {
  const cover = mediaUrl(article.cover_image_url);
  const gallery = (article.gallery_images ?? [])
    .map(mediaUrl)
    .filter(Boolean);
  const minutes = article.read_time_minutes || 5;
  const tags =
    article.tags && article.tags.length > 0
      ? article.tags
      : [categoryName.replace(/\s+/g, ""), "Finance"];
  const publishedAt =
    article.published_at || article.created_at || new Date().toISOString().slice(0, 10);
  const author = article.author_name || "Accrefin Team";
  const title = article.title?.trim() || "Untitled article";
  const subtitle = article.subtitle || article.excerpt;

  return (
    <div className="fixed inset-0 z-[80] bg-white flex flex-col">
      <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${bodyFont}`}>
            Live preview
          </p>
          <p className={`text-sm text-neutral-800 truncate max-w-[60vw] ${bodyFont}`}>
            How this article will look on the site
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest ${bodyFont}`}
        >
          Close preview
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <article className={`blog-cms bg-white ${bodyFont}`}>
          <div className="border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center gap-3 text-sm">
              <span className="text-neutral-500">Home</span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">{categoryName}</span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-800 truncate">{title}</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10">
            <aside className="hidden lg:block">
              <div className="sticky top-24 flex flex-col gap-3 items-center">
                <PreviewShareIcon><Facebook className="size-4" /></PreviewShareIcon>
                <PreviewShareIcon><Twitter className="size-4" /></PreviewShareIcon>
                <PreviewShareIcon><Linkedin className="size-4" /></PreviewShareIcon>
                <PreviewShareIcon><LinkIcon className="size-4" /></PreviewShareIcon>
                <div className="size-10 rounded-full border border-black bg-black text-white flex items-center justify-center">
                  <Share2 className="size-4" />
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <span
                className={`text-[11px] font-bold text-black tracking-widest uppercase border border-black/30 rounded-full px-3 py-1 inline-block ${bodyFont}`}
              >
                {categoryName}
              </span>
              <h1 className={`text-3xl lg:text-5xl leading-tight mt-4 text-black ${headingFont}`}>
                {title}
              </h1>
              {subtitle && (
                <p className={`text-base md:text-lg text-neutral-600 mt-4 leading-relaxed ${bodyFont}`}>
                  {subtitle}
                </p>
              )}
              <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 text-sm text-neutral-500 ${bodyFont}`}>
                <span className="font-medium text-black">{author}</span>
                <span>•</span>
                <span>{formatBlogDate(publishedAt)}</span>
                <span>•</span>
                <span>{minutes} min read</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="size-3" /> 0 comments
                </span>
              </div>

              {cover ? (
                <div className="w-full aspect-video bg-neutral-100 overflow-hidden mt-6 md:mt-8">
                  <img src={cover} alt={title} className="size-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-neutral-100 mt-6 md:mt-8 grid place-items-center text-sm text-neutral-400">
                  No cover image yet
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-24">
                <h3
                  className={`text-[11px] font-bold uppercase tracking-widest border-b border-neutral-200 pb-3 mb-4 text-black ${bodyFont}`}
                >
                  Top News
                </h3>
                <p className={`text-sm text-neutral-400 ${bodyFont}`}>
                  Related stories appear here on the live site.
                </p>
              </div>
            </aside>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[48px_1fr_320px] gap-6 lg:gap-10 pb-24">
            <div className="hidden lg:block" />
            <div className="min-w-0">
              <div className={`prose-editorial text-neutral-800 ${bodyFont}`}>
                {article.body?.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: article.body }} />
                ) : (
                  <p className="text-neutral-400 italic">Start writing in the editor — the body will show here.</p>
                )}
              </div>

              {gallery.length > 0 && (
                <div className="mt-10 grid grid-cols-2 gap-3">
                  {gallery.map((url) => (
                    <img key={url} src={url} alt="" className="w-full object-cover" />
                  ))}
                </div>
              )}

              <div className="mt-14 pt-8 border-t border-neutral-200">
                <p className={`text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3 ${bodyFont}`}>
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-neutral-200 text-xs font-medium text-neutral-800"
                    >
                      #{String(t).replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-14 pt-8 border-t border-neutral-200">
                <p className={`text-[11px] font-bold uppercase tracking-widest text-neutral-400 ${bodyFont}`}>
                  Written by
                </p>
                <p className={`text-2xl mt-1 text-black ${headingFont}`}>{author}</p>
              </div>
            </div>
            <aside className="hidden lg:block" />
          </div>
        </article>
      </div>
    </div>
  );
}

function PreviewShareIcon({ children }: { children: ReactNode }) {
  return (
    <div className="size-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500">
      {children}
    </div>
  );
}
