"use client";

import { SectionProductsRail } from "@/components/sections/home/section-products-rail";
import { useSections } from "@/hooks/useSections";

export function HomeSections() {
  const { data: sections = [], isLoading, isError } = useSections();

  if (isLoading) {
    return (
      <section className="w-full px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">Loading collections…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load homepage sections. Make sure the backend is running.
        </p>
      </section>
    );
  }

  if (sections.length === 0) {
    return (
      <section className="w-full px-6 py-16 text-center">
        <p className="font-serif text-lg text-foreground">Coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          New gift sections will appear here once added from the admin panel.
        </p>
      </section>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <SectionProductsRail key={section.id} section={section} />
      ))}
    </>
  );
}
