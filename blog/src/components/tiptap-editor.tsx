import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Image as ImgIcon,
  Link as LinkIcon, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Code, Minus,
  Strikethrough, Type, Palette,
} from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ["#0f172a", "#475569", "#94a3b8", "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#db2777"];

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000", upsert: false, contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error("Upload failed");
  return data.signedUrl;
}

export function TipTapEditor({
  value, onChange, placeholder = "Start writing your article…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showColors, setShowColors] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded" } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap-content prose-editorial min-h-[400px] focus:outline-none" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="border border-border bg-surface min-h-[500px] grid place-items-center text-muted-foreground text-sm">Loading editor…</div>;
  }

  const Btn = ({ on, active, children, title }: any) => (
    <button
      type="button"
      onClick={on}
      title={title}
      className={`size-9 grid place-items-center rounded hover:bg-surface transition ${active ? "bg-surface text-primary" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );

  async function insertImage() {
    fileRef.current?.click();
  }
  async function onPickImage(file?: File) {
    if (!file || !editor) return;
    const url = await uploadFile(file);
    const alt = window.prompt("Alt text for this image (describe it):") || "";
    editor.chain().focus().setImage({ src: url, alt }).run();
  }
  function insertLink() {
    if (!editor) return;
    const url = window.prompt("URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
  function setColor(c: string) {
    if (!editor) return;
    editor.chain().focus().setColor(c).run();
    setShowColors(false);
  }

  return (
    <div className="border border-border bg-background">
      {/* TOOLBAR — sticky */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border flex flex-wrap items-center gap-0.5 p-1.5">
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph"><Type className="size-4" /></Btn>
        <Divider />
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough className="size-4" /></Btn>
        <div className="relative">
          <Btn on={() => setShowColors((v) => !v)} active={showColors} title="Text color"><Palette className="size-4" /></Btn>
          {showColors && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-background border border-border p-2 grid grid-cols-6 gap-1 shadow-lg">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} className="size-6 rounded border border-border" style={{ background: c }} title={c} />
              ))}
              <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setShowColors(false); }} className="size-6 rounded border border-border grid place-items-center text-[10px] col-span-6 mt-1">Reset</button>
            </div>
          )}
        </div>
        <Divider />
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list"><ListOrdered className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote"><Quote className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block"><Code className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="size-4" /></Btn>
        <Divider />
        <Btn on={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenter className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight className="size-4" /></Btn>
        <Divider />
        <Btn on={insertLink} active={editor.isActive("link")} title="Insert link"><LinkIcon className="size-4" /></Btn>
        <Btn on={insertImage} title="Insert image"><ImgIcon className="size-4" /></Btn>
        <Divider />
        <Btn on={() => editor.chain().focus().undo().run()} title="Undo"><Undo className="size-4" /></Btn>
        <Btn on={() => editor.chain().focus().redo().run()} title="Redo"><Redo className="size-4" /></Btn>
      </div>

      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => onPickImage(e.target.files?.[0] ?? undefined)}
      />
    </div>
  );
}

function Divider() {
  return <span className="w-px h-6 bg-border mx-1" />;
}
