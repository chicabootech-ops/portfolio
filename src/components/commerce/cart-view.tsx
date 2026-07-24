"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { formatPaise } from "@/lib/format";

export function CartView() {
  const { items, subtotalPaise, count, setQuantity, removeItem, isReady } = useCart();

  if (!isReady) {
    return <div className="mt-10 h-40 animate-pulse rounded-2xl bg-secondary/30" />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-border/40 bg-white/50 px-6 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag size={28} />
        </div>
        <p className="mt-5 font-heading text-xl text-foreground">Your bag is empty</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Handcrafted blooms and keepsakes are waiting to be cherished.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-8 text-sm font-semibold tracking-wide text-primary-foreground transition hover:opacity-90"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.slug}
            className="flex gap-4 rounded-2xl border border-border/40 bg-white/60 p-3 sm:p-4"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/20 sm:h-28 sm:w-24"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image ?? "/collections/tulips.jpeg"}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary sm:text-base"
              >
                {item.name}
              </Link>
              <span className="mt-1 text-sm font-bold text-foreground">
                {formatPaise(item.pricePaise)}
              </span>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-border/60 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.slug, item.quantity - 1)}
                    className="grid h-8 w-8 place-items-center text-foreground/70 transition hover:text-primary"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.slug, item.quantity + 1)}
                    className="grid h-8 w-8 place-items-center text-foreground/70 transition hover:text-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-destructive"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
            <div className="hidden shrink-0 text-right sm:block">
              <span className="text-sm font-bold text-foreground">
                {formatPaise(item.pricePaise * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-border/40 bg-white/70 p-6 lg:sticky lg:top-28">
        <h2 className="font-heading text-lg font-semibold text-foreground">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal ({count} item{count === 1 ? "" : "s"})</dt>
            <dd className="font-medium text-foreground">{formatPaise(subtotalPaise)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Shipping</dt>
            <dd className="font-medium text-foreground">Calculated at checkout</dd>
          </div>
        </dl>
        <div className="mt-5 flex justify-between border-t border-border/40 pt-4">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">{formatPaise(subtotalPaise)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Proceed to checkout
        </Link>
        <Link
          href="/"
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-primary/30 bg-white/50 text-sm font-semibold tracking-wide text-foreground transition hover:border-primary hover:bg-primary/10"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
