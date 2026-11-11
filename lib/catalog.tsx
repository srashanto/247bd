"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { categorySlugs, Product, staticProducts } from "./products";
import { defaultSettings, Settings } from "./settings";
import { supabase } from "./supabase";

type CatalogValue = {
  products: Product[];
  settings: Settings;
  /** True once live data from the admin panel has loaded (or there is no backend). */
  ready: boolean;
  get: (slug: string) => Product | undefined;
};

const CatalogContext = createContext<CatalogValue | null>(null);

export type ProductRow = { id: string; slug: string; data: Product; published: boolean; sort: number };

/** Imported product names can still carry HTML entities such as &#038;. */
const cleanName = (s = "") =>
  s.replace(/&#0?38;|&amp;/g, "&").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&#8216;/g, "‘").replace(/&#822[01];/g, '"');

export function rowToProduct(r: ProductRow): Product {
  return { ...r.data, name: cleanName(r.data.name), id: r.id, slug: r.slug, published: r.published, sort: r.sort };
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const db = supabase();
    if (!db) {
      setReady(true);
      return;
    }
    let alive = true;
    (async () => {
      const [p, s] = await Promise.all([
        db.from("products").select("id, slug, data, published, sort").eq("published", true).order("sort"),
        db.from("settings").select("data").eq("id", 1).maybeSingle(),
      ]);
      if (!alive) return;
      // Only football categories are shown. Older grooming rows in the database stay hidden, and an
      // empty result means the football catalog hasn't been imported yet, so keep the bundled one.
      const live = ((p.data ?? []) as ProductRow[]).filter((r) => categorySlugs.has(r.data?.category));
      if (!p.error && live.length > 0) setProducts(live.map(rowToProduct));
      if (!s.error && s.data?.data) {
        const d = s.data.data as Partial<Settings>;
        // Drop leftover PahelaPride promo lines (PAHELA coupon, combo gift) saved in the database.
        const old = /pahela|pride|combo|কম্বো|free gift/i;
        const ann = (d.announcements ?? []).filter((a) => !old.test(a));
        setSettings({
          ...defaultSettings,
          ...d,
          announcements: ann.length ? ann : defaultSettings.announcements,
          couponNotice: d.couponNotice && !old.test(d.couponNotice) ? d.couponNotice : "",
        });
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<CatalogValue>(
    () => ({ products, settings, ready, get: (slug) => products.find((p) => p.slug === slug) }),
    [products, settings, ready]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
