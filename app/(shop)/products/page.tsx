import { Suspense } from "react";
import type { Metadata } from "next";
import ProductList from "./ProductList";

export const metadata: Metadata = {
  title: "Shop All Men's Grooming Products",
  description: "All PRIDE grooming products: hair clay, pomade, sea salt spray, shampoo, conditioner, curl cream and men's skin care. Cash on delivery all over Bangladesh.",
  alternates: { canonical: "/products/" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted">Loading products…</div>}>
      <ProductList />
    </Suspense>
  );
}
