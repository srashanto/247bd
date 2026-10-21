"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/store";

export default function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/products/?q=${encodeURIComponent(q.trim())}`);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-brand-900 text-brand-100 text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex justify-between gap-4">
          <span>🚚 Cash on delivery all over Bangladesh</span>
          <span className="hidden sm:inline">📞 {STORE.phone} · 24/7 support</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3 sm:gap-6">
        <button
          className="md:hidden text-2xl"
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="rounded-lg bg-brand-600 px-2 py-1 text-lg font-black text-white">247</span>
          <span className="text-xl font-black text-brand-900">BD</span>
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-l-lg border border-slate-300 px-4 py-2 outline-none focus:border-brand-600"
          />
          <button className="rounded-r-lg bg-brand-600 px-5 text-white font-semibold hover:bg-brand-700">
            Search
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
          <Link href="/products/" className="hidden sm:inline hover:text-brand-600">Shop</Link>
          <Link href="/orders/" className="hidden sm:inline hover:text-brand-600">My Orders</Link>
          <Link href="/cart/" className="relative flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-2 hover:bg-brand-100">
            <span className="text-lg">🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="hidden md:block border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 flex gap-6 overflow-x-auto py-2 text-sm text-slate-600">
          {categories.map((c) => (
            <Link key={c.slug} href={`/products/?category=${c.slug}`} className="whitespace-nowrap hover:text-brand-600">
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 py-3 space-y-3">
          <form onSubmit={onSearch} className="flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-l-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-600"
            />
            <button className="rounded-r-lg bg-brand-600 px-4 text-white">Go</button>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/products/" onClick={() => setMenuOpen(false)} className="rounded bg-slate-50 p-2">🛍️ All products</Link>
            <Link href="/orders/" onClick={() => setMenuOpen(false)} className="rounded bg-slate-50 p-2">📦 My orders</Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products/?category=${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="rounded bg-slate-50 p-2"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
