import Link from "next/link";
import type { Metadata } from "next";
import CategoryGrid from "@/components/CategoryGrid";
import LandingPills from "@/components/LandingPills";
import JsonLd from "@/components/JsonLd";
import { staticProducts } from "@/lib/products";
import { absUrl, landings, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return landings.map((l) => ({ landing: l.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }): Promise<Metadata> {
  const { landing } = await params;
  const l = landings.find((x) => x.slug === landing)!;
  const items = staticProducts.filter((p) => !l.category || p.category === l.category);
  const cover = items[0]?.images?.[0]?.src;
  return {
    title: l.title,
    description: l.description,
    keywords: l.keywords,
    alternates: { canonical: `/${l.slug}/` },
    // A category with no products yet would be a thin page, so keep it out of Google until it has some.
    robots: items.length ? undefined : { index: false, follow: true },
    openGraph: { title: l.title, description: l.description, url: `/${l.slug}/`, images: cover ? [absUrl(cover)] : undefined },
  };
}

export default async function LandingPage({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const l = landings.find((x) => x.slug === landing)!;
  const items = staticProducts.filter((p) => !l.category || p.category === l.category);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: l.h1, item: `${SITE_URL}/${l.slug}/` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: l.title,
      description: l.description,
      url: `${SITE_URL}/${l.slug}/`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/products/${p.slug}/`, name: p.name })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: l.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <JsonLd data={schema} />
      <nav className="text-[13px] text-muted sm:text-[14px]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/80">{l.h1}</span>
      </nav>

      <h1 className="pp-h2 mt-5 max-w-3xl">{l.h1}</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink/80 sm:text-[17px]">{l.lead}</p>

      <LandingPills current={l.slug} />

      <div className="mt-8">
        <CategoryGrid category={l.category} />
      </div>

      <section className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="max-w-prose space-y-4 text-[16px] leading-relaxed text-ink/85">
          <h2 className="text-3xl font-extrabold uppercase italic text-ink">About {l.h1.charAt(0).toLowerCase() + l.h1.slice(1)}</h2>
          {l.body.map((b) => <p key={b}>{b}</p>)}
          <p lang="bn">{l.bn}</p>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold uppercase italic">Questions</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {l.faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
