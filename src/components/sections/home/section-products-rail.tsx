"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/skeletons";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import type { CatalogProduct, CatalogSection } from "@/types/catalog";

type SectionProductsRailProps = {
  section: CatalogSection;
};

export function SectionProductsRail({ section }: SectionProductsRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = section.products ?? [];

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-2 pb-10 md:w-screen md:pt-4 md:pb-12">
      <h2 className="mb-6 text-center font-serif text-base font-medium tracking-[0.12em] text-foreground md:mb-8 md:text-lg">
        <span className="text-primary/50">—</span> {section.name}{" "}
        <span className="text-primary/50">—</span>
      </h2>

      <div className="relative mx-auto w-full">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label={`Scroll ${section.name} left`}
          className="absolute left-5 top-[calc(50%-2rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label={`Scroll ${section.name} right`}
          className="absolute right-5 top-[calc(50%-2rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <div
          ref={scrollRef}
          className="flex scroll-smooth gap-5 overflow-x-auto scroll-px-4 px-4 py-3 scrollbar-none sm:gap-8 sm:scroll-px-6 sm:px-6 md:gap-12 md:px-16 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => (
            <ProductRailCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center md:mt-12">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-10 rounded-full border-primary/35 bg-white/60 px-10 text-sm font-semibold tracking-wide text-foreground shadow-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={`/section/${section.slug}`}>View all</Link>
        </Button>
      </div>
    </section>
  );
}

function ProductRailCard({
  product,
  priority,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  const image =
    product.image_url ||
    resolveCollectionImage(product.category_slug || product.slug, null);

  return (
    <article className="group/card flex w-[9.5rem] shrink-0 flex-col sm:w-[11rem] md:w-[14.5rem]">
      <Link href={`/product/${product.slug}`} className="flex flex-col gap-3.5">
        <div className="bestseller-shine-border transition-transform duration-300 group-hover/card:scale-[1.02]">
          <div className="bestseller-shine-border__inner">
            <div className="bestseller-shine-border__image aspect-[4/5]">
              <ImageWithSkeleton
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 168px, (max-width: 768px) 192px, 232px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                skeletonClassName="rounded-[calc(1rem-6px)]"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 px-1">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground sm:text-base">
              {formatPaise(product.price_paise)}
            </span>
            {product.compare_at_price_paise ? (
              <span className="text-xs text-muted-foreground line-through sm:text-sm">
                {formatPaise(product.compare_at_price_paise)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
