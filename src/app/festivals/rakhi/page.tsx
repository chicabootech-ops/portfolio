import Link from "next/link";
import { SectionProductsRail } from "@/components/sections/home/section-products-rail";
import { fetchSections } from "@/services/catalog.service";
import type { CatalogSection } from "@/types/catalog";

function isRakhiSection(section: CatalogSection): boolean {
  const slug = section.slug.toLowerCase();
  const name = section.name.toLowerCase();
  const campaign = section.metadata?.campaign ?? section.metadata?.festival;
  if (campaign === "rakhi") return true;
  return slug.includes("rakhi") || name.includes("rakhi");
}

function nextRakhiDate(): Date {
  const year = new Date().getFullYear();
  let d = new Date(Date.UTC(year, 7, 28, 18, 30, 0));
  if (d.getTime() < Date.now()) d = new Date(Date.UTC(year + 1, 7, 28, 18, 30, 0));
  return d;
}

export default async function RakhiFestivalPage() {
  let sections: CatalogSection[] = [];
  try {
    sections = await fetchSections();
  } catch {
    sections = [];
  }

  // Product rails only from admin/DB — never invent product lists in code.
  const rails = sections.filter(isRakhiSection);
  const daysLeft = Math.max(
    0,
    Math.ceil((nextRakhiDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <main className="min-h-screen overflow-x-hidden pb-16">
      <section className="relative isolate overflow-hidden border-b border-border/20">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/collections/premium-blooms.jpg)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="mx-auto flex min-h-[58vh] max-w-5xl flex-col justify-end px-6 pb-12 pt-28">
          <p className="font-logo text-4xl italic text-primary sm:text-5xl">Chic A Boo</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Rakhi Festival
          </h1>
          <p className="mt-3 max-w-lg text-sm text-foreground/80 sm:text-base">
            Curated threads, sweets, and keepsakes — driven by live catalog sections from admin.
          </p>
          <p className="mt-5 text-sm font-medium text-primary">
            {daysLeft === 0 ? "Rakhi is here" : `${daysLeft} days to celebrate`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#collections"
              className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground"
            >
              Shop collections
            </Link>
            <Link
              href="/search?q=rakhi"
              className="inline-flex h-11 items-center rounded-full border border-primary/35 bg-white/70 px-7 text-sm font-semibold backdrop-blur"
            >
              Search Rakhi gifts
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading text-xl font-semibold">Delivery notes</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Same-day and express options depend on your pincode and cut-off times. Shipping rules will
          refine availability in a later release.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">Pincode check coming soon.</p>
      </section>

      <div id="collections">
        {rails.length === 0 ? (
          <section className="px-6 py-16 text-center">
            <p className="font-serif text-lg">Rakhi collections coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Mark a section campaign as &quot;rakhi&quot; in admin, or include Rakhi in the section
              name.
            </p>
            <Link href="/" className="mt-6 inline-block text-sm text-primary hover:underline">
              Browse home
            </Link>
          </section>
        ) : (
          rails.map((section) => <SectionProductsRail key={section.id} section={section} />)
        )}
      </div>
    </main>
  );
}
