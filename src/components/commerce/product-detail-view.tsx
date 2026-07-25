"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageWithSkeleton } from "@/components/skeletons";
import { AddToCart } from "@/components/commerce/add-to-cart";
import { formatPaise } from "@/lib/format";
import { resolveCollectionImage } from "@/lib/collection-images";
import type { CatalogProductDetail } from "@/types/catalog";

export function ProductDetailView({ product }: { product: CatalogProductDetail }) {
  const gallery = useMemo(() => {
    const imgs = product.gallery?.length
      ? product.gallery
      : [
          product.image_url ||
            resolveCollectionImage(product.category_slug || product.slug, null),
        ];
    return imgs.filter(Boolean) as string[];
  }, [product]);

  const variants = product.variants ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const pricePaise = selected?.price_paise ?? product.price_paise;
  const compare = selected?.compare_at_price_paise ?? product.compare_at_price_paise;

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
      <div className="space-y-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/20">
          <ImageWithSkeleton
            src={gallery[activeIdx] ?? gallery[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {gallery.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto">
            {gallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border ${
                  i === activeIdx ? "border-primary" : "border-border/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="md:sticky md:top-28">
        {product.category_name ? (
          <Link
            href={`/category/${product.category_slug}`}
            className="text-sm text-primary hover:underline"
          >
            {product.category_name}
          </Link>
        ) : null}
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-foreground">{formatPaise(pricePaise)}</span>
          {compare ? (
            <span className="text-base text-muted-foreground line-through">
              {formatPaise(compare)}
            </span>
          ) : null}
        </div>
        {product.short_description ? (
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {product.short_description}
          </p>
        ) : null}
        {product.description ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        {variants.length > 1 ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Select option</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    variantId === v.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 text-muted-foreground"
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <AddToCart
          slug={product.slug}
          name={product.name}
          image={gallery[0] ?? null}
          pricePaise={pricePaise}
        />

        <ul className="mt-8 space-y-2 border-t border-border/40 pt-6 text-sm text-muted-foreground">
          <li>✦ Handcrafted with love, made to be cherished</li>
          <li>✦ Secure checkout via Razorpay (UPI, cards, netbanking)</li>
          <li>✦ Thoughtfully packaged &amp; ready to gift</li>
        </ul>
      </div>
    </div>
  );
}
