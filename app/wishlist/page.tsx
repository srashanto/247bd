"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProduct, Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const { slugs, ready } = useWishlist();
  if (!ready) return <div className="mx-auto max-w-7xl px-4 py-10 text-muted">Loading…</div>;

  const list = slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold">Wishlist</h1>
      {list.length === 0 ? (
        <div className="mt-8 max-w-lg">
          <p className="text-muted">Tap the heart on any product to save it here for later.</p>
          <Link href="/products/" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-paper">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-1 text-muted">{list.length} saved product{list.length === 1 ? "" : "s"}</p>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
