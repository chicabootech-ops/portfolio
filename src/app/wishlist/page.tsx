"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { PageShell } from "@/components/layout";
import { EmptyState } from "@/components/sections/account/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";

type WishlistItem = {
  id: string;
  product_id: string;
  slug: string;
  product_name: string;
  price_paise: number;
  image_url: string | null;
};

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail?.message ?? data?.error ?? "Failed to load");
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [user, authLoading, load]);

  const remove = async (id: string) => {
    await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wishlist" },
      ]}
      title="Wishlist"
      description="Save your favorite bouquets and gifts for later."
    >
      {authLoading || loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : !user ? (
        <EmptyState
          icon={<Heart size={24} />}
          title="Sign in to save favorites"
          description="Your wishlist syncs across devices when you’re signed in."
          actionLabel="Sign in"
          actionHref="/login?next=/wishlist"
        />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          actionLabel="Continue shopping"
          actionHref="/"
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border/30 bg-white/60"
            >
              <Link href={`/product/${item.slug}`} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url ?? "/collections/tulips.jpeg"}
                  alt={item.product_name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>
              <div className="space-y-3 p-4">
                <Link href={`/product/${item.slug}`} className="line-clamp-2 font-medium hover:text-primary">
                  {item.product_name}
                </Link>
                <p className="font-semibold">{formatPaise(item.price_paise)}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-full"
                    onClick={() =>
                      void addItem(
                        {
                          slug: item.slug,
                          name: item.product_name,
                          image: item.image_url,
                          pricePaise: item.price_paise,
                        },
                        1
                      )
                    }
                  >
                    Add to bag
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => void remove(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
