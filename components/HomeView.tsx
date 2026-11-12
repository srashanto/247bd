"use client";

import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import ProductRail from "@/components/ProductRail";
import { Art, shapeFor } from "@/components/Packshot";
import { CashIcon, CheckIcon, ChatIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { useCatalog } from "@/lib/catalog";
import { categories } from "@/lib/products";
import { categoryHref, landings } from "@/lib/seo";

const homeFaq = [
  { q: "Where can I buy football boots in Bangladesh?", a: "247BD sells football boots, footballs and other football gear online and delivers anywhere in Bangladesh. Pick your colour and size on the product page and pay cash on delivery." },
  { q: "বাংলাদেশে ফুটবল বুট কোথায় কিনতে পাবো?", a: "২৪৭বিডি থেকে অনলাইনে ফুটবল বুট, ফুটবল ও অন্যান্য ফুটবল সরঞ্জাম কিনতে পারবেন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।" },
  { q: "How much is delivery?", a: "Delivery is ৳80 inside Dhaka and ৳120 outside Dhaka. Orders usually arrive in 1–2 days inside Dhaka and 2–4 days outside." },
  { q: "Can I pay cash on delivery?", a: "Yes. Pay the delivery charge in advance by bKash, Nagad or Rocket to confirm the order, then pay the rest in cash when the parcel arrives." },
  { q: "How do I pick the right size?", a: "Measure your foot length in centimetres and compare it with the size on the product page, or message us on WhatsApp with your foot length. If you are between two sizes, go one size up." },
];

const compare = [
  "Cash on Delivery all over Bangladesh",
  "Size help before you order",
  "Track your order with its order number",
  "Quick help on WhatsApp",
];

export default function HomeView() {
  const { products, settings } = useCatalog();
  const withProducts = categories
    .map((c) => ({ ...c, items: products.filter((p) => p.category === c.slug) }))
    .filter((c) => c.items.length > 0);
  const fresh = [...products].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)).slice(0, 8);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "247BD",
      url: "https://247bd.net/",
      logo: "https://247bd.net/icon.png",
      description: "Football boots, balls and kit in Bangladesh. Cash on delivery all over Bangladesh.",
      priceRange: "৳৳",
      currenciesAccepted: "BDT",
      paymentAccepted: "Cash on delivery, bKash, Nagad, Rocket",
      contactPoint: { "@type": "ContactPoint", telephone: settings.phone, contactType: "customer service", areaServed: "BD", availableLanguage: ["en", "bn"] },
      email: settings.email,
      telephone: settings.phone,
      address: { "@type": "PostalAddress", addressLocality: "Narayanganj", addressCountry: "BD" },
      areaServed: { "@type": "Country", name: "Bangladesh" },
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homeFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div>
      <JsonLd data={schema} />
      <h1 className="sr-only">247BD: football boots, balls and kit in Bangladesh</h1>
      <HeroSlider />

      <ul className="pp-usp">
        <li><CheckIcon />Boots, balls &amp; kit</li>
        <li><CashIcon />Cash on Delivery</li>
        <li><TruckIcon />Delivery all over Bangladesh</li>
        <li><ReturnIcon />Easy size help on WhatsApp</li>
      </ul>

      <section className="pp-section pp-container">
        <div className="pp-head">
          <h2 className="pp-h2">New in the shop</h2>
          <Link href="/products/" className="pp-more">Shop all →</Link>
        </div>
        <ProductRail>{fresh.map((p) => <ProductCard key={p.slug} product={p} eager />)}</ProductRail>
      </section>

      {withProducts.length > 1 && (
        <section className="pp-section pp-container">
          <div className="pp-head"><h2 className="pp-h2">Shop by category</h2></div>
          <div className="pp-tiles">
            {withProducts.map((c) => {
              const lead = c.items[0];
              const photo = lead.images?.[lead.colors?.[0]?.images?.[0] ?? 0]?.thumb;
              return (
                <Link key={c.slug} href={categoryHref(c.slug)} className="pp-tile">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="" loading="lazy" />
                  ) : (
                    <svg viewBox="0 0 200 160" className="pp-tile__art" aria-hidden><Art shape={shapeFor(lead)} color={lead.colors?.[0]?.hex ?? "#c6ff00"} /></svg>
                  )}
                  <span className="pp-tile__label">
                    <span className="pp-tile__count">{c.items.length} {c.items.length === 1 ? "product" : "products"}</span>
                    <b>{c.name}</b>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="pp-why">
        <div className="pp-container pp-why__grid">
          <div>
            <p className="pp-eyebrow">Why 247BD</p>
            <h2 className="pp-h2" style={{ color: "var(--color-paper)" }}>Football only</h2>
            <p className="mt-4 max-w-md text-[17px]" style={{ color: "#c8d6cd" }}>
              One shop, one sport. Choose your gear, pay when it arrives, and get help on WhatsApp if you are unsure about a size.
            </p>
            <Link href="/products/" className="pp-pill pp-pill--punk mt-6">Shop all</Link>
          </div>
          <div className="pp-compare">
            <div className="pp-compare__head"><span /><span className="pp-compare__us">247BD</span><span>Others</span></div>
            {compare.map((c) => (
              <div key={c}>
                <span>{c}</span>
                <span><span className="pp-yes"><CheckIcon /></span></span>
                <span className="text-[12px] text-muted">Not always</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section pp-container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-prose space-y-4 text-[16px] leading-relaxed text-ink/85">
            <h2 className="pp-h2">Football store in Bangladesh</h2>
            <p>247BD is an online football store in Bangladesh. Buy football boots, footballs, jerseys, socks, shin guards and goalkeeper gloves, check the price in taka, pick your colour and size, and pay cash on delivery anywhere in Bangladesh.</p>
            <p lang="bn">২৪৭বিডি বাংলাদেশের অনলাইন ফুটবল স্টোর। এখান থেকে ফুটবল বুট, ফুটবল, জার্সি, সক্স, শিন গার্ড ও গোলকিপার গ্লাভস কিনুন। রঙ ও সাইজ বেছে নিন এবং সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে পণ্য পান।</p>
            <p className="flex flex-wrap gap-x-4 gap-y-2 text-[15px] font-semibold">
              {landings.filter((l) => !l.category || products.some((p) => p.category === l.category)).map((l) => (
                <Link key={l.slug} href={`/${l.slug}/`} className="underline decoration-punk decoration-2 underline-offset-4">{l.h1}</Link>
              ))}
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line self-start">
            {homeFaq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-semibold">
                  {f.q}
                  <span className="transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section pp-container">
        <div className="pp-help">
          <div>
            <h2 className="pp-h2">Not sure about your size?</h2>
            <p className="mt-3 max-w-xl text-[17px] font-medium">Send us your foot length on WhatsApp and we will tell you which size to pick.</p>
          </div>
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="pp-pill pp-pill--red"><ChatIcon className="mr-2 h-5 w-5" />Message us</a>
        </div>
      </section>
    </div>
  );
}
