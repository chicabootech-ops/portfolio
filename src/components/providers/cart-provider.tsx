"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  image: string | null;
  pricePaise: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalPaise: number;
  isReady: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "chicaboo_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage once on mount (SSR-safe).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.slug));
      }
    } catch {
      /* ignore corrupt cart */
    }
    setIsReady(true);
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / disabled — ignore */
    }
  }, [items, isReady]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
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
    []
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) =>
            i.slug === slug ? { ...i, quantity: Math.min(99, quantity) } : i
          )
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalPaise = items.reduce((n, i) => n + i.pricePaise * i.quantity, 0);
    return { items, count, subtotalPaise, isReady, addItem, setQuantity, removeItem, clear };
  }, [items, isReady, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
