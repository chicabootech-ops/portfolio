export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type CatalogCategoryParent = {
  name: string;
  slug: string;
};

export type CatalogCategoryDetail = CatalogCategory & {
  parent: CatalogCategoryParent | null;
  children: CatalogCategory[];
};
