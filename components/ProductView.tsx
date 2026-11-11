"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog";
import { discountPercent, formatPrice, getCategory, hasVariations, Product, productHref, totalStock, variationFor } from "@/lib/products";
import { categoryHref } from "@/lib/seo";
import ProductCard, { PriceLine, ProductPhoto, WishButton } from "./ProductCard";
import { CashIcon, CheckIcon, TruckIcon } from "./Icons";

const tabs = [
  { key: "description", label: "Description" },
  { key: "ingredients", label: "Specifications" },
  { key: "benefits", label: "Features" },
  { key: "howToUse", label: "Size & care" },
] as const;

function Gallery({ product, imgs }: { product: Product; imgs: NonNullable<Product["images"]> }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-md bg-night">
        <ProductPhoto product={product} src={imgs[i]?.src} eager />
        <WishButton slug={product.slug} className="absolute right-3 top-3 h-11 w-11" />
      </div>
      {imgs.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imgs.map((im, n) => (
            <button
              key={im.thumb + n}
              onClick={() => setI(n)}
              aria-label={`Show photo ${n + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded border-2 sm:h-20 sm:w-20 ${n === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductView({ slug, initial }: { slug: string; initial?: Product }) {
  const { get, products, settings, ready } = useCatalog();
  const product = get(slug) ?? initial;
  const { add } = useCart();
  const router = useRouter();
  const [variation, setVariation] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [pickSize, setPickSize] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("description");

  const twoStep = Boolean(product?.colors?.length && product.variations.some((x) => x.color && x.size));

  useEffect(() => {
    if (!product || !hasVariations(product)) return;
    if (twoStep) {
      // Colour comes from ?c= (links on the home page) or the first colour with stock. Size is the customer's choice.
      if (!color) {
        const wanted = new URLSearchParams(window.location.search).get("c");
        const keys = product.colors!.map((c) => c.key);
        const inStock = (k: string) => product.variations.some((x) => x.color === k && x.stock > 0);
        setColor(wanted && keys.includes(wanted) ? wanted : keys.find(inStock) ?? keys[0]);
      }
      return;
    }
    if (!variation) setVariation((product.variations.find((v) => v.stock > 0) ?? product.variations[0]).id);
  }, [product, variation, color, twoStep]);

  const inside = useMemo(
    () => (product?.includes ?? []).map((s) => get(s)).filter((p): p is Product => Boolean(p)),
    [product, get]
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        {ready ? (
          <>
            <h1 className="text-3xl font-semibold">Product not found</h1>
            <p className="mt-2 text-muted">It may have been removed. Browse the shop for similar products.</p>
            <Link href="/products/" className="btn-gold mt-6 inline-block px-6 py-3">Shop all</Link>
          </>
        ) : (
          <p className="text-muted">Loading product…</p>
        )}
      </div>
    );
  }

  const v = twoStep ? variationFor(product, color, size) : product.variations.find((x) => x.id === variation);
  const colorInfo = product.colors?.find((c) => c.key === color);
  const sizes = twoStep ? Array.from(new Set(product.variations.filter((x) => x.color === color).map((x) => x.size!))) : [];
  // Every photo is in the gallery; the chosen colour's photos come first.
  const allImgs = product.images ?? [];
  const firstIdx = colorInfo?.images ?? [];
  const order = [...firstIdx, ...allImgs.map((_, n) => n).filter((n) => !firstIdx.includes(n))];
  const galleryImgs = order.map((n) => allImgs[n]).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const detailImgs = (product.details ?? []).map((n) => product.images?.[n]).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const needSize = twoStep && !v;
  const unit = v ?? { price: product.price, regularPrice: product.regularPrice, stock: product.stock };
  const stock = v ? v.stock : hasVariations(product) ? (twoStep ? 99 : totalStock(product)) : product.stock;
  const off = discountPercent(unit);
  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.slug !== product.slug && (p.category === product.category || (product.includes ?? []).includes(p.slug)))
    .slice(0, 4);
  const tabContent: Record<string, string[] | undefined> = {
    description: product.description ? product.description.split(/\n{2,}/) : undefined,
    ingredients: product.ingredients,
    benefits: product.benefits,
    howToUse: product.howToUse,
  };
  const visibleTabs = tabs.filter((t) => tabContent[t.key]?.length);

  /** Adds to the cart. Returns false and asks for a size when none is chosen yet. */
  function addToCart() {
    if (needSize) {
      setPickSize(true);
      document.getElementById("size-picker")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return false;
    }
    add(product!.slug, v?.id ?? null, qty);
    return true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:py-8 md:pb-8">
      <nav className="text-[13px] text-muted sm:text-[14px]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href={categoryHref(product.category)} className="hover:text-ink">{category?.name ?? "Shop"}</Link>
      </nav>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-5 md:grid-cols-2 md:gap-8 lg:gap-14">
        <div className="md:sticky md:top-28 md:self-start">
          <Gallery key={color ?? "all"} product={product} imgs={galleryImgs} />
        </div>

        <div>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider">
            {off > 0 && <span className="bg-alert px-2 py-1 text-white">-{off}%</span>}
            {product.badge && <span className="bg-gold px-2 py-1 text-paper">{product.badge}</span>}
          </div>
          <h1 className="mt-3 text-[2.1rem] font-extrabold uppercase italic leading-[0.95] sm:text-[2.6rem] md:text-[3.2rem]">{product.name}</h1>
          {product.title && product.title !== product.name && (
            <p className="mt-1.5 text-[13px] leading-snug text-muted md:text-[15px]">{product.title.replace(product.name, "").replace(/^\s*Bangladesh\b/, "").replace(/^[\s–|-]+/, "")}</p>
          )}

          <div className="mt-3 font-display text-[1.9rem] font-bold sm:mt-4 sm:text-[2.2rem]">
            {v || !hasVariations(product) ? (
              <span className="flex flex-wrap items-baseline gap-3">
                {formatPrice(unit.price)}
                {unit.regularPrice && unit.regularPrice > unit.price && (
                  <span className="text-lg font-normal text-muted line-through">{formatPrice(unit.regularPrice)}</span>
                )}
              </span>
            ) : (
              <PriceLine product={product} />
            )}
          </div>

          {product.gift && (
            <div className="mt-4 flex items-center gap-3 rounded border border-gold/40 bg-gold-soft px-3.5 py-2.5 text-[14px] sm:mt-5 sm:px-4 sm:py-3 sm:text-[15px]">
              <span aria-hidden>🎁</span>
              <span><b>Free gift:</b> {product.gift}</span>
            </div>
          )}
          {settings.couponNotice && (
            <div className="mt-2 flex items-center gap-3 border border-line bg-card px-3.5 py-2.5 text-[13px] text-ink/85 sm:px-4 sm:py-3 sm:text-[14px]">
              <span className="text-gold" aria-hidden>✦</span>
              {settings.couponNotice}
            </div>
          )}

          {twoStep && (
            <div className="mt-5 sm:mt-6">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">Colour: <span className="text-ink">{colorInfo?.name}</span></p>
              <div className="pp-swatches mt-2.5">
                {product.colors!.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => {
                      setColor(c.key);
                      setSize(null);
                      setQty(1);
                    }}
                    aria-pressed={c.key === color}
                    aria-label={c.name}
                    title={c.name}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {twoStep && (
            <div className="mt-5" id="size-picker">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                {product.category === "boots" ? "Size (EU)" : "Size"}: <span className={pickSize && needSize ? "text-alert" : "text-ink"}>{size ?? (pickSize ? "choose a size" : "choose")}</span>
              </p>
              <div className="pp-sizes mt-2.5">
                {sizes.map((z) => {
                  const x = variationFor(product, color, z);
                  return (
                    <button
                      key={z}
                      disabled={!x || x.stock <= 0}
                      aria-pressed={z === size}
                      onClick={() => {
                        setSize(z);
                        setQty(1);
                      }}
                    >
                      {z}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!twoStep && hasVariations(product) && (
            <div className="mt-5 sm:mt-6">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">Size: <span className="text-ink">{v?.label}</span></p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.variations.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => {
                      setVariation(x.id);
                      setQty(1);
                    }}
                    disabled={x.stock <= 0}
                    className={`border px-3.5 py-2 text-[14px] ${
                      x.id === variation ? "border-gold bg-gold-soft text-gold-2" : "border-line hover:border-ink"
                    } disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-line bg-card">
              <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
              <button className="px-4 py-3 text-lg" onClick={() => setQty((q) => Math.min(Math.max(1, stock), q + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button
              disabled={stock <= 0}
              onClick={() => {
                if (!addToCart()) return;
                setAdded(true);
                setTimeout(() => setAdded(false), 1600);
              }}
              className={`flex min-w-40 flex-1 items-center justify-center gap-2 border px-6 py-3.5 text-[14px] font-semibold uppercase tracking-wider disabled:opacity-40 ${
                added ? "border-gold text-gold-2" : "border-ink hover:bg-card-2"
              }`}
            >
              {stock <= 0 ? "Out of stock" : added ? <><CheckIcon /> Added to cart</> : "Add to cart"}
            </button>
          </div>
          <button
            disabled={stock <= 0}
            onClick={() => {
              if (!addToCart()) return;
              router.push("/checkout/");
            }}
            className="btn-gold mt-3 w-full px-6 py-4 text-[14px] disabled:opacity-40"
          >
            Buy now
          </button>
          {stock > 0 && stock <= 5 && <p className="mt-3 text-sm text-alert">Only {stock} left in stock</p>}

          <ul className="mt-6 space-y-2.5 text-[15px]">
            <li className="flex gap-3"><CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> Pick your colour and size before you order</li>
            <li className="flex gap-3"><CashIcon className="h-5 w-5 shrink-0 text-gold" /> Cash on Delivery available</li>
            <li className="flex gap-3"><TruckIcon className="h-5 w-5 shrink-0 text-gold" /> Delivery all over Bangladesh: ৳{settings.deliveryInsideDhaka} inside Dhaka, ৳{settings.deliveryOutsideDhaka} outside</li>
          </ul>

          {product.benefits && product.benefits.length > 0 && (
            <ul className="mt-6 space-y-1.5 border-t border-line pt-5 text-[15px] text-ink/85">
              {product.benefits.slice(0, 3).map((b) => (
                <li key={b} className="flex gap-2"><span className="text-gold">•</span>{b}</li>
              ))}
            </ul>
          )}

          {inside.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <h2 className="text-2xl font-extrabold uppercase italic">What&apos;s in this set</h2>
              <ul className="mt-3 space-y-2">
                {inside.map((p) => (
                  <li key={p.slug}>
                    <Link href={productHref(p)} className="flex items-center gap-3 hover:text-gold-2">
                      <span className="block h-12 w-12 shrink-0 overflow-hidden bg-card"><ProductPhoto product={p} /></span>
                      <span className="text-[15px]">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {visibleTabs.length > 0 && (
        <section className="mt-14">
          <div className="-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4" role="tablist">
            {visibleTabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-[14px] font-semibold uppercase tracking-wider ${
                  tab === t.key ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="max-w-3xl py-6 text-[16px] leading-relaxed text-ink/85">
            {tab === "description" ? (
              tabContent.description?.map((para, i) => <p key={i} className="mb-4 whitespace-pre-line">{para}</p>)
            ) : (
              <ul className="space-y-2">
                {(tabContent[tab] ?? []).map((line, i) => (
                  <li key={i} className="flex gap-3">
                    {tab === "howToUse" ? (
                      <span className="w-5 shrink-0 font-semibold text-gold">{i + 1}.</span>
                    ) : (
                      <span className="text-gold">•</span>
                    )}
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {detailImgs.length > 0 && (
        <section className="mt-12">
          <h2 className="pp-h2">Product details</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {detailImgs.map((im, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.src + n} src={im.src} alt="" loading="lazy" className="w-full rounded-md bg-night" />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="pp-h2">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
      {/* Phone: price and buttons stay at the bottom while scrolling */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2.5 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-muted">{v?.label ?? (colorInfo ? `${colorInfo.name}, pick a size` : product.name)}</p>
            <p className="text-[16px] font-semibold leading-tight">{formatPrice(unit.price * qty)}</p>
          </div>
          <button
            disabled={stock <= 0}
            onClick={() => {
              if (!addToCart()) return;
              setAdded(true);
              setTimeout(() => setAdded(false), 1600);
            }}
            className={`border px-3 py-3 text-[12px] font-semibold uppercase tracking-wider disabled:opacity-40 ${added ? "border-gold text-gold-2" : "border-ink"}`}
          >
            {stock <= 0 ? "Sold out" : added ? "Added ✓" : "Add to cart"}
          </button>
          <button
            disabled={stock <= 0}
            onClick={() => {
              if (!addToCart()) return;
              router.push("/checkout/");
            }}
            className="btn-gold px-4 py-3 text-[12px] disabled:opacity-40"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
