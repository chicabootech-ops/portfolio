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
    <main className="min-h-screen overflow-x-hidden pt-19 sm:pt-21 lg:pt-40 pb-16">
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
