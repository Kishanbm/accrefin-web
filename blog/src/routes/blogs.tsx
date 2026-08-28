import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { latestArticlesQuery, formatDate, type Article } from "@/lib/queries";
import { ArticleCard } from "@/components/article-card";
import { useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "All Articles — ACCREFIN" },
      { name: "description", content: "Browse all editorial publications and articles from ACCREFIN." },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const { data: articles = [], isLoading } = useQuery(latestArticlesQuery(100));
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter((a) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      a.title.toLowerCase().includes(term) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(term)) ||
      (a.author_name && a.author_name.toLowerCase().includes(term)) ||
      (a.category?.name && a.category.name.toLowerCase().includes(term))
    );
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="border-b border-border pb-8 mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-primary mb-3">
          Archive
        </p>
        <h1 className="font-display text-5xl md:text-6xl italic leading-none">
          All Articles
        </h1>
        <p className="text-base text-muted-foreground mt-5 max-w-2xl leading-relaxed">
          Browse through our full collection of articles, stories, and editorial insights.
        </p>
        
        {/* Search Input */}
        <div className="mt-8 max-w-md relative flex border border-border bg-surface focus-within:border-primary transition-colors">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter articles..."
            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-sm"
          />
          <div className="px-4 flex items-center text-muted-foreground">
            <Search className="size-4" />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground font-mono text-sm">
          Loading publication feed...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No articles found matching your criteria.
        </div>
      ) : (
        <section className="grid md:grid-cols-3 gap-x-8 gap-y-12">
          {filteredArticles.map((a: Article) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </section>
      )}
    </main>
  );
}
