export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  kind?: string | null;
};

export type CatalogCategoryParent = {
  name: string;
  slug: string;
  kind?: string | null;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description?: string | null;
  image_url: string | null;
  price_paise: number;
  compare_at_price_paise: number | null;
  primary_category_id: string;
  category_slug?: string | null;
  category_name?: string | null;
};

export type CatalogCategoryDetail = CatalogCategory & {
  parent: CatalogCategoryParent | null;
  children: CatalogCategory[];
  products?: CatalogProduct[];
  products_total?: number;
};

export type CatalogSection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  products: CatalogProduct[];
  categories: CatalogCategory[];
};

export type CatalogProductDetail = CatalogProduct & {
  brand?: string | null;
  is_featured?: boolean;
};
