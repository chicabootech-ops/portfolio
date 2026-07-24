"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bestSellingProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ImageWithSkeleton } from "@/components/skeletons";

export function BestSellingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="w-full pt-2 pb-10 md:w-screen md:pt-4 md:pb-12">
      <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-foreground md:mb-8 md:text-base">
        — Best Selling —
      </h2>

      <div className="relative mx-auto w-full">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll products left"
          className="absolute left-5 top-[calc(50%-2rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll products right"
          className="absolute right-5 top-[calc(50%-2rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <div
          ref={scrollRef}
          className="flex scroll-smooth gap-5 overflow-x-auto scroll-px-4 px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 sm:scroll-px-6 sm:px-6 md:gap-12 md:px-16 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          {bestSellingProducts.map((product, index) => (
            <article
              key={product.id}
              className="group/card flex w-[9.5rem] shrink-0 flex-col sm:w-[11rem] md:w-[14.5rem]"
            >
              <Link href={product.href} className="flex flex-col gap-3.5">
                <div className="bestseller-shine-border transition-transform duration-300 group-hover/card:scale-[1.02]">
                  <div className="bestseller-shine-border__inner">
                    <div className="bestseller-shine-border__image aspect-[4/5]">
                      <ImageWithSkeleton
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 168px, (max-width: 768px) 192px, 232px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        skeletonClassName="rounded-[calc(1rem-6px)]"
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                      />

                      <span className="absolute left-2.5 top-2.5 rounded-full bg-linear-to-r from-[#f5a623] via-[#e8654a] to-[#d94f6a] px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-white shadow-sm">
                        Bestseller
                      </span>

                      <button
                        type="button"
                        aria-label={`Add ${product.name} to wishlist`}
                        onClick={(e) => e.preventDefault()}
                        className="absolute right-2.5 top-2.5 rounded-full bg-white/95 p-1.5 text-foreground/60 shadow-sm backdrop-blur-sm transition hover:scale-110 hover:text-primary"
                      >
                        <Heart size={14} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-1">
                  <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-sm">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-foreground sm:text-base">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice ? (
                      <span className="text-xs text-muted-foreground line-through sm:text-sm">
                        {formatPrice(product.originalPrice)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </article>
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
          <Link href="/category/trending">View More</Link>
        </Button>
      </div>
    </section>
  );
}
