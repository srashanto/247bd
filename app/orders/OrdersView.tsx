"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatIcon } from "@/components/Icons";
import { loadOrders, Order, paymentLabels, whatsappLink } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export default function OrdersView() {
  const params = useSearchParams();
  const highlight = params.get("id");
  const isNew = params.get("new") === "1";
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => setOrders(loadOrders()), []);

  if (!orders) return <div className="mx-auto max-w-4xl px-4 py-10 text-muted">Loading orders…</div>;

  const current = orders.find((o) => o.id === highlight);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      {isNew && current && (
        <div className="mb-10 border border-gold/40 bg-gold-soft p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold">Order placed, {current.customer.name.split(" ")[0]}</h1>
          <p className="mt-2 max-w-prose text-ink/85">
            Your order number is <b>{current.id}</b>. Send it to us on WhatsApp so we can confirm and pack it today.
          </p>
          <a
            href={whatsappLink(current)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 btn-gold inline-flex items-center gap-2 px-5 py-3"
          >
            <ChatIcon /> Confirm on WhatsApp
          </a>
        </div>
      )}

      <h2 className="font-display text-2xl font-bold">My orders</h2>
      <p className="text-muted">Orders placed from this phone or browser.</p>

      {orders.length === 0 ? (
        <div className="mt-8 bg-card p-10 text-center ring-1 ring-line">
          <p className="font-display text-xl font-semibold">No orders yet</p>
          <p className="mt-1 text-muted">When you place an order, you can track it here.</p>
          <Link href="/products/" className="mt-5 inline-block btn-gold px-6 py-3 font-semibold">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className={` bg-card p-5 ring-1 ${o.id === highlight ? "ring-1 ring-gold" : "ring-line"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-sm text-muted">{new Date(o.createdAt).toLocaleString("en-GB")}</div>
                </div>
                <span className="bg-gold-soft px-3 py-1 text-sm font-semibold">Processing</span>
              </div>
              <ul className="mt-3 space-y-1 text-[15px]">
                {o.items.map((i) => (
                  <li key={i.slug} className="flex justify-between gap-3">
                    <span>{i.name} × {i.qty}</span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-[15px]">
                <span className="text-muted">
                  {paymentLabels[o.payment]}, delivery {o.delivery === 0 ? "free" : formatPrice(o.delivery)}, {o.customer.district}
                </span>
                <span className="text-lg font-bold">{formatPrice(o.total)}</span>
              </div>
              <a href={whatsappLink(o)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[15px] font-semibold underline underline-offset-4">
                Send this order on WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
