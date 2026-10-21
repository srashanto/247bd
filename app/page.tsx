import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import { STORE } from "@/lib/store";

export default function Home() {
  const deals = products.filter((p) => p.oldPrice).slice(0, 8);
  const popular = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Open 24 hours, 7 days a week
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black leading-tight">
              Everything you need,<br />delivered across Bangladesh
            </h1>
            <p className="mt-4 max-w-md text-brand-50/90">
              {STORE.tagline}. Pay with cash on delivery, bKash or Nagad. Free delivery on orders over ৳
              {STORE.freeDeliveryOver.toLocaleString("en-IN")}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products/" className="rounded-xl bg-white px-6 py-3 font-bold text-brand-700 hover:bg-brand-50">
                Shop now
              </Link>
              <Link href="#deals" className="rounded-xl border border-white/40 px-6 py-3 font-bold hover:bg-white/10">
                Today&apos;s deals
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-4 text-6xl">
            {["🎧", "👘", "🍯", "⌚", "🏏", "🧴", "🍚", "👟", "🥻"].map((e, i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-2xl bg-white/15 backdrop-blur">
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 text-sm">
          {[
            ["🚚", "Fast delivery", "1-3 days inside Dhaka"],
            ["💵", "Cash on delivery", "Pay when you receive"],
            ["↩️", "Easy return", "7 day return policy"],
            ["🕐", "24/7 support", STORE.phone],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-xs text-slate-500">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-12">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products/?category=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 hover:ring-brand-500"
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="text-xs sm:text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="deals" className="mx-auto max-w-7xl px-4 mt-12 scroll-mt-32">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">🔥 Hot deals</h2>
          <Link href="/products/?sort=discount" className="text-sm font-semibold text-brand-600">View all →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">⭐ Most popular</h2>
          <Link href="/products/?sort=rating" className="text-sm font-semibold text-brand-600">View all →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {popular.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
