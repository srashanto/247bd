"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/store";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-paper" : "text-ink"}`}>
      247<span className="text-saffron">BD</span>
    </span>
  );
}

const mainNav = [
  { href: "/products/?for=him", label: "For him" },
  { href: "/products/?for=her", label: "For her" },
  { href: "/products/?category=combos", label: "Combos" },
  { href: "/products/", label: "Shop all" },
];

export default function Header() {
  const { count } = useCart();
  const { slugs } = useWishlist();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products/?q=${encodeURIComponent(q.trim())}`);
    setMenuOpen(false);
  }

  const search = (
    <form onSubmit={onSearch} role="search" className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search shampoo, beard oil, sunscreen…"
        aria-label="Search products"
        className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-[15px] outline-none focus:border-ink"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="bg-ink text-[13px] text-paper/85">
        <div className="mx-auto flex max-w-7xl justify-between gap-4 px-4 py-1.5">
          <span>Cash on delivery all over Bangladesh. Free delivery over ৳{STORE.freeDeliveryOver.toLocaleString("en-IN")}</span>
          <a href={`tel:${STORE.phone.replace(/-/g, "")}`} className="hidden hover:text-paper sm:inline">
            Call {STORE.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-8">
        <button className="-ml-1 p-1 lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link href="/" aria-label="247BD home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] font-medium lg:flex">
          {mainNav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-him">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden max-w-sm flex-1 md:block">{search}</div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/wishlist/" aria-label="Wishlist" className="relative rounded-full p-2.5 hover:bg-white">
            <HeartIcon />
            {slugs.length > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-her px-1 text-[11px] font-bold text-white">
                {slugs.length}
              </span>
            )}
          </Link>
          <Link href="/cart/" aria-label={`Cart, ${count} items`} className="relative flex items-center gap-2 rounded-full bg-ink py-2.5 pl-3.5 pr-4 text-paper hover:bg-him-deep">
            <BagIcon />
            <span className="text-sm font-semibold">{count}</span>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line px-4 pb-5 pt-4 lg:hidden">
          <div className="md:hidden">{search}</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {mainNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-white px-4 py-3 font-display font-semibold ring-1 ring-line"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {categories.filter((c) => c.slug !== "combos").map((c) => (
              <Link
                key={c.slug}
                href={`/products/?category=${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-line px-3 py-1.5"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/orders/" onClick={() => setMenuOpen(false)} className="rounded-full border border-line px-3 py-1.5">
              My orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
