import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { latestArticlesQuery, formatDate } from "@/lib/queries";

const searchSchema = z.object({
  email: z.string().optional(),
  role: z.string().optional(),
  freq: z.string().optional(),
  interests: z.string().optional(),
});

export const Route = createFileRoute("/newsletter/confirm")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "You're in — Accrefin briefing personalized" },
      { name: "description", content: "Your personalized Accrefin newsletter is ready." },
    ],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const { email, role, freq, interests } = Route.useSearch();
  const { data: articles = [] } = useQuery(latestArticlesQuery(12));
  const interestList = (interests ?? "").split(",").filter(Boolean);

  const matches = interestList.length
    ? articles.filter((a) =>
        interestList.some((i: string) =>
          (a.category?.name ?? "").toLowerCase().includes(i.toLowerCase()),
        ),
      )
    : articles;
  const picks = (matches.length ? matches : articles).slice(0, 6);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
        <Link to="/newsletter" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
          ← Newsletter
        </Link>
        <Link to="/" className="font-display text-xl font-extrabold">
          ACCREFIN
        </Link>
        <span className="text-xs font-semibold text-muted-foreground">Step 3 of 3</span>
      </div>

      <section className="max-w-4xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-12 text-center">
        <div className="inline-flex items-center justify-center size-14 rounded-full bg-foreground text-background mb-6">
          <Check className="size-6" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          You're all set
        </p>
        <h1 className="mt-3 font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Your Accrefin briefing is ready.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
          We've personalized your curation based on what you told us. Your first edition
          lands in your inbox soon — until then, here's a preview of what you'll be reading.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
          <SummaryCard label="Delivered to" value={email ?? "—"} icon={<Mail className="size-4" />} />
          <SummaryCard label="Frequency" value={cap(freq) || "Weekly"} />
          <SummaryCard label="Role" value={role || "Reader"} />
          <SummaryCard label="Interests" value={interestList.length ? `${interestList.length} selected` : "General"} />
        </div>

        {interestList.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {interestList.map((t: string) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold"
              >
                <Sparkles className="size-3" /> {t}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Curated for you
            </p>
            <h2 className="mt-2 font-display font-extrabold text-2xl md:text-3xl">
              Start exploring
            </h2>
          </div>
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-6 py-3"
          >
            Explore Now <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {picks.map((a) => (
            <Link
              key={a.id}
              to="/article/$slug"
              params={{ slug: a.slug }}
              className="group rounded-2xl overflow-hidden border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                {a.cover_image_url && (
                  <img
                    src={a.cover_image_url}
                    alt={a.title}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-5">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border border-border">
                  {a.category?.name ?? "Tech"}
                </span>
                <h3 className="mt-3 font-display font-bold text-lg leading-snug line-clamp-2">
                  {a.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(a.published_at)} · {a.read_time_minutes ?? 4} min read
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-6 py-3"
          >
            Explore Now <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
