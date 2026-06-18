"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { slides } from "./slides";

const AUTOPLAY_MS = 5500;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="relative w-full overflow-hidden border-y border-border/60 bg-card/50"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative min-w-full"
            aria-roledescription="slide"
            aria-hidden={index !== current}
          >
            <div className="relative min-h-[360px] w-full sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px]">
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/55 to-black/35" />
              <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center px-6 py-8 sm:px-10 md:px-14 lg:px-20">
                <div
                  className={cn(
                    "grid w-full gap-7 text-white transition-all duration-700 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] lg:items-end",
                    index === current
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  )}
                >
                  <div className="max-w-2xl">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/85 sm:text-sm">
                      {slide.eyebrow}
                    </p>
                    <h2 className="font-serif text-3xl font-medium italic leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
                      {slide.subtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                        {slide.offer}
                      </span>
                      <span className="text-lg font-semibold">{slide.startingPrice}</span>
                      {slide.originalPrice ? (
                        <span className="text-sm text-white/70 line-through">{slide.originalPrice}</span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        size="lg"
                        className="h-10 rounded-full px-6 text-sm font-semibold"
                      >
                        <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-10 rounded-full border-white/45 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 hover:text-white"
                      >
                        <Link href="/shop">View All Collections</Link>
                      </Button>
                    </div>

                    <div className="mt-6 grid max-w-xl gap-2 sm:grid-cols-3">
                      {slide.perks.map((perk) => (
                        <div
                          key={perk}
                          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white/90 backdrop-blur-sm"
                        >
                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="hidden rounded-3xl border border-white/25 bg-white/10 p-5 backdrop-blur-md lg:block">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/80">
                      <Sparkles size={14} />
                      Shop the vibe
                    </p>
                    <div className="mt-4 space-y-2.5">
                      {slide.quickPicks.map((pick) => (
                        <Link
                          key={pick.label}
                          href={pick.href}
                          className="flex items-center justify-between rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white/95 transition hover:bg-black/35"
                        >
                          <span>{pick.label}</span>
                          <ChevronRight size={16} />
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 text-xs text-white/80">
                      <p className="flex items-center gap-2 font-medium text-white/90">
                        <Truck size={14} />
                        Free delivery over $100
                      </p>
                      <p className="mt-1">ETA visible before checkout for each bouquet.</p>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-foreground/70 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-foreground sm:flex"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-foreground/70 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-foreground sm:flex"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current ? "true" : undefined}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current
                ? "w-8 bg-primary"
                : "w-2 bg-white/60 hover:bg-white/90"
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md md:flex">
        <span>
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/20">
          <span
            className="block h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((current + 1) / slides.length) * 100}%` }}
          />
        </span>
      </div>
    </section>
  );
}
