"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { discountPercent, formatPrice, Gender, genders, Product } from "@/lib/products";
import Packshot from "./Packshot";
import { CheckIcon, HeartIcon } from "./Icons";

export const tileBg: Record<Gender, string> = {
  him: "bg-him-soft",
  her: "bg-her-soft",
  unisex: "bg-uni-soft",
};

export const genderText: Record<Gender, string> = {
  him: "text-him",
  her: "text-her",
  unisex: "text-uni",
};

export function WishButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink hover:bg-white ${on ? "text-her" : ""} ${className}`}
    >
      <HeartIcon className="h-4.5 w-4.5" filled={on} />
    </button>
  );
}

export function ProductStage({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const off = discountPercent(product);
  return (
    <div className={`relative overflow-hidden rounded-[18px] ${tileBg[product.gender]} ${size === "lg" ? "aspect-[4/4.2]" : "aspect-[4/4.4]"}`}>
      <Packshot product={product} className={size === "lg" ? "absolute inset-x-0 bottom-[9%] top-[14%]" : "absolute inset-x-0 bottom-[10%] top-[18%]"} />
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        {off > 0 && (
          <span className="rounded-full bg-saffron px-2.5 py-0.5 text-[13px] font-bold text-ink">Save {off}%</span>
        )}
        {product.badge && (
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-[13px] font-semibold text-ink">{product.badge}</span>
        )}
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${product.slug}/`} className="block">
        <ProductStage product={product} />
      </Link>
      <WishButton slug={product.slug} className="absolute right-3 top-3" />
      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <span className={`text-[13px] font-semibold ${genderText[product.gender]}`}>{genders[product.gender].name}</span>
        <Link href={`/products/${product.slug}/`} className="mt-0.5 font-display text-[17px] font-semibold leading-snug group-hover:underline">
          {product.name}
        </Link>
        {product.size && <span className="mt-0.5 text-sm text-muted">{product.size}</span>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</span>}
          </div>
          <button
            onClick={onAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              added ? "bg-uni text-white" : "bg-ink text-paper hover:bg-him-deep"
            }`}
          >
            {added ? <><CheckIcon /> Added</> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
