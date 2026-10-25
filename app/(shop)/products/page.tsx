import { Suspense } from "react";
import type { Metadata } from "next";
import ProductList from "./ProductList";

export const metadata: Metadata = { title: "Shop PRIDE grooming | 247BD" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted">Loading products…</div>}>
      <ProductList />
    </Suspense>
  );
}
