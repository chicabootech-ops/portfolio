import { notFound } from "next/navigation";

const categoryTitles: Record<string, string> = {
  trending: "Trending Flowers",
  personalized: "Personalized Roses",
  garlands: "Bespoke Garlands",
  "gifts-her": "Gifts for Her",
  corporate: "Corporate Gifting",
};

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
    <main className="min-h-screen pt-36 md:pt-40 px-6 md:px-8 pb-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
        {title}
      </h1>
      <p className="mt-4 text-muted-foreground max-w-xl">
        Browse our curated collection of {title.toLowerCase()}.
      </p>
    </main>
  );
}
