import { Suspense } from "react";
import type { Metadata } from "next";
import ProductList from "./ProductList";

export const metadata: Metadata = {
  title: "Shop All Football Gear",
  description: "All football gear from 247BD: boots, footballs, jerseys, socks, shin guards and gloves. Pick your colour and size. Cash on delivery all over Bangladesh.",
  alternates: { canonical: "/products/" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted">Loading products…</div>}>
      <ProductList />
    </Suspense>
  );
}
