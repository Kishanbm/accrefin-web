import { getPublishedPost, getPublishedPosts } from "./cmsStore";

export { getPublishedPosts as getAllPosts, getPublishedPost as getPostBySlug };

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
