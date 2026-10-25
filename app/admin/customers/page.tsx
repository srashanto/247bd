"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { field, useAdmin } from "@/components/admin/AdminShell";
import { Empty, PageTitle } from "@/components/admin/common";
import { Profile } from "@/lib/auth";
import { formatPrice } from "@/lib/products";

type Row = Profile & { created_at: string };
type Stat = { count: number; spent: number; last: string };

export default function CustomersPage() {
  const { db } = useAdmin();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [stats, setStats] = useState<Record<string, Stat>>({});
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const [p, o] = await Promise.all([
        db.from("profiles").select("id, name, phone, district, area, address, wishlist, created_at").order("created_at", { ascending: false }),
        db.from("orders").select("user_id, total, status, created_at").not("user_id", "is", null),
      ]);
      setRows((p.data as Row[]) ?? []);
      const s: Record<string, Stat> = {};
      for (const r of (o.data ?? []) as { user_id: string; total: number; status: string; created_at: string }[]) {
        const x = (s[r.user_id] ??= { count: 0, spent: 0, last: r.created_at });
        x.count++;
        if (r.status !== "cancelled" && r.status !== "returned") x.spent += Number(r.total);
        if (r.created_at > x.last) x.last = r.created_at;
      }
      setStats(s);
    })();
  }, [db]);

  const shown = (rows ?? []).filter((r) => !q || `${r.name ?? ""} ${r.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageTitle title="Customers">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className={`${field} w-60`} aria-label="Search customers" />
      </PageTitle>
      <p className="-mt-3 mb-5 text-[14px] text-muted">People who created an account. Guest orders are under Orders.</p>
      {!rows ? (
        <p className="text-muted">Loading…</p>
      ) : shown.length === 0 ? (
        <Empty>No customer accounts yet.</Empty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 pr-3">Customer</th>
                <th className="pr-3">Address</th>
                <th className="pr-3">Orders</th>
                <th className="pr-3">Spent</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((r) => {
                const st = stats[r.id];
                return (
                  <tr key={r.id}>
                    <td className="py-3 pr-3">
                      <p className="font-medium">{r.name || "No name yet"}</p>
                      <p className="text-[12px] text-muted">{r.phone || "No phone yet"}</p>
                    </td>
                    <td className="max-w-[240px] truncate pr-3 text-muted">{[r.address, r.area, r.district].filter(Boolean).join(", ") || "—"}</td>
                    <td className="pr-3">
                      {st ? (
                        <Link href={`/admin/orders/?q=${encodeURIComponent(r.phone ?? "")}`} className="underline underline-offset-4">{st.count}</Link>
                      ) : (
                        0
                      )}
                    </td>
                    <td className="pr-3">{st ? formatPrice(st.spent) : "—"}</td>
                    <td className="text-muted">{new Date(r.created_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
