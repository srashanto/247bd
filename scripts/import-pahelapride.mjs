// Builds public/imports/pahelapride.json from pahelapride.com's public store API.
// The admin panel (Products > Import PahelaPride products) loads that file into the database.
import { readFileSync, writeFileSync } from "node:fs";

const API = "https://pahelapride.com/wp-json/wc/store/v1";
const wanted = new Set(["hair-style", "hair-care", "skin-care", "skin-beauty", "perfume"]);
const existing = new Set(JSON.parse(readFileSync("lib/catalog.json", "utf8")).map((p) => String(p.id)));

async function get(path) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch(`${API}${path}`, { headers: { Accept: "application/json", "User-Agent": "247bd-catalog-import" } });
    if (res.ok) return res.json();
    console.log(`${res.status} on ${path}`);
    await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
  }
  throw new Error(`Could not load ${path}`);
}

const money = (v, minor) => Math.round(Number(v || 0) / 10 ** (minor ?? 2));
const clean = (html = "") =>
  html.replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();
const rebrand = (s = "") => s.replace(/\bBASED\b/g, "PRIDE");
const shortName = (s) => rebrand(s.split(/\s[|–—]\s/)[0]).trim();

function category(slugs) {
  if (slugs.includes("combo")) return "combos";
  if (slugs.includes("perfume")) return "perfume";
  if (slugs.includes("hair-style")) return "hair-styling";
  if (slugs.includes("hair-care")) return "hair-care";
  return "skincare";
}

async function variations(p) {
  const list = [];
  for (const v of p.variations ?? []) {
    const d = await get(`/products/${v.id}`);
    const minor = d.prices?.currency_minor_unit;
    const price = money(d.prices?.price, minor);
    const regular = money(d.prices?.regular_price, minor);
    list.push({
      id: String(v.id),
      label: (v.attributes ?? []).map((a) => a.value).join(" / ") || d.name,
      price,
      regularPrice: regular > price ? regular : null,
      stock: d.is_in_stock ? 50 : 0,
    });
  }
  return list;
}

const all = [];
for (let page = 1; ; page++) {
  const rows = await get(`/products?per_page=100&page=${page}`);
  all.push(...rows);
  if (rows.length < 100) break;
}

const products = [];
for (const p of all) {
  const slugs = (p.categories ?? []).map((c) => c.slug);
  if (!slugs.some((s) => wanted.has(s)) || existing.has(String(p.id)) || !p.is_purchasable) continue;
  const minor = p.prices?.currency_minor_unit;
  const vars = await variations(p);
  const price = vars.length ? Math.min(...vars.map((v) => v.price)) : money(p.prices?.price, minor);
  const regular = money(p.prices?.regular_price, minor);
  if (!price) continue;
  products.push({
    id: String(p.id),
    slug: `pp-${p.slug}`.slice(0, 120),
    name: shortName(p.name.replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&#0?38;|&amp;/g, "&")),
    title: rebrand(clean(p.name)),
    brand: rebrand(p.brands?.[0]?.name || "") || undefined,
    gender: "unisex",
    category: category(slugs),
    price,
    regularPrice: !vars.length && regular > price ? regular : null,
    variations: vars,
    stock: p.is_in_stock ? 50 : 0,
    images: (p.images ?? []).slice(0, 3).map((i) => ({ src: i.src, thumb: i.thumbnail || i.src })),
    pack: { shape: "bottle", tone: "black" },
    description: rebrand(clean(p.short_description || p.description)).slice(0, 500),
    sort: 1000 + products.length,
  });
  if (products.length % 25 === 0) console.log(`${products.length} products`);
}

writeFileSync("public/imports/pahelapride.json", JSON.stringify(products));
const count = {};
for (const p of products) count[p.category] = (count[p.category] || 0) + 1;
console.log(`Saved ${products.length} of ${all.length} store products`, count);
