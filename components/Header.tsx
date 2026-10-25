"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { categories, products } from "@/lib/products";
import { STORE } from "@/lib/store";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";

export function Logo({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold leading-none tracking-[0.02em] text-ink [font-stretch:125%] ${className}`}>
      247<span className="text-gold">BD</span>
    </span>
  );
}

const mainNav = [
  { href: "/products/?for=him", label: "Men" },
  { href: "/products/?for=her", label: "Women" },
  { href: "/products/?category=skincare", label: "Skin" },
  { href: "/products/?category=combos", label: "Combos" },
];

const megaColumns = ["hair-styling", "hair-care", "skincare", "beard-shave", "body-care", "fragrance"];

export default function Header() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products/?q=${encodeURIComponent(q.trim())}`);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const searchForm = (
    <form onSubmit={onSearch} role="search" className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
      <input
        autoFocus={searchOpen}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search shampoo, beard oil, sunscreen…"
        aria-label="Search products"
        className="w-full border border-line bg-card py-3 pl-10 pr-4 text-[15px] outline-none placeholder:text-muted focus:border-gold"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40" onMouseLeave={() => setMegaOpen(false)}>
      <div className="bg-[#000] text-center text-[12px] font-medium uppercase tracking-[0.12em] text-ink">
        <Link href="/products/?category=combos" className="block px-4 py-2 hover:text-gold-2">
          Save up to 20% on combos · Free delivery over ৳{STORE.freeDeliveryOver.toLocaleString("en-IN")}
        </Link>
      </div>

      <div className="border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4 lg:gap-9">
          <button className="-ml-1 p-1 lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="/" aria-label="247BD home" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-[15px] lg:flex">
            <button
              className="flex items-center gap-1 hover:text-gold-2"
              aria-expanded={megaOpen}
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Shop <span className={`text-[10px] transition-transform ${megaOpen ? "rotate-180" : ""}`}>▼</span>
            </button>
            {mainNav.map((n) => (
              <Link key={n.href} href={n.href} onMouseEnter={() => setMegaOpen(false)} className="whitespace-nowrap hover:text-gold-2">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/products/?category=combos"
              className="mr-2 hidden items-center gap-2 bg-card px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider hover:bg-card-2 md:flex"
            >
              <span className="text-gold">✦</span> Shop combos
            </Link>
            <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="p-2 hover:text-gold-2">
              <SearchIcon />
            </button>
            <Link href="/wishlist/" aria-label="Wishlist" className="relative p-2 hover:text-gold-2">
              <HeartIcon />
              {slugs.length > 0 && (
                <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-gold px-1 text-[10px] font-bold text-paper">
                  {slugs.length}
                </span>
              )}
            </Link>
            <Link href="/cart/" aria-label={`Cart, ${count} items`} className="relative p-2 hover:text-gold-2">
              <BagIcon />
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-gold px-1 text-[10px] font-bold text-paper">
                {count}
              </span>
            </Link>
          </div>
        </div>

        {searchOpen && <div className="mx-auto max-w-7xl px-4 pb-4">{searchForm}</div>}
      </div>

      {megaOpen && (
        <div className="absolute inset-x-0 hidden border-b border-line bg-[#0d0d0d] lg:block">
          <div className="mx-auto grid max-w-7xl grid-cols-[repeat(6,1fr)_1.3fr] gap-6 px-4 py-8">
            {megaColumns.map((slug) => {
              const cat = categories.find((c) => c.slug === slug)!;
              const list = products.filter((p) => p.category === slug).slice(0, 5);
              return (
                <div key={slug}>
                  <Link
                    href={`/products/?category=${slug}`}
                    onClick={() => setMegaOpen(false)}
                    className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold hover:text-gold-2"
                  >
                    {cat.name}
                  </Link>
                  <ul className="mt-3 space-y-2 text-[14px] text-ink/85">
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/products/${p.slug}/`} onClick={() => setMegaOpen(false)} className="hover:text-ink">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <Link
              href="/products/?category=combos"
              onClick={() => setMegaOpen(false)}
              className="concrete flex flex-col justify-end border border-line p-5"
            >
              <span className="font-display text-xl font-semibold leading-tight">Get the full routine</span>
              <span className="mt-1 text-sm text-muted">Combos cost less than buying each product alone.</span>
              <span className="btn-gold mt-4 w-fit px-4 py-2.5 text-[12px]">Shop combos</span>
            </Link>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-b border-line bg-paper px-4 pb-6 pt-4 lg:hidden">
          {searchForm}
          <div className="mt-4 divide-y divide-line border-y border-line">
            {[...mainNav, { href: "/products/", label: "Shop all" }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="block py-3.5 font-display text-lg font-semibold">
                {n.label}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Categories</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products/?category=${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="border border-line px-3 py-2"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/orders/" onClick={() => setMenuOpen(false)} className="border border-line px-3 py-2">
              My orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
