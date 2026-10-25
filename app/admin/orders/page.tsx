"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { btn, btnGhost, field, useAdmin } from "@/components/admin/AdminShell";
import { Empty, PageTitle, StatusBadge, timeAgo, Toast, useNewOrders } from "@/components/admin/common";
import { Order, OrderStatus, payLabels, statusLabels } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { defaultSettings, Settings } from "@/lib/settings";
import { errorMessage } from "@/lib/supabase";

const PAGE = 50;
const filters: ("all" | OrderStatus)[] = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];

function Invoice({ o, s }: { o: Order; s: Settings }) {
  return (
    <div className="print-only bg-white p-8 text-black">
      <div className="flex justify-between">
        <div>
          <p className="text-3xl font-extrabold">247BD</p>
          <p className="text-sm">A PahelaPride brand · {s.phone} · {s.email}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-lg font-bold">Invoice {o.id}</p>
          <p>{new Date(o.created_at).toLocaleString("en-GB")}</p>
        </div>
      </div>
      <div className="mt-6 text-sm">
        <p className="font-bold">Deliver to</p>
        <p>{o.customer.name} · {o.customer.phone}</p>
        <p>{o.customer.address}, {o.customer.area}, {o.customer.district}</p>
      </div>
      <table className="mt-6 w-full text-sm">
        <thead><tr className="border-b border-black text-left"><th className="py-1">Item</th><th>Qty</th><th className="text-right">Amount</th></tr></thead>
        <tbody>
          {o.items.map((i, n) => (
            <tr key={n} className="border-b border-gray-300">
              <td className="py-1">{i.name}{i.label ? ` (${i.label})` : ""}</td>
              <td>{i.qty}</td>
              <td className="text-right">{formatPrice(i.price * i.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto mt-4 w-64 space-y-1 text-sm">
        <p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></p>
        {o.discount > 0 && <p className="flex justify-between"><span>Discount {o.coupon}</span><span>-{formatPrice(o.discount)}</span></p>}
        <p className="flex justify-between"><span>Delivery</span><span>{formatPrice(o.delivery)}</span></p>
        <p className="flex justify-between border-t border-black pt-1 font-bold"><span>Total</span><span>{formatPrice(o.total)}</span></p>
        {o.payment?.advance ? <p className="flex justify-between"><span>Advance paid</span><span>-{formatPrice(o.payment.advance)}</span></p> : null}
        <p className="flex justify-between text-base font-bold"><span>Collect (COD)</span><span>{formatPrice(o.total - (o.payment?.advance ?? 0))}</span></p>
      </div>
      {o.note && <p className="mt-6 text-sm">Customer note: {o.note}</p>}
    </div>
  );
}

function OrderDetail({ id, onChanged }: { id: string; onChanged: () => void }) {
  const { db } = useAdmin();
  const router = useRouter();
  const [o, setO] = useState<Order | null>(null);
  const [s, setS] = useState<Settings>(defaultSettings);
  const [shot, setShot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const [{ data }, st] = await Promise.all([
      db.from("orders").select("*").eq("id", id).maybeSingle(),
      db.from("settings").select("data").eq("id", 1).maybeSingle(),
    ]);
    const ord = data as Order | null;
    setO(ord);
    if (st.data?.data) setS({ ...defaultSettings, ...st.data.data });
    if (ord) {
      setNote(ord.admin_note ?? "");
      setCourier(ord.courier ?? "Steadfast");
      setTracking(ord.tracking ?? "");
      if (ord.payment?.screenshot) {
        const { data: signed } = await db.storage.from("payment-proofs").createSignedUrl(ord.payment.screenshot, 3600);
        setShot(signed?.signedUrl ?? null);
      }
    }
  }, [db, id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!o) return <p className="text-muted">Loading order…</p>;

  async function setStatus(st: OrderStatus) {
    setBusy(true);
    const { error } = await db.rpc("set_order_status", { p_id: o!.id, p_status: st });
    setBusy(false);
    if (error) return setToast(errorMessage(error));
    setToast(`Marked ${statusLabels[st].toLowerCase()}${st === "cancelled" || st === "returned" ? ", stock returned" : ""}`);
    load();
    onChanged();
  }

  async function save(patch: Partial<Order>, msg: string) {
    setBusy(true);
    const { error } = await db.from("orders").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", o!.id);
    setBusy(false);
    if (error) return setToast(errorMessage(error));
    setToast(msg);
    load();
    onChanged();
  }

  async function del() {
    if (!confirm(`Delete order ${o!.id} for good? This can't be undone. Cancel it instead if you want to keep a record.`)) return;
    const { error } = await db.from("orders").delete().eq("id", o!.id);
    if (error) return setToast(errorMessage(error));
    onChanged();
    router.push("/admin/orders/");
  }

  const phone = o.customer.phone.replace(/^\+?88/, "");
  const cod = o.total - (o.payment?.advance ?? 0);

  return (
    <div>
      <div className="no-print">
        <Link href="/admin/orders/" className="text-[14px] text-muted hover:text-ink">← All orders</Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">{o.id}</h1>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className={btnGhost}>Print invoice</button>
            <button onClick={del} className={`${btnGhost} text-alert`}>Delete</button>
          </div>
        </div>
        <p className="mt-1 text-muted">{new Date(o.created_at).toLocaleString("en-GB")} · <StatusBadge status={o.status} /></p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(statusLabels) as OrderStatus[]).map((st) => (
            <button
              key={st}
              disabled={busy || st === o.status}
              onClick={() => setStatus(st)}
              className={st === o.status ? `${btn}` : btnGhost}
            >
              {statusLabels[st]}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="bg-card p-5 ring-1 ring-line">
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-line">
              {o.items.map((i, n) => (
                <li key={n} className="flex items-center gap-3 py-3">
                  {i.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt="" className="h-12 w-12 shrink-0 object-cover" />
                  )}
                  <div className="flex-1">
                    <p>{i.name}</p>
                    <p className="text-[13px] text-muted">{i.label ? `${i.label} · ` : ""}{formatPrice(i.price)} × {i.qty}</p>
                  </div>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[15px]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
              {o.discount > 0 && <div className="flex justify-between text-uni"><dt>Coupon {o.coupon}</dt><dd>-{formatPrice(o.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Delivery ({o.customer.district === "Dhaka" ? "inside" : "outside"} Dhaka)</dt><dd>{formatPrice(o.delivery)}</dd></div>
              <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(o.total)}</dd></div>
              {o.payment?.advance ? <div className="flex justify-between text-muted"><dt>Advance paid</dt><dd>-{formatPrice(o.payment.advance)}</dd></div> : null}
              <div className="flex justify-between font-semibold text-gold-2"><dt>Collect on delivery</dt><dd>{formatPrice(cod)}</dd></div>
            </dl>
            {o.note && <p className="mt-4 bg-paper p-3 text-[14px]"><b>Customer note:</b> {o.note}</p>}
          </section>

          <div className="space-y-6">
            <section className="bg-card p-5 ring-1 ring-line">
              <h2 className="font-semibold">Customer</h2>
              <p className="mt-2">
                {o.customer.name}
                <span className="ml-2 text-[12px] text-muted">{(o as Order & { user_id?: string | null }).user_id ? "has an account" : "guest"}</span>
              </p>
              <p className="text-[15px]">{o.customer.phone}</p>
              <p className="mt-1 text-[15px] text-ink/85">{o.customer.address}, {o.customer.area}, {o.customer.district}</p>
              {o.customer.email && <p className="text-[14px] text-muted">{o.customer.email}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${phone}`} className={btnGhost}>Call</a>
                <a href={`https://wa.me/88${phone}?text=${encodeURIComponent(`Assalamu alaikum ${o.customer.name}, 247BD theke bolchi. Apnar order ${o.id} confirm korte chacchi.`)}`} target="_blank" rel="noreferrer" className={btnGhost}>WhatsApp</a>
              </div>
            </section>

            <section className="bg-card p-5 ring-1 ring-line">
              <h2 className="font-semibold">Payment</h2>
              {o.payment?.trx ? (
                <>
                  <p className="mt-2 text-[15px]">
                    Advance {formatPrice(o.payment.advance ?? 0)} by <b>{payLabels[o.payment.method]}</b>
                  </p>
                  <p className="text-[15px]">TrxID / last digits: <b className="text-gold-2">{o.payment.trx}</b></p>
                  {shot && (
                    <a href={shot} target="_blank" rel="noreferrer" className="mt-3 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot} alt="Payment screenshot" className="max-h-64 border border-line" />
                    </a>
                  )}
                  <label className="mt-3 flex items-center gap-2 text-[15px]">
                    <input
                      type="checkbox"
                      checked={Boolean(o.payment.verified)}
                      onChange={(e) => save({ payment: { ...o.payment, verified: e.target.checked } }, e.target.checked ? "Advance payment marked as received" : "Advance payment unmarked")}
                      className="h-4 w-4 accent-[#c8ac56]"
                    />
                    I checked: advance payment received
                  </label>
                </>
              ) : (
                <p className="mt-2 text-[15px]">Cash on delivery</p>
              )}
            </section>

            <section className="bg-card p-5 ring-1 ring-line">
              <h2 className="font-semibold">Courier</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="Courier" className={field} aria-label="Courier" />
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking / consignment ID" className={field} aria-label="Tracking ID" />
              </div>
              <h2 className="mt-4 font-semibold">Private note</h2>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Only admins see this" className={`${field} mt-2`} />
              <button disabled={busy} onClick={() => save({ courier: courier || null, tracking: tracking || null, admin_note: note || null }, "Saved")} className={`${btn} mt-3`}>
                Save
              </button>
            </section>
          </div>
        </div>
      </div>
      <Invoice o={o} s={s} />
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}

function OrderList() {
  const { db } = useAdmin();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const status = (params.get("status") as OrderStatus | null) ?? "all";
  const [q, setQ] = useState(params.get("q") ?? "");
  const [rows, setRows] = useState<Order[] | null>(null);
  const [more, setMore] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [toast, setToast] = useState("");

  const load = useCallback(
    async (from = 0) => {
      let query = db.from("orders").select("*").order("created_at", { ascending: false }).range(from, from + PAGE - 1);
      if (status !== "all") query = query.eq("status", status);
      const term = (params.get("q") ?? "").trim();
      if (term) {
        const t = term.replace(/[%,()]/g, "");
        query = query.or(`id.ilike.%${t}%,customer->>phone.ilike.%${t}%,customer->>name.ilike.%${t}%`);
      }
      const { data } = await query;
      const list = (data as Order[]) ?? [];
      setRows((prev) => (from === 0 ? list : [...(prev ?? []), ...list]));
      setMore(list.length === PAGE);
      const { data: all } = await db.from("orders").select("status");
      const c: Record<string, number> = { all: all?.length ?? 0 };
      for (const r of all ?? []) c[r.status] = (c[r.status] ?? 0) + 1;
      setCounts(c);
    },
    [db, status, params]
  );

  useEffect(() => {
    if (!id) load(0);
  }, [load, id]);
  useNewOrders(db, (nid) => {
    setToast(`New order ${nid}`);
    if (!id) load(0);
  });

  if (id) return <OrderDetail id={id} onChanged={() => load(0)} />;

  function go(next: Record<string, string>) {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) v ? p.set(k, v) : p.delete(k);
    router.push(`/admin/orders/${p.toString() ? `?${p}` : ""}`);
  }

  return (
    <div>
      <PageTitle title="Orders">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go({ q });
          }}
          className="flex gap-2"
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order no, phone or name" className={`${field} w-60`} aria-label="Search orders" />
          <button className={btn}>Search</button>
        </form>
      </PageTitle>

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {filters.map((f) => (
          <button key={f} onClick={() => go({ status: f === "all" ? "" : f })} className={f === status ? btn : btnGhost}>
            {f === "all" ? "All" : statusLabels[f]} {counts[f] ? `(${counts[f]})` : ""}
          </button>
        ))}
      </div>

      {!rows ? (
        <p className="text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <Empty>No orders here yet.</Empty>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 pr-3">Order</th>
                  <th className="pr-3">Customer</th>
                  <th className="pr-3">Items</th>
                  <th className="pr-3">Total</th>
                  <th className="pr-3">Advance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((o) => (
                  <tr key={o.id} className="cursor-pointer hover:bg-card" onClick={() => go({ id: o.id })}>
                    <td className="py-3 pr-3">
                      <p className="font-semibold">{o.id}</p>
                      <p className="text-[12px] text-muted">{timeAgo(o.created_at)}</p>
                    </td>
                    <td className="pr-3">
                      <p>{o.customer.name}</p>
                      <p className="text-[12px] text-muted">{o.customer.phone} · {o.customer.district}</p>
                    </td>
                    <td className="max-w-[240px] truncate pr-3">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</td>
                    <td className="pr-3 font-semibold">{formatPrice(Number(o.total))}</td>
                    <td className="pr-3">
                      {o.payment?.trx ? (
                        <span className={o.payment.verified ? "text-uni" : "text-gold-2"}>
                          {payLabels[o.payment.method]} {o.payment.verified ? "✓" : "· check"}
                        </span>
                      ) : (
                        <span className="text-muted">COD</span>
                      )}
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {more && (
            <button onClick={() => load(rows.length)} className={`${btnGhost} mt-5`}>Load more</button>
          )}
        </>
      )}
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <OrderList />
    </Suspense>
  );
}
