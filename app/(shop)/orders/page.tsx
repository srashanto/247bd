import { Suspense } from "react";
import OrdersView from "./OrdersView";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-10 text-slate-500">Loading orders...</div>}>
      <OrdersView />
    </Suspense>
  );
}
