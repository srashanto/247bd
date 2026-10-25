"use client";

import Link from "next/link";
import Packshot from "@/components/Packshot";
import { tileBg } from "@/components/ProductCard";
import { TrashIcon } from "@/components/Icons";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { STORE } from "@/lib/store";

export default function CartPage() {
  const { items, subtotal, setQty, remove, ready } = useCart();

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading cart…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Pick a few essentials and they&apos;ll show up here.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/products/?for=him" className="rounded-full bg-him px-6 py-3 font-semibold text-paper hover:bg-him-deep">Shop for him</Link>
          <Link href="/products/?for=her" className="rounded-full bg-her px-6 py-3 font-semibold text-paper hover:bg-her-deep">Shop for her</Link>
        </div>
      </div>
    );
  }

  const toFree = STORE.freeDeliveryOver - subtotal;
  const progress = Math.min(100, Math.round((subtotal / STORE.freeDeliveryOver) * 100));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map(({ product, qty }) => (
            <li key={product.slug} className="flex gap-4 py-4">
              <Link href={`/products/${product.slug}/`} className={`grid h-24 w-24 shrink-0 place-items-center rounded-2xl ${tileBg[product.gender]}`}>
                <Packshot product={product} className="h-[78%]" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${product.slug}/`} className="font-display font-semibold leading-snug hover:underline">{product.name}</Link>
                  <span className="font-semibold">{formatPrice(product.price * qty)}</span>
                </div>
                <span className="text-sm text-muted">{formatPrice(product.price)} each{product.size && ` · ${product.size}`}</span>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center rounded-full ring-1 ring-line">
                    <button className="px-3 py-1" onClick={() => setQty(product.slug, qty - 1)} aria-label={`Decrease ${product.name}`}>−</button>
                    <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                    <button className="px-3 py-1" onClick={() => setQty(product.slug, Math.min(product.stock, qty + 1))} aria-label={`Increase ${product.name}`}>+</button>
                  </div>
                  <button onClick={() => remove(product.slug)} className="flex items-center gap-1 text-sm text-muted hover:text-alert">
                    <TrashIcon /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-[18px] bg-white p-5 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-1.5 flex justify-between text-sm text-muted">
            <span>Delivery</span>
            <span>{toFree <= 0 ? "Free" : "Calculated at checkout"}</span>
          </div>
          <div className="mt-5">
            <div className="h-1.5 overflow-hidden rounded-full bg-paper">
              <div className="h-full rounded-full bg-saffron" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm">
              {toFree > 0 ? <>Add {formatPrice(toFree)} more for free delivery.</> : <>You&apos;ve unlocked free delivery.</>}
            </p>
          </div>
          <Link href="/checkout/" className="mt-5 block rounded-full bg-ink py-3.5 text-center font-semibold text-paper hover:bg-him-deep">
            Check out
          </Link>
          <Link href="/products/" className="mt-3 block text-center text-[15px] underline underline-offset-4">Keep shopping</Link>
        </aside>
      </div>
    </div>
  );
}
