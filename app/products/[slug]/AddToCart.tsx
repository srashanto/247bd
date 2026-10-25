"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { CheckIcon } from "@/components/Icons";

export default function AddToCart({ slug, stock }: { slug: string; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-card ring-1 ring-line">
          <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
          <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
          <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.min(stock, q + 1))} aria-label="Increase quantity">+</button>
        </div>
        <button
          onClick={() => {
            add(slug, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1600);
          }}
          className={`flex min-w-40 flex-1 items-center justify-center gap-2 border-2 px-6 py-3 font-semibold ${
            added ? "border-gold text-gold-2" : "border-ink hover:bg-card-2"
          }`}
        >
          {added ? <><CheckIcon /> Added to cart</> : "Add to cart"}
        </button>
      </div>
      <button
        onClick={() => {
          add(slug, qty);
          router.push("/checkout/");
        }}
        className="mt-3 w-full btn-gold px-6 py-3.5 font-semibold"
      >
        Buy now, pay on delivery
      </button>
      {stock <= 15 && <p className="mt-3 text-sm text-alert">Only {stock} left in stock</p>}
    </div>
  );
}
