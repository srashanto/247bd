"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, discountPercent, getCategory, products } from "@/lib/products";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
  discount: "Biggest discount",
} as const;
type SortKey = keyof typeof sorts;

export default function ProductList() {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sort = (params.get("sort") as SortKey) in sorts ? (params.get("sort") as SortKey) : "featured";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const s = next.toString();
    router.push(`/products/${s ? `?${s}` : ""}`);
  }

  const list = useMemo(() => {
    let r = products.filter((p) => !category || p.category === category);
    if (q) {
      const needle = q.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle));
    }
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "discount") sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
    return sorted;
  }, [category, q, sort]);

  const title = getCategory(category)?.name || "All products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-36 h-fit">
        <h2 className="font-bold">Categories</h2>
        <div className="mt-3 flex lg:flex-col gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => update("category", "")}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm ${!category ? "bg-brand-600 text-white" : "bg-white ring-1 ring-slate-200"}`}
          >
            🛍️ All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => update("category", c.slug)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm ${category === c.slug ? "bg-brand-600 text-white" : "bg-white ring-1 ring-slate-200"}`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-slate-500">
              {list.length} item{list.length === 1 ? "" : "s"}
              {q && <> for &ldquo;{q}&rdquo; <button className="text-brand-600 underline" onClick={() => update("q", "")}>clear</button></>}
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
            <div className="text-5xl">🔍</div>
            <p className="mt-3 text-slate-600">No products found. Try another search.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
