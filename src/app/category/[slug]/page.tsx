import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { CategoryPageContent } from "@/components/sections/category/category-page-content";
import { fetchCategoryBySlug } from "@/services/catalog.service";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const breadcrumbs = category.parent
    ? [
        { label: "Home", href: "/" },
        { label: category.parent.name, href: `/category/${category.parent.slug}` },
        { label: category.name },
      ]
    : [
        { label: "Home", href: "/" },
        { label: category.name },
      ];

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title={category.name}
      description={
        category.description ??
        `Browse our curated collection of ${category.name.toLowerCase()}.`
      }
    >
      <CategoryPageContent category={category} />
    </PageShell>
  );
}
