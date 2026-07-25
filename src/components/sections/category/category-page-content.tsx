"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import type { CatalogCategoryDetail, CatalogProduct } from "@/types/catalog";

type CategoryPageContentProps = {
  category: CatalogCategoryDetail;
};

type SortKey = "newest" | "price_asc" | "price_desc" | "name";

export function CategoryPageContent({ category }: CategoryPageContentProps) {
  const products = category.products ?? [];
  const isSection = category.kind === "section" || (!category.parent && category.children.length > 0);
  const [sort, setSort] = useState<SortKey>("newest");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list: CatalogProduct[] = [...products];
    const max = Number(maxPrice);
    if (maxPrice && !Number.isNaN(max) && max > 0) {
      list = list.filter((p) => p.price_paise <= max * 100);
    }
    if (sort === "price_asc") list.sort((a, b) => a.price_paise - b.price_paise);
    else if (sort === "price_desc") list.sort((a, b) => b.price_paise - a.price_paise);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, sort, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mt-10 space-y-10">
      {category.children.length > 0 ? (
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
            {isSection ? "Categories" : "Sub-categories"}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="group rounded-2xl border border-border/30 bg-white/80 p-4 text-center shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="relative mx-auto mb-3 size-16 overflow-hidden rounded-full">
                  <ImageWithSkeleton
                    src={resolveCollectionImage(child.slug, child.image_url)}
                    alt={child.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    skeletonClassName="rounded-full"
                  />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary">
                  {child.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {products.length > 0 ? (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Products ({filtered.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
                className="h-10 rounded-full border border-border/50 bg-white px-3 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="name">Name</option>
              </select>
              <input
                type="number"
                min={0}
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-28 rounded-full border border-border/50 bg-white px-3 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {pageItems.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex flex-col gap-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/20">
                  <ImageWithSkeleton
                    src={
                      product.image_url ||
                      resolveCollectionImage(product.category_slug || category.slug, null)
                    }
                    alt={product.name}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                <p className="text-sm font-semibold text-primary">
                  {formatPaise(product.price_paise)}
                </p>
              </Link>
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-10 rounded-full border border-border/50 px-4 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex h-10 items-center text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 rounded-full border border-border/50 px-4 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="rounded-2xl border border-border/30 bg-white/80 px-6 py-12 text-center shadow-sm">
          <p className="font-serif text-lg font-semibold text-foreground">Products coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re curating gifts for {category.name.toLowerCase()}. Check back shortly.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to home
          </Link>
        </section>
      )}
    </div>
  );
}
