"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { discountPercent, formatPrice, Gender, genders, Product } from "@/lib/products";
import Packshot from "./Packshot";
import { BagIcon, CheckIcon, HeartIcon } from "./Icons";

export const genderText: Record<Gender, string> = {
  him: "text-him",
  her: "text-her",
  unisex: "text-gold",
};

export function WishButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      className={`grid h-9 w-9 place-items-center text-ink/70 hover:text-ink ${on ? "!text-gold-2" : ""} ${className}`}
    >
      <HeartIcon className="h-5 w-5" filled={on} />
    </button>
  );
}

export function ProductStage({ product, size = "md" }: { product: Product; size?: "md" | "lg" }) {
  const off = discountPercent(product);
  return (
    <div className={`studio relative overflow-hidden ${size === "lg" ? "aspect-square" : "aspect-[4/4.6]"}`}>
      <Packshot
        product={product}
        className={size === "lg" ? "absolute inset-x-0 bottom-[12%] top-[16%]" : "absolute inset-x-0 bottom-[12%] top-[20%]"}
      />
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
        {off > 0 && <span className="bg-gold px-2 py-1 text-paper">Save {off}%</span>}
        {product.badge && <span className="border border-ink/25 px-2 py-[3px] text-ink/85">{product.badge}</span>}
      </div>
    </div>
  );
}

export function AddButton({ product, className = "" }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        add(product.slug);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      aria-label={`Add ${product.name} to cart`}
      className={`btn-gold flex items-center justify-between gap-2 px-3.5 py-3 text-[13px] ${className}`}
    >
      {added ? <span className="flex items-center gap-1.5"><CheckIcon /> Added</span> : <span>Add to cart</span>}
      <BagIcon className="h-4.5 w-4.5" />
    </button>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${product.slug}/`} className="block">
        <ProductStage product={product} />
      </Link>
      <WishButton slug={product.slug} className="absolute right-2 top-2" />
      <div className="mt-3 flex flex-1 flex-col">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${genderText[product.gender]}`}>
          {genders[product.gender].name}
        </span>
        <Link href={`/products/${product.slug}/`} className="mt-1 text-[16px] font-medium leading-snug group-hover:text-gold-2">
          {product.name}
        </Link>
        <span className="mt-0.5 text-[13px] text-muted">{product.highlights[0]}</span>
        <div className="mt-2 flex items-baseline gap-2 pb-3">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-[13px] text-muted line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
        <AddButton product={product} className="mt-auto w-full" />
      </div>
    </div>
  );
}
