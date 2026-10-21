"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function AddToCart({ slug, stock }: { slug: string; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center rounded-lg bg-white ring-1 ring-slate-200">
          <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.min(stock, q + 1))} aria-label="Increase">+</button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => {
            add(slug, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="flex-1 rounded-xl border-2 border-brand-600 px-6 py-3 font-bold text-brand-700 hover:bg-brand-50"
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>
        <button
          onClick={() => {
            add(slug, qty);
            router.push("/checkout/");
          }}
          className="flex-1 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
