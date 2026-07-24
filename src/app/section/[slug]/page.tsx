import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import { fetchSectionBySlug } from "@/services/catalog.service";

type SectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const section = await fetchSectionBySlug(slug);
  if (!section) notFound();

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: section.name },
      ]}
      title={section.name}
      description={
        section.description ?? `Browse categories and gifts in ${section.name}.`
      }
    >
      <div className="mt-10 space-y-12">
        <section>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Categories</h2>
          {section.categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Categories coming soon.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {section.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border/30 bg-white/80 p-4 text-center shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="relative size-20 overflow-hidden rounded-full">
                    <ImageWithSkeleton
                      src={resolveCollectionImage(category.slug, category.image_url)}
                      alt={category.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      skeletonClassName="rounded-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {section.products.length > 0 ? (
          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {section.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/20">
                    <ImageWithSkeleton
                      src={
                        product.image_url ||
                        resolveCollectionImage(product.category_slug || section.slug, null)
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
        ) : null}
      </div>
    </PageShell>
  );
}
