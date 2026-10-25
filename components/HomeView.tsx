"use client";

import Link from "next/link";
import BestSellers, { Tab } from "@/components/BestSellers";
import ProductCard, { ProductPhoto } from "@/components/ProductCard";
import { CashIcon, ChatIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { useCatalog } from "@/lib/catalog";
import { bestDiscount, Product, productHref } from "@/lib/products";

const rank = (p: Product) => (p.badge ? 0 : 1);

export default function HomeView() {
  const { products, settings } = useCatalog();
  const get = (slug: string) => products.find((p) => p.slug === slug);
  const singles = products.filter((p) => p.category !== "combos");
  const combos = products.filter((p) => p.category === "combos");
  const inCat = (c: string) => products.filter((p) => p.category === c).sort((a, b) => rank(a) - rank(b));

  const tabs: Tab[] = [
    { slug: "styling", label: "Hair styling", href: "/hair-styling/", items: inCat("hair-styling") },
    { slug: "care", label: "Hair care", href: "/hair-care/", items: inCat("hair-care") },
    { slug: "curly", label: "Curly hair", href: "/curly-hair/", items: inCat("curly-hair") },
    { slug: "skin", label: "Skin care", href: "/skin-care/", items: inCat("skincare") },
  ];

  const hero = get("pride-complete-hair-styling-set") ?? combos[0] ?? singles[0];
  const doors = [
    { href: "/hair-styling/", label: "Hair styling", product: get("pride-hair-clay") },
    { href: "/curly-hair/", label: "Curly hair", product: get("pride-santal-curl-cream") },
    { href: "/skin-care/", label: "Skin care", product: get("pride-daily-facial-cleanser") },
  ].filter((d) => d.product);
  const bestSaving = Math.max(0, ...combos.map(bestDiscount));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "247BD",
      alternateName: "247BD by PahelaPride",
      url: "https://247bd.net/",
      logo: "https://247bd.net/icon.svg",
      description: "Men's grooming and hair styling products in Bangladesh from the PRIDE line by PahelaPride.",
      email: settings.email,
      telephone: settings.phone,
      address: { "@type": "PostalAddress", addressLocality: "Narayanganj", addressCountry: "BD" },
      areaServed: { "@type": "Country", name: "Bangladesh" },
      parentOrganization: { "@type": "Organization", name: "PahelaPride", url: "https://pahelapride.com/" },
      sameAs: [settings.facebook, settings.instagram, settings.youtube].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "247BD",
      url: "https://247bd.net/",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://247bd.net/products/?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <div>
      <JsonLd data={schema} />
      {/* Hero */}
      <section className="concrete relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 md:grid-cols-[1.05fr_1fr] md:gap-10 md:py-16">
          <div>
            <h1 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">Men&apos;s grooming &amp; hair styling products in Bangladesh</h1>
            <p className="mt-3 text-[clamp(2.4rem,6.4vw,5.2rem)] font-bold uppercase leading-[0.92] [font-stretch:118%] sm:mt-5" aria-hidden>
              Style it.
              <br />
              Own it.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/80 sm:mt-6 sm:text-[17px]">
              Hair clay, sea salt spray, curl care and skin care made for Bangladesh&apos;s heat and humidity. Cash on delivery all over the country.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
              <Link href="/products/" className="btn-gold px-4 py-3.5 text-center text-[13px] sm:px-7 sm:py-4 sm:text-[14px]">Shop now</Link>
              <Link href="/combos/" className="btn-ghost px-4 py-3.5 text-center text-[13px] sm:px-7 sm:py-4 sm:text-[14px]">Shop combos</Link>
            </div>
            <p className="mt-6 hidden text-sm text-muted sm:block">{settings.couponNotice}</p>
          </div>

          {hero && (
            <Link href={productHref(hero)} className="group relative block aspect-[4/3] overflow-hidden border border-line md:aspect-square">
              <ProductPhoto product={hero} src={hero.images?.[0]?.src} eager className="transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Most complete kit</p>
                  <p className="mt-1 text-lg font-semibold">{hero.name}</p>
                </div>
                <span className="text-xl text-gold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <BestSellers tabs={tabs} />

      {/* Category doors */}
      {doors.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:pt-20">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {doors.map((d) => (
              <Link key={d.href} href={d.href} className="group relative block aspect-[16/9] overflow-hidden border border-line md:aspect-[4/4.3]">
                <ProductPhoto product={d.product!} className="opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent p-5 pt-16">
                  <span className="font-display text-xl font-semibold sm:text-2xl">Shop {d.label.toLowerCase()}</span>
                  <span className="text-xl text-gold transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:pt-24">
        <div className="grid gap-8 border-y border-line py-10 sm:gap-10 sm:py-14 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <h2 className="text-[1.7rem] font-semibold leading-tight sm:text-[2.6rem]">Here&apos;s why shopping with 247BD is easy.</h2>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {[
              [TruckIcon, "Delivery all over Bangladesh", `৳${settings.deliveryInsideDhaka} inside Dhaka, ৳${settings.deliveryOutsideDhaka} outside Dhaka.`],
              [CashIcon, "Cash on delivery", settings.advancePayment ? "Pay only the delivery charge in advance. Pay the rest when your parcel arrives." : "Pay when your parcel arrives."],
              [ReturnIcon, "Free gift with combos", "Texture comb, hair diffuser or skin towels free with eligible products."],
              [ChatIcon, "Help on WhatsApp", "Not sure which product suits your hair? Ask us before you buy."],
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
      {combos.length > 0 && (
        <section className="concrete mt-14 border-y sm:mt-24 border-line">
          <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:py-20">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">Simple. Effective. PRIDE.</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(1.8rem,4.6vw,3.6rem)] font-semibold leading-[1.02]">
              Build your routine and get a free gift.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-ink/80">
              Combos cost less than buying each product alone{bestSaving ? `, up to ${bestSaving}% less` : ""}. Most come with a free texture comb, hair diffuser or skin towels.
            </p>
            <Link href="/combos/" className="btn-gold mt-8 inline-block px-8 py-4 text-[14px]">Shop combos</Link>
          </div>
        </section>
      )}

      {/* Combos */}
      {combos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:pt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[1.7rem] font-semibold sm:text-4xl">Featured combos</h2>
            <Link href="/combos/" className="text-[15px] underline underline-offset-4 hover:text-gold-2">Shop combos</Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
            {combos.slice(0, 8).map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
