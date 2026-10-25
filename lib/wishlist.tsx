"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishlistValue = {
  slugs: string[];
  ready: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);
const KEY = "247bd-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs, ready]);

  const value = useMemo<WishlistValue>(
    () => ({
      slugs,
      ready,
      has: (slug) => slugs.includes(slug),
      toggle: (slug) => setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev])),
    }),
    [slugs, ready]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
