import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import { fetchProductBySlug } from "@/services/catalog.service";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(product.category_slug && product.category_name
      ? [{ label: product.category_name, href: `/category/${product.category_slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <PageShell breadcrumbs={breadcrumbs} title={product.name}>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/20">
          <ImageWithSkeleton
            src={
              product.image_url ||
              resolveCollectionImage(product.category_slug || product.slug, null)
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          {product.category_name ? (
            <Link
              href={`/category/${product.category_slug}`}
              className="text-sm text-primary hover:underline"
            >
              {product.category_name}
            </Link>
          ) : null}
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground">
              {formatPaise(product.price_paise)}
            </span>
            {product.compare_at_price_paise ? (
              <span className="text-base text-muted-foreground line-through">
                {formatPaise(product.compare_at_price_paise)}
              </span>
            ) : null}
          </div>
          {product.short_description ? (
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              {product.short_description}
            </p>
          ) : null}
          {product.description ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
