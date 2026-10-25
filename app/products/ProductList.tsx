"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, concerns, discountPercent, getCategory, getConcern, matchesGender, products } from "@/lib/products";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  discount: "Biggest saving",
  new: "New first",
} as const;
type SortKey = keyof typeof sorts;

const forTabs = [
  { value: "", label: "Everyone" },
  { value: "him", label: "For him" },
  { value: "her", label: "For her" },
];

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`whitespace-nowrap px-3.5 py-1.5 text-[15px] ${
        on ? "btn-gold" : "border border-line bg-card hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductList() {
  const params = useSearchParams();
  const router = useRouter();
  const forWho = params.get("for") || "";
  const category = params.get("category") || "";
  const concern = params.get("concern") || "";
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
    let r = products.filter(
      (p) =>
        matchesGender(p, forWho) &&
        (!category || p.category === category) &&
        (!concern || p.concerns.includes(concern))
    );
    if (q) {
      const needle = q.toLowerCase();
      r = r.filter((p) =>
        [p.name, p.description, p.category, p.keyIngredients ?? "", ...p.highlights].join(" ").toLowerCase().includes(needle)
      );
    }
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "discount") sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
    if (sort === "new") sorted.sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    return sorted;
  }, [forWho, category, concern, q, sort]);

  const titleParts = [
    forWho === "him" ? "Men's" : forWho === "her" ? "Women's" : "",
    getCategory(category)?.name.toLowerCase() || (forWho ? "grooming" : "All products"),
  ].filter(Boolean);
  let title = titleParts.join(" ");
  title = title.charAt(0).toUpperCase() + title.slice(1);
  const concernName = getConcern(concern)?.name;
  const hasFilters = Boolean(forWho || category || concern || q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-1 text-muted">
        {list.length} product{list.length === 1 ? "" : "s"}
        {concernName && <> for {concernName.toLowerCase()}</>}
        {q && <> matching &ldquo;{q}&rdquo;</>}
        {hasFilters && (
          <button className="ml-2 font-semibold text-ink underline underline-offset-4" onClick={() => router.push("/products/")}>
            Clear filters
          </button>
        )}
      </p>

      <div className="mt-6 space-y-3 border-y border-line py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {forTabs.map((t) => (
              <Pill key={t.value} on={forWho === t.value} onClick={() => update("for", t.value)}>{t.label}</Pill>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[15px]">
            <span className="text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => update("sort", e.target.value === "featured" ? "" : e.target.value)}
              className="border border-line bg-card px-3 py-1.5"
            >
              {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Pill on={!category} onClick={() => update("category", "")}>All categories</Pill>
          {categories.map((c) => (
            <Pill key={c.slug} on={category === c.slug} onClick={() => update("category", category === c.slug ? "" : c.slug)}>{c.name}</Pill>
          ))}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <span className="self-center whitespace-nowrap pr-1 text-sm text-muted">Concern</span>
          {concerns.map((c) => (
            <Pill key={c.slug} on={concern === c.slug} onClick={() => update("concern", concern === c.slug ? "" : c.slug)}>{c.name}</Pill>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 bg-card p-10 text-center ring-1 ring-line">
          <p className="font-display text-xl font-semibold">No products match these filters</p>
          <p className="mt-2 text-muted">Remove a filter or try a different word, like &ldquo;shampoo&rdquo; or &ldquo;beard&rdquo;.</p>
          <button onClick={() => router.push("/products/")} className="mt-5 btn-gold px-5 py-2.5 font-semibold">
            Show all products
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
