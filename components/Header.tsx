"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";

export function Logo({ className = "text-[26px]", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`font-display font-black leading-none tracking-[0.02em] [font-stretch:125%] ${light ? "text-paper" : "text-ink"} ${className}`}>
      247<span className={light ? "text-punk" : "text-gold"}>BD</span>
    </span>
  );
}

const mainNav = [
  { href: "/products/", label: "All Product" },
  { href: "/perfume/", label: "Perfume" },
  { href: "/skin-care/", label: "Skin Care" },
  { href: "/hair-care/", label: "Hair Care" },
  { href: "/hair-styling/", label: "Hair Style" },
];

function Ticker({ items }: { items: string[] }) {
  if (!items.length) return null;
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden bg-punk text-[12px] font-bold text-ink">
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
  const { settings } = useCatalog();
  const auth = useAuth();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
        placeholder="Search perfume, skin care, hair clay…"
        aria-label="Search products"
        className="w-full border border-line bg-paper py-3 pl-10 pr-4 text-[15px] text-ink outline-none placeholder:text-muted focus:border-gold"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40">
      <Ticker items={settings.announcements} />

      <div className="pp-header">
        <div className="pp-container pp-header__inner">
          <div className="flex items-center gap-2">
            <button className="-ml-1 p-1 lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link href="/" aria-label="247BD home" className="shrink-0">
              <Logo light />
            </Link>
          </div>

          <nav className="pp-nav">
            {mainNav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap">{n.label}</Link>
            ))}
          </nav>

          <div className="col-start-3 flex items-center gap-0.5 sm:gap-1">
            <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="p-2">
              <SearchIcon />
            </button>
            <Link href="/wishlist/" aria-label="Wishlist" className="relative hidden p-2 sm:block">
              <HeartIcon />
              {slugs.length > 0 && <span className="pp-count">{slugs.length}</span>}
            </Link>
            {auth.enabled && (
              <Link href="/account/" aria-label={auth.user ? "My account" : "Sign in"} className="p-2">
                <UserIcon />
              </Link>
            )}
            <Link href="/cart/" aria-label={`Cart, ${count} items`} className="relative p-2">
              <BagIcon />
              <span className="pp-count">{count}</span>
            </Link>
          </div>
        </div>

        {searchOpen && <div className="pp-container pb-4">{searchForm}</div>}
      </div>

      {menuOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-b border-line bg-paper px-4 pb-6 pt-4 lg:hidden">
          {searchForm}
          <div className="mt-4 divide-y divide-line border-y border-line">
            {[
              ...mainNav,
              { href: "/combos/", label: "Combos" },
              { href: "/wishlist/", label: "Wishlist" },
              { href: "/orders/", label: "Track order" },
              ...(auth.enabled ? [{ href: "/account/", label: auth.user ? "My account" : "Sign in / Create account" }] : []),
            ].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="block py-3.5 font-display text-lg font-bold">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
