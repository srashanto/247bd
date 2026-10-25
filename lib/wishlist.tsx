"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./auth";

type WishlistValue = {
  slugs: string[];
  ready: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const WishlistContext = createContext<WishlistValue | null>(null);
const KEY = "247bd-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { profile, saveProfile } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const merged = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  // When a customer signs in, combine this device's list with the one saved on their account.
  useEffect(() => {
    if (!ready || !profile || merged.current === profile.id) return;
    merged.current = profile.id;
    setSlugs((local) => {
      const all = [...new Set([...(profile.wishlist ?? []), ...local])];
      if (all.length !== (profile.wishlist ?? []).length) saveProfile({ wishlist: all });
      return all;
    });
  }, [ready, profile, saveProfile]);

  useEffect(() => {
    if (!profile) merged.current = null;
  }, [profile]);

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
      toggle: (slug) =>
        setSlugs((prev) => {
          const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
          if (profile) saveProfile({ wishlist: next });
          return next;
        }),
    }),
    [slugs, ready, profile, saveProfile]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
