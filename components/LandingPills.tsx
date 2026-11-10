"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/catalog";
import { landings } from "@/lib/seo";

/** Category links for a landing page. Only categories that have products are listed. */
export default function LandingPills({ current }: { current: string }) {
  const { products } = useCatalog();
  const live = new Set(products.map((p) => p.category));
  return (
    <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto border-y border-line px-4 py-4">
      {landings
        .filter((x) => x.category === null || live.has(x.category) || x.slug === current)
        .map((x) => (
          <Link
            key={x.slug}
            href={`/${x.slug}/`}
            aria-current={x.slug === current ? "page" : undefined}
            className={`whitespace-nowrap rounded px-3.5 py-2 font-display text-[16px] font-extrabold uppercase italic tracking-wider ${
              x.slug === current ? "btn-gold" : "border border-line hover:border-ink"
            }`}
          >
            {x.label}
          </Link>
        ))}
    </div>
  );
}
