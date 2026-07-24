"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

type AddToCartProps = {
  slug: string;
  name: string;
  image: string | null;
  pricePaise: number;
};

export function AddToCart({ slug, name, image, pricePaise }: AddToCartProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    addItem({ slug, name, image, pricePaise }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    addItem({ slug, name, image, pricePaise }, qty);
    router.push("/checkout");
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-full border border-border/60 bg-white/70">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-10 w-10 place-items-center text-foreground/70 transition hover:text-primary disabled:opacity-40"
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="grid h-10 w-10 place-items-center text-foreground/70 transition hover:text-primary"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={add}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 bg-white/70 text-sm font-semibold tracking-wide text-foreground transition hover:border-primary hover:bg-primary/10"
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? "Added to bag" : "Add to bag"}
        </button>
        <button
          type="button"
          onClick={buyNow}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
