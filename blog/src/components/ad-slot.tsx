import type { AdSlot } from "@/lib/queries";

export function AdSlotCard({ ad, variant = "card" }: { ad?: AdSlot; variant?: "card" | "banner" }) {
  if (!ad) return null;

  if (ad.custom_html && ad.custom_html.trim().length > 0) {
    return (
      <div className="bg-surface border border-border">
        <div dangerouslySetInnerHTML={{ __html: ad.custom_html }} />
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest p-2 border-t border-border text-center">
          Advertisement
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div>
        <a
          href={ad.cta_url || "#"}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block relative bg-foreground text-background overflow-hidden group"
        >
          {ad.image_url ? (
            <div className="relative aspect-[16/9]">
              <img src={ad.image_url} alt="" className="absolute inset-0 size-full object-cover opacity-90 group-hover:opacity-100 transition" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 size-full flex flex-col justify-end p-6 md:p-10 text-white">
                <h4 className="font-display text-2xl md:text-4xl leading-tight">{ad.title}</h4>
                {ad.body && <p className="text-sm md:text-base opacity-80 mt-2 max-w-xl">{ad.body}</p>}
                {ad.cta_text && (
                  <span className="mt-4 inline-block w-fit px-5 py-2 border border-white/40 text-xs font-bold uppercase tracking-widest">
                    {ad.cta_text}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 grid md:grid-cols-[1fr_auto] items-center gap-6">
              <div>
                <h4 className="font-display text-3xl mb-2">{ad.title}</h4>
                {ad.body && <p className="text-sm text-background/70 max-w-xl">{ad.body}</p>}
              </div>
              {ad.cta_text && (
                <span className="inline-block px-6 py-3 border border-background/40 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                  {ad.cta_text}
                </span>
              )}
            </div>
          )}
        </a>
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-2 text-center">
          Advertisement
        </p>
      </div>
    );
  }

  return (
    <div>
      <a
        href={ad.cta_url || "#"}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block relative bg-foreground text-background overflow-hidden group"
      >
        {ad.image_url ? (
          <div className="relative aspect-[4/5]">
            <img src={ad.image_url} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <h4 className="font-display text-xl leading-tight">{ad.title}</h4>
              {ad.body && (
                <p className="text-xs opacity-80 mt-1 line-clamp-2">{ad.body}</p>
              )}
              {ad.cta_text && (
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest border-b border-white/60 pb-0.5">
                  {ad.cta_text}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 aspect-[4/5] flex flex-col justify-between">
            <h4 className="font-display text-xl">{ad.title}</h4>
            {ad.cta_text && (
              <span className="text-[11px] font-bold uppercase tracking-widest border-b border-background pb-0.5 w-fit">
                {ad.cta_text}
              </span>
            )}
          </div>
        )}
      </a>
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-2 text-center">
        Advertisement
      </p>
    </div>
  );
}
