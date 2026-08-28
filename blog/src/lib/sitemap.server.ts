/** SEO helpers for robots.txt + sitemap.xml (server-only). */

export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    "https://accrefin.com";
  return raw.replace(/\/+$/, "");
}

export function buildRobotsTxt(siteUrl = getSiteUrl()): string {
  return `# robots.txt for ${siteUrl}/
# Allow crawlers; block utility routes; point to the sitemap.

User-agent: *
Allow: /

Disallow: /auth
Disallow: /search
Disallow: /admin
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDateOnly(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function renderUrl(entry: SitemapEntry): string {
  const lines = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (typeof entry.priority === "number") {
    lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }
  lines.push(`  </url>`);
  return lines.join("\n");
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(renderUrl).join("\n")}
</urlset>
`;
}

export async function buildDynamicSitemapXml(siteUrl = getSiteUrl()): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const today = new Date().toISOString().slice(0, 10);
  const entries: SitemapEntry[] = [
    { loc: `${siteUrl}/`, lastmod: today, changefreq: "daily", priority: 1.0 },
    { loc: `${siteUrl}/blogs`, lastmod: today, changefreq: "daily", priority: 0.8 },
    { loc: `${siteUrl}/newsletter`, lastmod: today, changefreq: "weekly", priority: 0.6 },
  ];

  const [{ data: categories }, { data: articles }] = await Promise.all([
    supabaseAdmin
      .from("categories")
      .select("slug,visible")
      .order("sort_order", { ascending: true }),
    supabaseAdmin
      .from("articles")
      .select("slug,published_at,updated_at")
      .eq("published", true)
      .order("published_at", { ascending: false }),
  ]);

  for (const cat of categories ?? []) {
    if (!cat.slug) continue;
    if (cat.visible === false) continue;
    entries.push({
      loc: `${siteUrl}/category/${encodeURIComponent(cat.slug)}`,
      lastmod: today,
      changefreq: "daily",
      priority: 0.7,
    });
  }

  for (const article of articles ?? []) {
    if (!article.slug) continue;
    entries.push({
      loc: `${siteUrl}/article/${encodeURIComponent(article.slug)}`,
      lastmod: toDateOnly(article.updated_at) ?? toDateOnly(article.published_at) ?? today,
      changefreq: "monthly",
      priority: 0.9,
    });
  }

  return buildSitemapXml(entries);
}
