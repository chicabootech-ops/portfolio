"use client";

import Link from "next/link";

function FounderPortrait({
  name,
  role,
  tease,
  delay,
}: {
  name: string;
  role: string;
  tease: string;
  delay: number;
}) {
  return (
    <figure
      className="founders-portrait group fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="founders-portrait__frame" aria-hidden>
        <div className="founders-portrait__empty">
          <span className="founders-portrait__soon">Photo loading… emotionally</span>
          <span className="founders-portrait__hint">Image coming soon</span>
        </div>
      </div>
      <figcaption className="mt-5 text-center">
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
        <div className="founders-hero__wash" aria-hidden />
        <div className="founders-hero__grain" aria-hidden />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-4xl flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:min-h-[70vh]">
          <p
            className="fade-up text-[0.7rem] font-medium uppercase tracking-[0.28em] text-brand-bronze/80"
            style={{ animationDelay: "0s" }}
          >
            A sister act with better packaging
          </p>
          <h1
            className="fade-up font-logo mt-5 text-5xl leading-[0.95] font-semibold tracking-[0.04em] text-primary sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ animationDelay: "0.08s" }}
          >
            CHIC A BOO
          </h1>
          <p
            className="fade-up font-heading mt-6 max-w-xl text-xl italic leading-snug text-foreground/85 sm:text-2xl"
            style={{ animationDelay: "0.16s" }}
          >
            Welcome — two sisters, one sanctuary for beautiful things.
          </p>
          <p
            className="fade-up mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
            style={{ animationDelay: "0.24s" }}
          >
            We turned late-night brainstorming (and a shared love for pretty chaos)
            into crochet blooms, keepsakes, and magazines worth keeping forever.
          </p>
          <div
            className="fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
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
              className="inline-flex h-11 items-center rounded-full border border-primary/35 bg-white/50 px-8 text-sm font-semibold tracking-wide text-foreground transition hover:border-primary hover:bg-primary/10"
            >
              Read our plot twist
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-16 md:py-24" aria-labelledby="founders-portraits">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2
              id="founders-portraits"
              className="font-heading text-3xl font-semibold text-foreground md:text-4xl"
            >
              The founders (in HD… soon)
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Photos are still getting their glow-up. Meanwhile, please enjoy these
              very chic empty frames — peak minimalism.
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-10 md:gap-16">
            <FounderPortrait
              name="Ragini Agarwal"
              role="Co-Founder"
              tease="Chief memory-keeper & yarn diplomat"
              delay={0.05}
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

      <section id="story" className="founders-story relative scroll-mt-28 px-6 py-16 md:py-24">
        <div className="founders-story__panel mx-auto max-w-3xl">
          <div className="fade-up">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-primary">
              Our story
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-foreground md:text-4xl">
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

            <div className="mt-8 space-y-6 text-[0.95rem] leading-relaxed text-foreground/85 sm:text-base">
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
            </div>

            <div className="mt-12 border-t border-primary/20 pt-10">
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

      <section className="px-6 pb-24 pt-4">
        <div className="founders-wink fade-scale-in mx-auto max-w-2xl text-center">
          <p className="font-heading text-2xl text-foreground md:text-3xl">
            Built by sisters. Powered by yarn, nostalgia, and mild perfectionism.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Come for the gifts. Stay because the magazine feels like a hug you can
            reread.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-full border border-primary/40 bg-white/60 px-8 text-sm font-semibold tracking-wide text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Back to shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
