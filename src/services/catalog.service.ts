import { apiConfig } from "@/config/api";
import { resolveCollectionImage } from "@/lib/collection-images";
import type {
  CatalogCategory,
  CatalogCategoryDetail,
  CatalogProductDetail,
  CatalogSection,
} from "@/types/catalog";

type CategoryListResponse = {
  items: CatalogCategory[];
};

type SectionListResponse = {
  items: CatalogSection[];
};

function withResolvedImages(category: CatalogCategory): CatalogCategory {
  return {
    ...category,
    image_url: resolveCollectionImage(category.slug, category.image_url),
  };
}

export async function fetchSections(): Promise<CatalogSection[]> {
  const url =
    typeof window === "undefined"
      ? `${apiConfig.baseUrl}/api/sections`
      : "/api/sections";
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as SectionListResponse & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? "Could not load sections");
  }
  return (data.items ?? []).map((section) => ({
    ...section,
    image_url: resolveCollectionImage(section.slug, section.image_url),
    categories: (section.categories ?? []).map(withResolvedImages),
    products: (section.products ?? []).map((p) => ({
      ...p,
      image_url: p.image_url || resolveCollectionImage(p.category_slug || section.slug, null),
    })),
  }));
}

export async function fetchSectionBySlug(slug: string): Promise<CatalogSection | null> {
  const response = await fetch(
    `${apiConfig.baseUrl}/api/sections/${encodeURIComponent(slug)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );
  if (response.status === 404) return null;
  const data = (await response.json().catch(() => ({}))) as CatalogSection & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Could not load section");
  }
  return {
    ...data,
    image_url: resolveCollectionImage(data.slug, data.image_url),
    categories: (data.categories ?? []).map(withResolvedImages),
    products: data.products ?? [],
  };
}

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
    products: data.products ?? [],
    parent: data.parent ?? null,
  };
}

export async function fetchProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  const response = await fetch(
    `${apiConfig.baseUrl}/api/products/${encodeURIComponent(slug)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }
  );
  if (response.status === 404) return null;
  const data = (await response.json().catch(() => ({}))) as CatalogProductDetail & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error ?? "Could not load product");
  }
  return data;
}
