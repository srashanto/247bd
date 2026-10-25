"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product, staticProducts } from "./products";
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

export function rowToProduct(r: ProductRow): Product {
  return { ...r.data, id: r.id, slug: r.slug, published: r.published, sort: r.sort };
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
      // An empty table means the catalog hasn't been imported yet, so keep the bundled one.
      if (!p.error && p.data && p.data.length > 0) setProducts((p.data as ProductRow[]).map(rowToProduct));
      if (!s.error && s.data?.data) setSettings({ ...defaultSettings, ...(s.data.data as Partial<Settings>) });
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
