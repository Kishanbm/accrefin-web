import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import {
  Type, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Image as ImgIcon,
  Minus, Table as TableIcon, Youtube as YtIcon, Bold, Italic, Underline as ULIcon,
  Strikethrough, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Highlighter, Trash2, MessageSquare, Star, AlertTriangle, Info,
  CheckCircle2, HelpCircle, Users, TrendingUp, BookOpen, Mail, Zap, Columns,
  ChevronsUpDown, Hash, Twitter, Instagram, ChevronDown, Sigma, Terminal, Music,
  Video as VideoIcon, FileDown, PaintBucket,
} from "lucide-react";
import { useRef, useState, useEffect, type ComponentType, type ReactNode } from "react";
import { uploadBlogImage } from "./media";

const TEXT_COLORS = ["#0f172a", "#1f2937", "#475569", "#64748b", "#94a3b8", "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#16a34a", "#0d9488", "#0891b2", "#2563eb", "#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#e11d48", "#ffffff"];
const BG_COLORS = ["#fef3c7", "#fde68a", "#fecaca", "#fed7aa", "#bbf7d0", "#bfdbfe", "#ddd6fe", "#fbcfe8", "#e2e8f0", "#0f172a"];
const FONT_SIZES = [
  { label: "S", value: "14px" },
  { label: "M", value: "16px" },
  { label: "L", value: "20px" },
  { label: "XL", value: "28px" },
  { label: "XXL", value: "40px" },
];
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans", value: "Inter, system-ui, sans-serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
  { label: "Display", value: "'Inter Tight', sans-serif" },
];

async function uploadFile(file: File): Promise<string> {
  return uploadBlogImage(file);
}

type BlockDef = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  group: "Text" | "Structure" | "Callouts" | "Media" | "Layout";
  insert: (editor: Editor, ctx: { uploadImage: () => void; uploadGallery: () => void; uploadAudio: () => void; uploadVideo: () => void; uploadAnyFile: () => void }) => unknown;
};

function html(strings: TemplateStringsArray, ...vals: string[]) {
  return strings.reduce((acc, s, i) => acc + s + (vals[i] ?? ""), "");
}

const KEY_MOMENTS_HTML = html`
<div class="wp-block-keymoments" data-block="key-moments">
  <p class="wp-block-label">Key Moments</p>
  <ol>
    <li><strong>First moment title</strong><br/>Short description of what happened.</li>
    <li><strong>Second moment title</strong><br/>Short description of what happened.</li>
    <li><strong>Third moment title</strong><br/>Short description of what happened.</li>
  </ol>
</div>
<p></p>`;

const QUESTIONS_HTML = html`
<div class="wp-block-questions" data-block="questions">
  <p class="wp-block-label">Questions Answered</p>
  <ul>
    <li><strong>What is the question?</strong><br/>The answer goes here.</li>
    <li><strong>Another question?</strong><br/>Another answer here.</li>
  </ul>
</div>
<p></p>`;

const PULL_QUOTE_HTML = html`
<blockquote class="wp-block-pullquote"><p>"Drop a powerful pull quote here."</p><cite>— Source</cite></blockquote>
<p></p>`;

const CALLOUT_HTML = html`
<div class="wp-block-callout" data-block="callout">
  <p class="wp-block-label">Heads up</p>
  <p>Use this callout for important notes, warnings, or asides.</p>
</div>
<p></p>`;

function buttonHTML(label: string, url: string) {
  return html`<p class="wp-block-buttonwrap"><a class="wp-block-button" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></p><p></p>`;
}

function galleryHTML(urls: string[]) {
  const items = urls.map((u) => `<figure><img src="${u}" alt="" /></figure>`).join("");
  return `<div class="wp-block-gallery" data-block="gallery">${items}</div><p></p>`;
}

const INFO_HTML = html`<div class="wp-block-callout wp-callout-info" data-tone="info"><p class="wp-block-label">Info</p><p>Helpful context or background information.</p></div><p></p>`;
const WARN_HTML = html`<div class="wp-block-callout wp-callout-warn" data-tone="warn"><p class="wp-block-label">Warning</p><p>Something the reader should be careful about.</p></div><p></p>`;
const SUCCESS_HTML = html`<div class="wp-block-callout wp-callout-success" data-tone="success"><p class="wp-block-label">Success</p><p>A positive result or confirmation.</p></div><p></p>`;
const TIP_HTML = html`<div class="wp-block-callout wp-callout-tip" data-tone="tip"><p class="wp-block-label">Pro tip</p><p>A shortcut or insider recommendation.</p></div><p></p>`;
const TLDR_HTML = html`<div class="wp-block-tldr" data-block="tldr"><p class="wp-block-label">TL;DR</p><p>One-sentence summary of the whole article.</p></div><p></p>`;
const STATS_HTML = html`<div class="wp-block-stats" data-block="stats"><div><strong>72%</strong><span>Metric label</span></div><div><strong>3.4×</strong><span>Metric label</span></div><div><strong>$1.2B</strong><span>Metric label</span></div></div><p></p>`;
const TWOCOL_HTML = html`<div class="wp-block-twocol" data-block="twocol"><div><h3>Left column</h3><p>Content on the left.</p></div><div><h3>Right column</h3><p>Content on the right.</p></div></div><p></p>`;
const TIMELINE_HTML = html`<div class="wp-block-timeline" data-block="timeline"><ol><li><strong>2019</strong> — Something happened.</li><li><strong>2022</strong> — Another milestone.</li><li><strong>2026</strong> — Today.</li></ol></div><p></p>`;
const PROS_CONS_HTML = html`<div class="wp-block-proscons" data-block="proscons"><div class="pros"><p class="wp-block-label">Pros</p><ul><li>First pro</li><li>Second pro</li></ul></div><div class="cons"><p class="wp-block-label">Cons</p><ul><li>First con</li><li>Second con</li></ul></div></div><p></p>`;
const RATING_HTML = html`<div class="wp-block-rating" data-block="rating"><p class="wp-block-label">Editor's rating</p><p><strong>9.2 / 10</strong> — Exceptional. A few small compromises.</p></div><p></p>`;
const QUOTE_TWEET_HTML = html`<blockquote class="wp-block-tweet" data-block="tweet"><p>"Embed a tweet-style pull card here — paraphrase what was said and cite the source."</p><cite>— @source</cite></blockquote><p></p>`;
const NEWSLETTER_HTML = html`<div class="wp-block-newsletter" data-block="newsletter"><p class="wp-block-label">Stay in the loop</p><p>Subscribe to our weekly briefing.</p><p><a class="wp-block-button" href="/#subscribe">Subscribe</a></p></div><p></p>`;
const RELATED_HTML = html`<div class="wp-block-related" data-block="related"><p class="wp-block-label">Read also</p><ul><li><a href="#">Related story one</a></li><li><a href="#">Related story two</a></li></ul></div><p></p>`;
const AUTHOR_HTML = html`<div class="wp-block-authorbio" data-block="author"><p class="wp-block-label">About the author</p><p><strong>Author name</strong> — one-sentence bio and beat coverage.</p></div><p></p>`;
const SOURCES_HTML = html`<div class="wp-block-sources" data-block="sources"><p class="wp-block-label">Sources</p><ol><li><a href="#">Primary source 1</a></li><li><a href="#">Primary source 2</a></li></ol></div><p></p>`;
const CTA_HTML = html`<div class="wp-block-cta" data-block="cta"><h3>Ready to dive deeper?</h3><p>One-line pitch for the offer or link.</p><p><a class="wp-block-button" href="#">Take the next step</a></p></div><p></p>`;
const IFRAME_HTML = (src: string) => html`<div class="wp-block-embed"><iframe src="${src}" loading="lazy" allowfullscreen></iframe></div><p></p>`;
const TWITTER_EMBED_HTML = (url: string) => html`<blockquote class="wp-block-tweet-embed"><p>Tweet from <a href="${url}" target="_blank" rel="noopener">${url}</a></p></blockquote><p></p>`;
const INSTA_EMBED_HTML = (url: string) => html`<blockquote class="wp-block-insta-embed"><p>Instagram post: <a href="${url}" target="_blank" rel="noopener">${url}</a></p></blockquote><p></p>`;

const DETAILS_HTML = html`<details class="wp-block-details" open><summary>Click to expand</summary><p>Hidden content revealed when opened.</p></details><p></p>`;
const MATH_HTML = html`<div class="wp-block-math" data-block="math"><code>E = mc^2</code></div><p></p>`;
const PRE_HTML = html`<pre class="wp-block-pre"><code>// preformatted text
line 1
line 2</code></pre><p></p>`;
const HIGHLIGHT_PARA_HTML = html`<p class="wp-block-highlight" style="background:#fef3c7;padding:1em 1.25em;border-left:4px solid #d97706;">Highlighted paragraph — tinted background stretches full width. Change color from the Inspector.</p><p></p>`;
const AUDIO_HTML = (url: string, name: string) => html`<figure class="wp-block-audio"><audio controls src="${url}"></audio><figcaption>${name}</figcaption></figure><p></p>`;
const VIDEO_HTML = (url: string) => html`<figure class="wp-block-video"><video controls src="${url}" style="width:100%"></video></figure><p></p>`;
const FILE_HTML = (url: string, name: string, size: string) => html`<div class="wp-block-file"><a href="${url}" download><strong>${name}</strong><span>${size} · download</span></a></div><p></p>`;

const BLOCKS: BlockDef[] = [
  // TEXT
  { id: "paragraph", label: "Paragraph", icon: Type, group: "Text", insert: (e) => e.chain().focus().setParagraph().run() },
  { id: "h1", label: "H1", icon: Heading1, group: "Text", insert: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: "h2", label: "H2", icon: Heading2, group: "Text", insert: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: "h3", label: "H3", icon: Heading3, group: "Text", insert: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: "ul", label: "List", icon: List, group: "Text", insert: (e) => e.chain().focus().toggleBulletList().run() },
  { id: "ol", label: "Numbered", icon: ListOrdered, group: "Text", insert: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: "quote", label: "Quote", icon: Quote, group: "Text", insert: (e) => e.chain().focus().toggleBlockquote().run() },
  { id: "code", label: "Code", icon: Code, group: "Text", insert: (e) => e.chain().focus().toggleCodeBlock().run() },
  { id: "preformatted", label: "Preformatted", icon: Terminal, group: "Text", insert: (e) => e.chain().focus().insertContent(PRE_HTML).run() },
  { id: "details", label: "Details", icon: ChevronDown, group: "Text", insert: (e) => e.chain().focus().insertContent(DETAILS_HTML).run() },
  { id: "math", label: "Math", icon: Sigma, group: "Text", insert: (e) => e.chain().focus().insertContent(MATH_HTML).run() },
  { id: "highlight-para", label: "Highlight ¶", icon: PaintBucket, group: "Text", insert: (e) => e.chain().focus().insertContent(HIGHLIGHT_PARA_HTML).run() },
  // STRUCTURE — editorial presets
  { id: "keymoments", label: "Key Moments", icon: ListOrdered, group: "Structure", insert: (e) => e.chain().focus().insertContent(KEY_MOMENTS_HTML).run() },
  { id: "questions", label: "Q & A", icon: HelpCircle, group: "Structure", insert: (e) => e.chain().focus().insertContent(QUESTIONS_HTML).run() },
  { id: "pullquote", label: "Pull Quote", icon: Quote, group: "Structure", insert: (e) => e.chain().focus().insertContent(PULL_QUOTE_HTML).run() },
  { id: "tldr", label: "TL;DR", icon: BookOpen, group: "Structure", insert: (e) => e.chain().focus().insertContent(TLDR_HTML).run() },
  { id: "stats", label: "Stat Row", icon: TrendingUp, group: "Structure", insert: (e) => e.chain().focus().insertContent(STATS_HTML).run() },
  { id: "timeline", label: "Timeline", icon: ChevronsUpDown, group: "Structure", insert: (e) => e.chain().focus().insertContent(TIMELINE_HTML).run() },
  { id: "proscons", label: "Pros / Cons", icon: Columns, group: "Structure", insert: (e) => e.chain().focus().insertContent(PROS_CONS_HTML).run() },
  { id: "rating", label: "Rating", icon: Star, group: "Structure", insert: (e) => e.chain().focus().insertContent(RATING_HTML).run() },
  { id: "sources", label: "Sources", icon: Hash, group: "Structure", insert: (e) => e.chain().focus().insertContent(SOURCES_HTML).run() },
  { id: "author", label: "Author bio", icon: Users, group: "Structure", insert: (e) => e.chain().focus().insertContent(AUTHOR_HTML).run() },
  // CALLOUTS
  { id: "callout", label: "Callout", icon: Highlighter, group: "Callouts", insert: (e) => e.chain().focus().insertContent(CALLOUT_HTML).run() },
  { id: "callout-info", label: "Info", icon: Info, group: "Callouts", insert: (e) => e.chain().focus().insertContent(INFO_HTML).run() },
  { id: "callout-warn", label: "Warning", icon: AlertTriangle, group: "Callouts", insert: (e) => e.chain().focus().insertContent(WARN_HTML).run() },
  { id: "callout-tip", label: "Pro tip", icon: Zap, group: "Callouts", insert: (e) => e.chain().focus().insertContent(TIP_HTML).run() },
  { id: "callout-ok", label: "Success", icon: CheckCircle2, group: "Callouts", insert: (e) => e.chain().focus().insertContent(SUCCESS_HTML).run() },
  { id: "tweet-quote", label: "Tweet quote", icon: MessageSquare, group: "Callouts", insert: (e) => e.chain().focus().insertContent(QUOTE_TWEET_HTML).run() },
  {
    id: "button", label: "Link Button", icon: LinkIcon, group: "Callouts",
    insert: (e) => {
      const label = window.prompt("Button label", "Read more"); if (!label) return;
      const url = window.prompt("Button URL", "https://"); if (!url) return;
      e.chain().focus().insertContent(buttonHTML(label, url)).run();
    },
  },
  { id: "cta", label: "CTA Block", icon: Zap, group: "Callouts", insert: (e) => e.chain().focus().insertContent(CTA_HTML).run() },
  { id: "newsletter", label: "Newsletter", icon: Mail, group: "Callouts", insert: (e) => e.chain().focus().insertContent(NEWSLETTER_HTML).run() },
  { id: "related", label: "Read Also", icon: BookOpen, group: "Callouts", insert: (e) => e.chain().focus().insertContent(RELATED_HTML).run() },
  // MEDIA
  { id: "image", label: "Image", icon: ImgIcon, group: "Media", insert: (_, ctx) => ctx.uploadImage() },
  { id: "gallery", label: "Gallery", icon: ImgIcon, group: "Media", insert: (_, ctx) => ctx.uploadGallery() },
  {
    id: "youtube", label: "YouTube", icon: YtIcon, group: "Media", insert: (e) => {
      const url = window.prompt("YouTube URL"); if (!url) return;
      e.chain().focus().setYoutubeVideo({ src: url, width: 640, height: 360 }).run();
    },
  },
  {
    id: "twitter-embed", label: "Tweet", icon: Twitter, group: "Media", insert: (e) => {
      const url = window.prompt("Tweet URL"); if (!url) return;
      e.chain().focus().insertContent(TWITTER_EMBED_HTML(url)).run();
    },
  },
  {
    id: "insta-embed", label: "Instagram", icon: Instagram, group: "Media", insert: (e) => {
      const url = window.prompt("Instagram post URL"); if (!url) return;
      e.chain().focus().insertContent(INSTA_EMBED_HTML(url)).run();
    },
  },
  {
    id: "iframe", label: "Embed", icon: YtIcon, group: "Media", insert: (e) => {
      const url = window.prompt("Embed URL (Spotify, Vimeo, CodePen, …)"); if (!url) return;
      e.chain().focus().insertContent(IFRAME_HTML(url)).run();
    },
  },
  { id: "audio", label: "Audio", icon: Music, group: "Media", insert: (_, ctx) => ctx.uploadAudio() },
  { id: "video", label: "Video", icon: VideoIcon, group: "Media", insert: (_, ctx) => ctx.uploadVideo() },
  { id: "file", label: "File", icon: FileDown, group: "Media", insert: (_, ctx) => ctx.uploadAnyFile() },
  // LAYOUT
  { id: "divider", label: "Divider", icon: Minus, group: "Layout", insert: (e) => e.chain().focus().setHorizontalRule().run() },
  { id: "twocol", label: "Two columns", icon: Columns, group: "Layout", insert: (e) => e.chain().focus().insertContent(TWOCOL_HTML).run() },
  {
    id: "table", label: "Table", icon: TableIcon, group: "Layout", insert: (e) =>
      e.chain().focus().insertContent(TABLE_HTML_PROMPT(e)).run(),
  },
  { id: "spacer", label: "Spacer", icon: Minus, group: "Layout", insert: (e) => e.chain().focus().insertContent('<div class="wp-block-spacer" style="height:48px"></div><p></p>').run() },
];

function TABLE_HTML_PROMPT(e: Editor) {
  e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  return "";
}


export function WPEditor({
  value, onChange, placeholder = "Start writing your story…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [, force] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "wp-img" } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      Youtube.configure({ controls: true, nocookie: true }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "wp-canvas focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: () => force((n) => n + 1),
    onTransaction: () => force((n) => n + 1),
  });

  const galleryRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const anyFileRef = useRef<HTMLInputElement>(null);
  async function uploadImage() { fileRef.current?.click(); }
  async function uploadGallery() { galleryRef.current?.click(); }
  async function uploadAudio() { audioRef.current?.click(); }
  async function uploadVideo() { videoRef.current?.click(); }
  async function uploadAnyFile() { anyFileRef.current?.click(); }
  async function onPickFile(file?: File) {
    if (!file || !editor) return;
    const url = await uploadFile(file);
    const alt = window.prompt("Alt text (describe the image for accessibility):") || "";
    editor.chain().focus().setImage({ src: url, alt }).run();
  }
  async function onPickGallery(files?: FileList | null) {
    if (!files || !editor) return;
    const urls: string[] = [];
    for (const file of Array.from(files)) urls.push(await uploadFile(file));
    if (urls.length) editor.chain().focus().insertContent(galleryHTML(urls)).run();
  }
  async function onPickAudio(file?: File) {
    if (!file || !editor) return;
    const url = await uploadFile(file);
    editor.chain().focus().insertContent(AUDIO_HTML(url, file.name)).run();
  }
  async function onPickVideo(file?: File) {
    if (!file || !editor) return;
    const url = await uploadFile(file);
    editor.chain().focus().insertContent(VIDEO_HTML(url)).run();
  }
  async function onPickAnyFile(file?: File) {
    if (!file || !editor) return;
    const url = await uploadFile(file);
    const size = file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    editor.chain().focus().insertContent(FILE_HTML(url, file.name, size)).run();
  }

  if (!editor) {
    return <div className="border border-border bg-surface min-h-[600px] grid place-items-center text-sm text-muted-foreground">Loading editor…</div>;
  }

  return (
    <div className="wp-shell border border-border bg-surface flex" style={{ minHeight: "75vh" }}>
      {/* LEFT — block inserter */}
      <aside className="w-56 shrink-0 border-r border-border bg-background p-3 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Add Block</p>
        {(["Text", "Structure", "Callouts", "Media", "Layout"] as const).map((group) => (
          <div key={group} className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 px-1">{group}</p>
            <div className="grid grid-cols-3 gap-1">
              {BLOCKS.filter((b) => b.group === group).map((b) => {
                const Icon = b.icon;
                return (
                  <button
                    key={b.id}
                    type="button"
                    title={b.label}
                    onClick={() => b.insert(editor, { uploadImage, uploadGallery, uploadAudio, uploadVideo, uploadAnyFile })}
                    className="aspect-square flex flex-col items-center justify-center gap-1 border border-border hover:border-primary hover:bg-surface text-[9px] uppercase tracking-wide p-1 transition"
                  >
                    <Icon className="size-4" />
                    <span className="leading-none text-center">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>


      {/* MIDDLE — canvas with floating toolbar */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Toolbar editor={editor} onInsertImage={uploadImage} />
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-[760px] mx-auto">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* RIGHT — inspector */}
      <Inspector editor={editor} />

      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => onPickFile(e.target.files?.[0] ?? undefined)}
      />
      <input
        ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => onPickGallery(e.target.files)}
      />
      <input ref={audioRef} type="file" accept="audio/*" className="hidden"
        onChange={(e) => onPickAudio(e.target.files?.[0] ?? undefined)} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden"
        onChange={(e) => onPickVideo(e.target.files?.[0] ?? undefined)} />
      <input ref={anyFileRef} type="file" className="hidden"
        onChange={(e) => onPickAnyFile(e.target.files?.[0] ?? undefined)} />

    </div>
  );
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  const Btn = ({ on, active, title, children }: any) => (
    <button
      type="button"
      onClick={on}
      title={title}
      className={`size-8 grid place-items-center rounded hover:bg-surface transition ${active ? "bg-surface text-primary" : "text-foreground/80"}`}
    >
      {children}
    </button>
  );
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border flex flex-wrap items-center gap-0.5 p-1.5">
      <Btn on={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="size-4" /></Btn>
      <Sep />
      <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><ULIcon className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough className="size-4" /></Btn>
      <Sep />
      <Btn on={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Left"><AlignLeft className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Center"><AlignCenter className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Right"><AlignRight className="size-4" /></Btn>
      <Btn on={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify"><AlignJustify className="size-4" /></Btn>
      <Sep />
      <Btn
        on={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("Link URL", prev ?? "https://");
          if (url === null) return;
          if (url === "") editor.chain().focus().unsetLink().run();
          else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }}
        active={editor.isActive("link")}
        title="Link"
      >
        <LinkIcon className="size-4" />
      </Btn>
      <Btn on={onInsertImage} title="Insert image"><ImgIcon className="size-4" /></Btn>
    </div>
  );
}

function Sep() { return <span className="w-px h-6 bg-border mx-1" />; }

function Inspector({ editor }: { editor: Editor }) {
  const [view, setView] = useState<"block" | "post">("block");
  const isHeading = editor.isActive("heading");
  const isImage = editor.isActive("image");
  const isLink = editor.isActive("link");
  const isTable = editor.isActive("table");
  const isList = editor.isActive("bulletList") || editor.isActive("orderedList");
  const isQuote = editor.isActive("blockquote");

  function currentBlockLabel() {
    if (isImage) return "Image";
    if (isTable) return "Table";
    if (isList) return "List";
    if (isQuote) return "Quote";
    if (editor.isActive("codeBlock")) return "Code";
    if (isHeading) {
      const lvl = editor.getAttributes("heading").level;
      return `Heading ${lvl}`;
    }
    return "Paragraph";
  }

  const currentColor = (editor.getAttributes("textStyle").color as string) || "";
  const currentSize = (editor.getAttributes("textStyle").fontSize as string) || "";
  const currentFamily = (editor.getAttributes("textStyle").fontFamily as string) || "";

  return (
    <aside className="w-72 shrink-0 border-l border-border bg-background overflow-y-auto">
      <div className="flex border-b border-border text-[10px] uppercase tracking-widest font-bold">
        {(["block", "post"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`flex-1 py-3 ${view === v ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "block" && (
        <div className="p-4 space-y-5 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Selected</p>
            <p className="font-display text-lg mt-1">{currentBlockLabel()}</p>
          </div>

          {/* Color */}
          <Group label="Color">
            <p className="text-[10px] text-muted-foreground mb-1.5">Text</p>
            <Swatches
              colors={TEXT_COLORS}
              active={currentColor}
              onPick={(c) => editor.chain().focus().setColor(c).run()}
              onClear={() => editor.chain().focus().unsetColor().run()}
            />
            <p className="text-[10px] text-muted-foreground mt-3 mb-1.5">Highlight</p>
            <Swatches
              colors={BG_COLORS}
              onPick={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()}
              onClear={() => editor.chain().focus().unsetHighlight().run()}
            />
          </Group>

          {/* Typography */}
          <Group label="Typography">
            <p className="text-[10px] text-muted-foreground mb-1.5">Font size</p>
            <div className="grid grid-cols-5 gap-1">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => editor.chain().focus().setFontSize(s.value).run()}
                  className={`py-1.5 text-xs border ${currentSize === s.value ? "border-primary text-primary" : "border-border"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 mb-1.5">Font family</p>
            <select
              className="ipt"
              value={currentFamily}
              onChange={(e) => {
                const v = e.target.value;
                if (v) editor.chain().focus().setFontFamily(v).run();
                else editor.chain().focus().unsetFontFamily().run();
              }}
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.label} value={f.value}>{f.label}</option>
              ))}
            </select>
          </Group>

          {/* Heading level */}
          {(isHeading || (!isImage && !isTable && !isList && !isQuote)) && (
            <Group label="Block level">
              <div className="grid grid-cols-4 gap-1">
                {[
                  { l: "P", on: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
                  { l: "H1", on: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
                  { l: "H2", on: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
                  { l: "H3", on: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
                ].map((b) => (
                  <button key={b.l} type="button" onClick={b.on}
                    className={`py-2 text-xs border ${b.active ? "border-primary text-primary" : "border-border"}`}>
                    {b.l}
                  </button>
                ))}
              </div>
            </Group>
          )}

          {/* Image controls */}
          {isImage && (
            <Group label="Image">
              <p className="text-[10px] text-muted-foreground mb-1.5">Alt text</p>
              <input
                className="ipt"
                value={(editor.getAttributes("image").alt as string) || ""}
                onChange={(e) => editor.chain().focus().updateAttributes("image", { alt: e.target.value }).run()}
                placeholder="Describe the image"
              />
              <p className="text-[10px] text-muted-foreground mt-3 mb-1.5">Width</p>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { l: "Small", w: "320px" },
                  { l: "Medium", w: "560px" },
                  { l: "Full", w: "100%" },
                ].map((w) => (
                  <button key={w.l} type="button"
                    onClick={() => editor.chain().focus().updateAttributes("image", { width: w.w }).run()}
                    className="py-1.5 text-xs border border-border">
                    {w.l}
                  </button>
                ))}
              </div>
              <button type="button"
                onClick={() => editor.chain().focus().deleteSelection().run()}
                className="mt-3 w-full py-2 text-xs uppercase tracking-widest border border-destructive text-destructive flex items-center justify-center gap-2">
                <Trash2 className="size-3" /> Delete
              </button>
            </Group>
          )}

          {/* Link controls */}
          {isLink && (
            <Group label="Link">
              <input
                className="ipt"
                value={(editor.getAttributes("link").href as string) || ""}
                onChange={(e) => editor.chain().focus().extendMarkRange("link").setLink({ href: e.target.value }).run()}
                placeholder="https://"
              />
              <button type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="mt-2 text-xs uppercase tracking-widest text-destructive">
                Remove link
              </button>
            </Group>
          )}

          {/* Table controls */}
          {isTable && (
            <Group label="Table">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <Mini on={() => editor.chain().focus().addRowAfter().run()}>+ Row</Mini>
                <Mini on={() => editor.chain().focus().addColumnAfter().run()}>+ Col</Mini>
                <Mini on={() => editor.chain().focus().deleteRow().run()}>- Row</Mini>
                <Mini on={() => editor.chain().focus().deleteColumn().run()}>- Col</Mini>
                <Mini on={() => editor.chain().focus().toggleHeaderRow().run()}>Header</Mini>
                <Mini on={() => editor.chain().focus().mergeOrSplit().run()}>Merge</Mini>
              </div>
              <button type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="mt-3 w-full py-2 text-xs uppercase tracking-widest border border-destructive text-destructive">
                Delete table
              </button>
            </Group>
          )}
        </div>
      )}

      {view === "post" && (
        <div className="p-4 text-sm text-muted-foreground">
          <p className="text-xs">Post-level settings (title, excerpt, cover, category, social) are managed in the sections below the editor.</p>
        </div>
      )}
    </aside>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-2">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function Mini({ on, children }: { on: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={on} className="py-1.5 border border-border hover:border-primary">
      {children}
    </button>
  );
}

function Swatches({
  colors, active, onPick, onClear,
}: { colors: string[]; active?: string; onPick: (c: string) => void; onClear: () => void }) {
  return (
    <div className="grid grid-cols-8 gap-1">
      {colors.map((c) => (
        <button key={c} type="button" onClick={() => onPick(c)} title={c}
          className={`size-6 rounded border ${active?.toLowerCase() === c.toLowerCase() ? "border-primary ring-2 ring-primary" : "border-border"}`}
          style={{ background: c }} />
      ))}
      <button type="button" onClick={onClear} title="Reset"
        className="size-6 rounded border border-border bg-background text-[10px] grid place-items-center">×</button>
    </div>
  );
}
