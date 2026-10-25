"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { newOrderId, Order, PaymentMethod, paymentLabels, saveOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { deliveryCharge, districts, STORE } from "@/lib/store";

const input = "w-full border border-line bg-card px-3.5 py-2.5 text-[16px] outline-none focus:border-gold";

const paymentHelp: Record<PaymentMethod, string> = {
  cod: "Pay the delivery person in cash",
  bkash: "Send Money, then enter TrxID",
  nagad: "Send Money, then enter TrxID",
};

export default function CheckoutPage() {
  const { items, subtotal, clear, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", district: "Dhaka", address: "", note: "" });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [trx, setTrx] = useState("");
  const [error, setError] = useState("");

  const delivery = deliveryCharge(form.district, subtotal);
  const total = subtotal + delivery;

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add products to your cart before checking out.</p>
        <Link href="/products/" className="mt-6 inline-block btn-gold px-6 py-3 font-semibold">
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
      setError("Enter an 11-digit Bangladeshi mobile number, for example 01712345678.");
      return;
    }
    if (payment !== "cod" && trx.trim().length < 6) {
      setError(`Enter the ${paymentLabels[payment]} transaction ID (TrxID) you got after sending money.`);
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-muted">No account needed. We&apos;ll call or WhatsApp you to confirm.</p>
      <form onSubmit={placeOrder} className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-[15px]">
                Full name
                <input required autoComplete="name" className={`${input} mt-1`} value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label className="text-[15px]">
                Mobile number
                <input
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  className={`${input} mt-1`}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </label>
              <label className="text-[15px]">
                District
                <select className={`${input} mt-1`} value={form.district} onChange={(e) => set("district", e.target.value)}>
                  {districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="text-[15px] sm:col-span-2">
                Full address
                <textarea
                  required
                  rows={2}
                  autoComplete="street-address"
                  placeholder="House, road, area, thana"
                  className={`${input} mt-1`}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </label>
              <label className="text-[15px] sm:col-span-2">
                Note for us <span className="text-muted">(optional)</span>
                <input className={`${input} mt-1`} value={form.note} onChange={(e) => set("note", e.target.value)} />
              </label>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup">
              {(Object.keys(paymentLabels) as PaymentMethod[]).map((m) => (
                <label
                  key={m}
                  className={`cursor-pointer bg-card p-4 ring-2 ${payment === m ? "ring-gold" : "ring-line hover:ring-muted"}`}
                >
                  <input type="radio" name="payment" className="sr-only" checked={payment === m} onChange={() => setPayment(m)} />
                  <span className="block font-semibold">{paymentLabels[m]}</span>
                  <span className="mt-0.5 block text-sm text-muted">{paymentHelp[m]}</span>
                </label>
              ))}
            </div>
            {payment !== "cod" && (
              <div className="mt-4 bg-gold-soft p-4 text-[15px]">
                <p>
                  Send <b>{formatPrice(total)}</b> to our {paymentLabels[payment]} number <b>{STORE.paymentNumber}</b> using
                  &ldquo;Send Money&rdquo;, then enter the transaction ID below.
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

        <aside className="h-fit bg-card p-5 ring-1 ring-line lg:sticky lg:top-32">
          <h2 className="text-lg font-semibold">Your order</h2>
          <ul className="mt-4 space-y-2 text-[15px]">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex justify-between gap-3">
                <span>{product.name} × {qty}</span>
                <span className="whitespace-nowrap">{formatPrice(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4 text-[15px]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between">
              <span>Delivery ({form.district === "Dhaka" ? "inside" : "outside"} Dhaka)</span>
              <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          {error && <p role="alert" className="mt-4 bg-alert/10 p-3 text-sm text-alert">{error}</p>}
          <button className="mt-5 w-full btn-gold py-3.5 font-semibold">
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}
