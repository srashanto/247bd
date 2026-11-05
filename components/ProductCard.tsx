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
      className={`grid h-9 w-9 place-items-center rounded-full bg-paper text-ink hover:text-gold-2 ${on ? "!text-gold-2" : ""} ${className}`}
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
      <span className={`flex items-center justify-center border border-line px-2 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-muted sm:py-3 sm:text-[13px] ${className}`}>
        Out of stock
      </span>
    );

  if (hasVariations(product))
    return (
      <Link href={productHref(product)} className={`btn-gold flex items-center justify-center gap-2 whitespace-nowrap px-2 py-2.5 text-[11.5px] sm:justify-between sm:px-3.5 sm:py-3 sm:text-[13px] ${className}`}>
        <span>Select options</span>
        <span aria-hidden className="hidden sm:inline">→</span>
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
      className={`btn-gold flex items-center justify-center gap-2 whitespace-nowrap px-2 py-2.5 text-[11.5px] sm:justify-between sm:px-3.5 sm:py-3 sm:text-[13px] ${className}`}
    >
      {added ? <span className="flex items-center gap-1.5"><CheckIcon /> Added</span> : <span>Add to cart</span>}
      <BagIcon className="hidden h-4.5 w-4.5 sm:block" />
    </button>
  );
}

export default function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const off = bestDiscount(product);
  const href = productHref(product);
  return (
    <div className="pp-card">
      <Link href={href} className="pp-card__media">
        <ProductPhoto product={product} eager={eager} className="transition-transform duration-500 hover:scale-[1.03]" />
        <div className="pp-card__badges">
          {off > 0 && <span className="pp-badge">-{off}%</span>}
          {product.badge && <span className="pp-badge pp-badge--punk">{product.badge}</span>}
          {product.gift && <span className="pp-badge pp-badge--punk">{product.gift}</span>}
        </div>
      </Link>
      <WishButton slug={product.slug} className="pp-card__wish" />
      <Link href={href} className="pp-card__title">{product.name}</Link>
      {product.benefits?.[0] && <span className="pp-card__note line-clamp-1">{product.benefits[0]}</span>}
      <PriceLine product={product} className="pp-card__price" />
      <AddButton product={product} className="pp-card__action w-full" />
    </div>
  );
}
