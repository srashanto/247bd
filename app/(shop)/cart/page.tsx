"use client";

import Link from "next/link";
import { ProductPhoto } from "@/components/ProductCard";
import { TrashIcon } from "@/components/Icons";
import { useCart } from "@/lib/cart";
import { formatPrice, productHref } from "@/lib/products";

export default function CartPage() {
  const { items, subtotal, setQty, remove, ready } = useCart();

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading cart…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add a few products and they&apos;ll show up here.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/products/" className="btn-gold px-6 py-3">Shop all</Link>
          <Link href="/combos/" className="btn-ghost px-6 py-3">Shop combos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((it) => (
            <li key={it.key} className="flex gap-4 py-4">
              <Link href={productHref(it.product)} className="block h-24 w-24 shrink-0 overflow-hidden bg-card">
                <ProductPhoto product={it.product} />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link href={productHref(it.product)} className="font-medium leading-snug hover:text-gold-2">{it.product.name}</Link>
                    {it.variationInfo && <p className="text-sm text-muted">{it.variationInfo.label}</p>}
                    {it.product.gift && <p className="text-[13px] text-gold">🎁 {it.product.gift}</p>}
                  </div>
                  <span className="font-semibold">{formatPrice(it.unitPrice * it.qty)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center ring-1 ring-line">
                    <button className="px-3 py-1" onClick={() => setQty(it.key, it.qty - 1)} aria-label={`Decrease ${it.product.name}`}>−</button>
                    <span className="w-7 text-center text-sm font-semibold">{it.qty}</span>
                    <button className="px-3 py-1" onClick={() => setQty(it.key, Math.min(it.maxQty, it.qty + 1))} aria-label={`Increase ${it.product.name}`}>+</button>
                  </div>
                  <button onClick={() => remove(it.key)} className="flex items-center gap-1 text-sm text-muted hover:text-alert">
                    <TrashIcon /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit bg-card p-5 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-2 text-sm text-muted">Delivery charge and coupon are added at checkout.</p>
          <Link href="/checkout/" className="btn-gold mt-5 block py-4 text-center text-[14px]">Proceed to checkout</Link>
          <Link href="/products/" className="mt-3 block text-center text-[15px] underline underline-offset-4">Keep shopping</Link>
        </aside>
      </div>
    </div>
  );
}
