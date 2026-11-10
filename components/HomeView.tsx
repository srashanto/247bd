"use client";

import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import ProductRail from "@/components/ProductRail";
import { Art, shapeFor } from "@/components/Packshot";
import { CashIcon, CheckIcon, ChatIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { useCatalog } from "@/lib/catalog";
import { categories, productHref } from "@/lib/products";
import { categoryHref } from "@/lib/seo";

const compare = [
  "Cash on Delivery all over Bangladesh",
  "Colour and size picked before you order",
  "Track your order with its order number",
  "Quick help on WhatsApp",
];

export default function HomeView() {
  const { products, settings } = useCatalog();
  const featured = products.find((p) => p.colors && p.colors.length > 1 && p.images?.length);
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
      description: "Football boots, balls and kit in Bangladesh.",
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
  ];

  return (
    <div>
      <JsonLd data={schema} />
      <HeroSlider />

      <ul className="pp-usp">
        <li><CheckIcon />Boots, balls &amp; kit</li>
        <li><CashIcon />Cash on Delivery</li>
        <li><TruckIcon />Delivery all over Bangladesh</li>
        <li><ReturnIcon />Colour &amp; size of your choice</li>
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

      {featured && featured.colors && (
        <section className="pp-section pp-container">
          <p className="pp-eyebrow">{featured.brand ? `${featured.brand} ${featured.name.replace(new RegExp(`^${featured.brand}\\s*`, "i"), "")}` : featured.name}</p>
          <div className="pp-head"><h2 className="pp-h2">Pick your colour</h2></div>
          <div className="pp-tiles">
            {featured.colors.map((c) => (
              <Link key={c.key} href={`${productHref(featured)}?c=${c.key}`} className="pp-tile" style={{ aspectRatio: "1 / 1" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.images?.[c.images?.[0] ?? 0]?.thumb} alt={`${featured.name} in ${c.name}`} loading="lazy" />
                <span className="pp-swatch" style={{ background: c.hex }} />
                <span className="pp-tile__label"><b>{c.name}</b></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured?.details && featured.details.length >= 3 && (
        <section className="pp-section pp-container">
          <div className="pp-head">
            <h2 className="pp-h2">Built for the pitch</h2>
            <Link href={productHref(featured)} className="pp-more">See the boots →</Link>
          </div>
          <div className="pp-details">
            {featured.details.slice(0, 3).map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={featured.images?.[i]?.src} alt="" loading="lazy" />
            ))}
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
