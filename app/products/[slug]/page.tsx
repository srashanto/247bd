import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCard, { ProductImage } from "@/components/ProductCard";
import AddToCart from "./AddToCart";
import { formatPrice, getCategory, getProduct, products } from "@/lib/products";
import { STORE } from "@/lib/store";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} | 247BD` : "Product not found | 247BD", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link href={`/products/?category=${product.category}`} className="hover:text-brand-600">{category?.name}</Link> /{" "}
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <ProductImage product={product} size="lg" />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 text-sm text-amber-500">
            ★ {product.rating.toFixed(1)} <span className="text-slate-400">· {product.stock} in stock</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand-700">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="mt-5 text-slate-600 leading-relaxed">{product.description}</p>

          <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
            {product.features.map((f) => (
              <li key={f} className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">✓ {f}</li>
            ))}
          </ul>

          <AddToCart slug={product.slug} stock={product.stock} />

          <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-900 space-y-1">
            <div>🚚 Inside Dhaka: ৳{STORE.deliveryInsideDhaka} · Outside Dhaka: ৳{STORE.deliveryOutsideDhaka}</div>
            <div>💵 Cash on delivery available</div>
            <div>↩️ 7 day easy return</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">You may also like</h2>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
