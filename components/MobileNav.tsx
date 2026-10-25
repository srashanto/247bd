"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { BagIcon, SearchIcon } from "./Icons";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5.5 w-5.5" aria-hidden>
    <path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" />
  </svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5.5 w-5.5" aria-hidden>
    <rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" />
  </svg>
);
const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5.5 w-5.5" aria-hidden>
    <rect x="3" y="8" width="18" height="4" /><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4.5 7.5 8 12 8Zm0 0s1.5-4 4-3.5S16.5 8 12 8Z" />
  </svg>
);

/** Pages with their own sticky action bar on phones. */
function hidden(path: string) {
  return /^\/(products\/[^/]+|item|checkout)\/?$/.test(path) || path.startsWith("/item");
}

export default function MobileNav() {
  const path = usePathname() || "/";
  const { count } = useCart();
  if (hidden(path)) return null;

  const items = [
    { href: "/", label: "Home", icon: <HomeIcon />, on: path === "/" },
    { href: "/products/", label: "Shop", icon: <GridIcon />, on: path.startsWith("/products") },
    { href: "/products/?category=combos", label: "Combos", icon: <GiftIcon />, on: false },
    { href: "/orders/", label: "Track", icon: <SearchIcon className="h-5.5 w-5.5" />, on: path.startsWith("/orders") },
    {
      href: "/cart/",
      label: "Cart",
      on: path.startsWith("/cart"),
      icon: (
        <span className="relative">
          <BagIcon className="h-5.5 w-5.5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center bg-gold px-1 text-[10px] font-bold text-paper">{count}</span>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="h-16 md:hidden" aria-hidden />
      <nav
        aria-label="Quick links"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-[#0b0b0b]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium ${it.on ? "text-gold-2" : "text-ink/75"}`}
          >
            {it.icon}
            {it.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
