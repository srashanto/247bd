"use client";

import ProductCard from "./ProductCard";
import { useCatalog } from "@/lib/catalog";

/** Products in a category, kept live from the admin panel. */
export default function CategoryGrid({ category }: { category: string | null }) {
  const { products } = useCatalog();
  const list = products
    .filter((p) => !category || p.category === category)
    .sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));
  if (list.length === 0)
    return <p className="bg-card p-10 text-center text-muted ring-1 ring-line">No products here yet. Check back soon.</p>;
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
      {list.map((p, i) => <ProductCard key={p.slug} product={p} eager={i < 4} />)}
    </div>
  );
}
