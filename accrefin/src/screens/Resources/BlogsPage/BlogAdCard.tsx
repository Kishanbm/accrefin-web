import { headingFont, bodyFont } from "./blogTheme";
import type { CmsAd } from "./cmsStore";

export function BlogAdCard({ ad }: { ad: CmsAd }) {
  if (ad.custom_html?.trim()) {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: ad.custom_html }} />
        <p className={`text-[9px] uppercase tracking-widest text-gray-400 mt-2 text-center ${bodyFont}`}>
          Advertisement
        </p>
      </div>
    );
  }

  return (
    <div>
      <a
        href={ad.cta_url || "/blogs"}
        className="block relative overflow-hidden group no-underline"
      >
        <div className="relative aspect-[4/5] bg-slate-900">
          {ad.image_url && (
            <img src={ad.image_url} alt="" className="absolute inset-0 size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h4 className={`text-xl leading-tight ${headingFont}`}>{ad.title}</h4>
            {ad.body && <p className={`text-xs opacity-80 mt-1 line-clamp-3 ${bodyFont}`}>{ad.body}</p>}
            {ad.cta_text && (
              <span className={`mt-3 inline-block text-[10px] font-bold uppercase tracking-widest border-b border-white/60 pb-0.5 ${bodyFont}`}>
                {ad.cta_text}
              </span>
            )}
          </div>
        </div>
      </a>
      <p className={`text-[9px] uppercase tracking-widest text-gray-400 mt-2 text-center ${bodyFont}`}>
        Advertisement
      </p>
    </div>
  );
}

export const DEFAULT_SIDEBAR_AD: CmsAd = {
  id: "default-sidebar",
  slot_key: "article_sidebar",
  label: "Default sidebar",
  title: "Smart loans, clearer decisions",
  body: "Compare offers and apply with Accrefin — built for Indian borrowers.",
  image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1000&fit=crop",
  cta_text: "Learn more",
  cta_url: "/",
  custom_html: "",
  active: true,
};
