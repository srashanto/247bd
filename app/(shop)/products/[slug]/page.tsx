import type { Metadata } from "next";
import ProductView from "@/components/ProductView";
import { staticProducts } from "@/lib/products";

export function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = staticProducts.find((x) => x.slug === slug);
  return {
    title: p ? `${p.name} | 247BD` : "Product | 247BD",
    description: p?.description?.slice(0, 160),
    openGraph: p?.images?.[0] ? { images: [p.images[0].src] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initial = staticProducts.find((x) => x.slug === slug);
  return <ProductView slug={slug} initial={initial} />;
}
