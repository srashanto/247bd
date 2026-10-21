"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { STORE } from "@/lib/store";

export default function CartPage() {
  const { items, subtotal, setQty, remove, ready } = useCart();

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-500">Loading cart...</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add some products and they will show up here.</p>
        <Link href="/products/" className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
          Start shopping
        </Link>
      </div>
    );
  }

  const toFree = STORE.freeDeliveryOver - subtotal;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Shopping cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-3">
          {items.map(({ product, qty }) => (
            <li key={product.slug} className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
              <Link
                href={`/products/${product.slug}/`}
                className={`grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${product.color} text-4xl`}
              >
                {product.emoji}
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${product.slug}/`} className="font-semibold hover:text-brand-700">{product.name}</Link>
                <span className="text-sm text-slate-500">{formatPrice(product.price)} each</span>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                    <button className="px-3 py-1" onClick={() => setQty(product.slug, qty - 1)} aria-label="Decrease">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button className="px-3 py-1" onClick={() => setQty(product.slug, Math.min(product.stock, qty + 1))} aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(product.slug)} className="text-sm text-accent-600 hover:underline">Remove</button>
                </div>
              </div>
              <div className="font-bold text-brand-700">{formatPrice(product.price * qty)}</div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-slate-100">
          <h2 className="font-bold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-500">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          {toFree > 0 ? (
            <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Add {formatPrice(toFree)} more to get free delivery.
            </p>
          ) : (
            <p className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-900">🎉 You get free delivery!</p>
          )}
          <Link href="/checkout/" className="mt-5 block rounded-xl bg-brand-600 py-3 text-center font-bold text-white hover:bg-brand-700">
            Proceed to checkout
          </Link>
          <Link href="/products/" className="mt-3 block text-center text-sm text-brand-600">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
