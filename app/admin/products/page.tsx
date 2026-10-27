"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { btn, btnGhost, field, useAdmin } from "@/components/admin/AdminShell";
import { Empty, PageTitle, Toast } from "@/components/admin/common";
import { ProductRow, rowToProduct } from "@/lib/catalog";
import { categories, formatPrice, priceRange, Product, productHref, staticProducts, totalStock, Variation } from "@/lib/products";
import { compressImage } from "@/lib/orders";
import { errorMessage } from "@/lib/supabase";

function toRow(p: Product) {
  const { id, slug, published, sort, ...data } = p;
  return { id, slug, published: published !== false, sort: sort ?? 0, data: { ...data, id, slug }, updated_at: new Date().toISOString() };
}

const lines = (v?: string[]) => (v ?? []).join("\n");
const unlines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function Editor({ initial, all, onSaved, onClose }: { initial: Product; all: Product[]; onSaved: () => void; onClose: () => void }) {
  const { db } = useAdmin();
  const isNew = !all.some((p) => p.id === initial.id);
  const [p, setP] = useState<Product>(initial);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const setVar = (i: number, patch: Partial<Variation>) =>
    setP((x) => ({ ...x, variations: x.variations.map((v, n) => (n === i ? { ...v, ...patch } : v)) }));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added = [];
      for (const f of Array.from(files)) {
        const blob = await compressImage(f, 1400);
        const path = `${p.slug || "product"}/${crypto.randomUUID()}.jpg`;
        const { error } = await db.storage.from("product-images").upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        const url = db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
        added.push({ src: url, thumb: url });
      }
      set("images", [...(p.images ?? []), ...added]);
    } catch (e) {
      setToast(errorMessage(e));
    }
    setBusy(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const slug = p.slug || slugify(p.name);
    if (!p.name.trim()) return setToast("Give the product a name.");
    if (all.some((x) => x.slug === slug && x.id !== p.id)) return setToast("Another product already uses this link name (slug).");
    const vars = p.variations.filter((v) => v.label.trim());
    const clean: Product = {
      ...p,
      slug,
      variations: vars.map((v) => ({ ...v, id: v.id || slugify(v.label), price: Number(v.price) || 0, regularPrice: v.regularPrice ? Number(v.regularPrice) : null, stock: Number(v.stock) || 0 })),
      price: vars.length ? Math.min(...vars.map((v) => Number(v.price) || 0)) : Number(p.price) || 0,
      regularPrice: p.regularPrice ? Number(p.regularPrice) : null,
      stock: Number(p.stock) || 0,
      gift: p.gift?.trim() || null,
      badge: p.badge?.trim() || null,
    };
    setBusy(true);
    const { error } = await db.from("products").upsert(toRow(clean));
    setBusy(false);
    if (error) return setToast(errorMessage(error));
    setToast("Saved. Changes are live on the store.");
    onSaved();
    if (isNew) onClose();
  }

  async function remove() {
    if (!confirm(`Delete ${p.name}? Old orders keep their details. To hide it for now, untick "Show on store" instead.`)) return;
    const { error } = await db.from("products").delete().eq("id", p.id);
    if (error) return setToast(errorMessage(error));
    onSaved();
    onClose();
  }

  const L = "block text-[13px] font-medium text-ink/85";

  return (
    <form onSubmit={save}>
      <button type="button" onClick={onClose} className="text-[14px] text-muted hover:text-ink">← All products</button>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{isNew ? "New product" : p.name}</h1>
        <div className="flex flex-wrap gap-2">
          {!isNew && <a href={productHref(p)} target="_blank" rel="noreferrer" className={btnGhost}>View on store ↗</a>}
          {!isNew && <button type="button" onClick={remove} className={`${btnGhost} text-alert`}>Delete</button>}
          <button disabled={busy} className={btn}>{busy ? "Saving…" : "Save product"}</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="space-y-4 bg-card p-5 ring-1 ring-line">
            <label className={L}>Name (on cards and cart)<input required value={p.name} onChange={(e) => set("name", e.target.value)} className={`${field} mt-1`} /></label>
            <label className={L}>Full title (on the product page)<input value={p.title ?? ""} onChange={(e) => set("title", e.target.value)} className={`${field} mt-1`} /></label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={L}>Category
                <select value={p.category} onChange={(e) => set("category", e.target.value)} className={`${field} mt-1`}>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label className={L}>Badge<input value={p.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="e.g. Bestseller" className={`${field} mt-1`} /></label>
              <label className={L}>Link name (slug)<input value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="auto from name" className={`${field} mt-1`} disabled={!isNew && staticProducts.some((s) => s.slug === p.slug)} /></label>
            </div>
            <label className={L}>Free gift text<input value={p.gift ?? ""} onChange={(e) => set("gift", e.target.value)} placeholder="e.g. FREE Texture Comb (full size)" className={`${field} mt-1`} /></label>
            <label className="flex items-center gap-2 text-[15px]">
              <input type="checkbox" checked={p.published !== false} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-[#c8ac56]" />
              Show on store
            </label>
          </section>

          <section className="bg-card p-5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Sizes, price and stock</h2>
              <button type="button" onClick={() => set("variations", [...p.variations, { id: "", label: "", price: 0, regularPrice: null, stock: 0 }])} className={btnGhost}>
                Add size
              </button>
            </div>
            {p.variations.length === 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className={L}>Price ৳<input type="number" min={0} value={p.price} onChange={(e) => set("price", Number(e.target.value))} className={`${field} mt-1`} /></label>
                <label className={L}>Regular price ৳ (crossed out)<input type="number" min={0} value={p.regularPrice ?? ""} onChange={(e) => set("regularPrice", e.target.value ? Number(e.target.value) : null)} className={`${field} mt-1`} /></label>
                <label className={L}>Stock<input type="number" min={0} value={p.stock} onChange={(e) => set("stock", Number(e.target.value))} className={`${field} mt-1`} /></label>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] gap-2 text-[12px] uppercase tracking-wider text-muted sm:grid">
                  <span>Size</span><span>Price ৳</span><span>Regular ৳</span><span>Stock</span><span />
                </div>
                {p.variations.map((v, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1.5fr_1fr_1fr_0.8fr_auto]">
                    <input value={v.label} onChange={(e) => setVar(i, { label: e.target.value })} placeholder="e.g. 50ml Budget Pack" className={`${field} col-span-2 sm:col-span-1`} aria-label="Size" />
                    <input type="number" min={0} value={v.price} onChange={(e) => setVar(i, { price: Number(e.target.value) })} className={field} aria-label="Price" />
                    <input type="number" min={0} value={v.regularPrice ?? ""} onChange={(e) => setVar(i, { regularPrice: e.target.value ? Number(e.target.value) : null })} className={field} aria-label="Regular price" />
                    <input type="number" min={0} value={v.stock} onChange={(e) => setVar(i, { stock: Number(e.target.value) })} className={field} aria-label="Stock" />
                    <button type="button" onClick={() => set("variations", p.variations.filter((_, n) => n !== i))} className="px-2 text-[13px] text-muted hover:text-alert">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4 bg-card p-5 ring-1 ring-line">
            <label className={L}>Description<textarea rows={8} value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} className={`${field} mt-1`} /></label>
            <label className={L}>Ingredients (one per line)<textarea rows={5} value={lines(p.ingredients)} onChange={(e) => set("ingredients", unlines(e.target.value))} className={`${field} mt-1`} /></label>
            <label className={L}>Benefits (one per line)<textarea rows={5} value={lines(p.benefits)} onChange={(e) => set("benefits", unlines(e.target.value))} className={`${field} mt-1`} /></label>
            <label className={L}>How to use (one step per line)<textarea rows={5} value={lines(p.howToUse)} onChange={(e) => set("howToUse", unlines(e.target.value))} className={`${field} mt-1`} /></label>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-5 ring-1 ring-line">
            <h2 className="font-semibold">Photos</h2>
            <p className="mt-1 text-[13px] text-muted">The first photo is the main one.</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(p.images ?? []).map((im, i) => (
                <div key={im.src + i} className="group relative aspect-square bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.thumb} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 text-[12px] opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                    <button type="button" disabled={i === 0} onClick={() => { const a = [...(p.images ?? [])]; [a[0], a[i]] = [a[i], a[0]]; set("images", a); }} className="px-2 py-1 disabled:opacity-30">Main</button>
                    <button type="button" onClick={() => set("images", (p.images ?? []).filter((_, n) => n !== i))} className="px-2 py-1 text-alert">Remove</button>
                  </div>
                </div>
              ))}
              <label className="grid aspect-square cursor-pointer place-items-center border border-dashed border-gold/50 text-center text-[13px] text-gold hover:bg-paper">
                {busy ? "Uploading…" : "+ Upload"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
              </label>
            </div>
            <label className={`${L} mt-4`}>Or add a photo link
              <input
                placeholder="https://… then press Enter"
                className={`${field} mt-1`}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  const url = (e.target as HTMLInputElement).value.trim();
                  if (url) set("images", [...(p.images ?? []), { src: url, thumb: url }]);
                  (e.target as HTMLInputElement).value = "";
                }}
              />
            </label>
          </section>

          {p.category === "combos" && (
            <section className="bg-card p-5 ring-1 ring-line">
              <h2 className="font-semibold">Products in this combo</h2>
              <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto text-[14px]">
                {all.filter((x) => x.category !== "combos").map((x) => (
                  <label key={x.slug} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(p.includes ?? []).includes(x.slug)}
                      onChange={(e) => set("includes", e.target.checked ? [...(p.includes ?? []), x.slug] : (p.includes ?? []).filter((s) => s !== x.slug))}
                      className="h-4 w-4 accent-[#c8ac56]"
                    />
                    {x.name}
                  </label>
                ))}
              </div>
            </section>
          )}

          <section className="bg-card p-5 ring-1 ring-line">
            <label className={L}>Order on the store (lower comes first)
              <input type="number" value={p.sort ?? 0} onChange={(e) => set("sort", Number(e.target.value))} className={`${field} mt-1`} />
            </label>
          </section>
        </div>
      </div>
      <Toast msg={toast} onDone={() => setToast("")} />
    </form>
  );
}

function ProductsAdmin() {
  const { db } = useAdmin();
  const params = useSearchParams();
  const router = useRouter();
  const edit = params.get("edit");
  const isNew = params.get("new") === "1";
  const [list, setList] = useState<Product[] | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await db.from("products").select("id, slug, data, published, sort").order("sort");
    if (error) setToast(errorMessage(error));
    setList(((data as ProductRow[]) ?? []).map(rowToProduct));
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  async function importCatalog() {
    if (!list) return;
    const missing = staticProducts.filter((s) => !list.some((p) => p.slug === s.slug));
    if (!missing.length) return setToast("Every PRIDE product is already in the database.");
    setBusy(true);
    const { error } = await db.from("products").upsert(missing.map(toRow));
    setBusy(false);
    if (error) return setToast(errorMessage(error));
    setToast(`Imported ${missing.length} products.`);
    load();
  }

  /** Copies newer descriptions from the bundled catalog, keeping prices, stock and everything else. */
  async function syncDescriptions() {
    if (!list) return;
    const changed = list.flatMap((p) => {
      const s = staticProducts.find((x) => x.slug === p.slug);
      return s && s.description && s.description !== p.description ? [{ ...p, description: s.description }] : [];
    });
    if (!changed.length) return;
    setBusy(true);
    const { error } = await db.from("products").upsert(changed.map(toRow));
    setBusy(false);
    if (error) return setToast(errorMessage(error));
    setToast(`Updated ${changed.length} descriptions.`);
    load();
  }

  async function quick(p: Product, patch: Partial<Product>) {
    const next = { ...p, ...patch };
    setList((l) => l?.map((x) => (x.id === p.id ? next : x)) ?? null);
    const { error } = await db.from("products").upsert(toRow(next));
    if (error) setToast(errorMessage(error));
  }

  if (!list) return <p className="text-muted">Loading…</p>;

  const close = () => router.push("/admin/products/");
  if (edit || isNew) {
    const found = list.find((p) => p.slug === edit);
    if (edit && !found) return <p className="text-muted">Product not found. <Link href="/admin/products/" className="underline">Back</Link></p>;
    const blank: Product = {
      id: crypto.randomUUID().slice(0, 8), slug: "", name: "", brand: "PRIDE", gender: "him", category: "hair-styling",
      price: 0, regularPrice: null, variations: [], stock: 0, images: [], published: true, sort: (list.at(-1)?.sort ?? 0) + 1,
    };
    return <Editor key={edit ?? "new"} initial={found ?? blank} all={list} onSaved={load} onClose={close} />;
  }

  const shown = list.filter(
    (p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.title ?? ""}`.toLowerCase().includes(q.toLowerCase()))
  );
  const missing = staticProducts.filter((s) => !list.some((p) => p.slug === s.slug)).length;
  const outdated = list.filter((p) => {
    const s = staticProducts.find((x) => x.slug === p.slug);
    return s?.description && s.description !== p.description;
  }).length;

  return (
    <div>
      <PageTitle title="Products">
        <button onClick={() => router.push("/admin/products/?new=1")} className={btn}>Add product</button>
      </PageTitle>

      {missing > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-gold/50 bg-gold-soft p-4 text-[15px]">
          <span>{list.length === 0 ? "No products in the database yet." : `${missing} PRIDE products aren't in the database yet.`} Import them to start taking orders.</span>
          <button disabled={busy} onClick={importCatalog} className={btn}>{busy ? "Importing…" : "Import PRIDE catalog"}</button>
        </div>
      )}

      {outdated > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-gold/50 bg-gold-soft p-4 text-[15px]">
          <span>{outdated} PRIDE product description{outdated === 1 ? " has" : "s have"} an update. Prices, stock and photos stay as they are.</span>
          <button disabled={busy} onClick={syncDescriptions} className={btn}>{busy ? "Updating…" : "Update descriptions"}</button>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className={`${field} w-60`} aria-label="Search products" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${field} w-auto`} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <Empty>No products match.</Empty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 pr-3">Product</th>
                <th className="pr-3">Category</th>
                <th className="pr-3">Price</th>
                <th className="pr-3">Stock</th>
                <th className="pr-3">On store</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((p) => {
                const [lo, hi] = priceRange(p);
                const stock = totalStock(p);
                return (
                  <tr key={p.id} className="hover:bg-card">
                    <td className="py-2.5 pr-3">
                      <Link href={`/admin/products/?edit=${p.slug}`} className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].thumb} alt="" className="h-11 w-11 shrink-0 object-cover" />
                        ) : (
                          <span className="h-11 w-11 shrink-0 bg-paper" />
                        )}
                        <span className="font-medium hover:text-gold-2">{p.name}</span>
                      </Link>
                    </td>
                    <td className="pr-3 text-muted">{categories.find((c) => c.slug === p.category)?.name}</td>
                    <td className="pr-3">{lo === hi ? formatPrice(lo) : `${formatPrice(lo)} – ${formatPrice(hi)}`}</td>
                    <td className={`pr-3 ${stock <= 0 ? "text-alert" : stock <= 5 ? "text-gold-2" : ""}`}>
                      {p.variations.length ? (
                        <span title={p.variations.map((v) => `${v.label}: ${v.stock}`).join("\n")}>{stock} <span className="text-muted">({p.variations.length} sizes)</span></span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          defaultValue={p.stock}
                          onBlur={(e) => Number(e.target.value) !== p.stock && quick(p, { stock: Number(e.target.value) })}
                          className="w-20 border border-line bg-card px-2 py-1"
                          aria-label={`Stock for ${p.name}`}
                        />
                      )}
                    </td>
                    <td className="pr-3">
                      <input type="checkbox" checked={p.published !== false} onChange={(e) => quick(p, { published: e.target.checked })} className="h-4 w-4 accent-[#c8ac56]" aria-label={`Show ${p.name} on store`} />
                    </td>
                    <td className="text-right">
                      <Link href={`/admin/products/?edit=${p.slug}`} className="text-[13px] underline underline-offset-4">Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <ProductsAdmin />
    </Suspense>
  );
}
