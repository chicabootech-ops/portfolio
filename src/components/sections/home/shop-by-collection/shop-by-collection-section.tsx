"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collections } from "@/data/collections";
import { ImageWithSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";

export function ShopByCollectionSection() {
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
    <section className="w-full py-2 md:w-screen md:border md:border-b-0 md:py-12">
      <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-foreground md:text-base">
        — Shop By Collection —
      </h2>

      <div className="relative mx-auto w-full">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll collections left"
          className="absolute left-5 top-[calc(50%-1rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll collections right"
          className="absolute right-5 top-[calc(50%-1rem)] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-foreground/70 shadow-md transition hover:text-foreground md:flex"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        <div
          ref={scrollRef}
          className="flex scroll-smooth overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-4 md:px-16 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          {collections.map((collection, index) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group flex w-1/5 shrink-0 flex-col items-center gap-0.5 px-0 sm:w-1/4 sm:gap-2 sm:px-0.5 md:w-[12.5%] md:gap-2.5"
            >
              <div
                className={cn(
                  "rounded-full p-px transition-shadow duration-300 sm:p-[2px] md:p-[2.5px]",
                  "bg-linear-to-br from-[#f5a623] via-[#e8654a] to-[#d94f6a]",
                  "group-hover:shadow-[0_4px_16px_rgba(217,79,106,0.35)]"
                )}
              >
                <div className="rounded-full bg-white p-px sm:p-[2px] md:p-[2.5px]">
                  <div className="relative size-12 overflow-hidden rounded-full sm:size-18 md:size-21">
                    <ImageWithSkeleton
                      src={collection.image}
                      alt={collection.label}
                      fill
                      sizes="(max-width: 640px) 48px, (max-width: 768px) 72px, 84px"
                      className="object-cover"
                      skeletonClassName="rounded-full"
                      priority={index < 5}
                      loading={index < 5 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              </div>

              <span className="w-full truncate text-center text-[0.5625rem] font-semibold leading-tight text-foreground sm:text-[0.625rem] md:text-[0.8125rem]">
                {collection.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
