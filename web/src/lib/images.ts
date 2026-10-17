/** Publieke URL van de gekopieerde afbeelding in Supabase Storage (of een lokaal demobeeld) */
export function productImageUrl(path?: string | null): string | null {
  if (path?.startsWith('/')) return path;
  const base = process.env.SUPABASE_PUBLIC_URL ?? process.env.SUPABASE_URL;
  if (!path || !base) return null;
  return `${base}/storage/v1/object/public/product-images/${path}`;
}
