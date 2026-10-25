"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCatalog } from "./catalog";
import { findVariation, hasVariations, Product, Variation } from "./products";

export type CartLine = { slug: string; variation?: string | null; qty: number };
export type CartItem = CartLine & {
  key: string;
  product: Product;
  variationInfo?: Variation;
  unitPrice: number;
  maxQty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, variation?: string | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "247bd-cart-v2";

export const lineKey = (slug: string, variation?: string | null) => (variation ? `${slug}::${variation}` : slug);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { get } = useCatalog();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = [];
    for (const l of lines) {
      const product = get(l.slug);
      if (!product) continue;
      const v = hasVariations(product) ? findVariation(product, l.variation) : undefined;
      if (hasVariations(product) && !v) continue;
      items.push({
        ...l,
        key: lineKey(l.slug, l.variation),
        product,
        variationInfo: v,
        unitPrice: v ? v.price : product.price,
        maxQty: Math.max(1, Math.min(99, v ? v.stock : product.stock)),
      });
    }
    const update = (key: string, fn: (l: CartLine) => CartLine | null) =>
      setLines((prev) =>
        prev.flatMap((l) => (lineKey(l.slug, l.variation) === key ? (fn(l) ? [fn(l)!] : []) : [l]))
      );
    return {
      items,
      ready,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.unitPrice, 0),
      add: (slug, variation = null, qty = 1) =>
        setLines((prev) => {
          const k = lineKey(slug, variation);
          if (prev.some((l) => lineKey(l.slug, l.variation) === k))
            return prev.map((l) => (lineKey(l.slug, l.variation) === k ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
          return [...prev, { slug, variation, qty }];
        }),
      setQty: (key, qty) => update(key, (l) => (qty <= 0 ? null : { ...l, qty })),
      remove: (key) => update(key, () => null),
      clear: () => setLines([]),
    };
  }, [lines, ready, get]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
