import Link from "next/link";
import BestSellers, { Tab } from "@/components/BestSellers";
import ProductCard from "@/components/ProductCard";
import Packshot from "@/components/Packshot";
import { CashIcon, ChatIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import { concerns, discountPercent, getProduct, Product, products } from "@/lib/products";
import { STORE } from "@/lib/store";

const pick = (slugs: string[]) => slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

const heroLineup = pick([
  "sea-salt-texture-spray",
  "invisible-sunscreen-spf50",
  "rice-water-repair-shampoo",
]);

const rank = (p: Product) => (p.badge === "Bestseller" ? 0 : p.badge === "New" ? 1 : 2);
const singles = products.filter((p) => !p.includes);
const inCats = (...cats: string[]) => singles.filter((p) => cats.includes(p.category)).sort((a, b) => rank(a) - rank(b));

/** Alternate him / her / unisex so the first row shows the whole range. */
function interleave(list: Product[]) {
  const groups = ["him", "her", "unisex"].map((g) => list.filter((p) => p.gender === g));
  const out: Product[] = [];
  while (groups.some((g) => g.length)) for (const g of groups) if (g.length) out.push(g.shift()!);
  return out;
}

const tabs: Tab[] = [
  { slug: "all", label: "All", href: "/products/", items: interleave(singles.filter((p) => p.badge === "Bestseller")) },
  { slug: "hair", label: "Hair", href: "/products/?category=hair-care", items: inCats("hair-styling", "hair-care") },
  { slug: "skin", label: "Skin", href: "/products/?category=skincare", items: inCats("skincare") },
  { slug: "beard", label: "Beard & shave", href: "/products/?category=beard-shave", items: inCats("beard-shave") },
  { slug: "body", label: "Body & fragrance", href: "/products/?category=body-care", items: inCats("body-care", "fragrance") },
];

const doors = [
  { href: "/products/?for=him", label: "Shop men", items: pick(["beard-growth-oil", "matte-clay-pomade", "oud-intense-edp"]) },
  { href: "/products/?for=her", label: "Shop women", items: pick(["argan-hair-serum", "keratin-smooth-hair-mask", "peony-edp"]) },
  { href: "/products/?category=skincare", label: "Shop skin", items: pick(["charcoal-oil-control-face-wash", "invisible-sunscreen-spf50", "hyaluronic-gel-moisturizer"]) },
];

export default function Home() {
  const combos = products.filter((p) => p.includes);
  const bestSaving = Math.max(...combos.map(discountPercent));

  return (
    <div>
      {/* Hero */}
      <section className="concrete relative overflow-hidden border-b border-line">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">Grooming for him &amp; her</p>
            <h1 className="mt-5 text-[clamp(2.7rem,6.4vw,5.2rem)] font-bold uppercase leading-[0.92] [font-stretch:118%]">
              Look sharp.
              <br />
              Every day.
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink/80">
              Hair, skin, beard and fragrance essentials for men and women. Order in a minute and pay when it reaches your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products/" className="btn-gold px-7 py-4 text-[14px]">Shop now</Link>
              <Link href="/products/?category=combos" className="btn-ghost px-7 py-4 text-[14px]">Shop combos</Link>
            </div>
            <p className="mt-6 text-sm text-muted">Cash on delivery all over Bangladesh</p>
          </div>

          <div className="relative mx-auto aspect-[560/330] w-full max-w-[560px]" aria-hidden>
            <div className="absolute inset-x-[2%] bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-[1px] flex h-full items-end justify-center gap-[3%]">
              {heroLineup.map((p, i) => (
                <Packshot
                  key={p.slug}
                  product={p}
                  className="shelf-item"
                  style={{ animationDelay: `${120 + i * 110}ms`, height: `${[64, 90, 74][i]}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <BestSellers tabs={tabs} />

      {/* Category doors */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="grid gap-4 md:grid-cols-3">
          {doors.map((d) => (
            <Link key={d.href} href={d.href} className="studio group relative block aspect-[4/4.2] overflow-hidden border border-line">
              <div className="absolute inset-x-0 bottom-[25%] top-[14%] flex items-end justify-center gap-[3%]">
                {d.items.map((p, i) => (
                  <Packshot key={p.slug} product={p} style={{ height: `${[64, 82, 58][i]}%` }} />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-5 pt-12">
                <span className="font-display text-2xl font-semibold">{d.label}</span>
                <span className="text-xl text-gold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why 247BD */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <div className="grid gap-10 border-y border-line py-14 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <h2 className="text-3xl font-semibold leading-tight sm:text-[2.6rem]">
            Here&apos;s why shopping with 247BD is easy.
          </h2>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {[
              [TruckIcon, "Delivery in 1–4 days", `৳${STORE.deliveryInsideDhaka} inside Dhaka, ৳${STORE.deliveryOutsideDhaka} outside. Free over ৳${STORE.freeDeliveryOver.toLocaleString("en-IN")}.`],
              [CashIcon, "Pay when it arrives", "Cash on delivery anywhere in Bangladesh, or bKash and Nagad."],
              [ReturnIcon, "7-day returns", "Changed your mind? Return unopened products within 7 days."],
              [ChatIcon, "Real help on WhatsApp", "Not sure what suits your hair or skin? Ask us before you buy."],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof TruckIcon;
              return (
                <li key={title as string}>
                  <I className="h-6 w-6 text-gold" />
                  <h3 className="mt-3 text-lg font-semibold">{title as string}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{body as string}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Statement */}
      <section className="concrete mt-24 border-y border-line">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">Simple. Effective. 247BD.</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.02]">
            Build your routine and pay less for it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] text-ink/80">
            Every combo costs less than buying its products one by one. Save up to {bestSaving}% on a complete routine.
          </p>
          <Link href="/products/?category=combos" className="btn-gold mt-8 inline-block px-8 py-4 text-[14px]">Shop combos</Link>
        </div>
      </section>

      {/* Combos */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold sm:text-4xl">Featured combos</h2>
          <Link href="/products/?category=combos" className="text-[15px] underline underline-offset-4 hover:text-gold-2">Shop combos</Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {combos.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Concerns */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <h2 className="text-3xl font-semibold sm:text-4xl">What do you want to fix?</h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {concerns.map((c) => (
            <Link
              key={c.slug}
              href={`/products/?concern=${c.slug}`}
              className="border border-line bg-card px-4 py-2.5 text-[15px] hover:border-gold hover:text-gold-2"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
