import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ProductDetailView } from "@/components/commerce/product-detail-view";
import { ProductReviews } from "@/components/commerce/product-reviews";
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
      <ProductDetailView product={product} />
      <ProductReviews slug={product.slug} />
    </PageShell>
  );
}
