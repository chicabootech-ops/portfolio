import { HomeHero } from "@/components/sections/home/home-hero";
import { ShopByCollectionSection } from "@/components/sections/home/shop-by-collection/shop-by-collection-section";
import { SectionProductsRail } from "@/components/sections/home/section-products-rail";
import { fetchSections } from "@/services/catalog.service";

export default async function HomePage() {
  let sections: Awaited<ReturnType<typeof fetchSections>> = [];
  let loadError = false;

  try {
    sections = await fetchSections();
  } catch {
    loadError = true;
  }

  return (
    <main className="min-h-screen overflow-x-hidden pb-16">
      <HomeHero />
      <div className="pt-6 sm:pt-8">
        <ShopByCollectionSection />
      </div>
      {loadError ? (
        <section className="w-full px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load homepage sections. Make sure the backend is running.
          </p>
        </section>
      ) : sections.length === 0 ? (
        <section className="w-full px-6 py-16 text-center">
          <p className="font-serif text-lg text-foreground">Coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            New gift sections will appear here once added from the admin panel.
          </p>
        </section>
      ) : (
        sections.map((section) => (
          <SectionProductsRail key={section.id} section={section} />
        ))
      )}
    </main>
  );
}
