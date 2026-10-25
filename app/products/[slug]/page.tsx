import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCard, { genderText, ProductStage, WishButton } from "@/components/ProductCard";
import { CashIcon, CheckIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import AddToCart from "./AddToCart";
import {
  discountPercent, formatPrice, genders, getCategory, getConcern, getProduct, includedProducts, matchesGender, products,
} from "@/lib/products";
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
  const inside = includedProducts(product);
  const off = discountPercent(product);
  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category && matchesGender(p, product.gender === "unisex" ? "" : product.gender))
    .concat(products.filter((p) => p.slug !== product.slug && p.concerns.some((c) => product.concerns.includes(c))))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-[15px] text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/products/?category=${product.category}`} className="hover:text-ink">{category?.name}</Link>
      </nav>

      <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="relative md:sticky md:top-32 md:self-start">
          <ProductStage product={product} size="lg" />
          <WishButton slug={product.slug} className="absolute right-4 top-4 h-11 w-11" />
        </div>

        <div>
          <span className={`text-[15px] font-semibold ${genderText[product.gender]}`}>{genders[product.gender].name}</span>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight sm:text-[2.6rem]">{product.name}</h1>
          {product.size && <p className="mt-1 text-muted">{product.size}</p>}

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.oldPrice)}</span>
                <span className="bg-gold text-paper px-2.5 py-0.5 text-sm font-bold">
                  You save {formatPrice(product.oldPrice - product.price)} ({off}%)
                </span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-prose text-[17px] leading-relaxed">{product.description}</p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[15px]">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-uni" /> {h}
              </li>
            ))}
          </ul>

          {product.concerns.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Good for</span>
              {product.concerns.map((c) => (
                <Link key={c} href={`/products/?concern=${c}`} className="border border-line bg-card px-3 py-1 hover:border-ink">
                  {getConcern(c)?.name}
                </Link>
              ))}
            </div>
          )}

          <AddToCart slug={product.slug} stock={product.stock} />

          <ul className="mt-6 space-y-2.5 bg-card p-5 text-[15px] ring-1 ring-line">
            <li className="flex gap-3"><TruckIcon className="h-5 w-5 shrink-0 text-gold" /> Delivery ৳{STORE.deliveryInsideDhaka} inside Dhaka, ৳{STORE.deliveryOutsideDhaka} outside. Free over ৳{STORE.freeDeliveryOver.toLocaleString("en-IN")}.</li>
            <li className="flex gap-3"><CashIcon className="h-5 w-5 shrink-0 text-gold" /> Cash on delivery, bKash or Nagad</li>
            <li className="flex gap-3"><ReturnIcon className="h-5 w-5 shrink-0 text-gold" /> Return unopened products within 7 days</li>
          </ul>

          <div className="mt-8 divide-y divide-line border-y border-line">
            {inside.length > 0 && (
              <details open className="group py-4">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold">What&apos;s in the box</summary>
                <ul className="mt-3 space-y-2">
                  {inside.map((p) => (
                    <li key={p.slug} className="flex justify-between gap-4 text-[15px]">
                      <Link href={`/products/${p.slug}/`} className="underline underline-offset-4">{p.name} {p.size && `(${p.size})`}</Link>
                      <span className="text-muted">{formatPrice(p.price)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <details open={!inside.length} className="py-4">
              <summary className="cursor-pointer list-none font-display text-lg font-semibold">How to use</summary>
              <p className="mt-2 max-w-prose leading-relaxed text-ink/85">{product.howToUse}</p>
            </details>
            {product.keyIngredients && (
              <details className="py-4">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold">Key ingredients</summary>
                <p className="mt-2 max-w-prose leading-relaxed text-ink/85">{product.keyIngredients}</p>
              </details>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold sm:text-3xl">Goes well with</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
