"use client";

import Image from "next/image";
import Link from "next/link";

function FounderPortrait({
  name,
  role,
  tease,
  delay,
  imageSrc,
  imageAlt,
}: {
  name: string;
  role: string;
  tease: string;
  delay: number;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <figure
      className="founders-portrait group fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="founders-portrait__frame" aria-hidden={!imageSrc}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            sizes="(max-width: 640px) 100vw, 42vw"
            className="founders-portrait__photo object-cover object-[center_18%]"
            priority
          />
        ) : (
          <div className="founders-portrait__empty">
            <span className="founders-portrait__soon">Photo loading… emotionally</span>
            <span className="founders-portrait__hint">Image coming soon</span>
          </div>
        )}
      </div>
      <figcaption className="mt-6 text-center sm:text-left">
        <p className="font-heading text-2xl font-medium tracking-wide text-foreground md:text-3xl">
          {name}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
          {role}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{tease}</p>
      </figcaption>
    </figure>
  );
}

export function FoundersAbout() {
  return (
    <div className="founders-page">
      <section className="founders-hero relative overflow-hidden">
        <div className="founders-hero__media" aria-hidden>
          <Image
            src="/founders/ragini.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_22%] opacity-[0.28] sm:opacity-[0.34]"
          />
        </div>
        <div className="founders-hero__wash" aria-hidden />
        <div className="founders-hero__grain" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-10 sm:min-h-[84vh] sm:pb-24">
          <p
            className="fade-up text-[0.7rem] font-medium uppercase tracking-[0.28em] text-brand-bronze/90"
            style={{ animationDelay: "0s" }}
          >
            A sister act with better packaging
          </p>
          <h1
            className="fade-up font-logo mt-4 max-w-3xl text-5xl leading-[0.92] font-semibold tracking-[0.04em] text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.08s" }}
          >
            CHIC A BOO
          </h1>
          <p
            className="fade-up font-heading mt-5 max-w-xl text-xl italic leading-snug text-foreground/90 sm:text-2xl md:text-3xl"
            style={{ animationDelay: "0.16s" }}
          >
            Welcome — two sisters, one sanctuary for beautiful things.
          </p>
          <p
            className="fade-up mt-5 max-w-lg text-sm leading-relaxed text-foreground/75 sm:text-base"
            style={{ animationDelay: "0.24s" }}
          >
            We turned late-night brainstorming (and a shared love for pretty chaos)
            into crochet blooms, keepsakes, and magazines worth keeping forever.
          </p>
          <div
            className="fade-up mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.32s" }}
          >
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-full bg-primary px-8 text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90"
            >
              Shop the sanctuary
            </Link>
            <a
              href="#story"
              className="inline-flex h-11 items-center rounded-full border border-primary/40 bg-background/55 px-8 text-sm font-semibold tracking-wide text-foreground backdrop-blur-sm transition hover:border-primary hover:bg-primary/10"
            >
              Read our plot twist
            </a>
          </div>
        </div>
      </section>

      <section
        className="founders-meet relative px-6 py-16 md:py-24"
        aria-labelledby="founders-portraits"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-primary">
              Meet the sisters
            </p>
            <h2
              id="founders-portraits"
              className="font-heading mt-3 text-3xl font-semibold text-foreground md:text-5xl"
            >
              The founders
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              One frame filled. One still getting its glow-up. Same twin energy either way.
            </p>
          </div>

          <div className="grid items-start gap-14 sm:grid-cols-2 sm:gap-10 lg:gap-20">
            <FounderPortrait
              name="Ragini Agarwal"
              role="Co-Founder"
              tease="Chief memory-keeper & yarn diplomat"
              delay={0.05}
              imageSrc="/founders/ragini.jpeg"
              imageAlt="Ragini Agarwal, co-founder of CHIC A BOO"
            />
            <FounderPortrait
              name="Kanisha Agarwal"
              role="Co-Founder"
              tease="Chief page-turner & keepsake conspirator"
              delay={0.18}
            />
          </div>
        </div>
      </section>

      <section id="story" className="founders-story relative scroll-mt-28 px-6 py-16 md:py-28">
        <div className="founders-story__veil" aria-hidden />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="fade-up lg:sticky lg:top-36 lg:self-start">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-primary">
              Our story
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold leading-tight text-foreground md:text-5xl">
              Welcome to CHIC A BOO!
            </h2>
            <div className="founders-aside mt-8">
              <p>
                Official twin energy check: we are two sisters who turned a lifelong
                bond and a shared love for creativity into a sanctuary for beautiful
                things. Unofficial version: we once brainstormed until 2 a.m. and
                somehow invented a business instead of sleeping.
              </p>
            </div>
          </div>

          <div className="fade-up space-y-6 text-[0.95rem] leading-relaxed text-foreground/85 sm:text-base" style={{ animationDelay: "0.12s" }}>
            <p>
              What started as late-night brainstorming sessions and passion projects
              has grown into a curated world of handcrafted crochet flowers, timeless
              keepsakes, and inspiring magazines.
            </p>
            <p>
              Growing up together, we always found joy in the little things and loved
              creating pieces that held personal meaning. That is exactly what we want
              to bring to you. Whether it’s a bouquet of crochet blooms that never
              fades, a keepsake that holds a precious moment tight, or our signature
              magazine—which is thoughtfully crafted and filled to the brim with
              beautiful memories—everything we make is designed to be cherished for
              years to come.
            </p>
            <p className="font-heading text-xl italic leading-snug text-brand-bronze md:text-2xl">
              (Yes, the flowers never fade. Your WhatsApp “where is my parcel?”
              messages? Those are forever too — we reply with love.)
            </p>
            <p>
              For us, CHIC A BOO isn’t just a business—it’s an extension of our home
              and our hearts. Every loop of yarn, every preserved memory, and every
              page we design is crafted to bring a touch of warmth and elegance into
              your everyday life. We are so incredibly grateful to share our journey
              and our creations with you.
            </p>

            <div className="mt-10 border-t border-primary/25 pt-10">
              <p className="font-heading text-xl italic text-foreground">
                With love and gratitude,
              </p>
              <p className="font-heading mt-3 text-2xl font-semibold tracking-wide text-primary md:text-3xl">
                Ragini Agarwal &amp; Kanisha Agarwal
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Founders, CHIC A BOO
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="founders-close relative overflow-hidden px-6 pb-24 pt-6">
        <div className="founders-close__glow" aria-hidden />
        <div className="fade-scale-in relative z-10 mx-auto max-w-3xl text-center">
          <p className="font-heading text-2xl text-foreground md:text-4xl">
            Built by sisters. Powered by yarn, nostalgia, and mild perfectionism.
          </p>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Come for the gifts. Stay because the magazine feels like a hug you can
            reread.
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex h-11 items-center rounded-full border border-primary/45 bg-background/70 px-8 text-sm font-semibold tracking-wide text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Back to shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
