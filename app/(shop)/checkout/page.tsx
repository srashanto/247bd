"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductPhoto } from "@/components/ProductCard";
import { TrashIcon } from "@/components/Icons";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog";
import { NewOrder, Order, PayMethod, payLabels, rememberOrder, uploadScreenshot } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { couponDiscount, defaultCoupons, deliveryCharge, districts } from "@/lib/settings";
import { errorMessage, supabase } from "@/lib/supabase";

const input = "w-full border border-line bg-card px-3.5 py-3 text-[16px] outline-none placeholder:text-muted/70 focus:border-gold";
const label = "block text-[14px] font-medium";
const req = <span className="text-alert">*</span>;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h2 className="flex items-baseline gap-2 text-2xl font-semibold">
        <span className="font-display text-gold">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CopyNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(number);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="ml-2 border border-gold/50 px-2 py-0.5 text-[12px] font-semibold text-gold hover:bg-gold-soft"
    >
      {copied ? "কপি হয়েছে" : "কপি"}
    </button>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, setQty, remove, clear, ready } = useCart();
  const { settings } = useCatalog();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", district: "Dhaka", area: "", address: "", email: "", note: "" });
  const [method, setMethod] = useState<Exclude<PayMethod, "cod">>("bkash");
  const [trx, setTrx] = useState("");
  const [shot, setShot] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const [saveAddr, setSaveAddr] = useState(true);
  const filled = useRef(false);

  // Fill in the saved address for signed-in customers.
  useEffect(() => {
    const p = auth.profile;
    if (!p || filled.current) return;
    filled.current = true;
    setForm((f) => ({
      ...f,
      name: f.name || p.name || "",
      phone: f.phone || p.phone || "",
      district: p.district || f.district,
      area: f.area || p.area || "",
      address: f.address || p.address || "",
      email: f.email || auth.user?.email || "",
    }));
  }, [auth.profile, auth.user]);

  const delivery = deliveryCharge(settings, form.district, subtotal);
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + delivery;
  const advance = settings.advancePayment ? delivery : 0;

  async function checkCoupon(c: string, sub: number) {
    const db = supabase();
    if (db) {
      const { data, error } = await db.rpc("check_coupon", { p_code: c, p_subtotal: sub });
      if (error) return { discount: 0, message: errorMessage(error) };
      const r = data as { ok: boolean; discount: number; message?: string };
      return r.ok ? { discount: r.discount } : { discount: 0, message: r.message };
    }
    return couponDiscount(defaultCoupons.find((x) => x.code === c.toUpperCase()), sub);
  }

  async function applyCoupon(e?: React.FormEvent) {
    e?.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    const r = await checkCoupon(c, subtotal);
    if (r.message) {
      setCoupon(null);
      setCouponMsg(r.message);
    } else {
      setCoupon({ code: c, discount: r.discount });
      setCouponMsg(`Coupon ${c} applied: you save ${formatPrice(r.discount)}`);
    }
  }

  // Tiered coupons change with the subtotal, so re-check when the cart changes.
  useEffect(() => {
    if (!coupon) return;
    let alive = true;
    checkCoupon(coupon.code, subtotal).then((r) => {
      if (!alive) return;
      if (r.message) {
        setCoupon(null);
        setCouponMsg(r.message);
      } else if (r.discount !== coupon.discount) {
        setCoupon({ code: coupon.code, discount: r.discount });
        setCouponMsg(`Coupon ${coupon.code} applied: you save ${formatPrice(r.discount)}`);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-10 text-muted">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add products to your cart before checking out.</p>
        <Link href="/products/" className="btn-gold mt-6 inline-block px-6 py-3">Browse products</Link>
      </div>
    );
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phone = form.phone.replace(/[\s-]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) return setError("Enter an 11-digit Bangladeshi mobile number, for example 01712345678.");
    if (!form.area.trim() || !form.address.trim()) return setError("Enter your area / thana and full address.");
    if (settings.advancePayment && trx.trim().length < 4)
      return setError("ডেলিভারি চার্জ পাঠানোর পর Transaction ID অথবা যে নম্বর থেকে পাঠিয়েছেন তার শেষ ৪ ডিজিট দিন।");
    if (!agree) return setError("Tick the box to agree to the terms and conditions.");

    const payload: NewOrder = {
      customer: { name: form.name.trim(), phone, district: form.district, area: form.area.trim(), address: form.address.trim(), email: form.email.trim() || undefined },
      items: items.map((i) => ({ slug: i.slug, variation: i.variation ?? null, qty: i.qty })),
      coupon: coupon?.code ?? null,
      payment: settings.advancePayment ? { method, advance, trx: trx.trim() } : { method: "cod" },
      note: form.note.trim() || undefined,
    };

    setBusy(true);
    try {
      let order: Order;
      const db = supabase();
      if (db) {
        if (shot) payload.payment.screenshot = await uploadScreenshot(shot);
        const { data, error } = await db.rpc("place_order", { payload });
        if (error) throw error;
        order = data as Order;
      } else {
        order = {
          id: `247BD-${Date.now().toString().slice(-6)}`,
          created_at: new Date().toISOString(),
          status: "pending",
          customer: payload.customer,
          items: items.map((i) => ({ slug: i.slug, name: i.product.name, variation: i.variation, label: i.variationInfo?.label, price: i.unitPrice, qty: i.qty, image: i.product.images?.[0]?.thumb })),
          subtotal,
          discount,
          coupon: coupon?.code,
          delivery,
          total,
          payment: payload.payment,
          note: payload.note,
        };
      }
      if (auth.user && saveAddr) {
        await auth.saveProfile({ name: payload.customer.name, phone, district: form.district, area: payload.customer.area, address: payload.customer.address });
      }
      rememberOrder(order);
      clear();
      router.push(`/orders/?id=${encodeURIComponent(order.id)}&new=1`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="text-4xl font-bold uppercase [font-stretch:118%]">Checkout</h1>

      {auth.enabled && auth.ready && !auth.user && (
        <div className="mt-6 border border-line bg-card px-4 py-3 text-[15px]">
          <span className="text-muted">Have an account? </span>
          <Link href="/account/" className="font-semibold underline underline-offset-4">Sign in</Link>
          <span className="text-muted"> to fill in your address and see this order in your account.</span>
        </div>
      )}
      <div className="mt-3 border border-line bg-card px-4 py-3 text-[15px]">
        <span className="text-muted">Have a coupon? </span>
        <button type="button" onClick={() => setCouponOpen((v) => !v)} className="font-semibold underline underline-offset-4">
          Click here to enter your code
        </button>
        {couponOpen && (
          <form onSubmit={applyCoupon} className="mt-3 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className={`${input} uppercase`} aria-label="Coupon code" />
            <button className="btn-gold shrink-0 px-5 text-[13px]">Apply</button>
          </form>
        )}
        {couponMsg && <p className={`mt-2 text-sm ${coupon ? "text-uni" : "text-alert"}`}>{couponMsg}</p>}
      </div>

      <form onSubmit={placeOrder} className="mt-8 space-y-10">
        <Step n={1} title="Your order">
          <div className="flex justify-between border-b border-line pb-2 text-[12px] font-semibold uppercase tracking-wider text-muted">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <ul className="divide-y divide-line">
            {items.map((it) => (
              <li key={it.key} className="flex gap-3 py-4">
                <span className="block h-16 w-16 shrink-0 overflow-hidden bg-card"><ProductPhoto product={it.product} /></span>
                <div className="flex-1">
                  <p className="text-[15px] leading-snug">
                    {it.product.name}
                    {it.variationInfo && <span className="text-muted"> - {it.variationInfo.label}</span>}
                  </p>
                  <p className="text-[13px] text-muted">{formatPrice(it.unitPrice)} × {it.qty}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center ring-1 ring-line">
                      <button type="button" className="px-3 py-0.5" onClick={() => setQty(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button type="button" className="px-3 py-0.5" onClick={() => setQty(it.key, Math.min(it.maxQty, it.qty + 1))} aria-label="Increase">+</button>
                    </div>
                    <button type="button" onClick={() => remove(it.key)} aria-label={`Remove ${it.product.name}`} className="text-muted hover:text-alert">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <span className="whitespace-nowrap text-[15px]">{formatPrice(it.unitPrice * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t border-line pt-4 text-[15px]">
            <div className="flex justify-between"><dt className="text-[12px] font-semibold uppercase tracking-wider text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && (
              <div className="flex justify-between text-uni">
                <dt className="text-[12px] font-semibold uppercase tracking-wider">Coupon: {coupon?.code}</dt>
                <dd>-{formatPrice(discount)} <button type="button" onClick={() => { setCoupon(null); setCouponMsg(""); }} className="ml-1 text-sm text-muted underline">Remove</button></dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-muted">Shipment</dt>
              <dd>Delivery Charge: {delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-xl font-semibold">
              <dt>Total</dt><dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </Step>

        <Step n={2} title="Delivery information">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`${label} sm:col-span-2`}>
              Full name {req}
              <input required autoComplete="name" className={`${input} mt-1.5`} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Mobile number {req}
              <input required inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" className={`${input} mt-1.5`} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </label>
            <label className={label}>
              District / জেলা {req}
              <select className={`${input} mt-1.5`} value={form.district} onChange={(e) => set("district", e.target.value)}>
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className={label}>
              Area / Thana {req}
              <input required placeholder="e.g. Mirpur" className={`${input} mt-1.5`} value={form.area} onChange={(e) => set("area", e.target.value)} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Full address {req}
              <input required autoComplete="street-address" placeholder="House, road, area" className={`${input} mt-1.5`} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Email <span className="text-muted">(optional)</span>
              <input type="email" autoComplete="email" className={`${input} mt-1.5`} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </label>
          </div>
          {auth.user && (
            <label className="mt-4 flex items-center gap-3 text-[15px]">
              <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="h-4 w-4 accent-[#c8ac56]" />
              Save this address to my account
            </label>
          )}
          <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-wider">Additional information</h3>
          <label className={`${label} mt-3`}>
            Order notes (optional)
            <textarea rows={3} placeholder="Notes about your order, e.g. special notes for delivery." className={`${input} mt-1.5`} value={form.note} onChange={(e) => set("note", e.target.value)} />
          </label>
        </Step>

        <Step n={3} title="Payment">
          {settings.advancePayment && (
            <div className="border border-gold/40 bg-gold-soft p-5 text-[15px] leading-relaxed">
              <h3 className="text-lg font-semibold">ডেলিভারি চার্জ অগ্রিম পরিশোধ করুন</h3>
              <p className="mt-1 text-ink/85">অর্ডার কনফার্ম করতে ডেলিভারি চার্জ অগ্রিম পরিশোধ করতে হবে। বাকি টাকা পণ্য হাতে পেয়ে পরিশোধ করবেন।</p>
              <p className="mt-3 text-lg">পরিশোধ করতে হবে: <b className="text-gold-2">{formatPrice(advance)}</b></p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(["bkash", "nagad", "rocket"] as const).map((m, i) => (
                  <div key={m} className="border border-line bg-paper/60 p-3 text-[14px]">
                    <p className="font-semibold">অপশন {["১", "২", "৩"][i]}: {payLabels[m]} (Personal)</p>
                    <p className="mt-1">নম্বর: <b>{settings.paymentNumbers[m]}</b><CopyNumber number={settings.paymentNumbers[m]} /></p>
                    <p className="mt-1 text-muted">Send Money করুন উপরের নম্বরে</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-ink/85">পেমেন্ট সম্পন্ন করার পর নিচে আপনার Transaction ID দিন এবং চাইলে স্ক্রিনশট আপলোড করুন।</p>

              <fieldset className="mt-4">
                <legend className={label}>যে মাধ্যমে পাঠিয়েছেন {req}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["bkash", "nagad", "rocket"] as const).map((m) => (
                    <label key={m} className={`cursor-pointer border px-4 py-2 text-[15px] ${method === m ? "border-gold bg-paper text-gold-2" : "border-line"}`}>
                      <input type="radio" name="method" className="sr-only" checked={method === m} onChange={() => setMethod(m)} />
                      {payLabels[m]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className={`${label} mt-4`}>
                Last 4 Digit or Transaction ID {req}
                <input value={trx} onChange={(e) => setTrx(e.target.value)} className={`${input} mt-1.5`} />
                <span className="mt-1 block text-[13px] text-muted">যে নম্বর থেকে পাঠিয়েছেন তার শেষ ৪ ডিজিট অথবা Transaction ID দিন</span>
              </label>

              {supabase() && (
                <div className="mt-4">
                  <p className={label}>Payment Screenshot</p>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f && f.type.startsWith("image/")) setShot(f);
                    }}
                    className="mt-1.5 flex w-full flex-col items-center gap-1 border border-dashed border-gold/50 px-4 py-6 text-center text-[14px] hover:bg-paper/40"
                  >
                    <span className="text-2xl" aria-hidden>📷</span>
                    {shot ? <span className="text-gold-2">{shot.name}</span> : <span>ক্লিক করুন বা স্ক্রিনশট এখানে টেনে আনুন</span>}
                    <span className="text-[12px] text-muted">JPG, PNG, WEBP — যেকোনো সাইজ, অটো ছোট করা হবে</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setShot(e.target.files?.[0] ?? null)} />
                </div>
              )}
            </div>
          )}

          <div className="mt-4 border border-line bg-card p-4">
            <p className="font-semibold">Cash on delivery</p>
            <p className="mt-1 text-[14px] text-muted">
              {settings.advancePayment ? `Pay the remaining ${formatPrice(total - advance)} in cash when your parcel arrives.` : "Pay with cash upon delivery."}
            </p>
          </div>

          <p className="mt-6 text-[13px] text-muted">
            Your personal data will be used to process your order and support your experience on this website.
          </p>
          <label className="mt-3 flex items-start gap-3 text-[15px]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[#c8ac56]" />
            <span>I have read and agree to the website <Link href="/help/" className="underline underline-offset-4">terms and conditions</Link> {req}</span>
          </label>

          {error && <p role="alert" className="mt-5 bg-alert/10 p-3 text-[15px] text-alert">{error}</p>}
          <button disabled={busy} className="btn-gold mt-6 w-full py-4 text-[15px] disabled:opacity-60">
            {busy ? "Placing order…" : `Confirm order · ${formatPrice(total)}`}
          </button>
        </Step>
      </form>
    </div>
  );
}
