import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/20">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/collections/tulips.jpeg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/75 to-background/35" />
      <div className="mx-auto flex min-h-[62vh] max-w-6xl flex-col justify-end px-6 pb-14 pt-28 sm:min-h-[70vh] sm:pb-20">
        <p className="font-logo text-4xl italic text-primary sm:text-5xl md:text-6xl">Chic A Boo</p>
        <h1 className="mt-3 max-w-xl font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Gifts that feel handcrafted for the moment
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80 sm:text-base">
          Bouquets, hampers, and keepsakes curated for celebrations that matter.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/festivals/rakhi"
            className="inline-flex h-11 items-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Shop Rakhi
          </Link>
          <Link
            href="/search"
            className="inline-flex h-11 items-center rounded-full border border-primary/35 bg-white/70 px-7 text-sm font-semibold text-foreground backdrop-blur transition hover:border-primary"
          >
            Search gifts
          </Link>
        </div>
      </div>
    </section>
  );
}
