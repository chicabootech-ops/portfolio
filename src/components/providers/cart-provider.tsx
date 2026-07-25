"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/providers/auth-provider";

export type CartItem = {
  id?: string;
  slug: string;
  name: string;
  image: string | null;
  pricePaise: number;
  quantity: number;
  variantId?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalPaise: number;
  discountPaise: number;
  couponCode: string | null;
  isReady: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  setQuantity: (slug: string, quantity: number) => Promise<void>;
  removeItem: (slug: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearCoupon: () => Promise<void>;
  clear: () => void;
  refresh: () => Promise<void>;
};

const STORAGE_KEY = "chicaboo_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

type ServerCartItem = {
  id: string;
  slug: string;
  product_name: string;
  image_url: string | null;
  unit_price_paise: number;
  quantity: number;
  variant_id: string;
};

function mapServerItems(items: ServerCartItem[]): CartItem[] {
  return items.map((i) => ({
    id: i.id,
    slug: i.slug,
    name: i.product_name,
    image: i.image_url,
    pricePaise: i.unit_price_paise,
    quantity: i.quantity,
    variantId: i.variant_id,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountPaise, setDiscountPaise] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const hydrateLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.slug));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistLocal = useCallback((next: CartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const refreshServer = useCallback(async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as {
      items: ServerCartItem[];
      discount_paise?: number;
      coupon_code?: string | null;
    };
    setItems(mapServerItems(data.items ?? []));
    setDiscountPaise(data.discount_paise ?? 0);
    setCouponCode(data.coupon_code ?? null);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        try {
          // Merge guest cart once after login.
          const raw = localStorage.getItem(STORAGE_KEY);
          const local = raw ? (JSON.parse(raw) as CartItem[]) : [];
          if (Array.isArray(local) && local.length) {
            await fetch("/api/cart/merge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                local.map((i) => ({ slug: i.slug, quantity: i.quantity }))
              ),
            });
            localStorage.removeItem(STORAGE_KEY);
          }
          if (!cancelled) await refreshServer();
        } catch {
          if (!cancelled) hydrateLocal();
        }
      } else {
        hydrateLocal();
        setDiscountPaise(0);
        setCouponCode(null);
      }
      if (!cancelled) setIsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, hydrateLocal, refreshServer]);

  useEffect(() => {
    if (!isReady || user) return;
    persistLocal(items);
  }, [items, isReady, user, persistLocal]);

  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity">, quantity = 1) => {
      if (user) {
        await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: item.slug, quantity }),
        });
        await refreshServer();
        return;
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.slug === item.slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === item.slug
              ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
              : i
          );
        }
        return [...prev, { ...item, quantity: Math.min(99, Math.max(1, quantity)) }];
      });
    },
    [user, refreshServer]
  );

  const setQuantity = useCallback(
    async (slug: string, quantity: number) => {
      if (user) {
        const row = items.find((i) => i.slug === slug);
        if (!row?.id) return;
        if (quantity <= 0) {
          await fetch(`/api/cart/items/${row.id}`, { method: "DELETE" });
        } else {
          await fetch(`/api/cart/items/${row.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          });
        }
        await refreshServer();
        return;
      }
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.slug !== slug)
          : prev.map((i) =>
              i.slug === slug ? { ...i, quantity: Math.min(99, quantity) } : i
            )
      );
    },
    [user, items, refreshServer]
  );

  const removeItem = useCallback(
    async (slug: string) => {
      await setQuantity(slug, 0);
    },
    [setQuantity]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      if (!user) throw new Error("Sign in to apply a coupon.");
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { detail?: { message?: string } }).detail?.message ??
            "Could not apply coupon"
        );
      }
      await refreshServer();
    },
    [user, refreshServer]
  );

  const clearCoupon = useCallback(async () => {
    if (!user) return;
    await fetch("/api/cart/coupon", { method: "DELETE" });
    await refreshServer();
  }, [user, refreshServer]);

  const clear = useCallback(() => {
    setItems([]);
    setDiscountPaise(0);
    setCouponCode(null);
    if (!user) persistLocal([]);
  }, [user, persistLocal]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalPaise = items.reduce((n, i) => n + i.pricePaise * i.quantity, 0);
    return {
      items,
      count,
      subtotalPaise,
      discountPaise,
      couponCode,
      isReady,
      addItem,
      setQuantity,
      removeItem,
      applyCoupon,
      clearCoupon,
      clear,
      refresh: refreshServer,
    };
  }, [
    items,
    discountPaise,
    couponCode,
    isReady,
    addItem,
    setQuantity,
    removeItem,
    applyCoupon,
    clearCoupon,
    clear,
    refreshServer,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
