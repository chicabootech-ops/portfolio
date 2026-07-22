import Link from "next/link";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import type { CatalogCategoryDetail } from "@/types/catalog";

type CategoryPageContentProps = {
  category: CatalogCategoryDetail;
};

export function CategoryPageContent({ category }: CategoryPageContentProps) {
  const products = category.products ?? [];
  const isSection = category.kind === "section" || (!category.parent && category.children.length > 0);

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
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
            Products ({category.products_total ?? products.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
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
