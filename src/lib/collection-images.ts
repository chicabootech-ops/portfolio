/** Static storefront images until admin uploads category artwork. */
export const DEFAULT_COLLECTION_IMAGE = "/collections/tulips.jpeg";

const COLLECTION_IMAGES_BY_SLUG: Record<string, string> = {
  "magazines-customisation": DEFAULT_COLLECTION_IMAGE,
  "song-book": "/collections/hibiscus-flowers.jpeg",
  "crochet-flowers-bunch": "/collections/tulip-crochet-bouque.jpeg",
  "single-bouquet": "/collections/tulip-crochet-bouque.jpeg",
  "bunch-flower-bouquet": "/collections/hibiscus-flowers.jpeg",
  "photograph-bouquet": "/collections/customised-travelling.jpeg",
  "customised-premium-hampers": "/collections/hibiscus-flowers.jpeg",
  "polaroid-pictures-box": "/collections/polaroid-picture-box.jpeg",
  "crochet-frames": "/collections/crochet-flower-pot.jpeg",
  "key-chains-crochet": "/collections/key-chains.jpeg",
};

export function resolveCollectionImage(slug: string, imageUrl?: string | null): string {
  const trimmed = imageUrl?.trim();
  if (trimmed) return trimmed;
  return COLLECTION_IMAGES_BY_SLUG[slug] ?? DEFAULT_COLLECTION_IMAGE;
}
