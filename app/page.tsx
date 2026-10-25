import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Packshot from "@/components/Packshot";
import { CashIcon, ChatIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import { categories, concerns, getProduct, Product, products } from "@/lib/products";
import { STORE } from "@/lib/store";

const pick = (slugs: string[]) => slugs.map((s) => getProduct(s)).filter((p): p is Product => Boolean(p));

const himShelf = pick(["matte-clay-pomade", "beard-growth-oil", "sea-salt-texture-spray"]);
const herShelf = pick(["vitamin-c-glow-serum", "rice-water-repair-shampoo", "peony-edp", "argan-hair-serum"]);

const categoryCover: Record<string, string> = {
  "hair-care": "anti-hairfall-shampoo-men",
  "hair-styling": "matte-clay-pomade",
  skincare: "invisible-sunscreen-spf50",
  "beard-shave": "beard-growth-oil",
  "body-care": "brightening-body-lotion",
  fragrance: "oud-intense-edp",
  tools: "precision-beard-trimmer",
};

function Shelf({ items, delay = 0 }: { items: Product[]; delay?: number }) {
  return (
    <div className="absolute inset-x-6 bottom-6 sm:inset-x-10">
      <div className="flex h-44 items-end justify-end gap-2 sm:h-56">
        {items.map((p, i) => (
          <Packshot
            key={p.slug}
            product={p}
            className="shelf-item h-full"
            style={{ animationDelay: `${delay + i * 110}ms`, height: `${[78, 100, 88, 70][i] ?? 80}%` }}
          />
        ))}
      </div>
      <div className="h-2 rounded-full bg-white/20" />
    </div>
  );
}

function Door({ href, title, line, cta, tone, items, delay }: {
  href: string; title: string; line: string; cta: string; tone: "him" | "her"; items: Product[]; delay: number;
}) {
  const bg = tone === "him" ? "bg-him hover:bg-him-deep" : "bg-her hover:bg-her-deep";
  return (
    <Link href={href} className={`group relative block min-h-[440px] overflow-hidden rounded-[28px] p-7 text-paper transition-colors sm:min-h-[500px] sm:p-10 ${bg}`}>
      <h2 className="font-display text-[clamp(3.2rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">{title}</h2>
      <p className="mt-4 max-w-[24ch] text-lg leading-snug text-paper/85">{line}</p>
      <span className="mt-6 inline-flex rounded-full bg-paper px-5 py-2.5 font-semibold text-ink group-hover:bg-white">{cta}</span>
      <Shelf items={items} delay={delay} />
    </Link>
  );
}

export default function Home() {
  const bestsellers = products.filter((p) => p.badge === "Bestseller" && !p.includes).slice(0, 8);
  const combos = products.filter((p) => p.includes);
  const fresh = products.filter((p) => p.badge === "New");

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Grooming for him and her</h1>
          <p className="max-w-md text-[17px] text-muted">
            Hair, skin, beard and fragrance essentials. Order online and pay when it reaches your door.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Door
            href="/products/?for=him"
            title="For him"
            line="Beard care, styling and skincare that handles heat and sweat."
            cta="Shop men's grooming"
            tone="him"
            items={himShelf}
            delay={100}
          />
          <Door
            href="/products/?for=her"
            title="For her"
            line="Hair repair, glow skincare and fragrance for every day."
            cta="Shop women's grooming"
            tone="her"
            items={herShelf}
            delay={250}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-line py-7 text-[15px] lg:grid-cols-4">
          {[
            [TruckIcon, "Delivery in 1–3 days", `Inside Dhaka ৳${STORE.deliveryInsideDhaka}, outside ৳${STORE.deliveryOutsideDhaka}`],
            [CashIcon, "Cash on delivery", "Or pay with bKash / Nagad"],
            [ReturnIcon, "7-day returns", "On unopened products"],
            [ChatIcon, "Help on WhatsApp", "Ask before you buy"],
          ].map(([Icon, title, sub]) => {
            const I = Icon as typeof TruckIcon;
            return (
              <li key={title as string} className="flex gap-3">
                <I className="mt-0.5 h-5 w-5 shrink-0 text-him" />
                <div>
                  <div className="font-semibold">{title as string}</div>
                  <div className="text-sm text-muted">{sub as string}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="text-2xl font-bold sm:text-3xl">What do you want to fix?</h2>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {concerns.map((c) => (
            <Link
              key={c.slug}
              href={`/products/?concern=${c.slug}`}
              className="rounded-full border border-ink/15 bg-white px-4 py-2 text-[15px] font-medium hover:border-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Shop by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.filter((c) => categoryCover[c.slug]).map((c) => {
            const p = getProduct(categoryCover[c.slug])!;
            return (
              <Link key={c.slug} href={`/products/?category=${c.slug}`} className="group rounded-[18px] bg-white p-3 ring-1 ring-line hover:ring-ink">
                <div className="grid aspect-square place-items-center rounded-xl bg-paper">
                  <Packshot product={p} className="h-[72%]" />
                </div>
                <div className="mt-2.5 px-1 font-display font-semibold">{c.name}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Bestsellers</h2>
          <Link href="/products/" className="text-[15px] font-semibold underline underline-offset-4">See all products</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mt-20 bg-saffron-soft">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Combos that cost less together</h2>
            <p className="mt-2 text-[17px] text-muted">Complete routines, priced lower than buying each product on its own.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {combos.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">How ordering works</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            ["Add to cart and check out", "Give your name, phone and address. No account needed."],
            ["Confirm on WhatsApp", "One tap sends your order to us so we can pack it the same day."],
            ["Pay when it arrives", `Cash on delivery anywhere in Bangladesh. Free delivery over ৳${STORE.freeDeliveryOver.toLocaleString("en-IN")}.`],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="font-display text-5xl font-extrabold leading-none text-saffron">{i + 1}</span>
              <div>
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {fresh.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">New in</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
