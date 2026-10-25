import catalog from "./catalog.json";

export type Gender = "him" | "her" | "unisex";

export type PackShape =
  | "bottle" | "pump" | "spray" | "jar" | "tube" | "dropper" | "perfume" | "trimmer" | "straightener" | "comb";

export type Pack = { shape: PackShape; tone?: "black" | "white" | "gold" };

export type Variation = {
  id: string;
  label: string;
  price: number;
  regularPrice?: number | null;
  stock: number;
};

export type ProductImage = { src: string; thumb: string };

export type Product = {
  id: string;
  slug: string;
  /** Short name for cards and the cart. */
  name: string;
  /** Full title shown on the product page. */
  title?: string;
  brand?: string;
  gender: Gender;
  category: string;
  price: number;
  regularPrice?: number | null;
  variations: Variation[];
  stock: number;
  images?: ProductImage[];
  pack?: Pack;
  badge?: string | null;
  gift?: string | null;
  description?: string;
  ingredients?: string[];
  benefits?: string[];
  howToUse?: string[];
  includes?: string[] | null;
  published?: boolean;
  sort?: number;
};

export type Category = { slug: string; name: string };

export const categories: Category[] = [
  { slug: "hair-styling", name: "Hair styling" },
  { slug: "hair-care", name: "Hair care" },
  { slug: "curly-hair", name: "Curly hair" },
  { slug: "skincare", name: "Skin care" },
  { slug: "combos", name: "Combos" },
];

export const genders: Record<Gender, { name: string }> = {
  him: { name: "For him" },
  her: { name: "For her" },
  unisex: { name: "For everyone" },
};

/** The catalog bundled with the site. The live catalog from the admin panel replaces it when connected. */
export const staticProducts: Product[] = (catalog as unknown as Product[]).filter((p) => p.published !== false);
export const staticSlugs = new Set(staticProducts.map((p) => p.slug));

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function productHref(p: Pick<Product, "slug">) {
  return staticSlugs.has(p.slug) ? `/products/${p.slug}/` : `/item/?s=${encodeURIComponent(p.slug)}`;
}

export function formatPrice(amount: number) {
  return "৳" + Math.round(amount).toLocaleString("en-IN");
}

export function hasVariations(p: Product) {
  return (p.variations?.length ?? 0) > 0;
}

export function priceRange(p: Product): [number, number] {
  if (!hasVariations(p)) return [p.price, p.price];
  const prices = p.variations.map((v) => v.price);
  return [Math.min(...prices), Math.max(...prices)];
}

export function totalStock(p: Product) {
  return hasVariations(p) ? p.variations.reduce((n, v) => n + (v.stock || 0), 0) : p.stock;
}

export function discountPercent(p: { price: number; regularPrice?: number | null }) {
  return p.regularPrice && p.regularPrice > p.price ? Math.round(((p.regularPrice - p.price) / p.regularPrice) * 100) : 0;
}

/** Largest saving across sizes, for the card badge. */
export function bestDiscount(p: Product) {
  if (!hasVariations(p)) return discountPercent(p);
  return Math.max(0, ...p.variations.map(discountPercent));
}

export function findVariation(p: Product, id?: string | null) {
  return p.variations?.find((v) => v.id === id);
}

export function firstImage(p: Product, size: "thumb" | "src" = "thumb") {
  return p.images?.[0]?.[size];
}
