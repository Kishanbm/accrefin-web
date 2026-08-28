import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchArticlesQuery } from "@/lib/queries";
import { ArticleCard } from "@/components/article-card";
import { Search as SearchIcon } from "lucide-react";

type Search = { q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  head: () => ({ meta: [{ title: "Search — ACCREFIN" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const [term, setTerm] = useState(q);
  const { data: results = [], isFetching } = useQuery(searchArticlesQuery(q));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/search", search: { q: term } });
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-5xl mb-8">Search</h1>
      <form onSubmit={onSubmit} className="flex border border-border bg-surface mb-12">
        <div className="pl-5 flex items-center text-muted-foreground">
          <SearchIcon className="size-5" />
        </div>
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search articles, authors, topics…"
          className="flex-1 bg-transparent px-4 py-5 outline-none text-lg"
        />
        <button className="px-8 bg-foreground text-background text-xs font-bold uppercase tracking-widest">
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-muted-foreground mb-8">
          {isFetching ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"`}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {q && !isFetching && results.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-2xl mb-2">No results.</p>
          <p className="text-sm text-muted-foreground">
            Try a broader term, or <Link to="/" className="underline">return home</Link>.
          </p>
        </div>
      )}
    </main>
  );
}
