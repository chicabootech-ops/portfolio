import { apiConfig } from "@/config/api";
import { resolveCollectionImage } from "@/lib/collection-images";
import type { CatalogCategory, CatalogCategoryDetail } from "@/types/catalog";

type CategoryListResponse = {
  items: CatalogCategory[];
};

export async function fetchCategories(): Promise<CatalogCategory[]> {
  const response = await fetch("/api/categories", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as CategoryListResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Could not load collections");
  }

  return (data.items ?? []).map((item) => ({
    ...item,
    image_url: resolveCollectionImage(item.slug, item.image_url),
  }));
}

export async function fetchCategoryBySlug(slug: string): Promise<CatalogCategoryDetail | null> {
  const response = await fetch(`${apiConfig.baseUrl}/api/categories/${encodeURIComponent(slug)}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  const data = (await response.json().catch(() => ({}))) as CatalogCategoryDetail & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Could not load category");
  }

  return {
    ...data,
    image_url: resolveCollectionImage(data.slug, data.image_url),
    children: (data.children ?? []).map((child) => ({
      ...child,
      image_url: resolveCollectionImage(child.slug, child.image_url),
    })),
    parent: data.parent ?? null,
  };
}
