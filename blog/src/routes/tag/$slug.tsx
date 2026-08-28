import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ArticleCard } from "@/components/article-card";

export const Route = createFileRoute("/tag/$slug")({
  loader: async ({ params }) => {
    const { data: tag } = await supabase.from("tags").select("*").eq("slug", params.slug).maybeSingle();
    if (!tag) throw notFound();
    const { data: rows } = await supabase
      .from("article_tags")
      .select("articles(*,category:categories(slug,name))")
      .eq("tag_id", (tag as any).id);
    const articles = (rows ?? [])
      .map((r: any) => r.articles)
      .filter((a: any) => a && a.published)
      .map((a: any) => ({
        ...a,
        gallery_images: Array.isArray(a.gallery_images) ? a.gallery_images : [],
        key_moments: Array.isArray(a.key_moments) ? a.key_moments : [],
        questions: Array.isArray(a.questions) ? a.questions : [],
      }));
    return { tag, articles };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `#${loaderData.tag.name} — ACCREFIN` },
          { name: "description", content: `Stories tagged #${loaderData.tag.name} on ACCREFIN.` },
        ]
      : [],
  }),
  errorComponent: () => <div className="p-12 text-center">Couldn't load tag.</div>,
  notFoundComponent: () => <div className="p-12 text-center">Tag not found.</div>,
  component: TagPage,
});

function TagPage() {
  const { tag, articles } = Route.useLoaderData() as any;
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Tag</p>
        <h1 className="font-display text-4xl md:text-6xl mt-2">#{tag.name}</h1>
        <p className="text-sm text-muted-foreground mt-3">{articles.length} {articles.length === 1 ? "story" : "stories"}</p>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">Nothing tagged here yet. <Link to="/" className="underline">Back to home</Link></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
    </main>
  );
}
