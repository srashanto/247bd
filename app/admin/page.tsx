"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminShell";
import { Empty, PageTitle, StatusBadge, timeAgo, Toast, useNewOrders } from "@/components/admin/common";
import { rowToProduct, ProductRow } from "@/lib/catalog";
import { Order } from "@/lib/orders";
import { formatPrice, Product, totalStock } from "@/lib/products";

type Lite = Pick<Order, "id" | "created_at" | "status" | "total" | "customer" | "items">;

export default function Dashboard() {
  const { db } = useAdmin();
  const [orders, setOrders] = useState<Lite[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const [o, p] = await Promise.all([
      db.from("orders").select("id, created_at, status, total, customer, items").gte("created_at", since).order("created_at", { ascending: false }),
      db.from("products").select("id, slug, data, published, sort"),
    ]);
    setOrders((o.data as Lite[]) ?? []);
    const list = ((p.data as ProductRow[]) ?? []).map(rowToProduct);
    setProducts(list);
    setProductCount(list.length);
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);
  useNewOrders(db, (id) => {
    setToast(`New order ${id}`);
    load();
  });

  if (!orders) return <p className="text-muted">Loading…</p>;

  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const today = new Date().toDateString();
  const todays = live.filter((o) => new Date(o.created_at).toDateString() === today);
  const week = live.filter((o) => Date.now() - new Date(o.created_at).getTime() < 7 * 86400000);
  const pending = orders.filter((o) => o.status === "pending");
  const lowStock = products
    .filter((p) => p.published !== false)
    .flatMap((p) =>
      p.variations?.length
        ? p.variations.filter((v) => v.stock <= 5).map((v) => ({ p, label: `${p.name} (${v.label})`, stock: v.stock }))
        : totalStock(p) <= 5
          ? [{ p, label: p.name, stock: p.stock }]
          : []
    )
    .slice(0, 10);

  // Sales per day for the last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    return { label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), total: live.filter((o) => new Date(o.created_at).toDateString() === key).reduce((n, o) => n + Number(o.total), 0) };
  });
  const peak = Math.max(1, ...days.map((d) => d.total));

  const stats = [
    ["Today's orders", String(todays.length), formatPrice(todays.reduce((n, o) => n + Number(o.total), 0))],
    ["Waiting to confirm", String(pending.length), "pending orders"],
    ["Last 7 days", formatPrice(week.reduce((n, o) => n + Number(o.total), 0)), `${week.length} orders`],
    ["Last 30 days", formatPrice(live.reduce((n, o) => n + Number(o.total), 0)), `${live.length} orders`],
  ];

  return (
    <div>
      <PageTitle title="Dashboard" />

      {productCount === 0 && (
        <div className="mb-6 border border-gold/50 bg-gold-soft p-4 text-[15px]">
          Your product list is empty, so customers can&apos;t order yet.{" "}
          <Link href="/admin/products/" className="font-semibold underline underline-offset-4">Import the PRIDE catalog</Link> to start.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, big, small]) => (
          <div key={label} className="bg-card p-4 ring-1 ring-line">
            <p className="text-[13px] text-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{big}</p>
            <p className="text-[13px] text-muted">{small}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 bg-card p-5 ring-1 ring-line">
        <h2 className="text-lg font-semibold">Sales, last 14 days</h2>
        <div className="mt-4 flex h-40 items-end gap-1.5">
          {days.map((d) => (
            <div key={d.label} className="group flex flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${formatPrice(d.total)}`}>
              <div className="w-full bg-gold/80 group-hover:bg-gold-2" style={{ height: `${Math.max(2, (d.total / peak) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-muted">
          <span>{days[0].label}</span>
          <span>{days[13].label}</span>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Latest orders</h2>
            <Link href="/admin/orders/" className="text-[14px] underline underline-offset-4">All orders</Link>
          </div>
          {orders.length === 0 ? (
            <div className="mt-3"><Empty>No orders in the last 30 days.</Empty></div>
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/?id=${o.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-card">
                    <div className="min-w-0">
                      <p className="font-medium">{o.id} <span className="text-muted">· {o.customer.name}</span></p>
                      <p className="truncate text-[13px] text-muted">{o.items.map((i) => i.name).join(", ")}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold">{formatPrice(Number(o.total))}</p>
                      <p className="text-[12px] text-muted">{timeAgo(o.created_at)}</p>
                    </div>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Low stock</h2>
          {lowStock.length === 0 ? (
            <div className="mt-3"><Empty>Every product has more than 5 in stock.</Empty></div>
          ) : (
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {lowStock.map((l) => (
                <li key={l.label}>
                  <Link href={`/admin/products/?edit=${l.p.slug}`} className="flex justify-between gap-3 py-2.5 text-[14px] hover:bg-card">
                    <span className="truncate">{l.label}</span>
                    <span className={l.stock <= 0 ? "font-semibold text-alert" : "text-gold-2"}>{l.stock <= 0 ? "Sold out" : `${l.stock} left`}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
