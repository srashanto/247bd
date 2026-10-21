"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { newOrderId, Order, PaymentMethod, paymentLabels, saveOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { deliveryCharge, districts, STORE } from "@/lib/store";

const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-brand-600";

export default function CheckoutPage() {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", district: "Dhaka", address: "", note: "" });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [trx, setTrx] = useState("");
  const [error, setError] = useState("");

  const delivery = deliveryCharge(form.district, subtotal);
  const total = subtotal + delivery;

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-500">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-6xl">🧾</div>
        <h1 className="mt-4 text-2xl font-bold">Nothing to check out</h1>
        <Link href="/products/" className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-bold text-white">
          Browse products
        </Link>
      </div>
    );
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
      setError("Please enter a valid Bangladeshi mobile number, for example 01712345678.");
      return;
    }
    if (payment !== "cod" && trx.trim().length < 6) {
      setError(`Please enter the ${paymentLabels[payment]} transaction ID after sending money.`);
      return;
    }
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      customer: { ...form, phone },
      payment,
      transactionId: payment === "cod" ? undefined : trx.trim(),
      items: items.map((i) => ({ slug: i.slug, name: i.product.name, price: i.product.price, qty: i.qty })),
      subtotal,
      delivery,
      total,
    };
    saveOrder(order);
    clear();
    router.push(`/orders/?id=${order.id}&new=1`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form onSubmit={placeOrder} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h2 className="font-bold">Delivery information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Full name *
                <input required className={`${input} mt-1`} value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label className="text-sm">
                Mobile number *
                <input
                  required
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  className={`${input} mt-1`}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </label>
              <label className="text-sm">
                District *
                <select className={`${input} mt-1`} value={form.district} onChange={(e) => set("district", e.target.value)}>
                  {districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                Full address *
                <textarea
                  required
                  rows={2}
                  placeholder="House, road, area, thana"
                  className={`${input} mt-1`}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Order note (optional)
                <input className={`${input} mt-1`} value={form.note} onChange={(e) => set("note", e.target.value)} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <h2 className="font-bold">Payment method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(Object.keys(paymentLabels) as PaymentMethod[]).map((m) => (
                <label
                  key={m}
                  className={`cursor-pointer rounded-xl p-3 text-sm font-semibold ring-2 ${
                    payment === m ? "bg-brand-50 ring-brand-600" : "ring-slate-200"
                  }`}
                >
                  <input type="radio" name="payment" className="sr-only" checked={payment === m} onChange={() => setPayment(m)} />
                  {m === "cod" ? "💵" : m === "bkash" ? "🩷" : "🧡"} {paymentLabels[m]}
                </label>
              ))}
            </div>
            {payment !== "cod" && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                <p>
                  Send <b>{formatPrice(total)}</b> to our {paymentLabels[payment]} merchant number{" "}
                  <b>{STORE.phone}</b> using &ldquo;Send Money&rdquo;, then enter the transaction ID below.
                </p>
                <input
                  placeholder="Transaction ID (TrxID)"
                  className={`${input} mt-3`}
                  value={trx}
                  onChange={(e) => setTrx(e.target.value)}
                />
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-slate-100">
          <h2 className="font-bold">Your order</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex justify-between gap-3">
                <span>{product.emoji} {product.name} × {qty}</span>
                <span className="whitespace-nowrap font-medium">{formatPrice(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between">
              <span>Delivery ({form.district === "Dhaka" ? "inside" : "outside"} Dhaka)</span>
              <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-lg font-bold">
              <span>Total</span><span className="text-brand-700">{formatPrice(total)}</span>
            </div>
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button className="mt-5 w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700">
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}
