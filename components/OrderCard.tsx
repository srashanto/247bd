"use client";

import { useCatalog } from "@/lib/catalog";
import { Order, payLabels, statusLabels, whatsappLink } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

const steps = ["pending", "confirmed", "shipped", "delivered"] as const;

function StatusBar({ status }: { status: Order["status"] }) {
  if (status === "cancelled" || status === "returned")
    return <p className="mt-3 inline-block bg-alert/15 px-3 py-1 text-sm font-semibold text-alert">{statusLabels[status]}</p>;
  const at = steps.indexOf(status as (typeof steps)[number]);
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1 text-[12px] font-semibold uppercase tracking-wider">
      {steps.map((s, i) => (
        <li key={s} className={i <= at ? "text-gold" : "text-muted"}>
          <span className={`mb-1.5 block h-1 ${i <= at ? "bg-gold" : "bg-line"}`} />
          {statusLabels[s]}
        </li>
      ))}
    </ol>
  );
}

export default function OrderCard({ o, highlight }: { o: Order; highlight?: boolean }) {
  const { settings } = useCatalog();
  return (
    <li className={`bg-card p-5 ring-1 ${highlight ? "ring-gold" : "ring-line"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-semibold">{o.id}</div>
          <div className="text-sm text-muted">{new Date(o.created_at).toLocaleString("en-GB")}</div>
        </div>
        <span className="font-semibold">{formatPrice(o.total)}</span>
      </div>
      <StatusBar status={o.status} />
      <ul className="mt-4 space-y-1 text-[15px]">
        {o.items.map((i, n) => (
          <li key={n} className="flex justify-between gap-3">
            <span>{i.name}{i.label ? ` (${i.label})` : ""} × {i.qty}</span>
            <span>{formatPrice(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-line pt-3 text-[14px] text-muted">
        Delivery {formatPrice(o.delivery)}
        {o.discount ? ` · Discount -${formatPrice(o.discount)}` : ""}
        {o.payment?.trx ? ` · Advance paid by ${payLabels[o.payment.method]}` : " · Cash on delivery"}
        {o.tracking ? ` · ${o.courier || "Courier"} tracking: ${o.tracking}` : ""}
      </div>
      <a href={whatsappLink(o, settings)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] font-semibold underline underline-offset-4 hover:text-gold-2">
        Send this order on WhatsApp
      </a>
    </li>
  );
}

