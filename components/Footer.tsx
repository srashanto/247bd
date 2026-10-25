import Link from "next/link";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/store";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed">{STORE.tagline}.</p>
          <p className="mt-4 text-sm">Pay with cash on delivery, bKash or Nagad.</p>
        </div>
        <div>
          <h3 className="font-semibold text-paper">Shop</h3>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link href="/products/?for=him" className="hover:text-paper">For him</Link></li>
            <li><Link href="/products/?for=her" className="hover:text-paper">For her</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/?category=${c.slug}`} className="hover:text-paper">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-paper">Help</h3>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link href="/help/" className="hover:text-paper">Delivery & returns</Link></li>
            <li><Link href="/help/#payment" className="hover:text-paper">Payment</Link></li>
            <li><Link href="/orders/" className="hover:text-paper">My orders</Link></li>
            <li><Link href="/wishlist/" className="hover:text-paper">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-paper">Contact</h3>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><a href={`tel:${STORE.phone.replace(/-/g, "")}`} className="hover:text-paper">{STORE.phone}</a></li>
            <li><a href={`https://wa.me/${STORE.whatsapp}`} className="hover:text-paper">WhatsApp</a></li>
            <li><a href={`mailto:${STORE.email}`} className="hover:text-paper">{STORE.email}</a></li>
            <li>{STORE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-paper/60">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
