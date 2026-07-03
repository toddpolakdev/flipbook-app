/**
 * Builds a URL-safe slug from a title, with a short random suffix so two
 * flipbooks that share a title (or have no title) never collide.
 */
export function generateSlug(title: string): string {
  const base = (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> hyphens
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 40)
    .replace(/-+$/g, ""); // re-trim in case slice left a trailing hyphen

  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `flipbook-${suffix}`;
}
