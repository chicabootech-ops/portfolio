import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout";
import { categoryTitles } from "@/data/categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const title = categoryTitles[slug];

  if (!title) {
    notFound();
  }

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/category/trending" },
        { label: title },
      ]}
      title={title}
      description={`Browse our curated collection of ${title.toLowerCase()}.`}
    />
  );
}
