"use client";

import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard, { ProductPhoto } from "@/components/ProductCard";
import ProductRail from "@/components/ProductRail";
import { CashIcon, CheckIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { useCatalog } from "@/lib/catalog";
import { Product, productHref } from "@/lib/products";

const UPLOADS = "https://pahelapride.com/wp-content/uploads";

const tiles = [
  { href: "/hair-care/", category: "hair-care", label: "Hair Care", line: "Healthy, stylish hair every day", img: `${UPLOADS}/2026/05/Brown-and-White-Hair-Makeup-Appointment-Instagram-Story-1-1-1-pp800.webp` },
  { href: "/skin-care/", category: "skincare", label: "Skin Care", line: "Clean, glowing skin routine", img: `${UPLOADS}/2026/05/Black-and-White-Simple-Skin-Care-Instagram-Post-1-1-pp800.webp` },
  { href: "/perfume/", category: "perfume", label: "Perfume", line: "Long-lasting signature scents", img: `${UPLOADS}/2026/05/Neutral-Simple-Perfume-Ad-Promotion-Instagram-Post-1-1-1-pp800.webp` },
];

const offerImages = [
  `${UPLOADS}/2026/10/a_Create_a_1_1_premium-pp800.webp`,
  `${UPLOADS}/2026/10/a_Create_a_1_1_premium-1-pp800.webp`,
  `${UPLOADS}/2026/10/1793096493825-01a17ce0-ebd4-7a73-b131-6f2c21459487-pp800.webp`,
];

const reviews = [
  { text: "Very Good product, High quality, full day hold .", by: "Millat", slug: "pride-hair-clay" },
  { text: "Best Pre Styler i ever use, Keep my hair hydrated and stylish , Recommended ✌️", by: "Sakib", slug: "pride-santal-sandalwood-sea-salt-spray" },
  { text: "Great Shine and Perfect Hold for Office time", by: "rd", slug: "pride-santal-pomade" },
];

const compare = ["100% imported products", "Cash on Delivery all over Bangladesh", "FREE gift with combos", "Reviews from real buyers", "Quick help on WhatsApp"];

export default function HomeView() {
  const { products, settings } = useCatalog();
  const get = (slug: string) => products.find((p) => p.slug === slug);
  const singles = products.filter((p) => p.category !== "combos");
  const best = [...singles].sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge))).slice(0, 8);
  const fresh = [...singles].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 8);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "247BD",
      alternateName: "247BD by PahelaPride",
      url: "https://247bd.net/",
      logo: "https://247bd.net/icon.svg",
      description: "Imported hair styling, hair care, skin care and perfume in Bangladesh, by PahelaPride.",
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
      <HeroSlider />

      <ul className="pp-usp">
        <li><CheckIcon />100% imported products</li>
        <li><CashIcon />Cash on Delivery</li>
        <li><TruckIcon />Delivery all over Bangladesh</li>
        <li><ReturnIcon />FREE gift with combos</li>
      </ul>

      <section className="pp-section pp-container">
        <div className="pp-head">
          <h2 className="pp-h2">Best Sellers</h2>
          <Link href="/products/" className="pp-more">Shop all →</Link>
        </div>
        <ProductRail>{best.map((p) => <ProductCard key={p.slug} product={p} />)}</ProductRail>
      </section>

      <section className="pp-section pp-container">
        <div className="pp-tiles">
          {tiles.map((t) => {
            const count = products.filter((p) => p.category === t.category).length;
            return (
              <Link key={t.href} href={t.href} className="pp-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt="" loading="lazy" />
                <span className="pp-tile__label">
                  {count > 0 && <span className="pp-tile__count">{count} products</span>}
                  <b>{t.label}</b>
                  <span className="text-[14px] font-medium">{t.line}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pp-section pp-container">
        <p className="pp-eyebrow">Just landed</p>
        <div className="pp-head">
          <h2 className="pp-h2">New Arrivals</h2>
          <Link href="/products/" className="pp-more">See all new →</Link>
        </div>
        <ProductRail>{fresh.map((p) => <ProductCard key={p.slug} product={p} />)}</ProductRail>
      </section>

      <section className="pp-why">
        <div className="pp-container pp-why__grid">
          <div>
            <p className="pp-eyebrow">Why 247BD</p>
            <h2 className="pp-h2">Why customers choose us</h2>
            <p className="mt-4 text-[17px] text-muted">Imported products, better prices and the best customer service.</p>
            <div className="pp-stats">
              <div><b>2500+</b>Orders delivered</div>
              <div><b>95%</b>Positive reviews</div>
            </div>
            <Link href="/products/" className="pp-pill pp-pill--red">Shop all</Link>
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
        <div className="pp-offer">
          <div className="pp-offer__copy">
            <div>
              <p className="pp-eyebrow">Limited offer</p>
              <h2 className="pp-h2">Combo কিনুন, FREE gift নিন</h2>
              <ul>
                <li><span><CheckIcon /></span>Curly hair combo → FREE hair diffuser</li>
                <li><span><CheckIcon /></span>Any full-size styling product → FREE texture comb</li>
                <li><span><CheckIcon /></span>Skincare combo → FREE antibacterial skin towel</li>
              </ul>
            </div>
            <Link href="/combos/" className="pp-pill pp-pill--punk">Shop combos</Link>
          </div>
          <div className="pp-offer__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {offerImages.map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
          </div>
        </div>
      </section>

      <section className="pp-section pp-container">
        <div className="pp-head">
          <h2 className="pp-h2">Real reviews from real customers</h2>
        </div>
        <div className="pp-rail__track">
          {reviews.map((r) => {
            const product = get(r.slug);
            return (
              <figure key={r.by} className="pp-review">
                <span className="pp-review__stars" aria-label="5 out of 5 stars">★★★★★</span>
                <p>{r.text}</p>
                <figcaption className="font-bold">{r.by}</figcaption>
                {product && (
                  <Link href={productHref(product)} className="pp-review__product">
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"><ProductPhoto product={product} /></span>
                    {product.name}
                  </Link>
                )}
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
