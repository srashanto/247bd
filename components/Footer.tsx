import Link from "next/link";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/store";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-24 overflow-hidden border-t border-line bg-[#060606] text-ink/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">
            Simple, effective grooming for men and women, delivered anywhere in Bangladesh.
          </p>
          <p className="mt-4 text-sm text-muted">Cash on delivery · bKash · Nagad</p>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/products/?for=him" className="hover:text-ink">Men</Link></li>
            <li><Link href="/products/?for=her" className="hover:text-ink">Women</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/?category=${c.slug}`} className="hover:text-ink">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Customer care</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/help/" className="hover:text-ink">Delivery</Link></li>
            <li><Link href="/help/#payment" className="hover:text-ink">Payment</Link></li>
            <li><Link href="/help/#returns" className="hover:text-ink">Returns</Link></li>
            <li><Link href="/orders/" className="hover:text-ink">My orders</Link></li>
            <li><Link href="/wishlist/" className="hover:text-ink">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><a href={`tel:${STORE.phone.replace(/-/g, "")}`} className="hover:text-ink">{STORE.phone}</a></li>
            <li><a href={`https://wa.me/${STORE.whatsapp}`} className="hover:text-ink">WhatsApp</a></li>
            <li><a href={`mailto:${STORE.email}`} className="hover:text-ink">{STORE.email}</a></li>
            <li>{STORE.address}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4" aria-hidden>
        <div className="select-none font-display text-[27vw] font-extrabold leading-[0.78] tracking-[-0.02em] text-ink/[0.05] [font-stretch:125%] lg:text-[21rem]">
          247BD
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-sm text-muted">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
