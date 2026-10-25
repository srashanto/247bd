import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ProductView from "@/components/ProductView";
import { getCategory, hasVariations, priceRange, staticProducts, totalStock } from "@/lib/products";
import { categoryHref, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return staticProducts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)) + "…");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = staticProducts.find((x) => x.slug === slug);
  if (!p) return { title: "Product" };
  const [lo, hi] = priceRange(p);
  const price = lo === hi ? `৳${lo}` : `৳${lo}–৳${hi}`;
  const description = clip(
    `${p.name} price in Bangladesh: ${price}.${p.gift ? ` ${p.gift}.` : ""} ${(p.description ?? "").replace(/\s+/g, " ")}`,
    158
  );
  return {
    title: `${p.name} Price in Bangladesh`,
    description,
    alternates: { canonical: `/products/${p.slug}/` },
    openGraph: {
      type: "website",
      title: `${p.name} | 247BD`,
      description,
      url: `/products/${p.slug}/`,
      images: p.images?.slice(0, 1).map((i) => ({ url: i.src, width: 1024, height: 1024, alt: p.name })),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = staticProducts.find((x) => x.slug === slug);
  if (!p) return <ProductView slug={slug} />;

  const url = `${SITE_URL}/products/${p.slug}/`;
  const [lo, hi] = priceRange(p);
  const availability = totalStock(p) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const seller = { "@type": "Organization", name: "247BD by PahelaPride" };
  const category = getCategory(p.category);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: (p.description ?? "").replace(/\s+/g, " ").slice(0, 5000),
      image: p.images?.map((i) => i.src),
      sku: p.id,
      brand: { "@type": "Brand", name: p.brand ?? "PRIDE" },
      category: category?.name,
      url,
      offers: hasVariations(p)
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "BDT",
            lowPrice: lo,
            highPrice: hi,
            offerCount: p.variations.length,
            availability,
            itemCondition: "https://schema.org/NewCondition",
            url,
            seller,
          }
        : {
            "@type": "Offer",
            priceCurrency: "BDT",
            price: p.price,
            availability,
            itemCondition: "https://schema.org/NewCondition",
            url,
            seller,
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "BD" },
              shippingRate: { "@type": "MonetaryAmount", value: 80, currency: "BDT" },
            },
          },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: category?.name ?? "Shop", item: `${SITE_URL}${categoryHref(p.category)}` },
        { "@type": "ListItem", position: 3, name: p.name, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <ProductView slug={slug} initial={p} />
    </>
  );
}
