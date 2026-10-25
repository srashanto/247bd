"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatIcon } from "@/components/Icons";
import OrderCard from "@/components/OrderCard";
import { useCatalog } from "@/lib/catalog";
import { loadMyOrders, Order, trackOrder, whatsappLink } from "@/lib/orders";
import { errorMessage } from "@/lib/supabase";

export default function OrdersView() {
  const params = useSearchParams();
  const highlight = params.get("id");
  const isNew = params.get("new") === "1";
  const { settings } = useCatalog();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tid, setTid] = useState("");
  const [tphone, setTphone] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [tmsg, setTmsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setOrders(loadMyOrders()), []);

  async function onTrack(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setTmsg("");
    setFound(null);
    try {
      const o = await trackOrder(tid, tphone);
      if (o) setFound(o);
      else setTmsg("No order matches this order number and phone number. Check both and try again.");
    } catch (err) {
      setTmsg(errorMessage(err));
    }
    setBusy(false);
  }

  if (!orders) return <div className="mx-auto max-w-3xl px-4 py-10 text-muted">Loading…</div>;
  const current = orders.find((o) => o.id === highlight);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      {isNew && current && (
        <div className="mb-10 border border-gold/40 bg-gold-soft p-6 sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-gold">Thank you</p>
          <h1 className="mt-2 text-3xl font-semibold">Order placed, {current.customer.name.split(" ")[0]}</h1>
          <p className="mt-2 max-w-prose text-ink/85">
            Your order number is <b>{current.id}</b>. We&apos;ll call you to confirm it. To speed things up, send it to us on WhatsApp.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={whatsappLink(current, settings)} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 px-5 py-3">
              <ChatIcon /> Confirm on WhatsApp
            </a>
            <Link href="/products/" className="btn-ghost px-5 py-3">Keep shopping</Link>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold">Track your order</h2>
      <form onSubmit={onTrack} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input required value={tid} onChange={(e) => setTid(e.target.value)} placeholder="Order number, e.g. 247BD-1001" aria-label="Order number" className="border border-line bg-card px-3.5 py-3 outline-none focus:border-gold" />
        <input required value={tphone} onChange={(e) => setTphone(e.target.value)} inputMode="tel" placeholder="Mobile number" aria-label="Mobile number" className="border border-line bg-card px-3.5 py-3 outline-none focus:border-gold" />
        <button disabled={busy} className="btn-gold px-6 py-3 text-[13px] disabled:opacity-60">{busy ? "Checking…" : "Track"}</button>
      </form>
      {tmsg && <p className="mt-3 text-[15px] text-alert">{tmsg}</p>}
      {found && <ul className="mt-5"><OrderCard o={found} highlight /></ul>}

      <h2 className="mt-14 text-2xl font-semibold">My orders</h2>
      <p className="text-muted">Orders placed from this phone or browser.</p>
      {orders.length === 0 ? (
        <div className="mt-6 bg-card p-8 text-center ring-1 ring-line">
          <p className="text-muted">You haven&apos;t placed an order from this device yet.</p>
          <Link href="/products/" className="btn-gold mt-5 inline-block px-6 py-3">Start shopping</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => <OrderCard key={o.id} o={o} highlight={o.id === highlight} />)}
        </ul>
      )}
    </div>
  );
}
