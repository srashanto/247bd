"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProductView from "@/components/ProductView";

/** Product page for products added in the admin panel after the last site build. */
function Item() {
  const slug = useSearchParams().get("s") || "";
  return <ProductView slug={slug} />;
}

export default function ItemPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 text-muted">Loading product…</div>}>
      <Item />
    </Suspense>
  );
}
