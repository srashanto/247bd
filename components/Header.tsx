"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";
import { categories, productHref } from "@/lib/products";
import { categoryHref } from "@/lib/seo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";

export function Logo({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold leading-none tracking-[0.02em] text-ink [font-stretch:125%] ${className}`}>
      247<span className="text-gold">BD</span>
    </span>
  );
}

const mainNav = [
  { href: "/hair-styling/", label: "Hair styling" },
  { href: "/hair-care/", label: "Hair care" },
  { href: "/curly-hair/", label: "Curly hair" },
  { href: "/skin-care/", label: "Skin care" },
  { href: "/combos/", label: "Combos" },
];

function Ticker({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-gold text-[12px] font-semibold text-paper">
      <div className="ticker flex w-max gap-10 whitespace-nowrap px-4 py-2">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const { products, settings } = useCatalog();
  const auth = useAuth();
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
        placeholder="Search hair clay, curl cream, shampoo…"
        aria-label="Search products"
        className="w-full border border-line bg-card py-3 pl-10 pr-4 text-[15px] outline-none placeholder:text-muted focus:border-gold"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40" onMouseLeave={() => setMegaOpen(false)}>
      <Ticker items={settings.announcements} />

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
            <Link href="/orders/" className="mr-1 hidden px-3 py-2 text-[13px] font-semibold uppercase tracking-wider hover:text-gold-2 md:block">
              Track order
            </Link>
            <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="p-2 hover:text-gold-2">
              <SearchIcon />
            </button>
            {auth.enabled && (
              <Link href="/account/" aria-label={auth.user ? "My account" : "Sign in"} className={`p-2 hover:text-gold-2 ${auth.user ? "text-gold-2" : ""}`}>
                <UserIcon />
              </Link>
            )}
            <Link href="/wishlist/" aria-label="Wishlist" className="relative hidden p-2 hover:text-gold-2 sm:block">
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
          <div className="mx-auto grid max-w-7xl grid-cols-[repeat(4,1fr)_1.2fr] gap-6 px-4 py-8">
            {categories.filter((c) => c.slug !== "combos").map((cat) => {
              const list = products.filter((p) => p.category === cat.slug).slice(0, 6);
              return (
                <div key={cat.slug}>
                  <Link
                    href={categoryHref(cat.slug)}
                    onClick={() => setMegaOpen(false)}
                    className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold hover:text-gold-2"
                  >
                    {cat.name}
                  </Link>
                  <ul className="mt-3 space-y-2 text-[14px] text-ink/85">
                    {list.map((p) => (
                      <li key={p.slug}>
                        <Link href={productHref(p)} onClick={() => setMegaOpen(false)} className="hover:text-ink">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <Link
              href="/combos/"
              onClick={() => setMegaOpen(false)}
              className="concrete flex flex-col justify-end border border-line p-5"
            >
              <span className="font-display text-xl font-semibold leading-tight">Combo কিনলে FREE gift</span>
              <span className="mt-1 text-sm text-muted">Complete routines that cost less than buying each product alone.</span>
              <span className="btn-gold mt-4 w-fit px-4 py-2.5 text-[12px]">Shop combos</span>
            </Link>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-b border-line bg-paper px-4 pb-6 pt-4 lg:hidden">
          {searchForm}
          <div className="mt-4 divide-y divide-line border-y border-line">
            {[
              ...mainNav,
              { href: "/products/", label: "Shop all" },
              { href: "/wishlist/", label: "Wishlist" },
              { href: "/orders/", label: "Track order" },
              ...(auth.enabled ? [{ href: "/account/", label: auth.user ? "My account" : "Sign in / Create account" }] : []),
            ].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="block py-3.5 font-display text-lg font-semibold">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
