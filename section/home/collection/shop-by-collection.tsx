"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { collections } from "./collections";

export function ShopByCollection() {
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
    <section className="w-screen border py-10 md:py-12">
      <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-foreground md:text-base">
        &mdash; Shop By Collection &mdash;
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
          className="flex scroll-smooth overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:px-16 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          {collections.map((collection) => (
            <Link
              key={collection.href}
              href={collection.href}
              className="group flex shrink-0 basis-1/2 flex-col items-center gap-2.5 px-1 sm:basis-1/4 md:basis-[12.5%]"
            >
              <div
                className={cn(
                  "rounded-full p-[2.5px] transition-shadow duration-300",
                  "bg-gradient-to-br from-[#f5a623] via-[#e8654a] to-[#d94f6a]",
                  "group-hover:shadow-[0_4px_16px_rgba(217,79,106,0.35)]"
                )}
              >
                <div className="rounded-full bg-white p-[2.5px]">
                  <div className="relative size-[4.5rem] overflow-hidden rounded-full sm:size-[5.25rem]">
                    <Image
                      src={collection.image}
                      alt={collection.label}
                      fill
                      sizes="(max-width: 640px) 72px, 84px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <span className="w-full truncate text-center text-xs font-semibold text-foreground sm:text-[0.8125rem]">
                {collection.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
