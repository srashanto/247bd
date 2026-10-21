"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadOrders, Order, paymentLabels, whatsappLink } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default function OrdersView() {
  const params = useSearchParams();
  const highlight = params.get("id");
  const isNew = params.get("new") === "1";
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => setOrders(loadOrders()), []);

  if (!orders) return <div className="mx-auto max-w-4xl px-4 py-10 text-slate-500">Loading orders...</div>;

  const current = orders.find((o) => o.id === highlight);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {isNew && current && (
        <div className="mb-8 rounded-2xl bg-brand-600 p-6 text-white">
          <div className="text-4xl">🎉</div>
          <h1 className="mt-2 text-2xl font-bold">Thank you, {current.customer.name}!</h1>
          <p className="mt-1 text-brand-50">
            Your order <b>{current.id}</b> has been placed. Please confirm it on WhatsApp so we can start processing it right away.
          </p>
          <a
            href={whatsappLink(current)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-bold text-brand-700 hover:bg-brand-50"
          >
            💬 Confirm order on WhatsApp
          </a>
        </div>
      )}

      <h2 className="text-2xl font-bold">My orders</h2>
      <p className="text-sm text-slate-500">Orders placed from this browser.</p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-slate-100">
          <div className="text-5xl">📦</div>
          <p className="mt-3 text-slate-600">You have not placed any orders yet.</p>
          <Link href="/products/" className="mt-5 inline-block rounded-xl bg-brand-600 px-6 py-3 font-bold text-white">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className={`rounded-2xl bg-white p-5 ring-1 ${o.id === highlight ? "ring-2 ring-brand-600" : "ring-slate-100"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-bold">{o.id}</div>
                  <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString("en-GB")}</div>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Processing</span>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((i) => (
                  <li key={i.slug} className="flex justify-between">
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-600">
                  {paymentLabels[o.payment]} · Delivery {o.delivery === 0 ? "free" : formatPrice(o.delivery)} · {o.customer.district}
                </span>
                <span className="text-lg font-bold text-brand-700">{formatPrice(o.total)}</span>
              </div>
              <a href={whatsappLink(o)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-brand-600">
                Send to shop on WhatsApp →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
