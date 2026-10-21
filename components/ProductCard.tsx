"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { discountPercent, formatPrice, Product } from "@/lib/products";

export function ProductImage({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const off = discountPercent(product);
  return (
    <div className={`relative grid aspect-square place-items-center rounded-xl bg-gradient-to-br ${product.color}`}>
      <span className={size === "lg" ? "text-[9rem] sm:text-[12rem]" : "text-7xl"} aria-hidden>
        {product.emoji}
      </span>
      {off > 0 && (
        <span className="absolute left-2 top-2 rounded-md bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">
          -{off}%
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
      <Link href={`/products/${product.slug}/`} className="block">
        <ProductImage product={product} />
        <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold group-hover:text-brand-700">{product.name}</h3>
      </Link>
      <div className="mt-1 text-xs text-amber-500">★ {product.rating.toFixed(1)}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-brand-700">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
        )}
      </div>
      <button
        onClick={onAdd}
        className={`mt-3 rounded-lg py-2 text-sm font-semibold text-white transition ${
          added ? "bg-brand-900" : "bg-brand-600 hover:bg-brand-700"
        }`}
      >
        {added ? "✓ Added" : "Add to cart"}
      </button>
    </div>
  );
}
