"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export type Tab = { slug: string; label: string; href: string; items: Product[] };

export default function BestSellers({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].slug);
  const tab = tabs.find((t) => t.slug === active)!;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold sm:text-4xl">Best sellers</h2>
        <Link href={tab.href} className="text-[15px] underline underline-offset-4 hover:text-gold-2">
          Shop all
        </Link>
      </div>
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={t.slug === active}
            onClick={() => setActive(t.slug)}
            className={`whitespace-nowrap px-4 py-2 text-[13px] font-semibold uppercase tracking-wider ${
              t.slug === active ? "btn-gold" : "border border-line text-ink hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {tab.items.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
