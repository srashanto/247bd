"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { bestDiscount, formatPrice, hasVariations, priceRange, Product, productHref, totalStock } from "@/lib/products";
import Packshot from "./Packshot";
import { BagIcon, CheckIcon, HeartIcon } from "./Icons";

export function WishButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      className={`grid h-9 w-9 place-items-center bg-black/40 text-ink backdrop-blur hover:text-gold-2 ${on ? "!text-gold-2" : ""} ${className}`}
    >
      <HeartIcon className="h-5 w-5" filled={on} />
    </button>
  );
}

/** Product photo, or the illustrated pack when there is no photo yet. */
export function ProductPhoto({ product, src, className = "", eager = false }: { product: Product; src?: string; className?: string; eager?: boolean }) {
  const url = src ?? product.images?.[0]?.thumb;
  if (url)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={product.name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  return (
    <div className={`studio h-full w-full ${className}`}>
      <Packshot product={product} className="h-full px-[12%] pb-[10%] pt-[16%]" />
    </div>
  );
}

export function PriceLine({ product, className = "" }: { product: Product; className?: string }) {
  const [lo, hi] = priceRange(product);
  if (lo !== hi)
    return (
      <span className={className}>
        {formatPrice(lo)} – {formatPrice(hi)}
      </span>
    );
  return (
    <span className={`flex items-baseline gap-2 ${className}`}>
      <span>{formatPrice(product.price)}</span>
      {product.regularPrice && product.regularPrice > product.price && (
        <span className="text-[0.85em] font-normal text-muted line-through">{formatPrice(product.regularPrice)}</span>
      )}
    </span>
  );
}

export function AddButton({ product, className = "" }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = totalStock(product) <= 0;

  if (soldOut)
    return (
      <span className={`flex items-center justify-center border border-line px-3.5 py-3 text-[13px] font-semibold uppercase tracking-wider text-muted ${className}`}>
        Out of stock
      </span>
    );

  if (hasVariations(product))
    return (
      <Link href={productHref(product)} className={`btn-gold flex items-center justify-between gap-2 px-3.5 py-3 text-[13px] ${className}`}>
        <span>Select options</span>
        <span aria-hidden>→</span>
      </Link>
    );

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

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const off = bestDiscount(product);
  const href = productHref(product);
  return (
    <div className="group relative flex flex-col">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-card">
        <ProductPhoto product={product} eager={eager} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
          {off > 0 && <span className="bg-gold px-2 py-1 text-paper">-{off}%</span>}
          {product.badge && <span className="bg-black/60 px-2 py-1 text-ink backdrop-blur">{product.badge}</span>}
        </div>
      </Link>
      <WishButton slug={product.slug} className="absolute right-2 top-2" />
      <div className="mt-3 flex flex-1 flex-col">
        <Link href={href} className="text-[15px] font-medium leading-snug group-hover:text-gold-2 sm:text-[16px]">
          {product.name}
        </Link>
        {product.gift ? (
          <span className="mt-1 text-[12.5px] text-gold">🎁 {product.gift}</span>
        ) : (
          product.benefits?.[0] && <span className="mt-1 line-clamp-1 text-[13px] text-muted">{product.benefits[0]}</span>
        )}
        <PriceLine product={product} className="mt-2 pb-3 font-semibold" />
        <AddButton product={product} className="mt-auto w-full" />
      </div>
    </div>
  );
}
