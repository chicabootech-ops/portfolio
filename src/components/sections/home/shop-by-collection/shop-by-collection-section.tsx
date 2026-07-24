"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithSkeleton } from "@/components/skeletons";
import { ShopByCollectionSkeleton } from "@/components/skeletons/shop-by-collection-skeleton";
import { useCollections } from "@/hooks/useCollections";
import { resolveCollectionImage } from "@/lib/collection-images";

export function ShopByCollectionSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: collections = [], isLoading, isError } = useCollections();

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return <ShopByCollectionSkeleton />;
  }

  if (isError) {
    return (
      <section className="w-full px-6 py-8 text-center md:py-12">
        <p className="text-sm text-muted-foreground">
          Collections could not load. Make sure the backend is running, then refresh.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Run: ./stop.sh && ./start.sh</p>
      </section>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-4 pb-6 md:w-screen md:border md:border-b-0 md:pt-10 md:pb-8">
      <div className="mb-5 flex flex-col items-center gap-1.5 md:mb-7">
        <h2 className="font-serif text-base font-medium tracking-[0.12em] text-foreground md:text-lg">
          <span className="text-primary/50">—</span>
          {" "}Shop By Collection{" "}
          <span className="text-primary/50">—</span>
        </h2>
        <div className="h-px w-10 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll collections left"
          className="absolute -left-1 top-[calc(50%-1.25rem)] z-10 hidden -translate-y-1/2 rounded-full border border-primary/25 bg-white/90 p-2.5 text-foreground/60 shadow-sm backdrop-blur-sm transition hover:border-primary/45 hover:bg-white hover:text-primary hover:shadow-md md:flex lg:hidden"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll collections right"
          className="absolute -right-1 top-[calc(50%-1.25rem)] z-10 hidden -translate-y-1/2 rounded-full border border-primary/25 bg-white/90 p-2.5 text-foreground/60 shadow-sm backdrop-blur-sm transition hover:border-primary/45 hover:bg-white hover:text-primary hover:shadow-md md:flex lg:hidden"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory scroll-smooth justify-start gap-5 overflow-x-auto py-2 scrollbar-none sm:gap-6 md:gap-7 lg:grid lg:snap-none lg:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] lg:justify-items-center lg:gap-x-3 lg:gap-y-4 lg:overflow-x-visible xl:gap-x-4"
        >
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/category/${collection.slug}`}
              className="group flex w-[5.5rem] shrink-0 snap-start flex-col items-center gap-2.5 sm:w-28 md:w-[7.25rem] lg:w-full lg:max-w-36 lg:shrink"
            >
              <div className="collection-ring transition-transform duration-300 ease-out group-hover:scale-[1.04]">
                <div className="collection-ring__inner">
                  <div className="relative size-[4.5rem] overflow-hidden rounded-full sm:size-20 md:size-[5.5rem] lg:mx-auto lg:size-22 xl:size-24">
                    <ImageWithSkeleton
                      src={resolveCollectionImage(collection.slug, collection.image_url)}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 640px) 72px, (max-width: 1024px) 88px, 96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      skeletonClassName="rounded-full"
                      priority={index < 5}
                      loading={index < 5 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              </div>

              <span className="line-clamp-2 min-h-10.5 w-full text-center font-serif text-[0.6875rem] leading-snug text-foreground/75 transition-colors duration-300 group-hover:text-primary sm:text-xs md:min-h-11 md:text-[0.8125rem]">
                {collection.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
