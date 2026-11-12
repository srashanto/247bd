import catalog from "./catalog.json";

export type Gender = "him" | "her" | "unisex";

export type PackShape = "boot" | "ball" | "jersey" | "shorts" | "sock" | "shin" | "glove" | "bag" | "cone" | "band" | "pump";

/** Drawn product art, used when a product has no photo yet. */
export type Pack = { shape: PackShape; color?: string };

export type Variation = {
  id: string;
  label: string;
  /** Colour key (matches Product.colors) and size, when the product has both. */
  color?: string;
  size?: string;
  price: number;
  regularPrice?: number | null;
  stock: number;
};

export type ProductImage = { src: string; thumb: string };

/** A colour option. `images` are positions in Product.images shown for this colour. */
/** `sole` (e.g. "Spike (FG)", "Flat (TF)") adds a Sole picker. The same colour in another sole shares the key prefix before "-" (white-fg, white-tf). */
export type ProductColor = { key: string; name: string; hex: string; images?: number[]; sole?: string };

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
  /** Heading for the second picker, e.g. "Pack". Defaults to Size. */
  sizeLabel?: string;
  colors?: ProductColor[];
  /** Positions in `images` shown in the "Built for the pitch" strip on the product page. */
  details?: number[];
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
  { slug: "boots", name: "Boots" },
  { slug: "footballs", name: "Footballs" },
  { slug: "jerseys", name: "Jerseys & shorts" },
  { slug: "socks", name: "Socks" },
  { slug: "shin-guards", name: "Shin guards" },
  { slug: "gloves", name: "Keeper gloves" },
  { slug: "bags", name: "Bags" },
  { slug: "training", name: "Training gear" },
];
export const categorySlugs = new Set(categories.map((c) => c.slug));

export const genders: Record<Gender, { name: string }> = {
  him: { name: "For men" },
  her: { name: "For women" },
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

/** Variation for a colour + size, for products that have both. */
export function variationFor(p: Product, color: string | null, size: string | null) {
  return p.variations?.find((v) => (!p.colors?.length || v.color === color) && v.size === size);
}

export function findVariation(p: Product, id?: string | null) {
  return p.variations?.find((v) => v.id === id);
}

export function firstImage(p: Product, size: "thumb" | "src" = "thumb") {
  return p.images?.[0]?.[size];
}
