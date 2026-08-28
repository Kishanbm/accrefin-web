import { useEffect, useRef, useState } from "react";
import { X, Copy, Check, Download, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

type Platform = "instagram-post" | "instagram-story" | "twitter" | "linkedin" | "whatsapp";

type Variation = { id: string; label: string };

const VARIATIONS: Variation[] = [
  { id: "title-top", label: "Title on top" },
  { id: "image-hero", label: "Image hero" },
  { id: "quote-overlay", label: "Quote overlay" },
  { id: "minimal", label: "Minimal" },
  { id: "magazine", label: "Magazine cover" },
  { id: "polaroid", label: "Polaroid" },
  { id: "dark-bold", label: "Dark bold" },
  { id: "gradient", label: "Gradient card" },
];

const DIMENSIONS: Record<Platform, { w: number; h: number; name: string }> = {
  "instagram-post": { w: 1080, h: 1080, name: "Instagram Post" },
  "instagram-story": { w: 1080, h: 1920, name: "Instagram Story" },
  twitter: { w: 1200, h: 675, name: "Twitter / X" },
  linkedin: { w: 1200, h: 627, name: "LinkedIn" },
  whatsapp: { w: 1080, h: 1080, name: "WhatsApp" },
};

export function ShareModal({
  open, onClose, article, url,
}: {
  open: boolean;
  onClose: () => void;
  article: { title: string; excerpt: string | null; cover_image_url: string | null; category?: { name: string } | null };
  url: string;
}) {
  const [platform, setPlatform] = useState<Platform>("instagram-post");
  const [variation, setVariation] = useState<string>(VARIATIONS[0].id);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    drawPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, platform, variation, article]);

  async function drawPreview() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = DIMENSIONS[platform];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // bg
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // cover image
    let img: HTMLImageElement | null = null;
    if (article.cover_image_url) {
      try {
        img = await loadImage(article.cover_image_url);
      } catch { img = null; }
    }

    const padding = Math.round(w * 0.06);

    if (variation === "title-top") {
      // Title top, image middle, footer bottom
      ctx.fillStyle = "#ffffff";
      drawWrappedText(ctx, article.title, padding, padding + 60, w - padding * 2, 64, 70, "700");
      if (img) {
        const imgY = h * 0.35;
        const imgH = h * 0.4;
        drawCover(ctx, img, padding, imgY, w - padding * 2, imgH);
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = `400 28px Inter, sans-serif`;
      ctx.fillText("Read more on ACCREFIN", padding, h - padding - 40);
      ctx.font = `400 22px Inter, sans-serif`;
      ctx.fillText(shortUrl(url), padding, h - padding - 8);
    } else if (variation === "image-hero") {
      if (img) drawCover(ctx, img, 0, 0, w, h * 0.6);
      // gradient
      const grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
      grad.addColorStop(0, "rgba(15,23,42,0)");
      grad.addColorStop(1, "rgba(15,23,42,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);
      ctx.fillStyle = "#fff";
      if (article.category) {
        ctx.font = `600 24px Inter, sans-serif`;
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(article.category.name.toUpperCase(), padding, h * 0.66);
      }
      ctx.fillStyle = "#fff";
      drawWrappedText(ctx, article.title, padding, h * 0.72, w - padding * 2, 56, 64, "700");
      ctx.fillStyle = "#94a3b8";
      ctx.font = `400 22px Inter, sans-serif`;
      ctx.fillText("ACCREFIN · " + shortUrl(url), padding, h - padding);
    } else if (variation === "quote-overlay") {
      if (img) {
        drawCover(ctx, img, 0, 0, w, h);
        ctx.fillStyle = "rgba(15,23,42,0.7)";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.fillStyle = "#fff";
      ctx.font = `italic 700 80px Inter Tight, sans-serif`;
      ctx.fillText("\u201C", padding, padding + 100);
      drawWrappedText(ctx, article.excerpt || article.title, padding, h * 0.4, w - padding * 2, 52, 62, "600");
      ctx.fillStyle = "#94a3b8";
      ctx.font = `400 24px Inter, sans-serif`;
      ctx.fillText(article.title, padding, h - padding - 40);
      ctx.fillText("Read on ACCREFIN", padding, h - padding - 8);
    } else if (variation === "minimal") {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, h);
      if (img) {
        drawCover(ctx, img, padding, padding, w - padding * 2, h * 0.5);
      }
      ctx.fillStyle = "#0f172a";
      drawWrappedText(ctx, article.title, padding, h * 0.6, w - padding * 2, 56, 64, "700");
      ctx.fillStyle = "#475569";
      ctx.font = `400 26px Inter, sans-serif`;
      if (article.excerpt) drawWrappedText(ctx, article.excerpt, padding, h * 0.78, w - padding * 2, 26, 36, "400");
      ctx.fillStyle = "#0f172a";
      ctx.font = `600 22px Inter, sans-serif`;
      ctx.fillText("ACCREFIN  ·  " + shortUrl(url), padding, h - padding);
    } else if (variation === "magazine") {
      // Full-bleed image + red banner + big serif title
      if (img) drawCover(ctx, img, 0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, w, h);
      // top banner
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(0, padding, w, 90);
      ctx.fillStyle = "#fff";
      ctx.font = `900 44px "Inter Tight", Inter, sans-serif`;
      ctx.fillText("ACCREFIN", padding, padding + 30);
      // huge title bottom
      ctx.fillStyle = "#fff";
      drawWrappedText(ctx, article.title, padding, h * 0.55, w - padding * 2, 72, 82, "800");
      ctx.font = `500 24px Inter, sans-serif`;
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(shortUrl(url), padding, h - padding);
    } else if (variation === "polaroid") {
      // Warm off-white paper, image top with margin, caption below
      ctx.fillStyle = "#f5efe6";
      ctx.fillRect(0, 0, w, h);
      const frame = padding * 1.2;
      const imgH = h * 0.62;
      // photo
      ctx.fillStyle = "#fff";
      ctx.fillRect(frame - 20, frame - 20, w - (frame - 20) * 2, imgH + 40);
      if (img) drawCover(ctx, img, frame, frame, w - frame * 2, imgH);
      // caption
      ctx.fillStyle = "#1f2937";
      drawWrappedText(ctx, article.title, frame, frame + imgH + 60, w - frame * 2, 44, 54, "600");
      ctx.font = `italic 400 24px Georgia, serif`;
      ctx.fillStyle = "#6b7280";
      ctx.fillText("— ACCREFIN · " + shortUrl(url), frame, h - padding);
    } else if (variation === "dark-bold") {
      // Solid dark bg, bright accent, category chip, huge type
      ctx.fillStyle = "#0b0f19";
      ctx.fillRect(0, 0, w, h);
      // accent bar
      ctx.fillStyle = "#facc15";
      ctx.fillRect(padding, padding, 12, h - padding * 2);
      // chip
      if (article.category) {
        ctx.fillStyle = "#facc15";
        const tag = article.category.name.toUpperCase();
        ctx.font = `800 22px Inter, sans-serif`;
        const tw = ctx.measureText(tag).width;
        ctx.fillRect(padding + 40, padding + 20, tw + 28, 40);
        ctx.fillStyle = "#0b0f19";
        ctx.fillText(tag, padding + 40 + 14, padding + 48);
      }
      ctx.fillStyle = "#fff";
      drawWrappedText(ctx, article.title, padding + 40, padding + 110, w - padding * 2 - 40, 80, 92, "900");
      if (article.excerpt) {
        ctx.fillStyle = "#94a3b8";
        drawWrappedText(ctx, article.excerpt, padding + 40, h * 0.62, w - padding * 2 - 40, 28, 40, "400");
      }
      ctx.fillStyle = "#facc15";
      ctx.font = `700 22px Inter, sans-serif`;
      ctx.fillText("READ ON ACCREFIN  →  " + shortUrl(url), padding + 40, h - padding);
    } else {
      // gradient card
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#1e293b");
      grad.addColorStop(0.5, "#7c3aed");
      grad.addColorStop(1, "#ec4899");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // rounded image card
      if (img) {
        const cw = w - padding * 2;
        const ch = h * 0.38;
        ctx.save();
        roundedRect(ctx, padding, padding + 40, cw, ch, 32);
        ctx.clip();
        drawCover(ctx, img, padding, padding + 40, cw, ch);
        ctx.restore();
      }
      ctx.fillStyle = "#fff";
      drawWrappedText(ctx, article.title, padding, h * 0.58, w - padding * 2, 60, 70, "800");
      ctx.font = `500 24px Inter, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("ACCREFIN · " + shortUrl(url), padding, h - padding);
    }
  }

  function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function downloadImage() {
    setBusy(true);
    try {
      await drawPreview();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${slugify(article.title)}-${platform}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally { setBusy(false); }
  }

  async function copyUrl() {
    if (typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function shareTo(p: Platform) {
    const text = encodeURIComponent(`${article.title} — ${url}`);
    if (p === "whatsapp") window.open(`https://wa.me/?text=${text}`, "_blank");
    if (p === "twitter") window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    if (p === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-background w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h3 className="font-display text-xl">Share article</h3>
          <button onClick={onClose} className="size-8 grid place-items-center"><X className="size-5" /></button>
        </div>
        <div className="grid md:grid-cols-[1fr_320px] gap-0">
          {/* Preview */}
          <div className="p-6 bg-muted-surface min-h-[420px] grid place-items-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[70vh] shadow-xl"
              style={{ aspectRatio: `${DIMENSIONS[platform].w}/${DIMENSIONS[platform].h}` }}
            />
          </div>
          {/* Controls */}
          <div className="p-6 space-y-5 border-l border-border">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Quick share</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => shareTo("whatsapp")} className="flex items-center gap-2 px-3 py-2 border border-border text-sm hover:bg-surface">
                  <MessageCircle className="size-4" /> WhatsApp
                </button>
                <button onClick={() => shareTo("twitter")} className="flex items-center gap-2 px-3 py-2 border border-border text-sm hover:bg-surface">
                  <Twitter className="size-4" /> Twitter
                </button>
                <button onClick={() => shareTo("linkedin")} className="flex items-center gap-2 px-3 py-2 border border-border text-sm hover:bg-surface">
                  <Linkedin className="size-4" /> LinkedIn
                </button>
                <button onClick={copyUrl} className="flex items-center gap-2 px-3 py-2 border border-border text-sm hover:bg-surface">
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Platform</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(DIMENSIONS) as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-2 text-xs border ${platform === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-surface"}`}
                  >
                    {DIMENSIONS[p].name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 font-mono">{DIMENSIONS[platform].w} × {DIMENSIONS[platform].h}</p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Variation</p>
              <div className="grid grid-cols-2 gap-2">
                {VARIATIONS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariation(v.id)}
                    className={`px-3 py-2 text-xs border ${variation === v.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-surface"}`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={busy}
              onClick={downloadImage}
              className="w-full py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="size-4" /> Download for {DIMENSIONS[platform].name}
            </button>

            <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
              <Instagram className="size-3 inline mr-1" />
              For Instagram, download the image and upload it through the app. We can't post directly to Instagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  ctx.restore();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number,
  fontSize: number, lineHeight: number, weight: string,
) {
  ctx.font = `${weight} ${fontSize}px "Inter Tight", Inter, sans-serif`;
  ctx.textBaseline = "top";
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      cy += lineHeight;
      line = w;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function shortUrl(u: string) {
  try { return new URL(u).host + new URL(u).pathname; } catch { return u; }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
}
