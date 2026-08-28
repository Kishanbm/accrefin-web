import { supabase, isSupabaseConfigured } from "../../../../lib/supabaseClient";

/** Convert a File to a data URL (local fallback only). */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image for blog use.
 * Prefers Supabase Storage (public URL). Falls back to data URL only if Storage fails
 * and the file is small enough to fit in the DB column.
 */
export async function uploadBlogImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, WebP, GIF).");
  }
  // Keep uploads reasonable for storage + page load
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image is too large (max 8 MB). Compress it and try again.");
  }

  if (isSupabaseConfigured()) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });
    if (error) {
      throw new Error(`Image upload failed: ${error.message}. Stay signed in as admin and try again.`);
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    if (!data?.publicUrl) throw new Error("Upload succeeded but public URL was empty.");
    return data.publicUrl;
  }

  // Local-only fallback
  if (file.size > 1.5 * 1024 * 1024) {
    throw new Error("Without Supabase Storage, images must be under 1.5 MB.");
  }
  return fileToDataUrl(file);
}
