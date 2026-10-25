"use client";

import { useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { OrderStatus, statusLabels } from "@/lib/orders";

export const statusTone: Record<OrderStatus, string> = {
  pending: "bg-gold/20 text-gold-2",
  confirmed: "bg-him/20 text-him",
  shipped: "bg-[#7c6cd6]/25 text-[#b6abf5]",
  delivered: "bg-uni/20 text-uni",
  cancelled: "bg-alert/20 text-alert",
  returned: "bg-alert/20 text-alert",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block px-2 py-0.5 text-[12px] font-semibold ${statusTone[status]}`}>{statusLabels[status]}</span>;
}

/** Calls onNew whenever a new order arrives (needs Realtime enabled on the orders table). */
export function useNewOrders(db: SupabaseClient, onNew: (id: string) => void) {
  useEffect(() => {
    const ch = db
      .channel("orders-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (p) => {
        onNew((p.new as { id: string }).id);
        try {
          const ctx = new AudioContext();
          const o = ctx.createOscillator();
          o.frequency.value = 880;
          o.connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.18);
        } catch {}
      })
      .subscribe();
    return () => {
      db.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="bg-card p-8 text-center text-muted ring-1 ring-line">{children}</div>;
}

export function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div role="status" className="no-print fixed bottom-5 right-5 z-50 max-w-sm border border-gold/50 bg-[#141209] px-4 py-3 text-[15px] shadow-lg">
      {msg}
    </div>
  );
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
