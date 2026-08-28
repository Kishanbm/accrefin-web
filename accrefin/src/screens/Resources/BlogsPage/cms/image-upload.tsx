import { useCallback, useRef, useState, useEffect, type CSSProperties, type MouseEvent, type TouchEvent } from "react";
import { Upload, X, Loader2, Move } from "lucide-react";
import { uploadBlogImage } from "./media";

export type ImageValue = {
  url: string;
  alt?: string;
  focal_x?: number; // 0-1
  focal_y?: number; // 0-1
};

async function uploadOne(file: File): Promise<string> {
  return uploadBlogImage(file);
}

/**
 * Rich image upload — drag/drop, alt text required, draggable focal point.
 * Accepts either a string URL (legacy) or an ImageValue object.
 */
export function ImageUpload({
  value,
  onChange,
  label,
  aspect = "aspect-[16/10]",
}: {
  value: string | ImageValue | null | undefined;
  onChange: (v: ImageValue) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const normalized: ImageValue = typeof value === "string"
    ? { url: value || "", alt: "", focal_x: 0.5, focal_y: 0.5 }
    : value ?? { url: "", alt: "", focal_x: 0.5, focal_y: 0.5 };

  const handleFile = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setBusy(true);
      setErr(null);
      try {
        const url = await uploadOne(file);
        onChange({ ...normalized, url, focal_x: 0.5, focal_y: 0.5 });
      } catch (e: any) {
        setErr(e.message ?? "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [onChange, normalized]
  );

  function handleFocalDrag(e: MouseEvent | TouchEvent) {
    const el = previewRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : (e as MouseEvent);
    const x = Math.min(1, Math.max(0, (point.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (point.clientY - rect.top) / rect.height));
    onChange({ ...normalized, focal_x: x, focal_y: y });
  }

  const fx = (normalized.focal_x ?? 0.5) * 100;
  const fy = (normalized.focal_y ?? 0.5) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div
        ref={previewRef}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => { if (!normalized.url) inputRef.current?.click(); }}
        className={`relative ${aspect} border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
          drag ? "border-primary bg-primary/5" : "border-border hover:border-foreground/40 bg-surface"
        }`}
      >
        {normalized.url ? (
          <>
            <img
              src={normalized.url}
              alt={normalized.alt || ""}
              className="size-full object-cover select-none"
              style={{ objectPosition: `${fx}% ${fy}%` }}
              draggable={false}
            />
            {/* Focal point handle */}
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                const move = (ev: MouseEvent) => handleFocalDrag(ev as any);
                const up = () => {
                  window.removeEventListener("mousemove", move);
                  window.removeEventListener("mouseup", up);
                };
                window.addEventListener("mousemove", move);
                window.addEventListener("mouseup", up);
              }}
              className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary/80 shadow-lg cursor-move grid place-items-center"
              style={{ left: `${fx}%`, top: `${fy}%` }}
              title="Drag to set focal point"
            >
              <Move className="size-3 text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange({ url: "", alt: "", focal_x: 0.5, focal_y: 0.5 }); }}
              className="absolute top-2 right-2 size-8 grid place-items-center bg-background/90 border border-border rounded-full"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="absolute bottom-2 right-2 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-background/90 border border-border"
            >
              Replace
            </button>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center px-4">
            {busy ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <Upload className="size-6" />
                <p className="text-xs font-medium">Drop photo or click to upload</p>
                <p className="text-[10px]">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {normalized.url && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Alt text (describe the image — improves accessibility & SEO)"
            value={normalized.alt ?? ""}
            onChange={(e) => onChange({ ...normalized, alt: e.target.value })}
            className="ipt"
          />
          <p className="text-[10px] text-muted-foreground font-mono">
            Drag the dot to set the focal point — that area stays visible when the image is cropped.
          </p>
        </div>
      )}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

export function ImageMultiUpload({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadOne(f));
      onChange([...(value ?? []), ...urls]);
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      )}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {(value ?? []).map((url, i) => (
          <div key={i} className="relative aspect-square bg-surface border border-border overflow-hidden">
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 right-1.5 size-6 grid place-items-center bg-background/90 border border-border rounded-full"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`aspect-square border-2 border-dashed cursor-pointer grid place-items-center text-muted-foreground transition-all ${
            drag ? "border-primary bg-primary/5" : "border-border hover:border-foreground/40"
          }`}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}

/** Helper: pull `{url, alt, focal_x, focal_y}` from any legacy shape. */
export function readImage(v: any): ImageValue | null {
  if (!v) return null;
  if (typeof v === "string") return { url: v, alt: "", focal_x: 0.5, focal_y: 0.5 };
  if (typeof v === "object" && v.url) return {
    url: v.url, alt: v.alt ?? "", focal_x: v.focal_x ?? 0.5, focal_y: v.focal_y ?? 0.5,
  };
  return null;
}

/** Apply focal-point object-position to a normal <img> */
export function focalStyle(img: ImageValue | null | undefined): CSSProperties {
  if (!img) return {};
  const x = (img.focal_x ?? 0.5) * 100;
  const y = (img.focal_y ?? 0.5) * 100;
  return { objectPosition: `${x}% ${y}%` };
}

// (intentionally unused but keeps tree-shake hint) for SSR safety on useEffect import
export function _useNoop() { useEffect(() => {}, []); }
