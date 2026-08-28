import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Check, Mail, Cpu, Shield, Newspaper, Rocket, Package, Wrench, Brain, Banknote, Palette } from "lucide-react";

const searchSchema = z.object({ email: z.string().optional() });

export const Route = createFileRoute("/newsletter/personalize")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Personalize your Accrefin briefing" },
      { name: "description", content: "Refine your Accrefin profile to receive a personalized weekly curation." },
    ],
  }),
  component: PersonalizePage,
});

const ROLES = [
  "Founding Engineer",
  "Technical Product Lead",
  "Software Engineer",
  "Security Architect",
  "Venture Capitalist",
  "CTO / VP of Engineering",
];

const FREQUENCY = [
  { id: "weekly", title: "Weekly", subtitle: "Digest" },
  { id: "biweekly", title: "Bi-Weekly", subtitle: "Brief" },
  { id: "monthly", title: "Monthly", subtitle: "Recap" },
];

const INTERESTS = [
  { id: "tech", title: "Tech", desc: "Emerging architectures & hardware innovation", icon: Cpu },
  { id: "cyber", title: "Cybersecurity", desc: "Edge protection, zero-trust & network protocols", icon: Shield },
  { id: "news", title: "News & Current Affairs", desc: "Macro tech-policy, earnings & global regulatory shifts", icon: Newspaper },
  { id: "startups", title: "Startups", desc: "Growth loops, cap tables, and B2B SaaS funding", icon: Rocket },
  { id: "product", title: "Product", desc: "Product specifications, multi-tenancy UX & growth metrics", icon: Package },
  { id: "devtools", title: "Developer Tools", desc: "Native compilers, edge databases & tooling systems", icon: Wrench },
  { id: "ai", title: "AI & Machine Learning", desc: "Agent infrastructure, PGVector & semantic layers", icon: Brain },
  { id: "finance", title: "Finance & Fintech", desc: "Billing engines, multi-currency APIs & rails", icon: Banknote },
  { id: "design", title: "Design", desc: "High-contrast design systems & UI choreography", icon: Palette },
];

function PersonalizePage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [emailVal, setEmailVal] = useState(email ?? "");
  const [role, setRole] = useState<string | null>(null);
  const [freq, setFreq] = useState<string>("weekly");
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const toggle = (id: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canSubmit = emailVal && interests.size >= 1;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setDone(true);
    const selected = INTERESTS.filter((i) => interests.has(i.id)).map((i) => i.title).join(",");
    navigate({
      to: "/newsletter/confirm",
      search: { email: emailVal, role: role ?? "", freq, interests: selected },
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
        <Link to="/newsletter" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Landing
        </Link>
        <Link to="/" className="font-display text-xl font-extrabold">
          ACCREFIN
        </Link>
        <span className="text-xs font-semibold text-muted-foreground">Subscription Setup</span>
      </div>

      <section className="max-w-4xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 2 of 2</p>
        <h1 className="mt-3 font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Refine your Accrefin profile
        </h1>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
          We use your preferred tags to personalize your weekly curation digest. No fillers.
          Just pure engineering and commercial value.
        </p>

        <form onSubmit={submit} className="mt-10 space-y-10">
          <div className="grid md:grid-cols-2 gap-6 rounded-3xl border border-border bg-muted/20 p-6 md:p-8">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Subscribed Address
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>

              <label className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Your Professional Role
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-xs font-medium rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      role === r
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <label className="mt-6 block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Delivery Frequency
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {FREQUENCY.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => setFreq(f.id)}
                    className={`rounded-lg border px-3 py-3 text-center transition-colors ${
                      freq === f.id
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="text-xs font-bold">{f.title}</div>
                    <div className="text-[10px] opacity-80">{f.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 flex flex-col">
              <span className="inline-flex self-start items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Platform: Accrefin
              </span>
              <h3 className="mt-4 font-display font-bold text-lg">Why personalization creates actual value:</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Our subscription system integrates tag structures to automatically route key
                developer news. By selecting your target domains, you skip high-level noise and
                immediately receive actionable compile-level performance reviews.
              </p>
              <div className="mt-auto pt-6 text-[10px] font-medium text-muted-foreground inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground animate-pulse" />
                Secure subscription protocol active
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Select Interests & Target Trends (min. 1)
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground">
                Selected: {interests.size} / {INTERESTS.length}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {INTERESTS.map((i) => {
                const Icon = i.icon;
                const active = interests.has(i.id);
                return (
                  <button
                    type="button"
                    key={i.id}
                    onClick={() => toggle(i.id)}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`grid place-items-center size-9 rounded-lg shrink-0 ${active ? "bg-background/10" : "bg-muted"}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold">{i.title}</div>
                        <div className={`mt-1 text-[11px] leading-snug ${active ? "opacity-80" : "text-muted-foreground"}`}>
                          {i.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              By personalizing, you confirm subscription on accrefin.
            </p>
            <button
              type="submit"
              disabled={!canSubmit || done}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-6 py-3 disabled:opacity-40 transition-transform active:scale-95"
            >
              {done ? (
                <>
                  <Check className="size-4" /> Personalization saved
                </>
              ) : (
                <>
                  Confirm & Personalize Briefing <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
