import type { MetadataRoute } from "next";
import { staticProducts } from "@/lib/products";
import { landings, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...landings.map((l) => ({ url: `${SITE_URL}/${l.slug}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...staticProducts.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.category === "combos" ? 0.7 : 0.8,
      images: p.images?.slice(0, 3).map((i) => i.src),
    })),
    { url: `${SITE_URL}/help/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
