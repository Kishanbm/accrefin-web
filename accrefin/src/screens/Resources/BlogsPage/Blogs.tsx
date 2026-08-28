import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { formatBlogDate, type BlogPost } from "./blogPosts";
import { fetchCategories, fetchPublishedPosts } from "./supabaseCms";
import { BlogCategoryNav } from "./BlogCategoryNav";
import { bodyFont, headingFont } from "./blogTheme";

const FALLBACK =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80";

function ArticleCard({ post }: { post: BlogPost }) {
  const [src, setSrc] = useState(post.coverImage || FALLBACK);
  const minutes = (post.readMinutes ?? parseInt(post.readTime, 10)) || 5;

  return (
    <Link to={`/blogs/${post.slug}`} className="group block no-underline">
      <div className="w-full aspect-video bg-surface overflow-hidden mb-4">
        <img
          src={src}
          alt={post.title}
          loading="lazy"
          onError={() => src !== FALLBACK && setSrc(FALLBACK)}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className={`flex items-center gap-3 mb-2 text-[11px] font-bold uppercase tracking-widest ${bodyFont}`}>
        <span className="text-[#000000]">{post.category}</span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-400">{minutes} min read</span>
      </div>
      <h3 className={`text-[22px] leading-snug text-[#000000] group-hover:text-[#000000] transition-colors ${headingFont}`}>
        {post.title}
      </h3>
      {post.excerpt && (
        <p className={`mt-3 text-[13px] text-neutral-500 leading-relaxed line-clamp-2 ${bodyFont}`}>
          {post.excerpt}
        </p>
      )}
      <div className={`mt-3 flex items-center gap-2 text-[12px] text-neutral-500 ${bodyFont}`}>
        <span>{post.author}</span>
        <span>•</span>
        <span>{formatBlogDate(post.publishedAt)}</span>
      </div>
    </Link>
  );
}

export default function Blogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoryName, setCategoryName] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [params] = useSearchParams();
  const categorySlug = params.get("category") || "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [all, cats] = await Promise.all([fetchPublishedPosts(), fetchCategories()]);
      if (cancelled) return;
      setPosts(all);
      setCategoryName(cats.find((c) => c.slug === categorySlug)?.name);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const filtered = posts.filter((post) => {
    if (categoryName && post.category !== categoryName) return false;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term)
    );
  });

  return (
    <main className="blog-cms bg-[#ffffff] min-h-[70vh]">
      <BlogCategoryNav />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="border-b border-neutral-200 pb-8 mb-10">
          <p className={`text-[11px] font-bold uppercase tracking-widest text-[#000000] mb-3 ${bodyFont}`}>
            Archive
          </p>
          <h1 className={`text-4xl lg:text-5xl leading-tight text-black ${headingFont}`}>
            {categoryName || "All Articles"}
          </h1>
          <p className={`text-lg text-neutral-600 mt-5 max-w-2xl leading-relaxed ${bodyFont}`}>
            Browse through our full collection of articles, stories, and editorial insights.
          </p>
          <div className="mt-8 max-w-md relative flex border border-neutral-300 bg-white focus-within:border-[#000000] transition-colors">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter articles..."
              className={`flex-1 bg-transparent px-4 py-2.5 outline-none text-sm ${bodyFont}`}
            />
            <div className="px-4 flex items-center text-neutral-400">
              <Search className="size-4" />
            </div>
          </div>
        </header>

        {loading ? (
          <div className={`py-20 text-center text-neutral-500 ${bodyFont}`}>Loading articles…</div>
        ) : filtered.length === 0 ? (
          <div className={`py-20 text-center text-neutral-500 ${bodyFont}`}>
            No articles found matching your criteria.
          </div>
        ) : (
          <section className="grid md:grid-cols-3 gap-x-8 gap-y-12 pb-16">
            {filtered.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
