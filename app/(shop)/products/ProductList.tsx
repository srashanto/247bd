"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog";
import { bestDiscount, categories, getCategory, priceRange } from "@/lib/products";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  discount: "Biggest saving",
} as const;
type SortKey = keyof typeof sorts;

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`whitespace-nowrap px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wider ${
        on ? "btn-gold" : "border border-line hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductList() {
  const { products } = useCatalog();
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const sortParam = params.get("sort") || "";
  const sort: SortKey = sortParam in sorts ? (sortParam as SortKey) : "featured";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const s = next.toString();
    router.push(`/products/${s ? `?${s}` : ""}`, { scroll: false });
  }

  const list = useMemo(() => {
    let r = products.filter((p) => !category || p.category === category);
    if (q) {
      const needle = q.toLowerCase();
      r = r.filter((p) =>
        [p.name, p.title ?? "", p.description ?? "", ...(p.ingredients ?? []), ...(p.benefits ?? [])].join(" ").toLowerCase().includes(needle)
      );
    }
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => priceRange(a)[0] - priceRange(b)[0]);
    if (sort === "price-desc") sorted.sort((a, b) => priceRange(b)[0] - priceRange(a)[0]);
    if (sort === "discount") sorted.sort((a, b) => bestDiscount(b) - bestDiscount(a));
    return sorted;
  }, [products, category, q, sort]);

  const title = getCategory(category)?.name || "All products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">PRIDE by PahelaPride</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-1 text-muted">
        {list.length} product{list.length === 1 ? "" : "s"}
        {q && <> matching &ldquo;{q}&rdquo;</>}
        {(category || q) && (
          <button className="ml-2 font-semibold text-ink underline underline-offset-4" onClick={() => router.push("/products/")}>
            Clear
          </button>
        )}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-4">
        <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <Pill on={!category} onClick={() => update("category", "")}>All</Pill>
          {categories.map((c) => (
            <Pill key={c.slug} on={category === c.slug} onClick={() => update("category", category === c.slug ? "" : c.slug)}>
              {c.name}
            </Pill>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
            className="border border-line bg-card px-3 py-2"
          >
            {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 bg-card p-10 text-center ring-1 ring-line">
          <p className="text-xl font-semibold">No products match</p>
          <p className="mt-2 text-muted">Try another word, like &ldquo;clay&rdquo;, &ldquo;curl&rdquo; or &ldquo;shampoo&rdquo;.</p>
          <button onClick={() => router.push("/products/")} className="btn-gold mt-5 px-5 py-3">Show all products</button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} eager={i < 4} />)}
        </div>
      )}
    </div>
  );
}
